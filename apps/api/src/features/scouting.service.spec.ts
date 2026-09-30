import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ScoutingService } from '@api/features/scouting.service.js';

describe('ScoutingService', () => {
  const scoutingRepo = {
    find: vi.fn(),
    findOneBy: vi.fn(),
    create: vi.fn((row: unknown) => row),
    save: vi.fn(async (row: Record<string, unknown>) => ({
      ...row,
      id: 1,
      createdAt: new Date('2026-09-22T12:00:00.000Z'),
      updatedAt: new Date('2026-09-22T12:00:00.000Z'),
    })),
  };
  const featureRepo = {
    findBy: vi.fn(),
  };
  const featuresService = {
    findById: vi.fn(),
  };

  const service = new ScoutingService(
    scoutingRepo as never,
    featureRepo as never,
    featuresService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    featuresService.findById.mockResolvedValue({ id: 10 });
  });

  it('lists rows for an existing feature', async () => {
    scoutingRepo.find.mockResolvedValue([
      {
        id: 1,
        featureId: 10,
        question: 'Q',
        currentState: 'now',
        expected: 'then',
        decision: '',
        status: 'INVESTIGATING',
        createdAt: new Date('2026-09-22T12:00:00.000Z'),
        updatedAt: new Date('2026-09-22T12:00:00.000Z'),
      },
    ]);

    const rows = await service.listForFeature(10);
    expect(featuresService.findById).toHaveBeenCalledWith(10);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.status).toBe('INVESTIGATING');
  });

  it('lists decision-needed rows with feature context', async () => {
    scoutingRepo.find.mockResolvedValue([
      {
        id: 7,
        featureId: 10,
        question: 'Allowed?',
        currentState: 'unknown',
        expected: 'PO says',
        decision: '',
        status: 'DECISION_REQUIRED',
        createdAt: new Date('2026-09-22T12:00:00.000Z'),
        updatedAt: new Date('2026-09-30T10:00:00.000Z'),
      },
    ]);
    featureRepo.findBy.mockResolvedValue([
      {
        id: 10,
        title: 'Docs Sync',
        currentStage: 'SCOUTING',
        riskTier: 'P2',
      },
    ]);

    const rows = await service.listDecisionNeeded();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      entryId: 7,
      featureId: 10,
      featureTitle: 'Docs Sync',
      featureStage: 'SCOUTING',
      riskTier: 'P2',
      status: 'DECISION_REQUIRED',
      question: 'Allowed?',
    });
  });

  it('rejects READY without decision', async () => {
    await expect(
      service.create(10, {
        question: 'Who?',
        currentState: 'unknown',
        expected: 'PO decides',
        status: 'READY',
        decision: '  ',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates an investigating row by default', async () => {
    const created = await service.create(10, {
      question: 'Who creates?',
      currentState: 'unclear',
      expected: 'PO only',
    });
    expect(created.status).toBe('INVESTIGATING');
    expect(created.decision).toBe('');
  });

  it('404s when updating missing entry', async () => {
    scoutingRepo.findOneBy.mockResolvedValue(null);
    await expect(
      service.update(10, 99, { status: 'BLOCKED' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
