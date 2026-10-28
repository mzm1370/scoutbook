import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { ApiError } from '@web/lib/api-error';
import { HttpClient } from '@web/lib/http-client';
import { server } from '@web/test/msw/server';

describe('HttpClient (MSW)', () => {
  const client = new HttpClient('/api');

  it('unwraps success envelopes', async () => {
    server.use(
      http.get('/api/features/1', () =>
        HttpResponse.json({
          success: true,
          data: { id: 1, title: 'Board' },
          meta: { path: '/features/1', timestamp: '2026-10-28T00:00:00.000Z' },
        }),
      ),
    );

    const row = await client.get<{ id: number; title: string }>(
      '/features/1',
      'tok',
      { silent: true },
    );
    expect(row).toEqual({ id: 1, title: 'Board' });
  });

  it('maps failure envelopes to ApiError', async () => {
    server.use(
      http.get('/api/features/99', () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              statusCode: 404,
              code: 'NOT_FOUND',
              message: 'Feature 99 not found',
              timestamp: '2026-10-28T00:00:00.000Z',
              path: '/features/99',
            },
          },
          { status: 404 },
        ),
      ),
    );

    await expect(
      client.get('/features/99', 'tok', { silent: true }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});
