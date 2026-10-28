import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TEST_PLAN_STATUSES, type TestPlanStatus } from '@scoutbook/types';

export class UpsertFeatureTestPlanDto {
  @ApiProperty({ enum: TEST_PLAN_STATUSES, example: 'READY' })
  @IsIn(TEST_PLAN_STATUSES)
  status!: TestPlanStatus;

  @ApiProperty({ example: true })
  @IsBoolean()
  unitPlanned!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  integrationPlanned!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  e2ePlanned!: boolean;

  @ApiPropertyOptional({
    example: 'Unit for parsers; API e2e for stage gate; no browser E2E',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
