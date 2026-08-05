#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /path/to/backup.dump" >&2
  exit 2
fi

BACKUP_FILE="$(realpath "$1")"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

if [[ ! -r "${BACKUP_FILE}" || ! -s "${BACKUP_FILE}" ]]; then
  echo "Backup file is missing, unreadable, or empty." >&2
  exit 1
fi

if [[ -f "${CHECKSUM_FILE}" ]]; then
  (cd "$(dirname "${BACKUP_FILE}")" && sha256sum --check "$(basename "${CHECKSUM_FILE}")")
else
  echo "Warning: checksum file not found at ${CHECKSUM_FILE}" >&2
fi

cd "${BACKEND_DIR}"
docker compose exec -T db pg_restore --list < "${BACKUP_FILE}" >/dev/null

echo "Backup archive is readable and its table-of-contents can be parsed."
