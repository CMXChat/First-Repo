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
- Library remains an information/content/media workspace.
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
/lab/directory/     standalone Directory prototype
/lab/library/       standalone Library prototype
/lab/automations/   Automation authoring prototype
/lab/               broad legacy compatibility workspace
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

The current Control Center, standalone Directory and standalone Library rails are Lab references for the global-navigation role, but none is automatically copied pixel-for-pixel into every existing route.

An editor such as Automations may use a thinner global-home/app-switching treatment so the editor canvas remains primary.

# Mobile shell

Mobile must remain an app experience, not a compressed desktop rail.

Control Center and standalone Directory currently use the earlier five-destination Lab pattern:

```text
Control
Check In
Directory
Automations
Spaces
```

The standalone Library is the first surface proving the expected growth direction:

```text
Control
Check In
Directory
Library
More
```

Its `More` sheet exposes lower-frequency destinations such as Automations and Spaces without shrinking seven destinations into unusably small tabs.

This is an experiment toward the likely production model of four high-frequency/current-context destinations plus a fifth `More` / app-switcher destination. Do not force every existing Lab surface onto that pattern until the interaction has settled.

The exact production slots should be chosen from real usage once Library, Connections and the broader app are server-backed. Do not prematurely demote a domain based only on architecture diagrams.

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

The Control Center, Directory and Library Lab command palettes are reference directions for global jump behavior:

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
- `LIVE Check In` may coexist with `LAB Control Center`, `LAB Directory` and `LAB Library`;
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

- background becomes inert while a modal surface is open where the implementation supports it;
- keyboard focus stays inside the active modal/dialog;
- Escape closes where appropriate;
- focus returns to the invoking control after close when possible;
- focus-visible treatment remains obvious in light and dark themes;
- mobile sheets respect safe-area insets;
- reduced-motion preferences remain respected.

The Control Center v4 focus layer is the strongest current Lab reference implementation. Directory and Library use native dialog semantics for local create/edit/import surfaces and should receive the same hardening where later QA exposes gaps.

# Current implementation changes

As of this document:

1. `/lab/control/` remains the flagship Control Center prototype and proposed Continuum Lab home.
2. `/lab/directory/` is implemented as a standalone Directory product surface with People, Organizations and Groups.
3. `/lab/library/` is implemented as a standalone Library product surface with folders, native content, files/media, versions, Used by, smart views and knowledge-ingestion preview.
4. Standalone Directory and Library retain their own domain-specific workspace designs while using the same top-level app identity/destination direction.
5. The Automation Lab Continuum brand/home link returns to `/lab/control/` instead of the old broad `/lab/` destination.
6. No shared-shell chrome has been injected into the LIVE `/checkin/` route.
7. No broad refactor of the legacy `/lab/` snapshot-loader stack has been attempted.
8. Control Center overlays retain the dedicated v4 focus-containment/accessibility layer.

# Check In protection

`/checkin/` is a current LIVE protected surface and should not be casually re-skinned to match Lab navigation.

A future shared production shell integration must preserve:

- Check In reliability and clarity;
- mobile-first interaction;
- current API/auth boundaries;
- explicit continuity safety semantics;
- focused primary action hierarchy.

Until a proper production shell exists, linking to Check In from Lab is safer than wrapping Check In in experimental Lab chrome.

# Directory migration

The Directory prototype no longer depends on the broad `/lab/` compatibility route for its preferred product surface.

Current preferred Lab destination:

`/lab/directory/`

The broad `/lab/` Directory v2 remains compatibility scaffolding because other experiments still rely on the Check In snapshot-loader stack and the shared local sample store.

The standalone Directory deliberately keeps compatible browser sample data during migration while establishing a clean product boundary.

See:

`docs/continuum-directory-standalone-CURRENT.md`

Long-term production graduation remains:

`/directory/`

inside the real application shell after protected backend/frontend services are ready.

# Library migration

The Library now has a preferred standalone Lab destination:

`/lab/library/`

Earlier premium Library/content/file UX inside `/lab/automations/` remains compatibility/reference behavior while migration settles. The standalone route reuses the same browser content/file/meta stores so the two surfaces do not invent separate Lab identities for the same content.

The standalone Library is a product projection over folders, reusable native content, Templates, FileAssets/media metadata, versions, dependency/Used by information and knowledge-ingestion previews.

It does not claim PostgreSQL persistence or object-storage bytes.

See:

`docs/continuum-library-lab-CURRENT.md`

Long-term production graduation remains:

`/library/`

when protected Library APIs, persistence, search and file storage/viewer boundaries are real.

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

The isolated Lab proofs now include Control Center, Directory and Library.

# Non-goals

This shell work must not:

- delay the backend Phase 2A deployment / continuity.md proof;
- confuse the standalone Library Lab with production Library persistence;
- invent Connections, Goals or Signals production services;
- turn Control Center into a configuration dump;
- turn Directory into a generic sales CRM;
- turn Library into a generic file browser or public sharing product;
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
