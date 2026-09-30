import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  REVIEW_CHECKLIST_STATUSES,
  type ReviewChecklistStatus,
} from '@scoutbook/types';

export class UpsertFeatureReviewChecklistDto {
  @ApiProperty({
    enum: REVIEW_CHECKLIST_STATUSES,
    example: 'IN_PROGRESS',
  })
  @IsIn(REVIEW_CHECKLIST_STATUSES)
  status!: ReviewChecklistStatus;

  @ApiProperty({ example: true })
  @IsBoolean()
  acceptanceCriteriaMet!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  noOpenDecisionRequired!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  rfcResolved!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  testingEvidenceReviewed!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  docsUpdatedIfNeeded!: boolean;

  @ApiPropertyOptional({
    example: 'DoD checked — ready to release',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional({
    example: 'Minor docs follow-up tracked separately',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
