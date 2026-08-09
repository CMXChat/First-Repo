# Spaces Route Migration and Coordination Model

Date: 2026-08-09  
Status: implementation review  
Primary route: `/spaces/`

## Decision

`/spaces/` is the canonical product demonstration route. `/brief/` remains only as a compatibility route for older bookmarks, documentation, and external references. It must redirect to `/spaces/` and preserve the query string and hash when JavaScript is available.

`/doc/` remains the detailed product overview. The active experience and the overview are two views of the same product:

- `/spaces/` demonstrates the daily and scenario-specific experience.
- `/doc/` explains what Spaces is, how a Space carries context, how the Brief fits into the product, permissions, memory, goals, architecture, current reality, and planned backend work.
- `/brief-next/` is a pre-migration rollback snapshot and must not be treated as the active product route.

The August 9 product-document refinement keeps the HTML source authoritative and keeps JavaScript focused on page behavior. It restores the stronger visual pacing and familiar product-story structure from the previous `/doc/` while retaining a few clearer explanations near the top. The Brief stays the easiest way to understand the product quickly, while the surrounding sections make clear that a Space also carries people, sources, permissions, memory, goals, history, conversations, and approved actions. The investment, market, IP, and architecture material remains available later in the document after the core product explanation.

## Problems found in the prior state

1. The product name had changed to Spaces, but the primary route, canonical URL, route registry, tests, and release contracts still treated `/brief/` as the production surface.
2. `/brief/` and `/brief-next/` were required to remain byte-for-byte identical, which prevented a safe route migration and confused production with rollback.
3. Operational documentation described alarm, voice, and multi-calendar coordination, but shared calendars were not stated as a first-class product capability.
4. The Spotify status region did not explicitly announce asynchronous state changes, and its labeled generic container did not have an explicit landmark role.
5. App-authored commits did not consistently trigger fresh GitHub Actions runs, so historical green or red states cannot be treated as proof for the current branch.
6. `/doc/` needed a clearer opening without losing the visual examples and practical sections that made the earlier version easy to understand. The refinement therefore changes the first explanation lightly and preserves the broader document instead of replacing it with a new structure.

## Shared calendars

Shared calendars coordinate approved Space-level information. Each participant's private calendar remains separate.

A Relationship, Family, Team, or Project Space may combine approved calendar information such as:

- availability windows;
- shared events and deadlines;
- responsibilities and owners;
- rides, travel, and leave-by times;
- school, care, household, and project commitments;
- conflicts that affect the current Space.

Private event titles, notes, attendees, locations, and unrelated commitments remain hidden unless the owner explicitly shares them. A Space can show a busy block or availability window without exposing the underlying event. Every calendar connection needs a person, source, permission scope, Space scope, freshness state, and revocation path.

## Current Family and Personal demonstrations

The active `/spaces/` demo includes seven contexts: Personal, Relationship, Family, Business partners, Accountant and client, Trainer, and Team.

The Family briefing demonstrates:

- a household Today view with appointments, pickups, chores, shopping, meals, and approval needs;
- an approved shared calendar that can show a private event as an availability-only block;
- a chore board with owners, deadlines, and visible status;
- a shared shopping list with claimed, open, and completed items;
- age-appropriate access examples for adults, teens, and children.

The Personal briefing includes a private habit view with weekly completion, current rhythm, and best recorded streak. A habit stays in the Personal Space until the user approves a specific result, plan, or time for another Space.

All private-looking records in these demonstrations are fictional. The interface shows the intended behavior, while authenticated profiles, calendar enforcement, durable habit history, connector permissions, and multi-user writes remain production platform work.

## Current Business and Accounting demonstrations

The Business Partner briefing demonstrates:

- New York and Sydney local time with one protected decision window;
- separate partner colors plus a shared operations lane;
- teams, project progress, deals, cash rules, and approved concerns;
- a highlighted Tuesday beach day with weather, UV, preparation, and a reviewable meeting-change draft.

The Accountant and Client briefing demonstrates:

- a client with salary income and a separate side business;
- an accountant note, monthly cash sheet, asset allocation, bills, tax preparation, goals, and editable rules;
- a compact budget warning and a short client correction question;
- professional boundaries around filing, tax, legal, investment, payment, and account actions.

Prepared actions change local demo state only. A real external write requires authenticated accounts, clear permissions, a reviewable draft, and human approval.

## Alarm and launch routine

The alarm concept is an opt-in launch routine tied to the current Space and day. It can use approved context to determine when and how the routine starts.

Examples include:

- an earlier wake-up because an early meeting, commute, weather change, or airport departure changed the plan;
- a different routine for weekdays, weekends, travel, recovery, or a shared household;
- opening the relevant Space, music, schedule, weather, priority, and leave-by guidance together;
- escalating only when the user has enabled that behavior.

The system must never silently change an alarm with material consequences. It should explain the reason, show the proposed or active time, and provide a clear override, pause, and disable control.

## Voice

Voice is an optional interface for listening, capture, and bounded commands. It is not unrestricted ambient surveillance.

The planned voice layer should support:

- reading the full Brief or only sections safe to speak aloud;
- push-to-talk and, later, an explicitly enabled wake word;
- a visible and audible listening state;
- adding a note, reminder, check-in, task, or correction to the current Space;
- asking what is next, why a recommendation appeared, or when to leave;
- device, room, person, time, and Space restrictions;
- immediate mute, pause, history review, and deletion.

Sensitive material must default to silent display. A household or shared device cannot read private Personal Space information aloud merely because the account is signed in.

## `/doc/` product-story contract

The product overview should answer the following questions before moving into deep architecture:

1. What is Spaces?
2. What problem does it solve?
3. What is a Space?
4. What is the Brief?
5. How can personal and shared context coexist without exposing everything?
6. What remains durable when the AI model changes?
7. Which parts are demonstrated now and which still require the secure platform?

The opening should remain easy for a normal reader. The Brief is the most familiar entry point, so it can lead the explanation, but the page should make clear within the opening sections that the Space carries the wider context behind that Brief. The previous visual rhythm, product previews, daily ritual, people and coordination examples, market material, and architecture sections are useful parts of the document and should not be removed just to make the narrative more minimal.

The document should use complete connected prose. Avoid slogan stacks, promotional fragments, vague AI language, inflated uniqueness claims, short choppy copy, and technical wording where a normal reader can understand the same point more directly.

## Release expectations

A release that changes the active Spaces experience or `/doc/` should verify:

- `/spaces/` loads the working demo and stays noindex;
- `/brief/` redirects to `/spaces/` and remains noindex;
- `/doc/` still explains the current-versus-planned boundary;
- `/doc/` keeps shared-calendar, alarm, and voice concepts in the product story without allowing them to dominate the opening;
- `/spaces/` links to `/doc/`;
- the route registry marks `/spaces/` Active and `/brief/` Legacy;
- all active JS and CSS assets exist and have cache versions;
- browser, mobile, Spotify lifecycle, and accessibility checks target `/spaces/` as the primary route;
- all seven briefing contexts remain reachable, contained, and clearly fictional where private-looking records appear;
- selected controls keep readable contrast in both themes;
- horizontally scrollable tab rows do not shift the document viewport;
- old `/brief/` bookmarks remain functional;
- product copy remains authoritative in HTML rather than being replaced by JavaScript after load;
- the stronger visual pacing and practical example sections remain intact when copy is refined;
- shared-calendar, alarm, voice, permission, and revocation language remains present.

## Follow-up

Source links in older historical documents may continue to mention `/brief/` when describing earlier work. User-facing navigation and current operational documentation should use `/spaces/`. The legacy route exists to prevent broken links while the repository history is cleaned up deliberately.
