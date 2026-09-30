import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureReleaseLogService } from '@api/features/feature-release-log.service.js';

describe('FeatureReleaseLogService', () => {
  const releaseLogRepo = {
    findOneBy: vi.fn(),
    create: vi.fn((row: unknown) => row),
    save: vi.fn(async (row: { featureId: number; status: string }) => ({
      id: 1,
      ...row,
      createdAt: new Date('2026-09-30T10:00:00.000Z'),
      updatedAt: new Date('2026-09-30T10:00:00.000Z'),
    })),
  };
  const featuresService = { findById: vi.fn() };

  const service = new FeatureReleaseLogService(
    releaseLogRepo as never,
    featuresService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    featuresService.findById.mockResolvedValue({ id: 10 });
  });

  it('upserts a shipped log', async () => {
    releaseLogRepo.findOneBy.mockResolvedValue(null);

    const result = await service.upsert(
      10,
      {
        status: 'SHIPPED',
        summary: 'Shipped to prod',
        watchStarted: false,
        notes: '',
      },
      3,
    );

    expect(result.status).toBe('SHIPPED');
    expect(releaseLogRepo.save).toHaveBeenCalled();
  });

  it('rejects OBSERVING without watchStarted', async () => {
    releaseLogRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.upsert(
        10,
        {
          status: 'OBSERVING',
          summary: 'Watching dashboards',
          watchStarted: false,
        },
        3,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects SHIPPED without summary', async () => {
    releaseLogRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.upsert(
        10,
        {
          status: 'SHIPPED',
          summary: 'Hi',
          watchStarted: false,
        },
        3,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('getForFeature 404s when missing', async () => {
    releaseLogRepo.findOneBy.mockResolvedValue(null);
    await expect(service.getForFeature(10)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
