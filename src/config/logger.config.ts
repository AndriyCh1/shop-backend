import { WinstonModuleOptions } from 'nest-winston';
import winston from 'winston';

export const winstonLoggerConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss.SSS' }),
        winston.format.align(),
        winston.format.printf((info) => {
          const ctx = info.context ?? '';
          return `[${info.level.toUpperCase()}] ${info.timestamp} [${ctx}] ${
            info.message
          }`;
        }),
        winston.format.colorize({
          all: true,
          colors: {
            info: 'green blue',
            warn: 'italic yellow',
            error: 'bold red',
            debug: 'purple',
          },
        }),
      ),
    }),
  ],
  level: 'debug',
};
