import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { DatabaseError } from '#database/database-errors';

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
    if (error instanceof DatabaseError) {
      return this.handDatabaseError(error);
    }

    if (error instanceof HttpException) {
      return this.handleAppHttpException(error);
    }

    return this.handleError(error as Error);
  }

  private handleAppHttpException(error: HttpException): ErrorData {
    this.logger.error(error);

    return {
      message: error.message,
      status: error.getStatus(),
    };
  }

  private handleError(error: Error): ErrorData {
    this.logger.error(error);

    this.reportToMonitoring(error);

    return {
      message: error.message,
    };
  }

  private handDatabaseError(error: DatabaseError): ErrorData {
    this.logger.error(error);

    const errorToStatusMapping: Record<string, HttpStatus> = {
      ForeignKeyError: HttpStatus.CONFLICT,
      UniqueConstraintError: HttpStatus.CONFLICT,
      NotNullConstraintError: HttpStatus.BAD_REQUEST,
      CheckConstraintError: HttpStatus.BAD_REQUEST,
      ExclusionConstraintError: HttpStatus.BAD_REQUEST,
      InvalidTextRepresentationError: HttpStatus.BAD_REQUEST,
      NumericValueOutOfRangeError: HttpStatus.BAD_REQUEST,
      SyntaxErrorException: HttpStatus.BAD_REQUEST,
      ConnectionException: HttpStatus.SERVICE_UNAVAILABLE,
      GeneralDatabaseError: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    const errorName = error.constructor.name;

    const status =
      errorToStatusMapping[errorName] || HttpStatus.INTERNAL_SERVER_ERROR;

    const message = error.message ?? 'An unexpected database error occurred';

    return { status, message };
  }

  private reportToMonitoring(_: Error) {
    // Integrate with Sentry, CloudWatch, etc.
    // Sentry.captureException(error);
    // console.error('Error reported to monitoring tool:', error.message);
  }
}
