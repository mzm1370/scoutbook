import { ApiProperty } from '@nestjs/swagger';
import { RACI_VALUES, type RaciValue } from '@scoutbook/types';

export class RaciAssignmentResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({ example: 'Implement it' })
  stepName!: string;

  @ApiProperty({ enum: RACI_VALUES, example: 'I' })
  poValue!: RaciValue;

  @ApiProperty({ enum: RACI_VALUES, example: 'I' })
  pmValue!: RaciValue;

  @ApiProperty({ enum: RACI_VALUES, example: 'R' })
  developerValue!: RaciValue;

  @ApiProperty({ enum: RACI_VALUES, example: 'I' })
  qaValue!: RaciValue;

  @ApiProperty({ example: 2 })
  sortOrder!: number;

  @ApiProperty({ example: '2026-09-27T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-09-27T10:00:00.000Z' })
  updatedAt!: string;
}
