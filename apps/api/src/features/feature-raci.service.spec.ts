import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureRaciService } from '@api/features/feature-raci.service.js';
import { DEFAULT_RACI_STEPS } from '@scoutbook/types';

describe('FeatureRaciService', () => {
  const raciRepo = {
    find: vi.fn(),
    count: vi.fn(),
    create: vi.fn((row: unknown) => row),
    save: vi.fn(async (rows: unknown) => rows),
    manager: {
      transaction: vi.fn(async (fn: (m: unknown) => Promise<void>) => {
        const repo = {
          delete: vi.fn(),
          create: vi.fn((row: unknown) => row),
          save: vi.fn(async (rows: unknown) => rows),
        };
        await fn({ getRepository: () => repo });
      }),
    },
  };
  const featuresService = { findById: vi.fn() };

  const service = new FeatureRaciService(
    raciRepo as never,
    featuresService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    featuresService.findById.mockResolvedValue({ id: 10 });
  });

  it('seeds defaults when empty', async () => {
    raciRepo.count.mockResolvedValue(0);
    raciRepo.find.mockResolvedValue(
      DEFAULT_RACI_STEPS.map((step, i) => ({
        id: i + 1,
        featureId: 10,
        ...step,
        sortOrder: step.sortOrder ?? i,
        createdAt: new Date('2026-09-27T10:00:00.000Z'),
        updatedAt: new Date('2026-09-27T10:00:00.000Z'),
      })),
    );

    const result = await service.seedDefaults(10);
    expect(result.seeded).toBe(true);
    expect(result.rows).toHaveLength(DEFAULT_RACI_STEPS.length);
    expect(raciRepo.save).toHaveBeenCalled();
  });

  it('does not re-seed when rows exist', async () => {
    raciRepo.count.mockResolvedValue(2);
    raciRepo.find.mockResolvedValue([
      {
        id: 1,
        featureId: 10,
        stepName: 'Implement it',
        poValue: 'I',
        pmValue: 'I',
        developerValue: 'R',
        qaValue: 'I',
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await service.seedDefaults(10);
    expect(result.seeded).toBe(false);
    expect(raciRepo.save).not.toHaveBeenCalled();
  });

  it('rejects duplicate step names on replace', async () => {
    await expect(
      service.replace(10, {
        rows: [
          {
            stepName: 'Implement',
            poValue: 'I',
            pmValue: 'I',
            developerValue: 'R',
            qaValue: 'A',
          },
          {
            stepName: ' implement ',
            poValue: 'I',
            pmValue: 'A',
            developerValue: 'R',
            qaValue: 'I',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('assertReadyToLeaveRaci requires R and A', () => {
    expect(() =>
      service.assertReadyToLeaveRaci([
        {
          id: 1,
          featureId: 10,
          stepName: 'Broken',
          poValue: 'C',
          pmValue: 'I',
          developerValue: 'I',
          qaValue: 'I',
          sortOrder: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ).toThrow(BadRequestException);
  });
});
