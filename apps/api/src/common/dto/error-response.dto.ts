import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ApiErrorCode } from '@scoutbook/types';

/** Nested `error` object inside the failure envelope. */
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

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  requestId?: string;
}

/** Uniform failed HTTP body: `{ success: false, error }`. */
export class ApiFailureEnvelopeDto {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty({ type: ErrorResponseDto })
  error!: ErrorResponseDto;
}
