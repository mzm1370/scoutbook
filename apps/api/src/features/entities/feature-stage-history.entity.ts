import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { FeatureStage } from '@scoutbook/types';

const STAGE_ENUM = [
  'IDEA',
  'SCOUTING',
  'RFC',
  'RACI',
  'IMPLEMENTATION',
  'TESTING',
  'REVIEW',
  'RELEASE',
] as const;

@Entity()
export class FeatureStageHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  featureId!: number;

  @Column({
    type: 'enum',
    enum: STAGE_ENUM,
    nullable: true,
  })
  fromStage!: FeatureStage | null;

  @Column({
    type: 'enum',
    enum: STAGE_ENUM,
  })
  toStage!: FeatureStage;

  @Column()
  changedByUserId!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
