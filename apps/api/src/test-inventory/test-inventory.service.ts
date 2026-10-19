import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DEFAULT_TEST_INVENTORY_ROWS,
  TEST_INVENTORY_TIERS,
  type SeedTestInventoryResult,
  type TestInventoryItem as TestInventoryItemContract,
  type TestInventoryTier,
  type UserRole,
} from '@scoutbook/types';
import { CreateTestInventoryItemDto } from '@api/test-inventory/dto/create-test-inventory-item.dto.js';
import { UpdateTestInventoryItemDto } from '@api/test-inventory/dto/update-test-inventory-item.dto.js';
import { TestInventoryItem } from '@api/test-inventory/entities/test-inventory-item.entity.js';

@Injectable()
export class TestInventoryService {
  constructor(
    @InjectRepository(TestInventoryItem)
    private readonly itemRepo: Repository<TestInventoryItem>,
  ) {}

  async list(tier?: TestInventoryTier): Promise<TestInventoryItemContract[]> {
    if (tier !== undefined && !TEST_INVENTORY_TIERS.includes(tier)) {
      throw new BadRequestException(
        `tier must be one of: ${TEST_INVENTORY_TIERS.join(', ')}`,
      );
    }
    const rows = await this.itemRepo.find({
      where: tier ? { tier } : undefined,
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
    return rows.map((row) => this.toContract(row));
  }

  async seedDefaults(): Promise<SeedTestInventoryResult> {
    const count = await this.itemRepo.count();
    if (count > 0) {
      return { seeded: false, added: 0, rows: await this.list() };
    }
    const entities = DEFAULT_TEST_INVENTORY_ROWS.map((row, index) =>
      this.itemRepo.create({
        area: row.area,
        packagePath: row.packagePath,
        tier: row.tier,
        alwaysRun: row.tier === 'P1',
        why: row.why,
        sortOrder: row.sortOrder ?? index,
      }),
    );
    await this.itemRepo.save(entities);
    const rows = await this.list();
    return { seeded: true, added: rows.length, rows };
  }

  async create(
    dto: CreateTestInventoryItemDto,
    userRole: UserRole,
  ): Promise<TestInventoryItemContract> {
    if (dto.tier === 'P1' && userRole !== 'PO') {
      throw new ForbiddenException('Only PO can add P1 inventory rows');
    }
    const row = this.itemRepo.create({
      area: dto.area.trim(),
      packagePath: dto.packagePath.trim(),
      tier: dto.tier,
      alwaysRun: dto.tier === 'P1',
      why: dto.why.trim(),
      sortOrder: dto.sortOrder ?? 0,
    });
    const saved = await this.itemRepo.save(row);
    return this.toContract(saved);
  }

  async update(
    id: number,
    dto: UpdateTestInventoryItemDto,
    userRole: UserRole,
  ): Promise<TestInventoryItemContract> {
    const row = await this.itemRepo.findOneBy({ id });
    if (!row) {
      throw new NotFoundException(`Test inventory item ${id} not found`);
    }

    const nextTier = dto.tier ?? row.tier;
    if (
      (row.tier === 'P1' || nextTier === 'P1') &&
      row.tier !== nextTier &&
      userRole !== 'PO'
    ) {
      throw new ForbiddenException(
        'Only PO can change inventory tier to or from P1',
      );
    }

    if (dto.area !== undefined) row.area = dto.area.trim();
    if (dto.packagePath !== undefined) row.packagePath = dto.packagePath.trim();
    if (dto.tier !== undefined) {
      row.tier = dto.tier;
      row.alwaysRun = dto.tier === 'P1';
    }
    if (dto.why !== undefined) row.why = dto.why.trim();
    if (dto.sortOrder !== undefined) row.sortOrder = dto.sortOrder;

    const saved = await this.itemRepo.save(row);
    return this.toContract(saved);
  }

  async remove(id: number, userRole: UserRole): Promise<void> {
    const row = await this.itemRepo.findOneBy({ id });
    if (!row) {
      throw new NotFoundException(`Test inventory item ${id} not found`);
    }
    if (row.tier === 'P1' && userRole !== 'PO') {
      throw new ForbiddenException('Only PO can delete P1 inventory rows');
    }
    await this.itemRepo.delete({ id });
  }

  private toContract(row: TestInventoryItem): TestInventoryItemContract {
    return {
      id: row.id,
      area: row.area,
      packagePath: row.packagePath,
      tier: row.tier,
      alwaysRun: row.alwaysRun,
      why: row.why,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
