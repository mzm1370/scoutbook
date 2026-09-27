import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { RFC_CHECK_STATUSES, type RfcCheckStatus } from '@scoutbook/types';

export class UpsertFeatureRfcCheckDto {
  @ApiProperty({ enum: RFC_CHECK_STATUSES, example: 'NOT_NEEDED' })
  @IsIn(RFC_CHECK_STATUSES)
  status!: RfcCheckStatus;

  @ApiProperty({ example: false })
  @IsBoolean()
  changesSharedApi!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  newArchitecture!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  multiAppImpact!: boolean;

  @ApiPropertyOptional({
    example: 'Shared ticket API gains bulkAssign — needs RFC.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional({
    example: 'docs/rfcs/0006-bulk-assign.md',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  docPath?: string;
}
