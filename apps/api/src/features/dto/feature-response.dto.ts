import { ApiProperty } from '@nestjs/swagger';
import type { FeatureStage, RiskTier } from '@scoutbook/types';

export class FeatureResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'GitHub Docs Sync' })
  title!: string;

  @ApiProperty({
    example: 'Decisions never land in the target repo docs/ folder.',
  })
  problem!: string;

  @ApiProperty({ enum: ['P1', 'P2', 'P3'], example: 'P2' })
  riskTier!: RiskTier;

  @ApiProperty({
    enum: [
      'IDEA',
      'SCOUTING',
      'RFC',
      'RACI',
      'IMPLEMENTATION',
      'TESTING',
      'REVIEW',
      'RELEASE',
    ],
    example: 'IDEA',
  })
  currentStage!: FeatureStage;

  @ApiProperty({ example: 1 })
  createdByUserId!: number;

  @ApiProperty({ example: '2026-09-15T06:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-09-15T06:00:00.000Z' })
  updatedAt!: string;
}
