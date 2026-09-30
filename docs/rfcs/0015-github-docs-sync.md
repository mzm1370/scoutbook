# RFC 0015 — GitHub Docs Sync

Status: Accepted  
Date: 2026-09  
Depends on: [0000-charter](./0000-charter.md),
[0002-feature-record](./0002-feature-record.md),
[0003-scouting-entries](./0003-scouting-entries.md),
[0005-feature-rfc-check](./0005-feature-rfc-check.md),
[0006-feature-raci](./0006-feature-raci.md),
[0014-feature-dependency-graph](./0014-feature-dependency-graph.md)

## Summary

PO configures one **workspace** GitHub repo + fine-grained PAT (encrypted at
rest). **Sync** generates Feature markdown under `docs/` and opens a **PR**
against the default branch — never push to main.

## Motivation

Charter MVP: durable decisions land in the target repo’s `docs/` folder with a
human still reviewing via PR.

## Detailed design

### Security

- Encrypt PAT with AES-256-GCM using `DOCS_SYNC_ENCRYPTION_KEY` (32-byte hex).
- Never store or return plaintext / `encryptedToken` / raw PAT.
- API status exposes `hasToken` + `tokenLastFour` only.
- Missing encryption key → refuse save/sync (clear error).
- GitHub App installation tokens: **deferred** (later RFC).

### Data model

```
GithubConnection (0–1 row)
  id                 INT PK
  repoUrl            VARCHAR   # normalized https://github.com/owner/repo
  encryptedToken     TEXT      # versioned ciphertext blob
  tokenLastFour      CHAR(4)
  updatedByUserId    INT
  updatedAt          DATETIME
  lastSyncAt         DATETIME NULL
  lastPrUrl          VARCHAR NULL
```

### Generated files

Per Feature (`<slug>` = kebab(title) + `-` + id):

- `docs/features/<slug>/overview.md`
- `docs/features/<slug>/scouting.md` (if any rows)
- `docs/features/<slug>/rfc-check.md` (if check exists)
- `docs/features/<slug>/raci.md` (if RACI rows exist)

Plus `docs/scoutbook/feature-relations.md` (BLOCKS edges).

### GitHub flow

1. Resolve owner/repo + default branch tip  
2. Create branch `scoutbook/docs-sync-<unix>`  
3. Create/update files via Contents API  
4. Open PR → store `lastPrUrl` / `lastSyncAt`

### API (JWT)

| Method | Path | Who | Purpose |
|---|---|---|---|
| `GET` | `/docs-sync/connection` | any auth | Status (no secret) |
| `PUT` | `/docs-sync/connection` | PO | Upsert `{ repoUrl, token? }` |
| `DELETE` | `/docs-sync/connection` | PO | Remove connection |
| `POST` | `/docs-sync/sync` | PO | Generate + open PR |

`token` required on first create; omit on later PUT to keep existing secret.

### Frontend

- `/settings` — repo URL, token (password), Save, Sync now  
- Sidebar Settings; non-PO read-only status

## Alternatives considered

- GitHub App in v1 — deferred (complexity).  
- Direct-to-main — rejected (charter).  
- Per-Feature repo — rejected (v1 = one team / one connection).

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Encrypted PAT; never returned  
- [x] Connection CRUD + Sync (PR only)  
- [x] Settings UI; unit + e2e (mocked GitHub); OpenAPI updated  
