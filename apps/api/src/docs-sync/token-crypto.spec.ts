import { describe, expect, it } from 'vitest';
import {
  decryptToken,
  encryptToken,
  parseEncryptionKey,
  tokenLastFour,
} from '@api/docs-sync/token-crypto.js';

const KEY =
  '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

describe('token-crypto', () => {
  it('round-trips a PAT', () => {
    const blob = encryptToken('ghp_secret_token_value', KEY);
    expect(blob.startsWith('v1:')).toBe(true);
    expect(decryptToken(blob, KEY)).toBe('ghp_secret_token_value');
  });

  it('rejects bad keys', () => {
    expect(() => parseEncryptionKey('short')).toThrow();
    expect(() => parseEncryptionKey(undefined)).toThrow();
  });

  it('exposes last four', () => {
    expect(tokenLastFour('abcdefgh')).toBe('efgh');
  });
});
