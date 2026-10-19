import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SCOUTING_CHECKLIST_QUESTIONS } from '@scoutbook/types';
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

  it('lists ambiguity tracking for all or filtered statuses', async () => {
    scoutingRepo.find.mockResolvedValue([
      {
        id: 1,
        featureId: 10,
        question: 'A?',
        currentState: 'now',
        expected: 'later',
        decision: 'yes',
        status: 'READY',
        updatedAt: new Date('2026-10-01T10:00:00.000Z'),
      },
      {
        id: 2,
        featureId: 10,
        question: 'B?',
        currentState: 'unk',
        expected: 'PO',
        decision: '',
        status: 'INVESTIGATING',
        updatedAt: new Date('2026-10-02T10:00:00.000Z'),
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

    const all = await service.listAmbiguityTracking();
    expect(all).toHaveLength(2);
    expect(all.map((r) => r.status).sort()).toEqual([
      'INVESTIGATING',
      'READY',
    ]);

    scoutingRepo.find.mockClear();
    await service.listAmbiguityTracking(['READY']);
    expect(scoutingRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: expect.anything() },
      }),
    );
  });

  it('rejects invalid ambiguity status filter', async () => {
    await expect(
      service.listAmbiguityTracking(['NOPE' as never]),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('seeds missing checklist questions only', async () => {
    scoutingRepo.find
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(
        DEFAULT_SCOUTING_CHECKLIST_QUESTIONS.map((question, i) => ({
          id: i + 1,
          featureId: 10,
          question,
          currentState: 'Unknown',
          expected: 'To be decided',
          decision: '',
          status: 'INVESTIGATING',
          createdAt: new Date('2026-10-19T10:00:00.000Z'),
          updatedAt: new Date('2026-10-19T10:00:00.000Z'),
        })),
      );

    const result = await service.seedChecklist(10);
    expect(result.seeded).toBe(true);
    expect(result.added).toBe(DEFAULT_SCOUTING_CHECKLIST_QUESTIONS.length);
    expect(result.rows).toHaveLength(
      DEFAULT_SCOUTING_CHECKLIST_QUESTIONS.length,
    );
    expect(scoutingRepo.save).toHaveBeenCalled();
  });

  it('does not duplicate checklist questions already present', async () => {
    const existing = DEFAULT_SCOUTING_CHECKLIST_QUESTIONS.map(
      (question, i) => ({
        id: i + 1,
        featureId: 10,
        question,
        currentState: 'filled',
        expected: 'filled',
        decision: 'ok',
        status: 'READY',
        createdAt: new Date('2026-10-19T10:00:00.000Z'),
        updatedAt: new Date('2026-10-19T10:00:00.000Z'),
      }),
    );
    scoutingRepo.find.mockResolvedValue(existing);

    const result = await service.seedChecklist(10);
    expect(result.seeded).toBe(false);
    expect(result.added).toBe(0);
    expect(scoutingRepo.save).not.toHaveBeenCalled();
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
