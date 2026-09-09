# Scoutbook — Project Charter

Status: Accepted
Date: 2026-08

## Problem

Software teams lose critical context because decisions happen verbally —
in standups, Slack threads, hallway conversations — and are never
captured anywhere durable or structured. Six months later, nobody can
answer "why did we decide this?" without finding the one person who
remembers.

## Core Concept

A system where every PO/PM/Developer/QA decision is written, not spoken,
structured against a fixed 8-stage process (Idea → Scouting → RFC →
RACI → Implementation → Testing → Review → Release), and rendered two
ways:

1. **As readable documents** — synced into a target repo's `docs/`
   folder in a consistent format.
2. **As visuals** — a process flowchart, a dependency graph, a RACI
   matrix as an actual diagram, and a Kanban board (cards = features/
   bugs, columns = the 8 stages).

## Who it's for

Any small-to-mid software team using a PO/PM/Developer/QA structure —
stack-agnostic, since it manages process, not code.

## MVP Scope

| Included | Explicitly NOT in v1 |
|---|---|
| Structured entry forms: Idea, Scouting, RFC, RACI, Bug triage | Video/chat — this is a written-record tool |
| Kanban board (8 stages as columns) | Full PM replacement (no sprints/velocity) |
| GitHub Docs Sync (API key + repo URL → docs/ folder, via PR) | Direct-to-main pushes (PR only, human review stays in the loop) |
| RACI matrix rendered visually | Multi-org/enterprise permissions (v1 = one team) |
| Dependency graph view | AI auto-implementing code (see below) |

## GitHub Docs Sync

Given a repo URL + API token, Scoutbook pushes generated docs into that
repo's `docs/` folder, following the same convention already proven in
`ticket-manager` (`docs/rfcs/NNNN-*.md`, `docs/features/<name>/scouting.md`).
Pushed as a PR by default, not a direct commit — keeps a human in the
Review stage (Stage 7) even in the automated flow.

**Security requirement:** never store the raw token at rest unencrypted;
prefer short-lived GitHub App installation tokens over long-lived PATs
where possible.

## Long-term goal: AI-assisted implementation

Out of scope for v1 as a deliverable. What v1 DOES build toward it: every
record (RFC, Scouting, RACI) is structured with consistent, parseable
fields — not free-text — so a future AI coding agent has an unambiguous,
complete spec to work from.

**v1 success criterion:** the docs Scoutbook produces are complete and
unambiguous enough that a competent developer (human or AI agent) could
implement the feature with zero follow-up questions.

## Stack

React (Vite) + NestJS + MySQL + Turborepo — same as `ticket-manager`,
reusing proven patterns for auth, testing, and targeted CI.
