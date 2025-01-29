import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { MailingModule } from './mailing/mailing.module';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ParseTokenPipe } from './parseToken/parseToken';
import { APP_GUARD } from '@nestjs/core';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { validate } from './config/EnvironmentVariables';
import { FileModule } from './file/file.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production'],
      validate,
    }),
    // Mailing
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const transport = configService.getOrThrow<string>('MAIL_TRANSPORT');
        const from = configService.getOrThrow<string>('MAIL_FROM');
        AppModule.logger.debug(`MAIL_TRANSPORT: ${transport}`);
        AppModule.logger.debug(`MAIL_FROM: ${from}`);
        return {
          transport: transport,
          defaults: {
            from: from,
          },
          template: {
            dir: __dirname + '/mailing/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    // Throttler
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 256, // 256 requests per minute
      },
    ]),
    SeedModule.forRoot(),
    FileModule.forRootAsync(),
    UserModule,
    ProductModule,
    AuthModule.forRootAsync(),
    OrdersModule,
    MailingModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ParseTokenPipe,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  static readonly logger = new Logger(AppModule.name);
}
