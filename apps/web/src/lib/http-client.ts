import { ApiError } from '@web/lib/api-error';
import { unwrapApiData, parseLegacyOrUnknownError } from '@web/lib/api-envelope';
import {
  notifyApiError,
  type HttpRequestOptions,
} from '@web/lib/http-interceptor';

const DEFAULT_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

function notifyAndRethrow(error: unknown, silent?: boolean): never {
  notifyApiError(error, { silent });
  throw error;
}

/**
 * Shared HTTP client — all API calls go through this class so request
 * headers and response unwrapping stay uniform.
 */
export class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = DEFAULT_BASE) {
    this.baseUrl = baseUrl;
  }

  async request<T>(
    path: string,
    options: HttpRequestOptions = {},
    token?: string | null,
  ): Promise<T> {
    const { silent, headers: initHeaders, ...init } = options;
    const headers = new Headers(initHeaders);
    if (!headers.has('Content-Type') && init.body) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers,
      });
    } catch {
      return notifyAndRethrow(
        new ApiError('Network error — is the API running?', 0, {
          code: 'INTERNAL_ERROR',
        }),
        silent,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    let raw: unknown = null;
    const text = await response.text();
    if (text) {
      try {
        raw = JSON.parse(text) as unknown;
      } catch {
        raw = null;
      }
    }

    if (!response.ok) {
      return notifyAndRethrow(
        parseLegacyOrUnknownError(raw, response.status, response.statusText),
        silent,
      );
    }

    try {
      return unwrapApiData<T>(raw, response.status, response.statusText);
    } catch (error) {
      return notifyAndRethrow(error, silent);
    }
  }

  get<T>(path: string, token?: string | null, options?: HttpRequestOptions) {
    return this.request<T>(path, { ...options, method: 'GET' }, token);
  }

  post<T>(
    path: string,
    body: unknown,
    token?: string | null,
    options?: HttpRequestOptions,
  ) {
    return this.request<T>(
      path,
      {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
      },
      token,
    );
  }

  patch<T>(
    path: string,
    body: unknown,
    token?: string | null,
    options?: HttpRequestOptions,
  ) {
    return this.request<T>(
      path,
      {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(body),
      },
      token,
    );
  }

  delete<T>(path: string, token?: string | null, options?: HttpRequestOptions) {
    return this.request<T>(path, { ...options, method: 'DELETE' }, token);
  }
}

export const httpClient = new HttpClient();
