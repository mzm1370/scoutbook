import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureTestHealthService } from '@api/features/feature-test-health.service.js';

describe('FeatureTestHealthService (RFC 0030)', () => {
  const healthRepo = {
    findOneBy: vi.fn(),
    create: vi.fn((row: unknown) => row),
    save: vi.fn(async (row: Record<string, unknown>) => ({
      id: 1,
      ...row,
      createdAt: new Date('2026-10-28T15:30:00.000Z'),
      updatedAt: new Date('2026-10-28T15:30:00.000Z'),
    })),
  };
  const featuresService = { findById: vi.fn() };

  const service = new FeatureTestHealthService(
    healthRepo as never,
    featuresService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    featuresService.findById.mockResolvedValue({ id: 10 });
  });

  it('404 when missing', async () => {
    healthRepo.findOneBy.mockResolvedValue(null);
    await expect(service.getForFeature(10)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rejects HEALTHY without all checks', async () => {
    await expect(
      service.upsert(
        10,
        {
          status: 'HEALTHY',
          failureRateChecked: true,
          flakyChecked: true,
          durationChecked: false,
          summary: 'Almost watching',
        },
        3,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects NOT_NEEDED with metrics', async () => {
    await expect(
      service.upsert(
        10,
        {
          status: 'NOT_NEEDED',
          failureRateChecked: false,
          flakyChecked: false,
          durationChecked: false,
          failureRatePct: 1,
        },
        3,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('upserts HEALTHY when all checks and summary present', async () => {
    healthRepo.findOneBy.mockResolvedValue(null);
    const row = await service.upsert(
      10,
      {
        status: 'HEALTHY',
        failureRateChecked: true,
        flakyChecked: true,
        durationChecked: true,
        failureRatePct: 1,
        flakyCount: 0,
        durationMinutes: 8,
        summary: 'CI stable after ship',
      },
      3,
    );
    expect(row.status).toBe('HEALTHY');
    expect(row.failureRatePct).toBe(1);
  });
});
