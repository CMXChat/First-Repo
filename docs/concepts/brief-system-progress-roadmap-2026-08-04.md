# `/brief` System Progress, Current State, and Roadmap

**Recorded:** August 4, 2026 at 3:17 PM EDT  
**Project:** `db.cmxchat.com/brief/`  
**Repository:** `CMXChat/First-Repo`  
**Document type:** Dated implementation and planning update  
**Status:** Living project record  
**Related concept:** `docs/concepts/brief-goal-intelligence-concept-2026-08-04.md`

## Purpose of This Document

This file records what has been built, changed, discussed, and planned for `/brief` as of the timestamp above.

The goal is to preserve the current product direction across future development sessions and context windows. It distinguishes between:

- Work already implemented in the repository
- Work that appears functional but still needs browser validation
- Decisions that are currently guiding the interface
- Ideas that remain conceptual
- Backend work that has not started

This is a status and roadmap document. It is not proof that every feature has completed production testing.

## Current Product Direction

`/brief` is evolving from a long interactive concept page into a small personal intelligence application.

The strongest existing content and visual modules are being preserved, but the default experience should no longer feel like one endless document. The intended product model now has three viewing levels:

```text
Focus View
    ↓
Workspace
    ↓
Full View
```

The user should see the smallest useful amount of information first, move between connected views through stable navigation, and open the entire long-form briefing only when desired.

## Product Decisions Confirmed So Far

The current working decisions are:

1. The hero remains the first visible screen after entry.
2. Focus View becomes the default daily experience.
3. Workspace becomes the main app experience.
4. Full View preserves the complete long-form document and all major visual modules.
5. One unified controller should own mode, section, tabs, URL state, history, overlays, and scroll behavior.
6. Cards should link to related views instead of existing as isolated blocks.
7. The terminal should remain available as a compact bottom command interface.
8. Explanatory product content should move into a searchable information library.
9. Scenario-specific tabs should change according to the selected briefing.
10. Private and shared spaces must remain visibly separate.
11. Demo, live public, disconnected, planned, and connected data should remain honestly labeled.
12. Existing strong visual design should be preserved while navigation and hierarchy are simplified.

## Briefing Types

The system currently supports five demonstration contexts:

- Personal
- Relationship
- Business partners
- Trainer and student
- Team and project

Each briefing can have different data, permissions, tabs, terminology, priorities, and recommended actions while using the same product shell.

## Work Completed Before the System Redesign

The `/brief` project already contained a large set of frontend concept modules, including:

- Entry and briefing selection
- Personal, relationship, business, trainer, and team scenarios
- Weather
- Music and Spotify demonstrations
- Daily schedule
- Priorities and actions
- Private and shared spaces
- Memory and learning controls
- Connections and provider status
- Public information layers
- Relationship media
- Team project and handoff views
- A command terminal
- Product explanation and walkthrough components
- Quick briefing panels
- Full visual scenario sections

The project had useful content and visual depth, but multiple navigation and scroll systems were layered over the same long document.

## Problems Identified

### 1. Entry did not consistently remain at the hero

After selecting a briefing, delayed scripts could call `scrollIntoView()` and pull the user down to a workspace, scenario section, or restored URL target.

The issue was larger than one incorrect scroll command. Multiple controllers could independently restore navigation, update hashes, select tabs, and reposition the document.

### 2. Lite Mode leaked Full View content

Quick or Lite Mode could still expose large scenario cards, full explanatory sections, floating navigation, and visual layouts intended for the long-form experience.

This made Lite Mode feel like a partially hidden document instead of a compact product mode.

### 3. Mobile light mode had visual failures

Some dark cards retained dark-mode text values in light mode. This produced low-contrast cards and unreadable content, especially in relationship and scenario sections.

### 4. The top toolbar had weak hierarchy

The row of equal circular controls made switcher, theme, music, navigation, narration, and help look equally important. On mobile, the spacing felt accidental and the first control could appear duplicated.

### 5. Too many navigation systems existed at once

The page included combinations of:

- Section anchors
- Quick tabs
- Sticky route bars
- Map navigation
- Runtime route restoration
- Full-document scrolling
- Terminal navigation
- Scenario switchers
- Lite Mode controls
- Browser history and hash behavior

These systems could compete with each other.

### 6. The page felt like a document instead of a product

Even though the project contained interactive modules, the dominant experience remained a long page. Important information was separated by large amounts of explanation and demonstration content.

## Fixes Completed Before the Unified System

Before the larger redesign, several targeted fixes were added:

- A stronger entry-position guard
- Route and hash cleanup during entry
- Scroll restoration protection
- Mobile Lite Mode card layouts
- Quick-mode content isolation
- Theme contrast repairs
- Music control repair using the official song player
- A small neon Lite Mode callout
- Top control polishing
- Moving private/shared controls away from the crowded toolbar
- Regression smoke tests for Lite Mode and hero entry behavior

These patches improved the current page, but they also confirmed that the root problem was architectural.

## Unified `/brief` System Implemented

A new application layer was added to reorganize the existing project without deleting its strongest content.

### Main system files

```text
assets/brief/brief-system.js
assets/brief/brief-system.css
assets/brief/brief-system-fixes.css
```

Compatibility loading is currently handled through existing entry files so the redesign can launch without rebuilding the entire HTML document immediately.

### Current system modes

#### Focus View

Focus View is intended to be the default entry experience.

It contains:

- The existing hero
- A compact daily operating view
- Connected signal cards
- Recommended next action
- Direct links into relevant workspace tabs
- Access to Workspace and Full View

The goal is to answer:

> What matters now, and where should the user go next?

#### Workspace

Workspace is the main structured application view.

The primary navigation is:

```text
Home
Briefing
Spaces
Plans
Library
```

This navigation remains stable across all briefing types.

The Briefing section uses scenario-specific secondary tabs.

##### Personal tabs

```text
Overview
Day
Work
Money
Wellness
Intelligence
```

##### Relationship tabs

```text
Overview
Together
Profiles
Plans
Watch
Reflection
```

##### Business tabs

```text
Executive
Finance
Projects
Decisions
Markets
Partners
```

##### Trainer tabs

```text
Overview
Today
Habits
Progress
Recovery
Coach
```

##### Team tabs

```text
Overview
My Work
Project
Handoffs
Procedures
Finance
Spaces
```

Only the selected workspace panel should be active. The user should not need to scroll through unrelated scenario content to reach another view.

#### Full View

Full View preserves the complete briefing page, including:

- Large scenario visuals
- Charts
- Detailed explanations
- Full schedules
- Music sections
- Memory education
- Connection demonstrations
- Team, relationship, business, and trainer modules
- The complete long-form experience

Full View should include a compact jump interface and an obvious route back to Workspace.

## Header Redesign

The old row of equal circular controls is being replaced by a clearer app header.

The intended primary controls are:

- Current briefing switcher
- Command terminal
- Guided tour
- More menu

The More menu can contain:

- Appearance
- Music
- Narration
- Connection status
- Reset experience

This creates a clearer hierarchy and reduces permanent toolbar clutter.

## Card Interlinking

Cards are being treated as connected parts of the application.

A card can now lead to:

- A scenario-specific briefing tab
- Plans
- Spaces
- A library guide
- A related Full View module
- The terminal for a relevant command

The intended interaction model is:

```text
Summary card
    ↓
Related workspace view
    ↓
Detailed article or Full View module when needed
```

This brings blog-style internal linking into an application interface without turning the page into a normal website article.

## Information Library

A searchable library has been added to the unified system.

Current library topics include:

- How the briefing works
- Private and shared spaces
- Memory and corrections
- Connection status
- Briefing modules
- Security and backend direction
- Navigation and viewing modes
- Frequently asked questions

The library is intended to absorb explanatory content that should not interrupt the daily briefing.

Long-term, each library item can become a structured article with:

- Category
- Summary
- Full explanation
- Related guides
- Link to the relevant working module
- Source or authority note
- Last revised date

## Guided Walkthrough

A five-step walkthrough has been added to explain the product structure.

The walkthrough introduces:

1. Focus View
2. Workspace navigation
3. Scenario-specific tabs
4. Information Library
5. Terminal and Full View

The existing vision-tour work can be consolidated into this system so the project does not maintain two unrelated walkthrough experiences.

## Terminal Direction

The terminal remains an important part of the concept.

It is being moved from a large page section into a persistent bottom command bar with an expandable drawer.

The intended experience is:

```text
Ask this briefing or type a command...
```

Possible commands include:

```text
open plans
show shared agreements
switch to business
view full briefing
open library
show connections
what is fictional here?
```

The current terminal still uses frontend navigation and demonstration logic. Protected files, connected accounts, private data, and real actions require the future backend.

## Scroll and URL Ownership

The new system is intended to become the only owner of:

- Current briefing type
- Current mode
- Current primary section
- Current secondary tab
- URL state
- Browser history
- Scroll positioning
- Mobile drawer state
- More menu state
- Briefing switcher state
- Walkthrough state
- Terminal drawer state

Other modules should request navigation through the unified controller instead of directly changing hashes or scrolling the page.

A public API is exposed through `window.BRIEF_SYSTEM` for controlled navigation.

## Entry and Hero Position

The redesigned controller includes:

- An entry lock before the gate closes
- Route and hash cleanup
- Scroll restoration control
- Repeated top-position enforcement during delayed rendering
- Protection against non-hero `scrollIntoView()` calls during entry
- A final release after the interface stabilizes

A recent phone check showed the hero opening at the correct location after entry. Continued mobile validation is still required because legacy scripts remain in the repository and browser caching can expose older behavior.

## Current Repository Strategy

The new system is layered over the existing project instead of deleting the long-form implementation immediately.

This allows the project to:

- Preserve existing visuals
- Preserve existing demonstration content
- Introduce a better application shell
- Keep Full View available
- Reduce risk while the new navigation is validated

Some older files remain in the repository as compatibility or fallback code. They should not be removed until the new system passes mobile and desktop browser testing.

## Current Status as of August 4, 2026 at 3:17 PM EDT

### Implemented in the repository

- Unified system controller
- Focus, Workspace, and Full View model
- Stable primary navigation
- Scenario-specific pill tabs
- Briefing switcher
- More menu
- Searchable information library
- Library article views
- FAQ content
- Guided walkthrough
- Terminal bottom dock and drawer direction
- Connected card navigation
- URL and history state handling
- Entry scroll lock
- Responsive system styling
- Light and dark theme support
- Compatibility loading through existing project files

### Appears improved but still needs browser validation

- Hero position after delayed scripts finish
- Mobile header spacing
- Mobile drawers and overlays
- Full View return navigation
- Light-mode contrast across every legacy visual
- Tab focus and accessibility behavior
- Browser back and forward behavior
- Terminal commands after the unified system takes control
- Scenario switching while an overlay is open
- Cache behavior on the deployed GitHub Pages site

### Not implemented as a real backend

- Authentication
- User accounts
- Database storage
- FastAPI API routes
- PostgreSQL
- Real private data
- Real connector permissions
- Real goal records
- Goal check-ins
- AI recommendation storage
- File uploads
- Secure secrets management
- Audit logs
- Approval-gated external actions
- Scheduled backend jobs

## Known Technical Risks

### Legacy overlap

Older navigation and scroll files still exist. Fresh-load product layers now point toward the unified controller, but old cached assets or late-loading compatibility files may still create conflicts.

### Static HTML size

The complete long-form document still exists in the page. Focus and Workspace hide most of it, but the browser still receives and initializes many modules.

A later refactor should load Full View modules only when needed.

### Multiple data shapes

The project currently draws from several global frontend objects and scenario files. A structured data contract will be needed before the backend is connected.

### Terminal routing

Some terminal commands still point to legacy selectors and scroll targets. These should gradually use `BRIEF_SYSTEM` routes instead.

### Browser cache

GitHub Pages and mobile browsers may retain older HTML, CSS, or JavaScript versions. Versioning must be consistent whenever the system changes.

### Visual consistency

The project combines several generations of interface design. The unified shell should define shared spacing, typography, cards, controls, focus states, and responsive rules without flattening the distinctive scenario visuals.

## Recommended Immediate Work

### Phase 1: Browser validation and stabilization

Test on:

- Android Chrome
- Desktop Chrome
- Safari or iPhone, when available
- Firefox
- Light mode
- Dark mode
- Narrow screens
- Reduced motion

Validate:

- Entry always lands at the hero
- Focus View hides unrelated sections
- Workspace switches panels without page jumps
- Full View shows all preserved modules
- Browser back and forward restore the correct state
- Terminal opens and closes correctly
- Menus do not trap or lose focus
- Scenario switching resets to a safe default
- No text becomes unreadable in light mode

### Phase 2: Remove navigation duplication

After validation:

- Retire old sticky navigation on new system loads
- Retire old route restoration
- Remove duplicate top controls
- Redirect terminal navigation through `BRIEF_SYSTEM`
- Consolidate walkthrough logic
- Remove obsolete Lite Mode behavior
- Keep only one URL and history controller

### Phase 3: Normalize frontend data

Create a single structured configuration for:

- Briefing types
- Primary sections
- Secondary tabs
- Card routes
- Full View targets
- Library articles
- Permissions
- Demo and connection labels

The interface should render from this configuration instead of relying on scattered conditionals.

### Phase 4: Performance refactor

Consider:

- Lazy loading Full View sections
- Loading scenario modules only when selected
- Deferring Spotify and video embeds
- Reducing repeated runtime observers
- Removing unused compatibility layers
- Measuring mobile load time and layout shifts

### Phase 5: FastAPI staging backend

The planned backend direction remains:

```text
Browser frontend
        ↓
FastAPI
        ↓
PostgreSQL and protected services
```

The first backend milestone should be small:

1. Run a FastAPI application locally or in staging.
2. Expose one health route.
3. Expose one POST route.
4. Submit one form from the frontend.
5. Store one structured record.
6. Return and display the saved record.

This should be completed before adding broad connector or AI complexity.

## Relationship to Goal Intelligence

The separate Goal Intelligence concept proposes that goals eventually become an organizing layer for the broader system.

The redesigned `/brief` interface supports that direction because it now has places for:

- Focused daily output
- Structured plans
- Scenario-specific workspaces
- Related evidence
- Library explanations
- Questions and walkthroughs
- Terminal commands
- Full historical or analytical views

A future Goals area could live inside Workspace as a primary section or as a dedicated route.

The minimum goal loop remains:

```text
Define a goal
    ↓
Select difficulty
    ↓
Answer one useful check-in
    ↓
Receive one contextual question
    ↓
Receive one recommended action
    ↓
Record the result
    ↓
Update the next brief
```

The goal system should not be connected until the frontend interaction proves useful with sample data.

## Proposed Goal Integration Into the New Interface

### Focus View

Show only:

- Current goal pulse
- Trajectory
- Main blocker
- Best next action
- One open question

### Workspace

Add a Goals or Plans experience with:

- Active goals
- Difficulty
- Milestones
- Check-ins
- Evidence
- Decisions
- History
- Privacy level

### Full View

Show:

- Complete goal history
- Supporting evidence
- Detailed trajectory
- Past recommendations
- Revisions
- Related messages, commits, calendar events, and documents

### Terminal

Possible future commands:

```text
show goals
check in
what changed?
why this action?
set difficulty focused
record blocker deployment
show evidence
```

## Future Backend Capabilities

Potential later capabilities include:

- Authenticated private profiles
- Shared spaces with explicit membership
- Goal records
- Check-ins
- Evidence records
- Memory with expiry and corrections
- Calendar and email connectors
- GitHub activity
- ClickUp project context
- Google Drive documents
- Spotify preferences
- Financial context
- Scheduled briefing generation
- Approval-gated actions
- Audit history

Each connector should be optional, scoped, visible, and removable.

## Definition of a Successful Frontend Version

The frontend concept is successful when a new user can:

1. Choose a briefing.
2. Enter and remain at the hero.
3. Understand what matters now within seconds.
4. Open Workspace without seeing unrelated sections.
5. Move through tabs without unpredictable scrolling.
6. Understand private and shared boundaries.
7. Find explanations in the Library.
8. Open the terminal and run a useful command.
9. Open Full View when more depth is desired.
10. Return to Focus or Workspace without losing context.

The interface should feel like one product, not several demonstrations stacked together.

## Working Architecture Summary

```text
/brief entry
    ↓
Focus View
    ├── Hero
    ├── What matters now
    ├── Recommended action
    └── Connected cards

Workspace
    ├── Home
    ├── Briefing
    │   └── Scenario-specific tabs
    ├── Spaces
    ├── Plans
    └── Library

Full View
    └── Complete long-form briefing and visual modules

Persistent product layers
    ├── Briefing switcher
    ├── More menu
    ├── Guided walkthrough
    └── Terminal dock and drawer

Future backend
    ├── FastAPI
    ├── PostgreSQL
    ├── Authentication
    ├── Permissions
    ├── Goal intelligence
    ├── Connectors
    └── Scheduled briefing generation
```

## Current Working Summary

```text
Focus shows what matters now.
Workspace organizes the active system.
Full View preserves depth.
The Library explains the product.
The terminal provides direct control.
Goals can eventually define direction.
Evidence keeps recommendations honest.
One controller should own navigation and state.
```

## Important Boundaries

- Existing demo data should not be described as real private data.
- Frontend storage is not a secure user database.
- The terminal is currently a demonstration and navigation layer.
- The system shell is implemented, but full browser testing is still required.
- The Goal Intelligence note remains a concept and does not authorize backend implementation by itself.
- Security-sensitive features require server-side authentication and permissions.
- Old files should not be deleted until the unified system is proven stable.

## Recent Implementation Reference

The main system rollout on August 4, 2026 introduced the unified controller and supporting styles, with the latest related repository update at the time of this document recorded after commit:

```text
9cd5b504bbba27c6a65a5d87ca2a63976bc0df4a
```

Future revisions should replace or expand this reference when the architecture changes materially.

## Next Review

Review this document after the first full mobile and desktop validation pass.

The next update should record:

- Which modes worked reliably
- Which legacy files still interfered
- Which controls were removed
- Which visual issues remain
- Whether Full View can be lazy loaded
- Whether the frontend goal prototype should begin
- Whether FastAPI staging should begin

## Revision Guidance

When revising this document:

1. Preserve the original recorded timestamp.
2. Add a **Last revised** field.
3. Add an entry to the revision log.
4. Separate implemented work from planned work.
5. Include important commit references.
6. Record browser validation honestly.
7. Keep this file aligned with the separate Goal Intelligence concept note.

**Last revised:** August 4, 2026 at 3:17 PM EDT

## Revision Log

### August 4, 2026 at 3:17 PM EDT

- Recorded the existing `/brief` modules and earlier interface problems.
- Documented the hero, Lite Mode, theme, music, and toolbar fixes.
- Recorded the shift from a long document to Focus, Workspace, and Full View.
- Documented primary navigation and scenario-specific tabs.
- Documented card interlinking, the Information Library, walkthrough, and terminal drawer.
- Recorded the unified navigation and state ownership strategy.
- Separated implemented frontend work from unimplemented backend work.
- Added immediate validation, cleanup, data, performance, FastAPI, and Goal Intelligence phases.
