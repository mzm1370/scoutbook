# RFC 0004 — Feature Stage Transitions

Status: Accepted  
Date: 2026-09  
Depends on: [0002-feature-record](./0002-feature-record.md),
[0003-scouting-entries](./0003-scouting-entries.md),
[feature lifecycle](../process/feature-lifecycle.md)

## Summary

Allow **PO** and **PM** to advance a Feature one stage at a time along the
fixed 8-stage order. Leaving Scouting requires no open ambiguity rows.

## Motivation

Without stage moves, Features stay on `IDEA` forever even after Scouting.
RFC/RACI UIs should land on a real pipeline, not static labels.

## Detailed design

### API

`PATCH /features/:id/stage` — roles: **PO**, **PM**

```json
{ "stage": "SCOUTING" }
```

Success `200` — updated Feature. Uniform envelope applies.

### Rules

1. **Forward only, one step** — target must be the immediate next stage in
   `FEATURE_STAGES`. Skip or backward → `400`.
2. **Final stage** — already `RELEASE` → `400` (no next stage).
3. **Scouting gate** — when current is `SCOUTING` and target is `RFC`, reject
   with `400` if any scouting row has status
   `DECISION_REQUIRED`, `INVESTIGATING`, or `BLOCKED`.
   Empty scouting list or all `READY` is allowed.
4. **Auth** — JWT required; `DEVELOPER` / `QA` → `403`.

### Shared helper

`nextFeatureStage(current)` in `@scoutbook/types` — used by API and web.

### Frontend

Feature detail: show next stage and an **Advance** button for PO/PM only.

## Alternatives considered

- Free-form stage set — rejected (skips break the lifecycle).
- Any role may advance — rejected for this task; PO/PM accountable.
- Require ≥1 Ready scouting row before RFC — deferred; empty is allowed.

## Drawbacks

No backward move yet (admin/force later). Developers cannot advance stages
even when blocked waiting on PO (by design for v1).

## Effect on dependency graph and tests

Touches `@scoutbook/types`, API features module, Feature detail page.

## Unresolved questions

None for this RFC.

## Acceptance criteria

- [ ] `IDEA → SCOUTING → RFC` one step at a time
- [ ] Skip forward → `400`
- [ ] Open scouting blockers → `400` on `SCOUTING → RFC`
- [ ] Non–PO/PM → `403`
- [ ] Unit + e2e; OpenAPI updated
