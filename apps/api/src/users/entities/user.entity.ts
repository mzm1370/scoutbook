import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { UserRole } from '@scoutbook/types';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: ['PO', 'PM', 'DEVELOPER', 'QA'] })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;
}
