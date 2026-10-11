# RFC 0020 — CODEOWNERS Ownership Mapping

Status: Accepted  
Date: 2026-10  
Depends on: [0000-charter](./0000-charter.md),
[0018-risk-based-test-inventory](./0018-risk-based-test-inventory.md)

## Summary

Add `.github/CODEOWNERS` so every major path has a documented owner
(Targeted Automated Testing Part 4.3 / Part 8 Step 1). Complements the
risk-based test inventory (RFC 0018).

## Motivation

Without CODEOWNERS, failing CI or a targeted test miss has no clear
“who to ping.” Step 1 of the targeting roadmap requires an ownership map
even if imperfect.

## Detailed design

### File

[`.github/CODEOWNERS`](../../.github/CODEOWNERS)

### Mapping (v1)

| Path | Owner (GitHub) | Logical role |
|---|---|---|
| `*` (default) | `@mzm1370` | Maintainers |
| `apps/api/` | `@mzm1370` | Backend / Developer |
| `apps/web/` | `@mzm1370` | Frontend / Developer |
| `packages/types/` | `@mzm1370` | Shared (PO + Dev care) |
| `packages/ui/` | `@mzm1370` | Frontend |
| `docs/` | `@mzm1370` | PO / PM process |
| `.github/` | `@mzm1370` | Maintainers |

Personal repo: one username until org teams (`@org/backend`, etc.) exist.
Comments in the file note the intended team split.

### Update process

Change owners via PR. Prefer updating this RFC’s table when teams are added.

## Out of scope

- Required reviews / branch protection (repo settings)  
- CODEOWNERS UI inside Scoutbook  
- Fine-grained per-file owners beyond package roots  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] `.github/CODEOWNERS` present  
- [x] Linked from test inventory / general policy  
