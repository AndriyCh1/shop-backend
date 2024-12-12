import { cleanEnv, num, str } from 'envalid';

export const validateEnv = () => {
  return cleanEnv(process.env, {
    SERVER_PORT: num(),
    DATABASE_HOST: str(),
    DATABASE_PASSWORD: str(),
    DATABASE_USER: str(),
    DATABASE_NAME: str(),
    DATABASE_PORT: str(),
    THROTTLER_LIMIT: num(),
    THROTTLER_TTL: num(),
    REDIS_HOST: str(),
    REDIS_PORT: str(),
    REDIS_PASSWORD: str(),
    JWT_ACCESS_TOKEN_SECRET: str(),
    JWT_REFRESH_TOKEN_SECRET: str(),
    JWT_ACCESS_TOKEN_EXPIRATION: str(),
    JWT_REFRESH_TOKEN_EXPIRATION: str(),
    AWS_S3_REGION: str(),
    AWS_S3_BUCKET_NAME: str(),
    AWS_S3_ACCESS_KEY: str(),
    AWS_S3_SECRET_KEY: str(),
    CLOUDFRONT_DOMAIN: str(),
  });
};
