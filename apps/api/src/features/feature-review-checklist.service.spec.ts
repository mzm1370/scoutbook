import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureReviewChecklistService } from '@api/features/feature-review-checklist.service.js';

describe('FeatureReviewChecklistService', () => {
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

  const service = new FeatureReviewChecklistService(
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
        acceptanceCriteriaMet: true,
        noOpenDecisionRequired: true,
        rfcResolved: true,
        testingEvidenceReviewed: false,
        docsUpdatedIfNeeded: true,
        summary: 'Reviewing',
        notes: '',
      },
      3,
    );

    expect(result.status).toBe('IN_PROGRESS');
    expect(checklistRepo.save).toHaveBeenCalled();
  });

  it('rejects APPROVED without all checks', async () => {
    checklistRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.upsert(
        10,
        {
          status: 'APPROVED',
          acceptanceCriteriaMet: true,
          noOpenDecisionRequired: true,
          rfcResolved: true,
          testingEvidenceReviewed: false,
          docsUpdatedIfNeeded: true,
          summary: 'Almost',
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
