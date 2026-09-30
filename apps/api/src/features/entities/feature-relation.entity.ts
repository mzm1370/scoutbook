import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import type { FeatureRelationType } from '@scoutbook/types';

const RELATION_ENUM = ['BLOCKS'] as const;

@Entity()
@Unique(['fromFeatureId', 'toFeatureId'])
export class FeatureRelation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  fromFeatureId!: number;

  @Index()
  @Column()
  toFeatureId!: number;

  @Column({
    type: 'enum',
    enum: RELATION_ENUM,
    default: 'BLOCKS',
  })
  type!: FeatureRelationType;

  @Column()
  createdByUserId!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
