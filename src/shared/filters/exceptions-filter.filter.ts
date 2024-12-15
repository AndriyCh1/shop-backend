import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { ErrorHandlerService } from '#shared/utils/error-handler.util';
import { ResponseUtil } from '#shared/utils/response.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly errorHandler: ErrorHandlerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const { status = 500, message } = this.errorHandler.handle(exception);

    response.status(status).json(
      ResponseUtil.error({
        message: message || 'Internal server error',
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      }),
    );
  }
}
