#!/usr/bin/env bash
set -euo pipefail

umask 077

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
BACKUP_DIR="${CMX_BACKUP_DIR:-${BACKEND_DIR}/backups}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DATABASE="${POSTGRES_DB:-cmx}"
USER_NAME="${POSTGRES_USER:-cmx}"
BACKUP_FILE="${BACKUP_DIR}/cmx-${DATABASE}-${TIMESTAMP}.dump"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"

mkdir -p "${BACKUP_DIR}"
cd "${BACKEND_DIR}"

if ! docker compose ps --status running db | grep -q 'db'; then
  echo "The PostgreSQL service is not running." >&2
  exit 1
fi

echo "Creating PostgreSQL custom-format backup: ${BACKUP_FILE}"
docker compose exec -T db \
  pg_dump \
    --username="${USER_NAME}" \
    --dbname="${DATABASE}" \
    --format=custom \
    --compress=9 \
    --no-owner \
    --no-acl \
  > "${BACKUP_FILE}"

if [[ ! -s "${BACKUP_FILE}" ]]; then
  echo "Backup file is empty." >&2
  rm -f "${BACKUP_FILE}"
  exit 1
fi

docker compose exec -T db pg_restore --list < "${BACKUP_FILE}" >/dev/null
sha256sum "${BACKUP_FILE}" > "${CHECKSUM_FILE}"

printf 'Backup complete.\nFile: %s\nChecksum: %s\n' "${BACKUP_FILE}" "${CHECKSUM_FILE}"
printf 'Move both files to encrypted storage outside this server.\n'
