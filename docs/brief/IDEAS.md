# Personal OS Briefing Ideas Register

Last updated: **August 5, 2026 at 1:44 PM ET**

This file records approved product ideas, design decisions, deferred concepts, and completed implementation checkpoints for `/brief-next/` and the eventual `/brief/` cutover.

Read this file together with:

- `docs/brief/CURRENT.md`
- `docs/brief/PHASE-1-WORKLOG.md`
- `docs/brief/DEMO-SIMPLIFICATION-STRATEGY.md`

## Product center

The core product story is deeper than a dashboard.

Personal OS should demonstrate how a user-owned memory and permissions layer can help a chosen AI understand useful context across time, people, accounts, goals, and Spaces.

The primary difference from a regular AI chat should be visible through interaction:

- normal AI mainly responds to the current conversation
- Personal OS can use reviewable memory with sources, dates, corrections, confidence, sensitivity, expiry, and sharing rules
- normal AI often ends after giving advice
- Personal OS can record what happened, connect the outcome to a goal, and improve the next briefing
- normal AI may mix context loosely
- Personal OS separates personal, relationship, family, business, team, and project Spaces
- normal AI may remember a preference without showing how it is used
- Personal OS should let the user inspect, correct, restrict, share, or delete memory

Status: **implemented as an interactive first-pass explanation on August 5, 2026**

## Daily experience

The Daily Briefing remains the visible experience.

It should feel useful enough for repeated daily use while staying immediately understandable.

Retain:

- strong weather and timing
- compact changing stats
- one next action
- selective navigation instead of one endless page
- one deeper category at a time
- music selected from approved preferences or connected accounts
- optional future voice and alarm routines
- light and dark themes
- enough visual depth to reward returning users

The default entry soundtrack option should be selected.

Read-aloud should remain unchecked and should not return to the main entry path until audio behavior is stable and the setting is intentionally designed.

Status: **soundtrack default completed; read-aloud remains absent**

## Data beyond a dashboard

The demo should explain and eventually demonstrate how approved data can become:

- a morning briefing
- an alarm and spoken summary
- a selected song or playlist
- a reminder
- a calendar block
- a task or handoff
- a draft message or report
- a goal adjustment
- a recurring automation
- a condition watch
- a relationship or family coordination summary
- a business operating review
- a weekly progress review
- a question when the system needs clarification
- a correction to memory
- an approved action after confirmation

Status: **eight outcome types are now explained; real actions and automations remain later-phase work**

## People and Spaces

Do not add a consumer-social friends list during the current frontend phase.

A friends list would imply a social network and create unnecessary questions about messaging, discovery, invitations, presence, moderation, and public identity.

Use a clearer **People and Spaces** model instead:

- people appear because they belong to an approved Space
- each person or role has a clear relationship to that Space
- private context remains private
- shared information enters the Space deliberately
- permissions explain who can read, contribute, approve, or act

Approved interactive examples:

### Relationship Space

- two private profiles
- approved plans and promises
- shared calendar items
- decisions that require both people
- neutral coordination without exposing private processing

### Family Space

- current household expenses
- chores and ownership
- school pickups or appointments
- groceries and household supplies
- family calendar changes
- one shared household briefing
- parent-private or member-private notes remain outside the shared briefing

### Business or Team Space

- projects, blockers, handoffs, decisions, and owners
- role-based access
- restricted finance, HR, credentials, and leadership preparation
- shared operating history without full account exposure

Status: **Relationship, Family, and Team examples implemented; Family remains explanatory, not a sixth main scenario**

## Privacy and account protection

Privacy should be explained briefly, clearly, and interestingly.

The product should communicate:

- private first
- purpose-scoped access
- least-privilege connections
- visible connection status
- reviewable memory
- separate private and shared records
- confirmation before consequential actions
- access that can be paused or revoked
- audit history for important changes
- no implication that a frontend gate is secure authentication

Status: **first-pass privacy callout and Space-specific protection examples implemented**

## Design direction

The target remains **complex simplicity**.

The interface should feel like an official system or platform, not an advertising landing page.

Approved refinements:

- reduce oversized mobile entry and hero headings
- preserve the current visual quality
- maintain strong weather presentation
- keep app-like navigation
- avoid empty decorative KPI cards
- make interactive explanations feel like product behavior, not a slide deck
- use progressive disclosure
- keep normal edits predictable for developers and AI

Status: **mobile heading scale completed and browser-tested; broader visual review remains open**

## Editability, automation, and replication

The frontend should be built for:

- automation
- duplication
- replication
- editability
- adaptability
- reuse across different people and Spaces
- daily data replacement without redesigning the interface

Implementation principles:

- visible scenario content belongs in structured data
- one application controller owns global state
- media has one owner
- explanatory components use a small reusable schema
- avoid one-off selectors and duplicated dashboards
- tests protect the ownership model
- every meaningful change updates the Markdown checkpoint files

Status: **binding; the explainer component uses a reusable schema and does not become a second app controller**

## News and daily updates

Current recommendation:

- keep weather and time-sensitive conditions as the strongest proof of daily refresh
- do not make generic news a central requirement during the frontend stabilization phase
- add a daily update automation only after the product and data contract are complete

The legacy `Refresh Brief Concept` automation is paused.

Status: **completed on August 5, 2026**

## Draft and prior-work review

Ideas worth carrying forward from earlier drafts:

- interactive walkthrough missions from PR #27
- selective navigation and direct content landing from PR #27
- progressive disclosure and concise Full-first richness from PR #37
- terminal removal and safe internal scrolling from PR #37
- visible permission choices and approved-action framing from the earlier Vision work
- test harness lessons from PR #35
- concise `/doc` connection from PR #38

Ideas not carried into Brief Next:

- terminal repair as a product requirement
- multiple depth controllers
- overlapping overlays and blur state
- hidden duplicate dashboards
- preserving old architecture only because tests expected it

Grok `/tmp` work remains inaccessible and is not treated as a source of truth.

Status: **reviewed on August 5, 2026**

## Publishing decision

`/brief-next/` remains the experimental route.

Production `/brief/` should not be replaced until:

- product review is complete
- memory and Spaces storytelling is strong
- mobile typography and short-height behavior are reviewed
- media behavior is tested
- accessibility and contrast are verified
- content editing instructions are complete
- rollback is prepared
- explicit cutover approval is given

Status: **memory and Space storytelling plus mobile heading work are complete; cutover remains unapproved**

## Completed implementation slice: August 5, 2026

- [x] Select soundtrack by default on entry and after reset.
- [x] Keep read-aloud absent and unchecked.
- [x] Reduce mobile entry and hero heading scale.
- [x] Add an interactive regular-AI versus Personal-OS memory comparison.
- [x] Add interactive Relationship, Family, and Team Space examples.
- [x] Add concise examples of what approved data can become beyond a dashboard.
- [x] Keep privacy explanations brief and visible.
- [x] Extend static and desktop/mobile browser tests.
- [x] Review relevant open PRs and record carry-forward decisions.
- [x] Pause the legacy `/brief` daily refresh automation.

Validation:

```text
Product revision: 5e02ff8caafd160e3802b0caaca6802ad672038a
Workflow run: 31030913507
Static job: 92391543795, passed
Browser rerun job: 92391542885, passed
```

## Next idea checkpoint

- visually review the new explanation sections at desktop, short-height laptop, tablet, and phone sizes
- measure contrast and inspect spacing
- create the common-editing map for scenario data, explainer examples, media, and layout
- decide whether Family should remain an explainer or become a main scenario after user review
- begin authorized preview-audio selection only after the visual review
