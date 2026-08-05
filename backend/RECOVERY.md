# CMX PostgreSQL Recovery Procedure

## Canonical commands

Use these scripts for routine backup and restore validation:

```bash
cd backend
chmod +x scripts/*.sh
./scripts/backup_postgres.sh
./scripts/verify_postgres_backup.sh /encrypted/path/cmx-backup.dump
./scripts/validate_postgres_restore.sh /encrypted/path/cmx-backup.dump
```

`validate_postgres_restore.sh` is the canonical restore test. It creates a uniquely named temporary database, restores the archive, verifies the Alembic version and core `cases` table, then removes the temporary database. It does not stop the application and does not alter the live database.

## Backup handling

- keep the `.dump` and matching `.sha256` file together
- move both files off the application host
- store them in encrypted storage with restricted access
- keep staging and production backups separate
- record the source environment, commit, migration version, timestamp, and operator in the backup inventory
- never commit a backup, checksum, environment file, database password, Access token, or Tunnel token

## Live restore policy

There is intentionally no script that automatically replaces the live database.

A live restore requires a declared maintenance window and an approved plan covering:

1. the exact target environment
2. the backup checksum and temporary restore-validation result
3. the application commit and Alembic migration version
4. the current live backup taken immediately before maintenance
5. the expected data-loss window
6. the rollback owner
7. the Access and Tunnel maintenance behavior
8. the post-restore identity, API, case, import, audit, and browser checks

Prefer a forward repair migration when the database is structurally healthy. Use a full restore only for confirmed corruption, unrecoverable operator error, or an approved disaster-recovery exercise.

## Maintenance outline

1. Announce the maintenance window.
2. Create and verify a fresh live backup.
3. Run `validate_postgres_restore.sh` against the intended restore archive.
4. Stop the application and Tunnel only after validation passes.
5. Restore into a new database name.
6. Run Alembic and integrity checks against the restored database.
7. Point the application to the restored database through a controlled environment change.
8. Start the application locally and verify readiness.
9. Start the Tunnel and verify Cloudflare Access.
10. Run the Platform staging acceptance workflow or the equivalent production smoke set.
11. Preserve the former database until the approved rollback window closes.

## Required post-restore checks

- `/api/health/ready` reports database readiness
- `/api/whoami` returns the expected Access identity
- `/cases` lists only records owned by that identity
- one known case can be read with its linked records
- `/cases/lifecycle` can load retention, deleted, and audit data
- a disposable case can be created, soft-deleted, restored, soft-deleted again, and purged
- DNS gateway requests complete
- response headers remain intact
- logs contain no research content or secrets

## Deprecated helper

`restore_postgres.sh` was an early validation helper. Do not use it for routine validation because it stops application services before restoring into a temporary database. It will be removed or replaced before the PR becomes ready for review.
