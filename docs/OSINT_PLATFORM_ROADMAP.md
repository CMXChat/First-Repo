# CMX OSINT Platform Roadmap

## Current branch

`agent/osint-platform-hardening`

The branch is the controlled migration workspace for `db.cmxchat.com`. Production remains unchanged until staging, Access, browser tests, and review are complete.

## Completed

### Shared foundation

- guarded approved routes behind the browser session during the static transition
- preserved the session during approved navigation
- added safe return-to-tool handling
- removed fake developer-tools and context-menu blocking
- documented the real security boundary
- added shared modern tool styling and modular assets
- added JavaScript syntax, safe-rendering, local-asset, persistence, operator, and artifact checks
- added Python tests and Docker build checks

### Migrated frontend tools

- `/search`
  - provider-specific query output
  - curated real-domain packs
  - PII disclosure
  - bounded batch opening
  - session research log and export
- `/metadata`
  - bounded local file processing
  - SHA-256 and signature detection
  - safe metadata rendering
  - partial-parser warnings and export
- `/osint`
  - normalized entity intake
  - DNS status, TTL, AD, TC, and raw records
  - SPF, DMARC, MTA-STS, CAA, and MX-provider interpretation
  - IPv4 and IPv6 special-range classification
  - curated disclosed pivots
  - session observations and export
- `/phone`
  - conservative local normalization
  - E.164 output
  - explicit NANP ambiguity
  - no carrier, subscriber, type, timezone, or precise-location claims
  - individual pivots and export
- `/missing`
  - authorization basis
  - case header and official-first checklist
  - separate facts and leads
  - source log and timeline
  - JSON and handoff-report export

### FastAPI origin scaffold

- approved static route and asset serving
- development and Cloudflare authentication modes
- staging and production refuse development authentication
- Cloudflare Access JWT signature, issuer, audience, issue-time, and expiry validation
- health, readiness, identity, and DNS API routes
- DNS validation, timeout, normalization, and short in-process cache
- trusted hosts, baseline security headers, and per-process API safety limit
- non-root Docker image
- read-only Compose deployment with optional outbound-only Cloudflare Tunnel profile
- staging and production deployment documentation

## Current verification

- OSINT platform workflow completed successfully on the migration branch
- repository static validation, secret scan, privacy audit, and terminal-theme checks completed successfully
- an older navigation policy conflict was identified and corrected on the branch
- the branch remains draft and unmerged

## Next implementation phase

### Same-origin APIs

- route OSINT DNS requests through `/api/dns` when the FastAPI origin is active
- retain a clearly labeled static fallback only during the GitHub Pages transition
- add normalized provider gateway interfaces for future IP and reputation services
- add request correlation and structured server logs

### Persistent case model

- PostgreSQL schema and migrations
- cases
- entities and identifiers
- observations
- sources and queries
- evidence items and hashes
- relationships
- analyst notes
- confidence and status history
- access-scoped ownership and audit events
- retention and deletion controls

### File processing

- isolated upload staging
- file-size and MIME enforcement
- malware scanning
- EXIF, XMP, IPTC, ICC, Office, PDF, and media workers
- OCR with progress, cancellation, timeouts, and deletion
- before and after hashes for metadata stripping

### Staging

- dedicated staging hostname
- Cloudflare Access self-hosted application for the entire hostname
- deny unmatched identities
- separate staging Access audience and Tunnel token
- Docker deployment on Linux
- outbound-only Tunnel to the application service
- direct origin access unavailable
- response-header verification
- access-denial and identity tests

### Browser validation

- Playwright smoke tests for every approved route
- cross-tool handoff tests
- XSS regression tests
- DNS success and DNS-failure tests
- mobile viewport tests
- export tests
- Access redirect and authenticated identity tests against staging

## Promotion rule

Do not merge or move the production hostname until:

1. All repository checks pass.
2. Staging is protected by Cloudflare Access.
3. The origin independently validates the Access token.
4. Direct origin access is unavailable.
5. Browser tests pass against staging.
6. Response headers and logs are reviewed.
7. Rollback instructions are tested.
8. The pull request is reviewed and approved.
