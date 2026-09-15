import { HttpException, HttpStatus } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AllExceptionsFilter } from './all-exceptions.filter.js';

describe('AllExceptionsFilter', () => {
  const filter = new AllExceptionsFilter();
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  const response = { status };
  const request = { url: '/features', requestId: 'req-1' };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    status.mockReturnValue({ json });
  });

  it('wraps validation errors in failure envelope', () => {
    filter.catch(
      new HttpException(
        {
          statusCode: 400,
          message: ['title must be longer than or equal to 2 characters'],
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      ),
      host as never,
    );

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          statusCode: 400,
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: ['title must be longer than or equal to 2 characters'],
          path: '/features',
          requestId: 'req-1',
        }),
      }),
    );
  });

  it('maps not-found messages', () => {
    filter.catch(
      new HttpException('Feature 99 not found', HttpStatus.NOT_FOUND),
      host as never,
    );

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          statusCode: 404,
          code: 'NOT_FOUND',
          message: 'Feature 99 not found',
        }),
      }),
    );
  });

  it('hides unexpected error details in production', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      filter.catch(new Error('secret db failure'), host as never);
      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            statusCode: 500,
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
          }),
        }),
      );
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});
