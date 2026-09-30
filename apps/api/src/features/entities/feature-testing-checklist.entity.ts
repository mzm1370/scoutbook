import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { TestingChecklistStatus } from '@scoutbook/types';

@Entity()
export class FeatureTestingChecklist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  featureId!: number;

  @Column({
    type: 'enum',
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'PASSED'],
    default: 'NOT_STARTED',
  })
  status!: TestingChecklistStatus;

  @Column({ default: false })
  unitOrIntegrationPassed!: boolean;

  @Column({ default: false })
  acceptanceValidated!: boolean;

  @Column({ default: false })
  noOpenDecisionRequired!: boolean;

  @Column({ length: 500, default: '' })
  summary!: string;

  @Column({ length: 500, default: '' })
  notes!: string;

  @Column({ type: 'int', nullable: true })
  updatedByUserId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
