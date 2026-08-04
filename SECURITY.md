# CMX Restricted Node Security

## Current security status

The browser login is a local interface control. It is not server-side authentication and must not be treated as the security boundary for `db.cmxchat.com`.

The migration branch contains a FastAPI security boundary with Cloudflare Access JWT validation, trusted-host enforcement, owner-scoped records, write-origin controls, PostgreSQL persistence, explicit imports, direct case capture, lifecycle controls, and bounded public-infrastructure enrichment.

Production remains unchanged. The branch must stay draft until the protected staging, recovery, and final review gates pass.

## Required production controls

1. Protect the entire `db.cmxchat.com` hostname with a Cloudflare Access self-hosted application.
2. Use an explicit Allow policy for approved identities only.
3. Enable Cloudflare's zone-level **Require Access protection** setting so unmatched hostnames are denied by default.
4. Route the FastAPI origin through an outbound-only Cloudflare Tunnel and do not expose the application or database port directly.
5. Validate the Cloudflare Access JWT at FastAPI before sensitive page or API access.
6. Use separate Access audiences, service tokens, Tunnel tokens, database credentials, volumes, and backup destinations for staging and production.
7. Keep API keys and provider credentials in server-side environment variables or a secret manager. Never place them in HTML, JavaScript, query strings, browser storage, or logs.
8. Apply real response headers at the edge and application layer. HTML `<meta http-equiv>` tags are not a substitute for response headers.
9. Require PostgreSQL migrations, encrypted off-host backups, checksum verification, and tested restore and rollback procedures.

## Required response headers

The production server should send a policy equivalent to:

```text
Cache-Control: no-store
Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=()
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex
```

The final Content Security Policy must be generated from the actual dependency and API inventory. Third-party scripts should be self-hosted where practical. Any remaining CDN scripts must be pinned and protected with Subresource Integrity.

## Identity and ownership rules

- Every operational case record must carry the authenticated Cloudflare Access subject.
- Reads and writes must be owner-scoped before records leave the database.
- Browser-selected case IDs are untrusted input and never establish authorization.
- Audit responses must remain redacted and must not echo case content, research targets, queries, notes, evidence bytes, or provider payloads.
- Restore and permanent purge require explicit lifecycle routes and exact case-ID confirmation.

## Browser-data rules

- Private identifiers must not be saved automatically.
- Browser persistence may hold only temporary interface continuity such as the client session and active case identifier.
- Case, evidence, source, finding, query, relationship, and note persistence must be explicit and server-controlled.
- Every screen that sends a target to an external provider must identify the provider and the data being disclosed.
- Generated queries do not enter a case until an operator explicitly saves them.
- Metadata evidence registration must not upload original file bytes unless a later isolated evidence worker explicitly supports it.
- Bulk-open actions must be capped and require confirmation.
- Clear and delete actions must remove both UI state and stored state within their documented scope.

## Enrichment and SSRF rules

The public-infrastructure enrichment service is not a browser proxy, URL preview service, crawler, screenshot service, or unrestricted server-side fetch API.

Every direct network adapter must enforce all applicable controls below.

### Target validation

- Permit only the exact target classes required by the adapter.
- Reject embedded URL credentials and fragments.
- Permit HTTP or HTTPS only where web inspection is required.
- Permit standard ports only unless a separately reviewed adapter documents another fixed port.
- Reject private, loopback, link-local, multicast, reserved, unspecified, and otherwise non-global IP addresses.
- Resolve hostnames before connection and validate every candidate address.
- Connect only to the pre-resolved permitted address while preserving the validated hostname for Host and SNI.
- Do not resolve a hostname once for validation and then allow a separate library resolution during connection.

### Redirect and response handling

- Do not follow provider or target redirects automatically.
- Treat a redirect target as untrusted new input requiring a new operator action and complete revalidation.
- Bound connection, read, and total request time.
- Bound JSON response bytes, HTTP header bytes, and normalized record counts.
- HTTP inspection must use `HEAD`, read a header block only, and never consume the response body.
- Exclude cookies, authorization challenges, and unnecessary headers from normalized output.
- TLS inspection must perform a handshake only and must report verification failure without treating the certificate as trusted.

### Provider boundary

- RDAP provider selection must come from the relevant IANA bootstrap registry.
- Provider URLs must use HTTPS on the standard port.
- Certificate Transparency providers must be fixed in server code or configuration and reviewed before use.
- The browser must call same-origin enrichment endpoints only.
- Adapter responses must state the adapter, provider, source URL, target, collection time, authenticated requester, and cache state.
- Provider results must not automatically become verified identity, ownership, causation, reputation, or current-service conclusions.

### Logging and retention

- Do not log query strings, research targets, request bodies, response bodies, certificate names, RDAP entities, CT names, or normalized findings.
- Logs may include the route path, request ID, status, duration, and authenticated subject.
- Adapter caches must be bounded and must not be treated as permanent evidence storage.
- Saving enrichment output to a case must be explicit, display the exact fields, preserve provider provenance, default to unrated confidence, and perform duplicate review.

## Write-request rules

- State-changing browser requests must be same-origin.
- Reject cross-site and same-site sibling-origin writes.
- Compare Origin and Host when Origin is present.
- Require JSON content types for POST, PUT, and PATCH.
- Enforce the transport body limit before route processing.
- Keep bodyless DELETE support only for explicit lifecycle endpoints.
- Apply per-identity edge and application rate limits.

## Rendering rules

- Treat API responses, uploaded filenames, file metadata, DNS records, enrichment results, extracted text, URL parameters, imports, and clipboard content as untrusted.
- Use `textContent`, `createElement`, and validated URL assignment.
- Do not insert untrusted values through `innerHTML`, `insertAdjacentHTML`, `document.write`, or equivalent sinks.
- Validate URL protocols and allow only the protocols required by the action.
- Run regression tests with HTML and SVG payloads in every import and API field.

## Staging acceptance requirements

Before production promotion, protected staging must verify:

- unmatched and unapproved identities are denied before CMX content is returned
- the origin is reachable only through Cloudflare Tunnel and local administration paths
- the FastAPI subject matches the authenticated Access identity
- response headers are present on pages, assets, errors, and APIs
- write-origin and content-type controls reject invalid requests
- public enrichment works only for permitted public targets
- private, loopback, link-local, reserved, and non-standard-port targets are denied
- HTTP redirects are reported but not followed
- HTTP response bodies are not read or stored
- logs exclude research contents and query strings
- an encrypted off-host PostgreSQL backup passes checksum, archive, and temporary restore validation
- application rollback and database restore procedures are rehearsed

## Reporting a security issue

Do not publish sensitive findings in a public issue. Contact the repository owner privately with the affected route, reproduction steps, impact, and recommended remediation.

## References

- Cloudflare Access application paths: https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/
- Cloudflare Require Access protection: https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/require-access-protection/
- OWASP Server-Side Request Forgery Prevention: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- OWASP DOM XSS prevention: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
- MDN Subresource Integrity: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity
