# Bug triage

Status: Accepted  
Date: 2026-09  
Depends on: [Feature lifecycle](./feature-lifecycle.md)

Short guide when something breaks. Goal: fix the right class of problem —
do not invent missing product decisions in code.

## First question

Is this broken **known/agreed** behavior, or was the expected behavior
**never decided**?

| Type | Meaning | What to do |
|---|---|---|
| **Regression** | Previously correct, agreed behavior broke | Write a failing test that reproduces it → fix → confirm green |
| **Scouting gap** | Expected behavior was never confirmed by PO | **Stop.** Do not guess. Open/update a scouting row (`Decision Required`) and escalate to PO |

## Why the split matters

Guessing a fix for a scouting gap is how the same undefined behavior gets
“fixed” three incompatible ways by three people. That is the failure mode
Scoutbook exists to prevent.

## Minimal capture (when filing a bug)

Keep it short:

1. **What happened** (one sentence)  
2. **What you expected** (one sentence) — or “not decided”  
3. **How to reproduce** (few steps)  
4. **Type** — Regression | Scouting gap (your best guess; PO/PM may reclassify)  
5. **Risk** — P1 / P2 / P3 if known  

Use `.github/ISSUE_TEMPLATE/bug_report.yml` when filing on GitHub.

## After PO decides (scouting gap)

1. Update the scouting table row → `Ready` with the decision.  
2. Add/adjust acceptance criteria.  
3. Then implement + test like a normal change (lifecycle stages 5–7).

## Regression checklist

- [ ] Failing test exists (or justified manual repro if UI-only and tracked)  
- [ ] Fix does not introduce a new undecided behavior  
- [ ] Related scouting rows still `Ready`  
- [ ] Targeted tests for affected packages pass  
