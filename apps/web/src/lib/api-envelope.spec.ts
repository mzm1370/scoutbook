import { describe, expect, it } from 'vitest';
import { ApiError } from '@web/lib/api-error';
import { unwrapApiData } from '@web/lib/api-envelope';

describe('unwrapApiData', () => {
  it('returns data from a success envelope', () => {
    const data = unwrapApiData<{ id: number }>(
      {
        success: true,
        data: { id: 7 },
        meta: { path: '/x', timestamp: '2026-10-28T00:00:00.000Z' },
      },
      200,
      'OK',
    );
    expect(data).toEqual({ id: 7 });
  });

  it('throws ApiError from a failure envelope', () => {
    expect(() =>
      unwrapApiData(
        {
          success: false,
          error: {
            statusCode: 400,
            code: 'VALIDATION_ERROR',
            message: 'Bad input',
            timestamp: '2026-10-28T00:00:00.000Z',
            path: '/x',
          },
        },
        400,
        'Bad Request',
      ),
    ).toThrow(ApiError);
  });
});
