import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateTestInventoryItemDto {
  @ApiProperty({ example: 'Auth (register/login/JWT)', maxLength: 120 })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  area!: string;

  @ApiProperty({ example: 'apps/api/src/auth', maxLength: 200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  packagePath!: string;

  @ApiProperty({ enum: TEST_INVENTORY_TIERS, example: 'P1' })
  @IsIn(TEST_INVENTORY_TIERS)
  tier!: TestInventoryTier;

  @ApiProperty({ example: 'Wrong auth = whole product unusable', maxLength: 300 })
  @IsString()
  @MinLength(2)
  @MaxLength(300)
  why!: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
