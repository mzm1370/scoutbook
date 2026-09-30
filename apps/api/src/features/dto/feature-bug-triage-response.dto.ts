import { ApiProperty } from '@nestjs/swagger';
import {
  BUG_TRIAGE_RISKS,
  BUG_TRIAGE_STATUSES,
  BUG_TRIAGE_TYPES,
  type BugTriageRisk,
  type BugTriageStatus,
  type BugTriageType,
} from '@scoutbook/types';

export class FeatureBugTriageResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({ example: 'Assign button does nothing on mobile' })
  whatHappened!: string;

  @ApiProperty({ example: 'Assign opens the user picker' })
  expected!: string;

  @ApiProperty({ example: '1. Open on phone 2. Tap Assign' })
  reproduce!: string;

  @ApiProperty({ enum: BUG_TRIAGE_TYPES, example: 'REGRESSION' })
  bugType!: BugTriageType;

  @ApiProperty({ enum: BUG_TRIAGE_RISKS, example: 'P2' })
  riskTier!: BugTriageRisk;

  @ApiProperty({ enum: BUG_TRIAGE_STATUSES, example: 'OPEN' })
  status!: BugTriageStatus;

  @ApiProperty({ example: 1, nullable: true })
  createdByUserId!: number | null;

  @ApiProperty({ example: '2026-09-30T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-09-30T10:00:00.000Z' })
  updatedAt!: string;
}
