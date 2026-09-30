import { ApiProperty } from '@nestjs/swagger';
import {
  RFC_DOCUMENT_STATUSES,
  type RfcDocumentStatus,
} from '@scoutbook/types';

export class FeatureRfcDocumentResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({ enum: RFC_DOCUMENT_STATUSES, example: 'DRAFT' })
  status!: RfcDocumentStatus;

  @ApiProperty({ example: 'Bulk assign needs a written design' })
  summary!: string;

  @ApiProperty({ example: 'Ambiguity around ACL and audit' })
  motivation!: string;

  @ApiProperty({ example: 'New endpoint with dry-run flag' })
  detailedDesign!: string;

  @ApiProperty({ example: 'Reuse existing assign loop' })
  alternatives!: string;

  @ApiProperty({ example: 'More surface area on tickets API' })
  drawbacks!: string;

  @ApiProperty({ nullable: true, example: 3 })
  updatedByUserId!: number | null;

  @ApiProperty({ example: '2026-09-30T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-09-30T12:00:00.000Z' })
  updatedAt!: string;
}
