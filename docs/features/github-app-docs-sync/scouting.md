# GitHub App tokens for Docs Sync — Scouting

Feature: Prefer short-lived GitHub App installation tokens for docs sync  
RFC: [0031-github-app-docs-sync](../../rfcs/0031-github-app-docs-sync.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Drop PAT? | No — keep PAT as `authMode: PAT` | Ready |
| Where credentials live? | Same encrypted connection row (PO Settings) | Ready |
| App secrets? | Encrypt private key with existing `DOCS_SYNC_ENCRYPTION_KEY` | Ready |
| Sync token? | Mint installation access token at sync time (short-lived) | Ready |
| Still PR-only? | Yes — never push to default branch | Ready |
| Who configures? | PO only (unchanged CASL manage DocsSync) | Ready |

## Expected after implementation

Settings lets PO choose PAT or GitHub App; Sync uses an installation token
when App mode is selected; plaintext secrets never returned.
