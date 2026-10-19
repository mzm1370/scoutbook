# RFC 0027 — In-app Test Inventory UI

Status: Accepted  
Date: 2026-10  
Depends on: [0018-risk-based-test-inventory](./0018-risk-based-test-inventory.md),
[0019-casl-permissions](./0019-casl-permissions.md),
[0025-designer-tech-lead-roles](./0025-designer-tech-lead-roles.md)

## Summary

Expose the risk-based **test inventory** as an in-app table (CRUD + seed)
so PO/PM/QA can maintain P1/P2/P3 CI priorities without editing markdown only.
Completes the UI deferred in RFC 0018.

## Motivation

RFC 0018 put the inventory in `docs/process/test-inventory.md`. That is
reviewable in PRs but invisible in the product. The assessment Phase 1 table
expects a living inventory the team can filter and update during scouting.

## Detailed design

### Data model

`TestInventoryItem`:

| Field | Notes |
|---|---|
| `area` | Short name (2–120) |
| `packagePath` | Repo path / package hint (2–200) |
| `tier` | `P1` \| `P2` \| `P3` |
| `alwaysRun` | boolean; must be `true` iff `tier === P1` |
| `why` | One short sentence (≤300) |
| `sortOrder` | int |

### CASL

- Subject `TestInventory`
- `read` — all (via `read` all)
- `manage` — PO / PM / TECH_LEAD

### P1 accountability (service)

Beyond CASL, **PO only** may:

- Create a row with `tier === P1`
- Change tier **to or from** P1
- Delete a row that is currently P1

### API

| Method | Path | Notes |
|---|---|---|
| `GET` | `/test-inventory` | Optional `?tier=P1` |
| `POST` | `/test-inventory/seed` | Seed defaults if empty |
| `POST` | `/test-inventory` | Create |
| `PATCH` | `/test-inventory/:id` | Update |
| `DELETE` | `/test-inventory/:id` | Delete |

### Defaults

`DEFAULT_TEST_INVENTORY_ROWS` in `@scoutbook/types` mirrors the v1 markdown
table from RFC 0018.

### Web

- Route `/inventory` (sidebar)
- Filter by tier; responsive table / cards
- Seed + add/edit for managers; P1 controls disabled for non-PO

### Out of scope

- Auto-writing CI YAML from inventory  
- Replacing markdown file on every edit (docs sync later)  
- Linking inventory rows to Features  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Types + entity + CASL `TestInventory`  
- [x] API list/seed/create/update/delete + P1 PO gate  
- [x] Web `/inventory` + nav  
- [x] Unit tests + graphify  
