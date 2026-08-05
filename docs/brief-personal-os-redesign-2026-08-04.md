# Brief Personal OS Redesign

**Date:** August 4, 2026  
**Repository:** `CMXChat/First-Repo`  
**Branch:** `agent/brief-personal-os-shell`  
**Draft PR:** `#37`  
**Depends on:** draft PR `#35`  
**Status:** Full-first Personal OS implementation in validation  
**Production status:** Not merged or deployed

## Current Product Decision

The default `/brief` experience is a Personal OS home screen that opens with the complete operating picture.

Full View is the default for every new user and every briefing type. Quick View remains available as an optional lens. Once a person changes the depth, that preference is saved on the current device and restored on later visits.

This is a presentation-layer decision. It does not change the briefing generation engine, scenario data model, Spaces, permissions, Goal Intelligence engine, connectors, automations, or backend APIs.

## Alignment of the Two Directions

The complete briefing should be visible immediately, but the old continuous report should not return as the default interface.

The aligned model is:

- one fixed Personal OS shell
- one Full home screen containing every applicable section
- concise cards with progressive disclosure
- Quick View as an optional condensed lens
- app-style function pages for deeper work
- the older continuous report available only as a deliberate detail surface

This provides situational awareness without turning the landing experience into a long notification feed or a large stack of oversized sections.

## Full Home

The default home composes the existing briefing records into these modules:

1. Executive Summary
2. Priorities
3. Calendar
4. Messages and coordination
5. Tasks
6. Goals
7. Updates
8. Insights

Each module shows its most important items first. Additional information remains inside `Show More` controls or a relevant function link.

The module layer derives its presentation from existing scenario records. It does not introduce new network requests or backend contracts.

## Quick View

Quick View keeps only the immediate Executive Summary, Priorities, and Calendar modules.

It is intended for a person who has already reviewed the full operating picture and wants a shorter lens during the day.

Rules:

- Full is the default when no saved preference exists.
- Switching to Quick or back to Full is saved locally.
- A saved preference affects only that device.
- The selected depth does not change the underlying data or briefing generation.

## Function Applications

The shell retains six stable function applications:

1. Today
2. Day or scenario timeline
3. Work, Plans, Decisions, Training, or My Work
4. Private, Profiles, Partners, Coach, or Spaces
5. Insight, Reflection, Signals, Progress, or Handoffs
6. System

Labels adapt to Personal, Relationship, Business, Trainer, and Team briefings.

The home screen gives the full picture. The function applications provide deeper operating surfaces without requiring the user to scroll through every module first.

## Navigation Model

Desktop uses a compact application rail.

Mobile uses a six-application bottom dock.

Navigation methods include:

- application rail or bottom dock
- Previous and Next buttons
- context-aware next actions
- keyboard left and right arrows
- touch swipe
- URL state through the `os` query parameter
- optional Guided Flow

Guided Flow advances through the function applications once and stops at System. Manual navigation stops it.

## Progressive Disclosure and Action Hierarchy

Full does not mean fully expanded.

Every module follows the same hierarchy:

1. Section name and current count
2. One or two important items
3. Optional concise context
4. `Show More` for secondary items
5. A relevant function or detail action

Action links and `Show More` controls use compact pill treatments with visible borders, hover states, keyboard focus, and sufficient mobile touch height. Retained legacy home cards also receive a clear clickable state and keyboard activation.

## Mobile and Scrolling Rules

Full View remains the default on mobile.

- modules render as compact single-column cards
- each card expands independently
- Full and Quick controls remain directly available
- the page document remains locked to the viewport
- content scrolls inside the active OS screen
- the bottom application dock stays available
- no horizontal overflow is allowed
- the active screen uses contained native momentum scrolling
- the visible browser viewport is measured so Android browser chrome changes do not resize the layout unpredictably
- the fixed terminal dock no longer competes with the bottom application dock

## Terminal Decision

The visible terminal is removed from the active product for this phase.

The underlying terminal implementation is retained in the repository, but the current experience cannot open it. The following surfaces are removed or hidden:

- top Command button
- bottom command bar
- terminal entry in the OS rail
- terminal entry in the System directory
- terminal open triggers

The top Command position becomes an About link to `/doc/`. The System directory and More menu also expose the Personal OS product overview.

Any stale terminal-open state is cleared automatically so it cannot leave the page blurred or blocked.

## Overlay Safety

The briefing switcher, More menu, and guided tour remain available.

A stability layer verifies that an overlay surface is actually visible and interactive after its backdrop opens. When a panel fails to render, the layer closes it and removes the blur state instead of leaving the page trapped.

The retained controls are tested in desktop Chromium and Pixel 5 sizing.

## Deep Detail Boundary

Detailed schedule, priorities, memory, connections, and the original continuous report remain available through explicit detail actions.

Opening detail mode temporarily restores the existing long-form modules and adds a fixed Return to Personal OS control. Returning restores the previous application and viewport lock.

## Existing Controls Preserved

- briefing switcher
- More controls
- guided tour
- light and dark themes
- current fictional scenario data
- preset switching
- the complete underlying report
- `/doc` product overview access

## Validation Requirements

The dedicated Personal OS validation covers:

- Full as the default for a new user
- all eight home modules present
- Quick View optional and locally persisted
- progressive disclosure
- visible pill actions
- local task completion
- fixed viewport and no default document scrolling
- internal mobile screen scrolling
- animated application movement
- Previous, Next, keyboard, and swipe navigation
- deliberate detail mode and return
- terminal entry points absent
- About links to `/doc/`
- switcher, More, and tour opening and closing
- no stranded blur or terminal-open class
- compact mobile cards
- mobile section expansion
- overflow protection
- Guided Flow completion

The complete underlying briefing smoke chain remains a separate compatibility gate. The older browser-test route keeps its legacy test contract while the new product behavior is covered by the Personal OS and overlay suites.

## Files

```text
assets/brief/brief-personal-os.js
assets/brief/brief-personal-os.css
assets/brief/brief-personal-os-density.css
assets/brief/brief-personal-os-mobile.css
assets/brief/brief-full-home.js
assets/brief/brief-full-home.css
assets/brief/brief-personal-os-stability.js
assets/brief/brief-personal-os-stability.css
assets/brief/brief-lite-ui.js
assets/brief/brief-lite-ui.css
tests/brief-personal-os-smoke.test.js
tests/brief-personal-os.spec.cjs
tests/brief-overlay-controls.spec.cjs
tests/brief-personal-os.playwright.config.cjs
.github/workflows/brief-personal-os-validation.yml
```

## Dependency Boundary

This branch starts from the terminal and overlay repair branch, but the Personal OS now keeps the terminal dormant while retaining the switcher, More menu, and guided tour.

The intended review order is:

1. Review the reusable overlay fixes from PR `#35`.
2. Rebase or retarget PR `#37` onto `main` when the dependency is resolved.
3. Review the Full-first Personal OS presentation, terminal removal, scrolling stabilization, and `/doc` links together.

Goal Intelligence Step 4 remains in PR `#34` and must not be mixed into this presentation change.

Nothing should be described as live until the relevant PRs are merged and deployed.
