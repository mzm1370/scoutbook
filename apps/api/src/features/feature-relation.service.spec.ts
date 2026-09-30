import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureRelationService } from '@api/features/feature-relation.service.js';

describe('FeatureRelationService', () => {
  const relationsRepo = {
    find: vi.fn(),
    findOneBy: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };
  const featuresRepo = {
    findBy: vi.fn(),
  };

  let service: FeatureRelationService;

  const baseRow = {
    id: 1,
    fromFeatureId: 10,
    toFeatureId: 20,
    type: 'BLOCKS' as const,
    createdByUserId: 9,
    createdAt: new Date('2026-09-30T10:00:00.000Z'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    relationsRepo.create.mockImplementation((row) => row);
    service = new FeatureRelationService(
      relationsRepo as never,
      featuresRepo as never,
    );
  });

  it('lists relations', async () => {
    relationsRepo.find.mockResolvedValue([baseRow]);
    const rows = await service.listAll();
    expect(rows).toEqual([
      {
        id: 1,
        fromFeatureId: 10,
        toFeatureId: 20,
        type: 'BLOCKS',
        createdByUserId: 9,
        createdAt: '2026-09-30T10:00:00.000Z',
      },
    ]);
  });

  it('creates a BLOCKS link', async () => {
    featuresRepo.findBy.mockResolvedValue([{ id: 10 }, { id: 20 }]);
    relationsRepo.findOneBy.mockResolvedValue(null);
    relationsRepo.save.mockResolvedValue(baseRow);

    const result = await service.create(
      { fromFeatureId: 10, toFeatureId: 20 },
      9,
    );

    expect(result.fromFeatureId).toBe(10);
    expect(result.toFeatureId).toBe(20);
    expect(relationsRepo.create).toHaveBeenCalledWith({
      fromFeatureId: 10,
      toFeatureId: 20,
      type: 'BLOCKS',
      createdByUserId: 9,
    });
  });

  it('rejects self-links', async () => {
    await expect(
      service.create({ fromFeatureId: 10, toFeatureId: 10 }, 9),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects missing features', async () => {
    featuresRepo.findBy.mockResolvedValue([{ id: 10 }]);
    await expect(
      service.create({ fromFeatureId: 10, toFeatureId: 99 }, 9),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects duplicates', async () => {
    featuresRepo.findBy.mockResolvedValue([{ id: 10 }, { id: 20 }]);
    relationsRepo.findOneBy.mockResolvedValue(baseRow);
    await expect(
      service.create({ fromFeatureId: 10, toFeatureId: 20 }, 9),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('removes a relation', async () => {
    relationsRepo.findOneBy.mockResolvedValue(baseRow);
    relationsRepo.remove.mockResolvedValue(baseRow);
    const result = await service.remove(1);
    expect(result.id).toBe(1);
    expect(relationsRepo.remove).toHaveBeenCalledWith(baseRow);
  });

  it('throws when removing missing relation', async () => {
    relationsRepo.findOneBy.mockResolvedValue(null);
    await expect(service.remove(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
