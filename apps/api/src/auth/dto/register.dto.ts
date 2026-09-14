import { IsEmail, IsIn, MinLength } from 'class-validator';
import type { UserRole } from '@scoutbook/types';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;

  @IsIn(['PO', 'PM', 'DEVELOPER', 'QA'])
  role!: UserRole;
}
