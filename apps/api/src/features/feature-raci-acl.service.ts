import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  canRaciLetter,
  type RaciLetterAction,
  type UserRole,
} from '@scoutbook/types';
import { RaciAssignment } from '@api/features/entities/raci-assignment.entity.js';

@Injectable()
export class FeatureRaciAclService {
  constructor(
    @InjectRepository(RaciAssignment)
    private readonly raciRepo: Repository<RaciAssignment>,
  ) {}

  async assertAllowed(
    featureId: number,
    role: UserRole,
    action: RaciLetterAction,
  ): Promise<void> {
    const rows = await this.raciRepo.find({ where: { featureId } });
    if (canRaciLetter(role, rows, action)) {
      return;
    }
    const need = action === 'acceptRfc' ? 'A' : 'R or A';
    throw new ForbiddenException(
      `RACI letter ACL denied for ${action} (need ${need} on the mapped step for your role)`,
    );
  }
}
