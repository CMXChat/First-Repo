# Personal OS Visual Intelligence Map

Last updated: **August 5, 2026 at 3:18 PM ET**

## Purpose

This file defines how `/brief-next/` demonstrates the product model described in the Personal OS `/doc` rewrite while selectively preserving useful visual ideas from the older `/brief/` implementation.

Read this file with:

- `docs/brief/CURRENT.md`
- `docs/brief/IDEAS.md`
- `docs/brief/PHASE-1-WORKLOG.md`
- draft PR #45, `Rebuild Personal OS product overview`

## Product rule

The focused briefing remains calm and fast.

Rich visual proof belongs:

1. inside the focused section where it directly clarifies the current decision
2. inside the optional Everything view for complete review and product demonstration

Visual richness must not create another application shell, another global state owner, another media controller, or a return to one mandatory endless page.

## `/doc` rewrite to demo map

| `/doc` product idea | `/brief-next/` demonstration |
| --- | --- |
| Brief as the smallest useful daily view | Today remains the default focused experience |
| Spaces separate private and shared context | Spaces view, Family/Relationship/Team examples, permission matrix |
| Seven memory layers | Structured memory inspector with type, source, freshness, visibility and action scope |
| Goals and Goal Pulse | Scenario-specific current goal, difficulty, trajectory, blocker, confidence, useful question and next action |
| Replaceable AI models | How view and adaptive-composition explanation preserve stable Personal OS context outside the model |
| Source, freshness, visibility and action scope | Permission matrix, pipeline trust row and memory metadata |
| Continuous intelligence loop | Interactive input laboratory: authorize, normalize, scope, research, compose, confirm and learn |
| Alarm, music, voice and morning ritual | Future app and Spotify alarm concept in Everything |
| Demonstrated versus Planned | Current-reality status section in Everything |
| FastAPI, PostgreSQL, connectors, APIs and MCP tools | Backend-input simulation with explicit planned-platform boundary |
| Human approval and provenance | Permission matrix, action labels and approval-gated pipeline result |
| Full technical and product explanation | Topbar, How view and Everything CTAs to `/doc/` |

## Legacy `/brief` visual review

### Retained concepts

- large weather presentation
- hourly weather movement
- trend visualization
- schedule timeline
- structured memory records
- spreadsheet-like operating tables
- data-source and connection labels
- backend-flow explanation
- shared Space boundaries
- scenario-specific visual changes
- music as a contextual daily experience

### Rebuilt instead of copied

The concepts above are implemented through the isolated Brief Next architecture. No legacy renderer, terminal, overlay, depth controller, duplicate dashboard, provider embed, or long script chain is imported.

### Deferred

- full music artwork and authorized preview playback
- real maps
- live financial charts
- provider connection management
- real backend synchronization
- actual scheduled edition generation
- external writes and automations

These remain deferred until the relevant protected data and media contracts exist.

## Visual component registry

The current visual layer may render:

- forecast trend
- compact bars
- structured data table
- ledger-style view
- progress ring
- ownership or permission matrix
- timeline
- Goal Pulse
- memory records
- connected-input pipeline
- current-versus-planned comparison

The future AI may choose among approved components based on verified data. The AI should not invent arbitrary page structures each day.

Stable elements:

- navigation
- theme and accessibility controls
- source labels
- permissions
- familiar view locations
- confirmation behavior
- route and URL behavior

Adaptive elements:

- applicable modules
- order inside the daily content area
- chart or table choice
- highlighted insight
- question
- recommendation
- detail level

## Runtime ownership

```text
brief-demo-app.js
  sole global application state owner

brief-demo-media.js
  sole media owner

brief-demo-experience.js
  Everything renderer and visual-layer loader

brief-demo-visuals.js
  presentation-only visual intelligence renderer

brief-demo-visuals.css
  charts, tables, pipeline, Goal Pulse, memory, permissions and animation
```

`brief-demo-visuals.js` may listen to existing lifecycle events and observe rendered Workspace content. It must not own scenario, view, tab, theme, URL or media state.

## Interactive input laboratory

The demo input choices are:

- Calendar
- Email
- Weather
- Files
- Finance
- Spotify
- Goals
- Memory
- Public research
- Shared Space

Toggling an input changes the sample generated module preview.

This is a frontend explanation of the intended contract. It does not imply that a private account, MCP server, connector or backend is currently active.

The planned flow is:

1. authorize and gather
2. normalize typed records
3. apply Space and permission rules
4. research and verify
5. compose the interactive edition
6. confirm consequential action and record the outcome

## Theme contract

- `/brief-next/` clean visits start dark
- `/brief/` source starts black-first
- the `/doc` rewrite in PR #45 starts dark-first
- saved explicit light preference may remain respected
- reset must not silently change theme
- dark backgrounds use black and charcoal
- blue remains an accent

## Animation contract

Allowed:

- chart line reveal
- bar growth
- progress fill
- restrained section reveal
- smooth scenario and data updates

Disallowed:

- constant decorative movement
- required animation for comprehension
- timer chains for correctness
- motion that blocks navigation or input
- animation that ignores reduced-motion preferences

## CTA contract

The demo links to `/doc/` from:

- topbar
- How view
- Goal Pulse
- memory inspector
- backend-input section
- status section
- final Everything bridge

The demo proves the experience. `/doc/` explains the complete operating model, architecture and development boundary.

## Validation requirements

Static coverage must confirm:

- visual files parse
- no timers
- one application owner
- one media owner
- `/doc/` links
- input pipeline wording
- Goal Pulse, memory and permission components
- reduced-motion handling
- `/brief/` remains black-first

Browser coverage must confirm:

- Today chart renders
- Workspace visual changes with context
- Everything exposes the rich sections
- input toggles change the generated module preview
- scenario changes refresh Goal Pulse and memory
- mobile navigation stays above rich content
- no horizontal overflow
- dark and saved-light behavior remain reversible

## Publishing boundary

Publish this checkpoint to `/brief-next/` through a clean branch created from `main` after isolated development validation passes.

Do not change production `/brief/` during this checkpoint.

Do not merge the stacked development PR into `main` merely to publish staging.
