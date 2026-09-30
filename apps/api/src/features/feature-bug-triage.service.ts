import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  BugTriageRisk,
  BugTriageStatus,
  BugTriageType,
  FeatureBugTriage as FeatureBugTriageContract,
} from '@scoutbook/types';
import { CreateFeatureBugTriageDto } from '@api/features/dto/create-feature-bug-triage.dto.js';
import { UpdateFeatureBugTriageDto } from '@api/features/dto/update-feature-bug-triage.dto.js';
import { FeatureBugTriage } from '@api/features/entities/feature-bug-triage.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class FeatureBugTriageService {
  constructor(
    @InjectRepository(FeatureBugTriage)
    private readonly bugRepo: Repository<FeatureBugTriage>,
    private readonly featuresService: FeaturesService,
  ) {}

  async listForFeature(featureId: number): Promise<FeatureBugTriageContract[]> {
    await this.featuresService.findById(featureId);
    const rows = await this.bugRepo.find({
      where: { featureId },
      order: { id: 'ASC' },
    });
    return rows.map((row) => this.toContract(row));
  }

  async create(
    featureId: number,
    dto: CreateFeatureBugTriageDto,
    userId: number,
  ): Promise<FeatureBugTriageContract> {
    await this.featuresService.findById(featureId);

    const entry = this.bugRepo.create({
      featureId,
      whatHappened: dto.whatHappened.trim(),
      expected: dto.expected.trim(),
      reproduce: (dto.reproduce ?? '').trim(),
      bugType: dto.bugType,
      riskTier: dto.riskTier ?? 'UNKNOWN',
      status: dto.status ?? 'OPEN',
      createdByUserId: userId,
    });
    const saved = await this.bugRepo.save(entry);
    return this.toContract(saved);
  }

  async update(
    featureId: number,
    bugId: number,
    dto: UpdateFeatureBugTriageDto,
  ): Promise<FeatureBugTriageContract> {
    await this.featuresService.findById(featureId);
    const entry = await this.bugRepo.findOneBy({ id: bugId, featureId });
    if (!entry) {
      throw new NotFoundException(
        `Bug triage ${bugId} not found on feature ${featureId}`,
      );
    }

    if (dto.whatHappened !== undefined) {
      entry.whatHappened = dto.whatHappened.trim();
    }
    if (dto.expected !== undefined) entry.expected = dto.expected.trim();
    if (dto.reproduce !== undefined) entry.reproduce = dto.reproduce.trim();
    if (dto.bugType !== undefined) entry.bugType = dto.bugType;
    if (dto.riskTier !== undefined) entry.riskTier = dto.riskTier;
    if (dto.status !== undefined) entry.status = dto.status;

    const saved = await this.bugRepo.save(entry);
    return this.toContract(saved);
  }

  private toContract(row: FeatureBugTriage): FeatureBugTriageContract {
    return {
      id: row.id,
      featureId: row.featureId,
      whatHappened: row.whatHappened,
      expected: row.expected,
      reproduce: row.reproduce,
      bugType: row.bugType as BugTriageType,
      riskTier: row.riskTier as BugTriageRisk,
      status: row.status as BugTriageStatus,
      createdByUserId: row.createdByUserId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
