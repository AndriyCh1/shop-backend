import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';

import { winstonLoggerConfig } from '#config/logger.config';
import { typeORMConfig } from '#config/typeorm.config';
import { HealthController } from '#modules/health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TerminusModule,
    TypeOrmModule.forRootAsync(typeORMConfig),
    WinstonModule.forRoot(winstonLoggerConfig),
  ],
  controllers: [HealthController],
})
export class AppModule {}
