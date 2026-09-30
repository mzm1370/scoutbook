import { ApiProperty } from '@nestjs/swagger';
import {
  REVIEW_CHECKLIST_STATUSES,
  type ReviewChecklistStatus,
} from '@scoutbook/types';

export class FeatureReviewChecklistResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({
    enum: REVIEW_CHECKLIST_STATUSES,
    example: 'APPROVED',
  })
  status!: ReviewChecklistStatus;

  @ApiProperty({ example: true })
  acceptanceCriteriaMet!: boolean;

  @ApiProperty({ example: true })
  noOpenDecisionRequired!: boolean;

  @ApiProperty({ example: true })
  rfcResolved!: boolean;

  @ApiProperty({ example: true })
  testingEvidenceReviewed!: boolean;

  @ApiProperty({ example: true })
  docsUpdatedIfNeeded!: boolean;

  @ApiProperty({ example: 'DoD checked — ready to release' })
  summary!: string;

  @ApiProperty({ example: '' })
  notes!: string;

  @ApiProperty({ example: 1, nullable: true })
  updatedByUserId!: number | null;

  @ApiProperty({ example: '2026-09-30T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-09-30T10:00:00.000Z' })
  updatedAt!: string;
}
