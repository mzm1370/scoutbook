import type { ApiErrorBody } from '@scoutbook/types';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: string[];
  readonly body?: ApiErrorBody;

  constructor(
    message: string,
    status: number,
    options?: { code?: string; details?: string[]; body?: ApiErrorBody },
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = options?.code ?? 'HTTP_ERROR';
    this.details = options?.details;
    this.body = options?.body;
  }
}

export function parseErrorBody(
  raw: unknown,
  status: number,
  statusText: string,
): ApiError {
  if (raw && typeof raw === 'object') {
    const body = raw as {
      statusCode?: number;
      error?: string;
      code?: string;
      message?: string | string[];
      details?: string[];
      path?: string;
      timestamp?: string;
    };

    if (typeof body.message === 'string') {
      return new ApiError(body.message, status, {
        code: body.code,
        details: body.details,
        body: body as ApiErrorBody,
      });
    }

    if (Array.isArray(body.message)) {
      const details = body.message;
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
