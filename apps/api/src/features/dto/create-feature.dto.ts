import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';
import type { RiskTier } from '@scoutbook/types';

export class CreateFeatureDto {
  @ApiProperty({ example: 'GitHub Docs Sync', maxLength: 200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiProperty({
    example: 'Decisions never land in the target repo docs/ folder.',
    maxLength: 500,
    description: 'One or two short sentences — enough to start, deepen later.',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  problem!: string;

  @ApiProperty({ enum: ['P1', 'P2', 'P3'], example: 'P2' })
  @IsIn(['P1', 'P2', 'P3'])
  riskTier!: RiskTier;
}
