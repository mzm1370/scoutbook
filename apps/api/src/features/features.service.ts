import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Feature as FeatureContract } from '@scoutbook/types';
import { CreateFeatureDto } from '@api/features/dto/create-feature.dto.js';
import { Feature } from '@api/features/entities/feature.entity.js';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private readonly featuresRepo: Repository<Feature>,
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
    const feature = await this.featuresRepo.findOneBy({ id });
    if (!feature) {
      throw new NotFoundException(`Feature ${id} not found`);
    }
    return this.toContract(feature);
  }

  private toContract(feature: Feature): FeatureContract {
    return {
      id: feature.id,
      title: feature.title,
      problem: feature.problem,
      riskTier: feature.riskTier,
      currentStage: feature.currentStage,
      createdByUserId: feature.createdByUserId,
      createdAt: feature.createdAt.toISOString(),
      updatedAt: feature.updatedAt.toISOString(),
    };
  }
}
