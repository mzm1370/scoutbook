import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureTestPlanService } from '@api/features/feature-test-plan.service.js';

describe('FeatureTestPlanService (RFC 0029)', () => {
  const planRepo = {
    findOneBy: vi.fn(),
    create: vi.fn((row: unknown) => row),
    save: vi.fn(async (row: Record<string, unknown>) => ({
      id: 1,
      ...row,
      createdAt: new Date('2026-10-28T15:00:00.000Z'),
      updatedAt: new Date('2026-10-28T15:00:00.000Z'),
    })),
  };
  const featuresService = { findById: vi.fn() };

  const service = new FeatureTestPlanService(
    planRepo as never,
    featuresService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    featuresService.findById.mockResolvedValue({ id: 10 });
  });

  it('404 when missing', async () => {
    planRepo.findOneBy.mockResolvedValue(null);
    await expect(service.getForFeature(10)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rejects READY with no layers', async () => {
    await expect(
      service.upsert(
        10,
        {
          status: 'READY',
          unitPlanned: false,
          integrationPlanned: false,
          e2ePlanned: false,
          summary: 'Nothing planned',
        },
        3,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects NOT_NEEDED with a layer checked', async () => {
    await expect(
      service.upsert(
        10,
        {
          status: 'NOT_NEEDED',
          unitPlanned: true,
          integrationPlanned: false,
          e2ePlanned: false,
        },
        3,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('upserts READY when at least one layer planned', async () => {
    planRepo.findOneBy.mockResolvedValue(null);
    const row = await service.upsert(
      10,
      {
        status: 'READY',
        unitPlanned: true,
        integrationPlanned: false,
        e2ePlanned: true,
        summary: 'Unit + browser happy path',
      },
      3,
    );
    expect(row.status).toBe('READY');
    expect(row.unitPlanned).toBe(true);
    expect(row.e2ePlanned).toBe(true);
  });
});
