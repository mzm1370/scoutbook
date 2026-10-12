# RFC 0022 — Feature Process Track (Light vs RFC)

Status: Accepted  
Date: 2026-10  
Depends on: [0002-feature-record](./0002-feature-record.md),
[0004-feature-stage-transitions](./0004-feature-stage-transitions.md),
[0005-feature-rfc-check](./0005-feature-rfc-check.md),
[0016-feature-rfc-document](./0016-feature-rfc-document.md),
[0019-casl-permissions](./0019-casl-permissions.md)

## Summary

Add `processTrack` (`LIGHT` | `RFC`) on each Feature so teams classify
ceremony up front — matching Testing Scouting Assessment Part III
(Light vs RFC tracks). Same 8 stages; **RFC-stage gates** differ by track.

## Motivation

Today every Feature can leave RFC with `NOT_NEEDED` or `ACCEPTED`. Small
fixes and large cross-cutting work look the same. The assessment doc
requires an explicit Light vs RFC classification before design ceremony.

## Detailed design

### Data model

```
Feature.processTrack  ENUM('LIGHT','RFC') NOT NULL DEFAULT 'RFC'
```

### Shared types (`@scoutbook/types`)

- `FeatureProcessTrack`, `FEATURE_PROCESS_TRACKS`
- `suggestedProcessTrack(riskTier)`
- `assertProcessTrackAllowed(track, riskTier)` — P1 cannot be LIGHT
- `CreateFeatureRequest.processTrack` required
- `UpdateFeatureRequest` — optional `processTrack` / `riskTier`
- `Feature.processTrack` on responses

### Rules

1. **Create (PO)** — `processTrack` required; P1 + LIGHT → `400`.
2. **Update (PO/PM)** — `PATCH /features/:id` may change `processTrack`
   and/or `riskTier` while `currentStage` is `IDEA` | `SCOUTING` | `RFC` |
   `RACI`. After `IMPLEMENTATION` → `400` (track locked). P1 + LIGHT → `400`.
3. **CASL** — `update` Feature for PO and PM.
4. **RFC → RACI gate** (extends 0004/0005/0016):
   - **LIGHT** — saved check with status **`NOT_NEEDED`** only.
   - **RFC** — check **`ACCEPTED`** and RFC document **`ACCEPTED`**.
5. Stages are never skipped on Light.

### API

| Method | Path | Who |
|---|---|---|
| `POST /features` | body includes `processTrack` | PO |
| `PATCH /features/:id` | `{ processTrack?, riskTier? }` | PO/PM |

### Frontend

- New Feature: risk + track selects; suggest track when risk changes.
- Detail: Track badge; PO/PM can edit track/risk before Implementation.
- RFC panels: short help text by track (Light → Not needed; RFC → Accepted doc).
- List / Kanban: show Track badge.

### Docs sync

Overview markdown includes `- Track: LIGHT|RFC`.

## Out of scope

- Skipping Scouting/RACI stages on Light  
- Designer / Tech Lead roles  
- Auto-creating RFC check rows  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Types + entity + DTOs + create/update  
- [x] Track-specific RFC→RACI gates + unit tests  
- [x] Web create/detail/badges  
- [x] Docs sync overview line  
