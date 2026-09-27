# RFC 0005 — Feature RFC Check Record

Status: Accepted  
Date: 2026-09  
Depends on: [0003-scouting-entries](./0003-scouting-entries.md),
[0004-feature-stage-transitions](./0004-feature-stage-transitions.md),
[feature lifecycle](../process/feature-lifecycle.md)

## Summary

Attach one short **RFC check** record per Feature: decide whether a written
RFC is needed, capture the three checklist answers, and a brief summary —
not a full markdown RFC editor.

## Motivation

Stage 3 asks “do we need an RFC?” That answer must be written on the Feature
before moving to RACI. Full RFC bodies stay in `docs/rfcs/` for now.

## Detailed design

### Data model (1:1 with Feature)

```
FeatureRfcCheck
  id                  INT PK
  featureId           INT UNIQUE → Feature.id
  status              ENUM(NOT_CHECKED, NOT_NEEDED, NEEDED, ACCEPTED)
                      NOT NULL DEFAULT 'NOT_CHECKED'
  changesSharedApi    BOOL NOT NULL DEFAULT false
  newArchitecture     BOOL NOT NULL DEFAULT false
  multiAppImpact      BOOL NOT NULL DEFAULT false
  summary             VARCHAR(500) NOT NULL DEFAULT ''
  docPath             VARCHAR(200) NOT NULL DEFAULT ''
                      # optional pointer e.g. docs/rfcs/0006-….md
  updatedByUserId     INT NULL
  createdAt           DATETIME
  updatedAt           DATETIME
```

### Meaning of status

| Status | Meaning |
|---|---|
| `NOT_CHECKED` | Not filled yet |
| `NOT_NEEDED` | All three checklist items false; no RFC |
| `NEEDED` | At least one checklist item true; RFC required (not accepted yet) |
| `ACCEPTED` | RFC needed and accepted (doc exists / PO-PM confirmed) |

### API (JWT)

| Method | Path | Who |
|---|---|---|
| `GET` | `/features/:id/rfc-check` | Any authenticated — `404` if never saved |
| `PUT` | `/features/:id/rfc-check` | Any authenticated upsert; **`ACCEPTED` only PO/PM** |

Validation:

- `NOT_NEEDED` → all three booleans must be false; summary optional (max 500)
- `NEEDED` / `ACCEPTED` → at least one boolean true; summary min 5 chars
- `NOT_CHECKED` → allowed as reset/draft; no extra rules
- `docPath` optional, max 200

### Stage gate (extends RFC 0004)

Leaving `RFC` → `RACI` requires a saved check with status **`NOT_NEEDED` or
`ACCEPTED`**. Missing check, `NOT_CHECKED`, or `NEEDED` → `400`.

### Frontend

Replace Feature detail RFC placeholder with short form: 3 checkboxes, status
select, summary, optional doc path. Show help text from lifecycle Stage 3.

## Alternatives considered

- Full in-app RFC markdown — deferred (heavier; docs/ folder remains source).
- Booleans only without status — rejected; need Accepted vs Needed.

## Drawbacks

`ACCEPTED` does not verify the markdown file exists on disk.

## Acceptance criteria

- [ ] GET/PUT rfc-check work with uniform envelope
- [ ] Validation rules above enforced
- [ ] ACCEPTED restricted to PO/PM
- [ ] RFC → RACI gated on NOT_NEEDED or ACCEPTED
- [ ] Feature detail UI; unit + e2e; OpenAPI updated
