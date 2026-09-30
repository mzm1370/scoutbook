import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateFeatureRelationDto } from '@api/features/dto/create-feature-relation.dto.js';
import { Feature } from '@api/features/entities/feature.entity.js';
import { FeatureRelation } from '@api/features/entities/feature-relation.entity.js';
import type { FeatureRelation as FeatureRelationContract } from '@scoutbook/types';

@Injectable()
export class FeatureRelationService {
  constructor(
    @InjectRepository(FeatureRelation)
    private readonly relationsRepo: Repository<FeatureRelation>,
    @InjectRepository(Feature)
    private readonly featuresRepo: Repository<Feature>,
  ) {}

  async listAll(): Promise<FeatureRelationContract[]> {
    const rows = await this.relationsRepo.find({
      order: { id: 'ASC' },
    });
    return rows.map((row) => this.toContract(row));
  }

  async create(
    dto: CreateFeatureRelationDto,
    createdByUserId: number,
  ): Promise<FeatureRelationContract> {
    if (dto.fromFeatureId === dto.toFeatureId) {
      throw new BadRequestException('A Feature cannot block itself');
    }

    const features = await this.featuresRepo.findBy({
      id: In([dto.fromFeatureId, dto.toFeatureId]),
    });
    if (features.length !== 2) {
      throw new NotFoundException('One or both Features were not found');
    }

    const existing = await this.relationsRepo.findOneBy({
      fromFeatureId: dto.fromFeatureId,
      toFeatureId: dto.toFeatureId,
    });
    if (existing) {
      throw new BadRequestException(
        'That BLOCKS link already exists between these Features',
      );
    }

    const row = this.relationsRepo.create({
      fromFeatureId: dto.fromFeatureId,
      toFeatureId: dto.toFeatureId,
      type: dto.type ?? 'BLOCKS',
      createdByUserId,
    });
    const saved = await this.relationsRepo.save(row);
    return this.toContract(saved);
  }

  async remove(id: number): Promise<FeatureRelationContract> {
    const row = await this.relationsRepo.findOneBy({ id });
    if (!row) {
      throw new NotFoundException(`Feature relation ${id} not found`);
    }
    const contract = this.toContract(row);
    await this.relationsRepo.remove(row);
    return contract;
  }

  private toContract(row: FeatureRelation): FeatureRelationContract {
    return {
      id: row.id,
      fromFeatureId: row.fromFeatureId,
      toFeatureId: row.toFeatureId,
      type: row.type,
      createdByUserId: row.createdByUserId,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
