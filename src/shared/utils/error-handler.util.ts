import { HttpException, Injectable, Logger } from '@nestjs/common';

export interface ErrorData {
  message: string;
  status?: number;
}
/**
 *  Centralized error-handling approach ensures consistency and better control over errors across
 *  various scenarios like HTTP requests, scheduled jobs, or startup processes.
 */
@Injectable()
export class ErrorHandlerService {
  private readonly logger = new Logger(ErrorHandlerService.name);

  handle(error: unknown): ErrorData {
    if (error instanceof HttpException) {
      return this.handleAppHttpException(error);
    }

    return this.handleError(error as Error);
  }

  private handleAppHttpException(error: HttpException): ErrorData {
    this.logger.error(
      `HTTP_EXCEPTION: Message: ${error.message}, Status: ${error.getStatus()}`,
      error.stack,
    );

    this.reportToMonitoring(error);

    return {
      message: error.message,
      status: error.getStatus(),
    };
  }

  private handleError(error: Error): ErrorData {
    this.logger.error(`ERROR: Message: ${error.message}`);
    this.reportToMonitoring(error);

    return {
      message: error.message,
    };
  }

  private reportToMonitoring(error: Error) {
    // Integrate with Sentry, CloudWatch, etc.
    // Sentry.captureException(error);
    console.error('Error reported to monitoring tool:', error.message);
  }
}
