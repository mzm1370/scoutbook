# RFC 0001 — Authentication

Status: Accepted  
Date: 2026-09  
Depends on: [0000-charter](./0000-charter.md)

## Problem

Scoutbook records PO/PM/Developer/QA decisions. Without authentication,
any caller can create or alter those records. v1 is a single team, so we
need identity + role on every write, not multi-org SSO.

## Decision

Email/password registration and login, JWT bearer tokens, and a fixed
role enum matching the charter roles: `PO | PM | DEVELOPER | QA`.

No OAuth, magic links, or refresh-token rotation in v1. Access tokens
expire in 1 hour; the client re-authenticates on expiry.

## Goals

| In scope | Out of scope (v1) |
|---|---|
| Register with email, password (≥8), role | OAuth / SSO / GitHub login |
| Login → JWT access token | Refresh tokens / sliding sessions |
| Global JWT guard; `@Public()` for auth routes | Multi-org / workspace membership |
| `GET /auth/me` for session restore | Email verification / password reset |
| Shared types in `@scoutbook/types` | Role-based endpoint ACL beyond identity |
| Never return `passwordHash` in responses | Account lockout / MFA |

## Roles

| Role | Meaning in Scoutbook |
|---|---|
| `PO` | Product Owner — idea intake, prioritization |
| `PM` | Product Manager — scouting, RFC coordination |
| `DEVELOPER` | Implements after RACI |
| `QA` | Testing / review stages |

Role is stored on the user and returned in the JWT payload and API
responses. Fine-grained RACI permissions are a later RFC; v1 only
attaches identity + role to requests.

## API contract

Base path: `/auth`  
Content-Type: `application/json`  
Auth header (protected routes): `Authorization: Bearer <accessToken>`

### `POST /auth/register` (public)

Request:

```json
{
  "email": "dev@team.example",
  "password": "at-least-8-chars",
  "role": "DEVELOPER"
}
```

Success `201`:

```json
{
  "id": 1,
  "email": "dev@team.example",
  "role": "DEVELOPER"
}
```

Errors:

| Status | When |
|---|---|
| `400` | Validation failed (email, password length, invalid role) |
| `409` | Email already registered |

Password is hashed with bcrypt (cost 10) before insert. Response must
never include `passwordHash`.

### `POST /auth/login` (public)

Request:

```json
{
  "email": "dev@team.example",
  "password": "at-least-8-chars"
}
```

Success `200`:

```json
{
  "accessToken": "<jwt>",
  "user": {
    "id": 1,
    "email": "dev@team.example",
    "role": "DEVELOPER"
  }
}
```

Errors:

| Status | When |
|---|---|
| `400` | Validation failed |
| `401` | Unknown email or wrong password (same message: "Invalid credentials") |

### `GET /auth/me` (protected)

Success `200`: same shape as `user` in the login response.

Errors: `401` if missing/invalid/expired token.

## JWT payload

```json
{
  "sub": 1,
  "email": "dev@team.example",
  "role": "DEVELOPER",
  "iat": 0,
  "exp": 0
}
```

- Algorithm: HS256  
- Secret: `JWT_SECRET` env var (required)  
- Expiry: `1h`

## Backend design (NestJS)

| Piece | Responsibility |
|---|---|
| `UsersModule` | TypeORM `User` entity, register + `findByEmail` |
| `AuthModule` | Login, JWT issue/verify, global `JwtAuthGuard` |
| `RegisterDto` / `LoginDto` | `class-validator` constraints |
| `@Public()` | Opt-out of the global JWT guard |
| `@CurrentUser()` | Read verified JWT payload from the request |
| Global `ValidationPipe` | `whitelist` + `forbidNonWhitelisted` + `transform` |

All routes require a valid JWT unless marked `@Public()`.

## Frontend design (React + Vite)

| Piece | Responsibility |
|---|---|
| `AuthProvider` | Holds `user` + `accessToken`; persists token in `localStorage` |
| Login / Register pages | Forms calling `/auth/login` and `/auth/register` |
| Protected route | Redirect to `/login` when unauthenticated |
| API client | Attaches `Authorization` header; on `401` clears session |
| Session restore | On load, if token present, call `GET /auth/me` |

Vite proxies `/api` → Nest (`localhost:3000`) so the browser stays
same-origin during development.

## Data model

```
User
  id            INT PK AUTO_INCREMENT
  email         VARCHAR UNIQUE NOT NULL
  passwordHash  VARCHAR NOT NULL
  role          ENUM('PO','PM','DEVELOPER','QA') NOT NULL
  createdAt     DATETIME
```

## Security requirements

1. Never store or return plaintext passwords.
2. Never return `passwordHash` in any HTTP response.
3. Use a constant "Invalid credentials" message on login failure
   (no email enumeration via distinct errors).
4. `JWT_SECRET` must be set; refuse to start in production without it.
5. CORS: allow the web origin only (dev: Vite URL).
6. Do not commit `.env`; ship `.env.example` with placeholder values.

## Env vars

| Variable | Used by | Notes |
|---|---|---|
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASS` / `DB_NAME` | API | MySQL |
| `JWT_SECRET` | API | Signing key |
| `PORT` | API | Default `3000` |
| `VITE_API_BASE_URL` | Web | Optional; default `/api` via proxy |

## Acceptance criteria

1. Unauthenticated caller can register and login.
2. Protected route without token returns `401`.
3. `GET /auth/me` with a valid token returns the current user.
4. Register with a duplicate email returns `409`.
5. Login with wrong password returns `401` with no account hint.
6. Web app: register → login → land on authenticated home; logout
   clears token and returns to login.
7. Shared `AuthUser` / `LoginResponse` types live in `@scoutbook/types`.

## Open questions (deferred)

- Password reset flow  
- Refresh tokens for long sessions  
- Invites / first-user bootstrap when the DB is empty  
- Role-gated write permissions per feature stage  
