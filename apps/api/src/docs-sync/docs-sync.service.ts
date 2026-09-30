import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type {
  DocsSyncConnection,
  DocsSyncResult,
} from '@scoutbook/types';
import { UpsertDocsSyncConnectionDto } from '@api/docs-sync/dto/upsert-docs-sync-connection.dto.js';
import { GithubConnection } from '@api/docs-sync/entities/github-connection.entity.js';
import {
  GITHUB_API_CLIENT,
  normalizeGithubRepoUrl,
  parseGithubRepoUrl,
  type GithubApiClient,
} from '@api/docs-sync/github/github-api.client.js';
import {
  generateDocsMarkdown,
  type FeatureBundle,
  type RelationEdge,
} from '@api/docs-sync/markdown/generate-docs.js';
import {
  decryptToken,
  encryptToken,
  tokenLastFour,
} from '@api/docs-sync/token-crypto.js';
import { Feature } from '@api/features/entities/feature.entity.js';
import { FeatureRelation } from '@api/features/entities/feature-relation.entity.js';
import { FeatureRfcCheck } from '@api/features/entities/feature-rfc-check.entity.js';
import { RaciAssignment } from '@api/features/entities/raci-assignment.entity.js';
import { ScoutingEntry } from '@api/features/entities/scouting-entry.entity.js';

@Injectable()
export class DocsSyncService {
  constructor(
    @InjectRepository(GithubConnection)
    private readonly connectionRepo: Repository<GithubConnection>,
    @InjectRepository(Feature)
    private readonly featuresRepo: Repository<Feature>,
    @InjectRepository(ScoutingEntry)
    private readonly scoutingRepo: Repository<ScoutingEntry>,
    @InjectRepository(FeatureRfcCheck)
    private readonly rfcCheckRepo: Repository<FeatureRfcCheck>,
    @InjectRepository(RaciAssignment)
    private readonly raciRepo: Repository<RaciAssignment>,
    @InjectRepository(FeatureRelation)
    private readonly relationsRepo: Repository<FeatureRelation>,
    @Inject(GITHUB_API_CLIENT)
    private readonly github: GithubApiClient,
    private readonly config: ConfigService,
  ) {}

  async getConnection(): Promise<DocsSyncConnection> {
    const row = await this.findSingleton();
    if (!row) {
      return {
        configured: false,
        repoUrl: null,
        hasToken: false,
        tokenLastFour: null,
        updatedAt: null,
        lastSyncAt: null,
        lastPrUrl: null,
      };
    }
    return this.toStatus(row);
  }

  async upsertConnection(
    dto: UpsertDocsSyncConnectionDto,
    userId: number,
  ): Promise<DocsSyncConnection> {
    let repoUrl: string;
    try {
      repoUrl = normalizeGithubRepoUrl(dto.repoUrl);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid repoUrl',
      );
    }

    const key = this.requireEncryptionKey();
    const existing = await this.findSingleton();
    const token = dto.token?.trim();

    if (!existing && !token) {
      throw new BadRequestException('token is required when creating a connection');
    }

    if (existing) {
      existing.repoUrl = repoUrl;
      existing.updatedByUserId = userId;
      if (token) {
        existing.encryptedToken = encryptToken(token, key);
        existing.tokenLastFour = tokenLastFour(token);
      }
      const saved = await this.connectionRepo.save(existing);
      return this.toStatus(saved);
    }

    const created = this.connectionRepo.create({
      repoUrl,
      encryptedToken: encryptToken(token!, key),
      tokenLastFour: tokenLastFour(token!),
      updatedByUserId: userId,
      lastSyncAt: null,
      lastPrUrl: null,
    });
    const saved = await this.connectionRepo.save(created);
    return this.toStatus(saved);
  }

  async deleteConnection(): Promise<void> {
    const row = await this.findSingleton();
    if (!row) {
      throw new NotFoundException('No GitHub docs sync connection configured');
    }
    await this.connectionRepo.remove(row);
  }

  async sync(): Promise<DocsSyncResult> {
    const row = await this.findSingleton();
    if (!row) {
      throw new NotFoundException('No GitHub docs sync connection configured');
    }
    const key = this.requireEncryptionKey();
    const token = decryptToken(row.encryptedToken, key);
    const repo = parseGithubRepoUrl(row.repoUrl);
    const files = await this.buildMarkdownFiles();
    const branch = `scoutbook/docs-sync-${Math.floor(Date.now() / 1000)}`;

    let result: DocsSyncResult;
    try {
      result = await this.github.openDocsPr({
        token,
        repo,
        branch,
        files,
        commitMessage: 'chore: sync Scoutbook feature docs',
        prTitle: 'Scoutbook docs sync',
        prBody:
          'Automated PR from Scoutbook. Review generated Feature docs under `docs/features/`.',
      });
    } catch (error) {
      throw new ServiceUnavailableException(
        error instanceof Error
          ? `GitHub sync failed: ${error.message}`
          : 'GitHub sync failed',
      );
    }

    row.lastSyncAt = new Date();
    row.lastPrUrl = result.prUrl;
    await this.connectionRepo.save(row);
    return result;
  }

  private async buildMarkdownFiles() {
    const features = await this.featuresRepo.find({ order: { id: 'ASC' } });
    const featureIds = features.map((f) => f.id);
    const [scouting, rfcChecks, raci, relations] = await Promise.all([
      featureIds.length
        ? this.scoutingRepo.find({ where: { featureId: In(featureIds) } })
        : Promise.resolve([]),
      featureIds.length
        ? this.rfcCheckRepo.find({ where: { featureId: In(featureIds) } })
        : Promise.resolve([]),
      featureIds.length
        ? this.raciRepo.find({
            where: { featureId: In(featureIds) },
            order: { sortOrder: 'ASC', id: 'ASC' },
          })
        : Promise.resolve([]),
      this.relationsRepo.find({ order: { id: 'ASC' } }),
    ]);

    const byFeature = <T extends { featureId: number }>(rows: T[]) => {
      const map = new Map<number, T[]>();
      for (const row of rows) {
        const list = map.get(row.featureId) ?? [];
        list.push(row);
        map.set(row.featureId, list);
      }
      return map;
    };

    const scoutingMap = byFeature(scouting);
    const raciMap = byFeature(raci);
    const rfcMap = new Map(rfcChecks.map((r) => [r.featureId, r]));
    const titleById = new Map(features.map((f) => [f.id, f.title]));

    const bundles: FeatureBundle[] = features.map((feature) => {
      const check = rfcMap.get(feature.id) ?? null;
      return {
        feature: {
          id: feature.id,
          title: feature.title,
          problem: feature.problem,
          currentStage: feature.currentStage,
          riskTier: feature.riskTier,
        },
        scouting: (scoutingMap.get(feature.id) ?? []).map((row) => ({
          question: row.question,
          currentState: row.currentState,
          expected: row.expected,
          decision: row.decision,
          status: row.status,
        })),
        rfcCheck: check
          ? {
              status: check.status,
              summary: check.summary,
              changesSharedApi: check.changesSharedApi,
              newArchitecture: check.newArchitecture,
              multiAppImpact: check.multiAppImpact,
              docPath: check.docPath,
            }
          : null,
        raci: (raciMap.get(feature.id) ?? []).map((row) => ({
          stepName: row.stepName,
          poValue: row.poValue,
          pmValue: row.pmValue,
          developerValue: row.developerValue,
          qaValue: row.qaValue,
        })),
      };
    });

    const edges: RelationEdge[] = relations.map((rel) => ({
      fromId: rel.fromFeatureId,
      toId: rel.toFeatureId,
      fromTitle: titleById.get(rel.fromFeatureId) ?? `#${rel.fromFeatureId}`,
      toTitle: titleById.get(rel.toFeatureId) ?? `#${rel.toFeatureId}`,
    }));

    return generateDocsMarkdown(bundles, edges);
  }

  private async findSingleton(): Promise<GithubConnection | null> {
    const rows = await this.connectionRepo.find({
      order: { id: 'ASC' },
      take: 1,
    });
    return rows[0] ?? null;
  }

  private requireEncryptionKey(): string {
    const key = this.config.get<string>('DOCS_SYNC_ENCRYPTION_KEY');
    if (!key) {
      throw new BadRequestException(
        'DOCS_SYNC_ENCRYPTION_KEY is not configured on the API',
      );
    }
    return key;
  }

  private toStatus(row: GithubConnection): DocsSyncConnection {
    return {
      configured: true,
      repoUrl: row.repoUrl,
      hasToken: Boolean(row.encryptedToken),
      tokenLastFour: row.tokenLastFour,
      updatedAt: row.updatedAt.toISOString(),
      lastSyncAt: row.lastSyncAt ? row.lastSyncAt.toISOString() : null,
      lastPrUrl: row.lastPrUrl,
    };
  }
}
