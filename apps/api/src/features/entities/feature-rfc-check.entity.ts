import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { RfcCheckStatus } from '@scoutbook/types';

@Entity()
export class FeatureRfcCheck {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  featureId!: number;

  @Column({
    type: 'enum',
    enum: ['NOT_CHECKED', 'NOT_NEEDED', 'NEEDED', 'ACCEPTED'],
    default: 'NOT_CHECKED',
  })
  status!: RfcCheckStatus;

  @Column({ default: false })
  changesSharedApi!: boolean;

  @Column({ default: false })
  newArchitecture!: boolean;

  @Column({ default: false })
  multiAppImpact!: boolean;

  @Column({ length: 500, default: '' })
  summary!: string;

  @Column({ length: 200, default: '' })
  docPath!: string;

  @Column({ type: 'int', nullable: true })
  updatedByUserId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
