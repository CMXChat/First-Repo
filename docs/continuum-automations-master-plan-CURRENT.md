# Continuum Automations Master Plan — CURRENT

Date: 2026-08-18
Status: Canonical Automation product/UX direction; Lab v4.3 implemented, protected Runtime/provider execution still later

# Purpose

Continuum Automations is the workflow-definition layer for Continuum.

Product goal:

- simple flows should feel obvious;
- complex flows should remain understandable;
- new capabilities should plug into the same builder without redesigning it;
- users and AI should compose the same typed building blocks;
- Runtime should eventually explain exactly what ran, under which published version, with which frozen inputs and authority.

Design lessons deliberately combined:

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

- `/doc/` explains Continuum and remains under its clarity freeze.
- `/lab/` is the broader experiment workspace.
- `/lab/automations/` is the focused Automation operating/testing surface.
- future protected Automations use server Drafts, typed services and the generated frontend client.
- future Runtime executes published definitions server-side and records actual Runs.

**Automation = the plan. Runtime = the execution layer.**

# Current Lab v4.3 stack

The focused route keeps the proven v3 Draft/persistence engine and layers current product behavior on top.

Current responsibilities:

- `lab-automations-experience-v3.js` — local Draft model, normalization, autosave, five-stage editor;
- `lab-automations-progressive-preview.js` — truthful blank-Draft/pending-state behavior;
- `lab-automations-platform-v4.js` — command center, Capability Catalog, interactive flow, Planner preview and Runs preview;
- `lab-automations-scenarios-v4.js` — additional editable scenarios;
- `lab-automations-directory-v4.js` — Directory counts/readiness integration;
- `lab-automations-audience-v4.js` — typed multi-selector Audience Lab adapter;
- `lab-automations-intelligence-v4.js` — contextual recommendations, typed data-reference UX and richer local step testing;
- `lab-automations-input-routing-v4.js` — field-level mapping from a typed source to a specific receiving Action input;
- matching v4 CSS/QA layers — current desktop/mobile presentation.

The old focused v2 builder is history and is not loaded.

Production must later rebuild accepted behavior in React/FastAPI/PostgreSQL instead of copying localStorage and DOM adapters.

# Command center

Current top-level workspace views:

- Automations;
- Templates;
- Runs, explicitly marked `RUNTIME OFF`.

The dashboard prioritizes New Automation, lifecycle state, actual Automation cards, search, system readiness and Capability Catalog access.

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

Use readable vertical flow, one primary decision area at a time, large tap targets, one-column choices, bottom-sheet/full-screen configuration surfaces, safe-area-aware controls, no nested scroll traps and no horizontal overflow.

Audience, data-reference and input-routing selectors follow the same mobile rule.

# Capability Catalog

The main scalability decision is a **Capability Catalog**.

The builder cannot be redesigned every time options grow from 4 to 40 or 400.

Capability families include Triggers, Conditions, Actions, Workflow controls, Finish/outcome policies, Connection-provided capabilities, data sources and typed outputs.

The Lab catalog contains current prototype-usable items labeled `LAB NOW` and future concepts labeled `LATER`.

Future catalog visibility never means backend/Runtime/provider implementation exists.

Large option breadth is handled through contextual recommendations, categories, search, reusable user Actions, Connection-provided capabilities later and explicit readiness/availability state.

## Contextual recommendations now proven in Lab

Automations v4.2 derives a small **RECOMMENDED NEXT** set from current Trigger/flow context.

Recommendations use the same Capability Catalog. They never create hidden capability types or silently mutate the Draft.

Future ranking can use typed capability metadata, current Connections, Directory readiness and workflow context while preserving that rule.

# Capability ownership

Keep Capability, Connection, Action preset, Scenario/template, Automation Draft, immutable Automation Version and future Run as distinct concepts.

Users and AI can create compositions. They do not invent arbitrary executable code/types.

# Templates / scenarios

Current total: **13 editable starting patterns**.

Templates create normal Drafts.

Future users/AI can save their own templates and reusable Action presets.

Reusable subflows come later after ordinary linear workflow + Runtime semantics are solid.

# Directory and typed Audience

Directory is a first-class Automation dependency.

The product should target stable protected identities, not copied email/phone strings.

Current Lab v4.1 proves a multi-selector audience model for communication Actions using Person, Organization, Group and Label selectors.

The browser resolves current unique People and previews channel readiness. That is product-prototyping behavior only.

Production direction remains:

`published stable selectors → future Run eligibility → canonical server resolution → deduplicate People → readiness/authority checks → freeze exact recipients/contact endpoints → provider`

Historical Runs stay unchanged when Directory membership/contact methods later change.

# Actions

Current simple inline Lab types remain Notify, Email, AI Task and Manual Review, plus reusable Lab Action references.

Current v3 Action UX supports ordering, duplicate, pause/enable, remove and replacement.

The capability labels can evolve later when matching backend types become deliberate.

# Typed data between steps

This is now **Lab-proven UX**, while server validation remains future work.

Automations v4.2 adds **Use data** to Action cards.

A user can select readable typed references from:

- Trigger outputs;
- earlier Action outputs;
- Directory/Audience readiness values.

Examples include Trigger time/type, AI summary/priority, prior step status and resolved Audience counts.

Prototype references are mirrored to Action `dataBindings[]` and protected from older v3 compatibility saves through:

`cmx-lab-automation-data-bindings-v1`

That extra local store is compatibility scaffolding, not production architecture.

The durable product model is:

`typed source → stable source/step ID → typed output path → compatible receiving field`

The normal-user UI should keep showing readable tokens. The backend stores/validates typed references.

Do **not** make arbitrary JavaScript, Python, shell, SQL or template expressions the normal mapping model.

Later data sources can include Library, normalized inbound Event/Conversation data, Connection outputs and Runtime context once those domains are real.

# Field input routing v4.3

V4.3 proves the receiving side of that model.

An Action can map a typed source into a named input slot such as:

- Email subject;
- Email body data;
- AI task context;
- AI task focus value;
- notification message data;
- manual-review context.

Prototype intent uses `inputBindings[]` entries with:

- `targetField`;
- typed source kind;
- stable source/step ID;
- typed output path;
- readable display label.

The Lab also uses `cmx-lab-automation-input-bindings-v1` as compatibility scaffolding so the older v3 Draft engine does not erase the richer field-routing prototype.

Production should not copy that local store. The server Automation Draft should carry validated typed input bindings directly.

The important future rule is that the capability registry describes both **outputs** and **receiving input fields**, allowing human UI and AI Planner to produce only compatible mappings.

# Testing

`TEST THIS STEP` is now a richer Lab proving surface.

V4.2 can show a local input → normalization/resolution → sample output trace for Trigger, Rules, Actions, Timing and Review/preflight.

Action traces can show resolved Audience counts, channel readiness, mapped-data sample values and simulated output text.

Every trace explicitly states that no provider, AI model, Runtime, real event source or connected account was used.

Future protected testing should evolve toward typed sample events, real server definition validation, fake-provider Runtime tests and only later explicitly authorized real-provider tests.

Simulation/test history stays separate from authoritative Runs.

# Review / preflight

Review should be one of Continuum's strongest product surfaces.

Never use cosmetic health percentages.

Show deterministic readiness such as Trigger configured, Audience resolves, required channel readiness, typed input references resolve, ContentVersion available, Connection ready, timing valid, authority sufficient and Runtime/capability availability.

Current Lab includes Directory/Audience readiness, input-routing summary and richer local structural blockers.

Production readiness belongs to backend services.

# Connections

A Connection is not itself an Action.

One Connection can make several typed capabilities available.

Provider secrets never belong in Automation Draft JSON.

# AI

AI has distinct Continuum roles, but all of them use the same typed domain services as human UI.

## Automation Planner

Natural language → the same typed Automation Draft humans edit.

The Planner can eventually choose known capabilities, create/reorder Actions, choose stable Directory audiences, wire typed input/output references and propose timing/rules.

AI changes to a published Automation become the next mutable Draft/version proposal, never silent mutation of immutable history.

## Cross-domain Continuum Planner

The broader product should also support requests that span Automations plus Directory/Library, for example:

“Organize my emergency contacts, create a Family group, and build a missed Check In escalation using them.”

That becomes a structured **Change Plan** containing typed operations against the owning domains.

The flow is:

`natural-language intent → Change Plan → deterministic preflight/conflicts → review/approval → normal protected domain mutations`

The Planner may author Automation Draft state, Directory records/relationships/Groups and supported Library structures, but it does not get a hidden database/admin path.

Prompt text never grants authority. The Planner cannot publish consequential work, merge identities, broaden standing authority or invent executable capabilities unless the relevant protected service and authority path permit it.

Backend companion:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`

## AI Task

A bounded Action inside future Runtime with explicit context/tools/output/limits.

Prompt text is intent, never authority.

## Agent

Agent behavior comes last, after deterministic Runtime, permissions, tool boundaries and observability are mature.

# Runtime

Future Runtime owns Run, Occurrence, step state, ExecutionAttempt, persisted waits, retries, provider results, later acknowledgements/approvals/routes and frozen execution snapshots.

No browser-owned sleeping/scheduling.

# Capability versioning

Published Automations must remain interpretable when capabilities evolve.

Future registry needs stable identifier + version/schema semantics so old immutable AutomationVersions can still be understood and deliberately migrated.

# Safe long-tail extensibility

Later generic HTTP/API or MCP capabilities can unlock long-tail integration only with approved Connections, resource/host scope, secret separation, SSRF defenses, bounds, Audit and authority rules.

No unrestricted code/webhook escape hatch.

# Backend order

Do not widen backend scope simply because the Lab is visually capable.

Current order remains:

1. safely migrate/deploy the validated Phase 2A Library + Automation source;
2. prove the separate protected `continuity.md` acceptance path;
3. widen Automation definitions in bounded typed families;
4. add protected Directory foundation in bounded slices;
5. add canonical audience resolution/readiness and typed Automation Audience;
6. add typed data-reference + receiving-input validation as Action/Trigger schemas become real;
7. Phase 2B protected human builder;
8. Phase 3 durable Runtime + fake provider;
9. Phase 4 one real low-risk provider;
10. Phase 5 waits/routes/retries/acknowledgements/approvals/escalation;
11. Phase 6 AI Task execution then Automation Planner;
12. cross-domain Change Plan execution after the relevant domain mutation services are mature;
13. Phase 7 bounded Agent.

Planner UX/contracts can be designed before execution exists, but AI must not become the implementation path for domain capabilities that normal human/API services do not support.

Exact cross-domain sequencing can overlap safely after the Phase 2A production release boundary, but no new work should destabilize that reviewed migration.

# Security

Preserve protected sessions, Origin/CSRF, owner/scope checks, stable IDs, immutable history, secret separation, typed references, explicit authority and the prohibition on arbitrary workflow code.

Browser audience resolution and data mapping never become production authority.

AI Planner must never treat natural-language instructions as authority or gain a shadow mutation path.

No broad document MutationObserver loops in accepted frontend paths.

# Validation target

A mature Automation product should answer clearly:

- What starts this?
- Under what rules?
- What approved steps follow?
- Who/what does each step reference?
- When may it start/wait/repeat?
- Which typed data flows between steps?
- Which receiving field gets each mapped value?
- Is every required Connection/resource/recipient ready?
- Which authority permits consequential work?
- Which immutable definition was published?
- What exact changes did AI propose if it helped build the workflow?
- What exactly happened when Runtime ran it?

If complexity forces the user to mentally reconstruct the workflow from unrelated forms, the product architecture is wrong.
