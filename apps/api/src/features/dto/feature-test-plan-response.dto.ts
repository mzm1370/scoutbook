import { ApiProperty } from '@nestjs/swagger';
import { TEST_PLAN_STATUSES, type TestPlanStatus } from '@scoutbook/types';

export class FeatureTestPlanResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({ enum: TEST_PLAN_STATUSES, example: 'READY' })
  status!: TestPlanStatus;

  @ApiProperty({ example: true })
  unitPlanned!: boolean;

  @ApiProperty({ example: true })
  integrationPlanned!: boolean;

  @ApiProperty({ example: false })
  e2ePlanned!: boolean;

  @ApiProperty({
    example: 'Unit for parsers; API e2e for stage gate; no browser E2E',
  })
  summary!: string;

  @ApiProperty({ example: '' })
  notes!: string;

  @ApiProperty({ example: 9, nullable: true })
  updatedByUserId!: number | null;

  @ApiProperty({ example: '2026-10-28T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-10-28T12:00:00.000Z' })
  updatedAt!: string;
}
