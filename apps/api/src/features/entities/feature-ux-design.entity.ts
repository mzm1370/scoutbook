import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { UxDesignStatus } from '@scoutbook/types';

@Entity()
export class FeatureUxDesign {
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
  status!: UxDesignStatus;

  @Column({ default: false })
  happyPathCovered!: boolean;

  @Column({ default: false })
  emptyStateCovered!: boolean;

  @Column({ default: false })
  loadingStateCovered!: boolean;

  @Column({ default: false })
  errorStateCovered!: boolean;

  @Column({ length: 500, default: '' })
  summary!: string;

  @Column({ length: 200, default: '' })
  mockupPath!: string;

  @Column({ length: 500, default: '' })
  notes!: string;

  @Column({ type: 'int', nullable: true })
  updatedByUserId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
