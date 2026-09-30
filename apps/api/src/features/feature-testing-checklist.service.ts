import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  FeatureTestingChecklist as FeatureTestingChecklistContract,
  TestingChecklistStatus,
} from '@scoutbook/types';
import { UpsertFeatureTestingChecklistDto } from '@api/features/dto/upsert-feature-testing-checklist.dto.js';
import { FeatureTestingChecklist } from '@api/features/entities/feature-testing-checklist.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class FeatureTestingChecklistService {
  constructor(
    @InjectRepository(FeatureTestingChecklist)
    private readonly checklistRepo: Repository<FeatureTestingChecklist>,
    private readonly featuresService: FeaturesService,
  ) {}

  async getForFeature(
    featureId: number,
  ): Promise<FeatureTestingChecklistContract> {
    await this.featuresService.findById(featureId);
    const row = await this.checklistRepo.findOneBy({ featureId });
    if (!row) {
      throw new NotFoundException(
        `Testing checklist not found for feature ${featureId}`,
      );
    }
    return this.toContract(row);
  }

  async upsert(
    featureId: number,
    dto: UpsertFeatureTestingChecklistDto,
    userId: number,
  ): Promise<FeatureTestingChecklistContract> {
    await this.featuresService.findById(featureId);
    this.assertPayload(dto);

    let row = await this.checklistRepo.findOneBy({ featureId });
    if (!row) {
      row = this.checklistRepo.create({ featureId });
    }

    row.status = dto.status;
    row.unitOrIntegrationPassed = dto.unitOrIntegrationPassed;
    row.acceptanceValidated = dto.acceptanceValidated;
    row.noOpenDecisionRequired = dto.noOpenDecisionRequired;
    row.summary = (dto.summary ?? '').trim();
    row.notes = (dto.notes ?? '').trim();
    row.updatedByUserId = userId;

    const saved = await this.checklistRepo.save(row);
    return this.toContract(saved);
  }

  private assertPayload(dto: UpsertFeatureTestingChecklistDto): void {
    const summary = (dto.summary ?? '').trim();
    if (dto.status !== 'PASSED') {
      return;
    }
    if (
      !dto.unitOrIntegrationPassed ||
      !dto.acceptanceValidated ||
      !dto.noOpenDecisionRequired
    ) {
      throw new BadRequestException(
        'PASSED requires all three testing checklist items to be true',
      );
    }
    if (summary.length < 5) {
      throw new BadRequestException(
        'Summary must be at least 5 characters when status is PASSED',
      );
    }
  }

  private toContract(
    row: FeatureTestingChecklist,
  ): FeatureTestingChecklistContract {
    return {
      id: row.id,
      featureId: row.featureId,
      status: row.status as TestingChecklistStatus,
      unitOrIntegrationPassed: row.unitOrIntegrationPassed,
      acceptanceValidated: row.acceptanceValidated,
      noOpenDecisionRequired: row.noOpenDecisionRequired,
      summary: row.summary,
      notes: row.notes,
      updatedByUserId: row.updatedByUserId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
