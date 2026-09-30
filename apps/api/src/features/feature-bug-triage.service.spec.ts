import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureBugTriageService } from '@api/features/feature-bug-triage.service.js';

describe('FeatureBugTriageService', () => {
  const bugRepo = {
    find: vi.fn(),
    findOneBy: vi.fn(),
    create: vi.fn((row: unknown) => row),
    save: vi.fn(async (row: { featureId: number; whatHappened: string }) => ({
      id: 1,
      ...row,
      createdAt: new Date('2026-09-30T10:00:00.000Z'),
      updatedAt: new Date('2026-09-30T10:00:00.000Z'),
    })),
  };
  const featuresService = { findById: vi.fn() };

  const service = new FeatureBugTriageService(
    bugRepo as never,
    featuresService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    featuresService.findById.mockResolvedValue({ id: 10 });
  });

  it('creates a triage row', async () => {
    const result = await service.create(
      10,
      {
        whatHappened: 'Button broken',
        expected: 'Button works',
        reproduce: 'Tap it',
        bugType: 'REGRESSION',
        riskTier: 'P2',
      },
      3,
    );

    expect(result.bugType).toBe('REGRESSION');
    expect(result.status).toBe('OPEN');
    expect(bugRepo.save).toHaveBeenCalled();
  });

  it('lists rows for a feature', async () => {
    bugRepo.find.mockResolvedValue([
      {
        id: 1,
        featureId: 10,
        whatHappened: 'X',
        expected: 'Y',
        reproduce: '',
        bugType: 'SCOUTING_GAP',
        riskTier: 'UNKNOWN',
        status: 'ESCALATED_TO_PO',
        createdByUserId: 3,
        createdAt: new Date('2026-09-30T10:00:00.000Z'),
        updatedAt: new Date('2026-09-30T10:00:00.000Z'),
      },
    ]);

    const rows = await service.listForFeature(10);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.bugType).toBe('SCOUTING_GAP');
  });

  it('update 404s when missing', async () => {
    bugRepo.findOneBy.mockResolvedValue(null);
    await expect(
      service.update(10, 99, { status: 'RESOLVED' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
