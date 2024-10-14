import { cleanEnv, num, str } from 'envalid';

export const validateEnv = () => {
  return cleanEnv(process.env, {
    SERVER_PORT: num(),
    DATABASE_HOST: str(),
    DATABASE_PASSWORD: str(),
    DATABASE_USER: str(),
    DATABASE_NAME: str(),
    DATABASE_PORT: str(),
  });
};
