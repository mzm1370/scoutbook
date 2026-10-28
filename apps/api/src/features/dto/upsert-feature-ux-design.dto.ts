import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UX_DESIGN_STATUSES, type UxDesignStatus } from '@scoutbook/types';

export class UpsertFeatureUxDesignDto {
  @ApiProperty({ enum: UX_DESIGN_STATUSES, example: 'IN_PROGRESS' })
  @IsIn(UX_DESIGN_STATUSES)
  status!: UxDesignStatus;

  @ApiProperty({ example: true })
  @IsBoolean()
  happyPathCovered!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  emptyStateCovered!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  loadingStateCovered!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  errorStateCovered!: boolean;

  @ApiPropertyOptional({
    example: 'Project selector: empty, loading, error wired in Figma',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional({
    example: 'docs/design/project-selector.md',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  mockupPath?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
