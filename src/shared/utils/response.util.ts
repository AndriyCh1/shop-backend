export interface SuccessResponse {
  success: boolean;
  data: unknown;
  meta: unknown;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

export class ResponseUtil {
  static success(data: unknown, meta: unknown = null) {
    return {
      success: true,
      data,
      meta,
    };
  }

  static error(details: Omit<ErrorResponse, 'success'>) {
    return {
      success: false,
      ...details,
    };
  }
}
