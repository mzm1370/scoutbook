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
      encryptedToken: 'v1:iv:tag:cipher',
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
    expect(status.hasToken).toBe(true);
    expect(status.tokenLastFour).toBe('alue');
    expect(JSON.stringify(status)).not.toContain('ghp_secret');
    expect(connectionRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        encryptedToken: expect.stringMatching(/^v1:/),
        tokenLastFour: 'alue',
      }),
    );
  });

  it('syncs via mocked GitHub client', async () => {
    const row = {
      id: 1,
      repoUrl: 'https://github.com/acme/app',
      encryptedToken: (
        await import('@api/docs-sync/token-crypto.js')
      ).encryptToken('ghp_test_token_xxxx', KEY),
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
      },
    ]);
    scoutingRepo.find.mockResolvedValue([]);
    rfcCheckRepo.find.mockResolvedValue([]);
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
