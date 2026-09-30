import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocsSyncController } from '@api/docs-sync/docs-sync.controller.js';
import { DocsSyncService } from '@api/docs-sync/docs-sync.service.js';
import { GithubConnection } from '@api/docs-sync/entities/github-connection.entity.js';
import { FetchGithubApiClient } from '@api/docs-sync/github/fetch-github-api.client.js';
import { GITHUB_API_CLIENT } from '@api/docs-sync/github/github-api.client.js';
import { Feature } from '@api/features/entities/feature.entity.js';
import { FeatureRelation } from '@api/features/entities/feature-relation.entity.js';
import { FeatureRfcCheck } from '@api/features/entities/feature-rfc-check.entity.js';
import { RaciAssignment } from '@api/features/entities/raci-assignment.entity.js';
import { ScoutingEntry } from '@api/features/entities/scouting-entry.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GithubConnection,
      Feature,
      ScoutingEntry,
      FeatureRfcCheck,
      RaciAssignment,
      FeatureRelation,
    ]),
  ],
  controllers: [DocsSyncController],
  providers: [
    DocsSyncService,
    FetchGithubApiClient,
    { provide: GITHUB_API_CLIENT, useExisting: FetchGithubApiClient },
  ],
  exports: [DocsSyncService],
})
export class DocsSyncModule {}
