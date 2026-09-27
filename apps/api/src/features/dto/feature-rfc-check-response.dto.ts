import { ApiProperty } from '@nestjs/swagger';
import { RFC_CHECK_STATUSES, type RfcCheckStatus } from '@scoutbook/types';

export class FeatureRfcCheckResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({ enum: RFC_CHECK_STATUSES, example: 'NOT_NEEDED' })
  status!: RfcCheckStatus;

  @ApiProperty({ example: false })
  changesSharedApi!: boolean;

  @ApiProperty({ example: false })
  newArchitecture!: boolean;

  @ApiProperty({ example: false })
  multiAppImpact!: boolean;

  @ApiProperty({ example: '' })
  summary!: string;

  @ApiProperty({ example: '' })
  docPath!: string;

  @ApiProperty({ example: 1, nullable: true })
  updatedByUserId!: number | null;

  @ApiProperty({ example: '2026-09-27T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-09-27T10:00:00.000Z' })
  updatedAt!: string;
}
