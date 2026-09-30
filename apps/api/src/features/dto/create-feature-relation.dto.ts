import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import {
  FEATURE_RELATION_TYPES,
  type FeatureRelationType,
} from '@scoutbook/types';

export class CreateFeatureRelationDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  fromFeatureId!: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  toFeatureId!: number;

  @ApiPropertyOptional({
    enum: FEATURE_RELATION_TYPES,
    example: 'BLOCKS',
  })
  @IsOptional()
  @IsIn(FEATURE_RELATION_TYPES)
  type?: FeatureRelationType;
}
