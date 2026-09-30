# RFC 0014 — Feature Dependency Graph

Status: Accepted  
Date: 2026-09  
Depends on: [0002-feature-record](./0002-feature-record.md),
[0000-charter](./0000-charter.md)

## Summary

PO/PM can declare **BLOCKS** links between Features. A **Dependency graph**
view renders Features as nodes and BLOCKS as directed edges so the team
sees blockers without reading every RFC.

## Motivation

Charter MVP includes a dependency graph. List and Kanban show stage, not
cross-feature blocking. Epic 6 backlog: decide simple vs rich model first —
v1 chooses simple directed BLOCKS.

## Detailed design

### Data model

```
FeatureRelation
  id                 INT PK
  fromFeatureId      INT NOT NULL INDEX  # blocker
  toFeatureId        INT NOT NULL INDEX  # blocked
  type               ENUM('BLOCKS') NOT NULL DEFAULT 'BLOCKS'
  createdByUserId    INT NOT NULL
  createdAt          DATETIME
```

Semantics: **fromFeature blocks toFeature** (to cannot usefully finish
ahead of from, in the team's judgment). Unique `(fromFeatureId, toFeatureId)`.

### Rules

- Both Feature ids must exist; `from ≠ to`.
- Duplicate pair → `400`.
- Cycles allowed (display only; no stage gate).
- No updates in v1 — delete + recreate.

### API (JWT)

| Method | Path | Who | Purpose |
|---|---|---|---|
| `GET` | `/feature-relations` | any auth | List all relations |
| `POST` | `/feature-relations` | PO / PM | Create `{ fromFeatureId, toFeatureId, type? }` |
| `DELETE` | `/feature-relations/:id` | PO / PM | Remove link |

`GET /features` remains the node source for the graph (no aggregate endpoint).

### Frontend

- Route: `/graph`
- Sidebar: **Graph**
- `@xyflow/react`: Feature nodes (title, stage, risk) → `/features/:id`
- Edges: BLOCKS arrows; PO/PM form to add (from / to selects); delete on edge
- Responsive: full-width canvas under header; pan/zoom; mobile-usable

### Out of scope

- RELATED / DEPENDS_ON types  
- Auto-layout from stage pipeline  
- Blocking stage advance via relations  
- GitHub Docs Sync (Epic 7)

## Alternatives considered

- Rich multi-type graph — deferred (scouting: keep v1 scannable).  
- Reject cycles — deferred (PO may model mutual awareness; show edges).  
- Nested `/features/:id/relations` only — rejected (graph needs full edge list).

## Acceptance criteria

- [x] Scouting answers relationship model (BLOCKS)  
- [x] CRUD-lite API + unique/self checks  
- [x] `/graph` React Flow UI + nav; PO/PM add/remove  
- [x] Unit + e2e; OpenAPI updated  
