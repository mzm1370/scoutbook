import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, MinLength } from 'class-validator';
import type { UserRole } from '@scoutbook/types';

export class RegisterDto {
  @ApiProperty({
    example: 'dev@team.example',
    format: 'email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password1',
    minLength: 8,
    format: 'password',
  })
  @MinLength(8)
  password!: string;

  @ApiProperty({
    enum: ['PO', 'PM', 'DEVELOPER', 'QA'],
    example: 'DEVELOPER',
  })
  @IsIn(['PO', 'PM', 'DEVELOPER', 'QA'])
  role!: UserRole;
}
