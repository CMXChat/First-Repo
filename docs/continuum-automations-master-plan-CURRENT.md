# Continuum Automations Master Plan — CURRENT

Date: 2026-08-18
Status: Canonical Automation product/UX direction; Lab v4.1 implemented, protected Runtime/provider execution still later

# Purpose

Continuum Automations is the workflow-definition layer for Continuum.

Product goal:

- simple flows should feel obvious;
- complex flows should remain understandable;
- new capabilities should plug into the same builder without redesigning it;
- users and AI should compose the same typed building blocks;
- Runtime should eventually explain exactly what ran, under which published version, with which frozen inputs and authority.

Design lessons we deliberately combine:

- IFTTT — immediate Trigger/Action comprehension;
- Zapier — whole-flow visibility beside configuration;
- Make — composable scenarios;
- n8n — data flow and execution inspection;
- Apple Shortcuts — mobile action discovery and linear composition;
- Pipedream — test-event/per-step debugging discipline;
- Continuum — Directory, Library, Connections, version history, authority, AI and future Runtime inside one private environment.

Core principle:

**Simple flows should feel obvious. Complex flows should remain understandable. New capabilities should plug in without redesigning the product. AI should compose the same safe building blocks humans use. Runtime should always be able to explain exactly what happened.**

# Product boundaries

- `/doc/` explains Continuum and remains under its separate clarity freeze.
- `/lab/` is the broader experiment workspace.
- `/lab/automations/` is the focused Automation operating/testing surface.
- future protected Automations use server Drafts, typed services and the generated frontend client.
- future Runtime executes published definitions server-side and records actual Runs.

**Automation = the plan. Runtime = the execution layer.**

# Current Lab v4.1 stack

The focused route keeps the proven v3 Draft/persistence engine and layers current product behavior on top.

Current responsibilities:

- `lab-automations-experience-v3.js` — local Draft model, normalization, autosave, current five-stage editor;
- `lab-automations-progressive-preview.js` — truthful blank-Draft/pending-state behavior;
- `lab-automations-platform-v4.js` — command center, Capability Catalog, interactive flow, per-step tests, Planner preview and Runs preview;
- `lab-automations-scenarios-v4.js` — additional editable scenarios;
- `lab-automations-directory-v4.js` — Directory counts/readiness integration;
- `lab-automations-audience-v4.js` — typed multi-selector Audience Lab adapter;
- matching v4 CSS/QA layers — current desktop/mobile presentation.

The old focused v2 builder is history and is not loaded.

Production must later rebuild accepted behavior in React/FastAPI/PostgreSQL instead of copying localStorage and DOM adapters.

# Command center

Current top-level workspace views:

- Automations;
- Templates;
- Runs, explicitly marked `RUNTIME OFF`.

The dashboard prioritizes:

- New Automation;
- lifecycle state;
- actual Automation cards;
- search;
- system readiness;
- Capability Catalog access.

Templates are a creation tool, not the hero of the page.

When Runtime exists, the same cards can grow to show last Run, next occurrence, waiting/failure state and published version without redesigning the dashboard.

# Three ways to create

Normal `New automation` presents:

1. Build manually;
2. start from template/scenario;
3. AI Planner preview.

All three conceptually create/edit the same Automation Draft model.

Planner is visual only in Lab. No model request occurs.

Direct integration URL:

`/lab/automations/?new=1&from=lab`

continues to open a blank Draft directly on Trigger.

# Human workflow model

Accepted stages:

- WHEN — Trigger;
- IF — Rules;
- DO — Actions;
- WAIT — start timing / recurrence presentation;
- TEST — Review and simulation.

Finish remains inside Review.

Important backend distinctions remain separate:

- Trigger eligibility;
- action-sequence start policy;
- future explicit inter-step WAIT;
- recurrence;
- retry.

# Flow as navigator

FLOW PREVIEW is an interactive representation of the Draft.

Nodes navigate to their relevant stage:

- WHEN → Trigger;
- IF → Rules;
- DO → Actions;
- WAIT → Timing;
- FINISH → Review.

Blank Draft truth stays explicit:

- WHEN — Choose a trigger;
- IF — Not set yet;
- DO — Choose an action;
- WAIT — Not set yet;
- FINISH — Not set yet.

Never show compatibility defaults as user choices before confirmation.

The current flow stays linear because real branch/subflow Runtime behavior does not exist yet.

# Desktop model

Desktop should feel like operating a readable machine.

The whole flow remains visible while configuration happens beside it.

A giant infinite canvas is unnecessary for normal Automations. Graph complexity should arrive only when real branches/subflows justify it.

# Mobile model

Phone UX is first-class.

Never shrink a desktop workflow canvas onto a phone.

Use:

- readable vertical flow;
- one primary decision area at a time;
- large tap targets;
- one-column Action/capability lists;
- bottom-sheet/full-screen configuration surfaces;
- safe-area-aware controls;
- no nested scroll traps;
- no horizontal overflow;
- 16px form inputs where needed to avoid browser zoom;
- rich black dark mode and separately designed light mode.

Audience v4.1 follows the same model with a full-width mobile selector sheet.

# Capability Catalog

The main scalability decision is a **Capability Catalog**.

The builder cannot be redesigned every time options grow from 4 to 40 or 400.

Capability families:

- Triggers;
- Conditions;
- Actions;
- Workflow controls;
- Finish/outcome policies;
- Connection-provided capability;
- data sources and typed outputs.

The Lab catalog contains:

- current prototype-usable items labeled `LAB NOW`;
- future concepts labeled `LATER`.

Future catalog visibility never means backend/Runtime/provider implementation exists.

Large option breadth is handled through:

- recommendations;
- categories;
- search;
- context-aware ranking later;
- reusable user Actions;
- Connection-provided capabilities;
- explicit readiness/availability state.

# Capability ownership

Keep these concepts separate.

## Capability

Trusted executable/evaluable type owned by the platform/server registry.

## Connection

Approved path to an outside app, API, MCP service or provider.

## Action preset

Reusable user-owned configuration of a known Action type.

## Scenario/template

Reusable composition of existing typed pieces.

## Automation Draft

Mutable authoring state edited by human UI and later AI Planner.

## Automation Version

Immutable published definition.

## Run

Future Runtime execution of one exact AutomationVersion under one exact authority context.

Users and AI can create compositions. They do not invent arbitrary executable code/types.

# Templates / scenarios

Current total: **13 editable starting patterns**.

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

Templates create normal Drafts.

Future users/AI can save their own templates and reusable Action presets.

Reusable subflows come later after ordinary linear workflow + Runtime semantics are solid.

# Directory and typed Audience

Directory is a first-class Automation dependency.

The product should target stable protected identities, not copied email/phone strings.

Current Lab v4.1 proves a multi-selector audience model for communication Actions.

Supported Lab selectors:

- Person;
- Organization;
- Group;
- Label.

Prototype Draft fields:

```text
audienceSelectors[]
audienceResolution.mode = live_membership
audienceResolution.dedupe = person_id
```

Lab resolution:

1. direct People are included;
2. Organizations expand to current People;
3. Groups expand their current selectors;
4. Labels expand current matching People;
5. People are deduplicated by stable Person ID;
6. email/phone readiness is shown before use.

Compatibility with v3:

- one Person/Organization can mirror to the old `targetRef`;
- larger audiences use a compatibility `targetLabel` summary;
- `audienceSelectors[]` remains the richer Lab intent;
- the adapter flushes v3 Save and reloads the exact Draft so the v3 normalizer rehydrates the additional fields.

This compatibility technique must not become production architecture.

Production direction:

`published stable selectors → future Run eligibility → canonical server resolution → deduplicate People → readiness/authority checks → freeze exact recipients/contact endpoints → provider`

Historical Runs stay unchanged when Directory membership/contact methods later change.

# Actions

Current simple inline Lab types:

- Notify a person;
- Send email;
- AI task;
- Manual review.

Current v3 Action UX also supports:

- ordering;
- duplicate;
- pause/enable;
- remove;
- replace type;
- reusable Lab Action references.

The label `Notify a person` is retained compatibility copy even though Audience v4.1 can resolve more than one Person.

A later product pass may rename communication capability labels once the corresponding backend type model is deliberate.

# Data between steps

Future deeper workflows need typed output mapping.

Desired normal-user experience:

`Insert data → Trigger / Previous steps / Directory / Library`

Users should select readable tokens instead of being forced into expression syntax.

Advanced expression behavior can come later behind an explicit advanced mode.

The server capability registry should eventually describe typed outputs so the builder and AI Planner can reason about valid mappings.

# Testing

Every stage currently has **TEST THIS STEP** local explanatory checks.

Review has full-flow local simulation.

Future protected testing should support:

- sample Trigger event;
- step input preview;
- resolved Directory/Audience preview;
- typed output preview;
- fake-provider result;
- exact readiness/blockers;
- no external side effect unless the user deliberately runs an allowed live test.

# Review / preflight

Review should be one of Continuum's strongest product surfaces.

Never use cosmetic health percentages.

Show deterministic readiness such as:

- Trigger configured;
- Audience resolves;
- required channel readiness;
- ContentVersion available;
- Connection ready;
- timing valid;
- authority sufficient;
- Runtime/capability availability.

Current Lab v4.1 includes Directory readiness and communication Audience preflight.

Production readiness belongs to backend services.

# Connections

A Connection is not itself an Action.

Example:

Gmail Connection may later unlock:

- Email received Trigger;
- read thread capability;
- Send email Action;
- Draft email Action.

One Connection can make several typed capabilities available.

Provider secrets never belong in Automation Draft JSON.

# AI

AI has two distinct Automation roles.

## Planner

Natural language → typed Draft.

Planner edits the same Draft model as human UI.

AI changes to a published Automation become a new Draft/version proposal, never silent mutation of immutable history.

## AI Task

A bounded Action inside Runtime.

AI Task gets explicit objective, instructions, approved context/tools, autonomy boundary and limits.

Prompt text is intent, never authority.

## Agent

Agent behavior comes last, after deterministic Runtime, permissions, tool boundaries and observability are mature.

# Runtime

Automation is definition. Runtime is execution.

Future Runtime owns:

- Run;
- Occurrence;
- RunAction/step state;
- ExecutionAttempt;
- persisted waits;
- retries;
- provider results;
- acknowledgements/approvals/routes later;
- frozen recipient/content/version inputs;
- audit/observability.

No browser-owned sleeping/scheduling.

# Capability versioning

Published Automations must remain interpretable when a capability evolves.

Future capability registry needs stable identifier + version/schema semantics so old published AutomationVersions can still be understood and executed/migrated deliberately.

Do not let a registry edit silently reinterpret old immutable workflow history.

# Safe long-tail extensibility

Later generic HTTP/API or MCP capabilities can unlock long-tail integration without hand-coding every provider.

They require constraints such as:

- approved Connection;
- approved host/resource scope;
- secret separation;
- SSRF protection;
- method/schema limits;
- timeout/response limits;
- audit;
- authority/risk rules.

No unrestricted arbitrary webhook/code escape hatch.

# Backend order

Do not widen backend scope simply because the Lab is visually capable.

Current order remains:

1. safely migrate/deploy the validated Phase 2A Library + Automation source;
2. prove the separate protected `continuity.md` acceptance path;
3. widen Automation definitions in bounded typed families;
4. add protected Directory foundation in bounded slices;
5. add canonical audience resolution/readiness and typed Automation Audience;
6. Phase 2B protected human builder;
7. Phase 3 durable Runtime + fake provider;
8. Phase 4 one real low-risk provider;
9. Phase 5 waits/routes/retries/acknowledgements/approvals/escalation;
10. Phase 6 AI Task execution then Planner;
11. Phase 7 bounded Agent.

Exact cross-domain sequencing can overlap safely after the Phase 2A production release boundary, but no new work should destabilize that reviewed migration.

# Security

Preserve:

- protected sessions;
- exact Origin + CSRF for mutations;
- owner/scope checks;
- stable IDs;
- immutable published history;
- no provider secrets in definitions/content/prompts/Audit;
- no arbitrary Python/JS/shell/SQL/eval workflow code;
- no prompt-granted authority;
- no label/relationship-as-permission inference;
- no browser audience resolution as production authority;
- no broad document MutationObserver loops in accepted frontend paths.

# Validation target

A mature Automation product should answer:

- What starts this?
- Under what rules?
- What approved steps follow?
- Who/what does each step reference?
- When may it start/wait/repeat?
- Which data flows between steps?
- Is every required Connection/resource/recipient ready?
- Which authority permits consequential work?
- Which immutable definition was published?
- What exactly happened when Runtime ran it?

If complexity forces the user to mentally reconstruct the workflow from unrelated forms, the product architecture is wrong.
