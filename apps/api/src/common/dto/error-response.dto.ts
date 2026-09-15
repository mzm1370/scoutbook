import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ApiErrorCode } from '@scoutbook/types';

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Bad Request' })
  error!: string;

  @ApiProperty({
    example: 'VALIDATION_ERROR',
    enum: [
      'BAD_REQUEST',
      'VALIDATION_ERROR',
      'UNAUTHORIZED',
      'FORBIDDEN',
      'NOT_FOUND',
      'CONFLICT',
      'INTERNAL_ERROR',
      'HTTP_ERROR',
    ],
  })
  code!: ApiErrorCode;

  @ApiProperty({
    example: 'Validation failed',
    description: 'Single human-readable message for UI display',
  })
  message!: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['title must be longer than or equal to 3 characters'],
  })
  details?: string[];

  @ApiProperty({ example: '/features' })
  path!: string;

  @ApiProperty({ example: '2026-09-15T07:00:00.000Z' })
  timestamp!: string;
}
