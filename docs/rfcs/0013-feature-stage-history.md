# RFC 0013 — Feature Stage History

Status: Accepted  
Date: 2026-09  
Depends on: [0004-feature-stage-transitions](./0004-feature-stage-transitions.md)

## Summary

Append-only **stage history** on each Feature: every successful stage move
(and the initial IDEA on create) is recorded with who changed it and when.

## Motivation

Kanban and stage advance need an audit trail. Without history, teams cannot
answer “when did this leave Scouting?” or who advanced it.

## Detailed design

### Data model

```
FeatureStageHistory
  id                INT PK
  featureId         INT NOT NULL INDEX → Feature.id
  fromStage         ENUM(FeatureStage) NULL   # null = Feature created at IDEA
  toStage           ENUM(FeatureStage) NOT NULL
  changedByUserId   INT NOT NULL
  createdAt         DATETIME
```

No updates/deletes in v1.

### Write path

1. `POST /features` — insert row `{ fromStage: null, toStage: 'IDEA', changedByUserId }`
2. `PATCH /features/:id/stage` — after gates pass and save, insert
   `{ fromStage: previous, toStage: next, changedByUserId }`

### API (JWT)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/features/:id/stage-history` | List history oldest → newest |

Any authenticated role. Empty array only if Feature missing → `404` on Feature;
history always has at least the IDEA create row for new Features.

### Frontend

Feature detail: short timeline under Lifecycle stage (from → to, who, when).
Responsive list; no edit.

## Alternatives considered

- Only log advances (skip create) — rejected (incomplete trail).  
- Embed history on Feature GET — deferred (keep list endpoint lean).

## Acceptance criteria

- [x] History row on create + each advance  
- [x] `GET /features/:id/stage-history`  
- [x] Feature detail UI; unit + e2e; OpenAPI updated  
