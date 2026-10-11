# RFC 0018 — Risk-Based Test Inventory

Status: Accepted  
Date: 2026-10  
Depends on: [0000-charter](./0000-charter.md),
[0002-feature-record](./0002-feature-record.md),
[feature-lifecycle](../process/feature-lifecycle.md)

## Summary

Add a living **risk-based test inventory** for Scoutbook: which packages and
domains are P1 (always run in CI safety nets), P2 (prefer targeted runs), or
P3 (area-only). This is Part 4.4 / Step 1 of the Targeted Automated Testing
roadmap — a prerequisite before wiring Turborepo `--filter` CI.

## Motivation

A dependency graph answers “what did this change touch?” It does **not** answer
“what must never be skipped even when the graph is quiet?” Without a written
P1 list, teams either run the full suite forever or skip critical auth/stage
gates by accident. Doing nothing leaves later Tasks 3–6 (turbo test / CI)
without an agreed always-run policy.

## Detailed design

### Artifact

Single file: [`docs/process/test-inventory.md`](../process/test-inventory.md).

| Column | Meaning |
|---|---|
| Area | Package or domain (e.g. `@scoutbook/api` auth, stage gates) |
| Package path | Repo path for filters later |
| Tier | `P1` \| `P2` \| `P3` |
| Why | One short sentence |
| Always-run? | Yes only for P1 (nightly / PR safety job when CI exists) |
| Owner note | Who to ping (until CODEOWNERS — Task 2) |

### Tier rules

| Tier | CI policy (when targeting exists) |
|---|---|
| **P1** | Always included in PR safety job and/or nightly full run for that area |
| **P2** | Run when package (or dependent) is affected by graph |
| **P3** | Run when that area alone is affected; optional locally |

### Product Feature `riskTier` vs inventory

- Feature `riskTier` (P1/P2/P3 on a Feature record) = **business** priority for delivery.  
- Inventory tier = **test/CI** priority for a code area.  
They should usually align for critical domains (auth, stage advancement), but
they are not the same field.

### Update process

1. Dev/QA open a PR editing `test-inventory.md`.  
2. PM reviews; PO must approve any **P1 add/remove**.  
3. Areas still `Decision Required` / Investigating in scouting must not be
   listed as P1 always-run.

### Out of scope (this RFC)

- CODEOWNERS file (Task 2)  
- `turbo.json` `test` task / GitHub Actions (Tasks 3–6)  
- Flaky quarantine / telemetry dashboards (Tasks 9–10)  
- In-app Scoutbook UI for the inventory  

## Alternatives considered

- Encode always-run only in CI YAML — rejected: invisible to PO/PM; hard to review.  
- Use Feature Kanban risk alone — rejected: Features ≠ packages; many Features share one package.  
- Auto-derive from Feature stages — rejected: too noisy; CI needs stable package areas.

## Drawbacks

- Table can go stale; needs PR discipline.  
- Early inventory is imperfect — that is OK (Step 1 says “even if imperfect”).

## Effect on dependency graph and tests

No package boundary change. Later CI tasks will **read** this inventory when
defining always-run jobs alongside `turbo run test --filter=...[origin/main]`.

## Unresolved questions

None for Accept. Exact CI job shapes deferred to Tasks 5–6.

## Acceptance criteria

- [x] Scouting under `docs/features/risk-based-test-inventory/`  
- [x] This RFC Accepted  
- [x] `docs/process/test-inventory.md` with initial P1/P2/P3 rows for Scoutbook  
- [x] Linked from `docs/process/general-policy.md`  
