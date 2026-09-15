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

export {
  ApiFailureEnvelopeDto,
  ErrorResponseDto,
} from '@api/common/dto/error-response.dto.js';
