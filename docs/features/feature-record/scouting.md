# Feature Record — Scouting

Feature: Feature Record Core  
RFC: [0002-feature-record](../../rfcs/0002-feature-record.md)  
Status: READY

## Questions resolved

| Question | Decision |
|---|---|
| Who can create a Feature? | `PO` only (`POST /features`) |
| Who can list / open detail? | Any authenticated role |
| Initial stage on create? | Always `IDEA` |
| Risk tiers? | `P1` \| `P2` \| `P3` (from shared types) |
| How much writing required? | Short: title ≥2 chars, problem 5–500 chars; deepen later |
| Schema migrations in v1? | TypeORM `synchronize: true` (dev); entity is source of truth until Epic 7 stability |
| Soft delete? | No — hard records only for now |
| Creator tracking? | Store `createdByUserId` (FK to User) |

## Current state

Auth works. No Feature entity or UI yet. Shared `Feature` / `RiskTier` /
`FeatureStage` types already exist in `@scoutbook/types`.

## Expected after implementation

CRUD-lite API (`POST`, list, get-by-id), web list + detail + create form,
Swagger updated, tests covering auth + PO-only create.
