import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';

import { winstonLoggerConfig } from '#config/logger.config';
import { typeORMConfig } from '#config/typeorm.config';
import { HealthController } from '#modules/health/health.controller';
import { AllExceptionsFilter } from '#shared/filters/exceptions-filter.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TerminusModule,
    TypeOrmModule.forRootAsync(typeORMConfig),
    WinstonModule.forRoot(winstonLoggerConfig),
  ],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
  controllers: [HealthController],
})
export class AppModule {}
