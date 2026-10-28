import { generateKeyPairSync } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import {
  createGithubAppJwt,
  fetchInstallationAccessToken,
} from '@api/docs-sync/github/github-app-auth.js';

describe('github-app-auth (RFC 0031)', () => {
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    publicKeyEncoding: { type: 'spki', format: 'pem' },
  });

  it('creates a three-part RS256 JWT', () => {
    const jwt = createGithubAppJwt('12345', privateKey);
    const parts = jwt.split('.');
    expect(parts).toHaveLength(3);
    const payload = JSON.parse(
      Buffer.from(parts[1]!, 'base64url').toString('utf8'),
    ) as { iss: string; exp: number; iat: number };
    expect(payload.iss).toBe('12345');
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });

  it('fetches an installation access token', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        token: 'ghs_installation_token',
        expires_at: '2026-10-28T16:00:00Z',
      }),
    })) as unknown as typeof fetch;

    const token = await fetchInstallationAccessToken({
      appId: '12345',
      installationId: '67890',
      privateKeyPem: privateKey,
      fetchImpl,
    });
    expect(token).toBe('ghs_installation_token');
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [, init] = fetchImpl.mock.calls[0]!;
    expect((init as RequestInit).method).toBe('POST');
    expect((init as RequestInit).headers).toMatchObject({
      Authorization: expect.stringMatching(/^Bearer ey/),
    });
  });
});
