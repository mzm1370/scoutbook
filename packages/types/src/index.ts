export type UserRole = 'PO' | 'PM' | 'DEVELOPER' | 'QA';

export const USER_ROLES: UserRole[] = ['PO', 'PM', 'DEVELOPER', 'QA'];

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type RiskTier = 'P1' | 'P2' | 'P3';

export type FeatureStage =
    | 'IDEA'
    | 'SCOUTING'
    | 'RFC'
    | 'RACI'
    | 'IMPLEMENTATION'
    | 'TESTING'
    | 'REVIEW'
    | 'RELEASE';

export const FEATURE_STAGES: FeatureStage[] = [
    'IDEA', 'SCOUTING', 'RFC', 'RACI', 'IMPLEMENTATION', 'TESTING', 'REVIEW', 'RELEASE',
];

export interface Feature {
  id: number;
  title: string;
  problem: string;
  riskTier: RiskTier;
  currentStage: FeatureStage;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureRequest {
  title: string;
  problem: string;
  riskTier: RiskTier;
}

export const RISK_TIERS: RiskTier[] = ['P1', 'P2', 'P3'];

/** Stable API error envelope (all HTTP errors). */
export interface ApiErrorBody {
  statusCode: number;
  /** Short HTTP reason / category label (e.g. "Bad Request"). */
  error: string;
  /** Machine-readable code for clients. */
  code: ApiErrorCode;
  /** Always a single human-readable string for UI display. */
  message: string;
  /** Field/constraint messages when validation fails. */
  details?: string[];
  path: string;
  timestamp: string;
}

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'HTTP_ERROR';


export type ScoutingStatus = 'NOT_DECIDED' | 'DECISION_REQUIRED' | 'READY';

export interface ScoutingEntry {
    id: number;
    featureId: number;
    question: string;
    currentState: string;
    expected: string;
    decision: string;
    status: ScoutingStatus;
}

export type RaciValue = 'R' | 'A' | 'C' | 'I' | '';

export interface RaciAssignment {
    id: number;
    featureId: number;
    stepName: string;
    poValue: RaciValue;
    pmValue: RaciValue;
    developerValue: RaciValue;
    qaValue: RaciValue;
}

