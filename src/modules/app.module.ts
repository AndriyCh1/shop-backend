import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';

import { databaseConfig } from '#config/database.config';
import { winstonLoggerConfig } from '#config/logger.config';
import { HealthController } from '#modules/health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TerminusModule,
    TypeOrmModule.forRootAsync(databaseConfig),
    WinstonModule.forRoot(winstonLoggerConfig),
  ],
  controllers: [HealthController],
})
export class AppModule {}
