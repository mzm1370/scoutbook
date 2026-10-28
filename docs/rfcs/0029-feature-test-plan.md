# RFC 0029 — Feature Test Plan Artifact

Status: Accepted  
Date: 2026-10  
Depends on: [0004-feature-stage-transitions](./0004-feature-stage-transitions.md),
[0008-feature-testing-checklist](./0008-feature-testing-checklist.md),
[0022-feature-process-track](./0022-feature-process-track.md)

## Summary

Add a short **test plan** record per Feature so PO/PM/QA/Tech Lead capture
Unit / Integration / E2E obligations **before Implementation** — without a
ninth Kanban stage. Distinct from the Testing-stage checklist (evidence after
code).

## Motivation

The Testing Scouting Assessment Stage 4 (Planning) asks for an explicit
pyramid plan before build. Scoutbook’s Testing checklist (RFC 0008) runs
**after** Implementation. Up-front obligations were missing as a structured
written record.

## Detailed design

### Data model (1:1)

`FeatureTestPlan`:

| Field | Notes |
|---|---|
| `status` | `NOT_STARTED` \| `IN_PROGRESS` \| `READY` \| `NOT_NEEDED` |
| `unitPlanned` | bool — unit tests required |
| `integrationPlanned` | bool — integration / API tests required |
| `e2ePlanned` | bool — browser / journey E2E required |
| `summary` | ≤500 — one sentence on scope / risk |
| `notes` | ≤500 optional |

### Validation

- `NOT_NEEDED` → all three layer flags false; summary optional  
- `READY` → at least one layer true; summary ≥ 5 chars  
- `IN_PROGRESS` / `NOT_STARTED` → no extra rules  

### Stage gate (`RACI` → `IMPLEMENTATION`)

| Process track | Required plan status |
|---|---|
| `LIGHT` | `NOT_NEEDED` or `READY` |
| `RFC` | `READY` |

Missing row → 400 with a clear message. RACI matrix readiness (existing)
still applies first.

### API

| Method | Path | Who |
|---|---|---|
| `GET` | `/features/:id/test-plan` | Auth — 404 if never saved |
| `PUT` | `/features/:id/test-plan` | Auth upsert |

### CASL

Subject `TestPlan` with `update` for all roles (same as other stage artifacts).

### Web

Panel on Feature detail (near RACI / Implementation). Short checkboxes +
status select.

### Out of scope

- New FEATURE_STAGE value  
- Auto-linking CI jobs or inventory rows  
- Changing Testing checklist fields  
- RACI letter ACL for the plan step (later if needed)  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Types + entity + API  
- [x] RACI→Implementation gate by process track  
- [x] Feature detail panel  
- [x] Unit tests + graphify  
