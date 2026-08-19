# Continuum `/doc/` Freeze - CURRENT

Date: 2026-08-19
Status: FROZEN after owner-authorized knowledge ingestion, memory governance and temporal-awareness update plus prior product, continuity, architecture, dark-mode and RTL QA

## Freeze decision

`/doc/` is frozen as the current Continuum product and architecture overview.

Do not reopen copy, structure, product positioning or visual design as routine cleanup.

Future changes are allowed only for:

- a real visual or functional bug;
- accessibility or contrast defects;
- security or privacy corrections;
- truthful LIVE / LAB / NEXT / LATER status updates when implementation changes;
- broken links or route changes;
- cache/version corrections needed to deliver an accepted fix;
- an explicit request from the owner to reopen the document.

If none of those conditions applies, leave `/doc/` alone.

## Owner-authorized August 19 reopening

The owner explicitly reopened `/doc/` on 2026-08-19 after the earlier freeze to add two product concepts that had become important backend architecture decisions:

1. general knowledge ingestion and memory governance;
2. real temporal awareness.

This reopening did not authorize a new top-level section or a redesign.

The eight-section reading path remains intact.

The human-facing additions are compact post-render teaching panels:

- **Information** now explains that Continuum knowledge ingestion is broader than document upload and can eventually accept direct/bulk text, Markdown, JSON, AI handoffs, files, OCR/vision and approved connected Sources through one provenance-backed path;
- **Overview** now explains that Continuum should use real backend timestamps and server-owned time instead of allowing AI to infer elapsed time from conversation turns.

Canonical product companion:

`docs/continuum-knowledge-time-CURRENT.md`

Canonical backend contracts:

- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-KNOWLEDGE-IMPORT-INGESTION-BACKEND-CONTRACT.md`;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-KNOWLEDGE-GOVERNANCE-AND-MEMORY-CONTRACT.md`;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-TEMPORAL-AWARENESS-BACKEND-CONTRACT.md`.

The document is refrozen after this explicit owner-authorized update.

## Final product teaching that is protected

The frozen page preserves the current eight-section reading path and the current Continuum model:

`Knowledge + State + Authority + Policy + Audit`

with expandable layers:

`Reasoning + Capabilities + Runtime`

It also preserves:

- the human-first opening;
- Check In as the first-class LIVE route;
- Spaces and Automation Lab as LAB routes;
- concrete operational State;
- the long-running Runtime example;
- explainability / Audit receipt;
- Sources, Observations, Signals and information quality;
- Observation / Claim / Derived conclusion / Current State distinctions;
- general knowledge ingestion beyond file upload;
- provenance-backed review before durable mapping;
- private-by-default knowledge direction;
- direct text, bulk input, Markdown, JSON and AI handoff direction;
- file and OCR/vision ingestion direction;
- real elapsed-time awareness from backend timestamps;
- time-aware deadlines, freshness, waits, history and timezone context;
- model routing;
- typed Planner / Change Plan direction;
- Goals / Missions;
- capability discovery and adoption;
- continuity of authorized intent;
- Goals continuing under an already-published continuity policy;
- goal-driven architecture evolution through governed engineering work;
- Control Center, Pause Autonomy and simulation direction;
- Dead Man Switch / Afterlife origin;
- the closing Check In / Spaces / Automation Lab route choices.

## Knowledge/time presentation layer

The accepted additions are isolated from the older frozen visual system:

- `assets/continuum-doc-knowledge-time.js` performs a one-time DOM augmentation after the main document content has been assembled;
- `assets/continuum-doc-knowledge-time.css` owns the dedicated responsive/light/dark/print presentation;
- `assets/continuum-doc-i18n.js` still prepares `dir="auto"` and now loads the dedicated knowledge/time layer;
- no MutationObserver, polling loop, API request or provider call was added;
- the new layer does not alter LIVE backend truth.

The knowledge panel teaches:

```text
CAPTURE → UNDERSTAND → REVIEW → INTEGRATE
```

with examples including:

```text
Paste + bulk text
Markdown + JSON
AI handoffs
Files + OCR / vision
Connected Sources
```

It explicitly says new knowledge is private by default, permanent mappings are conservative and AI receives only authorized context needed for the job.

The temporal panel teaches that backend timestamps distinguish actual elapsed time.

Its concrete example is the owner leaving for two minutes and returning two seconds later. Continuum should understand that roughly two seconds passed.

The panel also connects time to State transitions, deadlines, waits, freshness, history and local-time context.

It truthfully states that Check In already proves server-owned elapsed timing while general time-aware conversations, knowledge, Goals, Signals and Runtime remain architecture being built out over time.

## Final visual bug fixed before the earlier freeze

The August 19 mobile screenshots exposed a dark-mode contrast defect in the compact flow pills used by Signals, Goals and authorized continuity.

Root cause:

`assets/continuum-doc-origin.css` referenced `--surface`, `--text` and `--accent`, while the base document theme actually defines `--paper-raised`, `--ink-strong` and `--blue`. Most components happened to have separate dark overrides, but `.continuum-forward-flow span` did not. In dark mode that left a near-white fallback surface behind near-white text.

Final fix:

```text
--surface → --paper-raised
--text    → --ink-strong
--accent  → --blue
```

The aliases are defined in the final layer so existing declarations resolve against the actual theme. Flow pills also have an explicit dark-mode surface/border guard and blue directional arrows.

This protects the same component wherever it appears, including:

- Planner;
- Signals + State;
- Goals / Missions;
- live capability adoption;
- authorized continuity;
- architecture evolution;
- Control Center teaching.

The mobile flow layout keeps full-width readable steps and supports long labels without overflow.

## Internationalization / RTL compatibility

The owner explicitly requested better phone translation behavior for Hebrew and other right-to-left languages. This remains an accessibility/internationalization layer and does not change the English source language.

The final compatibility layer remains:

- `assets/continuum-doc-i18n.css` loads last among static stylesheet links;
- `assets/continuum-doc-i18n.js` performs one-time direction preparation and loads the knowledge/time augmentation;
- English remains the source language and keeps the existing LTR presentation;
- the page does not ship a built-in translator or hard-coded Hebrew copy;
- the user's browser/phone translation feature still performs the translation itself.

The i18n script assigns `dir="auto"` to the main reader-facing containers after the dynamic `/doc/` content is assembled. This lets translated Hebrew, Arabic and other RTL text resolve its own direction without a MutationObserver, polling loop or network behavior.

The RTL stylesheet supports standards-based `:dir(rtl)` behavior plus language/class fallbacks for Hebrew, Arabic, Persian, Urdu and Yiddish. When RTL is active it mirrors the parts whose meaning depends on direction, including:

- desktop contents rail treatment;
- mobile contents drawer and active-item treatment;
- reading progress origin;
- timeline rails and numbered markers;
- workflow and build rails;
- horizontal process, architecture and policy arrows;
- continuity and Goal flow arrows;
- RTL-facing accent borders and decorative anchors;
- small-screen layout rails.

Mobile flows that become vertical continue to point downward instead of being horizontally reversed.

Technical tokens, code, status chips and fixed identifiers use bidi isolation where appropriate so mixed Hebrew/English content stays readable.

This work makes browser-translated RTL output substantially more natural. It remains translation compatibility, not a separately authored Hebrew localization, so translation wording stays controlled by the browser/translation provider.

## Regression guard

`tests/continuum-doc-clarity-smoke.test.js` continues to check the frozen architecture, dark-mode and RTL contract.

`tests/continuum-doc-knowledge-time-smoke.test.js` now additionally checks:

- the knowledge/time layer is loaded by the final one-time script;
- direct/bulk text, Markdown/JSON, AI handoff and OCR/vision teaching exists;
- the `CAPTURE → UNDERSTAND → REVIEW → INTEGRATE` direction remains present;
- private-by-default wording remains present;
- temporal-awareness teaching remains present;
- the two-second elapsed-time example remains present;
- due/overdue/stale time transitions remain present;
- dark/mobile styles exist for the new panels;
- the CURRENT knowledge/time companion records the AI privacy tiers and real clock direction.

A workflow file or test file existing is not proof that CI passed. Do not report a green run unless an actual run/status is observed.

## Cache note

The static HTML still references the accepted final origin assets with the `20260819-3` query token and the RTL compatibility assets with `20260819-1`.

The knowledge/time augmentation is loaded from:

`/assets/continuum-doc-knowledge-time.js?v=20260819-1`

which in turn loads:

`/assets/continuum-doc-knowledge-time.css?v=20260819-1`

The static i18n loader path itself was updated in place. GitHub Pages/browser caching may briefly retain an older copy until normal cache revalidation. A future explicit cache-token bump remains allowed as a delivery-only correction if a device proves stale delivery.

Do not use cache delivery as a reason to reopen product wording or layout.

## Backend boundary unchanged

This freeze changes no backend release truth.

It does not authorize or perform:

- Phase 2A production migration;
- backend deployment;
- production general ingestion;
- production OCR/vision extraction;
- general temporal Runtime deployment;
- provider execution;
- Runtime deployment;
- Signals monitoring;
- Goal orchestration;
- autonomous AI execution;
- MCP execution;
- architecture self-deployment.

Production migration/deployment still requires explicit authorization.

Immediate backend sequence remains:

```text
prepared Phase 2A migration/deployment
→ protected continuity.md acceptance proof
→ following knowledge/storage implementation slices
```

## Reopen rule

When a future context touches `/doc/`, read this file before editing.

If the requested change is not a bug/status/security/accessibility/cache correction and the owner did not explicitly reopen `/doc/`, stop and leave the page unchanged.
