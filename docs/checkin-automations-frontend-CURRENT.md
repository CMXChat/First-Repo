# Check In Automations Frontend — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab Automations v4.2 experience with Directory v2, typed Audience and typed data-reference UX

# Focused route

`https://db.cmxchat.com/lab/automations/`

This is the canonical Automation operating/prototyping/testing route. `/lab/` remains the broader Continuum / Check In Lab workspace.

The route remains Lab-only:

- CSP keeps `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no authoritative scheduling;
- no real Publish;
- no provider secrets;
- no external AI model call from Planner or Action testing.

Strategic direction:

`docs/continuum-automations-master-plan-CURRENT.md`

Directory/Audience truth:

`docs/checkin-directory-library-CURRENT.md`

# Current loaded stack

The focused route keeps the proven v3 behavior core and adds product layers after it.

Behavior/presentation files now include:

- `assets/lab/lab-automations-experience-v3.js/.css`;
- `assets/lab/lab-automations-route-integration.js`;
- `assets/lab/lab-automations-system-surface.js/.css`;
- `assets/lab/lab-automations-progressive-preview.js`;
- `assets/lab/lab-automations-final-qa.css`;
- `assets/lab/lab-automations-platform-v4.js/.css`;
- `assets/lab/lab-automations-platform-v4-qa.css`;
- `assets/lab/lab-automations-scenarios-v4.js`;
- `assets/lab/lab-automations-directory-v4.js/.css`;
- `assets/lab/lab-automations-audience-v4.js/.css`;
- `assets/lab/lab-automations-intelligence-v4.js/.css`.

Older focused v2 builder/enhancement files remain history and are not current route authority.

# Layer responsibilities

## V3 behavior core

V3 still owns:

- `cmx-lab-automations-v1` Draft compatibility;
- normalization;
- autosave/resume;
- five-stage editor;
- ordered Actions;
- reusable `action_ref` behavior;
- timing/repeat prototype fields;
- compatibility target fields;
- full local simulation;
- older shared-Lab compatibility.

V4 does not introduce a second workflow engine.

## Progressive Draft layer

A blank Draft remains truthfully incomplete:

- WHEN — Choose a trigger;
- IF — Not set yet;
- DO — Choose an action;
- WAIT — Not set yet;
- FINISH — Not set yet.

Compatibility defaults never appear as user intent before selection/confirmation.

## V4 platform layer

Owns:

- Automations / Templates / Runs;
- search;
- Capability Catalog;
- New Automation chooser;
- interactive Flow Preview navigation;
- Planner preview;
- preflight presentation;
- `RUNTIME OFF` Runs preview;
- current desktop/mobile application shell.

## V4 scenarios

Five original templates plus eight additional scenarios remain ordinary editable Draft starting points.

Current total: **13**.

## Directory integration

Shows Directory counts, Person/Organization readiness, Review readiness and navigation back to the main Directory.

## Audience v4.1

Communication Actions can select one or more:

- Person;
- Organization;
- Group;
- Label.

Prototype Draft intent:

`audienceSelectors[]`

with live-membership/dedupe metadata.

The browser resolves current unique People and previews email/phone readiness. Production resolution remains server-owned.

## Intelligence v4.2

Adds three related authoring/testing behaviors without adding execution authority.

### Contextual recommendations

The Actions stage shows a small **RECOMMENDED NEXT** set based on the current Trigger and existing flow.

Recommendations use the same Capability Catalog and preserve `LAB NOW` / `LATER` status. They never fabricate or silently insert a capability.

### Typed Use Data references

Each Action can open **Use data** and select friendly references from:

- Trigger outputs;
- Directory/Audience readiness values;
- outputs exposed by earlier Actions.

Prototype references mirror to Action `dataBindings[]` and are also protected from older v3 compatibility saves through:

`cmx-lab-automation-data-bindings-v1`

That separate local store is Lab scaffolding only.

The important product rule is the reference model:

`typed source → stable source ID → typed path → receiving field later`

This is **not** a free-form expression language. No arbitrary JavaScript, Python or template code is evaluated.

### Richer TEST THIS STEP

The v4.2 layer intercepts the existing stage-test control and renders a local input → normalize/resolve → sample output trace.

Examples include:

- Trigger normalized fields;
- current Rule list;
- Audience resolved People;
- email/phone readiness;
- mapped sample values;
- Action-specific simulated output;
- Timing interpretation;
- local Review blockers.

Every trace remains explicit that no provider, AI model, server Runtime, event source or connected account was used.

Test/simulation evidence is never authoritative Run history.

# Human workflow model

The accepted five stages remain:

- WHEN — Trigger;
- IF — Rules;
- DO — Actions;
- WAIT — start timing / recurrence presentation;
- TEST — Review, Finish and simulation.

Name/description remain metadata. Finish remains inside Review.

# Command center

Top-level views:

- **Automations** — Draft / Published / Archived prototype definitions;
- **Templates** — editable starting scenarios;
- **Runs** — future Runtime preview, explicitly `RUNTIME OFF`.

Keep this an operating surface. Do not restore a marketing-style billboard hero.

# New Automation

Normal `New automation` offers:

1. Build manually;
2. start from scenario/template;
3. AI Planner preview.

Planner does not invoke a model.

Direct integration URL:

`/lab/automations/?new=1&from=lab`

still bypasses the chooser and opens a blank Draft directly on Trigger.

# Flow Preview

Accepted label: **FLOW PREVIEW**.

Do not use `LIVE FLOW`.

Visible nodes navigate to:

- WHEN → Trigger;
- IF → Rules;
- DO → Actions;
- WAIT → Timing;
- FINISH → Review.

The current flow remains linear because real branch/subflow Runtime behavior does not exist yet.

# Capability Catalog

The browser-local catalog demonstrates scalable discovery across Trigger, Condition, Action and future workflow-control families.

It supports:

- categories;
- search;
- `LAB NOW` / `LATER` state;
- reusable Lab Actions;
- current contextual recommendations.

Future concepts such as inbound email, Discord/SMS, acknowledgement, approval, Library/Directory actions, WAIT, branch, subflow and constrained HTTP/API remain previews until matching backend/services/Connections/Runtime exist.

Production should eventually expose safe trusted registry metadata from the server-owned Capability Registry.

# Typed Audience v4.1 compatibility

V3 still expects `targetRef` / `targetLabel`.

The adapter preserves compatibility without treating those fields as canonical audience identity:

- one direct Person/Organization can mirror into `targetRef`;
- multi-selector/Group/Label audiences receive a readable compatibility `targetLabel`;
- richer intent remains `audienceSelectors[]`;
- the adapter flushes the normal v3 Save, writes the richer selectors and reloads the exact Draft so v3 rehydrates them.

This reload is Lab scaffolding. Production should use typed protected Draft mutations.

# Rules

Current Rule concepts remain prototypes with Match all / Match any behavior.

Future backend Conditions stay typed/server-validated. No free-form executable condition language.

# Timing

Current WAIT stage still presents sequence start timing and recurrence.

Keep backend concepts separate:

- Trigger eligibility;
- start policy;
- future inter-step WAIT;
- recurrence;
- retry.

Browser never owns authoritative scheduling.

# Review / simulation

Review can include:

- complete flow;
- Finish behavior;
- local validation;
- Directory readiness;
- Audience preflight;
- richer v4.2 stage traces;
- local animated full-flow simulation/log.

Future protected Review should use deterministic backend readiness and exact blockers.

# Mobile contract

Preserve:

- one primary decision area at a time;
- large tap targets;
- readable inputs without browser zoom;
- one-column Action/capability/data-reference choices;
- bottom-sheet/full-screen-style modals;
- safe-area-aware action footers;
- no nested scroll traps;
- no horizontal overflow;
- rich black dark mode plus separately usable light mode;
- reduced-motion support.

Do not shrink a desktop node canvas onto a phone.

# Current relevant Lab stores

- Automation Drafts: `cmx-lab-automations-v1`;
- progressive UI state: `cmx-lab-automation-progress-v1`;
- Directory: `cmx-lab-crm-v1`;
- reusable Actions: `cmx-lab-actions-v1`;
- v4 platform marker/preferences: `cmx-lab-automations-platform-v4`;
- typed data-reference compatibility store: `cmx-lab-automation-data-bindings-v1`.

`audienceSelectors[]` and `dataBindings[]` belong to the normal Automation/Action prototype intent where possible. Extra local stores exist only to survive the older compatibility engine.

# Production migration rule

Production must rebuild accepted semantics in the protected React/FastAPI/PostgreSQL application.

Do not copy:

- localStorage persistence;
- DOM patch layers;
- browser audience resolution as authority;
- compatibility target summaries as identity;
- browser reload save behavior;
- browser data mapping as authoritative validation;
- client-generated Runtime/Audit truth.

Production needs server Drafts, optimistic concurrency, typed Directory/Audience services, typed data references, immutable AutomationVersions, deterministic preflight and later Runtime execution snapshots.

# Backend truth

Current validated Phase 2A backend remains much smaller than the Lab:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: `manual_review`;
- start policy: `immediate`;
- simple Finish;
- no real Conditions;
- no production Directory/Audience service;
- no production data-mapping service;
- no provider execution;
- no Runtime;
- no AI execution.

The prepared Phase 2A production migration/deployment remains the immediate backend boundary before broad new schema/domain work.

# Regression protection

Current CI should protect:

- v3 compatibility/autosave core;
- progressive pending-state truth;
- v4 platform/scenarios;
- Directory/Audience layers;
- v4.2 recommendations/data-reference/test layers;
- self-only CSP and production isolation;
- direct-new mobile behavior;
- `FLOW PREVIEW` naming;
- no `MutationObserver`, `eval` or dynamic Function in current v4 adapters;
- desktop/mobile smoke markers;
- the distinction between Lab simulation and production authority.
