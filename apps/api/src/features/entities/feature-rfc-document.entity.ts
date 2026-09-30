import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { RfcDocumentStatus } from '@scoutbook/types';

@Entity()
export class FeatureRfcDocument {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  featureId!: number;

  @Column({
    type: 'enum',
    enum: ['DRAFT', 'ACCEPTED', 'REJECTED'],
    default: 'DRAFT',
  })
  status!: RfcDocumentStatus;

  @Column({ length: 500, default: '' })
  summary!: string;

  @Column({ length: 500, default: '' })
  motivation!: string;

  @Column({ length: 500, default: '' })
  detailedDesign!: string;

  @Column({ length: 500, default: '' })
  alternatives!: string;

  @Column({ length: 500, default: '' })
  drawbacks!: string;

  @Column({ type: 'int', nullable: true })
  updatedByUserId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
