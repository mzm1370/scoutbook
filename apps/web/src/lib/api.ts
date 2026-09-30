import type {
  AdvanceFeatureStageRequest,
  AuthUser,
  CreateFeatureBugTriageRequest,
  CreateFeatureRequest,
  CreateScoutingEntryRequest,
  CreateFeatureRelationRequest,
  DecisionNeededItem,
  Feature,
  FeatureBugTriage,
  FeatureImplementationLog,
  FeatureRelation,
  FeatureReleaseLog,
  FeatureRfcCheck,
  FeatureReviewChecklist,
  FeatureStageHistory,
  FeatureTestingChecklist,
  LoginRequest,
  LoginResponse,
  RaciAssignment,
  RegisterRequest,
  ReplaceFeatureRaciRequest,
  ScoutingEntry,
  UpdateFeatureBugTriageRequest,
  UpdateScoutingEntryRequest,
  UpsertFeatureImplementationLogRequest,
  UpsertFeatureReleaseLogRequest,
  UpsertFeatureRfcCheckRequest,
  UpsertFeatureReviewChecklistRequest,
  UpsertFeatureTestingChecklistRequest,
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

  listStageHistory(token: string, id: number) {
    return httpClient.get<FeatureStageHistory[]>(
      `/features/${id}/stage-history`,
      token,
    );
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

export const implementationLogApi = {
  get(token: string, featureId: number) {
    return httpClient.get<FeatureImplementationLog>(
      `/features/${featureId}/implementation-log`,
      token,
      { silent: true },
    );
  },

  upsert(
    token: string,
    featureId: number,
    payload: UpsertFeatureImplementationLogRequest,
  ) {
    return httpClient.request<FeatureImplementationLog>(
      `/features/${featureId}/implementation-log`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      token,
    );
  },
};

export const testingChecklistApi = {
  get(token: string, featureId: number) {
    return httpClient.get<FeatureTestingChecklist>(
      `/features/${featureId}/testing-checklist`,
      token,
      { silent: true },
    );
  },

  upsert(
    token: string,
    featureId: number,
    payload: UpsertFeatureTestingChecklistRequest,
  ) {
    return httpClient.request<FeatureTestingChecklist>(
      `/features/${featureId}/testing-checklist`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      token,
    );
  },
};

export const reviewChecklistApi = {
  get(token: string, featureId: number) {
    return httpClient.get<FeatureReviewChecklist>(
      `/features/${featureId}/review-checklist`,
      token,
      { silent: true },
    );
  },

  upsert(
    token: string,
    featureId: number,
    payload: UpsertFeatureReviewChecklistRequest,
  ) {
    return httpClient.request<FeatureReviewChecklist>(
      `/features/${featureId}/review-checklist`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      token,
    );
  },
};

export const releaseLogApi = {
  get(token: string, featureId: number) {
    return httpClient.get<FeatureReleaseLog>(
      `/features/${featureId}/release-log`,
      token,
      { silent: true },
    );
  },

  upsert(
    token: string,
    featureId: number,
    payload: UpsertFeatureReleaseLogRequest,
  ) {
    return httpClient.request<FeatureReleaseLog>(
      `/features/${featureId}/release-log`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      token,
    );
  },
};

export const bugTriageApi = {
  list(token: string, featureId: number) {
    return httpClient.get<FeatureBugTriage[]>(
      `/features/${featureId}/bugs`,
      token,
    );
  },

  create(
    token: string,
    featureId: number,
    payload: CreateFeatureBugTriageRequest,
  ) {
    return httpClient.request<FeatureBugTriage>(
      `/features/${featureId}/bugs`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token,
    );
  },

  update(
    token: string,
    featureId: number,
    bugId: number,
    payload: UpdateFeatureBugTriageRequest,
  ) {
    return httpClient.request<FeatureBugTriage>(
      `/features/${featureId}/bugs/${bugId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      token,
    );
  },
};

export const decisionsNeededApi = {
  list(token: string) {
    return httpClient.get<DecisionNeededItem[]>('/decisions-needed', token);
  },
};

export const featureRelationsApi = {
  list(token: string) {
    return httpClient.get<FeatureRelation[]>('/feature-relations', token);
  },

  create(token: string, payload: CreateFeatureRelationRequest) {
    return httpClient.post<FeatureRelation>(
      '/feature-relations',
      payload,
      token,
    );
  },

  remove(token: string, id: number) {
    return httpClient.delete<FeatureRelation>(
      `/feature-relations/${id}`,
      token,
    );
  },
};
