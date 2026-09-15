import { ApiProperty } from '@nestjs/swagger';
import type { UserRole } from '@scoutbook/types';

export class AuthUserDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'dev@team.example' })
  email!: string;

  @ApiProperty({
    enum: ['PO', 'PM', 'DEVELOPER', 'QA'],
    example: 'DEVELOPER',
  })
  role!: UserRole;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token (1h expiry)',
  })
  accessToken!: string;

  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto;
}

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Invalid credentials' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['email must be an email'],
      },
    ],
  })
  message!: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error!: string;
}
