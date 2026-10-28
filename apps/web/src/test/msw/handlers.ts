import { http, HttpResponse } from 'msw';

/** Default handlers — tests override with `server.use(...)`. */
export const handlers = [
  http.get('/api/health', () =>
    HttpResponse.json({
      success: true,
      data: { status: 'ok' },
      meta: { path: '/health', timestamp: new Date().toISOString() },
    }),
  ),
];
