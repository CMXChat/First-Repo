# Continuum Automations Master Plan — CURRENT

Date: 2026-08-18
Status: Canonical product/UX direction for Automations; Lab v4 implemented, production Runtime still later

## Purpose

Continuum Automations is the workflow-definition layer for Continuum.

The product goal is simple at the surface and deep underneath:

- a first-time user should understand a small Automation as `WHEN this happens → DO this`;
- a larger workflow should remain readable as rules, actions, timing and later branches are added;
- new capabilities should plug into the same builder without redesigning the product;
- users and AI should compose the same typed building blocks;
- Runtime should eventually be able to explain exactly what ran, under which published version, with which frozen inputs and authority.

The design target combines useful lessons from mature automation products without copying any one product:

- IFTTT: immediate Trigger/Action comprehension;
- Zapier: whole-flow visibility beside step configuration;
- Make: composable scenario thinking;
- n8n: execution inspection and data moving between steps;
- Apple Shortcuts: mobile-first action discovery and linear composition;
- Pipedream: test-event and per-step debugging discipline;
- Continuum: Directory, Library, Connections, version history, bounded authority, AI and future Runtime living in one private environment.

## Product principle

**Simple flows should feel obvious. Complex flows should remain understandable. New capabilities should plug in without redesigning the product. AI should compose the same safe building blocks humans use. Runtime should always be able to explain exactly what happened.**

## Product boundaries

Use the Continuum surfaces differently:

- `/doc/` explains Continuum and remains under its separate clarity freeze;
- `/lab/` is the broader Continuum / Check In experiment workspace;
- `/lab/automations/` is the focused Automation operating and testing surface;
- future protected Automations in `/checkin/` use server Drafts, typed services and the generated frontend client;
- future Runtime executes published definitions server-side and records actual Runs.

Automation remains the plan. Runtime remains the execution layer.

## Current Lab v4

The focused Lab route now keeps the proven v3 Draft/persistence engine and adds a v4 platform layer on top.

Current load authority:

- `assets/lab/lab-automations-experience-v3.js` owns current browser-local Automation data, normalization, autosave and the five-stage editor behavior;
- `assets/lab/lab-automations-progressive-preview.js` protects truthful new-Draft pending state;
- `assets/lab/lab-automations-platform-v4.js` owns the new command-center, capability-catalog, interactive-flow, step-test, Planner-preview and Runs-preview experience;
- `assets/lab/lab-automations-scenarios-v4.js` adds additional v3-compatible editable scenarios;
- `assets/lab/lab-automations-platform-v4.css` owns the v4 application/mobile presentation;
- older v2 builder files remain history and are not loaded by the focused route.

The v4 layer is additive because the accepted v3 compatibility behavior is useful and tested. Production must later rebuild accepted behavior in the protected React/frontend stack instead of copying the DOM-patch/localStorage architecture.

## Automations command center

The focused route is an application surface, not a product landing page.

Current top-level workspace views:

- Automations;
- Templates;
- Runs, explicitly marked as a preview while Runtime is off.

The command center keeps:

- New Automation;
- Draft / Published / Archived prototype lifecycle controls;
- system status;
- Automation cards;
- search;
- capability-catalog access;
- templates/scenarios as a separate working surface.

Automation cards should communicate the flow quickly, including Trigger, rules, primary Actions, timing, lifecycle and updated state.

When Runtime becomes real, the same cards can grow to include last Run, next occurrence, waiting/failure state and published version without requiring a new dashboard architecture.

## Three ways to create

A normal New Automation click now presents three entry paths:

1. Build manually;
2. start from a template/scenario;
3. AI Planner preview.

All three are conceptually paths to the same Automation Draft model.

The AI Planner is presentation-only in Lab. It makes the intended product entry point visible while explicitly performing no model request or production mutation.

The existing direct integration deep link remains different by design:

`/lab/automations/?new=1&from=lab`

It opens the blank Draft directly on Trigger so the main Lab bridge and mobile regression contract remain stable.

## Builder mental model

The accepted human model remains:

- WHEN — Trigger;
- IF — Rules;
- DO — Actions;
- WAIT — start timing / recurrence presentation;
- TEST — Review and simulation.

Finish behavior remains inside Review.

The backend must preserve semantics instead of copying these screen labels into storage.

Important domain distinction:

- Trigger determines eligibility;
- start policy determines when the Action sequence may begin after eligibility;
- future explicit WAIT is a persisted workflow step between Actions;
- recurrence creates future occurrences;
- retry responds to failed attempts.

These remain separate concepts even if the UI presents them as one readable flow.

## The flow is the navigator

The Flow Preview is no longer only a passive summary.

In v4, visible flow blocks are interactive navigation targets:

- WHEN opens Trigger;
- IF opens Rules;
- DO opens Actions;
- WAIT opens Timing;
- FINISH opens Review.

The accepted label remains **FLOW PREVIEW**. Do not call a local Draft preview `LIVE FLOW`.

A new blank Draft must continue to show pending truth:

- WHEN: Choose a trigger;
- IF: Not set yet;
- DO: Choose an action;
- WAIT: Not set yet;
- FINISH: Not set yet.

Internal compatibility defaults never become visible user intent until chosen or explicitly confirmed.

## Desktop interaction model

Desktop should feel like operating a readable machine.

The complete flow stays visible while the current stage is configured. The flow side panel follows normal document scrolling and does not become a second nested page scrollbar.

As the protected React builder is built later, the long-term target is a stronger split editor where the selected flow block and its configuration are visibly connected, while preserving the same readable linear path.

A large infinite-node canvas is not required for ordinary Automations. Graph expansion should arrive only when real branching/subflow complexity earns it.

## Mobile interaction model

Phone UX is first-class.

Never shrink a desktop workflow canvas onto a phone.

Current and future mobile rules:

- use a readable vertical workflow;
- one primary decision area at a time;
- large tap targets;
- horizontally scrollable stage rail where useful;
- one-column Action cards;
- modal/bottom-sheet capability selection;
- safe-area-aware controls;
- document-level scrolling;
- no horizontal overflow;
- no nested editor scroll traps;
- full-size input text to avoid mobile browser zoom;
- rich black dark mode and separately designed light contrast;
- reduced-motion support.

The future protected mobile builder can open a selected flow step as a full-screen configuration sheet and return to the same place in the flow.

## Capability Catalog

The central scalability decision is a Capability Catalog.

The builder must not be redesigned when the option count grows from 4 to 40 or 400.

Capability families include:

- Triggers;
- Conditions;
- Actions;
- Workflow controls;
- Finish/outcome policies;
- future Connection-provided capabilities;
- future data sources and typed outputs.

The v4 Lab catalog currently contains both usable prototype entries and clearly labeled future entries.

Current Lab-usable examples proxy to the existing v3 model:

- Grace begins;
- Grace expires;
- Manual start;
- Calendar time;
- current three Lab rule concepts;
- Notify a person;
- Send email as a non-sending prototype definition;
- AI task as a non-executing prototype definition;
- Manual review.

Future catalog previews include communication, Directory, Library, approval, webhook/API, WAIT, branch and reusable-subflow concepts.

Future entries are informational. They must not become executable merely because the Lab can display their names.

## Capability discovery

Large capability breadth must be handled with progressive disclosure.

A picker should support:

- recommended capabilities first;
- category browsing;
- search;
- context-aware recommendations later;
- reusable user Actions;
- Connection-provided capabilities;
- explicit availability/readiness state.

A basic user should see a small useful set. An advanced user can search the full catalog.

## Definitions versus user-created compositions

Keep these concepts separate:

### Capability

A trusted executable or evaluable type the platform knows how to validate and, later, run.

### Connection

An approved path to an outside app, API, MCP service or provider. A Connection can make a bundle of capabilities available.

### Action preset

A reusable user-created configuration of a known capability.

### Scenario / template

A reusable composition of existing typed pieces. Templates create ordinary editable Drafts.

### Automation Draft

The mutable workflow being authored by a human or, later, AI.

### Automation Version

An immutable published definition.

### Run

A future Runtime execution of an exact published AutomationVersion.

Users and AI may create endless compositions from existing capabilities. They do not gain authority to invent arbitrary executable code.

## Current scenarios

The Lab keeps the original five built-in editable templates and v4 adds eight more, for thirteen current starting patterns.

The v4 scenarios are:

- Weekly planning review;
- Grace-window heads-up;
- Final continuity review;
- AI note summary;
- Six-hour reminder;
- Daily records check;
- No-ack follow-up;
- AI briefing with review.

They use only shapes the current v3 prototype can represent. They create normal Drafts in the shared Lab store and reopen through the existing exact-Draft deep link.

Future templates can be authored by Continuum, users or AI. They remain compositions, not special workflow engines.

## Reusable Actions and future subflows

The existing Lab Action library remains the reusable definition source for `action_ref` prototype entries.

Longer term, users should also be able to save common workflow chunks as reusable subflows. This should arrive after linear Runtime behavior is solid.

A subflow must still have stable published identity, typed input/output contracts, scope checks and authority boundaries. Do not implement subflows as arbitrary pasted executable fragments.

## Testing while building

Testing is a primary Automation UX, not an afterthought.

V4 adds a local **TEST THIS STEP** control to each builder stage.

Current Lab step tests are intentionally explanatory simulations. They inspect the visible local definition and state that no external source, scheduler, provider or Runtime was used.

The existing full-flow simulation remains.

Future protected testing should become progressively more concrete:

- choose or create a safe sample Trigger event;
- show resolved typed inputs;
- show protected target resolution;
- preview data outputs;
- preview timing interpretation;
- use fake-provider execution before real providers;
- keep production side effects opt-in and explicitly bounded.

## Review / preflight

Review should feel like a preflight checklist, not a generic summary or cosmetic health score.

The v4 Lab adds a stronger Continuum preflight boundary around existing validation.

Future backend readiness should return deterministic, actionable issues such as:

- missing required Trigger/Action fields;
- unresolved protected references;
- unsupported capability type/version;
- missing Connection;
- missing sender identity;
- missing immutable content version;
- invalid timezone or recurrence interpretation;
- authority/approval requirement;
- invalid branch/route/cycle;
- Runtime capability unavailable.

Do not invent percentages.

## Data between steps

A major later capability is typed data mapping.

A later step should be able to select approved outputs from:

- the Trigger;
- earlier Actions;
- Directory;
- Library;
- normalized inbound events;
- future Runtime context.

The normal UI should expose readable tokens such as `Sender`, `Summary`, `Person name` or `Incident time`.

Advanced expression syntax, if ever needed, stays secondary and constrained. Data mapping must not become arbitrary executable code.

## Connections

Connections are separate from Actions.

For example, a future Gmail Connection may expose typed capabilities such as:

- Email received;
- read thread;
- send email;
- draft email;
- label message.

A GitHub Connection may expose repository events and Actions.

A Connection does not grant every capability automatically. Capability availability still depends on scope, identity, policy, authority and implementation support.

Provider secrets never belong in Automation JSON, content, browser storage, prompts or Audit.

## AI roles

AI has two distinct roles.

### Planner

Natural language becomes the same typed Automation Draft a human edits.

Planner may propose, add, remove or configure known capabilities through the same domain services. It must not create a shadow workflow format.

Changing a published Automation through AI creates or modifies a Draft. It never silently rewrites immutable published history.

### AI Task

A future bounded Action inside Runtime.

An AI Task definition can contain structured objective, instructions, approved context, approved tools, authority requirement and limits.

Prompt text expresses intent. Prompt text never grants authority.

Bounded Agent behavior comes later, after deterministic Runtime, capability grants and execution history are mature.

## Capability versions

Capabilities themselves will evolve.

A future server registry should preserve capability identifier and schema/handler version semantics so an old published Automation remains interpretable after a capability changes.

Published Automation history must retain enough information to answer what definition and capability semantics were active when it was published and, later, run.

Deprecation should be explicit. A removed/deprecated capability should produce readiness/migration guidance instead of silently changing workflow meaning.

## Future server Capability Registry

The trusted server registry should start in code, not as a database that lets users create arbitrary executable types.

A future read-only registry API may expose safe metadata needed by the builder, for example:

- stable capability ID;
- kind and category;
- display metadata;
- typed configuration schema/version;
- input/output field metadata;
- required Connection/capability prerequisites;
- risk/approval class;
- simulation/test support;
- current availability/deprecation status.

The frontend renders from known typed metadata. The backend remains the authority for validation and execution.

## Runtime destination

Runtime is intentionally outside the current Lab and current production truth.

Future Runtime should create durable records such as:

- Run;
- RunAction;
- Occurrence;
- ExecutionAttempt;
- persisted due/wait state;
- frozen content/recipient/provider inputs;
- result/error history.

The Runs surface should eventually let a user inspect the sequence of actual events, inputs, outputs, waits, attempts and failures.

The current v4 Runs tab is only a product preview and is explicitly labeled `RUNTIME OFF`.

## Build order

The accepted sequence remains deliberate.

### Now: Lab v4

- command-center dashboard;
- Automations / Templates / Runs surfaces;
- capability catalog;
- interactive Flow Preview;
- per-stage local tests;
- stronger preflight;
- thirteen editable starting scenarios;
- Planner entry-point preview;
- mobile-specific modal/bottom-sheet presentation;
- regression protection for v3 compatibility and direct deep links.

### Immediate backend release boundary

The already validated Phase 2A Library + typed Automation source must be migrated/deployed deliberately under the canonical production runbook before broad backend definition expansion.

### After the Phase 2A migration

Expand the real server registry in bounded increments. Add one typed definition family at a time, with API/service/database tests and no provider side effects until the architecture says otherwise.

### Phase 2B

Build the real protected human Automation editor in the official React frontend using server Drafts and the generated API client. Rebuild accepted Lab behavior as product code. Do not migrate localStorage/DOM-patch architecture.

### Phase 3

Durable Runtime with fake provider, persisted due work, idempotency, leases/claims, restart recovery and exact frozen snapshots.

### Phase 4

One real low-risk provider/Connection path.

### Phase 5

Explicit WAIT, routing/branching, retries, acknowledgements, approvals and escalation as typed Runtime capabilities.

### Phase 6

AI Task execution, then Planner.

### Phase 7

Bounded Agent behavior under explicit capability grants.

## Security and reliability guardrails

Preserve all of these:

- Lab `connect-src 'self'`;
- no production API from focused Lab;
- no real provider execution in Lab;
- no authoritative browser scheduling;
- no real Publish from Lab;
- no credentials/provider secrets in browser state;
- no arbitrary Python, JavaScript, shell, SQL or `eval` workflow logic;
- no unrestricted generic webhook/HTTP escape hatch;
- no prompt-granted authority;
- stable protected IDs;
- immutable published history;
- optimistic concurrency for real Drafts;
- exact Origin + CSRF on protected mutations;
- server-side ownership/scope checks;
- no broad document-wide MutationObserver loop;
- future Runtime idempotency and durable persisted work.

## Generic HTTP / API capability

A constrained generic HTTP capability can eventually provide long-tail extensibility, but it belongs late.

Before it can execute, it needs explicit protections around:

- approved Connection;
- host/domain allow-list or equivalent policy;
- SSRF defenses;
- allowed methods;
- separate secrets;
- payload/response limits;
- timeout;
- retry/idempotency policy;
- audit/redaction;
- capability grant and risk policy.

Do not use generic HTTP as an early shortcut around typed integrations.

## Documentation ownership

Use this file for the strategic product/UX/capability direction.

Use `checkin-automations-frontend-CURRENT.md` for exact current focused-route implementation and migration behavior.

Use `checkin-automations-system-surface-CURRENT.md` for the current operating-surface presentation contract.

Use `checkin-lab-automations-integration-CURRENT.md` for cross-route/shared-Lab integration.

Backend implementation truth remains under `CMXChat/jay-app/specs/003-server-checkin/`.

When a Lab idea conflicts with current backend truth, backend truth wins for production claims. The Lab may preview later capability only when the later status is explicit.
