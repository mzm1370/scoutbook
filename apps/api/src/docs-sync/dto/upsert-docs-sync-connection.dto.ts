import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  DOCS_SYNC_AUTH_MODES,
  type DocsSyncAuthMode,
} from '@scoutbook/types';

export class UpsertDocsSyncConnectionDto {
  @ApiProperty({ example: 'https://github.com/acme/app' })
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  repoUrl!: string;

  @ApiPropertyOptional({
    enum: DOCS_SYNC_AUTH_MODES,
    example: 'PAT',
    description: 'Defaults to PAT when omitted',
  })
  @IsOptional()
  @IsIn(DOCS_SYNC_AUTH_MODES)
  authMode?: DocsSyncAuthMode;

  @ApiPropertyOptional({
    example: 'github_pat_…',
    description: 'PAT mode — required on first create; omit to keep existing',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(500)
  token?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'GitHub App id (App mode)',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  githubAppId?: string;

  @ApiPropertyOptional({
    example: '987654',
    description: 'GitHub App installation id (App mode)',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  githubInstallationId?: string;

  @ApiPropertyOptional({
    description:
      'GitHub App private key PEM (App mode) — required on first create; omit to keep',
  })
  @IsOptional()
  @IsString()
  @MinLength(32)
  @MaxLength(16000)
  githubAppPrivateKey?: string;
}
