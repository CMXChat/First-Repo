# CMX Gate Design Library

**Canonical system handoff:** `docs/concepts/cmx-gates-system-ai-handoff-2026-08-04.md`

The gate library records the visual access patterns available for `db.cmxchat.com` pages. These interfaces currently use client-side password verification and should be treated as deterrents, not server-side security boundaries.

## Current library inventory

| Library ID | Request name | Status | Current use |
|---|---|---|---|
| `restricted-node` | **Restricted Node Gate** | Active, root-integrated | Root `/index.html` and restricted terminal |
| `black-prompt` | **Black Prompt Gate** | Active, reusable | Drop-in page gate and `/gate-library/black-prompt/` preview |

The machine-readable inventory is `assets/gates/library.json`.

## Restricted Node Gate

**Library ID:** `restricted-node`  
**Name to use in requests:** **Restricted Node Gate**  
**Current route:** `/`  
**Portability:** Root-specific until its markup, terminal runtime, and authentication dependencies are extracted

This is the blue CMX boot, authentication, and terminal experience used on the repository root.

Primary files:

```text
index.html
assets/cmx-terminal.css
assets/cmx-ops-core.js
assets/cmx-auth-policy.js
assets/cmx-ops-site.js
assets/cmx-ops-intel.js
assets/cmx-ops-runtime.js
```

The authentication policy depends on helpers and session behavior from `cmx-ops-core.js`. Do not copy `cmx-auth-policy.js` into another page and assume it is a self-contained gate.

Use this request wording:

```text
Gate the root page with the Restricted Node Gate.
Rotate the Restricted Node Gate credential.
Keep the Restricted Node Gate design and update its terminal routes.
```

## Black Prompt Gate

**Library ID:** `black-prompt`  
**Name to use in requests:** **Black Prompt Gate**  
**Preview:** `/gate-library/black-prompt/`

The gate is an intentionally empty, full-screen black command prompt. Before submission, the only visible interface is:

```text
password: 
```

It has no logo, panel, border, visible button, title bar, instructions, or decoration.

The fixed password is verified with PBKDF2-SHA256 using a random salt and 600,000 iterations. The plaintext password is not stored in the repository. Failed attempts are rate-limited in browser storage.

### Add it to a page

Declare the gate on the root element and load its stylesheet:

```html
<html lang="en" data-cmx-gate="black-prompt" data-cmx-gate-id="unique-page-scope">
<head>
  <link rel="stylesheet" href="/assets/gates/cmx-gate-black-prompt.css" />
</head>
```

Wrap protected page content:

```html
<body class="cmx-black-prompt-locked">
  <main data-cmx-gated-content hidden>
    <!-- Protected page UI -->
  </main>

  <script src="/assets/gates/cmx-gate-black-prompt.js" defer></script>
</body>
```

### Optional attributes

- `data-cmx-gate-id="scope-name"` shares one session unlock across pages using the same scope.
- `data-cmx-gate-always-prompt="true"` requires the prompt again on every page load.
- `data-cmx-gate-delay="700"` controls the successful loading-sequence delay in milliseconds.
- `data-cmx-gate-redirect="/target/"` redirects after successful authentication instead of revealing wrapped content.

Use this request wording:

```text
Gate /phone with the Black Prompt Gate.
Use the Black Prompt Gate and redirect to /brief after authentication.
Keep the Black Prompt Gate completely minimal.
```

## Credential rotation rules

Never store or compare a plaintext credential in repository code.

When rotating either current gate:

1. Generate a new cryptographically random salt.
2. Derive a 256-bit PBKDF2-HMAC-SHA256 verifier with 600,000 iterations.
3. Replace the encoded salt and verifier only.
4. Bump state or migration versions when stale lockouts or sessions must be invalidated.
5. Cache-bust the consuming script URL when needed.
6. Verify the new credential succeeds and the old one fails.
7. Confirm no plaintext credential appears anywhere in the diff.

Root rotation files:

```text
assets/cmx-auth-policy.js
index.html
```

Black Prompt rotation file:

```text
assets/gates/cmx-gate-black-prompt.js
```

## Adding a new design

An implemented gate should include:

- A stable lowercase hyphenated library ID.
- A human-readable request name ending in `Gate`.
- Isolated styles and behavior.
- A documented markup or data-attribute contract.
- A preview route when practical.
- A manifest entry in `library.json`.
- Documentation here and in the canonical handoff file.
- Mobile, keyboard, lockout, session, and wrong-password validation.

Do not list a proposed design as implemented until its files and preview exist.

## Static-site limitation

These are client-side gates for the current static GitHub Pages architecture. They discourage ordinary access but cannot provide real server-side secrecy because the browser receives the page assets.

Use Cloudflare Access or the planned FastAPI backend for true access control. The visual gate can remain as the interface while the edge or backend becomes the actual enforcement layer.
