# Scoutbook — Agent Policy

Scoutbook captures PO/PM/Developer/QA decisions as structured written records
across an 8-stage process (Idea → Scouting → RFC → RACI → Implementation →
Testing → Review → Release), then syncs docs into a target repo and renders
process visuals.

**Canonical human policy:** [docs/process/general-policy.md](docs/process/general-policy.md)  
**Charter:** [docs/rfcs/0000-charter.md](docs/rfcs/0000-charter.md)

## Stack

| Layer | Tech |
|---|---|
| Monorepo | pnpm + Turborepo |
| API | NestJS 12 (ESM / `nodenext`), TypeORM, MySQL |
| Web | React 19 + Vite + React Router |
| UI | `@scoutbook/ui` (shadcn/ui radix-nova + Tailwind v4) |
| Types | `@scoutbook/types` |

## Commands

| Command | Purpose |
|---|---|
| `pnpm install` | Install workspace deps |
| `docker compose up -d` | MySQL on `localhost:3307` |
| `pnpm --filter @scoutbook/api start:dev` | API on `:3000` |
| `pnpm --filter @scoutbook/web dev` | Web on `:5173` (proxies `/api` → API) |
| `pnpm --filter @scoutbook/web build` | Typecheck + Vite production build |
| `pnpm --filter @scoutbook/api build` | Nest build |
| `pnpm --filter @scoutbook/api openapi:export` | Write OpenAPI YAML to `docs/api/` + `apps/api/openapi/` |
| `pnpm --filter @scoutbook/api test` | Unit tests |
| `pnpm --filter @scoutbook/api test:e2e` | E2E tests (needs MySQL) |
| `pnpm lint` / `pnpm build` | Turbo lint / build all |

Swagger UI (local): `http://localhost:3000/docs`

## Feature records (Epic 1)

- `POST /features` — **PO only**
- `GET /features`, `GET /features/:id` — any authenticated role
- Web routes: `/features`, `/features/new`, `/features/:id`
- RFC: `docs/rfcs/0002-feature-record.md`

## Architecture

```
apps/api/          NestJS — AuthModule, UsersModule, JWT global guard
apps/web/          React — auth pages, shadcn forms, AuthProvider
packages/ui/       Shared shadcn components + globals.css
packages/types/    Shared TS contracts (AuthUser, LoginResponse, roles, stages)
docs/rfcs/         Accepted RFCs (NNNN-*.md)
docs/features/     Per-feature scouting / process docs
docs/process/      Team & agent operating policy
```

## Process policy (must follow)

1. **Docs before code for new features.** Write/update scouting + RFC under
   `docs/` before implementing. Keep fields structured (not free-form blobs).
2. **Charter bounds.** Respect MVP in / out of scope in RFC 0000. Do not add
   OAuth, multi-org, refresh tokens, video/chat, or direct-to-main GitHub sync
   without a new RFC.
3. **Auth contract.** Follow [docs/rfcs/0001-authentication.md](docs/rfcs/0001-authentication.md).
   Never return `passwordHash`. Login failures use `"Invalid credentials"`.
4. **Secrets.** Never commit `.env`, tokens, or API keys. Ship `.env.example`
   only. Prefer short-lived GitHub App tokens for docs sync (later).
5. **Shared types first.** Public API shapes live in `@scoutbook/types`; apps
   import them — do not duplicate interfaces.
6. **UI consistency.** New web UI uses `@scoutbook/ui` + Tailwind tokens.
   Prefer react-hook-form + Zod for forms.
7. **API style.** Nest ESM: relative imports use `.js` extensions. Validate with
   `class-validator` DTOs + global `ValidationPipe`. Protect routes with JWT;
   mark public routes `@Public()`.
8. **Small diffs.** Change only what the task needs. No drive-by refactors.
9. **Commits.** Only when the user asks. Prefer conventional, why-focused messages.

## Roles (v1)

`PO | PM | DEVELOPER | QA` — identity + role on the user/JWT. Fine-grained
RACI ACL is a later RFC.

## Environment (API)

`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`, `PORT`
— see `apps/api/.env.example`.

## Testing expectations

- Prefer unit tests for auth/services and smoke curls for HTTP contracts.
- Do not weaken security checks to make tests pass.

## graphify

This project has a knowledge graph at `graphify-out/` with god nodes, community
structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions
before doing anything else.

Rules:
- Before broad codebase exploration, prefer `graphify query "<question>"` when
  `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for
  relationships and `graphify explain "<concept>"` for focused concepts.
- If `graphify-out/wiki/index.md` exists, use it for navigation.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review when
  query/path/explain are not enough.
- After modifying code, run `graphify update .` to keep the graph current
  (AST-only, no API cost).
