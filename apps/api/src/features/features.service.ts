import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AdvanceFeatureStageDto } from '@api/features/dto/advance-feature-stage.dto.js';
import { CreateFeatureDto } from '@api/features/dto/create-feature.dto.js';
import { UpdateFeatureDto } from '@api/features/dto/update-feature.dto.js';
import { Feature } from '@api/features/entities/feature.entity.js';
import { FeatureImplementationLog } from '@api/features/entities/feature-implementation-log.entity.js';
import { FeatureReviewChecklist } from '@api/features/entities/feature-review-checklist.entity.js';
import { FeatureRfcCheck } from '@api/features/entities/feature-rfc-check.entity.js';
import { FeatureRfcDocument } from '@api/features/entities/feature-rfc-document.entity.js';
import { FeatureStageHistory } from '@api/features/entities/feature-stage-history.entity.js';
import { FeatureTestingChecklist } from '@api/features/entities/feature-testing-checklist.entity.js';
import { FeatureTestPlan } from '@api/features/entities/feature-test-plan.entity.js';
import { FeatureUxDesign } from '@api/features/entities/feature-ux-design.entity.js';
import { RaciAssignment } from '@api/features/entities/raci-assignment.entity.js';
import { ScoutingEntry } from '@api/features/entities/scouting-entry.entity.js';
import {
  assertImmediateNextStage,
  SCOUTING_BLOCKING_STATUSES,
} from '@api/features/feature-stage.js';
import {
  assertProcessTrackAllowed,
  type Feature as FeatureContract,
  type FeatureProcessTrack,
  type FeatureStage,
  type FeatureStageHistory as FeatureStageHistoryContract,
  type RiskTier,
} from '@scoutbook/types';

const TRACK_EDITABLE_STAGES: FeatureStage[] = [
  'IDEA',
  'SCOUTING',
  'RFC',
  'RACI',
];

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private readonly featuresRepo: Repository<Feature>,
    @InjectRepository(ScoutingEntry)
    private readonly scoutingRepo: Repository<ScoutingEntry>,
    @InjectRepository(FeatureRfcCheck)
    private readonly rfcCheckRepo: Repository<FeatureRfcCheck>,
    @InjectRepository(FeatureRfcDocument)
    private readonly rfcDocumentRepo: Repository<FeatureRfcDocument>,
    @InjectRepository(FeatureUxDesign)
    private readonly uxDesignRepo: Repository<FeatureUxDesign>,
    @InjectRepository(FeatureTestPlan)
    private readonly testPlanRepo: Repository<FeatureTestPlan>,
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
    this.assertTrackAllowed(dto.processTrack, dto.riskTier);
    const feature = this.featuresRepo.create({
      title: dto.title.trim(),
      problem: dto.problem.trim(),
      riskTier: dto.riskTier,
      processTrack: dto.processTrack,
      currentStage: 'IDEA',
      createdByUserId,
    });
    const saved = await this.featuresRepo.save(feature);
    await this.recordStageChange(saved.id, null, 'IDEA', createdByUserId);
    return this.toContract(saved);
  }

  async update(
    id: number,
    dto: UpdateFeatureDto,
  ): Promise<FeatureContract> {
    if (dto.riskTier === undefined && dto.processTrack === undefined) {
      throw new BadRequestException(
        'Provide processTrack and/or riskTier to update',
      );
    }
    const feature = await this.requireEntity(id);
    if (!TRACK_EDITABLE_STAGES.includes(feature.currentStage as FeatureStage)) {
      throw new BadRequestException(
        'Process track and risk are locked after Implementation starts',
      );
    }
    const nextRisk = dto.riskTier ?? feature.riskTier;
    const nextTrack = dto.processTrack ?? feature.processTrack;
    this.assertTrackAllowed(nextTrack, nextRisk);
    if (dto.riskTier !== undefined) {
      feature.riskTier = dto.riskTier;
    }
    if (dto.processTrack !== undefined) {
      feature.processTrack = dto.processTrack;
    }
    const saved = await this.featuresRepo.save(feature);
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
      await this.assertRfcCheckReadyForRaci(feature);
      await this.assertUxDesignReadyForRaci(feature);
    }

    if (fromStage === 'RACI' && dto.stage === 'IMPLEMENTATION') {
      await this.assertRaciReadyForImplementation(id);
      await this.assertTestPlanReadyForImplementation(feature);
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

  private async assertRfcCheckReadyForRaci(feature: Feature): Promise<void> {
    const featureId = feature.id;
    const track = feature.processTrack;
    const row = await this.rfcCheckRepo.findOneBy({ featureId });
    if (!row) {
      throw new BadRequestException(
        track === 'LIGHT'
          ? 'Save an RFC check as Not needed before leaving RFC on Light track'
          : 'Save an Accepted RFC check and document before leaving RFC',
      );
    }
    if (track === 'LIGHT') {
      if (row.status !== 'NOT_NEEDED') {
        throw new BadRequestException(
          `Light track requires RFC check NOT_NEEDED before RACI (got ${row.status})`,
        );
      }
      return;
    }
    if (row.status !== 'ACCEPTED') {
      throw new BadRequestException(
        `RFC track requires check ACCEPTED before RACI (got ${row.status})`,
      );
    }
    const doc = await this.rfcDocumentRepo.findOneBy({ featureId });
    if (!doc || doc.status !== 'ACCEPTED') {
      throw new BadRequestException(
        'RFC track requires an Accepted RFC document before leaving RFC',
      );
    }
  }

  private async assertUxDesignReadyForRaci(feature: Feature): Promise<void> {
    const row = await this.uxDesignRepo.findOneBy({ featureId: feature.id });
    if (!row) {
      throw new BadRequestException(
        feature.processTrack === 'LIGHT'
          ? 'Save UX design as Not needed or Ready before leaving RFC'
          : 'Save UX design as Ready (all four UI states) before leaving RFC',
      );
    }
    if (feature.processTrack === 'LIGHT') {
      if (row.status !== 'NOT_NEEDED' && row.status !== 'READY') {
        throw new BadRequestException(
          `Light track requires UX design NOT_NEEDED or READY before RACI (got ${row.status})`,
        );
      }
      return;
    }
    if (row.status !== 'READY') {
      throw new BadRequestException(
        `RFC track requires UX design READY before RACI (got ${row.status})`,
      );
    }
  }

  private async assertTestPlanReadyForImplementation(
    feature: Feature,
  ): Promise<void> {
    const row = await this.testPlanRepo.findOneBy({ featureId: feature.id });
    if (!row) {
      throw new BadRequestException(
        feature.processTrack === 'LIGHT'
          ? 'Save test plan as Not needed or Ready before leaving RACI'
          : 'Save test plan as Ready (at least one test layer) before leaving RACI',
      );
    }
    if (feature.processTrack === 'LIGHT') {
      if (row.status !== 'NOT_NEEDED' && row.status !== 'READY') {
        throw new BadRequestException(
          `Light track requires test plan NOT_NEEDED or READY before Implementation (got ${row.status})`,
        );
      }
      return;
    }
    if (row.status !== 'READY') {
      throw new BadRequestException(
        `RFC track requires test plan READY before Implementation (got ${row.status})`,
      );
    }
  }

  private assertTrackAllowed(
    track: FeatureProcessTrack,
    riskTier: RiskTier,
  ): void {
    const message = assertProcessTrackAllowed(track, riskTier);
    if (message) {
      throw new BadRequestException(message);
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
        row.designerValue,
        row.techLeadValue,
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
      processTrack: feature.processTrack,
      currentStage: feature.currentStage as FeatureStage,
      createdByUserId: feature.createdByUserId,
      createdAt: feature.createdAt.toISOString(),
      updatedAt: feature.updatedAt.toISOString(),
    };
  }
}
