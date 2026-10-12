import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import type { FeatureProcessTrack, RiskTier } from '@scoutbook/types';

export class UpdateFeatureDto {
  @ApiPropertyOptional({ enum: ['P1', 'P2', 'P3'] })
  @IsOptional()
  @IsIn(['P1', 'P2', 'P3'])
  riskTier?: RiskTier;

  @ApiPropertyOptional({
    enum: ['LIGHT', 'RFC'],
    description: 'Light = no written RFC; RFC = Accepted design doc required',
  })
  @IsOptional()
  @IsIn(['LIGHT', 'RFC'])
  processTrack?: FeatureProcessTrack;
}
