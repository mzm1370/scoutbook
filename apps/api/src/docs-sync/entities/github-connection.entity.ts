import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { DocsSyncAuthMode } from '@scoutbook/types';

@Entity()
export class GithubConnection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 300 })
  repoUrl!: string;

  @Column({
    type: 'enum',
    enum: ['PAT', 'GITHUB_APP'],
    default: 'PAT',
  })
  authMode!: DocsSyncAuthMode;

  /** PAT ciphertext, or empty string in GitHub App mode (no TEXT default — MySQL). */
  @Column({ type: 'text' })
  encryptedToken!: string;

  @Column({ type: 'text', nullable: true })
  encryptedPrivateKey!: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  githubAppId!: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  githubInstallationId!: string | null;

  @Column({ length: 4, default: '' })
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
