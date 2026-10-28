import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability';

export type UserRole =
  | 'PO'
  | 'PM'
  | 'DEVELOPER'
  | 'QA'
  | 'DESIGNER'
  | 'TECH_LEAD';

export const USER_ROLES: UserRole[] = [
  'PO',
  'PM',
  'DEVELOPER',
  'QA',
  'DESIGNER',
  'TECH_LEAD',
];

/** CASL subjects for Scoutbook v1 (RFC 0019). */
export type AppSubject =
  | 'Feature'
  | 'ScoutingEntry'
  | 'RfcCheck'
  | 'RfcDocument'
  | 'Raci'
  | 'ImplementationLog'
  | 'TestingChecklist'
  | 'ReviewChecklist'
  | 'ReleaseLog'
  | 'Bug'
  | 'FeatureRelation'
  | 'DocsSync'
  | 'TestInventory'
  | 'UxDesign'
  | 'TestPlan'
  | 'all';

export type AppAction =
  | 'read'
  | 'create'
  | 'update'
  | 'manage'
  | 'advance'
  | 'accept';

export type AppAbility = MongoAbility<[AppAction, AppSubject]>;

const STAGE_ARTIFACTS = [
  'ScoutingEntry',
  'ImplementationLog',
  'TestingChecklist',
  'ReviewChecklist',
  'ReleaseLog',
  'Bug',
  'UxDesign',
  'TestPlan',
] as const satisfies readonly AppSubject[];

/**
 * Pure ability factory shared by API and web (RFC 0019).
 * Role-based only — not RACI letter ACL.
 */
export function defineAbilitiesFor(role: UserRole): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  can('read', 'all');

  for (const subject of STAGE_ARTIFACTS) {
    can('update', subject);
  }

  can('update', 'RfcCheck');
  can('update', 'RfcDocument');

  if (role === 'PO' || role === 'PM' || role === 'TECH_LEAD') {
    can('advance', 'Feature');
    can('update', 'Feature');
    can('manage', 'Raci');
    can('accept', 'RfcCheck');
    can('accept', 'RfcDocument');
    can('manage', 'FeatureRelation');
    can('manage', 'TestInventory');
  }

  if (role === 'PO') {
    can('create', 'Feature');
    can('manage', 'DocsSync');
  }

  return build();
}

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

/** Ceremony track: Light = no written RFC; RFC = design doc required (RFC 0022). */
export type FeatureProcessTrack = 'LIGHT' | 'RFC';

export const FEATURE_PROCESS_TRACKS: FeatureProcessTrack[] = ['LIGHT', 'RFC'];

/** Suggest track from risk — P1/P2 → RFC, P3 → LIGHT. */
export function suggestedProcessTrack(
  riskTier: RiskTier,
): FeatureProcessTrack {
  return riskTier === 'P3' ? 'LIGHT' : 'RFC';
}

/** P1 cannot use Light track. Returns error message or null if OK. */
export function assertProcessTrackAllowed(
  track: FeatureProcessTrack,
  riskTier: RiskTier,
): string | null {
  if (riskTier === 'P1' && track === 'LIGHT') {
    return 'P1 risk requires RFC process track';
  }
  return null;
}

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
  processTrack: FeatureProcessTrack;
  currentStage: FeatureStage;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureRequest {
  title: string;
  problem: string;
  riskTier: RiskTier;
  processTrack: FeatureProcessTrack;
}

/** PO/PM may update track/risk before Implementation (RFC 0022). */
export interface UpdateFeatureRequest {
  riskTier?: RiskTier;
  processTrack?: FeatureProcessTrack;
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

/**
 * Fixed scouting checklist prompts (RFC 0024 / Testing Scouting Assessment).
 * Seed inserts any missing questions as INVESTIGATING rows.
 */
export const DEFAULT_SCOUTING_CHECKLIST_QUESTIONS: readonly string[] = [
  'What does it do today?',
  'What should it do?',
  'Who uses it?',
  'What breaks if it fails?',
  'Is it business critical?',
  'Which test type is required? (Unit / Integration / E2E)',
  'Is it shared across pages?',
  'Does it affect API requests?',
] as const;

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

/** Result of POST .../scouting/seed (RFC 0024). */
export interface SeedScoutingChecklistResult {
  seeded: boolean;
  added: number;
  rows: ScoutingEntry[];
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

/** Cross-feature ambiguity table row (RFC 0023) — any scouting status. */
export interface AmbiguityTrackingItem {
  entryId: number;
  featureId: number;
  featureTitle: string;
  featureStage: FeatureStage;
  riskTier: RiskTier;
  question: string;
  currentState: string;
  expected: string;
  decision: string;
  status: ScoutingStatus;
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

/** UX / interface design capture (RFC 0028) — not a new Kanban stage. */
export type UxDesignStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'READY'
  | 'NOT_NEEDED';

export const UX_DESIGN_STATUSES: UxDesignStatus[] = [
  'NOT_STARTED',
  'IN_PROGRESS',
  'READY',
  'NOT_NEEDED',
];

export interface FeatureUxDesign {
  id: number;
  featureId: number;
  status: UxDesignStatus;
  happyPathCovered: boolean;
  emptyStateCovered: boolean;
  loadingStateCovered: boolean;
  errorStateCovered: boolean;
  summary: string;
  mockupPath: string;
  notes: string;
  updatedByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertFeatureUxDesignRequest {
  status: UxDesignStatus;
  happyPathCovered: boolean;
  emptyStateCovered: boolean;
  loadingStateCovered: boolean;
  errorStateCovered: boolean;
  summary?: string;
  mockupPath?: string;
  notes?: string;
}

/** Up-front Unit/Integration/E2E plan before Implementation (RFC 0029). */
export type TestPlanStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'READY'
  | 'NOT_NEEDED';

export const TEST_PLAN_STATUSES: TestPlanStatus[] = [
  'NOT_STARTED',
  'IN_PROGRESS',
  'READY',
  'NOT_NEEDED',
];

export interface FeatureTestPlan {
  id: number;
  featureId: number;
  status: TestPlanStatus;
  unitPlanned: boolean;
  integrationPlanned: boolean;
  e2ePlanned: boolean;
  summary: string;
  notes: string;
  updatedByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertFeatureTestPlanRequest {
  status: TestPlanStatus;
  unitPlanned: boolean;
  integrationPlanned: boolean;
  e2ePlanned: boolean;
  summary?: string;
  notes?: string;
}

/** Structured in-app RFC body when check says Needed/Accepted (RFC 0016). */
export type RfcDocumentStatus = 'DRAFT' | 'ACCEPTED' | 'REJECTED';

export const RFC_DOCUMENT_STATUSES: RfcDocumentStatus[] = [
  'DRAFT',
  'ACCEPTED',
  'REJECTED',
];

export interface FeatureRfcDocument {
  id: number;
  featureId: number;
  status: RfcDocumentStatus;
  summary: string;
  motivation: string;
  detailedDesign: string;
  alternatives: string;
  drawbacks: string;
  updatedByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertFeatureRfcDocumentRequest {
  status: RfcDocumentStatus;
  summary?: string;
  motivation?: string;
  detailedDesign?: string;
  alternatives?: string;
  drawbacks?: string;
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
  designerValue: RaciValue;
  techLeadValue: RaciValue;
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
  designerValue: RaciValue;
  techLeadValue: RaciValue;
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

/** Stable default step names (RFC 0026 letter ACL + seed). */
export const RACI_STEP_NAMES = {
  RESOLVE_AMBIGUITIES: 'Resolve open ambiguities',
  APPROVE_RFC: 'Approve the RFC',
  IMPLEMENT: 'Implement it',
  WRITE_TESTS: 'Write / update tests',
  VALIDATE_AC: 'Validate acceptance criteria',
  RELEASE_SIGNOFF: 'Final sign-off for release',
} as const;

/** Default lifecycle steps used by POST .../raci/seed */
export const DEFAULT_RACI_STEPS: RaciAssignmentInput[] = [
  {
    stepName: RACI_STEP_NAMES.RESOLVE_AMBIGUITIES,
    poValue: 'A',
    pmValue: 'C',
    developerValue: 'R',
    qaValue: 'I',
    designerValue: 'C',
    techLeadValue: 'C',
    sortOrder: 0,
  },
  {
    stepName: RACI_STEP_NAMES.APPROVE_RFC,
    poValue: 'A',
    pmValue: 'R',
    developerValue: 'C',
    qaValue: 'I',
    designerValue: 'C',
    techLeadValue: 'R',
    sortOrder: 1,
  },
  {
    stepName: RACI_STEP_NAMES.IMPLEMENT,
    poValue: 'I',
    pmValue: 'I',
    developerValue: 'R',
    qaValue: 'I',
    designerValue: 'C',
    techLeadValue: 'C',
    sortOrder: 2,
  },
  {
    stepName: RACI_STEP_NAMES.WRITE_TESTS,
    poValue: 'I',
    pmValue: 'I',
    developerValue: 'R',
    qaValue: 'R',
    designerValue: 'I',
    techLeadValue: 'C',
    sortOrder: 3,
  },
  {
    stepName: RACI_STEP_NAMES.VALIDATE_AC,
    poValue: 'I',
    pmValue: 'A',
    developerValue: 'C',
    qaValue: 'R',
    designerValue: 'C',
    techLeadValue: 'C',
    sortOrder: 4,
  },
  {
    stepName: RACI_STEP_NAMES.RELEASE_SIGNOFF,
    poValue: 'A',
    pmValue: 'A',
    developerValue: 'I',
    qaValue: 'R',
    designerValue: 'I',
    techLeadValue: 'A',
    sortOrder: 5,
  },
];

/** Gated Feature writes that consult RACI letters (RFC 0026). */
export type RaciLetterAction =
  | 'acceptRfc'
  | 'updateScouting'
  | 'updateImplementationLog'
  | 'updateTestingChecklist'
  | 'updateReviewChecklist'
  | 'updateReleaseLog';

const RACI_LETTER_ACTION_STEP: Record<RaciLetterAction, string> = {
  acceptRfc: RACI_STEP_NAMES.APPROVE_RFC,
  updateScouting: RACI_STEP_NAMES.RESOLVE_AMBIGUITIES,
  updateImplementationLog: RACI_STEP_NAMES.IMPLEMENT,
  updateTestingChecklist: RACI_STEP_NAMES.WRITE_TESTS,
  updateReviewChecklist: RACI_STEP_NAMES.VALIDATE_AC,
  updateReleaseLog: RACI_STEP_NAMES.RELEASE_SIGNOFF,
};

const RACI_LETTER_ACTION_LETTERS: Record<
  RaciLetterAction,
  readonly ('R' | 'A')[]
> = {
  acceptRfc: ['A'],
  updateScouting: ['R', 'A'],
  updateImplementationLog: ['R', 'A'],
  updateTestingChecklist: ['R', 'A'],
  updateReviewChecklist: ['R', 'A'],
  updateReleaseLog: ['R', 'A'],
};

export type RaciLetterRow = Pick<
  RaciAssignmentInput,
  | 'stepName'
  | 'poValue'
  | 'pmValue'
  | 'developerValue'
  | 'qaValue'
  | 'designerValue'
  | 'techLeadValue'
>;

export function raciValueForRole(
  row: RaciLetterRow,
  role: UserRole,
): RaciValue {
  switch (role) {
    case 'PO':
      return row.poValue;
    case 'PM':
      return row.pmValue;
    case 'DEVELOPER':
      return row.developerValue;
    case 'QA':
      return row.qaValue;
    case 'DESIGNER':
      return row.designerValue;
    case 'TECH_LEAD':
      return row.techLeadValue;
  }
}

/**
 * When a matching RACI step exists, require the caller's letter.
 * Missing matrix / step → allow (CASL alone). RFC 0026.
 */
export function canRaciLetter(
  role: UserRole,
  rows: RaciLetterRow[],
  action: RaciLetterAction,
): boolean {
  if (rows.length === 0) return true;
  const stepName = RACI_LETTER_ACTION_STEP[action];
  const needle = stepName.trim().toLowerCase();
  const row = rows.find((r) => r.stepName.trim().toLowerCase() === needle);
  if (!row) return true;
  const letter = raciValueForRole(row, role);
  return RACI_LETTER_ACTION_LETTERS[action].includes(
    letter as 'R' | 'A',
  );
}

/** CI / test-area priority (RFC 0018 / 0027) — not Feature delivery risk. */
export type TestInventoryTier = RiskTier;

export const TEST_INVENTORY_TIERS: TestInventoryTier[] = ['P1', 'P2', 'P3'];

export interface TestInventoryItem {
  id: number;
  area: string;
  packagePath: string;
  tier: TestInventoryTier;
  alwaysRun: boolean;
  why: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestInventoryItemInput {
  area: string;
  packagePath: string;
  tier: TestInventoryTier;
  why: string;
  sortOrder?: number;
}

export interface UpdateTestInventoryItemRequest {
  area?: string;
  packagePath?: string;
  tier?: TestInventoryTier;
  why?: string;
  sortOrder?: number;
}

export interface SeedTestInventoryResult {
  seeded: boolean;
  added: number;
  rows: TestInventoryItem[];
}

/** Seed rows aligned with docs/process/test-inventory.md (RFC 0018). */
export const DEFAULT_TEST_INVENTORY_ROWS: TestInventoryItemInput[] = [
  {
    area: 'Shared contracts',
    packagePath: 'packages/types',
    tier: 'P1',
    why: 'Both apps import; type changes invalidate wide surface',
    sortOrder: 0,
  },
  {
    area: 'HTTP envelope / errors',
    packagePath: 'apps/api/src/common',
    tier: 'P1',
    why: 'Every API response shape depends on this',
    sortOrder: 1,
  },
  {
    area: 'Auth (register/login/JWT)',
    packagePath: 'apps/api/src/auth, web auth pages',
    tier: 'P1',
    why: 'Wrong auth = whole product unusable',
    sortOrder: 2,
  },
  {
    area: 'Feature stage gates',
    packagePath: 'apps/api/src/features/features.service',
    tier: 'P1',
    why: 'Incorrect advance breaks the 8-stage process',
    sortOrder: 3,
  },
  {
    area: 'Scouting + Decisions Needed',
    packagePath: 'apps/api/src/features/scouting*, decisions-needed',
    tier: 'P1',
    why: 'Blocks Ready before test rule',
    sortOrder: 4,
  },
  {
    area: 'RFC check + document',
    packagePath: 'feature-rfc-check*, feature-rfc-document*',
    tier: 'P2',
    why: 'Critical when used; not every PR touches RFC',
    sortOrder: 5,
  },
  {
    area: 'RACI matrix',
    packagePath: 'feature-raci*',
    tier: 'P2',
    why: 'Gate to Implementation; graph-targeted is enough',
    sortOrder: 6,
  },
  {
    area: 'Implementation / Testing / Review checklists',
    packagePath: 'feature-*-log / checklist services',
    tier: 'P2',
    why: 'Stage-specific; run when those modules change',
    sortOrder: 7,
  },
  {
    area: 'Release log + bug triage',
    packagePath: 'feature-release*, feature-bug-triage*',
    tier: 'P2',
    why: 'Post-ship path; targeted on change',
    sortOrder: 8,
  },
  {
    area: 'Feature relations / dependency graph API',
    packagePath: 'feature-relation*',
    tier: 'P2',
    why: 'Supports targeting visuals; not auth-critical',
    sortOrder: 9,
  },
  {
    area: 'GitHub Docs Sync',
    packagePath: 'apps/api/src/docs-sync',
    tier: 'P2',
    why: 'PO settings path; cover when touched',
    sortOrder: 10,
  },
  {
    area: 'Shared UI kit',
    packagePath: 'packages/ui',
    tier: 'P2',
    why: 'Broad UI impact; run when ui or dependents change',
    sortOrder: 11,
  },
  {
    area: 'Web shell (layout, sidebar, board)',
    packagePath: 'apps/web/src',
    tier: 'P2',
    why: 'Prefer Vitest/RTL when ready; graph-targeted',
    sortOrder: 12,
  },
  {
    area: 'Lifecycle / process visuals',
    packagePath: 'LifecyclePage, RACI diagram',
    tier: 'P3',
    why: 'Presentation-only; low false-negative risk',
    sortOrder: 13,
  },
  {
    area: 'OpenAPI export scripts',
    packagePath: 'apps/api openapi scripts',
    tier: 'P3',
    why: 'Docs tooling; run when export code changes',
    sortOrder: 14,
  },
  {
    area: 'Graphify / agent docs',
    packagePath: 'graphify-out/, AGENTS.md',
    tier: 'P3',
    why: 'Not product runtime',
    sortOrder: 15,
  },
];

