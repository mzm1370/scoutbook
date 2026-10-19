import { ApiProperty } from '@nestjs/swagger';
import { ScoutingEntryResponseDto } from '@api/features/dto/scouting-entry-response.dto.js';

export class SeedScoutingChecklistResponseDto {
  @ApiProperty({
    example: true,
    description: 'True when at least one template question was inserted',
  })
  seeded!: boolean;

  @ApiProperty({ example: 8 })
  added!: number;

  @ApiProperty({ type: ScoutingEntryResponseDto, isArray: true })
  rows!: ScoutingEntryResponseDto[];
}
