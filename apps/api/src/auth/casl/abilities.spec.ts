import { describe, expect, it } from 'vitest';
import { defineAbilitiesFor } from '@scoutbook/types';

describe('defineAbilitiesFor (RFC 0019)', () => {
  it('PO can create Feature, manage Raci, manage DocsSync, advance', () => {
    const ability = defineAbilitiesFor('PO');
    expect(ability.can('create', 'Feature')).toBe(true);
    expect(ability.can('advance', 'Feature')).toBe(true);
    expect(ability.can('update', 'Feature')).toBe(true);
    expect(ability.can('manage', 'Raci')).toBe(true);
    expect(ability.can('manage', 'DocsSync')).toBe(true);
    expect(ability.can('accept', 'RfcCheck')).toBe(true);
    expect(ability.can('manage', 'FeatureRelation')).toBe(true);
  });

  it('PM can advance and manage Raci but not create Feature or DocsSync', () => {
    const ability = defineAbilitiesFor('PM');
    expect(ability.can('create', 'Feature')).toBe(false);
    expect(ability.can('advance', 'Feature')).toBe(true);
    expect(ability.can('update', 'Feature')).toBe(true);
    expect(ability.can('manage', 'Raci')).toBe(true);
    expect(ability.can('manage', 'DocsSync')).toBe(false);
    expect(ability.can('accept', 'RfcDocument')).toBe(true);
  });

  it('Developer and QA can read Raci but not manage', () => {
    for (const role of ['DEVELOPER', 'QA'] as const) {
      const ability = defineAbilitiesFor(role);
      expect(ability.can('read', 'Raci')).toBe(true);
      expect(ability.can('manage', 'Raci')).toBe(false);
      expect(ability.can('advance', 'Feature')).toBe(false);
      expect(ability.can('create', 'Feature')).toBe(false);
      expect(ability.can('update', 'ScoutingEntry')).toBe(true);
      expect(ability.can('update', 'RfcCheck')).toBe(true);
      expect(ability.can('accept', 'RfcCheck')).toBe(false);
    }
  });
});
