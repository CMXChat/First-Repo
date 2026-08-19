# Continuum Control Center Lab - CURRENT

Date: 2026-08-19
Status: Standalone flagship Lab prototype. Sample/prototype state only. No production Runtime, Signals, general Connection health, continuity-health service, Goals Runtime, simulation backend or autonomous execution is claimed.

Route: `https://db.cmxchat.com/lab/control/`

Backend companion: `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CONTROL-CENTER-SIMULATION-AND-AUTONOMY-CONTRACT.md`

Shared shell companion: `docs/continuum-shared-app-shell-CURRENT.md`

# Role

Control Center is the proposed operational home for Continuum. It should answer:

```text
what is happening now
what needs me
what is running / waiting
what is next
what changed
whether continuity needs attention
whether important sources/connections need attention
why something happened
what a hypothetical continuity scenario would do
```

It ties domains together without replacing Check In, Directory, Library, Automations, Spaces, Connections or later Goals.

# Implementation boundary

The route is intentionally standalone. It does not inherit the broad `/lab/` Check In snapshot-loader stack.

Current files:

- `lab/control/index.html`
- `assets/lab/control-center-theme-init.js`
- `assets/lab/control-center-v1.css`
- `assets/lab/control-center-mobile-polish-v2.css`
- `assets/lab/control-center-interaction-v3.css`
- `assets/lab/control-center-focus-v4.css`
- `assets/lab/control-center-v1.js`
- `assets/lab/control-center-focus-v4.js`
- `tests/continuum-control-center-v1.test.js`
- `tests/continuum-control-center-focus-v4.test.js`
- `tests/continuum-shared-app-shell.test.js`
- `.github/workflows/control-center-lab-validation.yml`

Production should later rebuild accepted behavior in the real frontend/router/API-client architecture instead of porting static Lab scaffolding wholesale.

# Product structure

Primary views:

`Now | Upcoming | History | All activity`

Now contains the current operational summary, Attention, Running & waiting, recent Activity, continuity-health sample, upcoming rail, connection/source sample, and safe Simulation entry.

The hierarchy deliberately avoids equal-card dashboard soup. Current state is primary, owner attention is second, supporting health/activity is quieter.

# Real-device QA decisions

The first Samsung/Android screenshots led to the v2 mobile pass:

- tighter state header;
- `Stable. 2 things need review.` and `2 need you` copy;
- Attention + Running & waiting + Activity grouped as one operational surface;
- sticky view tabs;
- better narrow-screen type sizing;
- content-hugging Simulation/Why bottom sheets instead of fixed empty height;
- compact scenario/result presentation;
- working View activity / All activity navigation;
- retained five-item bottom nav.

No later screenshot was required to continue development, so post-v2 visual acceptance remains source/device-informed rather than freshly screenshot-confirmed.

# Flagship interaction state

## Command

The top search control / `Cmd/Ctrl + K` opens a local command palette that can jump between Control Center views, open Simulation, navigate to current Continuum surfaces, toggle theme, and filter commands.

It performs no API request and grants no authority.

## Detail / Why

Attention rows, Activity rows and the three sample Running & waiting rows open one detail surface containing:

```text
sample status
+ domain
+ time/context
+ what happens next
+ optional safe navigation
+ causal explanation
```

The causal direction remains:

`Trigger/evidence → State → policy → authority → capability → result`

Production must use protected refs, exact versions, Runtime records and Audit/Why provenance.

Autonomy has its own correct `Why` explanation: the Lab is observe-only and cannot activate production autonomy.

## Activity filters

All Activity has local sample filters for All, Needs you, Continuity, Automations and Check In. Filtering only hides/shows existing sample rows.

## Quiet-state preview

The command palette can toggle a local quiet preview:

`Quiet. Nothing needs you right now.`

It sets the visible attention count to zero, swaps the alert panel for a healthy quiet state and leaves waiting work visible. Reload resets it. It never mutates backend truth.

## Simulation

Fixed safe sample scenarios cover owner unavailable for 7 days, primary email unavailable, and trusted approver non-response. Results are deterministic explanatory text only.

Future real simulation remains:

`real State snapshot → isolated hypothetical overlay → simulated policy/authority evaluation → simulated Runtime path → predicted result`

Simulation must never activate real authority or call consequential providers.

# Focus / overlay v4

The v4 assets are loaded explicitly by `lab/control/index.html` under the existing same-origin CSP.

They provide:

- dialog / `aria-modal` semantics;
- inert background shell/mobile navigation while a modal is open;
- Tab and Shift+Tab containment;
- focus restoration when close would otherwise strand focus;
- preservation of meaningful focus when a command already moved the user to another view;
- clear focus-visible treatment in light and dark modes;
- mobile safe-area handling and sticky sheet headers;
- reduced-motion-safe focus feedback.

This layer changes interaction containment only.

# Shared Continuum shell

Accepted rule:

```text
shared shell owns app switching / environment / global command / appearance
current domain owns its workspace
protected backend owns truth / authority / real effects
```

Concrete convergence now:

- Control Center is the proposed Lab home at `/lab/control/`;
- the Automation Lab Continuum brand returns to `/lab/control/`;
- LIVE `/checkin/` has not been wrapped in experimental shell chrome;
- broad `/lab/` compatibility scaffolding has not been refactored merely for visual uniformity.

See `docs/continuum-shared-app-shell-CURRENT.md` for route graduation, desktop/mobile shell direction, Directory migration and production-shell rules.

# Truth boundary

Do not claim the following until protected backend services exist and are verified:

- production Control Center activity stream or Runtime;
- live general Connection/Source health;
- production continuity-health scoring/revalidation service;
- Goals/Missions Runtime;
- live general Signals/Observations;
- saved simulation backend;
- autonomous AI/provider execution.

`/checkin/` remains the current LIVE protected Continuum surface.

# Theme / responsive direction

The prototype defaults light and stores an explicit route-local theme under `continuum-control-center-theme-v1`. Dark mode stays rich black/near-black.

Mobile preserves the same operational power with a dedicated bottom navigation, one-column flow, horizontally usable view/filter controls, bottom-sheet modal behavior, safe-area support and reduced-motion handling.

Long-term theme/navigation state should migrate into the real shared frontend shell, not be hacked across independent static prototypes now.

# Next product work

Do not keep adding random Control Center features merely because there is room.

Next useful product direction is to let the current interaction/shell model settle, then move the next real domain toward a clean boundary. Directory is the strongest candidate when frontend product work resumes, likely through an isolated `/lab/directory/` direction or the real app depending on backend readiness.

Library and Connections should follow the shared-shell contract when they become real surfaces.

# Backend boundary

This frontend work does not change backend execution order.

Canonical backend overlay: `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-BACKEND-ORDER-OF-WORK-CURRENT.md`

Phase 2A production deployment and the protected `continuity.md` proof remain the immediate backend boundary.
