import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  IMPLEMENTATION_LOG_STATUSES,
  type ImplementationLogStatus,
} from '@scoutbook/types';

export class UpsertFeatureImplementationLogDto {
  @ApiProperty({
    enum: IMPLEMENTATION_LOG_STATUSES,
    example: 'IN_PROGRESS',
  })
  @IsIn(IMPLEMENTATION_LOG_STATUSES)
  status!: ImplementationLogStatus;

  @ApiPropertyOptional({
    example: 'Built reminder job + unit tests',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional({
    example: 'feat/reminders or https://github.com/org/repo/pull/12',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  branchOrPr?: string;

  @ApiPropertyOptional({
    example: 'Cron schedule deferred to next feature',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
