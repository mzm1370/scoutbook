import type {
  AdvanceFeatureStageRequest,
  AuthUser,
  CreateFeatureRequest,
  CreateScoutingEntryRequest,
  Feature,
  FeatureRfcCheck,
  LoginRequest,
  LoginResponse,
  RaciAssignment,
  RegisterRequest,
  ReplaceFeatureRaciRequest,
  ScoutingEntry,
  UpdateScoutingEntryRequest,
  UpsertFeatureRfcCheckRequest,
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

export const rfcCheckApi = {
  get(token: string, featureId: number) {
    return httpClient.get<FeatureRfcCheck>(
      `/features/${featureId}/rfc-check`,
      token,
      { silent: true },
    );
  },

  upsert(
    token: string,
    featureId: number,
    payload: UpsertFeatureRfcCheckRequest,
  ) {
    return httpClient.request<FeatureRfcCheck>(
      `/features/${featureId}/rfc-check`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      token,
    );
  },
};

export const raciApi = {
  list(token: string, featureId: number) {
    return httpClient.get<RaciAssignment[]>(
      `/features/${featureId}/raci`,
      token,
    );
  },

  seed(token: string, featureId: number) {
    return httpClient.post<RaciAssignment[]>(
      `/features/${featureId}/raci/seed`,
      {},
      token,
    );
  },

  replace(
    token: string,
    featureId: number,
    payload: ReplaceFeatureRaciRequest,
  ) {
    return httpClient.request<RaciAssignment[]>(
      `/features/${featureId}/raci`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      token,
    );
  },
};
