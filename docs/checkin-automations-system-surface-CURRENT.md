# Automations System Surface — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab v4 operating-surface contract

## Purpose

`/lab/automations/` is a private workflow operating surface inside Continuum Lab.

It should feel like an application for building, testing and managing Automation definitions. It must not become a marketing page or a second `/doc/`.

Current v4 changes presentation, discovery and local simulation only. It does not create production execution authority, provider behavior, real scheduling or a new backend schema.

Strategic direction is canonical in:

`docs/continuum-automations-master-plan-CURRENT.md`

## Surface distinction

- `/doc/` explains Continuum;
- `/lab/` is the broader experiment workspace;
- `/lab/automations/` operates and tests Automation Drafts.

`/doc/` stays under its separate clarity freeze.

## Current dashboard hierarchy

The v4 command center prioritizes actual workflow state and creation:

1. compact application header;
2. New Automation;
3. Automations / Templates / Runs workspace navigation;
4. search and Capability Catalog access;
5. current system-status deck;
6. Draft / Published / Archived lifecycle controls;
7. actual Automation cards;
8. scenarios/templates on their own working surface.

Do not restore a billboard hero above the workflow list.

The Runs surface is a preview only and must display `RUNTIME OFF` while authoritative Runtime does not exist.

## New Automation entry point

Normal New Automation creation offers:

- Build manually;
- Start from a scenario;
- AI Planner preview.

The AI Planner preview is explicitly non-executing and performs no model request.

The established `?new=1&from=lab` integration route is an exception: it opens the blank Trigger editor directly so cross-route behavior stays stable.

## Builder hierarchy

The accepted five stages remain:

- WHEN / Trigger;
- IF / Rules;
- DO / Actions;
- WAIT / Timing;
- TEST / Review.

Name and description stay metadata.

Finish remains inside Review.

The builder should feel like operating a workflow, not completing an administrative form.

## Flow Preview

The accepted label remains **FLOW PREVIEW**.

V4 makes flow nodes interactive navigation controls:

- WHEN → Trigger;
- IF → Rules;
- DO → Actions;
- WAIT → Timing;
- FINISH → Review.

A blank Draft remains truthfully incomplete until the user makes or confirms choices.

The progressive preview layer remains responsible for preventing compatibility defaults from appearing as user intent.

## Capability discovery

V4 introduces a scalable capability browser.

The operating rule is: **catalog breadth without interface clutter**.

The picker should expose:

- relevant/current options first;
- categories;
- search;
- reusable Lab Actions;
- explicit availability status.

Current v4 statuses include:

- `LAB NOW` for a prototype option the current v3 Draft can represent;
- `LATER` for a deliberate future capability preview.

Future capability names must remain non-executable until matching typed backend/services exist.

The catalog is a UX prototype, not browser execution authority.

## Scenarios

Templates/scenarios are ordinary editable Draft starting points.

The focused route now exposes thirteen starting patterns: five existing built-ins plus eight v4 scenarios.

The v4 scenarios use only currently representable prototype shapes and create normal shared Lab Drafts.

Do not create a separate persistence model for scenarios.

## Per-stage testing

V4 adds **TEST THIS STEP** to the builder.

Current behavior is a local explanatory check. It may describe what the selected stage means and what the Lab can inspect, while explicitly saying no provider, event source, production API, scheduler or Runtime was used.

This control is the UX precursor to real protected sample-event and fake-provider testing later.

## Review / preflight

Review remains the complete flow + Finish + validation + simulation surface.

V4 adds a visible Continuum preflight boundary that distinguishes:

- Draft structure;
- Lab simulation;
- Runtime being off.

Do not use fake readiness percentages.

Future protected preflight should show exact deterministic blockers and readiness prerequisites.

## Runs preview

Runs is visible as a future operating surface so dashboard architecture does not have to be reinvented when Runtime arrives.

Current Rules:

- label the surface as preview;
- show `RUNTIME OFF`;
- do not turn local simulations into fake Runs;
- do not show fabricated success/failure history;
- use preview rows only to explain the future shape of server execution history.

## Desktop

Desktop keeps the workflow visible while a stage is configured.

The Flow Preview side panel follows normal document scrolling and must not introduce a nested page scrollbar.

Flow nodes are large enough to read and interact with. Configuration remains the main working area.

Do not add a giant empty graph canvas while workflows are still primarily linear.

## Mobile

Mobile is a separate readable interaction model.

Preserve:

- one primary decision area;
- large tap targets;
- readable type without zooming;
- one-column Action/capability cards;
- scrollable stage rail where needed;
- modal/bottom-sheet pickers;
- safe-area handling;
- document scrolling;
- no horizontal overflow;
- no nested scroll traps;
- reduced-motion support.

Do not scale a desktop node canvas down onto a phone.

## Active presentation files

The v3 behavior core remains:

- `assets/lab/lab-automations-experience-v3.js`;
- `assets/lab/lab-automations-experience-v3.css`.

Accepted support layers remain:

- `assets/lab/lab-automations-system-surface.js`;
- `assets/lab/lab-automations-system-surface.css`;
- `assets/lab/lab-automations-progressive-preview.js`;
- `assets/lab/lab-automations-final-qa.css`;
- `assets/lab/lab-automations-route-integration.js`.

Current v4 platform layers loaded last are:

- `assets/lab/lab-automations-platform-v4.js`;
- `assets/lab/lab-automations-platform-v4.css`;
- `assets/lab/lab-automations-scenarios-v4.js`.

The v4 presentation layer may react through targeted click/input/change/storage/custom events and `requestAnimationFrame`.

Do not introduce a broad `MutationObserver`.

## Naming and metadata

The focused route remains:

`Continuum · Automations`

It remains noindex and identifies itself as a Continuum Lab Automation workspace.

This does not rename the protected Check In backend program or existing API/spec namespaces.

## Safety boundary

Keep all of these true:

- `connect-src 'self'`;
- no production API call;
- no provider execution;
- no real scheduling authority;
- no real Publish;
- no provider credentials/secrets in browser state;
- no AI model execution from Planner preview;
- no arbitrary executable workflow code;
- local simulation remains local.

## Regression protection

Focused Automations CI should verify:

- v3 remains the Draft/autosave behavior core;
- progressive pending-state rules remain intact;
- v4 platform and scenario layers load after the accepted core;
- dashboard renders Automations / Templates / Runs;
- old landing-page hero does not return;
- Capability Catalog exists and future entries remain only previews;
- expanded scenarios render;
- exact Draft deep links remain valid;
- `?new=1` still opens directly at Trigger;
- Flow Preview remains the accepted name;
- TEST THIS STEP is present;
- Planner preview makes no production/model call;
- mobile remains readable;
- no production API is referenced;
- no broad MutationObserver/eval/dynamic Function appears in the presentation layers.

## Production migration rule

Accepted Lab behavior migrates as product semantics, not by copying the Lab implementation.

The protected product should use React, server Drafts, typed services and the generated API client. LocalStorage, DOM patching and the browser-local capability registry stay Lab scaffolding.
