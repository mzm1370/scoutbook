import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeaturesService } from '@api/features/features.service.js';
import type { Feature } from '@api/features/entities/feature.entity.js';

describe('FeaturesService', () => {
  const repo = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOneBy: vi.fn(),
  };
  const scoutingRepo = {
    count: vi.fn(),
  };
  const rfcCheckRepo = {
    findOneBy: vi.fn(),
  };

  let service: FeaturesService;

  const baseFeature = {
    id: 1,
    title: 'Docs Sync',
    problem: 'Decisions never land in docs/',
    riskTier: 'P2' as const,
    currentStage: 'IDEA' as const,
    createdByUserId: 9,
    createdAt: new Date('2026-09-15T10:00:00.000Z'),
    updatedAt: new Date('2026-09-15T10:00:00.000Z'),
  } satisfies Feature;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new FeaturesService(
      repo as never,
      scoutingRepo as never,
      rfcCheckRepo as never,
    );
  });

  it('creates a feature at IDEA stage', async () => {
    repo.create.mockReturnValue(baseFeature);
    repo.save.mockResolvedValue(baseFeature);

    const result = await service.create(
      {
        title: '  Docs Sync  ',
        problem: '  Decisions never land in docs/  ',
        riskTier: 'P2',
      },
      9,
    );

    expect(repo.create).toHaveBeenCalledWith({
      title: 'Docs Sync',
      problem: 'Decisions never land in docs/',
      riskTier: 'P2',
      currentStage: 'IDEA',
      createdByUserId: 9,
    });
    expect(result.currentStage).toBe('IDEA');
  });

  it('throws NotFoundException when missing', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findById(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('advances IDEA → SCOUTING', async () => {
    const feature = { ...baseFeature };
    repo.findOneBy.mockResolvedValue(feature);
    repo.save.mockImplementation(async (row: Feature) => row);

    const result = await service.advanceStage(1, { stage: 'SCOUTING' });
    expect(result.currentStage).toBe('SCOUTING');
  });

  it('rejects skipping IDEA → RFC', async () => {
    repo.findOneBy.mockResolvedValue({ ...baseFeature });
    await expect(
      service.advanceStage(1, { stage: 'RFC' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('blocks SCOUTING → RFC when open scouting rows exist', async () => {
    repo.findOneBy.mockResolvedValue({
      ...baseFeature,
      currentStage: 'SCOUTING',
    });
    scoutingRepo.count.mockResolvedValue(2);

    await expect(
      service.advanceStage(1, { stage: 'RFC' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('allows SCOUTING → RFC when scouting is clear', async () => {
    const feature = { ...baseFeature, currentStage: 'SCOUTING' as const };
    repo.findOneBy.mockResolvedValue(feature);
    scoutingRepo.count.mockResolvedValue(0);
    repo.save.mockImplementation(async (row: Feature) => row);

    const result = await service.advanceStage(1, { stage: 'RFC' });
    expect(result.currentStage).toBe('RFC');
  });

  it('blocks RFC → RACI without ready RFC check', async () => {
    repo.findOneBy.mockResolvedValue({
      ...baseFeature,
      currentStage: 'RFC',
    });
    rfcCheckRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.advanceStage(1, { stage: 'RACI' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('allows RFC → RACI when check is NOT_NEEDED', async () => {
    const feature = { ...baseFeature, currentStage: 'RFC' as const };
    repo.findOneBy.mockResolvedValue(feature);
    rfcCheckRepo.findOneBy.mockResolvedValue({ status: 'NOT_NEEDED' });
    repo.save.mockImplementation(async (row: Feature) => row);

    const result = await service.advanceStage(1, { stage: 'RACI' });
    expect(result.currentStage).toBe('RACI');
  });
});
