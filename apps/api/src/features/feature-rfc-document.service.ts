import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  FeatureRfcDocument as FeatureRfcDocumentContract,
  RfcDocumentStatus,
  UserRole,
} from '@scoutbook/types';
import { UpsertFeatureRfcDocumentDto } from '@api/features/dto/upsert-feature-rfc-document.dto.js';
import { FeatureRfcDocument } from '@api/features/entities/feature-rfc-document.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

@Injectable()
export class FeatureRfcDocumentService {
  constructor(
    @InjectRepository(FeatureRfcDocument)
    private readonly rfcDocRepo: Repository<FeatureRfcDocument>,
    private readonly featuresService: FeaturesService,
  ) {}

  async getForFeature(featureId: number): Promise<FeatureRfcDocumentContract> {
    await this.featuresService.findById(featureId);
    const row = await this.rfcDocRepo.findOneBy({ featureId });
    if (!row) {
      throw new NotFoundException(
        `RFC document not found for feature ${featureId}`,
      );
    }
    return this.toContract(row);
  }

  async findEntity(featureId: number): Promise<FeatureRfcDocument | null> {
    return this.rfcDocRepo.findOneBy({ featureId });
  }

  async upsert(
    featureId: number,
    dto: UpsertFeatureRfcDocumentDto,
    userId: number,
    userRole: UserRole,
  ): Promise<FeatureRfcDocumentContract> {
    await this.featuresService.findById(featureId);
    this.assertPayload(dto);

    if (
      (dto.status === 'ACCEPTED' || dto.status === 'REJECTED') &&
      userRole !== 'PO' &&
      userRole !== 'PM'
    ) {
      throw new ForbiddenException(
        'Only PO or PM can mark an RFC document as ACCEPTED or REJECTED',
      );
    }

    let row = await this.rfcDocRepo.findOneBy({ featureId });
    if (!row) {
      row = this.rfcDocRepo.create({ featureId });
    }

    row.status = dto.status;
    row.summary = (dto.summary ?? '').trim();
    row.motivation = (dto.motivation ?? '').trim();
    row.detailedDesign = (dto.detailedDesign ?? '').trim();
    row.alternatives = (dto.alternatives ?? '').trim();
    row.drawbacks = (dto.drawbacks ?? '').trim();
    row.updatedByUserId = userId;

    const saved = await this.rfcDocRepo.save(row);
    return this.toContract(saved);
  }

  private assertPayload(dto: UpsertFeatureRfcDocumentDto): void {
    const summary = (dto.summary ?? '').trim();
    const motivation = (dto.motivation ?? '').trim();
    const detailedDesign = (dto.detailedDesign ?? '').trim();

    if (dto.status === 'ACCEPTED') {
      if (summary.length < 5 || motivation.length < 5 || detailedDesign.length < 5) {
        throw new BadRequestException(
          'ACCEPTED requires summary, motivation, and detailedDesign (min 5 chars each)',
        );
      }
    }

    if (dto.status === 'REJECTED' && summary.length < 5) {
      throw new BadRequestException(
        'REJECTED requires a short summary (min 5 characters)',
      );
    }
  }

  private toContract(row: FeatureRfcDocument): FeatureRfcDocumentContract {
    return {
      id: row.id,
      featureId: row.featureId,
      status: row.status as RfcDocumentStatus,
      summary: row.summary,
      motivation: row.motivation,
      detailedDesign: row.detailedDesign,
      alternatives: row.alternatives,
      drawbacks: row.drawbacks,
      updatedByUserId: row.updatedByUserId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
