import { ApiProperty } from '@nestjs/swagger';
import {
  FEATURE_STAGES,
  SCOUTING_STATUSES,
  type FeatureStage,
  type RiskTier,
  type ScoutingStatus,
} from '@scoutbook/types';

export class AmbiguityTrackingItemResponseDto {
  @ApiProperty({ example: 1 })
  entryId!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({ example: 'GitHub Docs Sync' })
  featureTitle!: string;

  @ApiProperty({ enum: FEATURE_STAGES, example: 'SCOUTING' })
  featureStage!: FeatureStage;

  @ApiProperty({ enum: ['P1', 'P2', 'P3'], example: 'P2' })
  riskTier!: RiskTier;

  @ApiProperty({ example: 'Allowed to sync draft RFCs?' })
  question!: string;

  @ApiProperty({ example: 'Unknown' })
  currentState!: string;

  @ApiProperty({ example: 'PO decides' })
  expected!: string;

  @ApiProperty({ example: '' })
  decision!: string;

  @ApiProperty({ enum: SCOUTING_STATUSES, example: 'INVESTIGATING' })
  status!: ScoutingStatus;

  @ApiProperty({ example: '2026-10-12T10:00:00.000Z' })
  updatedAt!: string;
}
