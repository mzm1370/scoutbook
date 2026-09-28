import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DEFAULT_RACI_STEPS,
  type RaciAssignment as RaciAssignmentContract,
  type RaciValue,
} from '@scoutbook/types';
import { ReplaceFeatureRaciDto } from '@api/features/dto/replace-feature-raci.dto.js';
import { RaciAssignment } from '@api/features/entities/raci-assignment.entity.js';
import { FeaturesService } from '@api/features/features.service.js';

function countLetter(
  row: {
    poValue: RaciValue;
    pmValue: RaciValue;
    developerValue: RaciValue;
    qaValue: RaciValue;
  },
  letter: 'R' | 'A',
): number {
  return [row.poValue, row.pmValue, row.developerValue, row.qaValue].filter(
    (v) => v === letter,
  ).length;
}

@Injectable()
export class FeatureRaciService {
  constructor(
    @InjectRepository(RaciAssignment)
    private readonly raciRepo: Repository<RaciAssignment>,
    private readonly featuresService: FeaturesService,
  ) {}

  async listForFeature(featureId: number): Promise<RaciAssignmentContract[]> {
    await this.featuresService.findById(featureId);
    const rows = await this.raciRepo.find({
      where: { featureId },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
    return rows.map((row) => this.toContract(row));
  }

  async seedDefaults(featureId: number): Promise<{
    seeded: boolean;
    rows: RaciAssignmentContract[];
  }> {
    await this.featuresService.findById(featureId);
    const existing = await this.raciRepo.count({ where: { featureId } });
    if (existing > 0) {
      return { seeded: false, rows: await this.listForFeature(featureId) };
    }

    const entities = DEFAULT_RACI_STEPS.map((step, index) =>
      this.raciRepo.create({
        featureId,
        stepName: step.stepName,
        poValue: step.poValue,
        pmValue: step.pmValue,
        developerValue: step.developerValue,
        qaValue: step.qaValue,
        sortOrder: step.sortOrder ?? index,
      }),
    );
    await this.raciRepo.save(entities);
    return { seeded: true, rows: await this.listForFeature(featureId) };
  }

  async replace(
    featureId: number,
    dto: ReplaceFeatureRaciDto,
  ): Promise<RaciAssignmentContract[]> {
    await this.featuresService.findById(featureId);
    this.assertUniqueStepNames(dto.rows.map((r) => r.stepName));

    await this.raciRepo.manager.transaction(async (manager) => {
      const repo = manager.getRepository(RaciAssignment);
      await repo.delete({ featureId });
      const entities = dto.rows.map((row, index) =>
        repo.create({
          featureId,
          stepName: row.stepName.trim(),
          poValue: row.poValue,
          pmValue: row.pmValue,
          developerValue: row.developerValue,
          qaValue: row.qaValue,
          sortOrder: row.sortOrder ?? index,
        }),
      );
      await repo.save(entities);
    });

    return this.listForFeature(featureId);
  }

  assertReadyToLeaveRaci(rows: RaciAssignment[]): void {
    if (rows.length === 0) {
      throw new BadRequestException(
        'Add or seed a RACI matrix before leaving RACI',
      );
    }
    for (const row of rows) {
      if (countLetter(row, 'R') < 1 || countLetter(row, 'A') < 1) {
        throw new BadRequestException(
          `RACI step "${row.stepName}" needs at least one R and one A`,
        );
      }
    }
  }

  private assertUniqueStepNames(names: string[]): void {
    const normalized = names.map((n) => n.trim().toLowerCase());
    const unique = new Set(normalized);
    if (unique.size !== normalized.length) {
      throw new BadRequestException('RACI step names must be unique');
    }
  }

  private toContract(row: RaciAssignment): RaciAssignmentContract {
    return {
      id: row.id,
      featureId: row.featureId,
      stepName: row.stepName,
      poValue: row.poValue,
      pmValue: row.pmValue,
      developerValue: row.developerValue,
      qaValue: row.qaValue,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
