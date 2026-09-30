import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureImplementationLogService } from '@api/features/feature-implementation-log.service.js';

describe('FeatureImplementationLogService', () => {
  const logRepo = {
    findOneBy: vi.fn(),
    create: vi.fn((row: unknown) => row),
    save: vi.fn(async (row: { featureId: number; status: string }) => ({
      id: 1,
      ...row,
      createdAt: new Date('2026-09-28T10:00:00.000Z'),
      updatedAt: new Date('2026-09-28T10:00:00.000Z'),
    })),
  };
  const featuresService = { findById: vi.fn() };

  const service = new FeatureImplementationLogService(
    logRepo as never,
    featuresService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    featuresService.findById.mockResolvedValue({ id: 10 });
  });

  it('upserts a new log', async () => {
    logRepo.findOneBy.mockResolvedValue(null);

    const result = await service.upsert(
      10,
      {
        status: 'IN_PROGRESS',
        summary: 'Wiring reminders',
        branchOrPr: 'feat/reminders',
        notes: '',
      },
      3,
    );

    expect(result.status).toBe('IN_PROGRESS');
    expect(result.summary).toBe('Wiring reminders');
    expect(logRepo.save).toHaveBeenCalled();
  });

  it('rejects READY_FOR_TEST without summary', async () => {
    logRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.upsert(10, { status: 'READY_FOR_TEST', summary: 'hi' }, 3),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('getForFeature 404s when missing', async () => {
    logRepo.findOneBy.mockResolvedValue(null);
    await expect(service.getForFeature(10)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
