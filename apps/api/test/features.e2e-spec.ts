import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '@api/app.module.js';

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

  it('developer can add, list, and patch scouting rows', async () => {
    const created = await request(app.getHttpServer())
      .post('/features')
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        title: 'Scouting feature',
        problem: 'Need written ambiguity rows on the feature.',
        riskTier: 'P2',
      })
      .expect(201);

    const featureId = created.body.data.id as number;

    const readyRejected = await request(app.getHttpServer())
      .post(`/features/${featureId}/scouting`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        question: 'Who approves?',
        currentState: 'unclear',
        expected: 'PO decides',
        status: 'READY',
        decision: '',
      })
      .expect(400);
    expect(readyRejected.body.success).toBe(false);

    const added = await request(app.getHttpServer())
      .post(`/features/${featureId}/scouting`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        question: 'Who approves?',
        currentState: 'unclear',
        expected: 'PO decides',
      })
      .expect(201);

    expect(added.body.data).toMatchObject({
      featureId,
      status: 'INVESTIGATING',
      decision: '',
    });

    const listed = await request(app.getHttpServer())
      .get(`/features/${featureId}/scouting`)
      .set('Authorization', `Bearer ${poToken}`)
      .expect(200);

    expect(listed.body.data).toHaveLength(1);

    const patched = await request(app.getHttpServer())
      .patch(`/features/${featureId}/scouting/${added.body.data.id}`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        status: 'READY',
        decision: 'PO approves ambiguities',
      })
      .expect(200);

    expect(patched.body.data).toMatchObject({
      status: 'READY',
      decision: 'PO approves ambiguities',
    });
  });

  it('PO advances stages one step; skip and open scouting are rejected', async () => {
    const created = await request(app.getHttpServer())
      .post('/features')
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        title: 'Stage pipeline',
        problem: 'Need controlled stage advancement with scouting gate.',
        riskTier: 'P2',
      })
      .expect(201);

    const featureId = created.body.data.id as number;

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({ stage: 'SCOUTING' })
      .expect(403);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RFC' })
      .expect(400);

    const toScouting = await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'SCOUTING' })
      .expect(200);
    expect(toScouting.body.data.currentStage).toBe('SCOUTING');

    await request(app.getHttpServer())
      .post(`/features/${featureId}/scouting`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        question: 'Open ambiguity?',
        currentState: 'unknown',
        expected: 'decided',
        status: 'DECISION_REQUIRED',
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RFC' })
      .expect(400);

    const rows = await request(app.getHttpServer())
      .get(`/features/${featureId}/scouting`)
      .set('Authorization', `Bearer ${poToken}`)
      .expect(200);

    const entryId = rows.body.data[0].id as number;
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/scouting/${entryId}`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        status: 'READY',
        decision: 'Resolved by PO',
      })
      .expect(200);

    const toRfc = await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RFC' })
      .expect(200);
    expect(toRfc.body.data.currentStage).toBe('RFC');
  });

  it('RFC check upsert and gates RFC → RACI', async () => {
    const created = await request(app.getHttpServer())
      .post('/features')
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        title: 'RFC check feature',
        problem: 'Need written RFC yes/no decision on the feature.',
        riskTier: 'P2',
      })
      .expect(201);

    const featureId = created.body.data.id as number;

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'SCOUTING' })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RFC' })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RACI' })
      .expect(400);

    await request(app.getHttpServer())
      .put(`/features/${featureId}/rfc-check`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        status: 'ACCEPTED',
        changesSharedApi: true,
        newArchitecture: false,
        multiAppImpact: false,
        summary: 'Shared API change',
      })
      .expect(403);

    await request(app.getHttpServer())
      .put(`/features/${featureId}/rfc-check`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        status: 'NOT_NEEDED',
        changesSharedApi: false,
        newArchitecture: false,
        multiAppImpact: false,
        summary: '',
      })
      .expect(200);

    const got = await request(app.getHttpServer())
      .get(`/features/${featureId}/rfc-check`)
      .set('Authorization', `Bearer ${poToken}`)
      .expect(200);
    expect(got.body.data.status).toBe('NOT_NEEDED');

    const toRaci = await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RACI' })
      .expect(200);
    expect(toRaci.body.data.currentStage).toBe('RACI');
  });

  it('seeds RACI, gates IMPLEMENTATION, then advances when complete', async () => {
    const created = await request(app.getHttpServer())
      .post('/features')
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        title: 'RACI Matrix',
        problem: 'Need ownership before build',
        riskTier: 'P2',
      })
      .expect(201);
    const featureId = created.body.data.id as number;

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'SCOUTING' })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RFC' })
      .expect(200);

    await request(app.getHttpServer())
      .put(`/features/${featureId}/rfc-check`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        status: 'NOT_NEEDED',
        changesSharedApi: false,
        newArchitecture: false,
        multiAppImpact: false,
        summary: '',
      })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RACI' })
      .expect(200);

    const empty = await request(app.getHttpServer())
      .get(`/features/${featureId}/raci`)
      .set('Authorization', `Bearer ${poToken}`)
      .expect(200);
    expect(empty.body.data).toEqual([]);

    const seeded = await request(app.getHttpServer())
      .post(`/features/${featureId}/raci/seed`)
      .set('Authorization', `Bearer ${poToken}`)
      .expect(200);
    expect(seeded.body.data.length).toBeGreaterThanOrEqual(6);

    const reseed = await request(app.getHttpServer())
      .post(`/features/${featureId}/raci/seed`)
      .set('Authorization', `Bearer ${developerToken}`)
      .expect(200);
    expect(reseed.body.data).toHaveLength(seeded.body.data.length);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'IMPLEMENTATION' })
      .expect(400);

    const completeRows = (
      seeded.body.data as Array<{
        stepName: string;
        poValue: string;
        pmValue: string;
        developerValue: string;
        qaValue: string;
        sortOrder: number;
      }>
    ).map((row) => ({
      stepName: row.stepName,
      poValue: row.poValue === 'R' || row.poValue === 'A' ? row.poValue : 'A',
      pmValue: row.pmValue,
      developerValue:
        row.developerValue === 'R' || row.developerValue === 'A'
          ? row.developerValue
          : 'R',
      qaValue: row.qaValue,
      sortOrder: row.sortOrder,
    }));

    await request(app.getHttpServer())
      .put(`/features/${featureId}/raci`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ rows: completeRows })
      .expect(200);

    const toImpl = await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'IMPLEMENTATION' })
      .expect(200);
    expect(toImpl.body.data.currentStage).toBe('IMPLEMENTATION');
  });

  it('gates IMPLEMENTATION → TESTING on ready implementation log', async () => {
    const created = await request(app.getHttpServer())
      .post('/features')
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        title: 'Impl Log Feature',
        problem: 'Need written build notes before Testing',
        riskTier: 'P3',
      })
      .expect(201);
    const featureId = created.body.data.id as number;

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'SCOUTING' })
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RFC' })
      .expect(200);
    await request(app.getHttpServer())
      .put(`/features/${featureId}/rfc-check`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        status: 'NOT_NEEDED',
        changesSharedApi: false,
        newArchitecture: false,
        multiAppImpact: false,
        summary: '',
      })
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RACI' })
      .expect(200);

    const seeded = await request(app.getHttpServer())
      .post(`/features/${featureId}/raci/seed`)
      .set('Authorization', `Bearer ${developerToken}`)
      .expect(200);
    const completeRows = (
      seeded.body.data as Array<{
        stepName: string;
        poValue: string;
        pmValue: string;
        developerValue: string;
        qaValue: string;
        sortOrder: number;
      }>
    ).map((row) => ({
      stepName: row.stepName,
      poValue: row.poValue === 'R' || row.poValue === 'A' ? row.poValue : 'A',
      pmValue: row.pmValue,
      developerValue:
        row.developerValue === 'R' || row.developerValue === 'A'
          ? row.developerValue
          : 'R',
      qaValue: row.qaValue,
      sortOrder: row.sortOrder,
    }));
    await request(app.getHttpServer())
      .put(`/features/${featureId}/raci`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ rows: completeRows })
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'IMPLEMENTATION' })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'TESTING' })
      .expect(400);

    await request(app.getHttpServer())
      .put(`/features/${featureId}/implementation-log`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        status: 'IN_PROGRESS',
        summary: 'Started',
        branchOrPr: 'feat/impl-log',
        notes: '',
      })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'TESTING' })
      .expect(400);

    const ready = await request(app.getHttpServer())
      .put(`/features/${featureId}/implementation-log`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        status: 'READY_FOR_TEST',
        summary: 'Reminder API + unit tests',
        branchOrPr: 'feat/impl-log',
        notes: 'Cron later',
      })
      .expect(200);
    expect(ready.body.data.status).toBe('READY_FOR_TEST');

    const got = await request(app.getHttpServer())
      .get(`/features/${featureId}/implementation-log`)
      .set('Authorization', `Bearer ${poToken}`)
      .expect(200);
    expect(got.body.data.summary).toBe('Reminder API + unit tests');

    const toTesting = await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'TESTING' })
      .expect(200);
    expect(toTesting.body.data.currentStage).toBe('TESTING');
  });

  it('gates TESTING → REVIEW on passed testing checklist', async () => {
    const created = await request(app.getHttpServer())
      .post('/features')
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        title: 'Testing Checklist Feature',
        problem: 'Need proof before Review',
        riskTier: 'P3',
      })
      .expect(201);
    const featureId = created.body.data.id as number;

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'SCOUTING' })
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RFC' })
      .expect(200);
    await request(app.getHttpServer())
      .put(`/features/${featureId}/rfc-check`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        status: 'NOT_NEEDED',
        changesSharedApi: false,
        newArchitecture: false,
        multiAppImpact: false,
        summary: '',
      })
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RACI' })
      .expect(200);

    const seeded = await request(app.getHttpServer())
      .post(`/features/${featureId}/raci/seed`)
      .set('Authorization', `Bearer ${developerToken}`)
      .expect(200);
    const completeRows = (
      seeded.body.data as Array<{
        stepName: string;
        poValue: string;
        pmValue: string;
        developerValue: string;
        qaValue: string;
        sortOrder: number;
      }>
    ).map((row) => ({
      stepName: row.stepName,
      poValue: row.poValue === 'R' || row.poValue === 'A' ? row.poValue : 'A',
      pmValue: row.pmValue,
      developerValue:
        row.developerValue === 'R' || row.developerValue === 'A'
          ? row.developerValue
          : 'R',
      qaValue: row.qaValue,
      sortOrder: row.sortOrder,
    }));
    await request(app.getHttpServer())
      .put(`/features/${featureId}/raci`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ rows: completeRows })
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'IMPLEMENTATION' })
      .expect(200);

    await request(app.getHttpServer())
      .put(`/features/${featureId}/implementation-log`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        status: 'READY_FOR_TEST',
        summary: 'Built for testing gate',
        branchOrPr: '',
        notes: '',
      })
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'TESTING' })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'REVIEW' })
      .expect(400);

    await request(app.getHttpServer())
      .put(`/features/${featureId}/testing-checklist`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        status: 'IN_PROGRESS',
        unitOrIntegrationPassed: true,
        acceptanceValidated: false,
        noOpenDecisionRequired: true,
        summary: 'Partial',
        notes: '',
      })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'REVIEW' })
      .expect(400);

    const passed = await request(app.getHttpServer())
      .put(`/features/${featureId}/testing-checklist`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        status: 'PASSED',
        unitOrIntegrationPassed: true,
        acceptanceValidated: true,
        noOpenDecisionRequired: true,
        summary: 'Unit + QA acceptance passed',
        notes: 'Happy path only',
      })
      .expect(200);
    expect(passed.body.data.status).toBe('PASSED');

    const got = await request(app.getHttpServer())
      .get(`/features/${featureId}/testing-checklist`)
      .set('Authorization', `Bearer ${poToken}`)
      .expect(200);
    expect(got.body.data.acceptanceValidated).toBe(true);

    const toReview = await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'REVIEW' })
      .expect(200);
    expect(toReview.body.data.currentStage).toBe('REVIEW');
  });

  it('gates REVIEW → RELEASE on approved review checklist', async () => {
    const created = await request(app.getHttpServer())
      .post('/features')
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        title: 'Review Checklist Feature',
        problem: 'Need DoD before Release',
        riskTier: 'P3',
      })
      .expect(201);
    const featureId = created.body.data.id as number;

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'SCOUTING' })
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RFC' })
      .expect(200);
    await request(app.getHttpServer())
      .put(`/features/${featureId}/rfc-check`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        status: 'NOT_NEEDED',
        changesSharedApi: false,
        newArchitecture: false,
        multiAppImpact: false,
        summary: '',
      })
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RACI' })
      .expect(200);

    const seeded = await request(app.getHttpServer())
      .post(`/features/${featureId}/raci/seed`)
      .set('Authorization', `Bearer ${developerToken}`)
      .expect(200);
    const completeRows = (
      seeded.body.data as Array<{
        stepName: string;
        poValue: string;
        pmValue: string;
        developerValue: string;
        qaValue: string;
        sortOrder: number;
      }>
    ).map((row) => ({
      stepName: row.stepName,
      poValue: row.poValue === 'R' || row.poValue === 'A' ? row.poValue : 'A',
      pmValue: row.pmValue,
      developerValue:
        row.developerValue === 'R' || row.developerValue === 'A'
          ? row.developerValue
          : 'R',
      qaValue: row.qaValue,
      sortOrder: row.sortOrder,
    }));
    await request(app.getHttpServer())
      .put(`/features/${featureId}/raci`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ rows: completeRows })
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'IMPLEMENTATION' })
      .expect(200);

    await request(app.getHttpServer())
      .put(`/features/${featureId}/implementation-log`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        status: 'READY_FOR_TEST',
        summary: 'Built for review gate',
        branchOrPr: '',
        notes: '',
      })
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'TESTING' })
      .expect(200);

    await request(app.getHttpServer())
      .put(`/features/${featureId}/testing-checklist`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        status: 'PASSED',
        unitOrIntegrationPassed: true,
        acceptanceValidated: true,
        noOpenDecisionRequired: true,
        summary: 'Tests passed for review gate',
        notes: '',
      })
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'REVIEW' })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RELEASE' })
      .expect(400);

    await request(app.getHttpServer())
      .put(`/features/${featureId}/review-checklist`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({
        status: 'IN_PROGRESS',
        acceptanceCriteriaMet: true,
        noOpenDecisionRequired: true,
        rfcResolved: true,
        testingEvidenceReviewed: false,
        docsUpdatedIfNeeded: true,
        summary: 'Still reviewing',
        notes: '',
      })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RELEASE' })
      .expect(400);

    const approved = await request(app.getHttpServer())
      .put(`/features/${featureId}/review-checklist`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({
        status: 'APPROVED',
        acceptanceCriteriaMet: true,
        noOpenDecisionRequired: true,
        rfcResolved: true,
        testingEvidenceReviewed: true,
        docsUpdatedIfNeeded: true,
        summary: 'DoD approved for release',
        notes: '',
      })
      .expect(200);
    expect(approved.body.data.status).toBe('APPROVED');

    const got = await request(app.getHttpServer())
      .get(`/features/${featureId}/review-checklist`)
      .set('Authorization', `Bearer ${developerToken}`)
      .expect(200);
    expect(got.body.data.testingEvidenceReviewed).toBe(true);

    const toRelease = await request(app.getHttpServer())
      .patch(`/features/${featureId}/stage`)
      .set('Authorization', `Bearer ${poToken}`)
      .send({ stage: 'RELEASE' })
      .expect(200);
    expect(toRelease.body.data.currentStage).toBe('RELEASE');
  });
});
