import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  BUG_TRIAGE_RISKS,
  BUG_TRIAGE_STATUSES,
  BUG_TRIAGE_TYPES,
  type BugTriageRisk,
  type BugTriageStatus,
  type BugTriageType,
} from '@scoutbook/types';

export class CreateFeatureBugTriageDto {
  @ApiProperty({ example: 'Assign button does nothing on mobile' })
  @IsString()
  @MinLength(2)
  @MaxLength(300)
  whatHappened!: string;

  @ApiProperty({ example: 'Assign opens the user picker' })
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  expected!: string;

  @ApiPropertyOptional({
    example: '1. Open feature on phone\n2. Tap Assign',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reproduce?: string;

  @ApiProperty({ enum: BUG_TRIAGE_TYPES, example: 'REGRESSION' })
  @IsIn(BUG_TRIAGE_TYPES)
  bugType!: BugTriageType;

  @ApiPropertyOptional({
    enum: BUG_TRIAGE_RISKS,
    example: 'P2',
  })
  @IsOptional()
  @IsIn(BUG_TRIAGE_RISKS)
  riskTier?: BugTriageRisk;

  @ApiPropertyOptional({
    enum: BUG_TRIAGE_STATUSES,
    example: 'OPEN',
  })
  @IsOptional()
  @IsIn(BUG_TRIAGE_STATUSES)
  status?: BugTriageStatus;
}
