import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type {
  BugTriageRisk,
  BugTriageStatus,
  BugTriageType,
} from '@scoutbook/types';

@Entity()
export class FeatureBugTriage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  featureId!: number;

  @Column({ length: 300 })
  whatHappened!: string;

  @Column({ length: 300 })
  expected!: string;

  @Column({ length: 500, default: '' })
  reproduce!: string;

  @Column({
    type: 'enum',
    enum: ['REGRESSION', 'SCOUTING_GAP', 'UNSURE'],
  })
  bugType!: BugTriageType;

  @Column({
    type: 'enum',
    enum: ['P1', 'P2', 'P3', 'UNKNOWN'],
    default: 'UNKNOWN',
  })
  riskTier!: BugTriageRisk;

  @Column({
    type: 'enum',
    enum: ['OPEN', 'RESOLVED', 'ESCALATED_TO_PO'],
    default: 'OPEN',
  })
  status!: BugTriageStatus;

  @Column({ type: 'int', nullable: true })
  createdByUserId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
