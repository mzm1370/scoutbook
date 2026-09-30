import { ApiProperty } from '@nestjs/swagger';
import {
  TESTING_CHECKLIST_STATUSES,
  type TestingChecklistStatus,
} from '@scoutbook/types';

export class FeatureTestingChecklistResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({
    enum: TESTING_CHECKLIST_STATUSES,
    example: 'PASSED',
  })
  status!: TestingChecklistStatus;

  @ApiProperty({ example: true })
  unitOrIntegrationPassed!: boolean;

  @ApiProperty({ example: true })
  acceptanceValidated!: boolean;

  @ApiProperty({ example: true })
  noOpenDecisionRequired!: boolean;

  @ApiProperty({ example: 'Unit + QA acceptance passed' })
  summary!: string;

  @ApiProperty({ example: '' })
  notes!: string;

  @ApiProperty({ example: 1, nullable: true })
  updatedByUserId!: number | null;

  @ApiProperty({ example: '2026-09-30T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-09-30T10:00:00.000Z' })
  updatedAt!: string;
}
