import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { TEST_HEALTH_STATUSES, type TestHealthStatus } from '@scoutbook/types';

export class UpsertFeatureTestHealthDto {
  @ApiProperty({ enum: TEST_HEALTH_STATUSES, example: 'WATCHING' })
  @IsIn(TEST_HEALTH_STATUSES)
  status!: TestHealthStatus;

  @ApiProperty({ example: true })
  @IsBoolean()
  failureRateChecked!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  flakyChecked!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  durationChecked!: boolean;

  @ApiPropertyOptional({ example: 2, nullable: true, minimum: 0, maximum: 100 })
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsInt()
  @Min(0)
  @Max(100)
  failureRatePct?: number | null;

  @ApiPropertyOptional({ example: 1, nullable: true, minimum: 0 })
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsInt()
  @Min(0)
  flakyCount?: number | null;

  @ApiPropertyOptional({ example: 12, nullable: true, minimum: 0 })
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsInt()
  @Min(0)
  durationMinutes?: number | null;

  @ApiPropertyOptional({
    example: 'CI green; one quarantined flake on board load',
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
