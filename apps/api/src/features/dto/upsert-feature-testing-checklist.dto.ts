import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  TESTING_CHECKLIST_STATUSES,
  type TestingChecklistStatus,
} from '@scoutbook/types';

export class UpsertFeatureTestingChecklistDto {
  @ApiProperty({
    enum: TESTING_CHECKLIST_STATUSES,
    example: 'IN_PROGRESS',
  })
  @IsIn(TESTING_CHECKLIST_STATUSES)
  status!: TestingChecklistStatus;

  @ApiProperty({ example: true })
  @IsBoolean()
  unitOrIntegrationPassed!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  acceptanceValidated!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  noOpenDecisionRequired!: boolean;

  @ApiPropertyOptional({
    example: 'Unit + QA acceptance against 24h reminder AC',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional({
    example: 'E2E smoke only on happy path',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
