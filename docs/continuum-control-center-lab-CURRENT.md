# Continuum Control Center Lab - CURRENT

Date: 2026-08-19
Status: Standalone flagship product prototype. Lab/sample state only. No production Runtime, Signals, Connection health, continuity-health service, Goal orchestration, simulation backend or autonomous execution is claimed.

Route:

`https://db.cmxchat.com/lab/control/`

# Purpose

The Control Center is the proposed operational home for Continuum.

It should answer quickly:

- what is happening now;
- what needs owner attention;
- what is running or waiting;
- what is upcoming;
- what changed recently;
- whether continuity needs attention;
- whether Connections/Sources have meaningful health issues;
- why a consequential item happened;
- what a hypothetical continuity scenario would do later.

It does not replace Check In, Directory, Library, Automations, Spaces, Connections or later Goals. It ties those domains together through one operational surface.

Backend architecture companion:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CONTROL-CENTER-SIMULATION-AND-AUTONOMY-CONTRACT.md`

# Standalone implementation decision

The Control Center prototype deliberately does not inherit the main `/lab/` Check In snapshot-loader stack.

Current files:

- `lab/control/index.html`
- `assets/lab/control-center-theme-init.js`
- `assets/lab/control-center-v1.css`
- `assets/lab/control-center-v1.js`
- `tests/continuum-control-center-v1.test.js`
- `.github/workflows/control-center-lab-validation.yml`

Reason:

The main `/lab/` route is useful compatibility/prototyping scaffolding built by transforming a Check In snapshot and layering many local product scripts over it. The Control Center needs a clean flagship interaction model that can later be rebuilt in the real React/FastAPI application without inheriting that compatibility architecture.

# V1 product structure

Primary views:

```text
Now
Upcoming
History
All activity
```

The first `Now` view contains:

```text
current operational summary
attention queue
running + waiting work
continuity health sample
upcoming chronological rail
connection/source health sample
recent activity
simulation entry
```

The hierarchy deliberately avoids a generic equal-card dashboard. The current-state summary is visually dominant, attention is second, and supporting health/activity views sit underneath.

# Explainability

Activity and attention rows can open a `Why did Continuum do that?` drawer.

The prototype teaches the causal direction:

```text
Trigger / evidence
→ State
→ Policy
→ Authority
→ Capability
→ Result
```

This is presentation only. Production would use protected backend references, exact versions, Runtime records and Audit/Why provenance as authoritative truth.

# Simulation

The V1 drawer includes fixed safe sample scenarios:

- owner unavailable for 7 days;
- primary email unavailable;
- trusted approver does not respond.

The interaction is intentionally deterministic local sample text. It performs no API call and no side effect.

Future real simulation remains governed by the backend Control Center contract:

`real State snapshot → isolated hypothetical overlay → simulated policy/authority evaluation → simulated Runtime path → predicted result`

Simulation must never activate real authority, change real State or call real consequential providers.

# Truth boundary

The route explicitly labels itself as Lab and sample/prototype state.

Do not make any of these claims until protected backend services actually exist and are verified:

- production Control Center activity stream;
- production Runtime execution;
- live general Connection health;
- live general Source health;
- production continuity-health scoring;
- owner-intent revalidation service in production;
- Goals/Missions Runtime;
- live Signals/Observations;
- saved simulation backend;
- autonomous AI/provider execution.

The existing `/checkin/` route remains the current LIVE protected Continuum product surface.

# Theme and visual direction

V1 defaults light and remembers an explicit user theme choice under:

`continuum-control-center-theme-v1`

Dark mode is intentionally rich black/near-black instead of blue/navy.

Visual principles:

- serious operational app, not landing page;
- strong hierarchy without dashboard-card soup;
- restrained Continuum blue;
- calm status motion/lighting;
- clear attention tones;
- high information density with breathing room;
- meaningful empty/sample states;
- mobile designed independently instead of shrinking the desktop grid.

# Mobile contract

At narrow widths:

- desktop rail is replaced by a five-item bottom navigation;
- primary status stays first;
- autonomy/simulation controls stack cleanly;
- dashboard columns become one flow;
- attention and work rows preserve readable labels;
- Why/Simulation become bottom-sheet style drawers;
- view tabs remain horizontally usable;
- touch targets remain appropriately large;
- reduced-motion preference is respected.

# Navigation

Current prototype destinations:

- Control Center → `/lab/control/`
- Check In → `/checkin/`
- Directory → `/lab/`
- Automations → `/lab/automations/`
- Spaces → `/spaces/`
- Continuum document → `/doc/`

Directory still lives inside the broader Lab experience. Library and Connections are represented conceptually in Control Center state but are not given invented standalone routes.

# Next product passes

Do not immediately widen the page into every future Continuum feature.

Recommended next work after direct visual/device review:

1. fix any real desktop/mobile visual issues exposed by screenshots;
2. refine density and hierarchy based on actual device feel;
3. decide whether the top-level Continuum navigation should become a shared Lab shell across Control Center, Directory and Automations;
4. define the first server-backed Control Center projection only after Runtime/activity backend primitives exist;
5. later replace sample sections incrementally with protected typed data rather than one giant fake dashboard-to-production rewrite.

# Backend boundary

The prototype does not change the current backend order of work.

The canonical backend execution-order overlay remains:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-BACKEND-ORDER-OF-WORK-CURRENT.md`

Phase 2A production migration/deployment and the protected `continuity.md` acceptance proof remain the immediate backend boundary.
