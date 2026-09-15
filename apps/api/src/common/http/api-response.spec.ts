import { describe, expect, it } from 'vitest';
import { ApiResponse } from './api-response.js';

describe('ApiResponse', () => {
  it('builds a success envelope', () => {
    const body = ApiResponse.success({ id: 1 }, '/features', 'abc');
    expect(body).toEqual({
      success: true,
      data: { id: 1 },
      meta: {
        path: '/features',
        timestamp: expect.any(String),
        requestId: 'abc',
      },
    });
  });

  it('builds a failure envelope', () => {
    const body = ApiResponse.failure(
      {
        statusCode: 401,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
        message: 'No token provided',
      },
      '/features',
      'abc',
    );
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(body.error.requestId).toBe('abc');
  });
});
