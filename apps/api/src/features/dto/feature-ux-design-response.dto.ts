import { ApiProperty } from '@nestjs/swagger';
import { UX_DESIGN_STATUSES, type UxDesignStatus } from '@scoutbook/types';

export class FeatureUxDesignResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({ enum: UX_DESIGN_STATUSES, example: 'READY' })
  status!: UxDesignStatus;

  @ApiProperty({ example: true })
  happyPathCovered!: boolean;

  @ApiProperty({ example: true })
  emptyStateCovered!: boolean;

  @ApiProperty({ example: true })
  loadingStateCovered!: boolean;

  @ApiProperty({ example: true })
  errorStateCovered!: boolean;

  @ApiProperty({ example: 'All four states covered in mockups' })
  summary!: string;

  @ApiProperty({ example: 'docs/design/project-selector.md' })
  mockupPath!: string;

  @ApiProperty({ example: '' })
  notes!: string;

  @ApiProperty({ example: 9, nullable: true })
  updatedByUserId!: number | null;

  @ApiProperty({ example: '2026-10-28T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-10-28T12:00:00.000Z' })
  updatedAt!: string;
}
