# RFC 0003 — Scouting Entries

Status: Accepted  
Date: 2026-09  
Depends on: [0000-charter](./0000-charter.md), [0002-feature-record](./0002-feature-record.md),
[feature lifecycle](../process/feature-lifecycle.md)

## Summary

Attach short Scouting rows to a Feature so unknowns are written (not guessed)
before tests or implementation deepen behavior.

## Motivation

Stage 2 of the lifecycle requires a living ambiguity table. Types already
existed; without API/UI, spoken unknowns stay verbal.

## Detailed design

### Data model

```
ScoutingEntry
  id            INT PK
  featureId     INT NOT NULL → Feature.id
  question      VARCHAR(200) NOT NULL
  currentState  VARCHAR(300) NOT NULL
  expected      VARCHAR(300) NOT NULL
  decision      VARCHAR(300) NOT NULL DEFAULT ''
  status        ENUM(READY, DECISION_REQUIRED, INVESTIGATING, BLOCKED)
                NOT NULL DEFAULT 'INVESTIGATING'
  createdAt     DATETIME
  updatedAt     DATETIME
```

`NOT_DECIDED` (old type) is removed; use `INVESTIGATING`.

### API (JWT required)

| Method | Path | Who |
|---|---|---|
| `GET` | `/features/:id/scouting` | Any authenticated |
| `POST` | `/features/:id/scouting` | Any authenticated |
| `PATCH` | `/features/:id/scouting/:entryId` | Any authenticated |

No delete in this RFC (keep history).

Uniform envelope applies. Missing Feature → `404`. Entry not on Feature → `404`.

Validation (short capture): `question` 2–200; `currentState` / `expected` 1–300;
`decision` 0–300. If `status` is `READY`, `decision` must be non-empty (trimmed).

### Frontend

Feature detail: list rows + short add/edit form. Status via select. Help text:
do not write tests for `DECISION_REQUIRED` / `INVESTIGATING` / `BLOCKED` behavior.

## Alternatives considered

- Markdown-only scouting files — rejected for v1 product UX; export/sync later.
- PO-only create — rejected; Developer/QA must capture unknowns quickly; PO
  resolves via status/`decision`.

## Drawbacks

Any role can edit rows (fine-grained RACI ACL is a later RFC).

## Effect on dependency graph and tests

New Nest module/entity under `features`; web Feature detail page. Targeted
tests: `@scoutbook/api`, `@scoutbook/web`, `@scoutbook/types`.

## Unresolved questions

None for this RFC. Stage auto-bump `IDEA → SCOUTING` deferred.

## Acceptance criteria

- [ ] Authenticated list/create/patch scouting rows
- [ ] Statuses: READY | DECISION_REQUIRED | INVESTIGATING | BLOCKED
- [ ] Short field limits enforced
- [ ] Feature detail UI works on phone/desktop
- [ ] Unit + e2e coverage; OpenAPI updated
