import { ApiProperty } from '@nestjs/swagger';
import { FEATURE_STAGES, type FeatureStage } from '@scoutbook/types';

export class FeatureStageHistoryResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({
    enum: FEATURE_STAGES,
    nullable: true,
    example: 'IDEA',
  })
  fromStage!: FeatureStage | null;

  @ApiProperty({ enum: FEATURE_STAGES, example: 'SCOUTING' })
  toStage!: FeatureStage;

  @ApiProperty({ example: 3 })
  changedByUserId!: number;

  @ApiProperty({ example: '2026-09-30T10:00:00.000Z' })
  createdAt!: string;
}
