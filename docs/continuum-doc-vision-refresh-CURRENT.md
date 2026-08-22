# Continuum `/doc/` Vision + Truth Refresh — CURRENT

Date: 2026-08-22
Status: OWNER-AUTHORIZED narrow reopen of the frozen `/doc/` overview
Branch: `agent/doc-vision-truth-refresh`
Base: `main` at `640773bd14cab8f296f9510483970e4fb2da6c4b`

## Why the frozen document was reopened

The owner explicitly asked to strengthen `/doc/` without losing the existing one-minute explanation or shrinking the long-term vision around today's implementation state.

The accepted direction is:

- preserve the current brain / nervous-system explanation;
- do **not** market Continuum as an operating system;
- make the product-map idea more explicit;
- keep the full future capability horizon visible;
- improve current-state truth as backend proofs become real;
- connect the domains through one understandable end-to-end example;
- show the difference between what Continuum knows and what it is allowed to do;
- graduate old `/lab/` references to canonical product routes;
- make the ending useful as a product launcher without implying unfinished surfaces are production-live.

This is an additive reader/truth refresh, not a redesign.

## Product framing

The visible product-map explanation now teaches:

> Think of Continuum as a private map of the people, information, rules, tools and ongoing work that matter to you.

The map is deliberately open-ended. New AI models, services, sensors, APIs, MCP servers and future devices may expand what Continuum can perceive, understand or do. Permission remains separate from capability.

The page keeps the existing core lesson that AI provides replaceable reasoning while Continuum keeps durable context, current State, authority, policy and history around that reasoning.

## Current-state truth

The refreshed status language distinguishes production truth from backend development truth.

Current page direction:

- Check In = LIVE production proof;
- Spaces = LAB;
- Directory / Library / Automations / Email / Control = product surfaces in active build / connection;
- Directory, Library, Automation-version, Runtime, Email and Authority foundations = real backend development proofs, not all production deployed;
- durable trigger consumption = backend development foundation;
- longer-running coordination, broader Signals, Goals, broader outside actions and more autonomous AI = later work.

No new backend deployment claim is authorized by this document.

## New reader lesson: knowledge is not permission

A compact two-column explanation is inserted in the AI + Permissions section.

It distinguishes:

### What Continuum can know

- stable people and relationships;
- exact document/content versions;
- replies, deadlines and current State;
- durable history and provenance.

### What Continuum may do

- read or prepare approved information;
- ask before consequential actions;
- use an exact capability inside typed limits;
- wait, prohibit or use prepared fallback authority.

This protects the architectural principle:

`knowledge / evidence != authority`

## New connected backend proof

The Automations section now contains one concrete Email-flavored chain:

`Directory → Library → Automation → Authority → Runtime`

Reader interpretation:

1. Directory knows the person and exact email ContactMethod.
2. Library freezes the exact ContentVersion.
3. Automation freezes the intended work and dependencies.
4. Authority decides whether that exact work is allowed.
5. Runtime records Runs, Attempts, provider results and Why history.

The visual is explicitly marked `NOT PRODUCTION-LIVE`.

It exists to show that these are not unrelated pages or vocabulary. They are parts of one durable consequence path.

## Future horizon remains first-class

The existing possibility board remains intact.

Its framing is strengthened to explain that the map can expand with:

- new models;
- services;
- sensors;
- APIs;
- MCP servers;
- devices;
- communication channels;
- later goal/replanning systems.

New capability does not silently increase permission.

## Roadmap refresh

The four-card roadmap now teaches:

1. `NOW` — production Check In foundation;
2. `BUILT` — durable backend foundations proven in development;
3. `CONNECTING` — canonical product surfaces moving onto server truth;
4. `EXPANDING` — Signals, Goals, broader connections, model/tool/device growth and longer coordination.

The purpose is to avoid two opposite errors:

- pretending development-only backend work is production-live;
- making the product look much less advanced than the repository actually is.

## Canonical route launcher

The footer launcher now targets canonical routes only:

- `/checkin/`
- `/spaces/`
- `/directory/`
- `/library/`
- `/automations/`
- `/email/`
- `/control/`

No footer link should return to `/lab/automations/`.

Unfinished routes are labeled `LAB` or `IN BUILD`, not `LIVE`.

The Build section's old `/lab/automations/` wording is also replaced at render time with `/automations/`.

## Implementation boundary

New additive files:

- `assets/continuum-doc-vision-refresh.js`
- `assets/continuum-doc-vision-refresh.css`

Modified loader:

- `assets/continuum-doc-i18n.js`

The new refresh runs **after** the existing knowledge-time, human-cadence, reader-first and final-voice layers. This preserves the accepted one-minute explanation and limits changes to explicitly requested framing/status additions.

Expected marker:

`data-continuum-vision-refresh="ready"`

## Preserved freeze rules

Keep unchanged unless separately authorized:

- eight stable top-level sections;
- current overall visual language;
- brain / nervous-system opening;
- human-first teaching order;
- natural writing contract;
- dark mode;
- phone layout;
- RTL support;
- print support;
- LIVE / LAB / future truthfulness;
- Check In as first-class LIVE destination;
- full future horizon around Signals, Planner, Goals, Runtime, capability growth, continuity and Control Center.

## Backend boundary

This change does **not**:

- deploy jay-app;
- run any production migration;
- make backend development branches production truth;
- enable unattended Runtime;
- enable real unattended SMTP;
- widen Authority;
- enable generic scheduling;
- enable Goals, Planner or autonomous AI execution.

## Next acceptance

Before merging this branch:

1. run JS syntax/static checks;
2. render `/doc/` desktop and mobile if practical;
3. confirm the original hero remains readable;
4. confirm the new map sentence is visible;
5. confirm Knowledge vs Authority renders as two cards on desktop and one column on mobile;
6. confirm the connected backend proof is clearly labeled not production-live;
7. confirm the footer contains canonical routes and no `/lab/automations/`;
8. confirm dark mode remains readable;
9. confirm no RTL regression;
10. confirm no backend or production claim was changed outside the document.
