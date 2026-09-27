import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureRfcCheckService } from '@api/features/feature-rfc-check.service.js';

describe('FeatureRfcCheckService', () => {
  const rfcCheckRepo = {
    findOneBy: vi.fn(),
    create: vi.fn((row: unknown) => row),
    save: vi.fn(async (row: Record<string, unknown>) => ({
      ...row,
      id: 1,
      createdAt: new Date('2026-09-27T10:00:00.000Z'),
      updatedAt: new Date('2026-09-27T10:00:00.000Z'),
    })),
  };
  const featuresService = {
    findById: vi.fn(),
  };

  const service = new FeatureRfcCheckService(
    rfcCheckRepo as never,
    featuresService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    featuresService.findById.mockResolvedValue({ id: 10 });
    rfcCheckRepo.findOneBy.mockResolvedValue(null);
  });

  it('rejects NOT_NEEDED when a checklist item is true', async () => {
    await expect(
      service.upsert(
        10,
        {
          status: 'NOT_NEEDED',
          changesSharedApi: true,
          newArchitecture: false,
          multiAppImpact: false,
        },
        1,
        'DEVELOPER',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects NEEDED without summary', async () => {
    await expect(
      service.upsert(
        10,
        {
          status: 'NEEDED',
          changesSharedApi: true,
          newArchitecture: false,
          multiAppImpact: false,
          summary: 'x',
        },
        1,
        'DEVELOPER',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('forbids ACCEPTED for Developer', async () => {
    await expect(
      service.upsert(
        10,
        {
          status: 'ACCEPTED',
          changesSharedApi: true,
          newArchitecture: false,
          multiAppImpact: false,
          summary: 'Shared API change needs RFC',
        },
        1,
        'DEVELOPER',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows PO to accept', async () => {
    const result = await service.upsert(
      10,
      {
        status: 'ACCEPTED',
        changesSharedApi: true,
        newArchitecture: false,
        multiAppImpact: false,
        summary: 'Shared API change needs RFC',
        docPath: 'docs/rfcs/0006-example.md',
      },
      2,
      'PO',
    );
    expect(result.status).toBe('ACCEPTED');
    expect(result.docPath).toBe('docs/rfcs/0006-example.md');
  });

  it('404 when get missing', async () => {
    await expect(service.getForFeature(10)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
