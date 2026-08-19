# Automations System Surface — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab Automations v4.3 operating-surface contract

# Purpose

`/lab/automations/` is a private workflow operating surface inside Continuum Lab. It should feel like an application for building, inspecting and safely testing Automation definitions, never a marketing page or second `/doc/`.

Current v4.3 changes presentation, discovery, local composition, typed-reference/input-routing UX and simulation only. It creates no production execution authority, provider behavior, authoritative scheduling or production schema.

Read with `continuum-automations-master-plan-CURRENT.md`, `checkin-automations-frontend-CURRENT.md` and `checkin-directory-library-CURRENT.md`.

# Dashboard and builder

Keep the command-center hierarchy: compact app header, New Automation, Automations/Templates/Runs, search + Capability Catalog, system/Directory state, lifecycle controls, actual Automation cards, then scenarios.

Runs remains a preview and shows `RUNTIME OFF`.

Accepted builder stages remain:

- WHEN / Trigger;
- IF / Rules;
- DO / Actions;
- WAIT / Timing;
- TEST / Review.

Finish stays inside Review. `FLOW PREVIEW` remains the accepted interactive flow name. Blank Drafts stay visibly incomplete until choices are made/confirmed.

# Capability discovery

Operating rule: **catalog breadth without interface clutter**.

Support relevant options first, categories, search, reusable Actions, explicit availability and future Connection-provided capability.

`LAB NOW` means the prototype can represent the choice. `LATER` remains non-executable.

V4.2 adds `RECOMMENDED NEXT`, derived from current Trigger/flow context while reusing the same Capability Catalog. Recommendations never silently mutate the Draft or upgrade a future capability into a current one.

# Directory / Audience

Directory is a first-class Automation input.

Current Lab can compose communication audiences from Person, Organization, Group and Label selectors, resolve unique People and preview channel readiness.

Keep these concepts distinct:

- selector = saved audience intent;
- resolved People = current preview;
- readiness = current channel availability;
- future Run snapshot = exact recipients/endpoints actually used.

Browser resolution remains Lab-only.

# Typed data and input routing

V4.2 gives Actions `Use data` for friendly typed references from Trigger, previous Actions and Directory/Audience values.

V4.3 adds **INPUT ROUTING**, assigning one typed source to a specific receiving Action field.

Current example input slots include Email subject/body, AI Task context/focus, notification message data and manual-review context.

Normal model:

`typed source → stable source/step ID → typed output path → named compatible receiving field`

Do not introduce free-form JavaScript/Python/template execution as the normal mapping model.

Production Capability Registry metadata should eventually describe both typed outputs and receiving inputs so human UI and AI Planner use the same compatibility rules.

# Testing and preflight

`TEST THIS STEP` uses richer local traces showing sample input, normalization/resolution, rules, Audience/readiness, mapped sample values, simulated output and local blockers.

It must remain obvious that no provider, AI model, real event source, Runtime or connected account was used.

Review can surface workflow structure, Directory/Audience readiness, typed input-routing summary and Runtime-off state. Do not use fake health percentages.

Future protected preflight returns deterministic server blockers/readiness.

# AI authoring direction

The Automation Planner and broader Continuum Planner must edit the same typed models as human UI.

A future cross-domain request can produce a reviewed typed **Change Plan** spanning supported Directory, Automations and Library mutations. Planner output never becomes a shadow database/workflow format or hidden authority path.

Prompt text is intent, never authority. Published Automation changes become a new Draft/version proposal.

Backend companion: `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`.

# Mobile

Preserve one primary decision area, large tap targets, readable type without zooming, one-column choices, bottom-sheet/full-screen pickers, safe-area-aware actions, no nested scroll traps, no horizontal overflow and reduced-motion support.

Do not scale a desktop node canvas onto a phone.

# Active product layers

V3 behavior core:

- `lab-automations-experience-v3.js/.css`.

Accepted support:

- `lab-automations-system-surface.js/.css`;
- `lab-automations-progressive-preview.js`;
- `lab-automations-final-qa.css`;
- `lab-automations-route-integration.js`.

Current v4.x product layers:

- `lab-automations-platform-v4.js/.css`;
- `lab-automations-platform-v4-qa.css`;
- `lab-automations-scenarios-v4.js`;
- `lab-automations-directory-v4.js/.css`;
- `lab-automations-audience-v4.js/.css`;
- `lab-automations-intelligence-v4.js/.css`;
- `lab-automations-input-routing-v4.js/.css`.

Current adapters may use targeted events and `requestAnimationFrame`. Do not introduce a broad `MutationObserver`.

# Safety boundary

Keep all true:

- `connect-src 'self'`;
- no production API call;
- no provider execution;
- no real scheduling authority;
- no real Publish;
- no provider credentials in browser state;
- no external AI model execution;
- no arbitrary executable workflow/data-mapping code;
- browser Audience/data resolution is preview only;
- simulation remains local.

# Regression protection

Focused CI should protect v3 Draft/autosave compatibility, progressive pending-state truth, v4.3 layers/load order, command-center views, Capability Catalog/recommendations, 13 scenarios, exact/new Draft routes, FLOW PREVIEW, Audience v4.1, data references, input routing, richer stage tests, mobile readability, production isolation and no broad MutationObserver/eval/dynamic Function.

# Production migration rule

Migrate accepted semantics into protected React/server Drafts/typed services/generated client. LocalStorage, DOM patching, compatibility target labels, browser audience resolution and browser data/input-binding stores remain Lab scaffolding.
