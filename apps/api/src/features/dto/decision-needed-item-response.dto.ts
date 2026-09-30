import { ApiProperty } from '@nestjs/swagger';
import {
  FEATURE_STAGES,
  type FeatureStage,
  type RiskTier,
} from '@scoutbook/types';

export class DecisionNeededItemResponseDto {
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

  @ApiProperty({ enum: ['DECISION_REQUIRED'], example: 'DECISION_REQUIRED' })
  status!: 'DECISION_REQUIRED';

  @ApiProperty({ example: '2026-09-30T10:00:00.000Z' })
  updatedAt!: string;
}
