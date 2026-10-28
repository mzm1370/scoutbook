# RFC 0028 — Feature UX Design Artifact

Status: Accepted  
Date: 2026-10  
Depends on: [0004-feature-stage-transitions](./0004-feature-stage-transitions.md),
[0022-feature-process-track](./0022-feature-process-track.md),
[0025-designer-tech-lead-roles](./0025-designer-tech-lead-roles.md)

## Summary

Add a short **UX design** record per Feature so Designer (and others) capture
that happy, empty, loading, and error states were designed — without inserting
a ninth Kanban stage.

## Motivation

The Testing Scouting Assessment Stage 3 asks for mockups covering all UI
states via the shared ui-kit. Scoutbook’s pipeline already uses **RFC** for
ceremony; UX detail was missing as a structured written record.

## Detailed design

### Data model (1:1)

`FeatureUxDesign`:

| Field | Notes |
|---|---|
| `status` | `NOT_STARTED` \| `IN_PROGRESS` \| `READY` \| `NOT_NEEDED` |
| `happyPathCovered` | bool |
| `emptyStateCovered` | bool |
| `loadingStateCovered` | bool |
| `errorStateCovered` | bool |
| `summary` | ≤500 — one sentence / mockup note |
| `mockupPath` | ≤200 — optional link or `docs/` path |
| `notes` | ≤500 optional |

### Validation

- `NOT_NEEDED` → all four state flags false; summary optional  
- `READY` → all four true; summary ≥ 5 chars  
- `IN_PROGRESS` / `NOT_STARTED` → no extra rules  

### Stage gate (`RFC` → `RACI`)

| Process track | Required UX status |
|---|---|
| `LIGHT` | `NOT_NEEDED` or `READY` |
| `RFC` | `READY` |

Missing row → 400 with a clear message.

### API

| Method | Path | Who |
|---|---|---|
| `GET` | `/features/:id/ux-design` | Auth — 404 if never saved |
| `PUT` | `/features/:id/ux-design` | Auth upsert |

### CASL

Subject `UxDesign` with `update` for all roles (same as other stage artifacts).

### Web

Panel on Feature detail (near RFC panels). Short checkboxes + status select.

### Out of scope

- New FEATURE_STAGE value  
- File upload for mockups  
- RACI letter ACL for UX step  
- Auto-embed Figma  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Types + entity + API  
- [x] RFC→RACI gate by process track  
- [x] Feature detail panel  
- [x] Unit tests + graphify  
