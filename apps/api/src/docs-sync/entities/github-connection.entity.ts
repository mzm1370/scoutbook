import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class GithubConnection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 300 })
  repoUrl!: string;

  @Column({ type: 'text' })
  encryptedToken!: string;

  @Column({ length: 4 })
  tokenLastFour!: string;

  @Column()
  updatedByUserId!: number;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  lastSyncAt!: Date | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  lastPrUrl!: string | null;
}
