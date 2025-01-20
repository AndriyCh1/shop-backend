import { DatabaseErrorCode as DatabaseErrorCode } from '#database/constants/database-error';

export const UNKNOWN_DB_ERROR_CODE = 'UNKNOWN_DB_ERROR_CODE';

export class DatabaseError extends Error {
  public code: string;
  public readonly details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export class ForeignKeyError extends DatabaseError {
  constructor(message?: string, details?: unknown) {
    super(
      DatabaseErrorCode.FOREIGN_KEY_VIOLATION,
      message ?? 'Foreign key constraint violated',
      details,
    );
  }
}

export class UniqueConstraintError extends DatabaseError {
  constructor(message?: string, details?: unknown) {
    super(
      DatabaseErrorCode.UNIQUE_VIOLATION,
      message ?? 'Unique constraint violated',
      details,
    );
  }
}

export class NotNullConstraintError extends DatabaseError {
  constructor(message?: string, details?: unknown) {
    super(
      DatabaseErrorCode.NOT_NULL_VIOLATION,
      message ?? 'Not null constraint violated',
      details,
    );
  }
}

export class CheckConstraintError extends DatabaseError {
  constructor(message?: string, details?: unknown) {
    super(
      DatabaseErrorCode.CHECK_VIOLATION,
      message ?? 'Check constraint violated',
      details,
    );
  }
}

export class ExclusionConstraintError extends DatabaseError {
  constructor(message?: string, details?: unknown) {
    super(
      DatabaseErrorCode.EXCLUSION_VIOLATION,
      message ?? 'Exclusion constraint violated',
      details,
    );
  }
}

export class InvalidTextRepresentationError extends DatabaseError {
  constructor(message?: string, details?: unknown) {
    super(
      DatabaseErrorCode.INVALID_TEXT_REPRESENTATION,
      message ?? 'Invalid text representation',
      details,
    );
  }
}

export class NumericValueOutOfRangeError extends DatabaseError {
  constructor(message?: string, details?: unknown) {
    super(
      DatabaseErrorCode.NUMERIC_VALUE_OUT_OF_RANGE,
      message ?? 'Numeric value out of range',
      details,
    );
  }
}

export class SyntaxErrorException extends DatabaseError {
  constructor(message?: string, details?: unknown) {
    super(
      DatabaseErrorCode.SYNTAX_ERROR,
      message ?? 'Syntax error in SQL query',
      details,
    );
  }
}

export class ConnectionException extends DatabaseError {
  constructor(message?: string, details?: unknown) {
    super(
      DatabaseErrorCode.CONNECTION_EXCEPTION,
      message ?? 'Database connection error',
      details,
    );
  }
}

export class GeneralDatabaseError extends DatabaseError {
  constructor(message?: string, details?: unknown) {
    super(
      UNKNOWN_DB_ERROR_CODE,
      message ?? 'An unexpected database error occurred',
      details,
    );
  }
}
