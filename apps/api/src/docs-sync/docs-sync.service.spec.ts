import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DocsSyncService } from '@api/docs-sync/docs-sync.service.js';
import type { GithubApiClient } from '@api/docs-sync/github/github-api.client.js';

const KEY =
  '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

describe('DocsSyncService', () => {
  const connectionRepo = {
    find: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };
  const featuresRepo = { find: vi.fn() };
  const scoutingRepo = { find: vi.fn() };
  const rfcCheckRepo = { find: vi.fn() };
  const rfcDocumentRepo = { find: vi.fn() };
  const raciRepo = { find: vi.fn() };
  const relationsRepo = { find: vi.fn() };
  const github: GithubApiClient = {
    openDocsPr: vi.fn(),
  };
  const config = {
    get: vi.fn((name: string) =>
      name === 'DOCS_SYNC_ENCRYPTION_KEY' ? KEY : undefined,
    ),
  };

  let service: DocsSyncService;

  beforeEach(() => {
    vi.clearAllMocks();
    connectionRepo.create.mockImplementation((row) => row);
    service = new DocsSyncService(
      connectionRepo as never,
      featuresRepo as never,
      scoutingRepo as never,
      rfcCheckRepo as never,
      rfcDocumentRepo as never,
      raciRepo as never,
      relationsRepo as never,
      github,
      config as never,
    );
  });

  it('returns empty status when unconfigured', async () => {
    connectionRepo.find.mockResolvedValue([]);
    const status = await service.getConnection();
    expect(status.configured).toBe(false);
    expect(status).not.toHaveProperty('token');
    expect(status).not.toHaveProperty('encryptedToken');
  });

  it('requires token on first create', async () => {
    connectionRepo.find.mockResolvedValue([]);
    await expect(
      service.upsertConnection(
        { repoUrl: 'https://github.com/acme/app' },
        1,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('encrypts token and never returns it', async () => {
    connectionRepo.find.mockResolvedValue([]);
    const saved = {
      id: 1,
      repoUrl: 'https://github.com/acme/app',
      authMode: 'PAT' as const,
      encryptedToken: 'v1:iv:tag:cipher',
      encryptedPrivateKey: null,
      githubAppId: null,
      githubInstallationId: null,
      tokenLastFour: 'alue',
      updatedByUserId: 1,
      updatedAt: new Date('2026-09-30T12:00:00.000Z'),
      lastSyncAt: null,
      lastPrUrl: null,
    };
    connectionRepo.save.mockImplementation(async (row) => ({
      ...saved,
      ...row,
      encryptedToken: row.encryptedToken,
      tokenLastFour: row.tokenLastFour,
    }));

    const status = await service.upsertConnection(
      {
        repoUrl: 'acme/app',
        token: 'ghp_secret_token_value',
      },
      9,
    );

    expect(status.repoUrl).toBe('https://github.com/acme/app');
    expect(status.authMode).toBe('PAT');
    expect(status.hasToken).toBe(true);
    expect(status.tokenLastFour).toBe('alue');
    expect(JSON.stringify(status)).not.toContain('ghp_secret');
    expect(connectionRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        authMode: 'PAT',
        encryptedToken: expect.stringMatching(/^v1:/),
        tokenLastFour: 'alue',
      }),
    );
  });

  it('encrypts GitHub App private key and never returns it', async () => {
    connectionRepo.find.mockResolvedValue([]);
    connectionRepo.save.mockImplementation(async (row) => ({
      id: 1,
      ...row,
      updatedAt: new Date('2026-10-28T16:00:00.000Z'),
    }));

    const pem = `-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF7P\n-----END RSA PRIVATE KEY-----`;
    const status = await service.upsertConnection(
      {
        repoUrl: 'acme/app',
        authMode: 'GITHUB_APP',
        githubAppId: '12345',
        githubInstallationId: '67890',
        githubAppPrivateKey: pem,
      },
      9,
    );

    expect(status.authMode).toBe('GITHUB_APP');
    expect(status.hasToken).toBe(true);
    expect(status.githubAppId).toBe('12345');
    expect(status.githubInstallationId).toBe('67890');
    expect(status.tokenLastFour).toBe('7890');
    expect(JSON.stringify(status)).not.toContain('BEGIN RSA');
    expect(connectionRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        authMode: 'GITHUB_APP',
        encryptedPrivateKey: expect.stringMatching(/^v1:/),
        encryptedToken: '',
      }),
    );
  });

  it('syncs via mocked GitHub client', async () => {
    const row = {
      id: 1,
      repoUrl: 'https://github.com/acme/app',
      authMode: 'PAT' as const,
      encryptedToken: (
        await import('@api/docs-sync/token-crypto.js')
      ).encryptToken('ghp_test_token_xxxx', KEY),
      encryptedPrivateKey: null,
      githubAppId: null,
      githubInstallationId: null,
      tokenLastFour: 'xxxx',
      updatedByUserId: 1,
      updatedAt: new Date(),
      lastSyncAt: null,
      lastPrUrl: null,
    };
    connectionRepo.find.mockResolvedValue([row]);
    connectionRepo.save.mockImplementation(async (r) => r);
    featuresRepo.find.mockResolvedValue([
      {
        id: 2,
        title: 'Board',
        problem: 'Need columns',
        currentStage: 'IDEA',
        riskTier: 'P2',
        processTrack: 'RFC',
      },
    ]);
    scoutingRepo.find.mockResolvedValue([]);
    rfcCheckRepo.find.mockResolvedValue([]);
    rfcDocumentRepo.find.mockResolvedValue([]);
    raciRepo.find.mockResolvedValue([]);
    relationsRepo.find.mockResolvedValue([]);
    vi.mocked(github.openDocsPr).mockResolvedValue({
      prUrl: 'https://github.com/acme/app/pull/1',
      branch: 'scoutbook/docs-sync-1',
      filesWritten: 2,
    });

    const result = await service.sync();
    expect(result.prUrl).toContain('/pull/1');
    expect(github.openDocsPr).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'ghp_test_token_xxxx',
        repo: { owner: 'acme', repo: 'app' },
        files: expect.arrayContaining([
          expect.objectContaining({
            path: 'docs/features/board-2/overview.md',
          }),
        ]),
      }),
    );
    expect(row.lastPrUrl).toBe('https://github.com/acme/app/pull/1');
  });

  it('throws when syncing without connection', async () => {
    connectionRepo.find.mockResolvedValue([]);
    await expect(service.sync()).rejects.toBeInstanceOf(NotFoundException);
  });
});
