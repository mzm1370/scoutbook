import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SCOUTING_STATUSES, type ScoutingStatus } from '@scoutbook/types';

export class CreateScoutingEntryDto {
  @ApiProperty({ example: 'Who can create a Feature?', maxLength: 200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  question!: string;

  @ApiProperty({
    example: 'Only hallway discussion — no written rule.',
    maxLength: 300,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  currentState!: string;

  @ApiProperty({
    example: 'PO only via POST /features.',
    maxLength: 300,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  expected!: string;

  @ApiPropertyOptional({
    example: 'PO only',
    maxLength: 300,
    description: 'Required when status is READY',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  decision?: string;

  @ApiPropertyOptional({
    enum: SCOUTING_STATUSES,
    example: 'INVESTIGATING',
  })
  @IsOptional()
  @IsIn(SCOUTING_STATUSES)
  status?: ScoutingStatus;
}
