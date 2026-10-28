# RFC 0030 — Feature Test Health (Release Observe)

Status: Accepted  
Date: 2026-10  
Depends on: [0010-feature-release-and-bug-triage](./0010-feature-release-and-bug-triage.md)

## Summary

Add a short **test health** record per Feature so QA/Tech Lead capture CI
failure rate, flaky signals, and duration after ship — without a ninth stage
and without live CI telemetry yet.

## Motivation

Assessment Stage 8 asks teams to watch test health after release. The release
log (RFC 0010) tracks ship/observe/stable narrative; it does not structure
failure rate / flaky / duration. Full CI dashboards and quarantine bots are
later eng tasks; Scoutbook still needs a durable written observe record.

## Detailed design

### Data model (1:1)

`FeatureTestHealth`:

| Field | Notes |
|---|---|
| `status` | `NOT_STARTED` \| `WATCHING` \| `HEALTHY` \| `AT_RISK` \| `NOT_NEEDED` |
| `failureRateChecked` | bool — CI failure rate reviewed |
| `flakyChecked` | bool — flaky suite reviewed |
| `durationChecked` | bool — suite duration / budget reviewed |
| `failureRatePct` | optional int 0–100 |
| `flakyCount` | optional int ≥ 0 |
| `durationMinutes` | optional int ≥ 0 — approximate suite duration |
| `summary` | ≤500 |
| `notes` | ≤500 optional |

### Validation

- `NOT_NEEDED` → all three checks false; metrics omitted/null  
- `HEALTHY` → all three checks true; summary ≥ 5  
- `AT_RISK` → summary ≥ 5 (checks/metrics optional but encouraged)  
- `WATCHING` / `NOT_STARTED` → no extra rules  

### Stage gate

None. `RELEASE` is terminal. Record may be written anytime (progressive capture).

### API

| Method | Path | Who |
|---|---|---|
| `GET` | `/features/:id/test-health` | Auth — 404 if never saved |
| `PUT` | `/features/:id/test-health` | Auth upsert |

### CASL

Subject `TestHealth` with `update` for all roles (stage artifacts).

### Web

Panel on Feature detail near Release log / bugs. Short checkboxes, optional
numbers, status select.

### Out of scope

- Live GitHub Actions / Observe dashboards  
- Flaky quarantine automation — [RFC 0038](./0038-flaky-quarantine.md) (repo process; not live CI bots)  
- Changing release-log statuses  
- New FEATURE_STAGE  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Types + entity + API  
- [x] Feature detail panel  
- [x] Unit tests + graphify  
