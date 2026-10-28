# RFC 0031 — GitHub App Tokens for Docs Sync

Status: Accepted  
Date: 2026-10  
Depends on: [0015-github-docs-sync](./0015-github-docs-sync.md),
[0000-charter](./0000-charter.md)

## Summary

Extend workspace Docs Sync so PO can authenticate with a **GitHub App
installation** (short-lived access tokens) instead of only a fine-grained PAT.
PAT remains supported. Sync still opens a PR — never push to main.

## Motivation

Charter prefers short-lived GitHub App installation tokens over long-lived PATs.
RFC 0015 deferred Apps; Assessment Task 10 closes that gap without ripping out
working PAT sync.

## Detailed design

### Auth modes

| `authMode` | Credentials stored (encrypted) | Sync uses |
|---|---|---|
| `PAT` | Fine-grained PAT | Decrypted PAT |
| `GITHUB_APP` | App id + installation id + private key PEM | Mint installation token, then API |

### Data model (extend `GithubConnection`)

| Field | Notes |
|---|---|
| `authMode` | `PAT` \| `GITHUB_APP` (default `PAT`) |
| `encryptedToken` | PAT ciphertext (PAT mode) |
| `encryptedPrivateKey` | App PEM ciphertext (App mode); never returned |
| `githubAppId` | Public App id string |
| `githubInstallationId` | Installation id string |
| `tokenLastFour` | PAT last 4, or installation id last 4 in App mode |

### Status API (no secrets)

`GET /docs-sync/connection` adds:

- `authMode`
- `githubAppId` / `githubInstallationId` (null in PAT mode)
- `hasToken` — true when the active mode has credentials saved

### Upsert (`PUT`, PO)

```
{
  repoUrl,
  authMode,
  token?,                  // PAT — required on first create in PAT mode
  githubAppId?,            // App mode
  githubInstallationId?,   // App mode
  githubAppPrivateKey?     // App mode PEM — required on first create
}
```

Omit secrets on later PUT to keep existing ciphertext.

### Sync

1. Load connection  
2. If `GITHUB_APP`: JWT (RS256, ≤10m) →  
   `POST /app/installations/{id}/access_tokens` → use `token`  
3. Else decrypt PAT  
4. Existing Contents + PR flow (RFC 0015)

### Frontend

Settings: auth mode select; PAT field **or** App id / installation id / private
key textarea. Sync unchanged.

### Out of scope

- OAuth device flow / Marketplace listing  
- Multiple installations / orgs  
- Auto-creating the GitHub App  
- Direct-to-main  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Auth mode on connection + encrypted App credentials  
- [x] Sync mints installation token in App mode  
- [x] Settings UI for both modes  
- [x] Unit tests (mocked mint + GitHub); OpenAPI + graphify  
