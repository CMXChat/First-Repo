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


## What to learn next

You do not need to learn everything at once. Learn these ideas in this order by changing the system you now have.

### 1. Frontend and backend

The frontend is the HTML, CSS, and JavaScript running in the visitor's browser. It controls appearance and sends requests, but its downloaded source cannot hold secrets.

The backend is the Python application running on a server. It can safely use database connections and provider credentials because those values are not sent to the browser.

**Practice:** Change the message returned by the Python test endpoint and watch the pythontest page display the new response.

### 2. Requests, routes, JSON, and status codes

A browser request has a method and path, such as POST /api/v1/login/homepage-access. Python matches that route, validates the supplied data, performs work, and sends a response.

JSON is the common data format used between JavaScript and Python. Status 200 means success, 401 means login failed, 403 means the logged-in user lacks permission, and 500 means the server encountered an error.

**Practice:** Open the browser Network panel during login and identify the request path, status code, request JSON, and response JSON. Never copy an access token into notes or screenshots.

### 3. HTTPS and CORS

HTTPS encrypts the password while it travels between the browser and backend. CORS is a browser rule controlling which website origins may call the API.

The backend currently allows the exact https://db.cmxchat.com origin. CORS is not authentication: every private endpoint must still validate the token and permission.

### 4. Password hashing

A password must not be stored as readable text. Argon2 turns it into a slow, salted hash. At login, Python verifies the entered password against that stored hash.

Hashing is one-way verification, not encryption. Password strength still matters because attackers can guess common passwords.

**Practice:** Review backend/app/core/security.py and backend/app/crud.py without printing hashes or passwords.

### 5. Users and PostgreSQL

A user is a database record containing identity and permission fields plus the password hash. PostgreSQL provides durable private storage; the browser should never connect to it directly.

Database migrations describe controlled schema changes. Application code should use SQLModel sessions and typed models instead of placing SQL credentials or queries in a webpage.

**Practice:** Create a development-only user and inspect only safe fields such as email, active state, and role.

### 6. Authentication and authorization

Authentication answers, “Who are you?” Authorization answers, “What may this user do?” A correct password should not automatically permit every operation.

The homepage requires the configured account to be active and an administrator. Future private records also need ownership or role checks on every backend route.

**Practice:** Create a normal non-administrator test user and verify that administrator-only routes reject that account.

### 7. Tokens and sessions

After login, Python signs a JWT containing identity and expiration information. The homepage keeps it in sessionStorage, sends it as a Bearer token, and asks Python to validate it again.

A token is temporary proof, not a password. It should be short-lived, sent only over HTTPS, removed during logout or locking, and never logged or committed.

**Practice:** Log in, refresh, lock the terminal, and observe session behavior. Then confirm expiration requires another login.

### 8. Static files versus protected information

A GitHub Pages file is public even if CSS or JavaScript hides it until login. Developer tools, raw GitHub files, or direct asset URLs can reveal static content.

Private information is protected from unauthenticated visitors only when it never enters the static repository and Python returns it only after verifying the user and permission.

**Practice:** Build one harmless private note in PostgreSQL, return it through an authenticated endpoint, and confirm its text cannot be found in First-Repo.

### 9. Environment variables and secrets

SMTP app passwords, database credentials, and JWT signing keys belong in encrypted hosting or Codespaces secrets. A committed .env file, frontend variable, screenshot, chat transcript, or document is not a secret store.

Frontend build variables can be bundled into public JavaScript. Provider secrets must stay backend-only.

### 10. Deployment and uptime

The Codespaces backend is temporary. If it stops or port 8000 becomes private, homepage login stops working.

Production needs a stable HTTPS hostname, continuous runtime, deployment secrets, database access, logs, monitoring, backups, and rollback.

**Practice:** Deploy staging first and verify login, CORS, database access, token expiration, logs, and rollback before changing the live domain.

### 11. Testing safely

Tests need a separate test database. The current repository fixture deletes users at teardown, which is useful for isolated tests but dangerous against real data.

Unit tests check small behaviors, integration tests check API and database behavior together, and browser tests check the complete user flow.

**Practice:** Create a dedicated test database before running the full backend suite again.

### 12. Email with Zoho

SMTP lets Python send email through Zoho. Use a Zoho app-specific password, never the normal mailbox password. Store it only as a backend environment secret.

Email automation also needs a defined event, approved recipients, templates, deduplication, retries, rate limits, audit records, failure alerts, and an emergency disable switch.

**Practice:** Configure a staging sender, send one test message to yourself, record the result without recording the credential, and only then build one narrow event such as a welcome email.

### Recommended learning sequence

1. Change the Python test message.
2. Watch login in the Network panel.
3. Read the authentication route and password-hashing functions.
4. Create a non-admin development user.
5. Build one authenticated private-note endpoint.
6. Move one test value out of static HTML and into PostgreSQL.
7. Set up a separate test database.
8. Deploy jay-app to stable staging.
9. Configure a Zoho app password in staging secrets.
10. Send one audited test email.
11. Add one simple event-driven email rule.
12. Migrate additional gates and private content one page at a time.

The most important rule is simple: **design can live in public frontend files; secrets and private user data must stay behind authenticated backend authorization.**
