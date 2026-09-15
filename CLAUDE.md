@AGENTS.md

# Scoutbook (Claude Code)

Shared agent policy is imported from `AGENTS.md` above.
Human-facing process policy: `docs/process/general-policy.md`.

## Claude-specific

- Prefer `.claude/skills/graphify/SKILL.md` when the user runs `/graphify`.
- PreToolUse hooks in `.claude/settings.json` nudge toward the knowledge graph.
- Keep durable rules in `AGENTS.md` / `docs/process/` — not duplicated here.
- When building UI or forms, obey **Product UX rules** in `AGENTS.md`:
  full responsive, short/flexible capture for PO/PM/DEVELOPER/QA, easy auth,
  smooth Idea→Release lifecycle (dev satisfied, business not set back).

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
