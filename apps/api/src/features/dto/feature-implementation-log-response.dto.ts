import { ApiProperty } from '@nestjs/swagger';
import {
  IMPLEMENTATION_LOG_STATUSES,
  type ImplementationLogStatus,
} from '@scoutbook/types';

export class FeatureImplementationLogResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({
    enum: IMPLEMENTATION_LOG_STATUSES,
    example: 'READY_FOR_TEST',
  })
  status!: ImplementationLogStatus;

  @ApiProperty({ example: 'Built reminder job + unit tests' })
  summary!: string;

  @ApiProperty({ example: 'feat/reminders' })
  branchOrPr!: string;

  @ApiProperty({ example: '' })
  notes!: string;

  @ApiProperty({ example: 1, nullable: true })
  updatedByUserId!: number | null;

  @ApiProperty({ example: '2026-09-28T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-09-28T10:00:00.000Z' })
  updatedAt!: string;
}
