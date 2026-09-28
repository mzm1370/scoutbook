# RFC 0006 — Feature RACI Matrix

Status: Accepted  
Date: 2026-09  
Depends on: [0004-feature-stage-transitions](./0004-feature-stage-transitions.md),
[0005-feature-rfc-check](./0005-feature-rfc-check.md),
[feature lifecycle](../process/feature-lifecycle.md)

## Summary

Attach a short **RACI matrix** to each Feature: named steps with R/A/C/I
(or blank) for PO, PM, Developer, and QA. Seed sensible defaults; edit in
place. Leaving RACI requires a complete matrix.

## Motivation

Stage 4 makes ownership explicit. Without it, work stalls on “whose turn?”.

## Detailed design

### Data model

```
RaciAssignment
  id               INT PK
  featureId        INT NOT NULL → Feature.id
  stepName         VARCHAR(120) NOT NULL
  poValue          ENUM('','R','A','C','I') NOT NULL DEFAULT ''
  pmValue          ENUM('','R','A','C','I') NOT NULL DEFAULT ''
  developerValue   ENUM('','R','A','C','I') NOT NULL DEFAULT ''
  qaValue          ENUM('','R','A','C','I') NOT NULL DEFAULT ''
  sortOrder        INT NOT NULL DEFAULT 0
  createdAt        DATETIME
  updatedAt        DATETIME
  UNIQUE (featureId, stepName)
```

### Default seed steps (lifecycle)

1. Resolve open ambiguities  
2. Approve the RFC  
3. Implement it  
4. Write / update tests  
5. Validate acceptance criteria  
6. Final sign-off for release  

Default letter values match the lifecycle table (PO=A on ambiguities, etc.).

### API (JWT — any authenticated)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/features/:id/raci` | List rows ordered by `sortOrder` |
| `POST` | `/features/:id/raci/seed` | Seed defaults if empty (`201` / `200` if already present) |
| `PUT` | `/features/:id/raci` | Replace entire matrix |

`PUT` body:

```json
{
  "rows": [
    {
      "stepName": "Implement it",
      "poValue": "I",
      "pmValue": "I",
      "developerValue": "R",
      "qaValue": "I",
      "sortOrder": 2
    }
  ]
}
```

Validation on PUT: 1–20 rows; `stepName` 2–120 unique within payload;
each value in `''|R|A|C|I`. Soft completeness (exactly one R and one A per
row) is **not** required on save — only on stage gate.

### Stage gate (extends RFC 0004)

Leaving `RACI` → `IMPLEMENTATION` requires:

1. At least one RACI row exists  
2. Every row has **at least one** `R` and **at least one** `A` among the four roles  

(Multiple R or A on one step is allowed — matches the lifecycle defaults.)

### Frontend

Replace RACI placeholder with a responsive table (cards on narrow screens):
seed button, editable selects, save all.

## Alternatives considered

- Per-cell PATCH only — rejected for v1; full replace is simpler.  
- Force complete matrix on every save — rejected (progressive capture).

## Acceptance criteria

- [x] GET / seed / PUT work with uniform envelope  
- [x] Seed is idempotent when rows already exist  
- [x] RACI → IMPLEMENTATION gated on complete R+A per row  
- [x] Feature detail UI; unit + e2e; OpenAPI updated  
