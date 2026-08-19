# Continuum Shared App Shell - CURRENT

Date: 2026-08-19
Status: Accepted product-shell direction for Lab convergence and later production migration. This document defines navigation/chrome behavior only. It does not claim production backend capability.

# Decision

Continuum should feel like one application without forcing every domain into one generic dashboard layout.

The shared shell owns:

```text
application identity
+ top-level app switching
+ current environment truth (LIVE / LAB where applicable)
+ global command / jump entry
+ theme / appearance entry
+ account / global settings later
```

Each domain owns its own workspace.

Examples:

- Control Center remains an operational console.
- Automations remains an authoring/editor workspace.
- Check In remains a focused safety and continuity interaction.
- Directory remains a people/relationship workspace.
- Library remains an information/content workspace.
- Spaces remains a briefing/context experience.
- Connections remains a capability/integration management surface.

The shared shell must not flatten these experiences into identical cards, identical page headers or one universal dashboard template.

# Proposed stable product destinations

Long-term first-class routes should converge toward clean production paths as their real protected services graduate:

```text
/control/
/checkin/
/directory/
/library/
/automations/
/spaces/
/connections/
```

Current Lab routes remain proving grounds and may differ while migration is incomplete.

Examples today:

```text
/lab/control/       Control Center flagship prototype
/lab/automations/   Automation authoring prototype
/lab/               broader legacy Lab / Directory prototype
/checkin/           current LIVE protected Check In surface
/spaces/            current Spaces route, still product-development territory
```

Do not create clean production-looking routes merely to make the URL scheme look complete. A route graduates when the surface and protected backend boundary are ready.

# Home rule

The Control Center is the proposed operational home for Continuum.

In Lab, the Continuum brand/home affordance should resolve to:

`/lab/control/`

In the future production application, the equivalent home destination should resolve to:

`/control/`

This does not mean every domain must visually inherit the Control Center layout.

# Desktop shell

Wide-screen direction:

- one compact global navigation rail or equally low-cost app switcher;
- current domain clearly selected;
- domain workspace gets the majority of horizontal space;
- global command remains quickly available;
- environment truth remains visible without dominating the workspace;
- domain-specific secondary navigation stays inside the domain.

The current Control Center rail is the strongest reference for the global-navigation role, but it is not automatically copied pixel-for-pixel into every existing Lab route.

An editor such as Automations may use a thinner global-home/app-switching treatment so the editor canvas remains primary.

# Mobile shell

Mobile must remain an app experience, not a compressed desktop rail.

Current Control Center Lab bottom navigation remains a useful reference because real-device review showed that the pattern works.

Near-term Lab core slots may remain:

```text
Control
Check In
Directory
Automations
Spaces
```

As Library and Connections become real first-class surfaces, mobile should not grow into seven tiny permanent tabs. The likely production direction is four high-frequency destinations plus a fifth `More` / app-switcher destination.

The exact final five-slot set should be chosen from real usage once those surfaces exist. Do not prematurely demote Directory, Spaces or another domain based only on architecture diagrams.

# What stays out of primary navigation for now

## Continuity / Afterlife

Continuity is core to Continuum, but it does not need to become a permanent top-level nav tab merely because it is architecturally important.

Near-term direction:

- Check In exposes the immediate continuity interaction;
- Control Center exposes continuity health / attention;
- protected continuity configuration can live behind those surfaces or a dedicated setup destination when the product is ready;
- Afterlife remains an extreme continuity mode, not a navigation category that defines the entire application.

If continuity configuration later becomes large and frequently operated, it can earn a first-class destination deliberately.

## Goals / Missions

Goals become first-class only after the backend Goal/Mission model is real enough to support an operational surface.

Until then, sample Goal/work items may appear in Control Center to test presentation, but the shell must not advertise a fake Goals product.

## Signals / State

Signals and State are underlying product capabilities and may later have dedicated investigative/operational views. They do not need a permanent top-level tab before those views exist.

# Global command

The Control Center Lab command palette is the reference direction for global jump behavior:

```text
Cmd/Ctrl + K
→ jump within current domain
→ open another Continuum domain
→ open safe global actions
```

The production command surface must use real router/capability/state services when those exist.

A global command surface must never become a loophole around authority, permissions or protected server validation.

# Environment truth

The shell may show environment/status labels such as `LAB`, `LIVE` or `EXECUTION OFF`, but only when those labels are truthful for the exact surface/capability.

Rules:

- a Lab shell never makes a sample feature look production-live;
- one live domain does not make every card in Control Center live;
- `LIVE Check In` may coexist with `LAB Control Center`;
- future production app chrome must distinguish degraded/partial states when necessary instead of presenting one misleading global green state.

# Theme and appearance

Long-term, theme should feel global across Continuum.

Current static/Lab surfaces use separate local-storage theme keys and different implementations. Do not force a brittle shared theme store across those independent prototypes now.

When the real application shell exists in the React/frontend architecture, migrate appearance preference into the shared application layer deliberately.

Until then:

- preserve each stable surface's current theme behavior;
- keep dark-mode direction visually compatible;
- do not break an accepted surface merely to synchronize a prototype theme key.

# Accessibility / focus contract

Global overlays and app-switching surfaces must behave as real modal/interactive UI:

- background becomes inert while a modal surface is open;
- keyboard focus stays inside the active modal/dialog;
- Escape closes where appropriate;
- focus returns to the invoking control after close when possible;
- focus-visible treatment remains obvious in light and dark themes;
- mobile sheets respect safe-area insets;
- reduced-motion preferences remain respected.

The Control Center v4 focus layer is the current Lab reference implementation of this behavior.

# Current implementation changes

As of this document:

1. `/lab/control/` remains the flagship Control Center prototype and proposed Continuum Lab home.
2. The Automation Lab Continuum brand/home link now returns to `/lab/control/` instead of the old broad `/lab/` destination.
3. No shared-shell chrome has been injected into the LIVE `/checkin/` route.
4. No broad refactor of the legacy `/lab/` snapshot-loader stack has been attempted.
5. Control Center overlays receive a dedicated v4 focus-containment/accessibility layer.

# Check In protection

`/checkin/` is a current LIVE protected surface and should not be casually re-skinned to match Lab navigation.

A future shared production shell integration must preserve:

- Check In reliability and clarity;
- mobile-first interaction;
- current API/auth boundaries;
- explicit continuity safety semantics;
- focused primary action hierarchy.

Until a proper production shell exists, linking *to* Check In from Lab is safer than wrapping Check In in experimental Lab chrome.

# Directory migration

The Directory prototype currently lives inside the broad `/lab/` compatibility stack.

Do not keep expanding that coupling forever.

Recommended direction when Directory is next actively developed:

```text
/lab/directory/
```

as an isolated product prototype or as the first real app-backed Directory route, depending on backend/frontend readiness.

That migration should happen because Directory deserves a clean domain boundary, not simply to make route names prettier.

# Production shell migration

The shared shell should ultimately be rebuilt in the real frontend application architecture, not copied from static Lab loaders.

Suggested migration sequence:

```text
1. prove global shell behavior in isolated Lab surfaces
2. keep current LIVE Check In protected
3. converge Lab home/app-switching semantics
4. build real shared shell in the React application
5. connect protected router/auth/theme/global-command services
6. migrate each domain into the real shell when its backend boundary is ready
7. graduate clean routes individually
```

# Non-goals

This shell work must not:

- delay the backend Phase 2A deployment / continuity.md proof;
- invent Library, Connections, Goals or Signals production services;
- turn Control Center into a configuration dump;
- turn Automations into a generic dashboard;
- force Check In into experimental chrome;
- create a second source of product authority in frontend navigation state;
- imply that navigating to a domain grants permission to perform consequential actions.

# Governing product principle

The shell answers:

> Where am I in Continuum, and where can I go?

The domain answers:

> What can I understand or do here?

The protected backend answers:

> What is true, what is allowed, and what actually happened?
