# CMX Gate Library, `/brief` System Map, and AI Handoff

**Recorded:** August 4, 2026 at 3:25 PM EDT  
**Repository:** `CMXChat/First-Repo`  
**Deployment:** `https://db.cmxchat.com/`  
**Document type:** Current technical inventory, conventions, and future-context handoff  
**Status:** Living specification and implementation note

## 1. Why this document exists

This file gives future AI agents and developers one reliable starting point for understanding:

- The CMX gate design library.
- Every gate type currently implemented or cataloged.
- The difference between a visual gate and real access control.
- How credentials are verified and safely rotated without storing plaintext.
- The current root Restricted Node and terminal architecture.
- The current `/brief` product structure and its relationship to the gate system.
- Which work is complete, active, planned, or only conceptual.
- Which files own each behavior.
- Which existing documents should be read before changing the system.

This document does not contain plaintext credentials. Credentials must never be committed to repository documentation, HTML, JavaScript comments, examples, tests, or manifests.

## 2. Authority and source-of-truth order

When sources disagree, use this order:

1. Current deployed code on the repository default branch.
2. Current dated implementation/status documents.
3. Current design-library manifest and gate README.
4. Dated concept documents.
5. Older reports, conversations, mockups, and abandoned experiments.

Inspect the latest commits before modifying `/brief` because another development context may be actively changing its system files.

For the current `/brief` direction, read these documents together:

- `docs/concepts/brief-system-progress-roadmap-2026-08-04.md`
- `docs/concepts/brief-program-status-and-roadmap-2026-08-04.md`
- `docs/concepts/brief-goal-intelligence-concept-2026-08-04.md`
- This file: `docs/concepts/cmx-gates-system-ai-handoff-2026-08-04.md`

The two `/brief` status documents record overlapping assessments from separate work contexts. Do not silently choose one and ignore the other. Compare both against current code.

## 3. High-level repository map

```text
/
├── index.html
│   └── Root CMX Restricted Node gate and terminal shell
│
├── assets/
│   ├── cmx-terminal.css
│   ├── cmx-ops-core.js
│   ├── cmx-auth-policy.js
│   ├── cmx-ops-site.js
│   ├── cmx-ops-intel.js
│   ├── cmx-ops-runtime.js
│   │
│   ├── gates/
│   │   ├── library.json
│   │   ├── README.md
│   │   ├── cmx-gate-black-prompt.css
│   │   └── cmx-gate-black-prompt.js
│   │
│   └── brief/
│       ├── brief-system.js
│       ├── brief-system.css
│       ├── brief-system-fixes.css
│       ├── brief-terminal-bridge.js
│       └── existing briefing data, UI, compatibility, and test layers
│
├── gate-library/
│   └── black-prompt/
│       └── index.html
│
├── brief/
│   └── index.html
│
└── docs/
    └── concepts/
        ├── brief-goal-intelligence-concept-2026-08-04.md
        ├── brief-system-progress-roadmap-2026-08-04.md
        ├── brief-program-status-and-roadmap-2026-08-04.md
        └── cmx-gates-system-ai-handoff-2026-08-04.md
```

## 4. Gate vocabulary

A **gate** is the visual and browser-side authentication experience shown before a page or application is revealed.

A **gate theme** is the appearance and interaction pattern, such as the Restricted Node interface or the Black Prompt interface.

A **credential policy** defines how a candidate password is verified, how failed attempts are tracked, and how a session is recorded.

A **security boundary** is the actual enforcement layer that prevents unauthorized delivery of protected data. The current static gates are not true security boundaries because the browser still receives public site assets.

Use these exact names in future requests:

- **Restricted Node Gate**
- **Black Prompt Gate**

Example requests:

```text
Gate the root page with the Restricted Node Gate.
Gate /phone with the Black Prompt Gate.
Use the Black Prompt Gate and redirect to /brief after authentication.
Keep the Restricted Node Gate design but rotate its credential.
```

## 5. Current gate inventory

### 5.1 Restricted Node Gate

**Library ID:** `restricted-node`  
**Status:** Active and cataloged  
**Current use:** Root `/index.html`  
**Portability:** Root-integrated, not yet extracted into a drop-in theme  
**Preview route:** `/`

The Restricted Node Gate is the fuller blue CMX terminal experience. It includes:

- A boot sequence.
- A window-style authentication panel.
- A fixed `admin` user field.
- Password verification.
- Failed-attempt lockouts.
- A terminal application after unlock.
- Automatic session locking after inactivity.
- Commands and route links for research and operational pages.

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

The root authentication policy depends on utility functions and application behavior from `cmx-ops-core.js`. It must not be copied alone into an unrelated page.

Current root route definitions in `cmx-ops-core.js` include:

```text
/directory
/osint
/phone
/metadata
/resources
/missing
/search
```

Always inspect the current `ROUTES` object before documenting or changing the root terminal because routes may be added, renamed, or retired.

### 5.2 Black Prompt Gate

**Library ID:** `black-prompt`  
**Status:** Active and reusable  
**Current use:** Gate library preview and available for page integration  
**Portability:** Reusable static-page theme  
**Preview route:** `/gate-library/black-prompt/`

The Black Prompt Gate is intentionally almost empty. Before submission, the full viewport is black and the only visible interface is:

```text
password: 
```

It has no logo, card, border, title bar, help copy, visible button, page name, or decorative element.

Behavior:

- The password field receives focus automatically.
- Pressing Enter submits the password.
- A correct entry briefly prints access and loading feedback.
- A failed entry prints a minimal denial message.
- Protected elements are revealed after successful authentication.
- A page can redirect after authentication instead of revealing inline content.
- Sessions can be scoped by page or by a shared gate ID.
- A page can force the prompt on every load.

Primary files:

```text
assets/gates/cmx-gate-black-prompt.css
assets/gates/cmx-gate-black-prompt.js
gate-library/black-prompt/index.html
```

## 6. Gate library manifest

The machine-readable inventory is:

```text
assets/gates/library.json
```

Every implemented gate should be registered there with:

- Stable `id`.
- Human-readable `name`.
- Implementation `status`.
- Reusability level.
- Description.
- Relevant markup, stylesheet, script, or policy files.
- Preview route when one exists.
- Credential policy.
- Iteration count when applicable.
- Security-boundary warning.
- Documentation path.

Do not add a proposed design to the implemented `gates` list unless working code exists. Proposed designs belong in documentation until they are built.

## 7. Black Prompt integration contract

A consuming page declares the theme on the root element:

```html
<html
  lang="en"
  data-cmx-gate="black-prompt"
  data-cmx-gate-id="unique-page-scope">
```

Load the stylesheet:

```html
<link rel="stylesheet" href="/assets/gates/cmx-gate-black-prompt.css" />
```

Wrap protected content:

```html
<body class="cmx-black-prompt-locked">
  <main data-cmx-gated-content hidden>
    <!-- Page interface -->
  </main>

  <script src="/assets/gates/cmx-gate-black-prompt.js" defer></script>
</body>
```

Supported optional root attributes:

| Attribute | Purpose |
|---|---|
| `data-cmx-gate-id` | Defines the session scope. Pages sharing the same value share an unlock for that browser tab session. |
| `data-cmx-gate-always-prompt="true"` | Requires authentication again on every load. |
| `data-cmx-gate-delay="700"` | Sets the successful loading delay in milliseconds. |
| `data-cmx-gate-redirect="/target/"` | Redirects after successful authentication. |

The script exports:

```text
window.CMXGateLibrary.blackPrompt
```

Current public methods and metadata include:

- `id`
- `name`
- `lock()`

## 8. Credential verification policy

Both current gates use browser-side PBKDF2-SHA256 verification with:

- A random salt.
- 600,000 PBKDF2 iterations.
- A 256-bit derived verifier.
- Constant-time comparison.
- No plaintext password stored in repository code.

This makes the credential less obvious in source code. It does not convert a static site into a private application.

### 8.1 Root Restricted Node lockout policy

The current root policy uses:

- No timed lockout for the first four failures.
- A 30-second lockout beginning at five failures.
- A 300-second lockout beginning at ten failures.
- Browser-local failed-attempt state.
- A session record after successful authentication.
- A ten-minute inactivity lock in the root terminal application.

### 8.2 Black Prompt lockout policy

The current reusable Black Prompt policy uses:

- No timed lockout for the first four failures.
- A 30-second lockout beginning at five failures.
- A 300-second lockout beginning at ten failures.
- Browser-local failed-attempt state.
- A session record scoped by `data-cmx-gate-id` or pathname.

## 9. Credential rotation procedure

Never edit a gate by inserting or comparing a plaintext password.

When the owner requests a new credential:

1. Generate a new cryptographically random salt.
2. Derive a 256-bit verifier using PBKDF2-HMAC-SHA256 with 600,000 iterations.
3. Replace only the encoded salt and verifier constants.
4. Bump the failed-attempt state and migration version when stale browser state must be cleared.
5. Clear prior session keys through migration logic where necessary.
6. Cache-bust the consuming HTML script URL.
7. Confirm the new credential works.
8. Confirm the old credential fails.
9. Confirm lockout behavior still works.
10. Confirm no plaintext credential appears in the commit, comments, documentation, tests, or examples.

Root-specific rotation files:

```text
assets/cmx-auth-policy.js
index.html
```

Black Prompt rotation file:

```text
assets/gates/cmx-gate-black-prompt.js
```

For Black Prompt, consider bumping `STATE_KEY` and `SESSION_KEY` versions when a credential change must invalidate existing unlock state across active sessions.

## 10. Static-site security limitation

The current gates are client-side deterrents.

They are suitable for:

- Preventing casual access.
- Creating a deliberate private-interface feel.
- Hiding content during normal browsing.
- Prototyping authentication interactions.
- Reusing visual gate designs while the backend is being planned.

They are not suitable for protecting secrets or sensitive records because:

- The browser receives static HTML, JavaScript, CSS, and public assets.
- A determined user can inspect or bypass client-side logic.
- A weak fixed password can be brute-forced offline from a static verifier.
- Browser storage is not a trusted server session.

Real protection should move to one or both of:

- Cloudflare Access at the edge.
- The planned FastAPI backend with authenticated server sessions and authorization.

The visual gate can remain after that transition. The backend or edge layer should decide whether the protected response is delivered.

## 11. Adding another gate design

A new gate should follow this sequence:

1. Choose a stable lowercase hyphenated library ID.
2. Choose a request-friendly name ending in `Gate`.
3. Decide whether it shares a common credential core or needs a specialized policy.
4. Add isolated styles under `assets/gates/`.
5. Add isolated behavior under `assets/gates/`.
6. Define a small markup and data-attribute contract.
7. Add a preview under `gate-library/<id>/`.
8. Add the gate to `assets/gates/library.json`.
9. Add usage and limitations to `assets/gates/README.md`.
10. Update this handoff document.
11. Test keyboard entry, touch focus, mobile viewport behavior, reduced motion, lockouts, session behavior, wrong credentials, correct credentials, redirect behavior, and cache busting.

A gate theme should not silently change the protected page’s internal application state.

## 12. Proposed gate ideas that are not implemented

The following were discussed as possible future designs. They are not current library implementations:

- Classified Dossier Gate.
- Secure Intelligence Vault Gate.
- Biometric Scanner Gate.
- Minimal Operator Login Gate.
- Network Operations Gate.

Do not tell the owner these are available until corresponding files and previews exist.

## 13. Current `/brief` product model

The current final redesign model is:

```text
/brief
│
├── Entry
│   └── Choose briefing
│
├── Focus View
│   ├── Hero
│   ├── What matters now
│   └── Recommended action
│
├── Workspace
│   ├── Home
│   ├── Briefing
│   │   └── Scenario-specific tabs
│   ├── Spaces
│   ├── Plans
│   └── Library
│
├── Full View
│   └── Every module in one continuous document
│
├── Walkthrough
│   └── Guided steps and contextual tours
│
└── Terminal
    └── Collapsed command bar and expandable drawer
```

These are interaction modes and views over the same briefing system. They are not unrelated microsites.

### 13.1 Entry

Entry selects the briefing context. Current demonstration contexts are:

- Personal.
- Relationship.
- Business partners.
- Trainer and student.
- Team and project.

Entry should not unexpectedly restore an unrelated scroll position or route. Delayed legacy controllers have caused this problem previously.

### 13.2 Focus View

Focus View is the default small daily surface. It should answer:

- What changed?
- What matters now?
- What is the recommended action?
- Where should the user go for detail?

It should preserve the hero and avoid exposing the full product explanation by default.

### 13.3 Workspace

Workspace is the main application shell.

Stable primary navigation:

```text
Home
Briefing
Spaces
Plans
Library
```

The Briefing area changes its secondary tabs by scenario.

Current tab contracts in `brief-system.js`:

```text
Personal
Overview · Day · Work · Money · Wellness · Intelligence

Relationship
Overview · Together · Profiles · Plans · Watch · Reflection

Business
Executive · Finance · Projects · Decisions · Markets · Partners

Trainer
Overview · Today · Habits · Progress · Recovery · Coach

Team
Overview · My work · Project · Handoffs · Procedures · Finance · Spaces
```

### 13.4 Full View

Full View preserves every major module in one continuous document. It exists so the redesigned application can stay calm without deleting the visual depth and experiments already built.

### 13.5 Walkthrough

Walkthrough provides guided product education. It should gradually absorb overlapping tour and explanation experiences so the project does not maintain several unrelated onboarding systems.

### 13.6 Terminal

The `/brief` terminal is intended to remain collapsed as a command bar and expand into a drawer.

It currently supports frontend navigation and explanatory commands. It is not yet a secure agent execution surface.

## 14. `/brief` implementation ownership

Primary unified system files:

```text
assets/brief/brief-system.js
assets/brief/brief-system.css
assets/brief/brief-system-fixes.css
assets/brief/brief-terminal-bridge.js
```

The unified controller is intended to own:

- Current briefing type.
- Current mode.
- Current primary section.
- Current scenario-specific tab.
- URL state.
- Browser history.
- Scroll positioning.
- Mobile drawer state.
- More menu state.
- Briefing switcher state.
- Walkthrough state.
- Terminal drawer state.

Other scripts should request navigation through `window.BRIEF_SYSTEM` instead of directly changing hashes, history, or scroll position.

Legacy scripts and compatibility layers still exist. Inspect current load order before deleting or replacing anything.

## 15. `/brief` data and trust labels

The interface should clearly distinguish:

- Live public information.
- Fictional demonstration records.
- Connected-data demonstrations.
- Disconnected providers.
- Planned integrations.
- Private records requiring authenticated backend access.
- Shared records requiring explicit approval and scoped permissions.

A page looking private does not mean its data is protected.

Future connected data should include source, permission scope, freshness, and visibility metadata.

## 16. Goal intelligence relationship

The goal-intelligence concept is planned as the deeper organizing layer behind `/brief`.

Working loop:

```text
Collect authorized information
        ↓
Update user and goal state
        ↓
Identify missing information and blockers
        ↓
Ask a useful question when needed
        ↓
Recommend the highest-value next action
        ↓
Record evidence and outcome
        ↓
Adjust plan and difficulty
        ↓
Generate the next briefing
```

This remains conceptual. Do not present goal records, AI recommendations, database storage, or probability estimates as implemented backend features.

## 17. Completed work recorded on August 4, 2026

Gate work completed:

- Created the gate design library directory.
- Added the Black Prompt Gate logic.
- Added the Black Prompt Gate styling.
- Added a machine-readable library manifest.
- Added gate usage documentation.
- Added a live Black Prompt preview route.
- Rotated the Black Prompt verifier to the owner’s requested credential without storing plaintext.
- Rotated the root Restricted Node verifier to the owner’s requested credential without storing plaintext.
- Bumped root gate state and migration versions to clear stale lockout state.
- Cache-busted the root auth policy script.
- Cataloged the root Restricted Node as a gate design type.

`/brief` work completed or recently added by active development contexts:

- Unified Focus, Workspace, and Full View model.
- Scenario-specific workspace tabs.
- Stable primary navigation direction.
- Information library direction.
- Guided walkthrough direction.
- Collapsed terminal command surface direction.
- URL, history, and entry-scroll ownership work.
- Compatibility loading over the existing long-form page.
- Dated goal-intelligence concept.
- Dated progress and program-roadmap documents.

Always validate current deployment and tests before calling every item production-complete.

## 18. Current plans

### Gate system

- Extract the Restricted Node visual/auth interface into a more reusable library package.
- Separate shared authentication mechanics from gate-specific appearance where useful.
- Keep individual themes capable of unique interaction without duplicating unsafe credential logic.
- Add more previews only after a design is implemented.
- Connect visual gates to Cloudflare Access or FastAPI authorization.
- Replace browser-only sessions with server or edge sessions for protected content.

### `/brief`

- Stabilize the unified controller across mobile and desktop browsers.
- Remove duplicate navigation ownership after validation.
- Normalize frontend data contracts.
- Reduce legacy late-DOM patching.
- Preserve Full View while simplifying Focus and Workspace.
- Build a real FastAPI backend only after the frontend interaction model is stable.
- Add goal records, check-ins, evidence, recommendations, and permissions in structured storage.

## 19. AI operating rules

A future AI working in this repository should:

1. Read the latest relevant dated docs before editing.
2. Inspect current files and recent commits because multiple contexts may be working concurrently.
3. State which gate is being changed by its exact library name.
4. Never reveal or commit plaintext credentials.
5. Never describe a client-side gate as secure authentication.
6. Bump state or migration versions when a credential rotation must clear stale lockouts.
7. Cache-bust changed static assets in their consuming HTML.
8. Keep the Black Prompt Gate visually minimal unless the owner explicitly changes its design contract.
9. Avoid turning the root Restricted Node policy into a generic dependency without extracting its core dependencies.
10. Register every implemented gate in the manifest and README.
11. Avoid adding a second `/brief` URL, scroll, or navigation controller.
12. Preserve the `/brief` hierarchy of Entry, Focus, Workspace, Full View, Walkthrough, and Terminal.
13. Distinguish implemented frontend behavior from planned backend behavior.
14. Preserve explicit private/shared and source-status boundaries.
15. Add focused comments only where they prevent architecture, credential, or ownership mistakes.
16. Avoid large explanatory comments that simply restate obvious code.
17. Test the deployed result from a clean session after any gate or cache change.

## 20. Gate validation checklist

For every gate integration or credential rotation, validate:

- Correct gate theme appears.
- Protected content is hidden before authentication.
- Password field receives keyboard and touch focus.
- Enter submits correctly.
- Wrong credential is rejected.
- Correct credential unlocks.
- Old credential is rejected after rotation.
- Lockout thresholds behave as documented.
- Session scope behaves as intended.
- Forced-prompt mode behaves as intended.
- Redirect mode behaves as intended.
- Reload behavior is correct.
- Mobile viewport and keyboard do not break the layout.
- Reduced-motion behavior remains usable.
- No plaintext credential exists in the diff.
- Static assets are cache-busted when needed.
- The page is still clearly documented as client-side protection only.

## 21. Revision rules

When making a material change to the gate library or shared system model:

1. Update `assets/gates/library.json`.
2. Update `assets/gates/README.md`.
3. Update targeted code comments if the integration contract changed.
4. Update this document’s revision log.
5. Preserve the original recorded timestamp.
6. Add a new **Last revised** timestamp.
7. Do not duplicate the entire document under a new filename unless the architecture has materially forked.

**Last revised:** August 4, 2026 at 3:25 PM EDT

## 22. Revision log

### August 4, 2026 at 3:25 PM EDT

- Created the first consolidated gate-library and AI handoff specification.
- Cataloged Restricted Node Gate and Black Prompt Gate.
- Recorded current credential-verification and rotation rules without plaintext credentials.
- Recorded the static-site security boundary.
- Recorded the final `/brief` view model and ownership direction.
- Linked the gate system to the current `/brief` roadmap and goal-intelligence documents.
- Added future-agent operating rules and validation checklists.
