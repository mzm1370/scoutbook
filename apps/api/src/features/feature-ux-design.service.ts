import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  FeatureUxDesign as FeatureUxDesignContract,
  UxDesignStatus,
} from '@scoutbook/types';
import { UpsertFeatureUxDesignDto } from '@api/features/dto/upsert-feature-ux-design.dto.js';
import { FeatureUxDesign } from '@api/features/entities/feature-ux-design.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class FeatureUxDesignService {
  constructor(
    @InjectRepository(FeatureUxDesign)
    private readonly uxRepo: Repository<FeatureUxDesign>,
    private readonly featuresService: FeaturesService,
  ) {}

  async getForFeature(featureId: number): Promise<FeatureUxDesignContract> {
    await this.featuresService.findById(featureId);
    const row = await this.uxRepo.findOneBy({ featureId });
    if (!row) {
      throw new NotFoundException(
        `UX design not found for feature ${featureId}`,
      );
    }
    return this.toContract(row);
  }

  async findEntity(featureId: number): Promise<FeatureUxDesign | null> {
    return this.uxRepo.findOneBy({ featureId });
  }

  async upsert(
    featureId: number,
    dto: UpsertFeatureUxDesignDto,
    userId: number,
  ): Promise<FeatureUxDesignContract> {
    await this.featuresService.findById(featureId);
    this.assertPayload(dto);

    let row = await this.uxRepo.findOneBy({ featureId });
    if (!row) {
      row = this.uxRepo.create({ featureId });
    }

    row.status = dto.status;
    row.happyPathCovered = dto.happyPathCovered;
    row.emptyStateCovered = dto.emptyStateCovered;
    row.loadingStateCovered = dto.loadingStateCovered;
    row.errorStateCovered = dto.errorStateCovered;
    row.summary = (dto.summary ?? '').trim();
    row.mockupPath = (dto.mockupPath ?? '').trim();
    row.notes = (dto.notes ?? '').trim();
    row.updatedByUserId = userId;

    const saved = await this.uxRepo.save(row);
    return this.toContract(saved);
  }

  private assertPayload(dto: UpsertFeatureUxDesignDto): void {
    const anyTrue =
      dto.happyPathCovered ||
      dto.emptyStateCovered ||
      dto.loadingStateCovered ||
      dto.errorStateCovered;
    const allTrue =
      dto.happyPathCovered &&
      dto.emptyStateCovered &&
      dto.loadingStateCovered &&
      dto.errorStateCovered;
    const summary = (dto.summary ?? '').trim();

    if (dto.status === 'NOT_NEEDED' && anyTrue) {
      throw new BadRequestException(
        'NOT_NEEDED requires all four state checkboxes off',
      );
    }
    if (dto.status === 'READY') {
      if (!allTrue) {
        throw new BadRequestException(
          'READY requires happy, empty, loading, and error states covered',
        );
      }
      if (summary.length < 5) {
        throw new BadRequestException(
          'Summary must be at least 5 characters when status is READY',
        );
      }
    }
  }

  private toContract(row: FeatureUxDesign): FeatureUxDesignContract {
    return {
      id: row.id,
      featureId: row.featureId,
      status: row.status as UxDesignStatus,
      happyPathCovered: row.happyPathCovered,
      emptyStateCovered: row.emptyStateCovered,
      loadingStateCovered: row.loadingStateCovered,
      errorStateCovered: row.errorStateCovered,
      summary: row.summary,
      mockupPath: row.mockupPath,
      notes: row.notes,
      updatedByUserId: row.updatedByUserId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
