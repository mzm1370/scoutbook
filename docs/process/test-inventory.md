# Risk-based test inventory

Status: Accepted  
Date: 2026-10  
RFC: [0018-risk-based-test-inventory](../rfcs/0018-risk-based-test-inventory.md)  
Scouting: [risk-based-test-inventory](../features/risk-based-test-inventory/scouting.md)

Living table for **targeted CI** (Targeted Automated Testing Part 4.4 / Step 1).
**In-app source of truth:** `/inventory` (RFC 0027). This markdown remains a
human-readable snapshot of the v1 defaults. **PO** must approve any P1
add/remove.

**Ownership:** path owners live in [`.github/CODEOWNERS`](../../.github/CODEOWNERS)
(RFC 0020) — who to ping when a P1 area fails.

## Tier legend

| Tier | Meaning | CI intent (when Tasks 5–6 land) |
|---|---|---|
| **P1** | Business-critical or cross-cutting; false negative is costly | Always-run safety job + included in nightly full suite |
| **P2** | Important; graph-driven is enough for most PRs | Run when package or dependent is affected |
| **P3** | Localized / low blast radius | Run when that area alone is affected |

**Rule:** do not mark an area P1 always-run while its behavior is still
`Decision Required` or `Investigating` in scouting.

## Inventory (Scoutbook v1)

| Area | Package / path | Tier | Always-run? | Why |
|---|---|---|---|---|
| Shared contracts | `packages/types` | **P1** | Yes | Both apps import; type changes invalidate wide surface |
| HTTP envelope / errors | `apps/api/src/common` | **P1** | Yes | Every API response shape depends on this |
| Auth (register/login/JWT) | `apps/api/src/auth`, web auth pages | **P1** | Yes | Wrong auth = whole product unusable |
| Feature stage gates | `apps/api/src/features/features.service` (advance + asserts) | **P1** | Yes | Incorrect advance breaks the 8-stage process |
| Scouting + Decisions Needed | `apps/api/src/features/scouting*`, decisions-needed | **P1** | Yes | Blocks “Ready before test” rule |
| RFC check + document | `feature-rfc-check*`, `feature-rfc-document*` | **P2** | No | Critical when used; not every PR touches RFC |
| RACI matrix | `feature-raci*` | **P2** | No | Gate to Implementation; graph-targeted is enough |
| Implementation / Testing / Review checklists | matching `feature-*-log` / checklist services | **P2** | No | Stage-specific; run when those modules change |
| Release log + bug triage | `feature-release*`, `feature-bug-triage*` | **P2** | No | Post-ship path; targeted on change |
| Feature relations / dependency graph API | `feature-relation*` | **P2** | No | Supports targeting visuals; not auth-critical |
| GitHub Docs Sync | `apps/api/src/docs-sync` | **P2** | No | PO settings path; encrypt/token paths need coverage when touched |
| Shared UI kit | `packages/ui` | **P2** | No | Broad UI impact; run when `ui` or dependents change |
| Web shell (layout, sidebar, board) | `apps/web/src` (layout, board, pages) | **P2** | No | Vitest/RTL/MSW (RFC 0032); Playwright journey opt-in (RFC 0033) |
| Lifecycle / process visuals | `LifecyclePage`, RACI diagram | **P3** | No | Presentation-only; low false-negative risk |
| OpenAPI export scripts | `apps/api` openapi scripts | **P3** | No | Docs tooling; run when export code changes |
| Graphify / agent docs | `graphify-out/`, `AGENTS.md` | **P3** | No | Not product runtime |

## How to use (with GHA — RFC 0034)

1. PRs run **unit** CI: `pnpm test` + `pnpm build` (no MySQL / Playwright yet).  
2. Before claiming “tests enough for this PR,” check whether you touched a **P1** path above.  
3. If yes: run that area’s suite even if you believe the change is tiny  
   (`pnpm test` or `pnpm turbo run test --filter=@scoutbook/api` — RFC 0021).  
4. If only **P2/P3**: targeted package tests are enough once affected CI lands  
   (Task 14 — `pnpm turbo run test --filter=...[origin/main]`).  
5. Nightly / weekly **full** suite remains the safety net (Task 16) — never remove it when targeting ships.

## Mapping to existing unit tests (today)

| Inventory area | Spec files (examples) |
|---|---|
| Auth / envelope | `api-response.spec.ts`, `all-exceptions.filter.spec.ts` |
| Stage gates | `feature-stage.spec.ts`, `features.service.spec.ts` |
| Scouting | `scouting.service.spec.ts` |
| RFC / RACI / logs / checklists / bugs | matching `feature-*.service.spec.ts` |
| Docs sync | `docs-sync.service.spec.ts`, `token-crypto.spec.ts`, `generate-docs.spec.ts` |

Web Vitest coverage is **not** inventory-complete yet (Task 4).
Playwright critical journey is opt-in via `pnpm --filter @scoutbook/web test:e2e`
(RFC 0033) — not always-run.

## Change log

| Date | Change |
|---|---|
| 2026-10 | Initial inventory (RFC 0018) |
| 2026-10 | Web Playwright journey note (RFC 0033) |
| 2026-10 | GitHub Actions unit CI (RFC 0034) |
