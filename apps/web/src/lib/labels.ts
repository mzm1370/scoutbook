export const RISK_TIER_LABELS: Record<'P1' | 'P2' | 'P3', string> = {
  P1: 'P1 — High',
  P2: 'P2 — Medium',
  P3: 'P3 — Low',
};

export const ROLE_LABELS: Record<'PO' | 'PM' | 'DEVELOPER' | 'QA', string> = {
  PO: 'Product Owner',
  PM: 'Product Manager',
  DEVELOPER: 'Developer',
  QA: 'QA',
};

export const SCOUTING_STATUS_LABELS: Record<
  'READY' | 'DECISION_REQUIRED' | 'INVESTIGATING' | 'BLOCKED',
  string
> = {
  READY: 'Ready',
  DECISION_REQUIRED: 'Decision required',
  INVESTIGATING: 'Investigating',
  BLOCKED: 'Blocked',
};

export const RFC_CHECK_STATUS_LABELS: Record<
  'NOT_CHECKED' | 'NOT_NEEDED' | 'NEEDED' | 'ACCEPTED',
  string
> = {
  NOT_CHECKED: 'Not checked',
  NOT_NEEDED: 'Not needed',
  NEEDED: 'Needed',
  ACCEPTED: 'Accepted',
};

export const RFC_DOCUMENT_STATUS_LABELS: Record<
  'DRAFT' | 'ACCEPTED' | 'REJECTED',
  string
> = {
  DRAFT: 'Draft',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

export const IMPLEMENTATION_LOG_STATUS_LABELS: Record<
  'NOT_STARTED' | 'IN_PROGRESS' | 'READY_FOR_TEST',
  string
> = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  READY_FOR_TEST: 'Ready for test',
};

export const TESTING_CHECKLIST_STATUS_LABELS: Record<
  'NOT_STARTED' | 'IN_PROGRESS' | 'PASSED',
  string
> = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  PASSED: 'Passed',
};

export const REVIEW_CHECKLIST_STATUS_LABELS: Record<
  'NOT_STARTED' | 'IN_PROGRESS' | 'APPROVED',
  string
> = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  APPROVED: 'Approved',
};

export const RELEASE_LOG_STATUS_LABELS: Record<
  'NOT_STARTED' | 'SHIPPED' | 'OBSERVING' | 'STABLE',
  string
> = {
  NOT_STARTED: 'Not started',
  SHIPPED: 'Shipped',
  OBSERVING: 'Observing',
  STABLE: 'Stable',
};

export const BUG_TRIAGE_TYPE_LABELS: Record<
  'REGRESSION' | 'SCOUTING_GAP' | 'UNSURE',
  string
> = {
  REGRESSION: 'Regression',
  SCOUTING_GAP: 'Scouting gap',
  UNSURE: 'Unsure',
};

export const BUG_TRIAGE_STATUS_LABELS: Record<
  'OPEN' | 'RESOLVED' | 'ESCALATED_TO_PO',
  string
> = {
  OPEN: 'Open',
  RESOLVED: 'Resolved',
  ESCALATED_TO_PO: 'Escalated to PO',
};

export const BUG_TRIAGE_RISK_LABELS: Record<
  'P1' | 'P2' | 'P3' | 'UNKNOWN',
  string
> = {
  P1: 'P1',
  P2: 'P2',
  P3: 'P3',
  UNKNOWN: 'Unknown',
};

export const FEATURE_STAGE_LABELS: Record<
  | 'IDEA'
  | 'SCOUTING'
  | 'RFC'
  | 'RACI'
  | 'IMPLEMENTATION'
  | 'TESTING'
  | 'REVIEW'
  | 'RELEASE',
  string
> = {
  IDEA: 'Idea',
  SCOUTING: 'Scouting',
  RFC: 'RFC',
  RACI: 'RACI',
  IMPLEMENTATION: 'Implementation',
  TESTING: 'Testing',
  REVIEW: 'Review',
  RELEASE: 'Release',
};
