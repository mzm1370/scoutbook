import { describe, expect, it } from 'vitest';
import { assertImmediateNextStage } from '@api/features/feature-stage.js';
import { nextFeatureStage } from '@scoutbook/types';

describe('feature stage helpers', () => {
  it('nextFeatureStage walks the pipeline', () => {
    expect(nextFeatureStage('IDEA')).toBe('SCOUTING');
    expect(nextFeatureStage('SCOUTING')).toBe('RFC');
    expect(nextFeatureStage('RELEASE')).toBeNull();
  });

  it('assertImmediateNextStage accepts only the next step', () => {
    expect(assertImmediateNextStage('IDEA', 'SCOUTING').ok).toBe(true);
    expect(assertImmediateNextStage('IDEA', 'RFC').ok).toBe(false);
    expect(assertImmediateNextStage('RELEASE', 'RELEASE').ok).toBe(false);
  });
});
