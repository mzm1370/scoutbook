# RFC 0016 — Feature RFC Document

Status: Accepted  
Date: 2026-09  
Depends on: [0005-feature-rfc-check](./0005-feature-rfc-check.md),
[0004-feature-stage-transitions](./0004-feature-stage-transitions.md)

## Summary

When an RFC is needed, capture a **structured RFC document** on the Feature
(summary, motivation, design, alternatives, drawbacks) with Draft / Accepted /
Rejected — not a free-form markdown blob.

## Motivation

RFC 0005 deferred the full body to `docs/rfcs/`. Teams still need an in-app
written design before RACI when the check says Needed/Accepted. Charter success
criterion: unambiguous structured fields for humans (and later agents).

## Detailed design

### Data model (0–1 per Feature)

```
FeatureRfcDocument
  id                INT PK
  featureId         INT UNIQUE → Feature.id
  status            ENUM(DRAFT, ACCEPTED, REJECTED) DEFAULT DRAFT
  summary           VARCHAR(500) NOT NULL DEFAULT ''
  motivation        VARCHAR(500) NOT NULL DEFAULT ''
  detailedDesign    VARCHAR(500) NOT NULL DEFAULT ''
  alternatives      VARCHAR(500) NOT NULL DEFAULT ''
  drawbacks         VARCHAR(500) NOT NULL DEFAULT ''
  updatedByUserId   INT NULL
  createdAt         DATETIME
  updatedAt         DATETIME
```

### Status rules

| Status | Who | Content |
|---|---|---|
| `DRAFT` | any auth | any lengths (save early) |
| `ACCEPTED` | PO/PM only | summary, motivation, detailedDesign each ≥ 5 |
| `REJECTED` | PO/PM only | summary ≥ 5 (why rejected) |

### API (JWT)

| Method | Path | Who |
|---|---|---|
| `GET` | `/features/:id/rfc` | any auth — `404` if never saved |
| `PUT` | `/features/:id/rfc` | any auth upsert; ACCEPTED/REJECTED = PO/PM |

### Stage gate (extends RFC 0005)

RFC → RACI still requires check `NOT_NEEDED` or `ACCEPTED`.

**Additional:** if check is `ACCEPTED`, a FeatureRfcDocument with status
`ACCEPTED` must exist (body rules above). `NOT_NEEDED` does not require a document.

### Frontend

Feature detail: RFC document panel near RFC check. Short fields, status select,
responsive. Empty until first save.

### Docs sync

When a document exists, emit `docs/features/<slug>/rfc.md` (optional section).

## Alternatives considered

- Replace RFC check with document only — rejected (need yes/no checklist still).  
- Free-form markdown — rejected (charter: structured fields).  
- Force document even when NOT_NEEDED — rejected (ceremony tax).

## Acceptance criteria

- [x] Entity + GET/PUT API + PO/PM accept/reject  
- [x] Gate when check ACCEPTED  
- [x] Feature detail UI; unit + e2e; OpenAPI; docs-sync includes rfc.md  
