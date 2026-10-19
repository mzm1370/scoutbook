# RFC 0023 — Requirement Ambiguity Tracking

Status: Accepted  
Date: 2026-10  
Depends on: [0003-scouting-entries](./0003-scouting-entries.md),
[0012-decisions-needed](./0012-decisions-needed.md),
[feature lifecycle](../process/feature-lifecycle.md)

## Summary

Add a cross-feature **Ambiguity Tracking** view matching the Testing
Scouting Assessment table: Current / Expected / PO Decision / Risk /
Status for **all** scouting statuses (not only Decision Required).

## Motivation

RFC 0012 inbox shows only `DECISION_REQUIRED`. The assessment doc’s
Requirement Ambiguity Tracking Table also lists Ready, Investigating, and
Blocked so the team can see what is safe to test vs blocked. Without a
full table, Ready and Investigating rows stay buried on Feature detail.

## Detailed design

### API (JWT — any authenticated)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/ambiguity-tracking` | List scouting rows with feature context |

Query:

- `status` — optional, repeatable or comma-separated  
  (`READY` \| `DECISION_REQUIRED` \| `INVESTIGATING` \| `BLOCKED`)  
  Omit = all statuses.

Response item (`AmbiguityTrackingItem`):

```
entryId, featureId, featureTitle, featureStage, riskTier,
question, currentState, expected, decision, status (ScoutingStatus),
updatedAt
```

Sorted by `updatedAt` DESC, then `entryId` DESC.

`GET /decisions-needed` stays unchanged (Decision Required only).

No create/update here — resolve via
`PATCH /features/:id/scouting/:entryId`.

### Frontend

- Route: `/ambiguity`
- Sidebar: **Ambiguity tracking**
- Status filter chips (All + each status)
- Desktop: table (Feature, Question, Current, Expected, Decision, Status, Risk, Action)
- Mobile: cards (same fields, stacked)
- Empty state + link to Features
- Short reminder: do not treat non-Ready rows as final test specs
- Action → `/features/:id`

### Out of scope

- Inline edit in the table  
- Bug triage `SCOUTING_GAP` rows  
- Export CSV  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] `GET /ambiguity-tracking` (+ status filter)  
- [x] `/ambiguity` UI + sidebar; responsive  
- [x] Unit tests; Decisions Needed unchanged  
