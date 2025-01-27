import { DynamicModule, Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@server/user/user.module';
import { MailingModule } from '@server/mailing/mailing.module';
import { JwtModule } from '@nestjs/jwt';
import { MagicLinkEmailStrategy } from './strategies/magicLinkEmail.strategy';
import { JwtStrategy } from './strategies/JWT.strategy';

@Module({
  //controllers: [AuthController],
  //providers: [AuthService],
})
export class AuthModule {
  static forRootAsync(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        UserModule,
        ConfigModule.forRoot(),
        MailingModule,
        JwtModule.registerAsync({
          inject: [ConfigService],
          imports: [ConfigModule],
          useFactory: async (config: ConfigService) => {
            const JWT_SECRET = config.get('JWT_SECRET');
            const JWT_EXPIRES_IN = config.get('JWT_EXPIRES_IN');

            if (!JWT_SECRET) {
              Logger.error('JWT_SECRET is not set');
              throw new Error('JWT_SECRET is not set');
            }

            if (!JWT_EXPIRES_IN) {
              Logger.warn('JWT_EXPIRES_IN is not set, using default of 60s');
            }

            return {
              secret: JWT_SECRET,
              signOptions: { expiresIn: JWT_EXPIRES_IN || '60s' },
            };
          },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        ConfigService,
        MagicLinkEmailStrategy,
        JwtStrategy,
        {
          inject: [ConfigService],
          provide: 'COOKIE_EXPIRES_IN',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('COOKIE_EXPIRES_IN'),
        },
        {
          inject: [ConfigService],
          provide: 'SERVER_URL',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('SERVER_URL'),
        },
        {
          inject: [ConfigService],
          provide: 'MAGIC_LINK_SECRET',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('MAGIC_LINK_SECRET'),
        },
        {
          inject: [ConfigService],
          provide: 'FRONTEND_URL',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('FRONTEND_URL'),
        },
        {
          inject: [ConfigService],
          provide: 'JWT_SECRET',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('JWT_SECRET'),
        },
        {
          inject: [ConfigService],
          provide: 'JWT_EXPIRES_IN',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('JWT_EXPIRES_IN'),
        },
        {
          inject: [ConfigService],
          provide: 'JWT_REFRESH_SECRET',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
        {
          inject: [ConfigService],
          provide: 'JWT_REFRESH_EXPIRES_IN',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'),
        },
        {
          inject: [ConfigService],
          provide: 'APP_DOMAIN',
          useFactory: (configService: ConfigService) =>
            configService.get<string>('APP_DOMAIN'),
        },
      ],
      exports: [AuthService],
    };
  }
}
