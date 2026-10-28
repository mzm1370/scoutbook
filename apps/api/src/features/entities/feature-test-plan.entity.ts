import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { TestPlanStatus } from '@scoutbook/types';

@Entity()
export class FeatureTestPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  featureId!: number;

  @Column({
    type: 'enum',
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'READY', 'NOT_NEEDED'],
    default: 'NOT_STARTED',
  })
  status!: TestPlanStatus;

  @Column({ default: false })
  unitPlanned!: boolean;

  @Column({ default: false })
  integrationPlanned!: boolean;

  @Column({ default: false })
  e2ePlanned!: boolean;

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
