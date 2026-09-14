# Scoutbook — General Process & Agent Policy

Status: Accepted  
Date: 2026-09  
Depends on: [RFC 0000 — Charter](../rfcs/0000-charter.md)

## Purpose

One place for **how we build Scoutbook**: product process for humans, and
operating rules for AI coding agents (`AGENTS.md` / `CLAUDE.md`).

## Product process (8 stages)

Every feature moves through fixed columns — do not invent alternate workflows
in v1:

1. Idea  
2. Scouting  
3. RFC  
4. RACI  
5. Implementation  
6. Testing  
7. Review  
8. Release  

### Docs layout

| Path | Content |
|---|---|
| `docs/rfcs/NNNN-*.md` | Accepted RFCs (decisions + contracts) |
| `docs/features/<name>/scouting.md` | Scouting Q&A for a feature |
| `docs/process/` | Operating policy (this file) |

**Rule:** for a new feature, scouting + RFC land before implementation code.
v1 success criterion from the charter: a competent developer (human or agent)
can implement from the docs with **zero follow-up questions**.

## Agent operating policy

Agents working in this repo must:

1. Read the charter and the relevant RFC before coding.
2. Prefer updating docs when requirements change — code follows docs.
3. Reuse `@scoutbook/types` and `@scoutbook/ui`; do not fork parallel types/UI.
4. Never commit secrets (`.env`, tokens, API keys).
5. Stay inside MVP scope unless a new RFC expands it.
6. Keep changes minimal and task-scoped.
7. Use graphify (`graphify-out/`) for architecture questions when the graph exists;
   refresh with `graphify update .` after structural code changes.

## Security policy (v1)

- Passwords: bcrypt only; never store or return plaintext / `passwordHash`.
- Auth: JWT bearer, 1h expiry; public routes explicitly `@Public()`.
- GitHub docs sync (future): encrypt tokens at rest; prefer GitHub App
  installation tokens; push via **PR only**, never direct-to-main.
- Login errors must not enumerate accounts.

## Quality bar

- Typecheck/build must pass for touched packages (`pnpm --filter … build`).
- API validation via DTOs; web forms via Zod + react-hook-form where practical.
- Match existing Nest ESM (`.js` import suffixes) and shadcn patterns.

## Out of policy until RFC'd

Multi-org, OAuth/SSO, refresh tokens, MFA, password reset, AI auto-coding as a
product feature, video/chat, sprint/velocity PM tooling.

## Related agent files

| File | Audience |
|---|---|
| [AGENTS.md](../../AGENTS.md) | All AI agents (Cursor, Codex, Aider, …) |
| [CLAUDE.md](../../CLAUDE.md) | Claude Code (`@AGENTS.md` import) |
| [.cursor/rules/graphify.mdc](../../.cursor/rules/graphify.mdc) | Cursor graphify nudge |
| `graphify-out/GRAPH_REPORT.md` | Generated architecture highlights |
