import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Repo OpenAPI destinations (resolved from apps/api/dist at runtime). */
export const OPENAPI_YAML_PATHS = [
  resolve(__dirname, '../../../docs/api/openapi.yaml'),
  resolve(__dirname, '../openapi/openapi.yaml'),
] as const;

export function buildOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Scoutbook API')
    .setDescription(
      'Scoutbook backend — structured decision records for PO/PM/Developer/QA teams. ' +
        'Auth uses JWT bearer tokens (1h). See docs/rfcs/0001-authentication.md.',
    )
    .setVersion('0.1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste the accessToken from POST /auth/login',
      },
      'access-token',
    )
    .addTag('health', 'Liveness checks')
    .addTag('auth', 'Registration, login, and current user')
    .addTag('features', 'Feature records (Idea → Release pipeline)')
    .addServer('http://localhost:3000', 'Local development')
    .build();

  return SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
  });
}

export function setupSwagger(app: INestApplication): void {
  const document = buildOpenApiDocument(app);

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
    yamlDocumentUrl: 'docs/yaml',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  if (process.env.SWAGGER_WRITE_FILES !== '0') {
    writeOpenApiYaml(document);
  }
}

export function writeOpenApiYaml(document: object): void {
  const yaml = stringify(document, {
    indent: 2,
    lineWidth: 100,
  });

  for (const filePath of OPENAPI_YAML_PATHS) {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, yaml, 'utf8');
  }
}
