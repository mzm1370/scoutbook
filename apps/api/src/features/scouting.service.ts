import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type {
  DecisionNeededItem,
  FeatureStage,
  RiskTier,
  ScoutingEntry as ScoutingEntryContract,
  ScoutingStatus,
} from '@scoutbook/types';
import { CreateScoutingEntryDto } from '@api/features/dto/create-scouting-entry.dto.js';
import { UpdateScoutingEntryDto } from '@api/features/dto/update-scouting-entry.dto.js';
import { Feature } from '@api/features/entities/feature.entity.js';
import { ScoutingEntry } from '@api/features/entities/scouting-entry.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class ScoutingService {
  constructor(
    @InjectRepository(ScoutingEntry)
    private readonly scoutingRepo: Repository<ScoutingEntry>,
    @InjectRepository(Feature)
    private readonly featureRepo: Repository<Feature>,
    private readonly featuresService: FeaturesService,
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
    const entries = await this.scoutingRepo.find({
      where: { status: 'DECISION_REQUIRED' },
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
          status: 'DECISION_REQUIRED' as const,
          updatedAt: entry.updatedAt.toISOString(),
        },
      ];
    });
  }

  async create(
    featureId: number,
    dto: CreateScoutingEntryDto,
  ): Promise<ScoutingEntryContract> {
    await this.featuresService.findById(featureId);
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
  ): Promise<ScoutingEntryContract> {
    await this.featuresService.findById(featureId);
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
