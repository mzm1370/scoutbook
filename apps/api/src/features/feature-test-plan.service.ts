import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  FeatureTestPlan as FeatureTestPlanContract,
  TestPlanStatus,
} from '@scoutbook/types';
import { UpsertFeatureTestPlanDto } from '@api/features/dto/upsert-feature-test-plan.dto.js';
import { FeatureTestPlan } from '@api/features/entities/feature-test-plan.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class FeatureTestPlanService {
  constructor(
    @InjectRepository(FeatureTestPlan)
    private readonly planRepo: Repository<FeatureTestPlan>,
    private readonly featuresService: FeaturesService,
  ) {}

  async getForFeature(featureId: number): Promise<FeatureTestPlanContract> {
    await this.featuresService.findById(featureId);
    const row = await this.planRepo.findOneBy({ featureId });
    if (!row) {
      throw new NotFoundException(
        `Test plan not found for feature ${featureId}`,
      );
    }
    return this.toContract(row);
  }

  async findEntity(featureId: number): Promise<FeatureTestPlan | null> {
    return this.planRepo.findOneBy({ featureId });
  }

  async upsert(
    featureId: number,
    dto: UpsertFeatureTestPlanDto,
    userId: number,
  ): Promise<FeatureTestPlanContract> {
    await this.featuresService.findById(featureId);
    this.assertPayload(dto);

    let row = await this.planRepo.findOneBy({ featureId });
    if (!row) {
      row = this.planRepo.create({ featureId });
    }

    row.status = dto.status;
    row.unitPlanned = dto.unitPlanned;
    row.integrationPlanned = dto.integrationPlanned;
    row.e2ePlanned = dto.e2ePlanned;
    row.summary = (dto.summary ?? '').trim();
    row.notes = (dto.notes ?? '').trim();
    row.updatedByUserId = userId;

    const saved = await this.planRepo.save(row);
    return this.toContract(saved);
  }

  private assertPayload(dto: UpsertFeatureTestPlanDto): void {
    const anyTrue =
      dto.unitPlanned || dto.integrationPlanned || dto.e2ePlanned;
    const summary = (dto.summary ?? '').trim();

    if (dto.status === 'NOT_NEEDED' && anyTrue) {
      throw new BadRequestException(
        'NOT_NEEDED requires unit, integration, and e2e checkboxes off',
      );
    }
    if (dto.status === 'READY') {
      if (!anyTrue) {
        throw new BadRequestException(
          'READY requires at least one of unit, integration, or e2e planned',
        );
      }
      if (summary.length < 5) {
        throw new BadRequestException(
          'Summary must be at least 5 characters when status is READY',
        );
      }
    }
  }

  private toContract(row: FeatureTestPlan): FeatureTestPlanContract {
    return {
      id: row.id,
      featureId: row.featureId,
      status: row.status as TestPlanStatus,
      unitPlanned: row.unitPlanned,
      integrationPlanned: row.integrationPlanned,
      e2ePlanned: row.e2ePlanned,
      summary: row.summary,
      notes: row.notes,
      updatedByUserId: row.updatedByUserId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
