import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type {
  AmbiguityTrackingItem,
  DecisionNeededItem,
  FeatureStage,
  RiskTier,
  ScoutingEntry as ScoutingEntryContract,
  ScoutingStatus,
  SeedScoutingChecklistResult,
  UserRole,
} from '@scoutbook/types';
import {
  DEFAULT_SCOUTING_CHECKLIST_QUESTIONS,
  SCOUTING_STATUSES,
} from '@scoutbook/types';
import { CreateScoutingEntryDto } from '@api/features/dto/create-scouting-entry.dto.js';
import { UpdateScoutingEntryDto } from '@api/features/dto/update-scouting-entry.dto.js';
import { Feature } from '@api/features/entities/feature.entity.js';
import { ScoutingEntry } from '@api/features/entities/scouting-entry.entity.js';
import { FeatureRaciAclService } from '@api/features/feature-raci-acl.service.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class ScoutingService {
  constructor(
    @InjectRepository(ScoutingEntry)
    private readonly scoutingRepo: Repository<ScoutingEntry>,
    @InjectRepository(Feature)
    private readonly featureRepo: Repository<Feature>,
    private readonly featuresService: FeaturesService,
    private readonly raciAcl: FeatureRaciAclService,
  ) {}

  async listForFeature(featureId: number): Promise<ScoutingEntryContract[]> {
    await this.featuresService.findById(featureId);
    const rows = await this.scoutingRepo.find({
      where: { featureId },
      order: { id: 'ASC' },
    });
    return rows.map((row) => this.toContract(row));
  }

  async listDecisionNeeded(): Promise<DecisionNeededItem[]> {
    const rows = await this.listAmbiguityTracking(['DECISION_REQUIRED']);
    return rows.map((row) => ({
      ...row,
      status: 'DECISION_REQUIRED' as const,
    }));
  }

  /**
   * Cross-feature ambiguity table (RFC 0023).
   * @param statuses — when empty/undefined, return all scouting statuses.
   */
  async listAmbiguityTracking(
    statuses?: ScoutingStatus[],
  ): Promise<AmbiguityTrackingItem[]> {
    const filtered =
      statuses && statuses.length > 0
        ? statuses.filter((s) =>
            (SCOUTING_STATUSES as readonly string[]).includes(s),
          )
        : undefined;
    if (statuses && statuses.length > 0 && (!filtered || filtered.length === 0)) {
      throw new BadRequestException(
        `status must be one of: ${SCOUTING_STATUSES.join(', ')}`,
      );
    }

    const entries = await this.scoutingRepo.find({
      where: filtered ? { status: In(filtered) } : {},
      order: { updatedAt: 'DESC', id: 'DESC' },
    });
    if (entries.length === 0) return [];

    const featureIds = [...new Set(entries.map((e) => e.featureId))];
    const features = await this.featureRepo.findBy({ id: In(featureIds) });
    const byId = new Map(features.map((f) => [f.id, f]));

    return entries.flatMap((entry) => {
      const feature = byId.get(entry.featureId);
      if (!feature) return [];
      return [
        {
          entryId: entry.id,
          featureId: feature.id,
          featureTitle: feature.title,
          featureStage: feature.currentStage as FeatureStage,
          riskTier: feature.riskTier as RiskTier,
          question: entry.question,
          currentState: entry.currentState,
          expected: entry.expected,
          decision: entry.decision,
          status: entry.status as ScoutingStatus,
          updatedAt: entry.updatedAt.toISOString(),
        },
      ];
    });
  }

  async seedChecklist(
    featureId: number,
  ): Promise<SeedScoutingChecklistResult> {
    await this.featuresService.findById(featureId);
    const existing = await this.scoutingRepo.find({ where: { featureId } });
    const present = new Set(existing.map((row) => row.question.trim()));
    const missing = DEFAULT_SCOUTING_CHECKLIST_QUESTIONS.filter(
      (question) => !present.has(question),
    );
    if (missing.length === 0) {
      return {
        seeded: false,
        added: 0,
        rows: existing.map((row) => this.toContract(row)),
      };
    }

    const entities = missing.map((question) =>
      this.scoutingRepo.create({
        featureId,
        question,
        currentState: 'Unknown',
        expected: 'To be decided',
        decision: '',
        status: 'INVESTIGATING',
      }),
    );
    await this.scoutingRepo.save(entities);
    const rows = await this.listForFeature(featureId);
    return { seeded: true, added: missing.length, rows };
  }

  async create(
    featureId: number,
    dto: CreateScoutingEntryDto,
    userRole: UserRole,
  ): Promise<ScoutingEntryContract> {
    await this.featuresService.findById(featureId);
    await this.raciAcl.assertAllowed(featureId, userRole, 'updateScouting');
    const status: ScoutingStatus = dto.status ?? 'INVESTIGATING';
    const decision = (dto.decision ?? '').trim();
    this.assertReadyHasDecision(status, decision);

    const entry = this.scoutingRepo.create({
      featureId,
      question: dto.question.trim(),
      currentState: dto.currentState.trim(),
      expected: dto.expected.trim(),
      decision,
      status,
    });
    const saved = await this.scoutingRepo.save(entry);
    return this.toContract(saved);
  }

  async update(
    featureId: number,
    entryId: number,
    dto: UpdateScoutingEntryDto,
    userRole: UserRole,
  ): Promise<ScoutingEntryContract> {
    await this.featuresService.findById(featureId);
    await this.raciAcl.assertAllowed(featureId, userRole, 'updateScouting');
    const entry = await this.scoutingRepo.findOneBy({
      id: entryId,
      featureId,
    });
    if (!entry) {
      throw new NotFoundException(
        `Scouting entry ${entryId} not found on feature ${featureId}`,
      );
    }

    if (dto.question !== undefined) entry.question = dto.question.trim();
    if (dto.currentState !== undefined) {
      entry.currentState = dto.currentState.trim();
    }
    if (dto.expected !== undefined) entry.expected = dto.expected.trim();
    if (dto.decision !== undefined) entry.decision = dto.decision.trim();
    if (dto.status !== undefined) entry.status = dto.status;

    this.assertReadyHasDecision(entry.status, entry.decision);

    const saved = await this.scoutingRepo.save(entry);
    return this.toContract(saved);
  }

  private assertReadyHasDecision(
    status: ScoutingStatus,
    decision: string,
  ): void {
    if (status === 'READY' && decision.trim().length === 0) {
      throw new BadRequestException(
        'Decision is required when status is READY',
      );
    }
  }

  private toContract(entry: ScoutingEntry): ScoutingEntryContract {
    return {
      id: entry.id,
      featureId: entry.featureId,
      question: entry.question,
      currentState: entry.currentState,
      expected: entry.expected,
      decision: entry.decision,
      status: entry.status,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    };
  }
}
