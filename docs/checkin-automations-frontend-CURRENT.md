# Check In Automations Frontend — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab Automations v4.1 experience with Directory v2 + typed Audience integration

# Focused route

`https://db.cmxchat.com/lab/automations/`

This is the canonical Automation operating/prototyping/testing route.

`/lab/` remains the broader Continuum / Check In Lab workspace.

The focused route remains Lab-only:

- CSP keeps `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no authoritative scheduling;
- no real Publish;
- no provider secrets;
- no AI model call from Planner preview.

Strategic direction:

`docs/continuum-automations-master-plan-CURRENT.md`

Directory/Audience truth:

`docs/checkin-directory-library-CURRENT.md`

# Current frontend authority

The route keeps the proven v3 Draft engine and layers current product behavior on top.

Loaded files:

- `lab/automations/index.html`;
- `assets/lab/lab-automations-app.css`;
- `assets/lab/lab-automations-experience-v3.css`;
- `assets/lab/lab-automations-system-surface.css`;
- `assets/lab/lab-automations-final-qa.css`;
- `assets/lab/lab-automations-platform-v4.css`;
- `assets/lab/lab-automations-platform-v4-qa.css`;
- `assets/lab/lab-automations-directory-v4.css`;
- `assets/lab/lab-automations-audience-v4.css`;
- `assets/lab/lab-automations-experience-v3.js`;
- `assets/lab/lab-automations-route-integration.js`;
- `assets/lab/lab-automations-system-surface.js`;
- `assets/lab/lab-automations-progressive-preview.js`;
- `assets/lab/lab-automations-platform-v4.js`;
- `assets/lab/lab-automations-scenarios-v4.js`;
- `assets/lab/lab-automations-directory-v4.js`;
- `assets/lab/lab-automations-audience-v4.js`.

The old focused v2 builder/enhancement files remain history. They are not loaded by the focused route.

# Layer responsibilities

## V3 behavior core

`lab-automations-experience-v3.js` owns:

- `cmx-lab-automations-v1` Draft compatibility;
- Draft normalization;
- autosave/resume;
- five-stage editor;
- ordered Actions;
- reusable `action_ref` behavior;
- timing/repeat prototype fields;
- target compatibility fields;
- local simulation;
- legacy shared-Lab compatibility fields.

## Progressive-preview layer

Protects truthful new-Draft state.

Blank Draft begins as:

- WHEN — Choose a trigger;
- IF — Not set yet;
- DO — Choose an action;
- WAIT — Not set yet;
- FINISH — Not set yet.

Internal defaults/placeholders must never appear as user intent before they are chosen/confirmed.

## V4 platform layer

Owns the current application/command-center experience:

- Automations / Templates / Runs views;
- search;
- Capability Catalog;
- New Automation chooser;
- interactive Flow Preview navigation;
- per-stage local tests;
- stronger preflight presentation;
- Planner preview;
- future Runs preview marked `RUNTIME OFF`;
- desktop/mobile v4 application presentation.

## V4 scenario layer

Adds eight editable scenarios to the original five templates.

Current total: **13 editable starting patterns**.

## Directory integration layer

Shows:

- Directory People/Organization/Group totals;
- Person email/phone readiness;
- Organization member/readiness counts;
- Directory readiness in Review;
- link back to the main Directory.

## Audience v4.1 layer

Communication Actions now use the typed multi-selector Audience Lab adapter.

Selectors can reference:

- Person;
- Organization;
- Group;
- Label.

The Lab stores prototype fields:

```text
audienceSelectors[]
audienceResolution.mode = live_membership
audienceResolution.dedupe = person_id
```

The browser resolves current People, deduplicates by Person ID and previews email/phone readiness.

# Human workflow model

The accepted five stages remain:

- WHEN — Trigger;
- IF — Rules;
- DO — Actions;
- WAIT — start timing / recurrence presentation;
- TEST — Review, Finish and simulation.

Name/description remain metadata.

Finish remains inside Review.

# Command center

Current top-level views:

- **Automations** — Draft / Published / Archived prototype definitions;
- **Templates** — editable starting scenarios;
- **Runs** — future Runtime preview, explicitly `RUNTIME OFF`.

The route should feel like an application, not a product landing page.

Do not restore a billboard hero above the working Automations list.

# New Automation

Normal `New automation` opens:

1. Build manually;
2. start from scenario/template;
3. AI Planner preview.

Planner is visual/prototype behavior only and does not invoke a model.

## Direct-new exception

`/lab/automations/?new=1&from=lab`

must still open a blank Draft directly on Trigger.

This protects the `/lab/` bridge and mobile regression contract.

# Flow Preview

Accepted label: **FLOW PREVIEW**.

Do not use `LIVE FLOW`.

V4 makes visible Flow Preview nodes navigable:

- WHEN → Trigger;
- IF → Rules;
- DO → Actions;
- WAIT → Timing;
- FINISH → Review.

The current flow remains linear. Real branch/subflow Runtime does not exist yet.

# Capability Catalog

The browser-local Capability Catalog is a UX architecture prototype.

It supports:

- Trigger;
- Condition;
- Action;
- future Workflow-control concepts;
- search;
- categories;
- `LAB NOW` versus `LATER` status;
- reusable Lab Actions.

Later-preview concepts can include inbound email/reply, Discord/SMS, Directory/Library events, acknowledgement, approval, explicit WAIT, branch, reusable subflow and constrained HTTP/API.

A catalog item labeled `LATER` is not backend/runtime/provider capability.

Production should eventually receive trusted typed capability metadata from server-owned registries.

# Templates / scenarios

Original five:

- Missed check-in escalation;
- Daily briefing;
- Notify someone later;
- AI prepares report;
- Multi-step emergency contact.

V4 additions:

- Weekly planning review;
- Grace-window heads-up;
- Final continuity review;
- AI note summary;
- Six-hour reminder;
- Daily records check;
- No-ack follow-up;
- AI briefing with review.

Every scenario creates an ordinary editable shared Draft.

# Actions

Current v3 behavior remains:

- ordered multiple Actions;
- move up/down;
- pointer drag/drop;
- duplicate;
- pause/enable;
- remove;
- replace type;
- reusable Lab Action references.

Current simple inline Action types remain:

- Notify a person;
- Send email;
- AI task;
- Manual review.

Names are compatibility/user labels. `Notify a person` can now carry a multi-selector Audience in Lab.

`Send email` remains simulation/definition only and does not send.

# Typed Audience v4.1

For communication Actions, clicking the old Target control is intercepted by the Audience manager.

The modal allows multiple selections across People, Organizations, Groups and Labels.

Resolution behavior:

1. directly selected People are included;
2. Organizations expand to current People;
3. Groups expand their current Person/Organization/Label selectors;
4. Labels expand matching People;
5. overlapping People are deduplicated by stable Person ID;
6. email-ready and phone-ready counts are shown;
7. resolved People are previewed before applying.

## V3 compatibility behavior

V3 still expects `targetRef` / `targetLabel`.

The v4.1 adapter preserves that without treating it as canonical audience identity:

- one direct Person/Organization selector mirrors into `targetRef`;
- multi-selector/Group/Label audiences write a readable compatibility `targetLabel`;
- canonical Lab intent remains `audienceSelectors[]`;
- the adapter triggers the normal v3 Save before writing Audience changes;
- it then updates the shared Draft and reloads the exact Automation so v3 rehydrates/preserves the additional fields on later autosaves.

This reload is Lab compatibility scaffolding. Production must use normal protected Draft mutations and return updated typed state without a browser reload requirement.

# Rules

Current Rule types remain the existing v3 prototype concepts.

Multiple Rules support:

- Match all / AND;
- Match any / OR.

Future backend Conditions remain typed/server-validated. No free-form executable condition language.

# Timing

Current WAIT stage still presents action-sequence start timing and recurrence.

Start modes:

- Immediate;
- Delay;
- Exact date & time.

Repeat choices:

- none;
- daily;
- weekly;
- custom;
- until acknowledged.

Keep separate in backend architecture:

- Trigger eligibility;
- start policy;
- future inter-step WAIT;
- recurrence;
- retry.

Browser never owns authoritative scheduling.

# Testing / Review

Every stage can show **TEST THIS STEP** local explanatory checks.

Review contains:

- complete flow;
- Finish behavior;
- local validation;
- Directory readiness;
- Audience preflight for communication Actions;
- local animated simulation;
- local simulation log.

Simulation must never send a message, call a webhook, run an external AI model, mutate an outside account, create authoritative scheduling or publish a production Automation.

Future protected Review should use deterministic backend readiness output and exact blocking reasons.

# Runs preview

The Runs view exists only to establish the future operating model.

It is labeled `RUNTIME OFF` and must never turn local simulation into fake authoritative Run history.

# Mobile contract

Preserve:

- one primary decision area at a time;
- large tap targets;
- readable copy without zooming;
- horizontally scrollable stage rail when necessary;
- one-column Action/capability cards;
- mobile modal/bottom-sheet behavior;
- full-width Audience selector sheet with one-column options;
- safe-area-aware action footer;
- no nested scroll traps;
- no horizontal overflow;
- rich black dark mode and separately usable light mode;
- reduced-motion support.

Do not make mobile a shrunken desktop node canvas.

# Shared Lab stores

Current relevant stores:

- Automations: `cmx-lab-automations-v1`;
- Automation UI progress: `cmx-lab-automation-progress-v1`;
- Directory: `cmx-lab-crm-v1`;
- Directory UI preference: `cmx-lab-directory-ui-v2` on the main Lab route;
- Inventory: `cmx-lab-inventory-v1`;
- reusable Actions: `cmx-lab-actions-v1`;
- v4 platform marker/preferences: `cmx-lab-automations-platform-v4`.

`audienceSelectors[]` lives inside the normal Automation Draft object, not a second Audience localStorage database.

# Production migration rule

Production must rebuild accepted behavior in the protected React/FastAPI/PostgreSQL application.

Do not copy:

- localStorage persistence;
- DOM patching;
- browser audience resolution as authority;
- compatibility `targetLabel` as canonical audience identity;
- reload-after-audience-save behavior;
- client-generated execution/Audit truth.

Production needs:

- server Draft persistence;
- optimistic concurrency;
- protected Directory services;
- typed Audience selectors;
- canonical server audience resolution/readiness;
- immutable published AutomationVersions;
- future Runtime recipient snapshots;
- generated frontend client integration.

# Backend truth

Current validated Phase 2A backend is still much smaller than this Lab surface.

Current real backend definition subset:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: `manual_review`;
- start policy: `immediate`;
- simple Finish;
- no real Conditions;
- no production Directory v2/Audience service;
- no provider execution;
- no Runtime;
- no AI execution.

The Phase 2A production migration/deployment remains the immediate backend boundary before broad new Directory/Automation schema work.

# Regression protection

Current workflows should protect:

- v3 syntax/compatibility core;
- progressive blank-Draft truth;
- v4 command center;
- v4 scenarios;
- Directory integration;
- Audience v4.1 source/styling;
- self-only focused CSP;
- no production API reference;
- direct-new mobile behavior;
- no `MutationObserver`, `eval` or dynamic Function in current v4 adapters;
- desktop/mobile smoke markers;
- the distinction between Lab audience resolution and production authority.
