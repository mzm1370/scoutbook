import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  FeatureReviewChecklist as FeatureReviewChecklistContract,
  ReviewChecklistStatus,
} from '@scoutbook/types';
import { UpsertFeatureReviewChecklistDto } from '@api/features/dto/upsert-feature-review-checklist.dto.js';
import { FeatureReviewChecklist } from '@api/features/entities/feature-review-checklist.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class FeatureReviewChecklistService {
  constructor(
    @InjectRepository(FeatureReviewChecklist)
    private readonly checklistRepo: Repository<FeatureReviewChecklist>,
    private readonly featuresService: FeaturesService,
  ) {}

  async getForFeature(
    featureId: number,
  ): Promise<FeatureReviewChecklistContract> {
    await this.featuresService.findById(featureId);
    const row = await this.checklistRepo.findOneBy({ featureId });
    if (!row) {
      throw new NotFoundException(
        `Review checklist not found for feature ${featureId}`,
      );
    }
    return this.toContract(row);
  }

  async upsert(
    featureId: number,
    dto: UpsertFeatureReviewChecklistDto,
    userId: number,
  ): Promise<FeatureReviewChecklistContract> {
    await this.featuresService.findById(featureId);
    this.assertPayload(dto);

    let row = await this.checklistRepo.findOneBy({ featureId });
    if (!row) {
      row = this.checklistRepo.create({ featureId });
    }

    row.status = dto.status;
    row.acceptanceCriteriaMet = dto.acceptanceCriteriaMet;
    row.noOpenDecisionRequired = dto.noOpenDecisionRequired;
    row.rfcResolved = dto.rfcResolved;
    row.testingEvidenceReviewed = dto.testingEvidenceReviewed;
    row.docsUpdatedIfNeeded = dto.docsUpdatedIfNeeded;
    row.summary = (dto.summary ?? '').trim();
    row.notes = (dto.notes ?? '').trim();
    row.updatedByUserId = userId;

    const saved = await this.checklistRepo.save(row);
    return this.toContract(saved);
  }

  private assertPayload(dto: UpsertFeatureReviewChecklistDto): void {
    const summary = (dto.summary ?? '').trim();
    if (dto.status !== 'APPROVED') {
      return;
    }
    if (
      !dto.acceptanceCriteriaMet ||
      !dto.noOpenDecisionRequired ||
      !dto.rfcResolved ||
      !dto.testingEvidenceReviewed ||
      !dto.docsUpdatedIfNeeded
    ) {
      throw new BadRequestException(
        'APPROVED requires all five review checklist items to be true',
      );
    }
    if (summary.length < 5) {
      throw new BadRequestException(
        'Summary must be at least 5 characters when status is APPROVED',
      );
    }
  }

  private toContract(
    row: FeatureReviewChecklist,
  ): FeatureReviewChecklistContract {
    return {
      id: row.id,
      featureId: row.featureId,
      status: row.status as ReviewChecklistStatus,
      acceptanceCriteriaMet: row.acceptanceCriteriaMet,
      noOpenDecisionRequired: row.noOpenDecisionRequired,
      rfcResolved: row.rfcResolved,
      testingEvidenceReviewed: row.testingEvidenceReviewed,
      docsUpdatedIfNeeded: row.docsUpdatedIfNeeded,
      summary: row.summary,
      notes: row.notes,
      updatedByUserId: row.updatedByUserId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
