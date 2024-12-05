import { Injectable, Logger } from '@nestjs/common';

import { AppError } from '#shared/exceptions/app-error';
import { AppHttpException } from '#shared/exceptions/app-http-exception';

/**
 *  Centralized error-handling approach ensures consistency and better control over errors across
 *  various scenarios like HTTP requests, scheduled jobs, or startup processes.
 */
@Injectable()
export class ErrorHandlerService {
  private readonly logger = new Logger(ErrorHandlerService.name);

  handleError(error: unknown): void {
    if (error instanceof AppHttpException) {
      this.handleAppHttpException(error);
    } else if (error instanceof AppError) {
      this.handleAppError(error);
    } else {
      this.handleGenericError(error as Error);
    }
  }

  private handleAppHttpException(error: AppHttpException): void {
    this.logger.error(
      `Code: ${error.code}, Message: ${
        error.code
      }, Status: ${error.getStatus()}`,
      error.stack,
    );

    this.reportToMonitoring(error);
  }

  private handleAppError(error: AppError): void {
    this.logger.error(`Code: ${error.code}, Message: ${error.message}`);
    this.reportToMonitoring(error);
  }

  private handleGenericError(error: Error): void {
    this.logger.error(error.message, error.stack);
    this.reportToMonitoring(error);
  }

  private reportToMonitoring(error: Error): void {
    // Integrate with Sentry, CloudWatch, etc.
    // Sentry.captureException(error);
    console.error('Error reported to monitoring tool:', error.message);
  }
}
