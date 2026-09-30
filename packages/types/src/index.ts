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
  'IDEA',
  'SCOUTING',
  'RFC',
  'RACI',
  'IMPLEMENTATION',
  'TESTING',
  'REVIEW',
  'RELEASE',
];

/** Next stage in the fixed pipeline, or null if already RELEASE / unknown. */
export function nextFeatureStage(
  current: FeatureStage,
): FeatureStage | null {
  const index = FEATURE_STAGES.indexOf(current);
  if (index < 0 || index >= FEATURE_STAGES.length - 1) return null;
  return FEATURE_STAGES[index + 1] ?? null;
}

export function isImmediateNextStage(
  current: FeatureStage,
  target: FeatureStage,
): boolean {
  return nextFeatureStage(current) === target;
}

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

export interface AdvanceFeatureStageRequest {
  stage: FeatureStage;
}

/** Append-only stage move audit (RFC 0013). */
export interface FeatureStageHistory {
  id: number;
  featureId: number;
  /** null when the Feature was created at IDEA */
  fromStage: FeatureStage | null;
  toStage: FeatureStage;
  changedByUserId: number;
  createdAt: string;
}

/** Directed Feature link for the dependency graph (RFC 0014). */
export type FeatureRelationType = 'BLOCKS';

export const FEATURE_RELATION_TYPES: FeatureRelationType[] = ['BLOCKS'];

export interface FeatureRelation {
  id: number;
  /** Feature that blocks `toFeatureId` */
  fromFeatureId: number;
  /** Feature blocked by `fromFeatureId` */
  toFeatureId: number;
  type: FeatureRelationType;
  createdByUserId: number;
  createdAt: string;
}

export interface CreateFeatureRelationRequest {
  fromFeatureId: number;
  toFeatureId: number;
  type?: FeatureRelationType;
}

/** Workspace GitHub docs sync connection status (RFC 0015). Never includes token. */
export interface DocsSyncConnection {
  configured: boolean;
  repoUrl: string | null;
  hasToken: boolean;
  tokenLastFour: string | null;
  updatedAt: string | null;
  lastSyncAt: string | null;
  lastPrUrl: string | null;
}

export interface UpsertDocsSyncConnectionRequest {
  repoUrl: string;
  /** Required on first create; omit to keep existing encrypted token */
  token?: string;
}

export interface DocsSyncResult {
  prUrl: string;
  branch: string;
  filesWritten: number;
}

export const RISK_TIERS: RiskTier[] = ['P1', 'P2', 'P3'];

/** Request/response meta attached by API middleware/interceptor. */
export interface ApiMeta {
  path: string;
  timestamp: string;
  requestId?: string;
}

/** Uniform successful API response. */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: ApiMeta;
}

/** Stable API error payload (nested under failure envelope). */
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
  requestId?: string;
}

/** Uniform failed API response. */
export interface ApiFailureResponse {
  success: false;
  error: ApiErrorBody;
}

export type ApiEnvelope<T> = ApiSuccessResponse<T> | ApiFailureResponse;

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'HTTP_ERROR';


export type ScoutingStatus =
  | 'READY'
  | 'DECISION_REQUIRED'
  | 'INVESTIGATING'
  | 'BLOCKED';

export const SCOUTING_STATUSES: ScoutingStatus[] = [
  'READY',
  'DECISION_REQUIRED',
  'INVESTIGATING',
  'BLOCKED',
];

export interface ScoutingEntry {
  id: number;
  featureId: number;
  question: string;
  currentState: string;
  expected: string;
  decision: string;
  status: ScoutingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScoutingEntryRequest {
  question: string;
  currentState: string;
  expected: string;
  /** Optional; required when status is READY. */
  decision?: string;
  /** Defaults to INVESTIGATING. */
  status?: ScoutingStatus;
}

export interface UpdateScoutingEntryRequest {
  question?: string;
  currentState?: string;
  expected?: string;
  decision?: string;
  status?: ScoutingStatus;
}

/** Cross-feature inbox row (RFC 0012). */
export interface DecisionNeededItem {
  entryId: number;
  featureId: number;
  featureTitle: string;
  featureStage: FeatureStage;
  riskTier: RiskTier;
  question: string;
  currentState: string;
  expected: string;
  decision: string;
  status: 'DECISION_REQUIRED';
  updatedAt: string;
}

export type RfcCheckStatus =
  | 'NOT_CHECKED'
  | 'NOT_NEEDED'
  | 'NEEDED'
  | 'ACCEPTED';

export const RFC_CHECK_STATUSES: RfcCheckStatus[] = [
  'NOT_CHECKED',
  'NOT_NEEDED',
  'NEEDED',
  'ACCEPTED',
];

export interface FeatureRfcCheck {
  id: number;
  featureId: number;
  status: RfcCheckStatus;
  changesSharedApi: boolean;
  newArchitecture: boolean;
  multiAppImpact: boolean;
  summary: string;
  docPath: string;
  updatedByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertFeatureRfcCheckRequest {
  status: RfcCheckStatus;
  changesSharedApi: boolean;
  newArchitecture: boolean;
  multiAppImpact: boolean;
  summary?: string;
  docPath?: string;
}

export type RaciValue = 'R' | 'A' | 'C' | 'I' | '';

export const RACI_VALUES: RaciValue[] = ['', 'R', 'A', 'C', 'I'];

export interface RaciAssignment {
  id: number;
  featureId: number;
  stepName: string;
  poValue: RaciValue;
  pmValue: RaciValue;
  developerValue: RaciValue;
  qaValue: RaciValue;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface RaciAssignmentInput {
  stepName: string;
  poValue: RaciValue;
  pmValue: RaciValue;
  developerValue: RaciValue;
  qaValue: RaciValue;
  sortOrder?: number;
}

export interface ReplaceFeatureRaciRequest {
  rows: RaciAssignmentInput[];
}

export type ImplementationLogStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'READY_FOR_TEST';

export const IMPLEMENTATION_LOG_STATUSES: ImplementationLogStatus[] = [
  'NOT_STARTED',
  'IN_PROGRESS',
  'READY_FOR_TEST',
];

export interface FeatureImplementationLog {
  id: number;
  featureId: number;
  status: ImplementationLogStatus;
  summary: string;
  branchOrPr: string;
  notes: string;
  updatedByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertFeatureImplementationLogRequest {
  status: ImplementationLogStatus;
  summary?: string;
  branchOrPr?: string;
  notes?: string;
}

export type TestingChecklistStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'PASSED';

export const TESTING_CHECKLIST_STATUSES: TestingChecklistStatus[] = [
  'NOT_STARTED',
  'IN_PROGRESS',
  'PASSED',
];

export interface FeatureTestingChecklist {
  id: number;
  featureId: number;
  status: TestingChecklistStatus;
  unitOrIntegrationPassed: boolean;
  acceptanceValidated: boolean;
  noOpenDecisionRequired: boolean;
  summary: string;
  notes: string;
  updatedByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertFeatureTestingChecklistRequest {
  status: TestingChecklistStatus;
  unitOrIntegrationPassed: boolean;
  acceptanceValidated: boolean;
  noOpenDecisionRequired: boolean;
  summary?: string;
  notes?: string;
}

export type ReviewChecklistStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'APPROVED';

export const REVIEW_CHECKLIST_STATUSES: ReviewChecklistStatus[] = [
  'NOT_STARTED',
  'IN_PROGRESS',
  'APPROVED',
];

export interface FeatureReviewChecklist {
  id: number;
  featureId: number;
  status: ReviewChecklistStatus;
  acceptanceCriteriaMet: boolean;
  noOpenDecisionRequired: boolean;
  rfcResolved: boolean;
  testingEvidenceReviewed: boolean;
  docsUpdatedIfNeeded: boolean;
  summary: string;
  notes: string;
  updatedByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertFeatureReviewChecklistRequest {
  status: ReviewChecklistStatus;
  acceptanceCriteriaMet: boolean;
  noOpenDecisionRequired: boolean;
  rfcResolved: boolean;
  testingEvidenceReviewed: boolean;
  docsUpdatedIfNeeded: boolean;
  summary?: string;
  notes?: string;
}

export type ReleaseLogStatus =
  | 'NOT_STARTED'
  | 'SHIPPED'
  | 'OBSERVING'
  | 'STABLE';

export const RELEASE_LOG_STATUSES: ReleaseLogStatus[] = [
  'NOT_STARTED',
  'SHIPPED',
  'OBSERVING',
  'STABLE',
];

export interface FeatureReleaseLog {
  id: number;
  featureId: number;
  status: ReleaseLogStatus;
  summary: string;
  watchStarted: boolean;
  notes: string;
  updatedByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertFeatureReleaseLogRequest {
  status: ReleaseLogStatus;
  summary?: string;
  watchStarted: boolean;
  notes?: string;
}

export type BugTriageType = 'REGRESSION' | 'SCOUTING_GAP' | 'UNSURE';

export const BUG_TRIAGE_TYPES: BugTriageType[] = [
  'REGRESSION',
  'SCOUTING_GAP',
  'UNSURE',
];

export type BugTriageRisk = 'P1' | 'P2' | 'P3' | 'UNKNOWN';

export const BUG_TRIAGE_RISKS: BugTriageRisk[] = [
  'P1',
  'P2',
  'P3',
  'UNKNOWN',
];

export type BugTriageStatus = 'OPEN' | 'RESOLVED' | 'ESCALATED_TO_PO';

export const BUG_TRIAGE_STATUSES: BugTriageStatus[] = [
  'OPEN',
  'RESOLVED',
  'ESCALATED_TO_PO',
];

export interface FeatureBugTriage {
  id: number;
  featureId: number;
  whatHappened: string;
  expected: string;
  reproduce: string;
  bugType: BugTriageType;
  riskTier: BugTriageRisk;
  status: BugTriageStatus;
  createdByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureBugTriageRequest {
  whatHappened: string;
  expected: string;
  reproduce?: string;
  bugType: BugTriageType;
  riskTier?: BugTriageRisk;
  status?: BugTriageStatus;
}

export interface UpdateFeatureBugTriageRequest {
  whatHappened?: string;
  expected?: string;
  reproduce?: string;
  bugType?: BugTriageType;
  riskTier?: BugTriageRisk;
  status?: BugTriageStatus;
}

/** Default lifecycle steps used by POST .../raci/seed */
export const DEFAULT_RACI_STEPS: RaciAssignmentInput[] = [
  {
    stepName: 'Resolve open ambiguities',
    poValue: 'A',
    pmValue: 'C',
    developerValue: 'I',
    qaValue: 'I',
    sortOrder: 0,
  },
  {
    stepName: 'Approve the RFC',
    poValue: 'A',
    pmValue: 'C',
    developerValue: 'C',
    qaValue: 'I',
    sortOrder: 1,
  },
  {
    stepName: 'Implement it',
    poValue: 'I',
    pmValue: 'I',
    developerValue: 'R',
    qaValue: 'I',
    sortOrder: 2,
  },
  {
    stepName: 'Write / update tests',
    poValue: 'I',
    pmValue: 'I',
    developerValue: 'R',
    qaValue: 'R',
    sortOrder: 3,
  },
  {
    stepName: 'Validate acceptance criteria',
    poValue: 'I',
    pmValue: 'A',
    developerValue: 'C',
    qaValue: 'R',
    sortOrder: 4,
  },
  {
    stepName: 'Final sign-off for release',
    poValue: 'A',
    pmValue: 'A',
    developerValue: 'I',
    qaValue: 'R',
    sortOrder: 5,
  },
];

