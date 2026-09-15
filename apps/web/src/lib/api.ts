import type {
  AuthUser,
  CreateFeatureRequest,
  Feature,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '@scoutbook/types';
import { httpClient } from './http-client';

export { ApiError } from './api-error';
export { HttpClient, httpClient } from './http-client';
export { notifySuccess } from './http-interceptor';

export const authApi = {
  register(payload: RegisterRequest) {
    return httpClient.post<AuthUser>('/auth/register', payload);
  },

  login(payload: LoginRequest) {
    return httpClient.post<LoginResponse>('/auth/login', payload);
  },

  me(token: string) {
    return httpClient.get<AuthUser>('/auth/me', token, { silent: true });
  },
};

export const featuresApi = {
  list(token: string) {
    return httpClient.get<Feature[]>('/features', token);
  },

  get(token: string, id: number) {
    return httpClient.get<Feature>(`/features/${id}`, token);
  },

  create(token: string, payload: CreateFeatureRequest) {
    return httpClient.post<Feature>('/features', payload, token);
  },
};
