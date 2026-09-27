import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { FEATURE_STAGES, type FeatureStage } from '@scoutbook/types';

export class AdvanceFeatureStageDto {
  @ApiProperty({
    enum: FEATURE_STAGES,
    example: 'SCOUTING',
    description: 'Must be the immediate next stage from the current one',
  })
  @IsIn(FEATURE_STAGES)
  stage!: FeatureStage;
}
