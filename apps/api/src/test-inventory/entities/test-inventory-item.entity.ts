import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { TestInventoryTier } from '@scoutbook/types';

@Entity()
export class TestInventoryItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  area!: string;

  @Column({ length: 200 })
  packagePath!: string;

  @Column({ type: 'varchar', length: 2 })
  tier!: TestInventoryTier;

  @Column({ type: 'boolean', default: false })
  alwaysRun!: boolean;

  @Column({ length: 300, default: '' })
  why!: string;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
