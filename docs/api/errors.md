# API error envelope

All failed HTTP responses from Scoutbook API use one JSON shape
(`ApiErrorBody` in `@scoutbook/types`):

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": ["title must be longer than or equal to 3 characters"],
  "path": "/features",
  "timestamp": "2026-09-15T07:00:00.000Z"
}
```

| Field | Notes |
|---|---|
| `message` | Always a **string** — safe to show in UI |
| `details` | Optional validation/constraint list |
| `code` | Machine code: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_ERROR`, … |

Implemented by `AllExceptionsFilter` (`apps/api/src/common/filters/`).  
Unexpected 500s never leak stack traces when `NODE_ENV=production`.

Web client: `ApiError` in `apps/web/src/lib/api.ts` parses this envelope.
