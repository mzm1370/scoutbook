# API request / response envelope

All Scoutbook HTTP JSON responses use a uniform envelope
(`ApiSuccessResponse` / `ApiFailureResponse` in `@scoutbook/types`).

## Success

Produced by `ResponseTransformInterceptor`:

```json
{
  "success": true,
  "data": { "...": "controller return value" },
  "meta": {
    "path": "/features",
    "timestamp": "2026-09-15T07:00:00.000Z",
    "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

## Failure

Produced by `AllExceptionsFilter` via `ApiResponse.failure`
(`error` matches `ApiErrorBody`):

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "error": "Bad Request",
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": ["title must be longer than or equal to 3 characters"],
    "path": "/features",
    "timestamp": "2026-09-15T07:00:00.000Z",
    "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

| Field | Notes |
|---|---|
| `error.message` | Always a **string** — safe to show in UI |
| `error.details` | Optional validation/constraint list |
| `error.code` | Machine code: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_ERROR`, … |

Request context: `RequestContextMiddleware` sets `x-request-id` (echoes client
header or generates a UUID).

Unexpected 500s never leak stack traces when `NODE_ENV=production`.

## Web client

- `HttpClient` (`apps/web/src/lib/http-client.ts`) — single request entry
- `unwrapApiData` / envelope helpers (`api-envelope.ts`)
- `ApiError` (`api-error.ts`) — typed failures for toasts / forms
