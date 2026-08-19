# Check In Automations Frontend — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab v4 Automation experience

## Focused route

`https://db.cmxchat.com/lab/automations/`

This is the canonical place to operate, prototype and test the Automation UX. `/lab/` remains the larger Continuum / Check In Lab workspace and links into this route.

The focused route remains Lab-only. Its CSP keeps `connect-src 'self'`. It must not call the production Check In API, execute providers, schedule authoritative work, publish a production Automation or claim a Draft is live.

Strategic product direction is now canonical in:

`docs/continuum-automations-master-plan-CURRENT.md`

## Current frontend authority

The route keeps the proven v3 Draft engine and layers v4 product behavior on top.

Current loaded files:

- `lab/automations/index.html`;
- `assets/lab/lab-automations-app.css` — retained base/brand layer;
- `assets/lab/lab-automations-experience-v3.css` — accepted responsive editor foundation;
- `assets/lab/lab-automations-system-surface.css` — accepted system hierarchy/readability layer;
- `assets/lab/lab-automations-final-qa.css` — pending-state and screenshot regression layer;
- `assets/lab/lab-automations-platform-v4.css` — current v4 application/capability/mobile presentation;
- `assets/lab/lab-automations-experience-v3.js` — browser-local Draft, normalization, autosave and five-stage editor authority;
- `assets/lab/lab-automations-route-integration.js` — exact Draft/new deep links and return navigation only;
- `assets/lab/lab-automations-system-surface.js` — retained system-surface adaptation;
- `assets/lab/lab-automations-progressive-preview.js` — truthful new-Draft pending-state adapter;
- `assets/lab/lab-automations-platform-v4.js` — current command-center, capability, flow-navigation, step-test, Planner-preview and Runs-preview layer;
- `assets/lab/lab-automations-scenarios-v4.js` — expanded v3-compatible editable scenarios.

The old focused v2 builder and its enhancement runtimes remain repository history. They are not loaded by `/lab/automations/` and are not current UX authority.

## Why v3 remains underneath v4

V3 already owns useful, regression-tested prototype behavior:

- shared `cmx-lab-automations-v1` Draft compatibility;
- autosave/resume;
- multiple ordered Actions;
- reusable `action_ref` entries;
- timing and repeat prototype fields;
- deep links;
- safe local simulation;
- current target selection;
- legacy compatibility normalization.

V4 intentionally does not create a second Automation data model. It changes how the user operates the same Drafts and introduces a scalable capability-catalog direction.

Production must later rebuild accepted behavior in the protected React/frontend stack using typed backend services. LocalStorage adapters and DOM-presentation layers are not production architecture.

## Human workflow model

The accepted five stages remain:

- WHEN — Trigger;
- IF — Rules;
- DO — Actions;
- WAIT — start timing / recurrence presentation;
- TEST — Review, Finish and simulation.

Name and description remain metadata, not a blocking first screen.

Finish remains inside Review.

The backend preserves domain semantics instead of persisting these UI labels literally.

## Command-center dashboard

The focused route is now an application surface.

Current workspace navigation:

- **Automations** — current Draft / Published / Archived prototype workflow list;
- **Templates** — editable starting scenarios;
- **Runs** — explicit future Runtime preview, labeled `RUNTIME OFF`.

The Automations view includes:

- New Automation;
- search;
- system status;
- lifecycle tabs;
- actual Automation cards;
- direct access to the capability catalog.

Do not restore a large landing-page hero above the working surface.

## New Automation entry points

A normal manual click on `New automation` opens a chooser with:

1. Build manually;
2. start from a scenario/template;
3. AI Planner preview.

Every path conceptually leads to the same Automation Draft model.

The AI Planner preview is intentionally non-functional as AI. It makes the future Planner entry point visible while performing no model request, provider call or production mutation.

### Direct-new deep-link exception

The established integration URL:

`/lab/automations/?new=1&from=lab`

must continue to open a blank Draft directly on Trigger.

The v4 layer explicitly bypasses its creation chooser while the one-shot `new=1` parameter is present. This protects the main-Lab bridge and current mobile regression contract.

## Progressive Flow Preview

The accepted label remains **FLOW PREVIEW**.

Do not use `LIVE FLOW`. `LIVE` has a product-status meaning elsewhere in Continuum.

A new blank Draft must begin visibly incomplete:

- WHEN — Choose a trigger;
- IF — Not set yet;
- DO — Choose an action;
- WAIT — Not set yet;
- FINISH — Not set yet.

Rules:

- Trigger is visually unselected until chosen;
- optional Rules become `Always continue` only after that stage is confirmed;
- the internal compatibility Action placeholder remains hidden until the user selects an Action;
- Timing becomes `Immediately` only after the user confirms Timing without another start policy;
- Finish requires explicit choice for a new blank Draft;
- future stages remain unavailable until required earlier choices exist;
- configured templates/scenarios show their full stored flow;
- existing Drafts show their actual stored flow;
- new progressive Draft UI confirmation uses `cmx-lab-automation-progress-v1` only as Lab presentation state.

Production must preserve the principle: **never visually invent an unmade user selection**.

## Flow as navigator

V4 makes the visible flow interactive.

Selecting a Flow Preview node navigates to its relevant configuration stage:

- WHEN → Trigger;
- IF → Rules;
- DO → Actions;
- WAIT → Timing;
- FINISH → Review.

This is the current bridge toward the long-term split-editor model where the workflow remains visible while selected-step configuration happens beside it.

The flow is still intentionally linear because real branch/subflow Runtime behavior does not exist yet.

## Capability Catalog

V4 introduces a browser-local capability catalog as a UX architecture prototype.

The catalog currently includes Trigger, Condition, Action and future Workflow-control concepts.

Current prototype-usable entries proxy to existing v3 choices. Future entries are clearly labeled `LATER` and open an explanation instead of becoming executable.

Examples of later-preview families include:

- inbound email/reply events;
- Directory and Library events;
- Discord and SMS;
- acknowledgement;
- Library writes;
- Directory changes;
- approval;
- approved webhook/API capability;
- explicit inter-step WAIT;
- branch;
- reusable Automation/subflow.

Showing a future capability in the catalog does not mean the backend, Connection, Runtime or provider exists.

The catalog UI supports:

- category browsing;
- search;
- Lab-now versus later status;
- existing reusable Lab Actions.

The strategic destination is documented in the master plan. The future server should expose trusted typed registry metadata instead of copying this browser-local catalog as execution authority.

## Templates and scenarios

Templates create ordinary editable Drafts.

The original five built-in patterns remain:

- Missed check-in escalation;
- Daily briefing;
- Notify someone later;
- AI prepares report;
- Multi-step emergency contact.

V4 adds eight more v3-compatible scenarios:

- Weekly planning review;
- Grace-window heads-up;
- Final continuity review;
- AI note summary;
- Six-hour reminder;
- Daily records check;
- No-ack follow-up;
- AI briefing with review.

Current total: **13 editable starting patterns**.

The additional scenario layer writes normal shared Lab Drafts and reopens the exact new Draft through the existing `?automation=<id>` route. It does not introduce a scenario-specific persistence model.

## Actions

Current v3 Action behavior remains:

- ordered multiple steps;
- up/down controls;
- drag/drop on pointer-capable devices;
- duplicate;
- pause/enable;
- remove;
- replace type;
- protected target selection;
- searchable picker;
- reusable Lab Action references.

Current simple inline prototype types remain:

- Notify a person;
- Send email;
- AI task;
- Manual review.

`Send email` is still a definition/simulation concept only. It does not send.

The v4 picker wraps these current options in the wider capability-catalog UX and previews future families without making them active.

## Rules

Current prototype Rule types remain limited to the existing v3 concepts.

Multiple Rules support:

- Match all / AND;
- Match any / OR.

Future backend Conditions must remain typed and server-validated. Do not introduce a free-form executable condition language.

## Timing

The current WAIT stage continues to represent the action-sequence start policy and recurrence presentation.

Current start modes:

- Immediate;
- Delay;
- Exact date & time.

Current repeat choices:

- no repeat;
- daily;
- weekly;
- custom;
- until acknowledged.

Preserve the backend distinction:

- Trigger eligibility;
- action-sequence start policy;
- future explicit inter-step WAIT;
- recurrence;
- retry.

The browser never becomes authoritative scheduling infrastructure.

## Per-stage local testing

V4 adds **TEST THIS STEP** to the current stage.

These tests are explanatory local checks. They inspect the current Draft presentation and explicitly state that no external event source, provider, server scheduler or Runtime was used.

This is the product bridge toward real protected testing later, where safe sample events and fake-provider results can supply typed inputs/outputs.

## Review and simulation

Review remains the full preflight/simulation surface.

V4 adds a Continuum preflight boundary that clearly distinguishes:

- Draft structure;
- Lab-only simulation;
- Runtime being off.

Existing local validation and full animated simulation remain.

Simulation must never:

- send email/SMS/Discord;
- call a webhook;
- run an external AI model;
- mutate a connected account;
- schedule authoritative work;
- publish a production Automation.

Future production Review should use deterministic backend readiness output and exact blocking reasons, not cosmetic health percentages.

## Runs preview

The v4 dashboard includes a Runs surface so the future operating model is visible early.

It is explicitly a preview and displays `RUNTIME OFF`.

It must not transform local simulations into fake Runs or imply execution history exists.

Future authoritative Runs belong to the server Runtime and should expose exact occurrence, step, attempt, wait, input/output and error history.

## Mobile contract

Phone UX remains first-class, especially Samsung/Chrome-sized screens.

Preserve:

- one primary decision area at a time;
- readable copy without zooming;
- large tap targets;
- horizontally scrollable stage rail where needed;
- one-column Action and capability cards;
- mobile modal/bottom-sheet presentation;
- safe-area-aware controls;
- no nested editor scroll traps;
- no horizontal page overflow;
- rich black dark mode plus separately usable light mode;
- reduced-motion support.

Do not turn the future product into a scaled-down desktop node canvas.

## Shared Lab stores

Current prototype stores remain:

- Automations: `cmx-lab-automations-v1`;
- Automation UI progress: `cmx-lab-automation-progress-v1`;
- CRM/Directory: `cmx-lab-crm-v1`;
- Inventory: `cmx-lab-inventory-v1`;
- reusable Actions: `cmx-lab-actions-v1`;
- v4 platform marker: `cmx-lab-automations-platform-v4`.

These are browser-local prototype adapters.

Production must use PostgreSQL/server Drafts and protected domain services.

## Reusable Action references

The focused builder continues to store reusable Lab Action references explicitly as `action_ref` prototype entries.

It does not silently map saved SMS/Webhook/Digital Account/etc. definitions into the smaller inline Action list.

Future production must resolve, authorize and version/snapshot reusable definitions server-side for reproducible execution.

## Backend handoff

Canonical backend truth remains under:

`CMXChat/jay-app/specs/003-server-checkin/`

Production implementation must preserve:

- server-owned Draft persistence;
- typed Trigger / Condition / Action / outcome registries;
- stable protected IDs;
- ordered multiple Actions;
- immutable published AutomationVersions;
- protected Directory/Audience and Library references;
- timing/recurrence semantics;
- server authorization;
- future scheduler/worker authority;
- immutable Run/Audit history.

The v4 capability catalog does **not** authorize immediate backend widening. The already validated Phase 2A production migration remains the next backend release boundary before definition breadth is expanded.

## Regression protection

`.github/workflows/checkin-automations-validation.yml` now protects:

- syntax for v3, route, system, progressive, v4 platform and v4 scenario scripts;
- v4 asset load order;
- strict Lab CSP and no production API calls;
- no `eval`, dynamic Function or MutationObserver in presentation layers;
- v3 Draft/action compatibility;
- progressive pending-state contract;
- v4 command-center markers;
- Automations / Templates / Runs surfaces;
- capability-catalog presence;
- expanded scenario presence;
- exact direct-new mobile deep link opening the Trigger editor;
- `FLOW PREVIEW` remaining the accepted label;
- per-stage local-test control;
- no old name-first wizard;
- no old `Build the flow` landing-page hero.

Keep CI aligned whenever the focused route changes.
