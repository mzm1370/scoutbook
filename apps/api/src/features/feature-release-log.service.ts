import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  FeatureReleaseLog as FeatureReleaseLogContract,
  ReleaseLogStatus,
} from '@scoutbook/types';
import { UpsertFeatureReleaseLogDto } from '@api/features/dto/upsert-feature-release-log.dto.js';
import { FeatureReleaseLog } from '@api/features/entities/feature-release-log.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class FeatureReleaseLogService {
  constructor(
    @InjectRepository(FeatureReleaseLog)
    private readonly releaseLogRepo: Repository<FeatureReleaseLog>,
    private readonly featuresService: FeaturesService,
  ) {}

  async getForFeature(featureId: number): Promise<FeatureReleaseLogContract> {
    await this.featuresService.findById(featureId);
    const row = await this.releaseLogRepo.findOneBy({ featureId });
    if (!row) {
      throw new NotFoundException(
        `Release log not found for feature ${featureId}`,
      );
    }
    return this.toContract(row);
  }

  async upsert(
    featureId: number,
    dto: UpsertFeatureReleaseLogDto,
    userId: number,
  ): Promise<FeatureReleaseLogContract> {
    await this.featuresService.findById(featureId);
    this.assertPayload(dto);

    let row = await this.releaseLogRepo.findOneBy({ featureId });
    if (!row) {
      row = this.releaseLogRepo.create({ featureId });
    }

    row.status = dto.status;
    row.summary = (dto.summary ?? '').trim();
    row.watchStarted = dto.watchStarted;
    row.notes = (dto.notes ?? '').trim();
    row.updatedByUserId = userId;

    const saved = await this.releaseLogRepo.save(row);
    return this.toContract(saved);
  }

  private assertPayload(dto: UpsertFeatureReleaseLogDto): void {
    const summary = (dto.summary ?? '').trim();
    if (dto.status === 'NOT_STARTED') {
      return;
    }
    if (summary.length < 5) {
      throw new BadRequestException(
        'Summary must be at least 5 characters when status is beyond NOT_STARTED',
      );
    }
    if (
      (dto.status === 'OBSERVING' || dto.status === 'STABLE') &&
      !dto.watchStarted
    ) {
      throw new BadRequestException(
        'watchStarted must be true when status is OBSERVING or STABLE',
      );
    }
  }

  private toContract(row: FeatureReleaseLog): FeatureReleaseLogContract {
    return {
      id: row.id,
      featureId: row.featureId,
      status: row.status as ReleaseLogStatus,
      summary: row.summary,
      watchStarted: row.watchStarted,
      notes: row.notes,
      updatedByUserId: row.updatedByUserId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
