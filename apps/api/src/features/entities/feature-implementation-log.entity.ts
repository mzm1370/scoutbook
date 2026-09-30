import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { ImplementationLogStatus } from '@scoutbook/types';

@Entity()
export class FeatureImplementationLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  featureId!: number;

  @Column({
    type: 'enum',
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'READY_FOR_TEST'],
    default: 'NOT_STARTED',
  })
  status!: ImplementationLogStatus;

  @Column({ length: 500, default: '' })
  summary!: string;

  @Column({ length: 300, default: '' })
  branchOrPr!: string;

  @Column({ length: 500, default: '' })
  notes!: string;

  @Column({ type: 'int', nullable: true })
  updatedByUserId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
