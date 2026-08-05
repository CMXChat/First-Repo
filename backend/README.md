# CMX Restricted Node Backend

This directory contains the FastAPI origin for the controlled migration of `db.cmxchat.com` away from static-only hosting.

Production remains unchanged until the protected staging, recovery, and review gates are complete.

## Current scope

The canonical platform entry point is `app.platform:app`.

The backend currently:

- serves the approved static routes and shared assets from the repository
- validates Cloudflare Access application JWTs in staging and production
- exposes health and authenticated identity endpoints
- provides a same-origin DNS gateway with validation, timeouts, normalized output, and a short in-process cache
- provides bounded public-infrastructure enrichment for RDAP, HTTP headers, TLS certificates, and Certificate Transparency
- persists owner-scoped cases, entities, observations, sources, queries, evidence registrations, relationships, analyst notes, and audit events
- supports explicit schema-bound session imports for OSINT, Phone, Search, Metadata, and Missing Person
- supports retention review, soft deletion, restoration, and exact-confirmation purge workflows
- applies response security headers, structured request logging, request IDs, trusted-host validation, write-origin controls, JSON-only writes, transport-size limits, and per-process API rate limits
- uses PostgreSQL through Psycopg in staging and production

## Security boundary

The browser passphrase remains interface design only. Real access control requires both:

1. A Cloudflare Access self-hosted application covering the complete staging or production hostname.
2. `CMX_AUTH_MODE=cloudflare` at the origin so FastAPI validates the `Cf-Access-Jwt-Assertion` signature, issuer, audience, issue time, expiry, and subject.

Do not expose the application or PostgreSQL port to the public internet. The supplied Compose configuration binds the application to `127.0.0.1` for administration, does not expose the database port, and provides an optional outbound-only `cloudflared` profile.

All operational database records carry the authenticated Access subject. Reads and writes are owner-scoped before records leave the database.

## Enrichment network boundary

The enrichment service is designed for public infrastructure evidence. It is not a general-purpose proxy or unrestricted fetcher.

### RDAP

- accepts a public domain, public IP address, or ASN
- obtains the provider through the relevant IANA bootstrap registry
- permits HTTPS providers on the standard port only
- refuses provider redirects
- bounds response time and JSON size
- normalizes selected registration, network, event, entity, and notice fields

### HTTP headers

- accepts HTTP or HTTPS URLs only
- refuses embedded credentials, fragments, and non-standard ports
- resolves the hostname before connection
- rejects every non-public, private, loopback, link-local, multicast, reserved, or unspecified address
- connects to a pre-resolved permitted public address
- sends one `HEAD` request
- preserves the original hostname for the Host header and TLS SNI
- reads a bounded header block only
- does not read the response body
- does not follow redirects
- returns only an allowlisted header set and excludes cookies

### TLS certificates

- accepts a public domain or public IP on port 443 only
- resolves and validates every candidate address before connection
- performs a TLS handshake without an HTTP request
- returns protocol, cipher, verification state, SHA-256 certificate fingerprint, serial number, subject, issuer, validity, and bounded Subject Alternative Names
- reports certificate verification failure without silently treating the certificate as trusted

### Certificate Transparency

- uses `crt.sh` through the server-side gateway
- accepts a normalized public domain
- bounds response time, JSON size, and returned records
- deduplicates certificate observations
- records provider provenance and collection time
- states explicitly that certificate issuance does not prove current ownership or service availability

Every adapter response includes the adapter, provider, source URL, target, collection time, authenticated requester, and cache state. Provider output is not automatically converted into a verified identity, ownership, causation, reputation, or current-service conclusion.

## Configuration

Copy `.env.example` and review every value before starting a server.

Important controls include:

```dotenv
CMX_ENVIRONMENT=development
CMX_AUTH_MODE=development
CMX_ALLOWED_HOSTS_CSV=localhost,127.0.0.1,testserver
CMX_DATABASE_URL=sqlite+pysqlite:///./cmx-dev.db
CMX_DATABASE_AUTO_CREATE=true

CMX_DNS_TIMEOUT_SECONDS=8
CMX_DNS_CACHE_TTL_SECONDS=60

CMX_ENRICHMENT_TIMEOUT_SECONDS=8
CMX_ENRICHMENT_CACHE_TTL_SECONDS=300
CMX_ENRICHMENT_BOOTSTRAP_TTL_SECONDS=86400
CMX_ENRICHMENT_MAX_RESPONSE_BYTES=1048576
CMX_ENRICHMENT_MAX_HEADER_BYTES=65536
CMX_ENRICHMENT_MAX_RECORDS=100

CMX_API_RATE_LIMIT_PER_MINUTE=60
```

Staging and production refuse development authentication, automatic table creation, and non-PostgreSQL database URLs.

## Local development

```bash
cd backend
cp .env.example .env
python3.14 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
alembic upgrade head
uvicorn app.platform:app --reload
```

Development mode accepts an optional `X-CMX-Dev-User` header. This behavior is refused automatically when `CMX_ENVIRONMENT` is `staging` or `production`.

Run checks:

```bash
cd backend
python -m compileall -q app
pytest
```

## Local container

```bash
cd backend
cp .env.example .env
docker compose \
  --env-file .env \
  --file compose.yml \
  --file compose.platform.yml \
  up -d --build
```

Verify:

```bash
curl http://127.0.0.1:8000/api/health/live
curl -H 'X-CMX-Dev-User: operator@example.test' http://127.0.0.1:8000/api/whoami
curl -H 'X-CMX-Dev-User: operator@example.test' 'http://127.0.0.1:8000/api/dns?name=example.com&type=A'
curl -H 'X-CMX-Dev-User: operator@example.test' 'http://127.0.0.1:8000/api/enrichment/rdap?target=example.com'
```

## Database and migrations

Staging and production require PostgreSQL and Alembic migrations.

```bash
cd backend
alembic upgrade head
alembic current
```

Do not use `CMX_DATABASE_AUTO_CREATE=true` outside local development.

## Backup and recovery

The repository includes guarded scripts for:

- custom-format PostgreSQL backup
- SHA-256 checksum creation
- archive verification
- controlled restore
- restore validation in a temporary database

See:

- `RECOVERY.md`
- `scripts/backup_postgres.sh`
- `scripts/verify_postgres_backup.sh`
- `scripts/restore_postgres.sh`
- `scripts/validate_postgres_restore.sh`

Production promotion requires an encrypted off-host backup and a successful restore rehearsal.

## Staging deployment

Use a dedicated hostname such as `db-staging.cmxchat.com`.

1. Create a Cloudflare Access self-hosted application covering the entire staging hostname.
2. Add explicit allow policies for approved identities and leave unmatched users denied.
3. Use a staging-specific Access audience, service token, Tunnel token, database credential, and volume.
4. Route the public hostname through an outbound-only Cloudflare Tunnel to the application container.
5. Populate the protected staging `.env` without committing secrets.
6. Run the canonical guarded deployment command:

```bash
git checkout agent/osint-platform-hardening
cd backend
cp .env.example .env
chmod 600 .env
./scripts/deploy_platform_staging.sh
```

7. Confirm the hostname presents Cloudflare Access before any CMX HTML or API data is returned.
8. Verify authenticated identity, health, DNS, Cases, imports, lifecycle, and enrichment endpoints.
9. Verify private and loopback enrichment targets are denied.
10. Confirm HTTP inspection does not follow redirects or read response bodies.
11. Review application logs and Cloudflare Access logs without recording research contents or query strings.
12. Create and validate an encrypted off-host PostgreSQL backup.
13. Rehearse application rollback and temporary database restore validation.

See `STAGING_RUNBOOK.md` for the complete acceptance process.

## Production promotion

Production must use a separate Access application audience, service tokens, Tunnel token, database credentials, backup destination, and persistent volume. Do not reuse staging secrets.

Before changing the production hostname:

- every GitHub workflow passes on the final synchronized branch head
- protected browser tests pass against staging
- response headers are verified from the live staging hostname
- direct-origin access is unavailable
- Access denies an unapproved identity
- public enrichment succeeds only within the documented boundary
- private, local, and non-standard-port enrichment attempts are denied
- structured logs exclude request bodies, query strings, case titles, notes, identifiers, and provider payloads
- an encrypted off-host backup is verified
- rollback and temporary restore procedures are rehearsed
- the draft pull request is reviewed and approved

## Current limitations

- API rate limiting and adapter caches are in-process and are not shared between multiple application workers
- RDAP bootstrap and enrichment caches are discarded when the process restarts
- HTTP inspection uses `HEAD`; some endpoints may reject or implement it differently from `GET`
- HTTP/2 and HTTP/3 response-header negotiation are not implemented in the direct inspection adapter
- Certificate Transparency collection currently uses `crt.sh`
- BGP and RPKI adapters are not implemented yet
- deep metadata parsing, OCR, malware scanning, and durable object storage remain isolated future workers
- live Cloudflare Access, Tunnel, backup, and rollback acceptance still requires protected staging infrastructure
