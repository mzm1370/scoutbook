/**
 * Export OpenAPI YAML without starting HTTP (uses Nest testing module).
 * Run: pnpm --filter @scoutbook/api openapi:export
 */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  buildOpenApiDocument,
  OPENAPI_YAML_PATHS,
  writeOpenApiYaml,
} from './swagger.js';

async function exportOpenApi() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const document = buildOpenApiDocument(app);
  writeOpenApiYaml(document);
  await app.close();

  for (const path of OPENAPI_YAML_PATHS) {
    console.log(`Wrote ${path}`);
  }
}

await exportOpenApi();
