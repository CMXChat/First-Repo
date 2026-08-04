# CMX Restricted Node Security

## Current security status

The browser login is a local interface control. It is not server-side authentication and must not be treated as the security boundary for `db.cmxchat.com`.

The static tool pages now require the active browser session before they remain open, but a determined user can still bypass client-side JavaScript. Production privacy requires an edge or server authentication layer.

## Required production controls

1. Protect the entire `db.cmxchat.com` hostname with a Cloudflare Access self-hosted application.
2. Use an explicit Allow policy for approved identities only.
3. Enable Cloudflare's zone-level **Require Access protection** setting so unmatched hostnames are denied by default.
4. Route the future FastAPI origin through Cloudflare Tunnel and do not expose the origin directly.
5. Validate the Cloudflare Access JWT at the FastAPI layer before sensitive API actions.
6. Keep API keys and provider credentials in server-side environment variables or a secret manager. Never place them in HTML, JavaScript, query strings, or browser storage.
7. Set real response headers at the edge or application layer. HTML `<meta http-equiv>` tags are not a substitute for response headers.

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

## Browser-data rules

- Private identifiers must not be saved automatically.
- Use `sessionStorage` only for the temporary client session.
- Case or evidence persistence must be explicit and encrypted or server-controlled.
- Every screen that sends a target to an external provider must identify the provider and the data being disclosed.
- Bulk-open actions must be capped and require confirmation.
- Clear and delete actions must remove both UI state and stored state.

## Rendering rules

- Treat API responses, uploaded filenames, file metadata, DNS records, extracted text, URL parameters, and clipboard content as untrusted.
- Use `textContent`, `createElement`, and validated URL assignment.
- Do not insert untrusted values through `innerHTML`.
- Validate URL protocols and allow only the protocols required by the action.
- Run regression tests with HTML and SVG payloads in every import and API field.

## Reporting a security issue

Do not publish sensitive findings in a public issue. Contact the repository owner privately with the affected route, reproduction steps, impact, and recommended remediation.

## References

- Cloudflare Access application paths: https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/
- Cloudflare Require Access protection: https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/require-access-protection/
- OWASP DOM XSS prevention: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
- MDN Subresource Integrity: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity
