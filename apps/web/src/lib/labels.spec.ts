import { describe, expect, it } from 'vitest';
import {
  PROCESS_TRACK_LABELS,
  RISK_TIER_LABELS,
  ROLE_LABELS,
} from '@web/lib/labels';

describe('labels', () => {
  it('covers risk tiers', () => {
    expect(RISK_TIER_LABELS.P1).toContain('High');
    expect(RISK_TIER_LABELS.P3).toContain('Low');
  });

  it('covers process tracks', () => {
    expect(PROCESS_TRACK_LABELS.LIGHT).toMatch(/Light/i);
    expect(PROCESS_TRACK_LABELS.RFC).toMatch(/RFC/i);
  });

  it('covers six roles including Designer and Tech Lead', () => {
    expect(ROLE_LABELS.DESIGNER).toBe('Designer');
    expect(ROLE_LABELS.TECH_LEAD).toBe('Tech Lead');
  });
});
