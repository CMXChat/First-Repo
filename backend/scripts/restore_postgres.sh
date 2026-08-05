#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: CMX_RESTORE_CONFIRM=RESTORE $0 /path/to/backup.dump" >&2
  exit 2
fi

if [[ "${CMX_RESTORE_CONFIRM:-}" != "RESTORE" ]]; then
  echo "Restore refused. Set CMX_RESTORE_CONFIRM=RESTORE after reviewing the target environment." >&2
  exit 1
fi

BACKUP_FILE="$(realpath "$1")"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
DATABASE="${POSTGRES_DB:-cmx}"
USER_NAME="${POSTGRES_USER:-cmx}"
TEMP_DATABASE="${DATABASE}_restore_$(date -u +%Y%m%d%H%M%S)"

if [[ ! -r "${BACKUP_FILE}" || ! -s "${BACKUP_FILE}" ]]; then
  echo "Backup file is missing, unreadable, or empty." >&2
  exit 1
fi

cd "${BACKEND_DIR}"
"${SCRIPT_DIR}/verify_postgres_backup.sh" "${BACKUP_FILE}"

echo "Stopping application and tunnel services before restore."
docker compose stop app cloudflared 2>/dev/null || true

cleanup() {
  docker compose exec -T db dropdb --if-exists --username="${USER_NAME}" "${TEMP_DATABASE}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "Restoring into temporary validation database ${TEMP_DATABASE}."
docker compose exec -T db createdb --username="${USER_NAME}" "${TEMP_DATABASE}"
docker compose exec -T db pg_restore \
  --username="${USER_NAME}" \
  --dbname="${TEMP_DATABASE}" \
  --no-owner \
  --no-acl \
  --exit-on-error \
  < "${BACKUP_FILE}"

docker compose exec -T db psql \
  --username="${USER_NAME}" \
  --dbname="${TEMP_DATABASE}" \
  --tuples-only \
  --command="SELECT COUNT(*) FROM alembic_version;" >/dev/null

printf '\nTemporary restore validation passed.\n'
printf 'This script does not replace the live database automatically.\n'
printf 'Promote the validated database only through the documented maintenance procedure.\n'
