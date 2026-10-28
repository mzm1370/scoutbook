import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  FeatureTestHealth as FeatureTestHealthContract,
  TestHealthStatus,
} from '@scoutbook/types';
import { UpsertFeatureTestHealthDto } from '@api/features/dto/upsert-feature-test-health.dto.js';
import { FeatureTestHealth } from '@api/features/entities/feature-test-health.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class FeatureTestHealthService {
  constructor(
    @InjectRepository(FeatureTestHealth)
    private readonly healthRepo: Repository<FeatureTestHealth>,
    private readonly featuresService: FeaturesService,
  ) {}

  async getForFeature(featureId: number): Promise<FeatureTestHealthContract> {
    await this.featuresService.findById(featureId);
    const row = await this.healthRepo.findOneBy({ featureId });
    if (!row) {
      throw new NotFoundException(
        `Test health not found for feature ${featureId}`,
      );
    }
    return this.toContract(row);
  }

  async upsert(
    featureId: number,
    dto: UpsertFeatureTestHealthDto,
    userId: number,
  ): Promise<FeatureTestHealthContract> {
    await this.featuresService.findById(featureId);
    this.assertPayload(dto);

    let row = await this.healthRepo.findOneBy({ featureId });
    if (!row) {
      row = this.healthRepo.create({ featureId });
    }

    row.status = dto.status;
    row.failureRateChecked = dto.failureRateChecked;
    row.flakyChecked = dto.flakyChecked;
    row.durationChecked = dto.durationChecked;
    row.failureRatePct = this.nullableInt(dto.failureRatePct);
    row.flakyCount = this.nullableInt(dto.flakyCount);
    row.durationMinutes = this.nullableInt(dto.durationMinutes);
    row.summary = (dto.summary ?? '').trim();
    row.notes = (dto.notes ?? '').trim();
    row.updatedByUserId = userId;

    const saved = await this.healthRepo.save(row);
    return this.toContract(saved);
  }

  private nullableInt(value: number | null | undefined): number | null {
    if (value === undefined || value === null) return null;
    return value;
  }

  private assertPayload(dto: UpsertFeatureTestHealthDto): void {
    const anyCheck =
      dto.failureRateChecked || dto.flakyChecked || dto.durationChecked;
    const allChecks =
      dto.failureRateChecked && dto.flakyChecked && dto.durationChecked;
    const summary = (dto.summary ?? '').trim();
    const anyMetric =
      dto.failureRatePct != null ||
      dto.flakyCount != null ||
      dto.durationMinutes != null;

    if (dto.status === 'NOT_NEEDED') {
      if (anyCheck || anyMetric) {
        throw new BadRequestException(
          'NOT_NEEDED requires all watch checkboxes off and no metrics',
        );
      }
    }
    if (dto.status === 'HEALTHY') {
      if (!allChecks) {
        throw new BadRequestException(
          'HEALTHY requires failure rate, flaky, and duration checked',
        );
      }
      if (summary.length < 5) {
        throw new BadRequestException(
          'Summary must be at least 5 characters when status is HEALTHY',
        );
      }
    }
    if (dto.status === 'AT_RISK' && summary.length < 5) {
      throw new BadRequestException(
        'Summary must be at least 5 characters when status is AT_RISK',
      );
    }
  }

  private toContract(row: FeatureTestHealth): FeatureTestHealthContract {
    return {
      id: row.id,
      featureId: row.featureId,
      status: row.status as TestHealthStatus,
      failureRateChecked: row.failureRateChecked,
      flakyChecked: row.flakyChecked,
      durationChecked: row.durationChecked,
      failureRatePct: row.failureRatePct,
      flakyCount: row.flakyCount,
      durationMinutes: row.durationMinutes,
      summary: row.summary,
      notes: row.notes,
      updatedByUserId: row.updatedByUserId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
