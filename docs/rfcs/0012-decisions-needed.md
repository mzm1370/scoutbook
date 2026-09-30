# RFC 0012 — Decisions Needed Inbox

Status: Accepted  
Date: 2026-09  
Depends on: [0003-scouting-entries](./0003-scouting-entries.md),
[feature lifecycle](../process/feature-lifecycle.md)

## Summary

Cross-feature **Decisions Needed** inbox: list every scouting row with status
`DECISION_REQUIRED` so PO/PM (and the team) see open ambiguities in one place
instead of opening each Feature.

## Motivation

Ambiguity rows live on Features. Without a cross-feature view, Decision
Required items hide until someone opens the right detail page. Charter-style
process needs a PO inbox.

## Detailed design

### API (JWT — any authenticated)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/decisions-needed` | List open Decision Required scouting rows |

Response item (envelope `data` array):

```
DecisionNeededItem
  entryId          INT
  featureId        INT
  featureTitle     string
  featureStage     FeatureStage
  riskTier         P1|P2|P3
  question         string
  currentState     string
  expected         string
  decision         string   # often empty until PO resolves
  status           'DECISION_REQUIRED'
  updatedAt        ISO string
```

Sorted by `updatedAt` DESC, then `entryId` DESC. Empty array if none.

No create/update here — resolve via existing
`PATCH /features/:id/scouting/:entryId` (set Ready + decision).

### Frontend

- Route: `/decisions`
- Sidebar: **Decisions Needed** (replace “Coming soon”)
- Responsive list/cards: question, feature link, stage, risk; empty state
  with one next action
- Link each row to `/features/:id` (scouting panel)

### Out of scope

- Auto-include INVESTIGATING / BLOCKED (later filter)  
- Bug triage SCOUTING_GAP rows (stay on Feature / Task 9)  
- In-inbox edit form (use Feature detail)

## Alternatives considered

- Client-only: fetch all features + all scouting — rejected (chatty, slow).  
- Include all non-Ready statuses — deferred (v1 = Decision Required only).

## Acceptance criteria

- [x] `GET /decisions-needed` returns Decision Required rows with feature context  
- [x] `/decisions` UI + sidebar; responsive; builds  
- [x] Unit + e2e; OpenAPI updated  
