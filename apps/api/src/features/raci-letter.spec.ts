import { describe, expect, it } from 'vitest';
import {
  DEFAULT_RACI_STEPS,
  canRaciLetter,
  raciValueForRole,
} from '@scoutbook/types';

describe('RACI letter ACL helpers (RFC 0026)', () => {
  it('maps role to column', () => {
    const row = DEFAULT_RACI_STEPS[2]!;
    expect(raciValueForRole(row, 'DEVELOPER')).toBe('R');
    expect(raciValueForRole(row, 'PO')).toBe('I');
  });

  it('allows when matrix empty', () => {
    expect(canRaciLetter('QA', [], 'updateImplementationLog')).toBe(true);
  });

  it('allows Developer to update implementation log on seed matrix', () => {
    expect(
      canRaciLetter('DEVELOPER', DEFAULT_RACI_STEPS, 'updateImplementationLog'),
    ).toBe(true);
  });

  it('denies PO updating implementation log on seed matrix', () => {
    expect(
      canRaciLetter('PO', DEFAULT_RACI_STEPS, 'updateImplementationLog'),
    ).toBe(false);
  });

  it('requires A for acceptRfc', () => {
    expect(canRaciLetter('PO', DEFAULT_RACI_STEPS, 'acceptRfc')).toBe(true);
    expect(canRaciLetter('PM', DEFAULT_RACI_STEPS, 'acceptRfc')).toBe(false);
    expect(canRaciLetter('TECH_LEAD', DEFAULT_RACI_STEPS, 'acceptRfc')).toBe(
      false,
    );
  });

  it('skips when step name missing from custom matrix', () => {
    expect(
      canRaciLetter(
        'PO',
        [
          {
            stepName: 'Custom only',
            poValue: 'I',
            pmValue: 'I',
            developerValue: 'R',
            qaValue: 'I',
            designerValue: 'I',
            techLeadValue: 'I',
          },
        ],
        'updateImplementationLog',
      ),
    ).toBe(true);
  });
});
