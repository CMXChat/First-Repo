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
- `assets/lab/control-center-mobile-polish-v2.css`
- `assets/lab/control-center-v1.js`
- `tests/continuum-control-center-v1.test.js`
- `.github/workflows/control-center-lab-validation.yml`

Reason:

The main `/lab/` route is useful compatibility/prototyping scaffolding built by transforming a Check In snapshot and layering many local product scripts over it. The Control Center needs a clean flagship interaction model that can later be rebuilt in the real React/FastAPI application without inheriting that compatibility architecture.

# Product structure

Primary views:

```text
Now
Upcoming
History
All activity
```

The `Now` view contains:

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

# Direct mobile screenshot QA - 2026-08-19

The first real Samsung/Android screenshots showed that the structure worked, but the narrow layout still read too much like a sequence of separate rounded dashboard cards. The simulation bottom sheet also used a fixed mobile height that left a large empty white region beneath its content.

The device-review v2 polish therefore:

- compresses the primary state surface without weakening its hierarchy;
- changes the summary copy to `Stable. 2 things need review.` so attention and overall health do not sound contradictory;
- changes the first status chip to `2 need you`;
- groups Attention, Running & waiting and Recent Activity into one continuous operational surface on mobile instead of three visually unrelated cards;
- makes the Now/Upcoming/History/All activity tabs sticky below the mobile top bar;
- increases practical mobile text legibility while preserving dense operator presentation;
- keeps Continuity, Upcoming and Connections as secondary supporting surfaces;
- reduces the visual weight of repeated rounded containers;
- keeps the bottom navigation intact because the real-device layout proved it works well;
- changes the mobile Why/Simulation drawer from fixed height to content-hugging `height:auto` with a bounded `max-height`;
- tightens simulation scenario spacing and result presentation;
- scrolls a newly generated simulation result into the nearest visible area;
- makes View activity / All activity switch to the actual Activity view;
- keeps keyboard activation for non-button attention rows;
- preserves the strict same-origin Lab CSP and zero production API calls.

# Flagship refinement pass

After the direct device review, the next pass continues without requiring new screenshots.

Desktop now receives stronger hierarchy instead of merely inheriting the original card layout:

- a larger and more deliberate primary state surface;
- stronger visual separation between owner attention and supporting state;
- a unified primary operational column for Attention, Running & waiting and Activity;
- a narrower supporting rail for continuity, upcoming work and infrastructure health;
- restrained attention accents instead of adding more cards or dashboard chrome;
- richer spacing and scale at large desktop widths while keeping the mobile layout independent.

The top command surface is now functional in Lab instead of being a placeholder.

`Cmd/Ctrl + K` or the search button opens a local command palette that can:

- jump to Now, Upcoming, History or All activity;
- open the safe Simulation drawer;
- open Check In, Directory, Automations, Spaces or the Continuum document;
- toggle the current theme;
- filter commands locally by typed text.

The palette performs no API request and creates no new authority or product truth. It is navigation and Lab interaction only.

Asset versions were bumped after this pass so mobile/desktop browsers do not keep serving the earlier cached JS/CSS under the same URL.

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

The drawer includes fixed safe sample scenarios:

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

The prototype defaults light and remembers an explicit user theme choice under:

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
- autonomy/simulation controls stay compact and immediately accessible;
- the primary Now sections read as one operational surface;
- dashboard columns become one flow;
- attention and work rows preserve readable labels;
- Why/Simulation use content-hugging bottom sheets with bounded scrolling;
- the command palette becomes a bottom-sheet style surface;
- view tabs remain horizontally usable and sticky below the top bar;
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

Do not widen the page into every future Continuum feature simply because the Control Center can eventually display them.

Recommended next product work:

1. continue interaction refinement around item detail, filtering and quiet/empty states without inventing backend truth;
2. define a shared Continuum Lab navigation shell only if Control Center, Directory and Automations now benefit from one consistent top-level frame;
3. keep `/lab/control/` as the flagship prototype while production `/control/` waits for real server-backed activity/Runtime projections;
4. replace sample sections incrementally with protected typed data as backend domains mature;
5. preserve the Control Center as an operational surface instead of turning it into a configuration dump.

# Backend boundary

The prototype does not change the current backend order of work.

The canonical backend execution-order overlay remains:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-BACKEND-ORDER-OF-WORK-CURRENT.md`

Phase 2A production migration/deployment and the protected `continuity.md` acceptance proof remain the immediate backend boundary.
