import type {
  AdvanceFeatureStageRequest,
  AuthUser,
  CreateFeatureRequest,
  CreateScoutingEntryRequest,
  Feature,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ScoutingEntry,
  UpdateScoutingEntryRequest,
} from '@scoutbook/types';
import { httpClient } from '@web/lib/http-client';

export { ApiError } from '@web/lib/api-error';
export { HttpClient, httpClient } from '@web/lib/http-client';
export { notifySuccess } from '@web/lib/http-interceptor';

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

  advanceStage(
    token: string,
    id: number,
    payload: AdvanceFeatureStageRequest,
  ) {
    return httpClient.patch<Feature>(`/features/${id}/stage`, payload, token);
  },
};

export const scoutingApi = {
  list(token: string, featureId: number) {
    return httpClient.get<ScoutingEntry[]>(
      `/features/${featureId}/scouting`,
      token,
    );
  },

  create(token: string, featureId: number, payload: CreateScoutingEntryRequest) {
    return httpClient.post<ScoutingEntry>(
      `/features/${featureId}/scouting`,
      payload,
      token,
    );
  },

  update(
    token: string,
    featureId: number,
    entryId: number,
    payload: UpdateScoutingEntryRequest,
  ) {
    return httpClient.patch<ScoutingEntry>(
      `/features/${featureId}/scouting/${entryId}`,
      payload,
      token,
    );
  },
};
