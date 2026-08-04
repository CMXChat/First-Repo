#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /path/to/backup.dump" >&2
  exit 2
fi

BACKUP_FILE="$(realpath "$1")"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
DATABASE="${POSTGRES_DB:-cmx}"
USER_NAME="${POSTGRES_USER:-cmx}"
TEMP_DATABASE="${DATABASE}_validation_$(date -u +%Y%m%d%H%M%S)_$$"

if [[ ! -r "${BACKUP_FILE}" || ! -s "${BACKUP_FILE}" ]]; then
  echo "Backup file is missing, unreadable, or empty." >&2
  exit 1
fi

cd "${BACKEND_DIR}"
"${SCRIPT_DIR}/verify_postgres_backup.sh" "${BACKUP_FILE}"

cleanup() {
  docker compose exec -T db dropdb \
    --if-exists \
    --force \
    --username="${USER_NAME}" \
    "${TEMP_DATABASE}" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

echo "Creating isolated validation database ${TEMP_DATABASE}."
docker compose exec -T db createdb \
  --username="${USER_NAME}" \
  "${TEMP_DATABASE}"

echo "Restoring the archive into the isolated validation database."
docker compose exec -T db pg_restore \
  --username="${USER_NAME}" \
  --dbname="${TEMP_DATABASE}" \
  --no-owner \
  --no-acl \
  --exit-on-error \
  < "${BACKUP_FILE}"

echo "Checking migration state and core tables."
docker compose exec -T db psql \
  --username="${USER_NAME}" \
  --dbname="${TEMP_DATABASE}" \
  --set=ON_ERROR_STOP=1 \
  --tuples-only \
  --command="SELECT version_num FROM alembic_version;" >/dev/null

docker compose exec -T db psql \
  --username="${USER_NAME}" \
  --dbname="${TEMP_DATABASE}" \
  --set=ON_ERROR_STOP=1 \
  --tuples-only \
  --command="SELECT COUNT(*) FROM cases;" >/dev/null

echo "Restore validation passed. The live application and database were not stopped or modified."
