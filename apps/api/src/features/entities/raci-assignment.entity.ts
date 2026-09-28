import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import type { RaciValue } from '@scoutbook/types';

@Entity()
@Unique(['featureId', 'stepName'])
export class RaciAssignment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  featureId!: number;

  @Column({ length: 120 })
  stepName!: string;

  @Column({ type: 'varchar', length: 1, default: '' })
  poValue!: RaciValue;

  @Column({ type: 'varchar', length: 1, default: '' })
  pmValue!: RaciValue;

  @Column({ type: 'varchar', length: 1, default: '' })
  developerValue!: RaciValue;

  @Column({ type: 'varchar', length: 1, default: '' })
  qaValue!: RaciValue;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
