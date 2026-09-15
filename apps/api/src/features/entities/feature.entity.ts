import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { FeatureStage, RiskTier } from '@scoutbook/types';

@Entity()
export class Feature {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'text' })
  problem!: string;

  @Column({ type: 'enum', enum: ['P1', 'P2', 'P3'] })
  riskTier!: RiskTier;

  @Column({
    type: 'enum',
    enum: [
      'IDEA',
      'SCOUTING',
      'RFC',
      'RACI',
      'IMPLEMENTATION',
      'TESTING',
      'REVIEW',
      'RELEASE',
    ],
    default: 'IDEA',
  })
  currentStage!: FeatureStage;

  @Column()
  createdByUserId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
