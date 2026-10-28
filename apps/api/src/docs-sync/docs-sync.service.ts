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
  DocsSyncAuthMode,
  DocsSyncConnection,
  DocsSyncResult,
} from '@scoutbook/types';
import { UpsertDocsSyncConnectionDto } from '@api/docs-sync/dto/upsert-docs-sync-connection.dto.js';
import { GithubConnection } from '@api/docs-sync/entities/github-connection.entity.js';
import { fetchInstallationAccessToken } from '@api/docs-sync/github/github-app-auth.js';
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
import { FeatureRfcDocument } from '@api/features/entities/feature-rfc-document.entity.js';
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
    @InjectRepository(FeatureRfcDocument)
    private readonly rfcDocumentRepo: Repository<FeatureRfcDocument>,
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
        authMode: 'PAT',
        hasToken: false,
        tokenLastFour: null,
        githubAppId: null,
        githubInstallationId: null,
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
    const authMode: DocsSyncAuthMode =
      dto.authMode ?? existing?.authMode ?? 'PAT';

    if (authMode === 'PAT') {
      return this.upsertPat(dto, userId, repoUrl, key, existing);
    }
    return this.upsertGithubApp(dto, userId, repoUrl, key, existing);
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
    let token: string;
    try {
      token = await this.resolveAccessToken(row, key);
    } catch (error) {
      throw new ServiceUnavailableException(
        error instanceof Error
          ? `GitHub auth failed: ${error.message}`
          : 'GitHub auth failed',
      );
    }
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

  private async upsertPat(
    dto: UpsertDocsSyncConnectionDto,
    userId: number,
    repoUrl: string,
    key: string,
    existing: GithubConnection | null,
  ): Promise<DocsSyncConnection> {
    const token = dto.token?.trim();
    if (!existing && !token) {
      throw new BadRequestException(
        'token is required when creating a PAT connection',
      );
    }

    if (existing) {
      existing.repoUrl = repoUrl;
      existing.authMode = 'PAT';
      existing.updatedByUserId = userId;
      existing.encryptedPrivateKey = null;
      existing.githubAppId = null;
      existing.githubInstallationId = null;
      if (token) {
        existing.encryptedToken = encryptToken(token, key);
        existing.tokenLastFour = tokenLastFour(token);
      } else if (!existing.encryptedToken) {
        throw new BadRequestException(
          'token is required when switching to PAT without an existing PAT',
        );
      }
      const saved = await this.connectionRepo.save(existing);
      return this.toStatus(saved);
    }

    const created = this.connectionRepo.create({
      repoUrl,
      authMode: 'PAT',
      encryptedToken: encryptToken(token!, key),
      encryptedPrivateKey: null,
      githubAppId: null,
      githubInstallationId: null,
      tokenLastFour: tokenLastFour(token!),
      updatedByUserId: userId,
      lastSyncAt: null,
      lastPrUrl: null,
    });
    const saved = await this.connectionRepo.save(created);
    return this.toStatus(saved);
  }

  private async upsertGithubApp(
    dto: UpsertDocsSyncConnectionDto,
    userId: number,
    repoUrl: string,
    key: string,
    existing: GithubConnection | null,
  ): Promise<DocsSyncConnection> {
    const appId = dto.githubAppId?.trim();
    const installationId = dto.githubInstallationId?.trim();
    const privateKey = dto.githubAppPrivateKey?.trim();

    if (!existing) {
      if (!appId || !installationId || !privateKey) {
        throw new BadRequestException(
          'githubAppId, githubInstallationId, and githubAppPrivateKey are required when creating a GitHub App connection',
        );
      }
      const created = this.connectionRepo.create({
        repoUrl,
        authMode: 'GITHUB_APP',
        encryptedToken: '',
        encryptedPrivateKey: encryptToken(privateKey, key),
        githubAppId: appId,
        githubInstallationId: installationId,
        tokenLastFour: tokenLastFour(installationId),
        updatedByUserId: userId,
        lastSyncAt: null,
        lastPrUrl: null,
      });
      const saved = await this.connectionRepo.save(created);
      return this.toStatus(saved);
    }

    existing.repoUrl = repoUrl;
    existing.authMode = 'GITHUB_APP';
    existing.updatedByUserId = userId;
    existing.encryptedToken = '';
    if (appId) existing.githubAppId = appId;
    if (installationId) {
      existing.githubInstallationId = installationId;
      existing.tokenLastFour = tokenLastFour(installationId);
    }
    if (privateKey) {
      existing.encryptedPrivateKey = encryptToken(privateKey, key);
    }
    if (
      !existing.githubAppId ||
      !existing.githubInstallationId ||
      !existing.encryptedPrivateKey
    ) {
      throw new BadRequestException(
        'GitHub App connection requires app id, installation id, and private key',
      );
    }
    const saved = await this.connectionRepo.save(existing);
    return this.toStatus(saved);
  }

  private async resolveAccessToken(
    row: GithubConnection,
    key: string,
  ): Promise<string> {
    if (row.authMode === 'GITHUB_APP') {
      if (
        !row.encryptedPrivateKey ||
        !row.githubAppId ||
        !row.githubInstallationId
      ) {
        throw new Error('GitHub App credentials are incomplete');
      }
      const privateKeyPem = decryptToken(row.encryptedPrivateKey, key);
      return fetchInstallationAccessToken({
        appId: row.githubAppId,
        installationId: row.githubInstallationId,
        privateKeyPem,
      });
    }
    if (!row.encryptedToken) {
      throw new Error('PAT is not configured');
    }
    return decryptToken(row.encryptedToken, key);
  }

  private async buildMarkdownFiles() {
    const features = await this.featuresRepo.find({ order: { id: 'ASC' } });
    const featureIds = features.map((f) => f.id);
    const [scouting, rfcChecks, rfcDocs, raci, relations] = await Promise.all([
      featureIds.length
        ? this.scoutingRepo.find({ where: { featureId: In(featureIds) } })
        : Promise.resolve([]),
      featureIds.length
        ? this.rfcCheckRepo.find({ where: { featureId: In(featureIds) } })
        : Promise.resolve([]),
      featureIds.length
        ? this.rfcDocumentRepo.find({ where: { featureId: In(featureIds) } })
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
    const rfcDocMap = new Map(rfcDocs.map((r) => [r.featureId, r]));
    const titleById = new Map(features.map((f) => [f.id, f.title]));

    const bundles: FeatureBundle[] = features.map((feature) => {
      const check = rfcMap.get(feature.id) ?? null;
      const doc = rfcDocMap.get(feature.id) ?? null;
      return {
        feature: {
          id: feature.id,
          title: feature.title,
          problem: feature.problem,
          currentStage: feature.currentStage,
          riskTier: feature.riskTier,
          processTrack: feature.processTrack,
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
        rfcDocument: doc
          ? {
              status: doc.status,
              summary: doc.summary,
              motivation: doc.motivation,
              detailedDesign: doc.detailedDesign,
              alternatives: doc.alternatives,
              drawbacks: doc.drawbacks,
            }
          : null,
        raci: (raciMap.get(feature.id) ?? []).map((row) => ({
          stepName: row.stepName,
          poValue: row.poValue,
          pmValue: row.pmValue,
          developerValue: row.developerValue,
          qaValue: row.qaValue,
          designerValue: row.designerValue,
          techLeadValue: row.techLeadValue,
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
    const hasToken =
      row.authMode === 'GITHUB_APP'
        ? Boolean(row.encryptedPrivateKey)
        : Boolean(row.encryptedToken);
    return {
      configured: true,
      repoUrl: row.repoUrl,
      authMode: row.authMode ?? 'PAT',
      hasToken,
      tokenLastFour: row.tokenLastFour || null,
      githubAppId: row.githubAppId,
      githubInstallationId: row.githubInstallationId,
      updatedAt: row.updatedAt.toISOString(),
      lastSyncAt: row.lastSyncAt ? row.lastSyncAt.toISOString() : null,
      lastPrUrl: row.lastPrUrl,
    };
  }
}
