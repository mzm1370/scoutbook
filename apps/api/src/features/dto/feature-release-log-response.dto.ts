import { ApiProperty } from '@nestjs/swagger';
import {
  RELEASE_LOG_STATUSES,
  type ReleaseLogStatus,
} from '@scoutbook/types';

export class FeatureReleaseLogResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({
    enum: RELEASE_LOG_STATUSES,
    example: 'SHIPPED',
  })
  status!: ReleaseLogStatus;

  @ApiProperty({ example: 'Shipped to staging; watching error rates' })
  summary!: string;

  @ApiProperty({ example: true })
  watchStarted!: boolean;

  @ApiProperty({ example: '' })
  notes!: string;

  @ApiProperty({ example: 1, nullable: true })
  updatedByUserId!: number | null;

  @ApiProperty({ example: '2026-09-30T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-09-30T10:00:00.000Z' })
  updatedAt!: string;
}
