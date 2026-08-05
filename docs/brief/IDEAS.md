# Personal OS Briefing Ideas Register

Last updated: **August 5, 2026 at 2:18 PM ET**

This file records approved ideas, completed checkpoints, deferred concepts, and active design rules for `/brief-next/` and the eventual `/brief/` cutover.

Read with:

- `docs/brief/CURRENT.md`
- `docs/brief/PHASE-1-WORKLOG.md`
- `docs/brief/DEMO-SIMPLIFICATION-STRATEGY.md`

## Product center

Personal OS is deeper than a dashboard or one AI conversation.

The product should demonstrate a user-owned memory and permission layer that helps a chosen AI understand useful context across time, people, accounts, goals, outcomes, and Spaces.

Approved differences from a normal AI chat:

- reviewable memory with sources, dates, confidence, corrections, sensitivity, expiry, and sharing rules
- continuity across conversations and daily briefings
- outcomes that improve later plans
- separate personal, relationship, family, business, team, and project Spaces
- user control to inspect, correct, restrict, share, or delete memory
- approved actions and automations after the conversation ends

Status: **implemented as an interactive first-pass explanation**

## Daily experience

Retain:

- strong weather and timing
- compact changing stats
- one next action
- selective navigation
- one deeper category at a time
- optional full long-form review
- music selected from approved preferences or connected accounts
- future voice and alarm routines
- light and dark themes
- enough visual depth for repeated daily use

Current decisions:

- dark is the first-visit default
- the dark foundation should be black and charcoal with blue intelligence accents
- a deliberately saved light preference should remain respected
- soundtrack is selected by default
- read-aloud remains absent from entry until audio behavior is intentionally designed

Status: **implemented, browser-tested, and published to staging**

## Focused views and Everything

Focused navigation remains the primary experience:

1. Today
2. Workspace
3. Spaces
4. How it works

An optional fifth view named **Everything** is approved.

Everything should:

- appear at the end of desktop and mobile navigation
- preserve the ability to scroll through the complete briefing
- never become the forced default
- include jump navigation
- include links back into focused views
- open specific Workspace categories directly
- update when the selected scenario changes
- remain one rendering surface, not another application shell

Status: **implemented, browser-tested, and published to staging**

## Stable shell, adaptive composition

The full dashboard may be composed again for each interactive update after the required data is gathered and checked.

Approved model:

1. Gather approved APIs, MCP tools, files, calendars, accounts, public sources, and Space records.
2. Research changes, compare sources, resolve conflicts, and identify missing context.
3. Interpret information through goals, permissions, memory, corrections, preferences, and outcomes.
4. Select the clearest components for the actual data.
5. Let the user inspect sources, navigate, correct memory, or approve action.
6. Record confirmed outcomes for the next briefing.

Possible adaptive components:

- chart for a meaningful trend
- timeline for schedule and sequence
- comparison for choices
- map for location, weather, travel, or routing
- alert for risk or required confirmation
- shared action list for couples, families, teams, and projects

Important guardrail:

**Personalized does not mean unpredictable.**

The information layer may adapt, while core navigation, permissions, accessibility, source visibility, and familiar locations remain stable.

Status: **implemented as a first-pass explanation and published to staging**

## Data beyond a dashboard

Approved outcomes include:

- morning briefing
- alarm and spoken executive overview
- selected music or playlist
- reminder
- calendar block
- task or handoff
- draft message or report
- goal adjustment
- recurring automation
- condition watch
- relationship or family coordination summary
- business operating review
- weekly progress review
- clarification question
- memory correction
- approved action after confirmation

Status: **explained in focused and full views; real actions remain later-phase work**

## Future app and alarm concept

The viewer should know that a Personal OS app is under consideration.

Approved concept:

- begin at the user’s selected alarm time
- rotate approved music from the connected Spotify account
- use listening history, saved preferences, and daily context
- read the concise executive overview
- provide snooze, skip, privacy, and playback controls
- continue directly into the relevant interactive briefing, calendar, route, message, or task

Boundary:

Real alarms, voice, playback, and account access require native-device permissions, provider rules, explicit controls, protected authentication, and tested fallbacks.

Status: **implemented as a clearly labeled future concept and published to staging**

## People and Spaces

Do not add a consumer-social friends list during the current frontend phase.

Use a clearer People and Spaces model:

- people appear because they belong to an approved Space
- each person or role has a defined relationship to that Space
- private context remains private
- shared information enters deliberately
- permissions explain who can read, contribute, approve, or act

Approved examples:

### Relationship Space

- two private profiles
- approved plans and promises
- shared calendar items
- decisions requiring both people
- neutral coordination without exposing private processing

### Family Space

- household expenses and bills
- chores and ownership
- pickups and appointments
- groceries and supplies
- calendar changes
- one shared household briefing
- parent-private and member-private boundaries

### Team or business Space

- projects, blockers, handoffs, decisions, and owners
- role-based access
- restricted finance, HR, credentials, and leadership preparation
- shared operating history without full account exposure

Status: **Relationship, Family, and Team examples implemented; Family remains explanatory, not a sixth main scenario**

## Privacy and account protection

Communicate briefly and clearly:

- private first
- purpose-scoped and least-privilege connections
- visible connection status
- reviewable memory
- separate private and shared records
- confirmation before consequential actions
- pause and revocation
- audit history
- no claim that a frontend gate is secure authentication

Status: **implemented through focused examples, full-view boundaries, and honest demo labels**

## Design direction

The target remains **complex simplicity**.

Approved rules:

- official system or platform feel
- black and charcoal dark foundation
- blue used as an intelligence accent
- restrained heading sizes
- weather remains visually strong
- stats must orient the user, not decorate the page
- interactive explanations should feel like product behavior
- progressive disclosure remains the primary path
- Everything remains optional

Status: **active and binding**

## Editability, automation, and replication

Build for:

- automation
- duplication
- replication
- editability
- adaptability
- reuse across people and Spaces
- daily data replacement without redesigning the entire interface manually

Implementation rules:

- scenario content remains structured
- one application controller owns global state
- one media controller owns playback surfaces
- explanatory components use reusable schemas
- Everything listens to the application’s scenario lifecycle
- avoid duplicate dashboards and timeout-driven correctness
- tests protect ownership and navigation
- Markdown checkpoints are updated after meaningful work

Status: **binding**

## News and daily updates

Current recommendation:

- weather and changing conditions remain the strongest daily-refresh proof
- generic news is not required during frontend stabilization
- daily automation returns only after the frontend and data contract are approved

The legacy `Refresh Brief Concept` automation remains paused.

Status: **complete**

## Draft review

Carry forward:

- PR #27 interactive walkthrough and selective navigation ideas
- PR #37 progressive disclosure, richer presentation, terminal removal, and safe scrolling
- PR #35 test-environment lessons
- PR #38 concise `/doc` connection and privacy-audit lesson

Do not carry forward:

- terminal repair as a Brief Next requirement
- multiple depth controllers
- overlapping overlays and stranded blur states
- hidden duplicate dashboards
- old architecture only because old tests expected it

Grok `/tmp` material is not a durable source of truth.

Status: **reviewed**

## Publishing decision

`/brief-next/` remains staging.

Do not replace `/brief/` until:

- visual review is complete
- mobile and short-height behavior are reviewed
- contrast and accessibility are verified
- editing map and daily data contract are complete
- media behavior is tested
- rollback is prepared
- explicit cutover approval is given

## Completed checkpoint: Adaptive Everything and dark default

- [x] Add Everything as the fifth navigation option.
- [x] Keep focused views primary.
- [x] Add jump links through the full briefing.
- [x] Render all Workspace categories in the full view.
- [x] Add links back to focused views and specific Workspace tabs.
- [x] Explain adaptive charts, timelines, maps, comparisons, alerts, and shared actions.
- [x] Explain research across approved APIs, MCP tools, connections, public sources, memory, and Spaces.
- [x] Add the future Spotify alarm and spoken executive-overview concept.
- [x] Make dark the first-visit default.
- [x] Restore a black and charcoal visual foundation.
- [x] Preserve a deliberately saved light preference.
- [x] Keep soundtrack selected after reset.
- [x] Extend static and browser validation.
- [x] Publish the validated slice to staging through clean PR #44.

Validation and publication:

```text
Validated product revision: 1175826cafc71719e100b56a525f768b40fd7122
Development run: 31034883845
Development static: 92404364989, passed
Development browser: 92404365175, passed
Staging PR: #44
Staging run: 31035274638
Staging static: 92405680264, passed
Staging browser: 92405680241, passed
Merged main commit: 52bdf372e438d298e9bed39f293baf0d98d52d0a
```

## Next idea checkpoint

- visually review Everything on desktop and mobile
- inspect five-button mobile density and sticky jump navigation
- remove any repetition that does not help understanding
- create the common editing map and daily data contract
- measure contrast and keyboard behavior
- begin authorized preview-audio selection only after visual review
