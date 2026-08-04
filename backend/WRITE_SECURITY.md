# State-Changing API Write Security

## Entry point

Staging and production should run `app.hardened:app`, not the unwrapped `app.main:app` object.

The secure Compose override is:

```bash
docker compose \
  --file compose.yml \
  --file compose.secure.yml \
  --profile tunnel \
  up -d --build
```

The hardened entry point wraps FastAPI with a small ASGI middleware before route handling.

## Enforced policy

For `POST`, `PUT`, `PATCH`, and `DELETE` requests below `/api/`:

- `Sec-Fetch-Site` must be absent, `same-origin`, or `none`
- `cross-site` and `same-site` browser writes are rejected
- when an `Origin` header is present, its host must exactly match the request `Host`
- `POST`, `PUT`, and `PATCH` must use `Content-Type: application/json`
- declared request bodies above 2.5 MB are rejected
- bodyless `DELETE` requests remain supported

This policy complements Cloudflare Access, authenticated origin JWT validation, no CORS configuration, Pydantic request validation, per-subject API rate limits, and the 2 MB CMX import-schema limit.

## Client behavior

The Cases client already uses:

```http
Content-Type: application/json
X-CMX-Requested-With: cases-workbench
```

Normal same-origin browser fetches also provide `Sec-Fetch-Site: same-origin` and an origin matching the protected host.

## Tests

`backend/tests/test_write_security.py` covers:

- accepted same-origin JSON writes
- rejected cross-site writes
- rejected same-site sibling-origin writes
- rejected form-encoded writes
- rejected declared oversized writes
- accepted bodyless DELETE requests

## Reverse proxy requirement

The application trusts proxy headers only when the deployment path is the private Cloudflare Tunnel. Do not expose the application port publicly while using unrestricted forwarded-header trust.
