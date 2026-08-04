# Brief Personal OS Redesign

**Date:** August 4, 2026  
**Repository:** `CMXChat/First-Repo`  
**Branch:** `agent/brief-personal-os-shell`  
**Depends on:** draft PR `#35`  
**Status:** Major interaction redesign in validation  
**Production status:** Not merged or deployed

## Product Decision

The default `/brief` experience should behave like a personal operating system, not a long report.

The old continuous page remains available as an optional deep-detail view. It is no longer the default interaction model.

## Default Structure

The OS uses six function applications:

1. Today
2. Day or the scenario-specific timeline
3. Work, Plans, Decisions, Training, or My Work
4. Private, Profiles, Partners, Coach, or Spaces
5. Insight, Reflection, Signals, Progress, or Handoffs
6. System

Labels adapt to the selected Personal, Relationship, Business, Trainer, or Team briefing.

## Navigation Model

Desktop uses a compact application rail.

Mobile uses a six-application bottom dock.

Every application occupies one viewport-sized screen. Moving between applications uses a horizontal animated transition. The document itself stays locked to the viewport, so normal use does not become a long page scroll.

Navigation methods include:

- application rail or bottom dock
- Previous and Next buttons
- a context-aware next CTA
- keyboard left and right arrows
- touch swipe
- URL state through the `os` query parameter

## Guided Movement

Normal operation remains deliberate. The interface does not unexpectedly move while the user is reading or acting.

An optional Guided Flow advances through the applications once, then stops at System. Any manual navigation stops the flow.

## Condensation

The redesign reduces oversized desktop cards and repeated explanation sections.

The default Today screen contains:

- one current command
- one next event
- one context card
- one following action

The action screen uses a compact queue with local completion state. The spaces screen separates private and approved shared records into two panes. The intelligence screen keeps only signals that affect timing, ownership, risk, or the next action.

## Deep Detail Boundary

Detailed schedule, priorities, memory, connections, and the full continuous report remain available through explicit detail buttons.

Opening detail mode temporarily restores the existing long-form modules and provides a fixed Return to Personal OS control. Returning restores the prior OS application and locks the document back to the viewport.

## Existing Controls

The redesign preserves:

- briefing/profile switcher
- repaired terminal
- terminal close and Escape behavior
- top-level More and Tour controls
- selected briefing preset
- existing fictional scenario data
- light and dark themes

## Responsive Rules

### Desktop

- compact left application rail
- fixed command bar
- one active application screen
- internal screen scrolling only when needed
- reduced maximum heading and card sizes

### Mobile

- bottom application dock
- compact top controls
- horizontal application movement
- no default document scrolling
- internal screen scrolling for content that exceeds the available height

## Validation

The dedicated validation covers:

- JavaScript syntax and structural contracts
- desktop viewport lock
- hidden continuous report during OS use
- animated application movement
- Next and keyboard navigation
- deliberate detail mode and return flow
- terminal opening from the OS
- mobile bottom navigation
- horizontal overflow protection
- guided flow completion and stop state

## Files

```text
assets/brief/brief-personal-os.js
assets/brief/brief-personal-os.css
assets/brief/brief-lite-ui.js
assets/brief/brief-lite-ui.css
tests/brief-personal-os-smoke.test.js
tests/brief-personal-os.spec.cjs
tests/brief-personal-os.playwright.config.cjs
.github/workflows/brief-personal-os-validation.yml
```

## Dependency Boundary

This branch starts from the terminal and overlay repair branch so the Personal OS can use the repaired controls.

The intended review order is:

1. Review and merge PR `#35`.
2. Rebase or retarget the Personal OS PR onto `main` after `#35` lands.
3. Review the OS interaction model separately.

Nothing should be described as live until the relevant PRs are merged and deployed.
