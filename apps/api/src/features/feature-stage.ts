import { FEATURE_STAGES, type FeatureStage } from '@scoutbook/types';

/** Scouting statuses that block leaving SCOUTING → RFC. */
export const SCOUTING_BLOCKING_STATUSES = [
  'DECISION_REQUIRED',
  'INVESTIGATING',
  'BLOCKED',
] as const;

export function assertImmediateNextStage(
  current: FeatureStage,
  target: FeatureStage,
): { ok: true } | { ok: false; message: string } {
  const index = FEATURE_STAGES.indexOf(current);
  if (index < 0) {
    return { ok: false, message: `Unknown current stage: ${current}` };
  }
  if (index >= FEATURE_STAGES.length - 1) {
    return {
      ok: false,
      message: 'Feature is already at RELEASE — no further stage',
    };
  }
  const expected = FEATURE_STAGES[index + 1];
  if (target !== expected) {
    return {
      ok: false,
      message: `Stage must advance one step at a time (expected ${expected}, got ${target})`,
    };
  }
  return { ok: true };
}
