# GitHub Docs Sync — Scouting

Feature: GitHub Docs Sync  
RFC: [0015-github-docs-sync](../../rfcs/0015-github-docs-sync.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Token type v1? | Fine-grained **PAT** (GitHub App deferred) | Ready |
| Storage? | AES-256-GCM with `DOCS_SYNC_ENCRYPTION_KEY`; never plaintext | Ready |
| Return token in API? | Never — only `hasToken` + `tokenLastFour` | Ready |
| Connection scope? | Singleton workspace connection | Ready |
| Push mode? | **PR only** to default branch | Ready |
| Who configures / syncs? | **PO** only | Ready |
| Who reads status? | Any authenticated | Ready |
| What files? | All Features → `docs/features/<slug>/` + relations index | Ready |

## Expected after implementation

Settings page: save encrypted connection; Sync now opens a PR with generated markdown.
