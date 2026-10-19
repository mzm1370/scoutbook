import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_TEST_INVENTORY_ROWS } from '@scoutbook/types';
import { TestInventoryService } from '@api/test-inventory/test-inventory.service.js';

describe('TestInventoryService (RFC 0027)', () => {
  const itemRepo = {
    find: vi.fn(),
    count: vi.fn(),
    findOneBy: vi.fn(),
    create: vi.fn((row: unknown) => row),
    save: vi.fn(async (row: unknown) => {
      if (Array.isArray(row)) {
        return row.map((r, i) => ({
          ...(r as object),
          id: i + 1,
          createdAt: new Date('2026-10-19T12:00:00.000Z'),
          updatedAt: new Date('2026-10-19T12:00:00.000Z'),
        }));
      }
      return {
        ...(row as object),
        id: 1,
        createdAt: new Date('2026-10-19T12:00:00.000Z'),
        updatedAt: new Date('2026-10-19T12:00:00.000Z'),
      };
    }),
    delete: vi.fn(async () => undefined),
  };

  const service = new TestInventoryService(itemRepo as never);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('seeds defaults when empty', async () => {
    itemRepo.count.mockResolvedValue(0);
    itemRepo.find.mockResolvedValue(
      DEFAULT_TEST_INVENTORY_ROWS.map((row, i) => ({
        id: i + 1,
        ...row,
        alwaysRun: row.tier === 'P1',
        sortOrder: row.sortOrder ?? i,
        createdAt: new Date('2026-10-19T12:00:00.000Z'),
        updatedAt: new Date('2026-10-19T12:00:00.000Z'),
      })),
    );

    const result = await service.seedDefaults();
    expect(result.seeded).toBe(true);
    expect(result.added).toBe(DEFAULT_TEST_INVENTORY_ROWS.length);
    expect(itemRepo.save).toHaveBeenCalled();
  });

  it('does not re-seed when rows exist', async () => {
    itemRepo.count.mockResolvedValue(3);
    itemRepo.find.mockResolvedValue([]);
    const result = await service.seedDefaults();
    expect(result.seeded).toBe(false);
    expect(itemRepo.save).not.toHaveBeenCalled();
  });

  it('blocks non-PO from creating P1', async () => {
    await expect(
      service.create(
        {
          area: 'Critical',
          packagePath: 'apps/api',
          tier: 'P1',
          why: 'Must always run',
        },
        'PM',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows PO to create P1', async () => {
    const row = await service.create(
      {
        area: 'Critical',
        packagePath: 'apps/api',
        tier: 'P1',
        why: 'Must always run',
      },
      'PO',
    );
    expect(row.tier).toBe('P1');
    expect(row.alwaysRun).toBe(true);
  });

  it('blocks non-PO from deleting P1', async () => {
    itemRepo.findOneBy.mockResolvedValue({
      id: 1,
      tier: 'P1',
      area: 'Auth',
    });
    await expect(service.remove(1, 'PM')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('404s on missing update', async () => {
    itemRepo.findOneBy.mockResolvedValue(null);
    await expect(
      service.update(99, { why: 'x' }, 'PO'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
