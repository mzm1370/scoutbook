import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { ReviewChecklistStatus } from '@scoutbook/types';

@Entity()
export class FeatureReviewChecklist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  featureId!: number;

  @Column({
    type: 'enum',
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'APPROVED'],
    default: 'NOT_STARTED',
  })
  status!: ReviewChecklistStatus;

  @Column({ default: false })
  acceptanceCriteriaMet!: boolean;

  @Column({ default: false })
  noOpenDecisionRequired!: boolean;

  @Column({ default: false })
  rfcResolved!: boolean;

  @Column({ default: false })
  testingEvidenceReviewed!: boolean;

  @Column({ default: false })
  docsUpdatedIfNeeded!: boolean;

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
