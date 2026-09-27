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
  const featuresService = {
    findById: vi.fn(),
  };

  const service = new ScoutingService(
    scoutingRepo as never,
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
