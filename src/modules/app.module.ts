import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';

import { winstonLoggerConfig } from '#config/logger.config';
import { typeORMConfig } from '#config/typeorm.config';
import { HealthModule } from '#modules/health/health.module';
import { AllExceptionsFilter } from '#shared/filters/exceptions-filter.filter';
import { ErrorHandlerService } from '#shared/utils/error-handler.util';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot(winstonLoggerConfig),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            limit: configService.get<number>('THROTTLER_LIMIT'),
            ttl: configService.get<number>('THROTTLER_TTL'),
          },
        ],
        storage: new ThrottlerStorageRedisService({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        }),
      }),
    }),
    HealthModule,
    TypeOrmModule.forRootAsync(typeORMConfig),
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    ErrorHandlerService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
