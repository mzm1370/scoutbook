import { ApiProperty } from '@nestjs/swagger';
import { TEST_HEALTH_STATUSES, type TestHealthStatus } from '@scoutbook/types';

export class FeatureTestHealthResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({ enum: TEST_HEALTH_STATUSES, example: 'HEALTHY' })
  status!: TestHealthStatus;

  @ApiProperty({ example: true })
  failureRateChecked!: boolean;

  @ApiProperty({ example: true })
  flakyChecked!: boolean;

  @ApiProperty({ example: true })
  durationChecked!: boolean;

  @ApiProperty({ example: 2, nullable: true })
  failureRatePct!: number | null;

  @ApiProperty({ example: 1, nullable: true })
  flakyCount!: number | null;

  @ApiProperty({ example: 12, nullable: true })
  durationMinutes!: number | null;

  @ApiProperty({ example: 'CI green after ship; one known flake' })
  summary!: string;

  @ApiProperty({ example: '' })
  notes!: string;

  @ApiProperty({ example: 9, nullable: true })
  updatedByUserId!: number | null;

  @ApiProperty({ example: '2026-10-28T15:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-10-28T15:00:00.000Z' })
  updatedAt!: string;
}
