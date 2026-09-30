import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  RELEASE_LOG_STATUSES,
  type ReleaseLogStatus,
} from '@scoutbook/types';

export class UpsertFeatureReleaseLogDto {
  @ApiProperty({
    enum: RELEASE_LOG_STATUSES,
    example: 'SHIPPED',
  })
  @IsIn(RELEASE_LOG_STATUSES)
  status!: ReleaseLogStatus;

  @ApiPropertyOptional({
    example: 'Shipped to staging; watching error rates',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  watchStarted!: boolean;

  @ApiPropertyOptional({
    example: 'Rollback plan reviewed',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
