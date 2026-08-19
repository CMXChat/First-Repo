# Check In Lab ↔ Automations Integration — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab v4.1 integration contract with Directory v2 + typed Audience

# Canonical product structure

`/lab/` is the broader Continuum / Check In Lab workspace.

`/lab/automations/` is the dedicated Automation workspace and the single full Automation editor.

Do not build a competing full Automation editor inside `/lab/`. The main Lab summarizes shared Drafts, owns the rich Directory v2 surface and links into the focused route.

The Lab remains a proving ground. Accepted product semantics migrate later into the official React/frontend + typed backend stack. LocalStorage and DOM adapters do not become production architecture.

Read with:

- `docs/continuum-automations-master-plan-CURRENT.md`;
- `docs/continuum-directory-master-plan-CURRENT.md`;
- `docs/checkin-automations-frontend-CURRENT.md`;
- `docs/checkin-directory-library-CURRENT.md`.

# Focused route authority

## V3 behavior core

- `assets/lab/lab-automations-experience-v3.js`;
- `assets/lab/lab-automations-experience-v3.css`.

V3 owns local Draft normalization, editing, autosave, compatibility fields and full-flow simulation.

## Accepted support layers

- `assets/lab/lab-automations-system-surface.js`;
- `assets/lab/lab-automations-system-surface.css`;
- `assets/lab/lab-automations-progressive-preview.js`;
- `assets/lab/lab-automations-final-qa.css`;
- `assets/lab/lab-automations-route-integration.js`.

## V4/V4.1 product layers

- `assets/lab/lab-automations-platform-v4.js`;
- `assets/lab/lab-automations-platform-v4.css`;
- `assets/lab/lab-automations-platform-v4-qa.css`;
- `assets/lab/lab-automations-scenarios-v4.js`;
- `assets/lab/lab-automations-directory-v4.js`;
- `assets/lab/lab-automations-directory-v4.css`;
- `assets/lab/lab-automations-audience-v4.js`;
- `assets/lab/lab-automations-audience-v4.css`.

V4/V4.1 owns the current operating experience: command-center navigation, capability discovery, interactive flow navigation, per-stage tests, preflight, creation chooser, Planner preview, scenarios, Directory readiness and typed Audience composition.

Older focused v2 builder files remain history and are not loaded.

# Builder model

The focused builder remains:

1. Trigger / WHEN;
2. Rules / IF;
3. Actions / DO;
4. Timing / WAIT;
5. Review / TEST.

No name-first wizard.

Finish stays inside Review.

# Progressive Flow Preview

Accepted label: **FLOW PREVIEW**.

Blank Draft starts visibly incomplete:

- WHEN — Choose a trigger;
- IF — Not set yet;
- DO — Choose an action;
- WAIT — Not set yet;
- FINISH — Not set yet.

Compatibility defaults must never appear as user intent before confirmation.

# Shared state

The broader Lab and focused route share:

- Automation Drafts: `cmx-lab-automations-v1`;
- Directory prototype: `cmx-lab-crm-v1`;
- Inventory: `cmx-lab-inventory-v1`;
- reusable Actions: `cmx-lab-actions-v1`.

Focused progressive UI state:

- `cmx-lab-automation-progress-v1`.

Directory navigation-only state:

- `cmx-lab-directory-ui-v2`.

V4 platform marker/preferences:

- `cmx-lab-automations-platform-v4`.

Typed Audience data lives inside the normal Automation Draft Action as `audienceSelectors[]`. It does not use a separate Audience localStorage database.

# Main Lab → focused route

From `/lab/` Actions:

- Open Automations → `/lab/automations/`;
- exact Draft → `/lab/automations/?automation=<id>&from=lab`;
- direct new Draft → `/lab/automations/?new=1&from=lab`.

`?new=1` deliberately bypasses the v4 creation chooser and opens the blank Trigger editor directly.

Exact-Draft and one-shot query behavior remain owned by `lab-automations-route-integration.js`.

# Focused route → main Lab

The Lab brand/back control returns to:

`/lab/#lab=view%3Aactions`

The main Lab Directory is reachable at:

`/lab/#lab=view%3Arecords`

# Main-Lab bridge

`lab-automations-main-bridge.js` may:

- read shared Drafts;
- show Draft status/count;
- open exact Drafts;
- start direct-new Draft;
- show compact Action/timing summaries;
- point to reusable Actions.

It must not become a second full editor, persistence model or execution authority.

# Directory v2 integration

The broader Lab Records surface owns the rich Directory v2 experience.

Directory v2 enriches the shared `cmx-lab-crm-v1` store with prototype concepts including:

- many-Organization Person membership;
- ContactMethods/readiness;
- Labels;
- Groups/saved audiences;
- explicit Person relationships;
- Activity/notes.

The focused Automation route reads the same shared store.

# Typed Audience v4.1 integration

Communication Actions represented by current inline `notify` and `email` types use the v4.1 Audience manager.

Selectors can include:

- Person;
- Organization;
- Group;
- Label.

The browser resolves current unique People, deduplicates by Person ID and previews email/phone readiness.

Prototype Action fields include:

- `audienceSelectors[]`;
- `audienceResolution.mode = live_membership`;
- `audienceResolution.dedupe = person_id`.

## V3 compatibility rule

The v3 core still understands `targetRef` / `targetLabel`.

The Audience adapter therefore:

1. triggers the normal v3 Save before changing Audience state;
2. writes `audienceSelectors[]` into the shared Action object;
3. mirrors one direct Person/Organization into the compatibility target reference where possible;
4. uses a readable compatibility target label for larger/Group/Label audiences;
5. reloads the exact Draft so the v3 normalizer rehydrates/preserves the extra fields.

This reload is static-Lab compatibility behavior only.

Production must use normal protected Draft mutations and a canonical server resolver.

# Command center

Current top-level views:

- Automations;
- Templates;
- Runs preview.

Runs stays explicitly `RUNTIME OFF` until authoritative Runtime exists.

# Templates/scenarios

Current total: **13**.

Scenarios instantiate ordinary shared Drafts. No separate scenario execution/persistence engine.

# Capability Catalog

The browser-local catalog can show current prototype options and future concepts with clear `LAB NOW` / `LATER` states.

It is discovery scaffolding only.

Future server-owned registry metadata must decide real supported capability types/readiness.

# Reusable Actions

Saved Lab Actions remain explicit `action_ref` entries.

Do not silently convert types such as SMS/Webhook/Digital Account/Publish into simpler inline types.

Production later resolves/authorizes/version-freezes reusable definitions server-side.

# Testing

**TEST THIS STEP** remains local explanatory testing.

Full-flow simulation remains local.

Audience resolution/readiness shown in Lab is also local preview, not authoritative execution history.

# AI Planner preview

Planner establishes the future product rule:

- natural-language intent becomes the same typed Draft a human edits;
- no shadow AI workflow format;
- immutable published history is never silently rewritten.

Current Planner performs no model request.

# Mobile contract

Preserve:

- one primary working area;
- readable type;
- large tap targets;
- one-column capability/Action cards;
- bottom-sheet/full-screen pickers;
- full-width Audience selector sheet;
- safe-area controls;
- no nested scroll traps;
- no horizontal page movement;
- no desktop canvas squeezed onto phone.

# Safety boundary

Both routes remain prototypes.

They do not:

- publish production Automations;
- execute communication providers;
- call production Check In API from the focused route;
- run external AI models;
- schedule authoritative work;
- mutate connected accounts;
- hold provider secrets.

Keep `connect-src 'self'` on the focused route.

# Regression protection

Current validation should cover:

- v3 compatibility core;
- progressive blank-Draft truth;
- v4 command-center/capability layers;
- scenario layer;
- Directory integration;
- Audience v4.1 source/styling;
- Automations / Templates / Runs;
- direct-new and exact-Draft navigation;
- FLOW PREVIEW;
- per-stage testing;
- strict production isolation;
- mobile smoke;
- no broad MutationObserver/eval/dynamic Function in current adapters.

Broad Lab validation separately protects the generated main-Lab snapshot and Directory v2 load order.
