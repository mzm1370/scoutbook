import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { RACI_VALUES, type RaciValue } from '@scoutbook/types';

export class RaciAssignmentInputDto {
  @ApiProperty({ example: 'Implement it', maxLength: 120 })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  stepName!: string;

  @ApiProperty({ enum: RACI_VALUES, example: 'I' })
  @IsIn(RACI_VALUES)
  poValue!: RaciValue;

  @ApiProperty({ enum: RACI_VALUES, example: 'I' })
  @IsIn(RACI_VALUES)
  pmValue!: RaciValue;

  @ApiProperty({ enum: RACI_VALUES, example: 'R' })
  @IsIn(RACI_VALUES)
  developerValue!: RaciValue;

  @ApiProperty({ enum: RACI_VALUES, example: 'I' })
  @IsIn(RACI_VALUES)
  qaValue!: RaciValue;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class ReplaceFeatureRaciDto {
  @ApiProperty({ type: [RaciAssignmentInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => RaciAssignmentInputDto)
  rows!: RaciAssignmentInputDto[];
}
