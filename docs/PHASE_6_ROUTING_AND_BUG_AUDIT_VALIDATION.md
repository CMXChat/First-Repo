# Phase 6 Validation: BGP, RPKI, and Full Platform Bug Audit

Validated synchronized implementation head: `db05d5851a8b9c7c51df73f221aea87367727a11`.

This head includes current `main` through synchronization PR #36 and is zero commits behind it.

## Outcome

This phase completed two related objectives:

1. Audit the entire migration branch for defects that existing happy-path coverage could miss.
2. Add bounded BGP and RPKI context through a fixed server-side routing provider boundary.

The audit produced real security, data-integrity, stale-state, navigation, accessibility, resource-retention, and duplicate-review fixes. Each confirmed defect now has deterministic backend or browser regression coverage.

The routing capability remains evidence collection. It does not automatically establish ownership, control, attribution, compromise, intent, reputation, or malicious activity.

## Confirmed defects found and fixed

### 1. API body-size bypass without trustworthy Content-Length

The original 2.5 MB transport check inspected the declared `Content-Length` header. A chunked request, missing header, or understated header could exceed the limit while FastAPI still parsed the complete body.

Fixed in `backend/app/hardened.py`:

- actual ASGI request bytes are counted before route processing
- state-changing API requests are buffered only up to the configured transport limit
- bodies exceeding the limit receive HTTP 413
- early rejection responses receive the normal security headers and request ID

Regression coverage sends an oversized body with an intentionally understated `Content-Length` value.

### 2. Missing Person imports lost persistent source relationships

The importer created persistent source rows and preserved a source reference in observation notes, but facts, leads, and timeline items did not receive their database `source_id`.

Fixed with `backend/app/services/import_links.py` and the import transaction:

- imported source identifiers resolve to the source rows created in the same atomic import
- imported facts, leads, and timeline observations receive the correct `source_id`
- the readable legacy source reference remains in the note
- the audit summary records the number of source links created

### 3. Enrichment DNS resolution escaped the configured deadline

The HTTP and TLS enrichment adapters applied timeouts to socket operations, but DNS resolution could block outside the configured enrichment deadline.

Fixed in `backend/app/api/enrichment.py`:

- one end-to-end deadline now covers name resolution and all permitted address attempts
- timeout failure returns the existing bounded enrichment timeout response

### 4. Unicode HTTP targets could fail during raw request encoding

A valid HTTP or HTTPS URL with Unicode path or query characters could pass URL validation and then fail when the raw request target was encoded as ASCII.

Fixed by canonicalizing the path and query into percent-encoded ASCII before the bounded raw socket request is assembled.

### 5. Delayed active-case saves could mark later edits as saved

A tool snapshot could begin saving, the operator could edit the tool or change the selected case, and the earlier response could then mark the newer state as saved.

Fixed with `assets/cmx-case-save-guard.js`:

- the case selector is locked during a write
- each save is pinned to its starting case and research fingerprint
- edits made during the request remain visibly unsaved
- a completed earlier write cannot mark later tool state as saved

### 6. Exact active-case selection failed outside the first list page

The shared case selector loaded the first 100 active cases. A valid `?case=` target outside that result set could not become active.

Fixed by fetching and hydrating the exact requested case through the owner-scoped detail endpoint when it is missing from the list response.

### 7. Cases list refreshes were suppressed by the busy flag

Initial backend verification, create, update, and archive flows called the list refresh while the global busy flag was active. The refresh could return immediately and leave a stale list. Existing synchronizer behavior masked part of this defect.

Fixed with `assets/cases-workbench-guard.js`:

- visible list refresh occurs after successful mutation response consumption
- exact case hydration is retained
- case detail reads are serialized to prevent older responses replacing newer selection state
- the New Case drawer has a stable ID, `aria-controls`, `aria-expanded`, and enforced open or closed state

### 8. Lifecycle navigation dropped the case identifier

The retention-review action opened `/cases` without the selected case ID.

Fixed so the operator returns to `/cases?case=<id>`. Lifecycle audit reads are also serialized so an older audit response cannot replace a newer selection.

### 9. Enrichment duplicate review compared only the summary

Two enrichment observations with the same visible summary but different provider provenance could be treated as duplicates.

Fixed so exact duplicate review compares:

- observation kind
- normalized summary
- complete provenance note

Different provider, source, collection time, cache state, or normalized result can therefore remain a distinct observation.

### 10. In-process rate-limiter identities were retained indefinitely

The per-process limiter pruned timestamps for active keys but did not evict identities that stopped making requests.

Fixed in `backend/app/main.py`:

- identity state uses bounded ordered storage
- inactive keys are periodically pruned
- the key map has a hard maximum
- least-recently-used identities are evicted when the bound is reached

Cloudflare edge limits remain the production authority.

### 11. Decorative fixed chrome could intercept controls

The browser suite found that the fixed CMX status chrome could overlap and intercept a control after scrolling.

Fixed by making decorative status chrome pointer-transparent while preserving interactivity on actual navigation controls.

### 12. Routing cancellation could retain a completed provider task

The routing service coalesces identical provider requests. If the requesting browser cancelled while the provider task continued, a completed task could remain in the in-flight map.

Fixed with explicit completion callbacks and cleanup. Regression coverage cancels the caller, permits the provider task to finish, and verifies the in-flight map is empty.

### 13. Routing save could proceed after duplicate-preflight failure

The first routing UI pass could report a case-detail preflight error and still attempt a write.

Fixed with `assets/osint-routing-save-guard.js`:

- a routing observation POST requires a fresh successful detail read for the same case
- the preflight expires after five seconds
- case selection changes invalidate the preflight
- an exact duplicate is blocked until the visible acknowledgement is checked
- failure returns a local 409 response before the POST reaches FastAPI

### 14. Browser accessibility and test precision

The combined OSINT page contains enrichment and routing cancellation controls. The routing control now has the distinct accessible name `Stop routing lookup`.

RPKI provider states are displayed as readable labels such as `Invalid ASN` and `Invalid Length`.

XSS regressions now target the exact safe text surfaces because an adversarial case title correctly appears in both the case list and the detail heading.

## Bounded BGP and RPKI capability

The protected routing API adds:

- `GET /api/routing/origin`
- `GET /api/routing/prefixes`
- `GET /api/routing/visibility`
- `GET /api/routing/rpki`

The service uses fixed RIPEstat Data API endpoints only.

The browser cannot provide a routing-provider URL and does not call RIPEstat directly.

### Network origin context

Supports:

- public IPv4 and IPv6 addresses
- public exact prefixes
- matching routed prefix
- origin ASN observations
- announced or not-announced provider state

### ASN announced prefixes

Supports:

- ASN validation from 1 through 4,294,967,295
- bounded prefix records
- bounded timeline intervals
- provider record count
- truncation disclosure

### Route visibility

Supports bounded RIPE RIS looking-glass observations:

- RIS collector identifier and location
- peer address
- observed prefix
- origin ASN
- bounded AS path
- observation times
- provider peer count and returned count
- truncation disclosure

Malformed AS-path identifiers, private peer addresses, and non-public prefixes are not retained in normalized output.

### RPKI validation

The normalized result preserves explicit states:

- `valid`
- `invalid`
- `not_found`
- `unavailable`

Provider statuses such as `invalid_asn` and `invalid_length` remain visible as readable labels. An invalid state is not described as malicious, compromised, or an attack.

## Routing request and cache boundary

The routing service provides:

- fixed HTTPS provider origin
- redirect refusal
- bounded provider timeout
- bounded response bytes
- bounded prefix, peer, collector, and AS-path records
- public IP and prefix validation
- bounded 512-entry in-process cache
- configured cache TTL
- same-key provider-request coalescing
- completed-task cleanup after caller cancellation
- provider, source URL, target, collection time, requester, and cache-state disclosure

The in-process cache is not permanent evidence storage.

## Operator workflow

The protected OSINT page now includes:

- public IP or prefix input
- ASN input
- Find origin
- ASN prefixes
- Route visibility
- Validate RPKI
- request cancellation
- stale-result rejection
- normalized records and JSON
- provider and requester provenance
- explicit limitation text
- explicit save disclosure
- exact duplicate review
- one owner-scoped observation transaction per save
- confidence fixed to `unrated`

The relationship prompt is review-only. It opens the selected case Relationships view and states that no relationship has been created.

## Regression coverage added

Backend coverage includes:

- actual request bytes exceeding the API transport limit
- Missing Person source-link persistence
- Unicode HTTP target canonicalization
- end-to-end enrichment timeout
- routing public-resource validation
- ASN validation
- fixed RIPEstat endpoint and source application value
- provider cache reuse
- announced-prefix truncation
- malformed AS-path filtering
- bounded route visibility
- every RPKI state
- provider response-size enforcement
- private-resource denial
- requester and cache disclosure
- in-flight provider-task cleanup after caller cancellation
- rate-limiter key pruning and maximum bounds

Desktop and mobile browser coverage includes:

- exact active case outside the first list page
- edits during delayed save remain unsaved
- visible case creation refreshes without manual reload
- stable New Case drawer state and ARIA attributes
- exact lifecycle return target
- enrichment provenance-aware duplicate behavior
- routing cancellation
- stale routing result rejection
- no direct browser request to RIPEstat
- routing provenance display
- one `routing_network_info` observation in the selected case
- confidence remains `unrated`
- exact duplicate blocking
- invalid RPKI wording boundary
- failed duplicate preflight prevents the routing write
- adversarial file and case titles remain text

## Workflow result

All eleven workflow groups passed on synchronized implementation head `db05d5851a8b9c7c51df73f221aea87367727a11`:

- PostgreSQL integration
- Hardened API entry point
- CMX Terminal Theme Guard
- CMX Static Validation
- CMX Navigation Link Guard
- Case lifecycle source policy
- Operations scripts
- OSINT platform checks
- CMX Privacy Audit
- CMX Secret Scan
- Final platform entry point

The final platform workflow passed both the full desktop and full mobile Chromium projects.

## Release state

This validation does not approve production deployment.

PR #28 remains draft. Production remains unchanged.

Protected staging must still verify:

- Cloudflare Access identity enforcement
- denial of unmatched identities
- Tunnel-only origin reachability
- no direct application or PostgreSQL exposure
- live security headers
- structured logs without research contents
- public routing and enrichment success
- denial of private, loopback, reserved, multicast, unspecified, and non-standard-port targets
- HTTP redirect reporting without following
- bodyless HTTP inspection
- encrypted off-host PostgreSQL backup
- restore validation
- application rollback
