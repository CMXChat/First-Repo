# Check In Lab ↔ Automations Integration — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab v4.4 integration contract with Directory v2, AI setup preview, typed Audience, data/input routing and linear inter-step flow controls

# Canonical structure

`/lab/` is the broader Continuum / Check In Lab workspace.

`/lab/automations/` is the single full Automation editor.

Do not build a competing full editor inside `/lab/`. The broader Lab summarizes shared Drafts, owns Directory v2 and links into the focused route.

Accepted Lab semantics migrate later into the official React/frontend + typed backend stack. LocalStorage and DOM adapters do not become production architecture.

Read with `continuum-automations-master-plan-CURRENT.md`, `continuum-directory-master-plan-CURRENT.md`, `checkin-automations-frontend-CURRENT.md` and `checkin-directory-library-CURRENT.md`.

# Focused route authority

V3 remains the local Draft normalization/editing/autosave/full-flow simulation compatibility core.

Current v4.x layers add:

- command-center navigation;
- Capability Catalog;
- 13 scenarios;
- Flow Preview navigation;
- Planner preview;
- Directory readiness;
- Audience v4.1;
- v4.2 contextual recommendations, typed data references and richer tests;
- v4.3 field-level input routing;
- **v4.4 linear inter-step IF / WAIT authoring preview**.

Current product files include platform/scenario/Directory/Audience/intelligence/input-routing layers plus `lab-automations-sequence-v4.js/.css`.

Older focused v2 files remain history.

# Shared state

The broader and focused Lab share Automations (`cmx-lab-automations-v1`), Directory (`cmx-lab-crm-v1`), Inventory and reusable Actions.

Focused compatibility/UI stores include:

- `cmx-lab-automation-progress-v1`;
- `cmx-lab-automations-platform-v4`;
- `cmx-lab-automation-data-bindings-v1`;
- `cmx-lab-automation-input-bindings-v1`;
- `cmx-lab-automation-flow-controls-v1`.

Directory navigation state remains `cmx-lab-directory-ui-v2`.

Richer intent belongs to `audienceSelectors[]`, `dataBindings[]`, `inputBindings[]` and `flowControls[]` where possible. Extra stores only protect richer prototype fields from the older compatibility engine.

# Route integration

Main Lab → focused route:

- open Automations → `/lab/automations/`;
- exact Draft → `/lab/automations/?automation=<id>&from=lab`;
- direct new Draft → `/lab/automations/?new=1&from=lab`.

`?new=1` bypasses the Build/Templates/Planner chooser and opens Trigger directly.

Focused route → broader Lab:

- Actions → `/lab/#lab=view%3Aactions`;
- Directory → `/lab/#lab=view%3Arecords`.

`lab-automations-main-bridge.js` remains summary/navigation only.

# Directory v2 + AI setup

The broader Lab owns People / Organizations / Groups, memberships, ContactMethods/readiness, Labels, Person relationships and Activity/notes.

Directory `AI setup` previews the future natural-language Change Plan flow with no model call and no mutation:

`natural-language intent → typed Change Plan → preflight/conflicts → review/approval → normal protected domain services`

The focused route reads shared Directory prototype state for targeting/readiness/data previews only.

# Audience v4.1

Communication Actions can select Person, Organization, Group and Label selectors. Browser resolution deduplicates People and previews channel readiness.

Production uses protected Draft mutations and canonical server audience resolution/readiness.

# Intelligence v4.2 and Input Routing v4.3

`Use data` selects typed Trigger/prior-step/Directory sources.

Input Routing assigns those sources to named Action fields.

Normal model:

`typed source output → named compatible Action input`

No arbitrary executable expression code. Production validates mappings against server-owned capability input/output schemas.

# Advanced Flow v4.4

The Actions stack can now represent logic **between** Action cards.

Current controls:

- `IF / Continue if…` — linear gate;
- `WAIT / Wait between steps` — inter-step delay preview.

This corrects a structural limit in the legacy five-stage editor. The top-level IF stage is pre-action, so it cannot truthfully depend on output from a later Action. Output-dependent logic must be positioned after the producing Action.

V4.4 source selection therefore includes only Trigger data and outputs available by the insertion point.

Prototype `flowControls[]` entries are anchored by `afterActionId`.

False IF stops the remaining linear path in the preview. No YES/NO branching graph exists yet.

Inter-step WAIT remains distinct from top-level start Timing and is explicitly `RUNTIME REQUIRED`.

This is authoring/product proof only. The browser does not execute waits or sequence routing.

# Future consolidation rule

V4.4 proves that the long-term Automation domain is better represented as an ordered typed sequence/graph while preserving the beginner WHEN / IF / DO / WAIT / TEST rail as navigation.

Do not indefinitely extend the static Lab through unrelated DOM patches.

A future consolidated authoring model should be able to represent:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Branch nodes wait for durable Runtime routing semantics.

# AI Planner rule

Natural language eventually edits the same typed environment as human UI.

Planner can author inter-step controls only once matching server types/schema validation exist. Lab `flowControls[]` is not backend truth.

Cross-domain AI uses a typed Change Plan, never a shadow AI contact store/workflow/database path. Prompt text never grants authority.

Backend companion: `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`.

# Command center / scenarios / mobile

Top-level views remain Automations, Templates and Runs preview. Runs stays `RUNTIME OFF`. Current scenarios: **13**.

Phone remains a vertical readable workflow with one-column controls, full-screen/bottom-sheet pickers, safe-area actions, no nested-scroll traps and no desktop graph squeezed onto mobile.

# Safety boundary

Both routes remain prototypes. They do not publish production Automations, execute providers, run external AI models, schedule authoritative work, mutate connected accounts or store provider secrets.

Keep focused `connect-src 'self'`.

# Regression protection

Validation should cover v3 compatibility, progressive blank-Draft truth, Directory/Audience, AI setup preview, v4.2 typed data/tests, v4.3 input routing, v4.4 inter-step IF/WAIT, command-center views, exact/new Draft navigation, FLOW PREVIEW, production isolation, mobile smoke and no broad MutationObserver/eval/dynamic Function.
