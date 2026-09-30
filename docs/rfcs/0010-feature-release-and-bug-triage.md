# RFC 0010 — Feature Release Log & Bug Triage

Status: Accepted  
Date: 2026-09  
Depends on: [0004-feature-stage-transitions](./0004-feature-stage-transitions.md),
[0009-feature-review-checklist](./0009-feature-review-checklist.md),
[feature lifecycle](../process/feature-lifecycle.md),
[bug triage](../process/bug-triage.md)

## Summary

Attach a short **release log** (0-or-1) and **bug triage rows** (0-N) to each
Feature for Stage 8. Capture what shipped and classify post-release issues as
regression vs scouting gap — without long essays.

## Motivation

Stage 8 is ship, watch, and classify bugs correctly. Without an in-app record,
teams guess fixes for undecided behavior. RELEASE is terminal (no further stage
gate); this task adds durable written capture after Review → Release.

## Detailed design

### Release log (0-or-1)

```
FeatureReleaseLog
  id                INT PK
  featureId         INT NOT NULL UNIQUE → Feature.id
  status            ENUM('NOT_STARTED','SHIPPED','OBSERVING','STABLE')
                    NOT NULL DEFAULT 'NOT_STARTED'
  summary           VARCHAR(500) NOT NULL DEFAULT ''
  watchStarted      BOOLEAN NOT NULL DEFAULT false
  notes             VARCHAR(500) NOT NULL DEFAULT ''
  updatedByUserId   INT NULL
  createdAt         DATETIME
  updatedAt         DATETIME
```

When `status` is `SHIPPED`, `OBSERVING`, or `STABLE`: `summary` ≥ 5 chars.  
When `status` is `OBSERVING` or `STABLE`: `watchStarted` must be `true`.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/features/:id/release-log` | Get log (`404` if none) |
| `PUT` | `/features/:id/release-log` | Upsert log |

Any authenticated role (v1).

### Bug triage rows (0-N)

```
FeatureBugTriage
  id                INT PK
  featureId         INT NOT NULL → Feature.id
  whatHappened      VARCHAR(300) NOT NULL
  expected          VARCHAR(300) NOT NULL
  reproduce         VARCHAR(500) NOT NULL DEFAULT ''
  bugType           ENUM('REGRESSION','SCOUTING_GAP','UNSURE') NOT NULL
  riskTier          ENUM('P1','P2','P3','UNKNOWN') NOT NULL DEFAULT 'UNKNOWN'
  status            ENUM('OPEN','RESOLVED','ESCALATED_TO_PO')
                    NOT NULL DEFAULT 'OPEN'
  createdByUserId   INT NULL
  createdAt         DATETIME
  updatedAt         DATETIME
```

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/features/:id/bugs` | List rows |
| `POST` | `/features/:id/bugs` | Add row |
| `PATCH` | `/features/:id/bugs/:bugId` | Update short fields / status |

No delete in v1 (keep history). Any authenticated role.

**Guidance (copy/help):** Scouting gap → escalate to PO; do not invent a fix.
Regression → failing test, then fix.

### Stage gate

None. `RELEASE` is the last stage. Records may be written anytime (including
before advance) so teams can draft early; gate stays on Review → Release only
(RFC 0009).

### Frontend

Feature detail: Release log panel + Bug triage list/form (short inputs, selects).

## Alternatives considered

- Free-form release notes only — rejected (no bug classify).  
- GitHub issues only — rejected for MVP (charter wants in-app written process;
  Docs Sync is a later task).  
- Force bugs only when stage is RELEASE — rejected (progressive capture).

## Acceptance criteria

- [x] GET / PUT release-log with uniform envelope  
- [x] GET / POST / PATCH bugs with uniform envelope  
- [x] Validation for SHIPPED+/STABLE rules  
- [x] Feature detail UI; unit + e2e; OpenAPI updated  
