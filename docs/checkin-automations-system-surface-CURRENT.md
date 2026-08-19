# Automations System Surface — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab Automations v4.1 operating-surface contract

# Purpose

`/lab/automations/` is a private workflow operating surface inside Continuum Lab.

It should feel like an application for building, testing and managing Automation definitions. It must not become a marketing page or a second `/doc/`.

Current v4.1 changes presentation, discovery, local composition and simulation only. It does not create production execution authority, provider behavior, authoritative scheduling or a new production backend schema.

Strategic direction:

`docs/continuum-automations-master-plan-CURRENT.md`

Exact frontend truth:

`docs/checkin-automations-frontend-CURRENT.md`

Directory/Audience truth:

`docs/checkin-directory-library-CURRENT.md`

# Surface distinction

- `/doc/` explains Continuum;
- `/lab/` is the broader experiment workspace and owns the rich Directory v2 surface;
- `/lab/automations/` operates and tests Automation Drafts.

`/doc/` stays under its separate clarity freeze.

# Dashboard hierarchy

The command center prioritizes:

1. compact application header;
2. New Automation;
3. Automations / Templates / Runs navigation;
4. search + Capability Catalog;
5. system/Directory status;
6. Draft / Published / Archived controls;
7. actual Automation cards;
8. scenarios/templates on their own surface.

Do not restore a billboard hero above the workflow list.

Runs remains a preview and must show `RUNTIME OFF` while authoritative Runtime does not exist.

# New Automation

Normal creation offers:

- Build manually;
- Start from a scenario;
- AI Planner preview.

Planner performs no model request.

The established `?new=1&from=lab` deep link remains an exception and opens directly on the blank Trigger editor.

# Builder hierarchy

Accepted stages remain:

- WHEN / Trigger;
- IF / Rules;
- DO / Actions;
- WAIT / Timing;
- TEST / Review.

Name/description stay metadata.

Finish remains inside Review.

The builder should feel like operating a readable workflow, not completing an administrative form.

# Flow Preview

Accepted label: **FLOW PREVIEW**.

V4 makes flow nodes interactive stage navigation.

A blank Draft remains truthfully incomplete until choices are made/confirmed.

The progressive-preview layer prevents internal compatibility defaults from being presented as user intent.

# Capability discovery

Operating rule: **catalog breadth without interface clutter**.

The picker should support:

- useful/current options first;
- categories;
- search;
- reusable Actions;
- explicit availability state;
- future Connection-provided capability.

Current status labels:

- `LAB NOW` = current prototype can represent it;
- `LATER` = deliberate future capability preview.

A `LATER` capability remains non-executable.

# Directory integration

Automations v4.1 treats Directory as a first-class input to communication targeting.

The Actions stage shows current:

- People count;
- Organization count;
- Group count;
- email-ready count;
- phone-ready count.

Review also exposes Directory readiness.

# Typed Audience v4.1

Communication Actions now use a multi-selector Audience manager in Lab.

Selectors can include:

- Person;
- Organization;
- Group;
- Label.

The modal resolves current unique People and previews channel readiness before applying.

The UI should make the distinction clear:

- selector = durable audience intent;
- resolved People = current Lab preview;
- readiness = current channel availability;
- future Runtime snapshot = exact recipients/endpoints actually used by one Run.

V3 compatibility target fields remain hidden implementation scaffolding, not the product model.

# Scenarios

Current total: **13 editable starting patterns**.

They create ordinary shared Drafts.

No separate scenario execution or persistence model.

# Per-stage testing

**TEST THIS STEP** remains a local explanatory check.

It may show what the current stage can validate/simulate while explicitly saying no provider/event source/production API/scheduler/Runtime was used.

This is the UX precursor to protected sample-event and fake-provider testing later.

# Review / preflight

Review remains complete flow + Finish + deterministic local validation + simulation.

Current v4.1 preflight includes:

- workflow structure;
- Directory readiness;
- communication Audience readiness;
- Lab simulation boundary;
- Runtime off state.

Do not use fake health percentages.

Future protected preflight should return exact deterministic blockers from backend services.

# Runs preview

Runs exists so the dashboard does not need a redesign later.

Current rules:

- label preview clearly;
- show `RUNTIME OFF`;
- do not convert local simulation into fake Runs;
- do not fabricate success/failure history.

# Desktop

Keep the workflow visible while a stage is configured.

The Flow Preview follows normal document scrolling and must not create a nested page scrollbar.

Do not add a giant empty graph canvas while flows remain primarily linear.

# Mobile

Preserve:

- one primary decision area;
- large tap targets;
- readable type without zooming;
- one-column Action/capability cards;
- scrollable stage rail where needed;
- bottom-sheet/full-screen pickers;
- full-width Audience selector sheet;
- safe-area handling;
- document scrolling;
- no horizontal overflow;
- no nested scroll traps;
- reduced-motion support.

Do not scale a desktop node canvas onto a phone.

# Active files

## V3 behavior core

- `assets/lab/lab-automations-experience-v3.js`;
- `assets/lab/lab-automations-experience-v3.css`.

## Accepted support layers

- `assets/lab/lab-automations-system-surface.js`;
- `assets/lab/lab-automations-system-surface.css`;
- `assets/lab/lab-automations-progressive-preview.js`;
- `assets/lab/lab-automations-final-qa.css`;
- `assets/lab/lab-automations-route-integration.js`.

## V4/V4.1 product layers

- `assets/lab/lab-automations-platform-v4.js`;
- `assets/lab/lab-automations-platform-v4.css`;
- `assets/lab/lab-automations-platform-v4-qa.css`;
- `assets/lab/lab-automations-scenarios-v4.js`;
- `assets/lab/lab-automations-directory-v4.js`;
- `assets/lab/lab-automations-directory-v4.css`;
- `assets/lab/lab-automations-audience-v4.js`;
- `assets/lab/lab-automations-audience-v4.css`.

These layers may react through targeted click/input/change/storage/custom events and `requestAnimationFrame`.

Do not introduce a broad `MutationObserver`.

# Naming and metadata

Focused route title remains:

`Continuum · Automations`

The route stays noindex and remains a Continuum Lab workspace.

This does not rename the protected Check In backend program or current API/spec namespaces.

# Safety boundary

Keep all true:

- `connect-src 'self'`;
- no production API call;
- no provider execution;
- no real scheduling authority;
- no real Publish;
- no provider credentials/secrets in browser state;
- no AI model execution from Planner preview;
- no arbitrary executable workflow code;
- browser Audience resolution is preview only;
- local simulation remains local.

# Regression protection

Focused Automations CI should verify:

- v3 remains Draft/autosave compatibility core;
- progressive pending-state rules remain intact;
- v4/v4.1 layers load after the accepted core;
- Automations / Templates / Runs render;
- old landing-page hero does not return;
- Capability Catalog remains available;
- 13 scenarios remain available;
- exact Draft deep links work;
- `?new=1` still opens directly at Trigger;
- FLOW PREVIEW remains the accepted name;
- TEST THIS STEP is present;
- Directory integration loads;
- Audience v4.1 source/styling loads;
- no production API/model/provider call is introduced;
- mobile remains readable;
- no broad MutationObserver/eval/dynamic Function appears in current adapters.

# Production migration rule

Accepted Lab behavior migrates as product semantics.

Protected product uses React, server Drafts, typed Directory/Audience services and generated API client.

LocalStorage, DOM patching, compatibility target labels, browser audience resolution and reload-after-audience-save remain Lab scaffolding.
