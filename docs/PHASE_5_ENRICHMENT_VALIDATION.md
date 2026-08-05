# Phase 5 Validation: Bounded Infrastructure Enrichment

Validated implementation head before final branch synchronization: `e9bd2a0205ae75647d5261cc1ba88489ee2f6c57`.

## Completed capability

The protected OSINT workspace now includes bounded server-side enrichment for:

1. RDAP
2. HTTP response headers
3. TLS certificate metadata
4. Certificate Transparency

The browser communicates only with same-origin FastAPI endpoints. Provider credentials, unrestricted outbound access, and raw provider calls are not exposed to the browser.

## Protected endpoints

The implementation adds:

- `GET /api/enrichment/rdap`
- `GET /api/enrichment/http`
- `GET /api/enrichment/tls`
- `GET /api/enrichment/ct`

Every response identifies:

- adapter
- provider
- provider source URL
- target
- collection time
- authenticated requester
- cache state
- normalized result

The endpoints remain behind the same Cloudflare Access and owner-scoped platform boundary as the rest of the application.

## RDAP boundary

RDAP accepts:

- public domain names
- public IPv4 and IPv6 addresses
- autonomous system numbers

Provider selection uses the relevant IANA bootstrap registry. Provider URLs must use HTTPS on the standard port. Redirects are refused.

The normalized response includes only bounded registration, network, autonomous-system, event, entity, status, nameserver, secure-DNS, and notice fields. The original provider payload is not written automatically to a case.

## HTTP inspection boundary

HTTP inspection accepts HTTP or HTTPS URLs only.

The adapter:

- rejects embedded credentials
- rejects fragments
- rejects non-standard ports
- resolves the hostname before connection
- validates every returned address
- rejects private, loopback, link-local, multicast, reserved, unspecified, and otherwise non-global addresses
- connects to one pre-resolved permitted public address
- preserves the validated hostname for the Host header and TLS SNI
- sends one `HEAD` request
- reads a bounded header block only
- does not read the response body
- does not follow redirects
- returns an allowlisted header set
- excludes cookies and other unnecessary response fields

A redirect location is reported as evidence. It is not followed automatically.

## TLS inspection boundary

TLS inspection accepts a public domain or public IP address on port 443.

The adapter performs a TLS handshake without sending an HTTP request and returns:

- resolved public IP
- TLS protocol
- cipher
- ALPN protocol when available
- verification state
- verification error when applicable
- SHA-256 certificate fingerprint
- serial number
- subject
- issuer
- validity window
- bounded Subject Alternative Names

A certificate that fails verification is reported as unverified. The adapter does not silently treat it as trusted.

## Certificate Transparency boundary

Certificate Transparency collection uses the fixed server-side `crt.sh` provider.

The adapter:

- accepts a normalized public domain
- supports an explicit include-subdomains option
- bounds provider time and response bytes
- deduplicates certificate observations
- bounds the returned record count
- preserves provider provenance and collection time
- states that certificate issuance does not prove current ownership or active service availability

## Request and cache limits

The enrichment configuration exposes bounded controls for:

- total provider timeout
- result-cache lifetime
- IANA bootstrap-cache lifetime
- maximum provider response bytes
- maximum HTTP header bytes
- maximum normalized records

The current defaults are:

- 8-second enrichment timeout
- 300-second result cache
- 86,400-second bootstrap cache
- 1 MiB provider JSON limit
- 64 KiB HTTP header limit
- 100 normalized records

The cache is in-process and is not permanent evidence storage.

## Operator workflow

The OSINT page now provides one enrichment target field and explicit actions for RDAP, HTTP, TLS, and Certificate Transparency.

The interface shows:

- protected or unavailable operating state
- pending, completed, cancelled, and failed status
- provider identity
- source URL
- collection time
- cache state
- authenticated requester
- normalized fields
- bounded record lists
- normalized JSON

The current analyzed entity can prefill the enrichment target. The operator can change the target before collection.

## Cancellation and stale-result protection

Each enrichment run has its own browser request controller and serial identifier.

When the operator cancels a request or starts a newer request:

- the old request is aborted
- late completion from the old request is ignored
- an old result cannot replace the newer target
- save controls remain tied to the current normalized result

The shared CMX status bar was also made pointer-transparent so decorative fixed chrome cannot block page controls when the browser scrolls them underneath it. The actual CMX navigation button and links remain interactive.

## Explicit case save

Enrichment results are not saved automatically.

The save workflow creates one owner-scoped observation with:

- kind derived from the adapter
- normalized summary
- provider provenance
- provider source URL
- target
- collection time
- cache state
- normalized result
- explicit limitation statement
- confidence set to `unrated`

The operator sees the exact observation fields before save.

Before every write, the browser reloads the selected case and performs an exact duplicate preflight. A possible duplicate disables save until the operator explicitly acknowledges that another record is intentional.

Provider output does not automatically become a verified identity, ownership, causation, reputation, or current-service conclusion.

## Safe rendering and browser storage

The enrichment client:

- uses same-origin API paths only
- builds result UI with text nodes
- contains no dynamic HTML insertion sink
- stores no enrichment target or result in local storage
- does not expose a general-purpose third-party fetch function
- does not write to a case without explicit operator action

## Deterministic backend validation

Backend tests cover:

- domain, IP, and ASN classification
- rejection of private and loopback targets
- rejection of embedded URL credentials
- rejection of non-standard ports
- selected HTTP header parsing
- cookie exclusion
- IANA service routing for domains, IP networks, and ASN ranges
- Certificate Transparency deduplication and record limits
- RDAP provider provenance and cache behavior
- API requester and cache disclosure
- provider response-size enforcement

The tests use deterministic mock transports and do not depend on live provider availability.

## Browser validation

Desktop and mobile Chromium coverage verifies:

- protected enrichment availability
- request cancellation
- stale-result rejection
- provider and target provenance rendering
- normalized RDAP display
- explicit field disclosure
- save enablement only with an active case and current result
- one `enrichment_rdap` observation written to the selected case
- confidence remains `unrated`
- provider provenance enters the analyst note
- exact duplicate warning before a second write
- zero direct browser requests to the displayed provider URL
- the existing active-case, direct-capture, Cases, lifecycle, and platform regressions remain green

## Workflow result

Every workflow group passed on the validated implementation head:

- OSINT source, syntax, safe-rendering, direct-capture, and enrichment policy
- privacy and secret scans
- static, navigation, lifecycle, operations, and terminal-theme checks
- complete backend tests
- dedicated enrichment tests
- Alembic upgrade, downgrade, and re-upgrade
- container build and Compose validation
- PostgreSQL 18 migration and API integration
- hardened and final platform entry-point tests
- full Chromium desktop platform suite
- full Chromium mobile platform suite

## Release state

This validation completes the first bounded infrastructure enrichment slice. It does not approve production deployment.

PR #28 must remain draft until protected staging verifies Cloudflare Access identity enforcement, Tunnel-only origin access, live response headers, private-target denial, redirect behavior, bodyless HTTP inspection, structured logging, encrypted off-host backup validation, and rollback procedures.
