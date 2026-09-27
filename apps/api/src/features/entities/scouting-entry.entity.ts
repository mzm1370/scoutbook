import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { ScoutingStatus } from '@scoutbook/types';

@Entity()
export class ScoutingEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  featureId!: number;

  @Column({ length: 200 })
  question!: string;

  @Column({ length: 300 })
  currentState!: string;

  @Column({ length: 300 })
  expected!: string;

  @Column({ length: 300, default: '' })
  decision!: string;

  @Column({
    type: 'enum',
    enum: ['READY', 'DECISION_REQUIRED', 'INVESTIGATING', 'BLOCKED'],
    default: 'INVESTIGATING',
  })
  status!: ScoutingStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
