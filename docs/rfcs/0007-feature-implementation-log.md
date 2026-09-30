# RFC 0007 — Feature Implementation Log

Status: Accepted  
Date: 2026-09  
Depends on: [0004-feature-stage-transitions](./0004-feature-stage-transitions.md),
[0006-feature-raci](./0006-feature-raci.md),
[feature lifecycle](../process/feature-lifecycle.md)

## Summary

Attach a short **implementation log** to each Feature (0-or-1): status,
what was built, optional branch/PR link, and a short note. Leaving
Implementation requires the log to be Ready for test.

## Motivation

Stage 5 is where spoken “I’m coding X” disappears. A few structured
fields keep Developer progress durable without essays.

## Detailed design

### Data model

```
FeatureImplementationLog
  id               INT PK
  featureId        INT NOT NULL UNIQUE → Feature.id
  status           ENUM('NOT_STARTED','IN_PROGRESS','READY_FOR_TEST')
                   NOT NULL DEFAULT 'NOT_STARTED'
  summary          VARCHAR(500) NOT NULL DEFAULT ''
  branchOrPr       VARCHAR(300) NOT NULL DEFAULT ''
  notes            VARCHAR(500) NOT NULL DEFAULT ''
  updatedByUserId  INT NULL
  createdAt        DATETIME
  updatedAt        DATETIME
```

### API (JWT — any authenticated)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/features/:id/implementation-log` | Get log (`404` if none) |
| `PUT` | `/features/:id/implementation-log` | Upsert log |

`PUT` body:

```json
{
  "status": "READY_FOR_TEST",
  "summary": "POST /reminders + unit tests",
  "branchOrPr": "feat/reminders",
  "notes": "Cron deferred"
}
```

Validation: `summary` and `notes` max 500; `branchOrPr` max 300.
When `status` is `READY_FOR_TEST`, `summary` must be ≥ 5 characters.

### Stage gate (extends RFC 0004)

Leaving `IMPLEMENTATION` → `TESTING` requires:

1. An implementation log exists  
2. `status === READY_FOR_TEST`  
3. `summary` length ≥ 5  

### Frontend

Feature detail panel: status select, short summary, optional branch/PR,
optional notes, save. Progressive — can save `NOT_STARTED` / `IN_PROGRESS`
early.

## Alternatives considered

- Free-form markdown blob only — rejected (charter wants structured fields).  
- Require log on every save of incomplete work — rejected (progressive capture).

## Acceptance criteria

- [x] GET / PUT with uniform envelope  
- [x] IMPLEMENTATION → TESTING gated on Ready for test + summary  
- [x] Feature detail UI; unit + e2e; OpenAPI updated  
