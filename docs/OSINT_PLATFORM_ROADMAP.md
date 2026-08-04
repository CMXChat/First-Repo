# CMX OSINT Platform Roadmap

This roadmap turns the current static OSINT pages into a secure, testable operator platform while preserving the strongest interface and workflow ideas.

## Working branch

`agent/osint-platform-hardening`

## Definition of done

The platform is complete when:

- the entire hostname is protected by real identity-based access control;
- sensitive provider credentials never enter browser code;
- every untrusted value is rendered safely;
- each tool has reliable validation, failure states, and automated tests;
- cases, observations, sources, queries, evidence, notes, confidence, timestamps, and hashes share one data model;
- all cross-tool pivots preserve case context;
- external services are health-checked and replaceable;
- the frontend is served by a Dockerized FastAPI application through Cloudflare Tunnel;
- staging deployment and production approval are separate steps.

## Phase 1: Security and stability

- [x] Create a dedicated hardening branch.
- [x] Preserve the browser session across approved tool navigation.
- [x] Redirect guarded static routes to the root login when the client session is missing.
- [x] Return users to an approved requested tool after authentication.
- [x] Remove developer-tools blocking and context-menu security theater.
- [x] Document the real security boundary and required production controls.
- [ ] Protect all of `db.cmxchat.com` with Cloudflare Access.
- [ ] Enable Cloudflare Require Access protection for the zone.
- [ ] Inventory every `innerHTML` sink and replace untrusted rendering.
- [ ] Remove browser-exposed API key inputs.
- [ ] Remove automatic persistence of emails, usernames, domains, IPs, and phone numbers.
- [ ] Add explicit privacy and external-disclosure notices.
- [ ] Cap or replace bulk-open actions.
- [ ] Pin or self-host third-party dependencies.
- [ ] Add production response headers.

## Phase 2: Correctness repairs

### OSINT console

- [ ] Parse DNS response status, TTL, DNSSEC state, aliases, and raw records.
- [ ] Preserve TXT record boundaries.
- [ ] Add SPF, DMARC, DKIM, and MTA-STS interpretation.
- [ ] Add IPv6 and complete special-purpose range detection.
- [ ] Correct ProxyCheck response interpretation and move provider calls server-side.
- [ ] Infer email providers from MX records, with confidence labels.
- [ ] Construct each search query as plain text and encode it once.
- [ ] Separate map initialization from unrelated tools.
- [ ] Replace duplicate file intelligence with a pivot to Metadata.

### Phone intelligence

- [ ] Disable analysis until the phone parser is ready.
- [ ] Upgrade `libphonenumber-js` and use metadata appropriate for number-type detection.
- [ ] Remove country-centroid local-time guessing.
- [ ] Read `?n=` and other approved prefill parameters.
- [ ] Upgrade OCR and run it in a reusable worker.
- [ ] Add OCR progress, cancellation, limits, and mobile memory protection.
- [ ] Separate numbering-plan facts from live carrier or subscriber data.
- [ ] Exclude `tel:` and `sms:` actions from bulk opening.

### Metadata inspector

- [ ] Fix CSV type detection and filtering.
- [ ] Escape or safely render filenames and all metadata.
- [ ] Enforce per-format file limits.
- [ ] Move expensive parsing into workers.
- [ ] Add SHA-256 and optional SHA-512 to every file.
- [ ] Detect MIME type from signatures.
- [ ] Replace the compact EXIF parser with maintained EXIF, XMP, IPTC, and ICC parsing.
- [ ] Replace the PDF string scan with a real PDF metadata parser.
- [ ] Add DOCX, XLSX, PPTX, ID3, and media container properties.
- [ ] Add duplicate detection and metadata timeline.
- [ ] Add supported metadata-removal exports with before-and-after hashes.

### Search workbench

- [ ] Correct the PII masking claim and behavior.
- [ ] Remove unsupported or malformed search operators.
- [ ] Generate engine-specific queries.
- [ ] Replace broad wildcard site patterns with curated domain packs.
- [ ] Rename the temporary Evidence Locker until persistence and provenance exist.
- [ ] Add timestamp, engine, query, result URL, source, note, confidence, and analyst fields.
- [ ] Remove the trailing file artifact.

### Missing-person workflow

- [ ] Replace duplicate resources with the maintained `/resources` library.
- [ ] Validate reverse-image workflows and label upload-only engines correctly.
- [ ] Remove obsolete search operators.
- [ ] Add case authorization, urgency, official-report status, and sensitivity controls.
- [ ] Add last-known timeline, leads, confirmed facts, contradictions, and handoff export.
- [ ] Add safeguards for minors, abuse, stalking, medical information, and public sharing.

## Phase 3: Shared application foundation

- [ ] Add Dockerized FastAPI application.
- [ ] Serve existing static pages from FastAPI during migration.
- [ ] Add Jinja-rendered shared layout and `/api` routes.
- [ ] Add Cloudflare Tunnel deployment.
- [ ] Validate Cloudflare Access identity at the backend.
- [ ] Add environment-based configuration and secret management.
- [ ] Add PostgreSQL for cases and evidence.
- [ ] Add Redis only when caching, queues, or rate controls require it.
- [ ] Add structured application and audit logging.
- [ ] Add rate limits, request sizes, timeouts, retries, and circuit breakers.
- [ ] Add health, readiness, and dependency status endpoints.

## Phase 4: Shared operator model

Use a shared model for:

- Case
- Entity
- Identifier
- Observation
- Source
- Query
- Evidence item
- Relationship
- Analyst note
- Confidence
- Timestamp
- Hash

Cross-tool pivots must pass a case ID and an entity ID instead of copying sensitive values through query strings whenever possible.

## Phase 5: Automated quality control

- [ ] Unit tests for validators, parsers, masking, and query builders.
- [ ] Mocked API tests for DNS, IP, phone, and provider failures.
- [ ] Browser tests for every major action.
- [ ] XSS regression payload suite.
- [ ] Mobile viewport and memory tests.
- [ ] Accessibility checks.
- [ ] Dependency and license monitoring.
- [ ] Scheduled external-link health checks.
- [ ] Functional sample checks for every tool.
- [ ] Staging smoke test before production approval.

## Delivery method

Each phase should be delivered through a draft pull request or a clearly separated commit series. No production deployment should occur automatically. Staging must be tested first, with production requiring explicit approval.
