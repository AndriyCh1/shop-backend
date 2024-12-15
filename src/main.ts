import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from '#modules/app.module';
import { ResponseInterceptor } from '#shared/interceptors/response.interceptor';
import { CustomValidationPipe } from '#shared/pipes/custom-validation.pipe';
import { validateEnv } from '#shared/utils/validate-env.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });

  // app.use('/payments/webhook', raw({ type: '*/*' }));

  app.useGlobalPipes(new CustomValidationPipe());

  app.useGlobalInterceptors(new ResponseInterceptor());

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  validateEnv();

  const port = configService.get('SERVER_PORT');
  await app.listen(port);
}

bootstrap();
