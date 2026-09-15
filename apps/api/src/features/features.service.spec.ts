import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeaturesService } from './features.service.js';
import type { Feature } from './entities/feature.entity.js';

describe('FeaturesService', () => {
  const repo = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOneBy: vi.fn(),
  };

  let service: FeaturesService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new FeaturesService(repo as never);
  });

  it('creates a feature at IDEA stage', async () => {
    const entity = {
      id: 1,
      title: 'Docs Sync',
      problem: 'Decisions never land in docs/',
      riskTier: 'P2',
      currentStage: 'IDEA',
      createdByUserId: 9,
      createdAt: new Date('2026-09-15T10:00:00.000Z'),
      updatedAt: new Date('2026-09-15T10:00:00.000Z'),
    } satisfies Feature;

    repo.create.mockReturnValue(entity);
    repo.save.mockResolvedValue(entity);

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
    expect(result).toEqual({
      id: 1,
      title: 'Docs Sync',
      problem: 'Decisions never land in docs/',
      riskTier: 'P2',
      currentStage: 'IDEA',
      createdByUserId: 9,
      createdAt: '2026-09-15T10:00:00.000Z',
      updatedAt: '2026-09-15T10:00:00.000Z',
    });
  });

  it('throws NotFoundException when missing', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findById(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
