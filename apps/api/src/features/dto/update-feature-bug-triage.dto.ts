import { ApiPropertyOptional } from '@nestjs/swagger';
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

export class UpdateFeatureBugTriageDto {
  @ApiPropertyOptional({ example: 'Assign button does nothing on mobile' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(300)
  whatHappened?: string;

  @ApiPropertyOptional({ example: 'Assign opens the user picker' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  expected?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reproduce?: string;

  @ApiPropertyOptional({ enum: BUG_TRIAGE_TYPES })
  @IsOptional()
  @IsIn(BUG_TRIAGE_TYPES)
  bugType?: BugTriageType;

  @ApiPropertyOptional({ enum: BUG_TRIAGE_RISKS })
  @IsOptional()
  @IsIn(BUG_TRIAGE_RISKS)
  riskTier?: BugTriageRisk;

  @ApiPropertyOptional({ enum: BUG_TRIAGE_STATUSES })
  @IsOptional()
  @IsIn(BUG_TRIAGE_STATUSES)
  status?: BugTriageStatus;
}
