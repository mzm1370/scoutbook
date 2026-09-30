import { ApiProperty } from '@nestjs/swagger';
import {
  FEATURE_RELATION_TYPES,
  type FeatureRelationType,
} from '@scoutbook/types';

export class FeatureRelationResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  fromFeatureId!: number;

  @ApiProperty({ example: 2 })
  toFeatureId!: number;

  @ApiProperty({ enum: FEATURE_RELATION_TYPES, example: 'BLOCKS' })
  type!: FeatureRelationType;

  @ApiProperty({ example: 3 })
  createdByUserId!: number;

  @ApiProperty({ example: '2026-09-30T10:00:00.000Z' })
  createdAt!: string;
}
