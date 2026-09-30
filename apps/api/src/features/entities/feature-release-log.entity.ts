import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { ReleaseLogStatus } from '@scoutbook/types';

@Entity()
export class FeatureReleaseLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  featureId!: number;

  @Column({
    type: 'enum',
    enum: ['NOT_STARTED', 'SHIPPED', 'OBSERVING', 'STABLE'],
    default: 'NOT_STARTED',
  })
  status!: ReleaseLogStatus;

  @Column({ length: 500, default: '' })
  summary!: string;

  @Column({ default: false })
  watchStarted!: boolean;

  @Column({ length: 500, default: '' })
  notes!: string;

  @Column({ type: 'int', nullable: true })
  updatedByUserId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
