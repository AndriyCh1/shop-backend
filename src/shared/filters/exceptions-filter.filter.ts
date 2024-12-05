import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { AppHttpException } from '#shared/exceptions/app-http-exception';
import { ErrorHandlerService } from '#shared/utils/error-handler.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly errorHandler: ErrorHandlerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.errorHandler.handleError(exception);

    const { status, code } =
      exception instanceof AppHttpException
        ? { status: exception.getStatus(), code: exception.code }
        : { status: 500, code: 'UNKNOWN' };

    response.status(status).json({
      code,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: (exception as Error).message || 'Internal server error',
    });
  }
}
