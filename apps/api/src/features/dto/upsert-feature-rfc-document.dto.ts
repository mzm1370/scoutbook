import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  RFC_DOCUMENT_STATUSES,
  type RfcDocumentStatus,
} from '@scoutbook/types';

export class UpsertFeatureRfcDocumentDto {
  @ApiProperty({ enum: RFC_DOCUMENT_STATUSES, example: 'DRAFT' })
  @IsIn(RFC_DOCUMENT_STATUSES)
  status!: RfcDocumentStatus;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  motivation?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  detailedDesign?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  alternatives?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  drawbacks?: string;
}
