# RFC 0008 — Feature Testing Checklist

Status: Accepted  
Date: 2026-09  
Depends on: [0004-feature-stage-transitions](./0004-feature-stage-transitions.md),
[0007-feature-implementation-log](./0007-feature-implementation-log.md),
[feature lifecycle](../process/feature-lifecycle.md)

## Summary

Attach a short **testing checklist** to each Feature (0-or-1): status,
three proof checkboxes (automated tests, QA acceptance, no open Decision
Required), and a one-line summary. Leaving Testing requires Passed.

## Motivation

Stage 6 must prove the change works and acceptance is met — without long
test reports. Structured checkboxes keep PO/PM/Dev/QA aligned.

## Detailed design

### Data model

```
FeatureTestingChecklist
  id                      INT PK
  featureId               INT NOT NULL UNIQUE → Feature.id
  status                  ENUM('NOT_STARTED','IN_PROGRESS','PASSED')
                          NOT NULL DEFAULT 'NOT_STARTED'
  unitOrIntegrationPassed BOOLEAN NOT NULL DEFAULT false
  acceptanceValidated     BOOLEAN NOT NULL DEFAULT false
  noOpenDecisionRequired  BOOLEAN NOT NULL DEFAULT false
  summary                 VARCHAR(500) NOT NULL DEFAULT ''
  notes                   VARCHAR(500) NOT NULL DEFAULT ''
  updatedByUserId         INT NULL
  createdAt               DATETIME
  updatedAt               DATETIME
```

### API (JWT — any authenticated)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/features/:id/testing-checklist` | Get checklist (`404` if none) |
| `PUT` | `/features/:id/testing-checklist` | Upsert checklist |

When `status` is `PASSED`: all three booleans must be `true`, and
`summary` ≥ 5 characters.

### Stage gate (extends RFC 0004)

Leaving `TESTING` → `REVIEW` requires:

1. Checklist exists  
2. `status === PASSED`  
3. All three checkboxes true  
4. `summary` length ≥ 5  

### Frontend

Feature detail panel: status, three checkboxes, summary, optional notes.

## Alternatives considered

- Paste full CI logs — rejected (too heavy for v1).  
- Auto-query scouting for Decision Required on gate — deferred; checkbox is the written confirmation for v1.

## Acceptance criteria

- [x] GET / PUT with uniform envelope  
- [x] TESTING → REVIEW gated on Passed + checkboxes + summary  
- [x] Feature detail UI; unit + e2e; OpenAPI updated  
