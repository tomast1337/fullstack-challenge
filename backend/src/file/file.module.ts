import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FileService } from './file.service';

@Module({})
export class FileModule {
  static forRootAsync(): DynamicModule {
    return {
      module: FileModule,
      imports: [ConfigModule.forRoot()],
      providers: [
        {
          provide: 'S3_PICTURE_BUCKET',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('S3_PICTURE_BUCKET'),
          inject: [ConfigService],
        },
        {
          provide: 'S3_KEY',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('S3_KEY'),
          inject: [ConfigService],
        },
        {
          provide: 'S3_SECRET',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('S3_SECRET'),

          inject: [ConfigService],
        },
        {
          provide: 'S3_ENDPOINT',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('S3_ENDPOINT'),
          inject: [ConfigService],
        },
        {
          provide: 'S3_REGION',
          useFactory: (configService: ConfigService) =>
            configService.getOrThrow<string>('S3_REGION'),
          inject: [ConfigService],
        },
        FileService,
      ],
      exports: [FileService],
    };
  }
}
