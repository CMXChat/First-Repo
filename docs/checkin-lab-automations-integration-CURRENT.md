# Check In Lab ↔ Automations Integration — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab v4.2 integration contract with Directory v2, typed Audience and typed data-reference UX

# Canonical structure

`/lab/` is the broader Continuum / Check In Lab workspace.

`/lab/automations/` is the single full Automation editor.

Do not build a competing full editor inside `/lab/`. The broader Lab summarizes shared Drafts, owns Directory v2 and links into the focused route.

Accepted Lab semantics migrate later into the official React/frontend + typed backend stack. LocalStorage and DOM adapters do not become production architecture.

Read with:

- `docs/continuum-automations-master-plan-CURRENT.md`;
- `docs/continuum-directory-master-plan-CURRENT.md`;
- `docs/checkin-automations-frontend-CURRENT.md`;
- `docs/checkin-directory-library-CURRENT.md`.

# Focused route authority

V3 remains the local Draft normalization/editing/autosave/full-flow simulation core.

Current v4.x product layers add:

- command-center navigation;
- Capability Catalog;
- scenarios;
- Flow Preview navigation;
- Planner preview;
- Directory readiness;
- typed Audience v4.1;
- contextual Action recommendations;
- typed Use data references;
- richer local stage-test traces.

Current files include:

- `lab-automations-platform-v4.js/.css`;
- `lab-automations-platform-v4-qa.css`;
- `lab-automations-scenarios-v4.js`;
- `lab-automations-directory-v4.js/.css`;
- `lab-automations-audience-v4.js/.css`;
- `lab-automations-intelligence-v4.js/.css`.

Older focused v2 files remain history.

# Builder model

The focused builder remains:

1. Trigger / WHEN;
2. Rules / IF;
3. Actions / DO;
4. Timing / WAIT;
5. Review / TEST.

Finish stays inside Review.

FLOW PREVIEW stays truthful for blank Drafts and never promotes compatibility defaults into user intent.

# Shared state

The broader and focused Lab share:

- Automations: `cmx-lab-automations-v1`;
- Directory: `cmx-lab-crm-v1`;
- Inventory: `cmx-lab-inventory-v1`;
- reusable Actions: `cmx-lab-actions-v1`.

Focused UI stores include:

- `cmx-lab-automation-progress-v1`;
- `cmx-lab-automations-platform-v4`;
- `cmx-lab-automation-data-bindings-v1` compatibility store.

Directory navigation-only state:

- `cmx-lab-directory-ui-v2`.

Richer Audience intent lives in Action `audienceSelectors[]`. Typed data-reference intent mirrors to Action `dataBindings[]` where possible.

The extra data-binding store exists only because the older v3 compatibility engine may drop unknown fields during save.

# Route integration

Main Lab → focused route:

- open Automations → `/lab/automations/`;
- exact Draft → `/lab/automations/?automation=<id>&from=lab`;
- direct new Draft → `/lab/automations/?new=1&from=lab`.

`?new=1` bypasses the normal Build/Templates/Planner chooser and opens a blank Trigger directly.

Focused route → broader Lab:

- Actions → `/lab/#lab=view%3Aactions`;
- Directory → `/lab/#lab=view%3Arecords`.

`lab-automations-main-bridge.js` remains a bridge/summary layer only. It must not become a second editor or execution authority.

# Directory v2

The broader Lab owns the richer People / Organizations / Groups surface.

It enriches shared Directory state with many-Organization memberships, ContactMethods/readiness, Labels, Groups, Person relationships and Activity/notes.

The focused Automation route reads the same shared store for targeting/readiness previews.

# Typed Audience v4.1

Communication Actions represented by `notify` / `email` can select Person, Organization, Group and Label selectors.

Browser Lab resolution deduplicates People and previews channel readiness.

Prototype fields:

- `audienceSelectors[]`;
- live-membership resolution metadata;
- Person-ID dedupe metadata.

V3 target fields remain compatibility scaffolding only.

Production must use protected Draft mutations and canonical server audience resolution/readiness.

# Automations Intelligence v4.2

## Recommendations

The focused Actions stage derives a small recommended set from the current Trigger/flow while reusing the existing Capability Catalog.

This affects discovery only. It does not silently mutate the Draft or invent capabilities.

## Typed data references

Each Action can open **Use data** to select references from:

- Trigger outputs;
- prior Action outputs;
- Directory/Audience values.

The normal product concept is a typed source/step reference plus typed path, not arbitrary executable expression code.

The current local compatibility store is:

`cmx-lab-automation-data-bindings-v1`

Production uses server-validated typed references instead.

## Richer local testing

`TEST THIS STEP` can now render local input → normalization/resolution → sample output traces, including Audience/readiness and mapped-data samples for Actions.

No provider, AI model, server Runtime, real event source or connected account is used.

# Command center / scenarios

Top-level focused views remain Automations, Templates and Runs preview.

Runs stays `RUNTIME OFF`.

Current scenarios: **13** ordinary editable Draft starting points.

# Capability Catalog

The browser-local catalog can show current prototype options and deliberate future concepts with `LAB NOW` / `LATER` states.

It is discovery scaffolding, not execution authority.

Future server registry metadata owns real capability/readiness truth.

# AI Planner

Planner establishes the rule that natural-language intent edits the same typed Draft model as human UI.

Current Planner performs no model call and cannot rewrite immutable published history.

# Mobile contract

Preserve:

- one primary work area;
- readable type/large tap targets;
- one-column Action/capability/data choices;
- bottom-sheet/full-screen pickers;
- Audience/data sheets with safe-area controls;
- no nested scroll traps;
- no horizontal overflow;
- no desktop canvas squeezed onto phone.

# Safety boundary

Both routes remain prototypes.

They do not publish production Automations, execute providers, call production Check In from the focused route, run external AI models, schedule authoritative work, mutate connected accounts or store provider secrets.

Keep focused `connect-src 'self'`.

# Regression protection

Validation should cover:

- v3 compatibility core;
- progressive blank-Draft truth;
- v4.2 product layers;
- Directory/Audience integration;
- recommendations and Use data;
- richer stage tests;
- Automations / Templates / Runs;
- exact/new Draft navigation;
- FLOW PREVIEW;
- production isolation;
- mobile smoke;
- no broad MutationObserver/eval/dynamic Function in current adapters.

Broad Lab validation separately protects the generated main-Lab snapshot and Directory v2 load order/polish.
