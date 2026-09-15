import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module.js';

describe('FeaturesController (e2e)', () => {
  let app: INestApplication<App>;
  let poToken: string;
  let developerToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
        email: `po-${stamp}@scoutbook.test`,
        password: 'password1',
        role: 'PO',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `dev-${stamp}@scoutbook.test`,
        password: 'password1',
        role: 'DEVELOPER',
      })
      .expect(201);

    const poLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: `po-${stamp}@scoutbook.test`, password: 'password1' })
      .expect(200);
    poToken = poLogin.body.data.accessToken as string;

    const devLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: `dev-${stamp}@scoutbook.test`,
        password: 'password1',
      })
      .expect(200);
    developerToken = devLogin.body.data.accessToken as string;
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects unauthenticated list with error envelope', async () => {
    const res = await request(app.getHttpServer()).get('/features').expect(401);
    expect(res.body).toMatchObject({
      success: false,
      error: expect.objectContaining({
        statusCode: 401,
        code: 'UNAUTHORIZED',
        path: '/features',
      }),
    });
    expect(typeof res.body.error.message).toBe('string');
    expect(res.body.error.timestamp).toBeTruthy();
    expect(res.headers['x-request-id']).toBeTruthy();
  });

  it('rejects non-PO create', async () => {
    await request(app.getHttpServer())
      .post('/features')
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        title: 'Should fail',
        problem: 'Developers cannot create features',
        riskTier: 'P3',
      })
      .expect(403);
  });

  it('PO creates, lists, and fetches a feature', async () => {
    const created = await request(app.getHttpServer())
      .post('/features')
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        title: 'GitHub Docs Sync',
        problem: 'Decisions never land in the target repo docs/ folder.',
        riskTier: 'P2',
      })
      .expect(201);

    expect(created.body).toMatchObject({
      success: true,
      data: {
        title: 'GitHub Docs Sync',
        riskTier: 'P2',
        currentStage: 'IDEA',
      },
    });
    expect(created.body.data.id).toBeTypeOf('number');
    expect(created.body.meta.path).toBeTruthy();

    const list = await request(app.getHttpServer())
      .get('/features')
      .set('Authorization', `Bearer ${developerToken}`)
      .expect(200);

    expect(
      list.body.data.some(
        (f: { id: number }) => f.id === created.body.data.id,
      ),
    ).toBe(true);

    const detail = await request(app.getHttpServer())
      .get(`/features/${created.body.data.id}`)
      .set('Authorization', `Bearer ${developerToken}`)
      .expect(200);

    expect(detail.body.data.id).toBe(created.body.data.id);
  });

  it('returns 404 for missing feature', async () => {
    const res = await request(app.getHttpServer())
      .get('/features/999999')
      .set('Authorization', `Bearer ${poToken}`)
      .expect(404);

    expect(res.body).toMatchObject({
      success: false,
      error: expect.objectContaining({ code: 'NOT_FOUND' }),
    });
  });
});
