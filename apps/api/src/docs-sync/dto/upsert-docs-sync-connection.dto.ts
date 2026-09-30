import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpsertDocsSyncConnectionDto {
  @ApiProperty({ example: 'https://github.com/acme/app' })
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  repoUrl!: string;

  @ApiPropertyOptional({
    example: 'github_pat_…',
    description: 'Required on first create; omit to keep existing token',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(500)
  token?: string;
}
