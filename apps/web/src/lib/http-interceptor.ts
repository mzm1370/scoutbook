import { toast } from 'sonner';
import { ApiError } from './api-error';

export type HttpRequestOptions = RequestInit & {
  /** Skip the global error toast (e.g. expected 401 on session restore). */
  silent?: boolean;
};

/**
 * Response/error interceptor: show a toast for every failed API call
 * unless `silent: true` was passed.
 */
export function notifyApiError(error: unknown, options?: { silent?: boolean }) {
  if (options?.silent) return;

  if (error instanceof ApiError) {
    const description =
      error.details?.length && error.code === 'VALIDATION_ERROR'
        ? error.details.slice(0, 3).join('\n')
        : undefined;

    toast.error(error.message, {
      description,
      duration: error.status >= 500 || error.status === 0 ? 6000 : 4000,
    });
    return;
  }

  toast.error(error instanceof Error ? error.message : 'Something went wrong');
}

export function notifySuccess(message: string, description?: string) {
  toast.success(message, { description });
}
