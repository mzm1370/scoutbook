import { ApiProperty } from '@nestjs/swagger';
import {
  DOCS_SYNC_AUTH_MODES,
  type DocsSyncAuthMode,
} from '@scoutbook/types';

export class DocsSyncConnectionResponseDto {
  @ApiProperty({ example: true })
  configured!: boolean;

  @ApiProperty({
    nullable: true,
    example: 'https://github.com/acme/app',
  })
  repoUrl!: string | null;

  @ApiProperty({ enum: DOCS_SYNC_AUTH_MODES, example: 'PAT' })
  authMode!: DocsSyncAuthMode;

  @ApiProperty({ example: true })
  hasToken!: boolean;

  @ApiProperty({ nullable: true, example: 'abcd' })
  tokenLastFour!: string | null;

  @ApiProperty({ nullable: true, example: '123456' })
  githubAppId!: string | null;

  @ApiProperty({ nullable: true, example: '987654' })
  githubInstallationId!: string | null;

  @ApiProperty({ nullable: true, example: '2026-09-30T12:00:00.000Z' })
  updatedAt!: string | null;

  @ApiProperty({ nullable: true, example: '2026-09-30T12:05:00.000Z' })
  lastSyncAt!: string | null;

  @ApiProperty({
    nullable: true,
    example: 'https://github.com/acme/app/pull/12',
  })
  lastPrUrl!: string | null;
}

export class DocsSyncResultResponseDto {
  @ApiProperty({ example: 'https://github.com/acme/app/pull/12' })
  prUrl!: string;

  @ApiProperty({ example: 'scoutbook/docs-sync-1710000000' })
  branch!: string;

  @ApiProperty({ example: 8 })
  filesWritten!: number;
}
