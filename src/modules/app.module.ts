import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
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
    TypeOrmModule.forRootAsync(typeORMConfig),
    WinstonModule.forRoot(winstonLoggerConfig),
    HealthModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    ErrorHandlerService,
  ],
})
export class AppModule {}
