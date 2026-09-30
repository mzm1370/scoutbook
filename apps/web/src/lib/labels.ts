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

export const IMPLEMENTATION_LOG_STATUS_LABELS: Record<
  'NOT_STARTED' | 'IN_PROGRESS' | 'READY_FOR_TEST',
  string
> = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  READY_FOR_TEST: 'Ready for test',
};
