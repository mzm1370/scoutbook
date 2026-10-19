import { ApiProperty } from '@nestjs/swagger';
import { TEST_INVENTORY_TIERS, type TestInventoryTier } from '@scoutbook/types';

export class TestInventoryItemResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Shared contracts' })
  area!: string;

  @ApiProperty({ example: 'packages/types' })
  packagePath!: string;

  @ApiProperty({ enum: TEST_INVENTORY_TIERS, example: 'P1' })
  tier!: TestInventoryTier;

  @ApiProperty({ example: true })
  alwaysRun!: boolean;

  @ApiProperty({ example: 'Both apps import; type changes invalidate wide surface' })
  why!: string;

  @ApiProperty({ example: 0 })
  sortOrder!: number;

  @ApiProperty({ example: '2026-10-19T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-10-19T12:00:00.000Z' })
  updatedAt!: string;
}
