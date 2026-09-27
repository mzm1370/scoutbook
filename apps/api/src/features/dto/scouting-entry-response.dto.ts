import { ApiProperty } from '@nestjs/swagger';
import { SCOUTING_STATUSES, type ScoutingStatus } from '@scoutbook/types';

export class ScoutingEntryResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  featureId!: number;

  @ApiProperty({ example: 'Who can create a Feature?' })
  question!: string;

  @ApiProperty({ example: 'Only hallway discussion.' })
  currentState!: string;

  @ApiProperty({ example: 'PO only via POST /features.' })
  expected!: string;

  @ApiProperty({ example: 'PO only' })
  decision!: string;

  @ApiProperty({ enum: SCOUTING_STATUSES, example: 'READY' })
  status!: ScoutingStatus;

  @ApiProperty({ example: '2026-09-22T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-09-22T12:00:00.000Z' })
  updatedAt!: string;
}
