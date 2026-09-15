# Scoutbook API — OpenAPI

Canonical OpenAPI 3 document for the NestJS API.

| Artifact | Path |
|---|---|
| Swagger UI (local) | `http://localhost:3000/docs` |
| JSON (runtime) | `http://localhost:3000/docs/json` |
| YAML (runtime) | `http://localhost:3000/docs/yaml` |
| YAML (repo) | [`openapi.yaml`](./openapi.yaml) |
| YAML (api package copy) | [`apps/api/openapi/openapi.yaml`](../../apps/api/openapi/openapi.yaml) |

## Regenerate from Nest decorators

With MySQL running and `apps/api/.env` set:

```bash
pnpm --filter @scoutbook/api openapi:export
```

Or start the API (`pnpm --filter @scoutbook/api start:dev`) — on boot it also
writes both YAML files unless `SWAGGER_WRITE_FILES=0`.

## Auth in Swagger UI

1. `POST /auth/login`
2. Copy `accessToken`
3. Click **Authorize** → Bearer `access-token` → paste token
4. Call `GET /auth/me`

## Errors

See [errors.md](./errors.md) for the stable error envelope.
