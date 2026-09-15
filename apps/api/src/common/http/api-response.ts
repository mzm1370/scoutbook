import type {
  ApiErrorBody,
  ApiErrorCode,
  ApiFailureResponse,
  ApiMeta,
  ApiSuccessResponse,
} from '@scoutbook/types';

/** Shared builders for the uniform API envelope (backend + docs). */
export class ApiResponse {
  static meta(path: string, requestId?: string): ApiMeta {
    return {
      path,
      timestamp: new Date().toISOString(),
      ...(requestId ? { requestId } : {}),
    };
  }

  static success<T>(
    data: T,
    path: string,
    requestId?: string,
  ): ApiSuccessResponse<T> {
    return {
      success: true,
      data,
      meta: ApiResponse.meta(path, requestId),
    };
  }

  static failure(
    error: Omit<ApiErrorBody, 'path' | 'timestamp' | 'requestId'> &
      Partial<Pick<ApiErrorBody, 'path' | 'timestamp' | 'requestId'>>,
    path: string,
    requestId?: string,
  ): ApiFailureResponse {
    return {
      success: false,
      error: {
        ...error,
        path: error.path ?? path,
        timestamp: error.timestamp ?? new Date().toISOString(),
        ...(requestId || error.requestId
          ? { requestId: requestId ?? error.requestId }
          : {}),
      },
    };
  }

  static codeForStatus(
    statusCode: number,
    details?: string[],
  ): ApiErrorCode {
    if (statusCode === 400 && details?.length) return 'VALIDATION_ERROR';
    switch (statusCode) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 500:
        return 'INTERNAL_ERROR';
      default:
        return 'HTTP_ERROR';
    }
  }

  static normalizeMessage(
    raw: string | object,
    fallback: string,
  ): { message: string; details?: string[] } {
    if (typeof raw === 'string') {
      return { message: raw };
    }

    const payload = raw as { message?: string | string[] };
    if (Array.isArray(payload.message)) {
      const details = payload.message.filter(Boolean);
      return {
        message: 'Validation failed',
        details: details.length ? details : undefined,
      };
    }
    if (typeof payload.message === 'string' && payload.message.length > 0) {
      return { message: payload.message };
    }
    return { message: fallback || 'Request failed' };
  }

  static isEnvelope(value: unknown): boolean {
    return (
      typeof value === 'object' &&
      value !== null &&
      'success' in value &&
      typeof (value as { success: unknown }).success === 'boolean'
    );
  }
}
