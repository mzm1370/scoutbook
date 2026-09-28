import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type {
  Feature as FeatureContract,
  FeatureStage,
} from '@scoutbook/types';
import { AdvanceFeatureStageDto } from '@api/features/dto/advance-feature-stage.dto.js';
import { CreateFeatureDto } from '@api/features/dto/create-feature.dto.js';
import { Feature } from '@api/features/entities/feature.entity.js';
import { FeatureRfcCheck } from '@api/features/entities/feature-rfc-check.entity.js';
import { RaciAssignment } from '@api/features/entities/raci-assignment.entity.js';
import { ScoutingEntry } from '@api/features/entities/scouting-entry.entity.js';
import {
  assertImmediateNextStage,
  SCOUTING_BLOCKING_STATUSES,
} from '@api/features/feature-stage.js';

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

  async advanceStage(
    id: number,
    dto: AdvanceFeatureStageDto,
  ): Promise<FeatureContract> {
    const feature = await this.requireEntity(id);
    const check = assertImmediateNextStage(feature.currentStage, dto.stage);
    if (!check.ok) {
      throw new BadRequestException(check.message);
    }

    if (feature.currentStage === 'SCOUTING' && dto.stage === 'RFC') {
      await this.assertScoutingClearForRfc(id);
    }

    if (feature.currentStage === 'RFC' && dto.stage === 'RACI') {
      await this.assertRfcCheckReadyForRaci(id);
    }

    if (feature.currentStage === 'RACI' && dto.stage === 'IMPLEMENTATION') {
      await this.assertRaciReadyForImplementation(id);
    }

    feature.currentStage = dto.stage;
    const saved = await this.featuresRepo.save(feature);
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

  private async requireEntity(id: number): Promise<Feature> {
    const feature = await this.featuresRepo.findOneBy({ id });
    if (!feature) {
      throw new NotFoundException(`Feature ${id} not found`);
    }
    return feature;
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
