# RFC 0024 — Scouting Checklist Template

Status: Accepted  
Date: 2026-10  
Depends on: [0003-scouting-entries](./0003-scouting-entries.md),
[0023-ambiguity-tracking](./0023-ambiguity-tracking.md)

## Summary

Ship a fixed **scouting checklist template** (from the Testing Scouting
Assessment doc) and a seed action that inserts any missing template questions
as Scouting rows — without overwriting existing answers.

## Motivation

Teams skip the assessment checklist prompts and invent free-form questions.
A shared template makes Scouting fast and comparable across Features, and
feeds Ambiguity Tracking (RFC 0023) consistently.

## Detailed design

### Shared constant (`@scoutbook/types`)

`DEFAULT_SCOUTING_CHECKLIST_QUESTIONS: string[]` — eight prompts:

1. What does it do today?  
2. What should it do?  
3. Who uses it?  
4. What breaks if it fails?  
5. Is it business critical?  
6. Which test type is required? (Unit / Integration / E2E)  
7. Is it shared across pages?  
8. Does it affect API requests?  

### API

`POST /features/:featureId/scouting/seed` — JWT, any authenticated.

Behavior:

1. Load existing scouting rows for the Feature.  
2. For each template question not already present (exact `question` string
   match after trim), insert a row:
   - `currentState`: `Unknown`  
   - `expected`: `To be decided`  
   - `decision`: `''`  
   - `status`: `INVESTIGATING`  
3. Never update existing rows.  
4. Response: `{ seeded: boolean, added: number, rows: ScoutingEntry[] }`  
   (`seeded` true iff `added > 0`).

Missing Feature → `404`.

### Frontend

Feature scouting panel: **Seed checklist** button (min touch target).
Toast shows how many prompts were added. Reload list after seed.
Disable or show helper when all template questions already exist.

### Out of scope

- Editing the global template in-app  
- Auto-seed on Feature create  
- Force-replace existing rows  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Types constant + seed endpoint  
- [x] Seed adds missing only; unit + e2e  
- [x] Scouting panel Seed checklist button  
