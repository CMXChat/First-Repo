# Continuum `/doc/` Freeze - CURRENT

Date: 2026-08-19
Status: FROZEN after final product, continuity, architecture, dark-mode QA and RTL accessibility pass

## Freeze decision

`/doc/` is now frozen as the current Continuum product and architecture overview.

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

## Final visual bug fixed before freeze

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

## Internationalization / RTL compatibility after freeze

The owner explicitly requested better phone translation behavior for Hebrew and other right-to-left languages. This was treated as accessibility/internationalization maintenance under the freeze. It did not reopen the English copy, product positioning, section order or visual design.

The final compatibility layer is separated from the frozen visual system:

- `assets/continuum-doc-i18n.css` loads last;
- `assets/continuum-doc-i18n.js` performs a one-time direction preparation only;
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

This work makes browser-translated RTL output substantially more natural. It is still translation compatibility, not a separately authored Hebrew localization, so translation wording remains controlled by the browser/translation provider.

## Regression guard

`tests/continuum-doc-clarity-smoke.test.js` now checks:

- final theme aliases exist;
- the dark `.continuum-forward-flow span` guard exists;
- dark flow arrows are explicitly styled;
- strong dark border treatment exists;
- long labels can wrap safely;
- the RTL stylesheet loads after the frozen visual layers;
- the i18n script applies local `dir="auto"` preparation;
- Hebrew/Arabic RTL fallbacks exist;
- desktop horizontal arrows reverse in RTL;
- mobile contents opens from the RTL edge;
- colored workflow borders move to the RTL reading edge;
- mobile vertical flows continue downward;
- bidi isolation exists for fixed-direction technical tokens;
- existing desktop/mobile/dark/print coverage remains present.

The existing browser workflow continues to validate the rendered teaching order and the major desktop/390×844 mobile content markers.

A workflow file existing is not proof that CI passed. Do not report a green run unless an actual run/status is observed.

## Cache note

The static HTML now references the accepted final origin assets with the `20260819-3` query token and the dedicated RTL compatibility assets with `20260819-1`.

The cache bump was made under the freeze's delivery exception so browsers receive the already-accepted final dark-mode/copy layer together with the RTL accessibility layer. It does not reopen product design.

Future cache-token changes remain allowed when needed to deliver an accepted bug/accessibility fix. Do not use cache delivery as a reason to reopen the document wording or layout.

## Backend boundary unchanged

This freeze changes no backend release truth.

It does not authorize or perform:

- Phase 2A production migration;
- backend deployment;
- provider execution;
- Runtime deployment;
- Signals monitoring;
- Goal orchestration;
- autonomous AI execution;
- MCP execution;
- architecture self-deployment.

Production migration/deployment still requires explicit authorization.

## Reopen rule

When a future context touches `/doc/`, read this file before editing.

If the requested change is not a bug/status/security/accessibility/cache correction and the owner did not explicitly reopen `/doc/`, stop and leave the page unchanged.
