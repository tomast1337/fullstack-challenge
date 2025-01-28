import { plainToInstance } from 'class-transformer';
import { IsEnum, IsOptional, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV?: Environment;

  // Email magic link auth
  @IsString()
  MAGIC_LINK_SECRET: string;

  // jwt auth
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;

  @IsString()
  COOKIE_EXPIRES_IN: string;

  // database
  @IsString()
  DATABASE_URL: string;

  @IsString()
  SERVER_URL: string;

  @IsString()
  FRONTEND_URL: string;

  @IsString()
  @IsOptional()
  APP_DOMAIN: string = 'localhost';

  // s3
  @IsString()
  S3_ENDPOINT: string;

  @IsString()
  S3_PICTURE_BUCKET: string;

  @IsString()
  S3_KEY: string;

  @IsString()
  S3_SECRET: string;

  @IsString()
  S3_REGION: string;

  // mail
  @IsString()
  MAIL_TRANSPORT: string;

  @IsString()
  MAIL_FROM: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      errors.map((error) => Object.values(error.constraints)).join('\n\n'),
    );
  }

  return validatedConfig;
};
