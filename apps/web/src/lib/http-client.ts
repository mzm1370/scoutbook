import { ApiError } from '@web/lib/api-error';
import { unwrapApiData, parseLegacyOrUnknownError } from '@web/lib/api-envelope';
import {
  notifyApiError,
  type HttpRequestOptions,
} from '@web/lib/http-interceptor';

const DEFAULT_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

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

    try {
      let response: Response;
      try {
        response = await fetch(`${this.baseUrl}${path}`, {
          ...init,
          headers,
        });
      } catch {
        throw new ApiError('Network error — is the API running?', 0, {
          code: 'INTERNAL_ERROR',
        });
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
        throw parseLegacyOrUnknownError(
          raw,
          response.status,
          response.statusText,
        );
      }

      return unwrapApiData<T>(raw, response.status, response.statusText);
    } catch (error) {
      notifyApiError(error, { silent });
      throw error;
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
}

export const httpClient = new HttpClient();
