# Homepage backend authentication migration

**Date:** 2026-08-14  
**Scope:** Only the main page at `https://db.cmxchat.com/`

## What changed

The homepage used to verify its fixed password entirely inside public JavaScript. The readable password was not committed, but the browser received a PBKDF2 salt and verifier. Because both values were public, someone could download them and guess passwords offline without contacting the server.

The current homepage no longer contains the fixed salt, verifier, password hash, or password comparison. The password itself is not written in this document or in the public repository.

## How login works now

1. The visitor enters the password into the homepage form.
2. `assets/cmx-auth-policy.js` sends that password over HTTPS to the jay-app endpoint:
   `POST /api/v1/login/homepage-access`.
3. Python looks up the configured first-superuser account in PostgreSQL.
4. The existing jay-app security code verifies the submitted password against the account's Argon2 password hash.
5. Login succeeds only when that account exists, is active, and is an administrator.
6. Python returns a signed JWT that expires after 30 minutes.
7. The browser stores the token in `sessionStorage`, which is scoped to the current browser tab.
8. When the page reloads, it calls `GET /api/v1/login/homepage-session` with the token. Python checks the signature, expiration, account, and administrator role before restoring the interface.
9. Locking the console removes the tab token and returns to the password form.

## Files changed

### CMXChat/jay-app

- `backend/app/api/routes/login.py`: added the homepage login and session-validation endpoints.
- `backend/app/models.py`: added the password-only homepage login request model.
- `backend/app/core/config.py`: added a 30-minute homepage token lifetime.
- `backend/app/main.py`: restored the configured CORS allowlist instead of allowing every website.
- `backend/tests/api/routes/test_login.py`: added success, wrong-password, and session-validation tests.
- `specs/002-homepage-backend-auth/`: records requirements and acceptance criteria.

### CMXChat/First-Repo

- `assets/cmx-auth-policy.js`: replaced browser-side password verification with calls to jay-app.
- `assets/cmx-ops-runtime.js`: validates a saved tab token with Python during page startup.
- `index.html`: permits HTTPS requests only to the current backend origin and refreshes the authentication script version.
- This document records the migration.

## Where the password is stored

PostgreSQL stores only an Argon2 password hash in the `user.hashed_password` field. Argon2 is intentionally expensive to calculate, which makes stolen database hashes harder to guess. The backend receives the entered password over HTTPS, compares it using the password-hashing library, and does not return or store the plaintext password.

The database password used for this migration does not match the retired public homepage verifier. The retired verifier can remain visible in old Git commits, so its old password should never be reused.

## What was tested

The backend login test suite verifies:

- the correct administrator password returns a token;
- an incorrect password returns a generic `Access denied` response;
- an administrator token can validate the homepage session;
- the existing login and password-reset tests continue to pass.

The changed Python files also pass Ruff lint and formatting checks. The live site and API were checked after publishing: valid login returned a token, the token validated, an incorrect password was denied, and CORS allowed `https://db.cmxchat.com` specifically rather than every website.

The repository's existing test fixture deletes users when its test session finishes. In this environment the tests were connected to the configured database, so the administrator account was restored immediately afterward and its login was verified. Do not point this test suite at production data; use a separate test database before running it in a production environment.

## Important limitation

GitHub Pages is static hosting. Its HTML, CSS, JavaScript, and interface content are public files even when JavaScript displays a password gate. This migration protects the password and makes backend authorization real, but it cannot make static homepage content secret.

Any truly private information must live behind authenticated jay-app endpoints and be returned only after Python authorizes the token.

This work intentionally changed only the root homepage. Other browser-only gates were not migrated. In particular, the separate vault gate still contains its existing client-side verifier and needs its own future backend migration before it should be treated as secure.

## Current temporary backend address

The homepage currently calls the Codespaces port-8000 address. The Codespace must be running and the port must be public for login to work. This is suitable for learning and development, not permanent production hosting.

The next production step is to deploy jay-app at a stable address such as `https://api.cmxchat.com`, update the homepage API constant and Content Security Policy, and add server or edge rate limiting for repeated login failures.


## Visual login sequence

The secure backend migration originally reduced the gate feedback to one plain verification message. The terminal-style experience was restored on 2026-08-14 without moving authentication back into the browser.

The current gate displays animated lines for channel preparation, HTTPS connection, the request to Python, password-hash verification, administrator-role verification, token issuance, denial, and backend outages. These lines describe actual stages and do not decide access. Only a successful backend response and signed administrator token can launch the interface.

The animation uses DOM text nodes rather than inserting server responses as HTML. This prevents authentication error text from becoming executable page content.

## What is and is not hidden after login

The root interface is still hosted by GitHub Pages. Its HTML, CSS, JavaScript, labels, terminal commands, and links can be downloaded without logging in, even when the visual gate hides them. The gate must not be described as encryption for static source.

The following can be genuinely protected:

- passwords stored only as backend password hashes;
- database records that never appear in the static repository;
- API responses returned only after Python validates the token, user, role, ownership, and requested operation;
- provider credentials stored only as deployment environment secrets.

Therefore, future private user information must be stored in PostgreSQL or another private backend service and requested after login. It must never be committed into a static page and merely hidden with CSS or JavaScript.

## Password rotation

The homepage administrator password was rotated again on 2026-08-14. The replacement password is intentionally omitted from GitHub and this document. PostgreSQL contains only its Argon2 hash, and live checks confirmed that the replacement works while the previous password is rejected.

## Planned Zoho email connection

The intended sending mailbox is `team@cmxchat.com` on Zoho Mail. Email sending is not connected yet.

When enabled, jay-app can use its existing SMTP settings and email helper. The safe setup is:

- use Zoho's SMTP host and TLS port;
- use `team@cmxchat.com` as the SMTP username and sender;
- create a Zoho app-specific password instead of sharing or storing the normal mailbox password;
- save the app password only in the backend deployment's encrypted environment secrets;
- never put the app password in GitHub, HTML, JavaScript, documentation, chat-visible examples, or PostgreSQL application records;
- begin with a test email, then add narrowly defined event rules, recipient controls, audit records, retry limits, and an emergency disable switch.

Automated email should remain disabled until the stable backend deployment exists and the app-specific credential is configured.
