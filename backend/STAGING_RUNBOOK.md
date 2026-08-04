# CMX Restricted Node Staging Runbook

## Goal

Deploy the migration branch to a dedicated Linux staging host behind Cloudflare Access and an outbound-only Cloudflare Tunnel. Production must remain unchanged until this runbook passes in full.

## Required inputs

- dedicated staging hostname, such as `db-staging.cmxchat.com`
- Linux host with Docker Engine and the Compose plugin
- Cloudflare Access self-hosted application covering the full staging hostname
- staging-only Access application audience
- staging-only Tunnel token
- long random PostgreSQL password
- encrypted off-host location for backups

Do not commit any of these values to GitHub.

## Server preparation

1. Create a non-root deployment account.
2. Install Docker Engine and Docker Compose from the operating-system or Docker vendor packages.
3. Clone the repository into a directory owned by the deployment account.
4. Check out `agent/osint-platform-hardening`.
5. Copy `backend/.env.example` to `backend/.env`.
6. Restrict the environment file:

```bash
chmod 600 backend/.env
```

7. Set staging values:

```dotenv
CMX_ENVIRONMENT=staging
CMX_AUTH_MODE=cloudflare
CMX_CLOUDFLARE_ACCESS_TEAM_DOMAIN=https://your-team.cloudflareaccess.com
CMX_CLOUDFLARE_ACCESS_AUDIENCE=staging-application-aud
CMX_ALLOWED_HOSTS_CSV=db-staging.cmxchat.com,localhost,127.0.0.1
POSTGRES_USER=cmx
POSTGRES_PASSWORD=long-random-staging-password
POSTGRES_DB=cmx
CLOUDFLARE_TUNNEL_TOKEN=staging-tunnel-token
```

The Compose file supplies the PostgreSQL connection URL to the application and disables runtime table creation.

## Cloudflare configuration

1. Create a self-hosted Access application for `db-staging.cmxchat.com/*`.
2. Add only approved identities or groups.
3. Leave unmatched identities denied.
4. Create a separate service token for automated staging smoke tests.
5. Create a remotely managed Tunnel.
6. Route the staging hostname to `http://app:8000`.
7. Do not create a public inbound firewall rule for port 8000 or 5432.
8. Keep staging and production Access applications, audiences, service tokens, and Tunnel tokens separate.

## First deployment

From `backend/`:

```bash
docker compose --profile tunnel pull
docker compose --profile tunnel build --pull app
docker compose --profile tunnel up -d db app cloudflared
```

The application container runs `alembic upgrade head` before starting FastAPI.

Inspect status:

```bash
docker compose ps
docker compose logs --tail=200 app
docker compose logs --tail=100 cloudflared
```

## Required validation

### Access boundary

- An incognito browser receives the Cloudflare Access login before CMX HTML.
- An unapproved identity is denied.
- An approved identity can open `/directory`, `/cases`, and all approved tools.
- `/api/whoami` reports the expected Access identity.
- Direct access to the server IP does not return the application.

### Application boundary

- `/api/health/live` returns `200` through the local container network.
- `/api/health/ready` returns database status `ready` for an authenticated request.
- Staging refuses startup if Cloudflare auth variables, PostgreSQL, or migration mode are incorrect.
- State-changing cross-site requests are rejected after the write-security middleware is enabled.

### Functional validation

- Create a disposable case in `/cases`.
- Import one JSON export from each CMX tool.
- Verify entities, observations, sources, queries, evidence registrations, relationships, and notes.
- Verify audit history does not include research text.
- Soft-delete the disposable case.
- Restore it with the exact case ID.
- Soft-delete it again and permanently purge only the disposable record.
- Run OSINT DNS and confirm the browser uses `/api/dns`.
- Test desktop and mobile layouts.

### Response headers

Verify at minimum:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `X-Frame-Options: DENY`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cache-Control: no-store` for HTML and APIs

### Logs

Confirm logs include request ID, path, method, status, duration, event, and authenticated subject. Confirm logs exclude query strings, request bodies, entered identifiers, case titles, notes, and file contents.

## Backup validation

Create a backup:

```bash
chmod +x scripts/*.sh
./scripts/backup_postgres.sh
```

Move the `.dump` and `.sha256` files to encrypted storage outside the server.

Validate the archive:

```bash
./scripts/verify_postgres_backup.sh /path/to/cmx-backup.dump
```

Test a temporary restore:

```bash
CMX_RESTORE_CONFIRM=RESTORE ./scripts/restore_postgres.sh /path/to/cmx-backup.dump
```

The restore script validates into a temporary database and deliberately does not replace the live database.

## Update procedure

1. Create a fresh backup.
2. Pull the reviewed branch or approved commit.
3. Build the new image.
4. Run repository tests before deployment.
5. Start `db` and apply migrations through the application startup command.
6. Confirm readiness.
7. Start or restart the Tunnel.
8. Run browser and service-token smoke tests.
9. Review logs.

## Rollback

Application rollback:

1. Keep the previous image tag or commit available.
2. Stop `app` and `cloudflared`.
3. Check out the previous approved commit.
4. Build and start the previous image.
5. Do not downgrade the database until the migration impact has been reviewed.

Database rollback:

- Prefer a forward repair migration.
- Use `alembic downgrade` only when the exact migration is documented as reversible and no newer data depends on it.
- Restore from backup only during a declared maintenance window after a temporary restore test passes.

## Promotion gate

Production promotion is blocked until:

- every GitHub workflow passes on the final commit
- staging Access denial and identity tests pass
- direct origin isolation is confirmed
- desktop and mobile browser tests pass against staging
- backup and temporary restore validation pass
- response headers and logs are reviewed
- rollback is rehearsed
- PR #28 is reviewed and approved
