# CMX Restricted Node Backend

This directory contains the FastAPI origin that will replace GitHub Pages for `db.cmxchat.com`.

## Current scope

- serves the approved static routes and shared assets from the repository
- validates Cloudflare Access application JWTs in staging and production
- exposes health and identity endpoints
- provides a same-origin DNS gateway with validation, timeouts, normalized output, and a short in-process cache
- applies baseline response headers and a per-process API safety limit
- contains no persistent case database yet

## Security boundary

The browser passphrase remains interface design only. Real access control requires both:

1. A Cloudflare Access self-hosted application covering the full staging or production hostname.
2. `CMX_AUTH_MODE=cloudflare` at the origin so the FastAPI middleware validates the `Cf-Access-Jwt-Assertion` signature, issuer, audience, issue time, and expiry.

Do not expose port 8000 to the public internet. The supplied Compose file binds it to `127.0.0.1` for local administration and provides an optional outbound-only `cloudflared` profile.

Official references:

- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/
- https://developers.cloudflare.com/tunnel/
- https://fastapi.tiangolo.com/deployment/docker/

## Local development

```bash
cd backend
cp .env.example .env
python3.14 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
fastapi dev app/main.py
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
docker compose up --build app
```

Verify:

```bash
curl http://127.0.0.1:8000/api/health/live
curl -H 'X-CMX-Dev-User: operator@example.test' http://127.0.0.1:8000/api/whoami
```

## Staging deployment

Use a dedicated hostname such as `db-staging.cmxchat.com`.

1. Create a Cloudflare Access self-hosted application covering the entire staging hostname.
2. Add allow policies for the approved identities and leave unmatched users denied.
3. Copy the Access team domain and application audience tag into `.env`.
4. Create a Cloudflare Tunnel whose public hostname routes to `http://app:8000`.
5. Put the remotely managed tunnel token in `CLOUDFLARE_TUNNEL_TOKEN`.
6. Set:

```dotenv
CMX_ENVIRONMENT=staging
CMX_AUTH_MODE=cloudflare
CMX_CLOUDFLARE_ACCESS_TEAM_DOMAIN=https://your-team.cloudflareaccess.com
CMX_CLOUDFLARE_ACCESS_AUDIENCE=your-application-aud
CMX_ALLOWED_HOSTS_CSV=db-staging.cmxchat.com,localhost,127.0.0.1
```

7. Start the origin and tunnel:

```bash
docker compose --profile tunnel up -d --build
```

8. Confirm the hostname shows the Access login before any CMX HTML is returned.
9. After authentication, verify `/api/whoami`, `/api/health/ready`, `/api/dns?name=example.com&type=A`, and every approved tool route.
10. Review container logs and Cloudflare Access logs before production promotion.

## Production promotion

Production should use a separate Access application audience and a separate Tunnel token. Do not reuse staging secrets.

Before changing the production hostname:

- all GitHub checks pass
- browser-level tests pass against staging
- response headers are verified from the live staging hostname
- direct origin access is unavailable
- Access denies an unapproved identity
- backups and rollback steps are documented
- the draft pull request has been reviewed and approved

## Known limitations

- rate limiting and DNS caching are in-process and are not shared between multiple application workers
- case, evidence, and observation records are still browser-session exports
- provider gateways beyond DNS are not implemented
- PostgreSQL, Redis, object storage, malware scanning, OCR workers, and durable audit logs remain future phases
