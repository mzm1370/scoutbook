import type {
  ApiEnvelope,
  ApiErrorBody,
  ApiFailureResponse,
  ApiSuccessResponse,
} from '@scoutbook/types';
import { ApiError } from '@web/lib/api-error';

export function isApiSuccess<T>(
  body: unknown,
): body is ApiSuccessResponse<T> {
  return (
    typeof body === 'object' &&
    body !== null &&
    (body as ApiEnvelope<T>).success === true &&
    'data' in body
  );
}

export function isApiFailure(body: unknown): body is ApiFailureResponse {
  return (
    typeof body === 'object' &&
    body !== null &&
    (body as ApiFailureResponse).success === false &&
    'error' in body
  );
}

/** Unwrap `{ success: true, data }` or throw ApiError for failure/legacy shapes. */
export function unwrapApiData<T>(
  body: unknown,
  status: number,
  statusText: string,
): T {
  if (isApiSuccess<T>(body)) {
    return body.data;
  }

  if (isApiFailure(body)) {
    throw apiErrorFromBody(body.error, status);
  }

  // Legacy / non-envelope success body (should not happen after interceptor).
  if (status >= 200 && status < 300) {
    return body as T;
  }

  throw parseLegacyOrUnknownError(body, status, statusText);
}

export function apiErrorFromBody(error: ApiErrorBody, status?: number): ApiError {
  return new ApiError(error.message, status ?? error.statusCode, {
    code: error.code,
    details: error.details,
    body: error,
  });
}

export function parseLegacyOrUnknownError(
  raw: unknown,
  status: number,
  statusText: string,
): ApiError {
  if (raw && typeof raw === 'object') {
    const body = raw as {
      code?: ApiErrorBody['code'];
      details?: string[];
      message?: string | string[];
      error?: ApiErrorBody | string;
    };

    if (body.error && typeof body.error === 'object' && 'message' in body.error) {
      return apiErrorFromBody(body.error, status);
    }

    const msg = body.message;
    if (typeof msg === 'string') {
      return new ApiError(msg, status, {
        code: body.code,
        details: body.details,
        body: body as ApiErrorBody,
      });
    }

    if (Array.isArray(msg)) {
      const details = msg.filter((item: unknown): item is string => typeof item === 'string');
      return new ApiError(
        details.join(', ') || statusText || 'Request failed',
        status,
        {
          code: body.code ?? 'VALIDATION_ERROR',
          details,
        },
      );
    }
  }

  return new ApiError(statusText || 'Request failed', status);
}
