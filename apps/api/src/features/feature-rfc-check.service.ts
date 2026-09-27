import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  FeatureRfcCheck as FeatureRfcCheckContract,
  RfcCheckStatus,
  UserRole,
} from '@scoutbook/types';
import { UpsertFeatureRfcCheckDto } from '@api/features/dto/upsert-feature-rfc-check.dto.js';
import { FeatureRfcCheck } from '@api/features/entities/feature-rfc-check.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class FeatureRfcCheckService {
  constructor(
    @InjectRepository(FeatureRfcCheck)
    private readonly rfcCheckRepo: Repository<FeatureRfcCheck>,
    private readonly featuresService: FeaturesService,
  ) {}

  async getForFeature(featureId: number): Promise<FeatureRfcCheckContract> {
    await this.featuresService.findById(featureId);
    const row = await this.rfcCheckRepo.findOneBy({ featureId });
    if (!row) {
      throw new NotFoundException(
        `RFC check not found for feature ${featureId}`,
      );
    }
    return this.toContract(row);
  }

  async findEntity(featureId: number): Promise<FeatureRfcCheck | null> {
    return this.rfcCheckRepo.findOneBy({ featureId });
  }

  async upsert(
    featureId: number,
    dto: UpsertFeatureRfcCheckDto,
    userId: number,
    userRole: UserRole,
  ): Promise<FeatureRfcCheckContract> {
    await this.featuresService.findById(featureId);
    this.assertPayload(dto);

    if (dto.status === 'ACCEPTED' && userRole !== 'PO' && userRole !== 'PM') {
      throw new ForbiddenException(
        'Only PO or PM can mark an RFC check as ACCEPTED',
      );
    }

    let row = await this.rfcCheckRepo.findOneBy({ featureId });
    if (!row) {
      row = this.rfcCheckRepo.create({ featureId });
    }

    row.status = dto.status;
    row.changesSharedApi = dto.changesSharedApi;
    row.newArchitecture = dto.newArchitecture;
    row.multiAppImpact = dto.multiAppImpact;
    row.summary = (dto.summary ?? '').trim();
    row.docPath = (dto.docPath ?? '').trim();
    row.updatedByUserId = userId;

    const saved = await this.rfcCheckRepo.save(row);
    return this.toContract(saved);
  }

  private assertPayload(dto: UpsertFeatureRfcCheckDto): void {
    const anyTrue =
      dto.changesSharedApi || dto.newArchitecture || dto.multiAppImpact;
    const summary = (dto.summary ?? '').trim();

    if (dto.status === 'NOT_NEEDED' && anyTrue) {
      throw new BadRequestException(
        'NOT_NEEDED requires all three RFC checklist items to be false',
      );
    }

    if (
      (dto.status === 'NEEDED' || dto.status === 'ACCEPTED') &&
      !anyTrue
    ) {
      throw new BadRequestException(
        'NEEDED/ACCEPTED requires at least one RFC checklist item to be true',
      );
    }

    if (
      (dto.status === 'NEEDED' || dto.status === 'ACCEPTED') &&
      summary.length < 5
    ) {
      throw new BadRequestException(
        'Summary must be at least 5 characters when RFC is NEEDED or ACCEPTED',
      );
    }
  }

  private toContract(row: FeatureRfcCheck): FeatureRfcCheckContract {
    return {
      id: row.id,
      featureId: row.featureId,
      status: row.status as RfcCheckStatus,
      changesSharedApi: row.changesSharedApi,
      newArchitecture: row.newArchitecture,
      multiAppImpact: row.multiAppImpact,
      summary: row.summary,
      docPath: row.docPath,
      updatedByUserId: row.updatedByUserId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
