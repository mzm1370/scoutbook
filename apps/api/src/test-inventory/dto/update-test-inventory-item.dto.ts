import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { TEST_INVENTORY_TIERS, type TestInventoryTier } from '@scoutbook/types';

export class UpdateTestInventoryItemDto {
  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  area?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  packagePath?: string;

  @ApiPropertyOptional({ enum: TEST_INVENTORY_TIERS })
  @IsOptional()
  @IsIn(TEST_INVENTORY_TIERS)
  tier?: TestInventoryTier;

  @ApiPropertyOptional({ maxLength: 300 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(300)
  why?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
