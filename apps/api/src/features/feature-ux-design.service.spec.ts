import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureUxDesignService } from '@api/features/feature-ux-design.service.js';

describe('FeatureUxDesignService (RFC 0028)', () => {
  const uxRepo = {
    findOneBy: vi.fn(),
    create: vi.fn((row: unknown) => row),
    save: vi.fn(async (row: Record<string, unknown>) => ({
      id: 1,
      ...row,
      createdAt: new Date('2026-10-28T12:00:00.000Z'),
      updatedAt: new Date('2026-10-28T12:00:00.000Z'),
    })),
  };
  const featuresService = { findById: vi.fn() };

  const service = new FeatureUxDesignService(
    uxRepo as never,
    featuresService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    featuresService.findById.mockResolvedValue({ id: 10 });
  });

  it('404 when missing', async () => {
    uxRepo.findOneBy.mockResolvedValue(null);
    await expect(service.getForFeature(10)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rejects READY without all states', async () => {
    await expect(
      service.upsert(
        10,
        {
          status: 'READY',
          happyPathCovered: true,
          emptyStateCovered: true,
          loadingStateCovered: false,
          errorStateCovered: true,
          summary: 'Almost done',
        },
        3,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects NOT_NEEDED with a state checked', async () => {
    await expect(
      service.upsert(
        10,
        {
          status: 'NOT_NEEDED',
          happyPathCovered: true,
          emptyStateCovered: false,
          loadingStateCovered: false,
          errorStateCovered: false,
        },
        3,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('upserts READY when all states covered', async () => {
    uxRepo.findOneBy.mockResolvedValue(null);
    const row = await service.upsert(
      10,
      {
        status: 'READY',
        happyPathCovered: true,
        emptyStateCovered: true,
        loadingStateCovered: true,
        errorStateCovered: true,
        summary: 'All states in Figma',
        mockupPath: 'figma.com/file/x',
      },
      3,
    );
    expect(row.status).toBe('READY');
    expect(row.happyPathCovered).toBe(true);
  });
});
