import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { TestHealthStatus } from '@scoutbook/types';

@Entity()
export class FeatureTestHealth {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  featureId!: number;

  @Column({
    type: 'enum',
    enum: ['NOT_STARTED', 'WATCHING', 'HEALTHY', 'AT_RISK', 'NOT_NEEDED'],
    default: 'NOT_STARTED',
  })
  status!: TestHealthStatus;

  @Column({ default: false })
  failureRateChecked!: boolean;

  @Column({ default: false })
  flakyChecked!: boolean;

  @Column({ default: false })
  durationChecked!: boolean;

  @Column({ type: 'int', nullable: true })
  failureRatePct!: number | null;

  @Column({ type: 'int', nullable: true })
  flakyCount!: number | null;

  @Column({ type: 'int', nullable: true })
  durationMinutes!: number | null;

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
