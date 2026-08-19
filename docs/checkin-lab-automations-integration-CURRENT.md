# Check In Lab ↔ Automations Integration — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab v4.3 integration contract with Directory v2, AI setup preview, typed Audience, typed data references and field input routing

# Canonical structure

`/lab/` is the broader Continuum / Check In Lab workspace.

`/lab/automations/` is the single full Automation editor.

Do not build a competing full editor inside `/lab/`. The broader Lab summarizes shared Drafts, owns Directory v2 and links into the focused route.

Accepted Lab semantics migrate later into the official React/frontend + typed backend stack. LocalStorage and DOM adapters do not become production architecture.

Read with `continuum-automations-master-plan-CURRENT.md`, `continuum-directory-master-plan-CURRENT.md`, `checkin-automations-frontend-CURRENT.md` and `checkin-directory-library-CURRENT.md`.

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
- contextual recommendations;
- typed Use data references;
- richer local stage-test traces;
- field-level input routing v4.3.

Current files include:

- `lab-automations-platform-v4.js/.css`;
- `lab-automations-platform-v4-qa.css`;
- `lab-automations-scenarios-v4.js`;
- `lab-automations-directory-v4.js/.css`;
- `lab-automations-audience-v4.js/.css`;
- `lab-automations-intelligence-v4.js/.css`;
- `lab-automations-input-routing-v4.js/.css`.

Older focused v2 files remain history.

# Shared state

The broader and focused Lab share Automations (`cmx-lab-automations-v1`), Directory (`cmx-lab-crm-v1`), Inventory and reusable Actions.

Focused compatibility/UI stores include:

- `cmx-lab-automation-progress-v1`;
- `cmx-lab-automations-platform-v4`;
- `cmx-lab-automation-data-bindings-v1`;
- `cmx-lab-automation-input-bindings-v1`.

Directory navigation state remains `cmx-lab-directory-ui-v2`.

Richer intent belongs to Action `audienceSelectors[]`, `dataBindings[]` and `inputBindings[]` where possible. Extra stores exist only because the older compatibility engine may drop unknown fields.

# Route integration

Main Lab → focused route:

- open Automations → `/lab/automations/`;
- exact Draft → `/lab/automations/?automation=<id>&from=lab`;
- direct new Draft → `/lab/automations/?new=1&from=lab`.

`?new=1` bypasses the normal Build/Templates/Planner chooser and opens a blank Trigger directly.

Focused route → broader Lab:

- Actions → `/lab/#lab=view%3Aactions`;
- Directory → `/lab/#lab=view%3Arecords`.

`lab-automations-main-bridge.js` remains a summary/navigation bridge only.

# Directory v2 + AI setup

The broader Lab owns People / Organizations / Groups with memberships, ContactMethods/readiness, Labels, Groups, Person relationships and Activity/notes.

The Directory command bar now also exposes an **AI setup** preview. It demonstrates the future natural-language Change Plan flow and fixed examples, but performs no model call and no data mutation.

Future contract:

`natural-language intent → typed Change Plan → preflight/conflicts → review/approval → normal protected domain services`

The focused Automation route reads the shared Directory store for Lab targeting/readiness/data previews.

# Typed Audience v4.1

Communication Actions can select Person, Organization, Group and Label selectors.

Browser Lab resolution deduplicates People and previews channel readiness.

V3 target fields remain compatibility scaffolding only. Production uses protected Draft mutations and canonical server audience resolution/readiness.

# Automations Intelligence v4.2

The Actions stage derives contextual recommendations from the current flow while reusing the Capability Catalog.

Each Action can also select typed source references from Trigger outputs, prior Action outputs and Directory/Audience values.

The normal model is a typed source/step reference plus typed output path, not arbitrary executable expression code.

`TEST THIS STEP` can render local input → normalization/resolution → sample output traces. No provider, model, server Runtime, real event source or connected account is used.

# Input routing v4.3

The receiving side of typed data flow is now represented.

Supported inline Actions expose named inputs such as Email subject/body, AI Task context/focus, notification message data and manual-review context.

Prototype `inputBindings[]` map one typed source into one `targetField`.

This proves:

`typed source output → named compatible Action input`

The local compatibility store `cmx-lab-automation-input-bindings-v1` is not production architecture. Production validates mappings against server-owned capability input/output schemas.

# AI Planner rule

Natural language eventually edits the same typed environment as human UI.

The Automation Planner can create/edit Automation Drafts. The broader Continuum Planner can propose a cross-domain Change Plan involving supported Directory, Automation and Library operations.

No shadow AI contact store, workflow format or database mutation path is allowed. Published Automation changes become new Draft/version proposals, and prompt text never grants authority.

Backend companion: `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`.

# Command center / scenarios

Top-level focused views remain Automations, Templates and Runs preview. Runs stays `RUNTIME OFF`.

Current scenarios: **13** ordinary editable Draft starting points.

# Capability Catalog

The browser-local catalog can show current prototype options and deliberate future concepts with `LAB NOW` / `LATER` states.

Future server registry metadata owns real capability/readiness truth and eventually the typed input/output schemas used by routing and Planner.

# Mobile contract

Preserve one primary work area, readable type/large tap targets, one-column choices, bottom-sheet/full-screen pickers, safe-area controls, no nested scroll traps, no horizontal overflow and no desktop canvas squeezed onto phone.

# Safety boundary

Both routes remain prototypes. They do not publish production Automations, execute providers, run external AI models, schedule authoritative work, mutate connected accounts or store provider secrets.

Keep focused `connect-src 'self'`.

# Regression protection

Validation should cover v3 compatibility, progressive blank-Draft truth, v4.3 layers, Directory/Audience integration, Directory AI setup preview, recommendations, typed data references, field input routing, stage tests, command-center views, exact/new Draft navigation, FLOW PREVIEW, production isolation, mobile smoke and no broad MutationObserver/eval/dynamic Function.
