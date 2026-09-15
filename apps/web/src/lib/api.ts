import type {
  AuthUser,
  CreateFeatureRequest,
  Feature,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '@scoutbook/types';
import { ApiError, parseErrorBody } from './api-error';
import {
  notifyApiError,
  type HttpRequestOptions,
} from './http-interceptor';

export { ApiError } from './api-error';
export { notifySuccess } from './http-interceptor';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request<T>(
  path: string,
  options: HttpRequestOptions = {},
  token?: string | null,
): Promise<T> {
  const { silent, ...init } = options;
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    let response: Response;
    try {
      response = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers,
      });
    } catch {
      throw new ApiError('Network error — is the API running?', 0, {
        code: 'INTERNAL_ERROR',
      });
    }

    if (!response.ok) {
      let raw: unknown;
      try {
        raw = await response.json();
      } catch {
        raw = null;
      }
      throw parseErrorBody(raw, response.status, response.statusText);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    notifyApiError(error, { silent });
    throw error;
  }
}

export const authApi = {
  register(payload: RegisterRequest) {
    return request<AuthUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login(payload: LoginRequest) {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  me(token: string) {
    return request<AuthUser>(
      '/auth/me',
      { method: 'GET', silent: true },
      token,
    );
  },
};

export const featuresApi = {
  list(token: string) {
    return request<Feature[]>('/features', { method: 'GET' }, token);
  },

  get(token: string, id: number) {
    return request<Feature>(`/features/${id}`, { method: 'GET' }, token);
  },

  create(token: string, payload: CreateFeatureRequest) {
    return request<Feature>(
      '/features',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token,
    );
  },
};
