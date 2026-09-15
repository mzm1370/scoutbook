# RFC 0002 — Feature Record Core

Status: Accepted  
Date: 2026-09  
Depends on: [0000-charter](./0000-charter.md), [0001-authentication](./0001-authentication.md)

## Problem

Without a durable Feature object, ideas stay verbal. Scoutbook needs one
central record that later Scouting, RFC, RACI, and Kanban all attach to.

## Decision

Introduce a `Feature` entity and JWT-protected REST API. New features
start at stage `IDEA`. Only `PO` may create; any authenticated user may
list and view.

## Goals

| In scope | Out of scope (this RFC) |
|---|---|
| Create / list / get Feature | Stage transitions (Epic 5) |
| Fields: title, problem, riskTier, currentStage | Scouting / RFC / RACI children |
| `createdByUserId` | Soft delete, search, pagination beyond simple list |
| Web list, detail shell, create form | Kanban / dependency graph |

## Data model

```
Feature
  id               INT PK AUTO_INCREMENT
  title            VARCHAR(200) NOT NULL
  problem          TEXT NOT NULL
  riskTier         ENUM('P1','P2','P3') NOT NULL
  currentStage     ENUM(...FEATURE_STAGES...) NOT NULL DEFAULT 'IDEA'
  createdByUserId  INT NOT NULL  → User.id
  createdAt        DATETIME
  updatedAt        DATETIME
```

## API contract

All routes require `Authorization: Bearer <accessToken>` (no `@Public()`).

### `POST /features` — role: `PO`

Request:

```json
{
  "title": "GitHub Docs Sync",
  "problem": "Decisions never land in the target repo docs/ folder.",
  "riskTier": "P2"
}
```

Success `201` — Feature object (`currentStage` = `IDEA`).

Errors: `400` validation, `401` missing/invalid token, `403` non-PO.

### `GET /features`

Success `200` — `Feature[]` ordered by `updatedAt` DESC.

### `GET /features/:id`

Success `200` — Feature.  
Errors: `404` if missing.

## Response shape

Matches `@scoutbook/types` `Feature` (dates as ISO strings in JSON).

## Frontend

| Route | Page |
|---|---|
| `/features` | List (cards/table) |
| `/features/new` | Create form (PO; others redirected or disabled) |
| `/features/:id` | Detail shell with placeholders for Scouting/RFC/RACI |

## Acceptance criteria

1. Unauthenticated `POST/GET /features` → `401`.
2. `DEVELOPER`/`PM`/`QA` `POST /features` → `403`.
3. `PO` create → `201` with `currentStage: "IDEA"`.
4. List returns created features; get-by-id works; unknown id → `404`.
5. Web: authenticated user sees list; PO can create; detail page loads.
