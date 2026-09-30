import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '@api/app.module.js';
import { GITHUB_API_CLIENT } from '@api/docs-sync/github/github-api.client.js';
import type { GithubApiClient } from '@api/docs-sync/github/github-api.client.js';

const ENCRYPTION_KEY =
  '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

describe('DocsSyncController (e2e)', () => {
  let app: INestApplication<App>;
  let poToken: string;
  let developerToken: string;
  const githubMock: GithubApiClient = {
    openDocsPr: async () => ({
      prUrl: 'https://github.com/acme/app/pull/99',
      branch: 'scoutbook/docs-sync-test',
      filesWritten: 2,
    }),
  };

  beforeAll(async () => {
    process.env.DOCS_SYNC_ENCRYPTION_KEY = ENCRYPTION_KEY;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GITHUB_API_CLIENT)
      .useValue(githubMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const stamp = Date.now();
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `po-sync-${stamp}@scoutbook.test`,
        password: 'password1',
        role: 'PO',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `dev-sync-${stamp}@scoutbook.test`,
        password: 'password1',
        role: 'DEVELOPER',
      })
      .expect(201);

    const poLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: `po-sync-${stamp}@scoutbook.test`,
        password: 'password1',
      })
      .expect(200);
    poToken = poLogin.body.data.accessToken as string;

    const devLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: `dev-sync-${stamp}@scoutbook.test`,
        password: 'password1',
      })
      .expect(200);
    developerToken = devLogin.body.data.accessToken as string;
  });

  afterAll(async () => {
    await app.close();
  });

  it('PO upserts connection without leaking token; developer forbidden', async () => {
    // Clear any leftover singleton from prior runs
    await request(app.getHttpServer())
      .delete('/docs-sync/connection')
      .set('Authorization', `Bearer ${poToken}`);

    const empty = await request(app.getHttpServer())
      .get('/docs-sync/connection')
      .set('Authorization', `Bearer ${developerToken}`)
      .expect(200);
    expect(empty.body.data.configured).toBe(false);

    await request(app.getHttpServer())
      .put('/docs-sync/connection')
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        repoUrl: 'https://github.com/acme/app',
        token: 'ghp_developer_cannot',
      })
      .expect(403);

    const created = await request(app.getHttpServer())
      .put('/docs-sync/connection')
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        repoUrl: 'acme/app',
        token: 'ghp_secret_token_abcd',
      })
      .expect(200);

    expect(created.body.data).toMatchObject({
      configured: true,
      repoUrl: 'https://github.com/acme/app',
      hasToken: true,
      tokenLastFour: 'abcd',
    });
    expect(created.body.data).not.toHaveProperty('token');
    expect(created.body.data).not.toHaveProperty('encryptedToken');
    expect(JSON.stringify(created.body)).not.toContain('ghp_secret');

    const updated = await request(app.getHttpServer())
      .put('/docs-sync/connection')
      .set('Authorization', `Bearer ${poToken}`)
      .send({ repoUrl: 'https://github.com/acme/app' })
      .expect(200);
    expect(updated.body.data.tokenLastFour).toBe('abcd');

    await request(app.getHttpServer())
      .post('/docs-sync/sync')
      .set('Authorization', `Bearer ${developerToken}`)
      .expect(403);

    const synced = await request(app.getHttpServer())
      .post('/docs-sync/sync')
      .set('Authorization', `Bearer ${poToken}`)
      .expect(200);
    expect(synced.body.data).toMatchObject({
      prUrl: 'https://github.com/acme/app/pull/99',
      filesWritten: 2,
    });

    const after = await request(app.getHttpServer())
      .get('/docs-sync/connection')
      .set('Authorization', `Bearer ${poToken}`)
      .expect(200);
    expect(after.body.data.lastPrUrl).toBe(
      'https://github.com/acme/app/pull/99',
    );

    await request(app.getHttpServer())
      .delete('/docs-sync/connection')
      .set('Authorization', `Bearer ${poToken}`)
      .expect(200);

    const gone = await request(app.getHttpServer())
      .get('/docs-sync/connection')
      .set('Authorization', `Bearer ${poToken}`)
      .expect(200);
    expect(gone.body.data.configured).toBe(false);
  });
});
