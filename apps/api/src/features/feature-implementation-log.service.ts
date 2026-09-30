import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  FeatureImplementationLog as FeatureImplementationLogContract,
  ImplementationLogStatus,
} from '@scoutbook/types';
import { UpsertFeatureImplementationLogDto } from '@api/features/dto/upsert-feature-implementation-log.dto.js';
import { FeatureImplementationLog } from '@api/features/entities/feature-implementation-log.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class FeatureImplementationLogService {
  constructor(
    @InjectRepository(FeatureImplementationLog)
    private readonly logRepo: Repository<FeatureImplementationLog>,
    private readonly featuresService: FeaturesService,
  ) {}

  async getForFeature(
    featureId: number,
  ): Promise<FeatureImplementationLogContract> {
    await this.featuresService.findById(featureId);
    const row = await this.logRepo.findOneBy({ featureId });
    if (!row) {
      throw new NotFoundException(
        `Implementation log not found for feature ${featureId}`,
      );
    }
    return this.toContract(row);
  }

  async upsert(
    featureId: number,
    dto: UpsertFeatureImplementationLogDto,
    userId: number,
  ): Promise<FeatureImplementationLogContract> {
    await this.featuresService.findById(featureId);
    this.assertPayload(dto);

    let row = await this.logRepo.findOneBy({ featureId });
    if (!row) {
      row = this.logRepo.create({ featureId });
    }

    row.status = dto.status;
    row.summary = (dto.summary ?? '').trim();
    row.branchOrPr = (dto.branchOrPr ?? '').trim();
    row.notes = (dto.notes ?? '').trim();
    row.updatedByUserId = userId;

    const saved = await this.logRepo.save(row);
    return this.toContract(saved);
  }

  private assertPayload(dto: UpsertFeatureImplementationLogDto): void {
    const summary = (dto.summary ?? '').trim();
    if (dto.status === 'READY_FOR_TEST' && summary.length < 5) {
      throw new BadRequestException(
        'Summary must be at least 5 characters when status is READY_FOR_TEST',
      );
    }
  }

  private toContract(
    row: FeatureImplementationLog,
  ): FeatureImplementationLogContract {
    return {
      id: row.id,
      featureId: row.featureId,
      status: row.status as ImplementationLogStatus,
      summary: row.summary,
      branchOrPr: row.branchOrPr,
      notes: row.notes,
      updatedByUserId: row.updatedByUserId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
