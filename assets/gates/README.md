# CMX Gate Design Library

## Black Prompt Gate

**Library ID:** `black-prompt`  
**Name to use in requests:** **Black Prompt Gate**  
**Preview:** `/gate-library/black-prompt/`

The gate is an intentionally empty, full-screen black command prompt. Before submission, the only visible interface is:

```text
password: 
```

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

### Static-site limitation

This is a client-side gate for the current static GitHub Pages architecture. It discourages ordinary access but cannot provide real server-side secrecy because the browser receives the page assets. Use Cloudflare Access or the planned FastAPI backend for true access control.
