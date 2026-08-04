#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${BACKEND_DIR}/.env"
COMPOSE=(
  docker compose
  --env-file "${ENV_FILE}"
  --file "${BACKEND_DIR}/compose.yml"
  --file "${BACKEND_DIR}/compose.platform.yml"
)

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}. Copy .env.example and add staging-only secrets." >&2
  exit 1
fi

chmod 600 "${ENV_FILE}"

required_values=(
  CMX_ENVIRONMENT
  CMX_AUTH_MODE
  CMX_CLOUDFLARE_ACCESS_TEAM_DOMAIN
  CMX_CLOUDFLARE_ACCESS_AUDIENCE
  POSTGRES_USER
  POSTGRES_PASSWORD
  POSTGRES_DB
  CLOUDFLARE_TUNNEL_TOKEN
)
for key in "${required_values[@]}"; do
  value="$(grep -E "^${key}=" "${ENV_FILE}" | tail -1 | cut -d= -f2- || true)"
  if [[ -z "${value}" ]]; then
    echo "Missing required staging value: ${key}" >&2
    exit 1
  fi
done

if ! grep -Eq '^CMX_ENVIRONMENT=staging$' "${ENV_FILE}"; then
  echo "CMX_ENVIRONMENT must be staging." >&2
  exit 1
fi
if ! grep -Eq '^CMX_AUTH_MODE=cloudflare$' "${ENV_FILE}"; then
  echo "CMX_AUTH_MODE must be cloudflare." >&2
  exit 1
fi

"${COMPOSE[@]}" config >/dev/null
"${COMPOSE[@]}" --profile tunnel pull
"${COMPOSE[@]}" --profile tunnel build --pull app
"${COMPOSE[@]}" --profile tunnel up -d db app cloudflared

for attempt in $(seq 1 40); do
  if curl --fail --silent http://127.0.0.1:8000/api/health/live >/dev/null; then
    "${COMPOSE[@]}" ps
    echo "Final platform staging is running with app.platform:app."
    echo "Run the Platform staging acceptance workflow before any production promotion."
    exit 0
  fi
  sleep 2
done

"${COMPOSE[@]}" logs --tail=200 app
exit 1
