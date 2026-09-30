import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AdvanceFeatureStageDto } from '@api/features/dto/advance-feature-stage.dto.js';
import { CreateFeatureDto } from '@api/features/dto/create-feature.dto.js';
import { Feature } from '@api/features/entities/feature.entity.js';
import { FeatureImplementationLog } from '@api/features/entities/feature-implementation-log.entity.js';
import { FeatureReviewChecklist } from '@api/features/entities/feature-review-checklist.entity.js';
import { FeatureRfcCheck } from '@api/features/entities/feature-rfc-check.entity.js';
import { FeatureStageHistory } from '@api/features/entities/feature-stage-history.entity.js';
import { FeatureTestingChecklist } from '@api/features/entities/feature-testing-checklist.entity.js';
import { RaciAssignment } from '@api/features/entities/raci-assignment.entity.js';
import { ScoutingEntry } from '@api/features/entities/scouting-entry.entity.js';
import {
  assertImmediateNextStage,
  SCOUTING_BLOCKING_STATUSES,
} from '@api/features/feature-stage.js';
import type {
  Feature as FeatureContract,
  FeatureStage,
  FeatureStageHistory as FeatureStageHistoryContract,
} from '@scoutbook/types';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private readonly featuresRepo: Repository<Feature>,
    @InjectRepository(ScoutingEntry)
    private readonly scoutingRepo: Repository<ScoutingEntry>,
    @InjectRepository(FeatureRfcCheck)
    private readonly rfcCheckRepo: Repository<FeatureRfcCheck>,
    @InjectRepository(RaciAssignment)
    private readonly raciRepo: Repository<RaciAssignment>,
    @InjectRepository(FeatureImplementationLog)
    private readonly implementationLogRepo: Repository<FeatureImplementationLog>,
    @InjectRepository(FeatureTestingChecklist)
    private readonly testingChecklistRepo: Repository<FeatureTestingChecklist>,
    @InjectRepository(FeatureReviewChecklist)
    private readonly reviewChecklistRepo: Repository<FeatureReviewChecklist>,
    @InjectRepository(FeatureStageHistory)
    private readonly stageHistoryRepo: Repository<FeatureStageHistory>,
  ) {}

  async create(
    dto: CreateFeatureDto,
    createdByUserId: number,
  ): Promise<FeatureContract> {
    const feature = this.featuresRepo.create({
      title: dto.title.trim(),
      problem: dto.problem.trim(),
      riskTier: dto.riskTier,
      currentStage: 'IDEA',
      createdByUserId,
    });
    const saved = await this.featuresRepo.save(feature);
    await this.recordStageChange(saved.id, null, 'IDEA', createdByUserId);
    return this.toContract(saved);
  }

  async findAll(): Promise<FeatureContract[]> {
    const rows = await this.featuresRepo.find({
      order: { updatedAt: 'DESC' },
    });
    return rows.map((row) => this.toContract(row));
  }

  async findById(id: number): Promise<FeatureContract> {
    const feature = await this.requireEntity(id);
    return this.toContract(feature);
  }

  async listStageHistory(
    featureId: number,
  ): Promise<FeatureStageHistoryContract[]> {
    await this.requireEntity(featureId);
    const rows = await this.stageHistoryRepo.find({
      where: { featureId },
      order: { id: 'ASC' },
    });
    return rows.map((row) => this.toHistoryContract(row));
  }

  async advanceStage(
    id: number,
    dto: AdvanceFeatureStageDto,
    changedByUserId: number,
  ): Promise<FeatureContract> {
    const feature = await this.requireEntity(id);
    const fromStage = feature.currentStage as FeatureStage;
    const check = assertImmediateNextStage(fromStage, dto.stage);
    if (!check.ok) {
      throw new BadRequestException(check.message);
    }

    if (fromStage === 'SCOUTING' && dto.stage === 'RFC') {
      await this.assertScoutingClearForRfc(id);
    }

    if (fromStage === 'RFC' && dto.stage === 'RACI') {
      await this.assertRfcCheckReadyForRaci(id);
    }

    if (fromStage === 'RACI' && dto.stage === 'IMPLEMENTATION') {
      await this.assertRaciReadyForImplementation(id);
    }

    if (fromStage === 'IMPLEMENTATION' && dto.stage === 'TESTING') {
      await this.assertImplementationReadyForTesting(id);
    }

    if (fromStage === 'TESTING' && dto.stage === 'REVIEW') {
      await this.assertTestingReadyForReview(id);
    }

    if (fromStage === 'REVIEW' && dto.stage === 'RELEASE') {
      await this.assertReviewReadyForRelease(id);
    }

    feature.currentStage = dto.stage;
    const saved = await this.featuresRepo.save(feature);
    await this.recordStageChange(
      saved.id,
      fromStage,
      dto.stage,
      changedByUserId,
    );
    return this.toContract(saved);
  }

  private async assertScoutingClearForRfc(featureId: number): Promise<void> {
    const blockers = await this.scoutingRepo.count({
      where: {
        featureId,
        status: In([...SCOUTING_BLOCKING_STATUSES]),
      },
    });
    if (blockers > 0) {
      throw new BadRequestException(
        `Cannot leave SCOUTING while ${blockers} scouting row(s) are still Decision required, Investigating, or Blocked`,
      );
    }
  }

  private async assertRfcCheckReadyForRaci(featureId: number): Promise<void> {
    const row = await this.rfcCheckRepo.findOneBy({ featureId });
    if (!row) {
      throw new BadRequestException(
        'Save an RFC check (Not needed or Accepted) before leaving RFC',
      );
    }
    if (row.status !== 'NOT_NEEDED' && row.status !== 'ACCEPTED') {
      throw new BadRequestException(
        `Cannot leave RFC while check status is ${row.status} (need NOT_NEEDED or ACCEPTED)`,
      );
    }
  }

  private async assertRaciReadyForImplementation(
    featureId: number,
  ): Promise<void> {
    const rows = await this.raciRepo.find({ where: { featureId } });
    if (rows.length === 0) {
      throw new BadRequestException(
        'Add or seed a RACI matrix before leaving RACI',
      );
    }
    for (const row of rows) {
      const values = [
        row.poValue,
        row.pmValue,
        row.developerValue,
        row.qaValue,
      ];
      const hasR = values.includes('R');
      const hasA = values.includes('A');
      if (!hasR || !hasA) {
        throw new BadRequestException(
          `RACI step "${row.stepName}" needs at least one R and one A`,
        );
      }
    }
  }

  private async assertImplementationReadyForTesting(
    featureId: number,
  ): Promise<void> {
    const row = await this.implementationLogRepo.findOneBy({ featureId });
    if (!row) {
      throw new BadRequestException(
        'Save an implementation log (Ready for test) before leaving Implementation',
      );
    }
    if (row.status !== 'READY_FOR_TEST') {
      throw new BadRequestException(
        `Cannot leave IMPLEMENTATION while log status is ${row.status} (need READY_FOR_TEST)`,
      );
    }
    if (row.summary.trim().length < 5) {
      throw new BadRequestException(
        'Implementation log summary must be at least 5 characters before Testing',
      );
    }
  }

  private async assertTestingReadyForReview(
    featureId: number,
  ): Promise<void> {
    const row = await this.testingChecklistRepo.findOneBy({ featureId });
    if (!row) {
      throw new BadRequestException(
        'Save a testing checklist (Passed) before leaving Testing',
      );
    }
    if (row.status !== 'PASSED') {
      throw new BadRequestException(
        `Cannot leave TESTING while checklist status is ${row.status} (need PASSED)`,
      );
    }
    if (
      !row.unitOrIntegrationPassed ||
      !row.acceptanceValidated ||
      !row.noOpenDecisionRequired
    ) {
      throw new BadRequestException(
        'Testing checklist must have all three proof items checked before Review',
      );
    }
    if (row.summary.trim().length < 5) {
      throw new BadRequestException(
        'Testing checklist summary must be at least 5 characters before Review',
      );
    }
  }

  private async assertReviewReadyForRelease(
    featureId: number,
  ): Promise<void> {
    const row = await this.reviewChecklistRepo.findOneBy({ featureId });
    if (!row) {
      throw new BadRequestException(
        'Save a review checklist (Approved) before leaving Review',
      );
    }
    if (row.status !== 'APPROVED') {
      throw new BadRequestException(
        `Cannot leave REVIEW while checklist status is ${row.status} (need APPROVED)`,
      );
    }
    if (
      !row.acceptanceCriteriaMet ||
      !row.noOpenDecisionRequired ||
      !row.rfcResolved ||
      !row.testingEvidenceReviewed ||
      !row.docsUpdatedIfNeeded
    ) {
      throw new BadRequestException(
        'Review checklist must have all five DoD items checked before Release',
      );
    }
    if (row.summary.trim().length < 5) {
      throw new BadRequestException(
        'Review checklist summary must be at least 5 characters before Release',
      );
    }
  }

  private async requireEntity(id: number): Promise<Feature> {
    const feature = await this.featuresRepo.findOneBy({ id });
    if (!feature) {
      throw new NotFoundException(`Feature ${id} not found`);
    }
    return feature;
  }

  private async recordStageChange(
    featureId: number,
    fromStage: FeatureStage | null,
    toStage: FeatureStage,
    changedByUserId: number,
  ): Promise<void> {
    const row = this.stageHistoryRepo.create({
      featureId,
      fromStage,
      toStage,
      changedByUserId,
    });
    await this.stageHistoryRepo.save(row);
  }

  private toHistoryContract(
    row: FeatureStageHistory,
  ): FeatureStageHistoryContract {
    return {
      id: row.id,
      featureId: row.featureId,
      fromStage: row.fromStage,
      toStage: row.toStage,
      changedByUserId: row.changedByUserId,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private toContract(feature: Feature): FeatureContract {
    return {
      id: feature.id,
      title: feature.title,
      problem: feature.problem,
      riskTier: feature.riskTier,
      currentStage: feature.currentStage as FeatureStage,
      createdByUserId: feature.createdByUserId,
      createdAt: feature.createdAt.toISOString(),
      updatedAt: feature.updatedAt.toISOString(),
    };
  }
}
