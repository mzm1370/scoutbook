import {
  FEATURE_STAGES,
  type Feature,
  type FeatureStage,
} from '@scoutbook/types';

export type FeaturesByStage = Record<FeatureStage, Feature[]>;

export function emptyFeaturesByStage(): FeaturesByStage {
  return Object.fromEntries(
    FEATURE_STAGES.map((stage) => [stage, [] as Feature[]]),
  ) as FeaturesByStage;
}

/** Group features into the fixed 8-stage columns (stable stage order). */
export function groupFeaturesByStage(features: Feature[]): FeaturesByStage {
  const grouped = emptyFeaturesByStage();
  for (const feature of features) {
    const bucket = grouped[feature.currentStage];
    if (bucket) {
      bucket.push(feature);
    }
  }
  return grouped;
}
