import { FEATURE_STAGES, type FeatureStage } from '@scoutbook/types';
import { FEATURE_STAGE_LABELS } from '@web/lib/labels';

/** One-line purpose per stage (feature-lifecycle.md). */
export const FEATURE_STAGE_PURPOSES: Record<FeatureStage, string> = {
  IDEA: 'Capture need + risk tier',
  SCOUTING: 'Current vs expected; list unknowns',
  RFC: 'Written design only when needed',
  RACI: 'Who does / approves / is consulted',
  IMPLEMENTATION: 'Build + co-located tests',
  TESTING: 'Prove it works',
  REVIEW: 'Second person checks Definition of Done',
  RELEASE: 'Ship, observe, triage bugs',
};

export function stageFlowNodes() {
  return FEATURE_STAGES.map((stage, index) => ({
    stage,
    label: FEATURE_STAGE_LABELS[stage],
    purpose: FEATURE_STAGE_PURPOSES[stage],
    step: index + 1,
  }));
}
