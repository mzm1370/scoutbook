import type { ApiErrorBody } from '@scoutbook/types';

/** Typed client-side HTTP failure (toasts, forms, callers). */
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
