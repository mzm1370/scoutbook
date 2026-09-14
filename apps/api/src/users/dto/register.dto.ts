import { IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';
import type { UserRole } from '@scoutbook/types';

export class RegisterDto {
    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;

    @IsNotEmpty()
    @IsIn(['PO', 'PM', 'DEVELOPER', 'QA'])
    role: UserRole;
}