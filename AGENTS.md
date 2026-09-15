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

## Web layout

After login, authenticated routes use `DashboardLayout`: collapsible sidebar
(menu), sticky header (user menu), and page body via `<Outlet />`.
Public routes (`/login`, `/register`) stay full-screen without the shell.

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

## Product UX rules (must follow)

Audience: **PO, PM, DEVELOPER, QA**. They run a real delivery lifecycle; they
do **not** enjoy long writing. Scoutbook must feel light to use and solid for
process.

### 1. Fully responsive (best practices)

- Every authenticated and public screen must work on **phone, tablet, and desktop**.
- Prefer mobile-first Tailwind (`sm:` / `md:` / `lg:`); no horizontal scroll traps.
- Touch targets ≥ 44px where practical; sidebar collapses to sheet/icon on small screens.
- Tables: essential columns first; hide secondary columns on narrow viewports or use cards.
- Forms: single-column on mobile; full width inputs; sticky primary actions when helpful.
- Test mental model: usable one-handed on a phone without zooming.

### 2. Short input, flexible capture (Idea → Implementation)

- Optimize for **short, structured fields** — not essays. Labels, placeholders, and
  helpers that ask for one clear sentence beat blank textareas.
- Accept progressive completeness: allow saving early stages with **minimum viable
  fields**; richer detail can come later (Scouting / RFC / RACI).
- Prefer selects, badges, status chips, and templates over free-form walls of text.
- Validation: firm on shape (email, enum, min length for safety) but **forgiving**
  on verbosity — do not force long narratives to proceed.
- From Idea through Implementation, friction must stay low so busy roles actually use it.

### 3. Easy login, enjoyable system

- Auth paths stay obvious: register → login → land on dashboard in few steps.
- Clear errors via toast + inline field errors; never opaque failures.
- Fast perceived performance: loading states, empty states with one next action.
- Navigation predictable (sidebar + header); user always knows where they are.
- Delight = clarity and speed, not decoration. Avoid clutter, modal stacks, and busy chrome.

### 4. Smooth professional lifecycle (dev happy, business safe)

- Preserve the 8-stage pipeline so **business** keeps visibility and control
  (written decisions, stage, risk, RACI) without process setbacks.
- Preserve **developer** satisfaction: unambiguous specs, low ceremony UI, no
  busywork forms, clear “what’s blocking me / what’s next”.
- Stage moves and records should feel like a calm workflow tool — not a PM
  bureaucracy tax and not a free-for-all that loses auditability.
- When UX and ceremony conflict: **shortest path that still leaves a durable,
  structured record** wins.

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
