# RFC 0009 — Feature Review Checklist

Status: Accepted  
Date: 2026-09  
Depends on: [0004-feature-stage-transitions](./0004-feature-stage-transitions.md),
[0008-feature-testing-checklist](./0008-feature-testing-checklist.md),
[feature lifecycle](../process/feature-lifecycle.md)

## Summary

Attach a short **review checklist** (Definition of Done) to each Feature
(0-or-1). Second-person confirmation before Release. Leaving Review
requires Approved.

## Motivation

Stage 7 is checklist-driven, not “looks fine.” A structured DoD record
keeps business control without long review essays.

## Detailed design

### Data model

```
FeatureReviewChecklist
  id                       INT PK
  featureId                INT NOT NULL UNIQUE → Feature.id
  status                   ENUM('NOT_STARTED','IN_PROGRESS','APPROVED')
                           NOT NULL DEFAULT 'NOT_STARTED'
  acceptanceCriteriaMet    BOOLEAN NOT NULL DEFAULT false
  noOpenDecisionRequired   BOOLEAN NOT NULL DEFAULT false
  rfcResolved              BOOLEAN NOT NULL DEFAULT false
  testingEvidenceReviewed  BOOLEAN NOT NULL DEFAULT false
  docsUpdatedIfNeeded      BOOLEAN NOT NULL DEFAULT false
  summary                  VARCHAR(500) NOT NULL DEFAULT ''
  notes                    VARCHAR(500) NOT NULL DEFAULT ''
  updatedByUserId          INT NULL
  createdAt                DATETIME
  updatedAt                DATETIME
```

### API (JWT — any authenticated)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/features/:id/review-checklist` | Get checklist (`404` if none) |
| `PUT` | `/features/:id/review-checklist` | Upsert checklist |

When `status` is `APPROVED`: all five booleans must be `true`, and
`summary` ≥ 5 characters.

### Stage gate (extends RFC 0004)

Leaving `REVIEW` → `RELEASE` requires:

1. Checklist exists  
2. `status === APPROVED`  
3. All five DoD checkboxes true  
4. `summary` length ≥ 5  

v1 does not enforce a different user than the implementer (later ACL).

### Frontend

Feature detail panel: status, five DoD checkboxes, summary, optional notes.

## Alternatives considered

- Free-form review comment only — rejected (not structured DoD).  
- Force different reviewer userId — deferred (role ACL later).

## Acceptance criteria

- [x] GET / PUT with uniform envelope  
- [x] REVIEW → RELEASE gated on Approved + all checks + summary  
- [x] Feature detail UI; unit + e2e; OpenAPI updated  
