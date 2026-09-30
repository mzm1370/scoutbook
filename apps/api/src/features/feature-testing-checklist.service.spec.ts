import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureTestingChecklistService } from '@api/features/feature-testing-checklist.service.js';

describe('FeatureTestingChecklistService', () => {
  const checklistRepo = {
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

  const service = new FeatureTestingChecklistService(
    checklistRepo as never,
    featuresService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    featuresService.findById.mockResolvedValue({ id: 10 });
  });

  it('upserts a new checklist', async () => {
    checklistRepo.findOneBy.mockResolvedValue(null);

    const result = await service.upsert(
      10,
      {
        status: 'IN_PROGRESS',
        unitOrIntegrationPassed: true,
        acceptanceValidated: false,
        noOpenDecisionRequired: true,
        summary: 'Unit green',
        notes: '',
      },
      3,
    );

    expect(result.status).toBe('IN_PROGRESS');
    expect(checklistRepo.save).toHaveBeenCalled();
  });

  it('rejects PASSED without all checks', async () => {
    checklistRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.upsert(
        10,
        {
          status: 'PASSED',
          unitOrIntegrationPassed: true,
          acceptanceValidated: false,
          noOpenDecisionRequired: true,
          summary: 'Almost done',
        },
        3,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('getForFeature 404s when missing', async () => {
    checklistRepo.findOneBy.mockResolvedValue(null);
    await expect(service.getForFeature(10)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
