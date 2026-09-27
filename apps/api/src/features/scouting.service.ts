import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  ScoutingEntry as ScoutingEntryContract,
  ScoutingStatus,
} from '@scoutbook/types';
import { CreateScoutingEntryDto } from '@api/features/dto/create-scouting-entry.dto.js';
import { UpdateScoutingEntryDto } from '@api/features/dto/update-scouting-entry.dto.js';
import { ScoutingEntry } from '@api/features/entities/scouting-entry.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class ScoutingService {
  constructor(
    @InjectRepository(ScoutingEntry)
    private readonly scoutingRepo: Repository<ScoutingEntry>,
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
