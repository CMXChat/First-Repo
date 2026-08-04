# CMX `/brief` Program Status, Missing Reports, and Roadmap

**Status timestamp:** August 4, 2026, 3:20 PM EDT  
**Repository:** `CMXChat/First-Repo`  
**Primary page:** `https://db.cmxchat.com/brief/`  
**Document type:** Current program ledger and planning source  
**Related concept:** `docs/concepts/brief-goal-intelligence-concept-2026-08-04.md`

## 1. Why this report exists

The `/brief` work now spans product design, daily content, interaction design, connected-data concepts, privacy boundaries, mobile behavior, testing, backend planning, goal intelligence, and cleanup of earlier experiments.

Several existing reports cover individual parts of the work. None currently provides one dated record of:

- What has already been built.
- What has been assessed.
- What is actively changing.
- What remains incomplete.
- Which reports or specifications are still missing.
- What order the work should follow.
- Which decisions are settled and which remain open.

This document fills that gap. It should be updated when a major phase starts, merges, changes direction, or exposes a new dependency.

## 2. Executive state

The `/brief` page proves the main idea: a daily briefing can organize personal, relationship, business, coaching, and team context into a useful daily view.

The concept is strong. The current page also carries too much product explanation, duplicate navigation, experimental presentation, and technical demonstration inside the daily experience. The next stage is refinement and consolidation.

Current program state:

| Area | Status | Current reality |
|---|---|---|
| Daily briefing concept | Proven | The page demonstrates five briefing types with Quick and Full views. |
| Mobile entry | Fix in progress | A delayed navigation restore moves normal entry below the true page top. PR #31 contains a guarded fix and regression coverage. |
| Primary product hierarchy | Cleanup in progress | Quick Briefing is being reduced to the daily experience. Deeper product material remains available in Full Workspace and Help. |
| Voice and copy | Partially assessed | AI-style patterns, abstract wording, duplicate philosophy, ellipses, and contrast formulas have been identified. The full rewrite has not started. |
| Navigation | Functional but overbuilt | Map, sticky routes, tabs, cards, drawer, footer switches, entry choices, and other controls overlap. |
| Daily content pipeline | Demonstrated | Dated content modules and update instructions exist. Date ownership and stale-date prevention still need consolidation. |
| Goal intelligence | Concept documented | Product concept exists. Data model, interface specification, implementation plan, and code remain pending. |
| Real connected data | Planned | Current page mostly uses public, fictional, or demonstration data. Protected connector execution is not implemented. |
| Backend platform | Planned | Authentication, protected storage, APIs, jobs, durable memory, role-based spaces, and connector permissions remain future work. |
| Testing | Broad but uneven | Static, privacy, navigation, theme, smoke, and browser suites exist. Some tests still encode obsolete product behavior. |
| Repository architecture | Needs consolidation | Many layered scripts and late DOM patches make ownership hard to follow. |

## 3. Existing reports and what they cover

The following documents already contribute to the program record:

| Document | Main purpose | Remaining limitation |
|---|---|---|
| `docs/concepts/brief-goal-intelligence-concept-2026-08-04.md` | Defines goals as an adaptive action and review layer. | Concept only. No implementation contract, interface plan, or acceptance criteria. |
| `docs/brief-architecture-audit.md` | Reviews schema, rendering, and static architecture. | Does not cover the current cleanup branch, product hierarchy, or final backend ownership. |
| `docs/brief-existing-app-review.md` | Reviews the existing app and trust model. | Captures an earlier state and does not act as a current work ledger. |
| `docs/brief-new-content-needs.md` | Defines useful content and why data should change decisions. | Does not define final section ownership or copy rules. |
| `docs/brief-product-model.md` | Describes the intelligence-product model, identity, authorization, connectors, memory, and sharing. | Needs an implementation sequence tied to the current repository. |
| `docs/brief-vision-gap-audit.md` | Separates the static proof from the future multi-user product. | Needs an updated gap assessment after the current front-end cleanup. |
| `docs/brief-content-update-process.md` | Documents daily content updates and validation. | Multiple content and patch files still make the source of truth unclear. |
| `docs/brief-secure-data-roadmap.md` | Defines public, fictional, connected, and private data boundaries. | Needs a complete permission matrix, retention policy, and threat model. |
| `docs/brief-daily-maintenance.md` | Covers routine daily updates. | Needs updated ownership after obsolete validators and cache routines changed. |
| `docs/brief-onboarding-browser-validation.md` | Covers browser, device, entry, audio, accessibility, and onboarding checks. | Some expectations now protect experiments that the product no longer needs. |
| `docs/brief-content-refresh-2026-08-03.md` | Records a specific content refresh. | Historical snapshot only. |
| `docs/brief-system-prompt.md` | Contains a large implementation and content instruction set. | Too broad to serve as a clean product specification or current-status record. |

These reports remain useful. This document does not replace their detailed content. It provides the current map across all of them.

## 4. What has been built so far

### 4.1 Core briefing experience

The page currently supports five demonstration briefing types:

- Personal.
- Relationship.
- Business partners.
- Trainer and student.
- Team and project.

Each type can change the visible priorities, cards, tabs, schedules, shared context, labels, and deeper workspace content.

### 4.2 Entry and personalization controls

The entry experience includes:

- Briefing-type selection.
- Optional music on entry.
- Optional spoken opening.
- Stored onboarding and interface preferences.
- Preselection from deliberate deep-link parameters.

### 4.3 Daily briefing layers

Current page layers include:

- Hero summary and next event.
- Quick Briefing workspace.
- Full Workspace.
- Weather and public-data demonstrations.
- Music and Spotify demonstrations.
- Priorities and schedules.
- Personal, relationship, business, trainer, and team views.
- Memory, connection, permission, and shared-space explanations.
- Optional Map navigation.
- Help, onboarding, guided tour, and Vision walkthrough.
- Terminal and backend concept demonstrations.

This breadth proved the product range. It also created duplicate paths and an excessively long main experience.

### 4.4 Trust and classification model

The front end distinguishes among several data classes:

- Public information.
- Fictional demonstration information.
- Connected-data demonstrations.
- Private or protected information that belongs behind authentication.
- Shared information that requires explicit approval and scoped access.

This model is one of the strongest foundations in the project and should remain visible in a compact form.

### 4.5 Testing and validation infrastructure

The repository includes checks for:

- Static validation.
- Secret scanning.
- Privacy auditing.
- Navigation links.
- Terminal theme integrity.
- Device behavior.
- Onboarding and browser compatibility.
- Navigation and URL state.
- Theme and Map behavior.
- Finalization and Vision behavior.
- Entry and relationship media.
- Stability.
- Workspace and Team rendering.
- Browser testing across Chromium, Firefox, WebKit, iPhone, and Android profiles.

The coverage is valuable. Several assertions need to be rewritten around the intended product instead of protecting every earlier experiment.

## 5. Assessment completed on August 4, 2026

A full read-only assessment of the current page and its layered scripts found the following.

### 5.1 The concept lands, then the page becomes a presentation

The first screens communicate the daily briefing idea. Much of the remaining page explains the platform, demonstrates every possible module, teaches architecture, or repeats controls already available elsewhere.

The page currently acts as all of the following at once:

- Daily briefing.
- Scenario gallery.
- Product showroom.
- Technical explainer.
- Onboarding system.
- Vision presentation.
- Backend roadmap.

The daily briefing should lead. Deeper explanation should open only when requested.

### 5.2 Duplicate interaction systems

The page has overlapping ways to switch views or move through content:

- Entry briefing selector.
- Top briefing switcher.
- Scenario Explorer.
- Workspace tabs.
- Quick-card routes.
- Sticky route bar.
- Map drawer.
- Footer switcher.
- Dock controls.
- Navigation drawer.
- Terminal commands.

Help is also split across multiple experiences:

- Help Center.
- Guided onboarding tour.
- Vision walkthrough.
- Inline product explanations.

These need a deliberate ownership model.

### 5.3 Content identified as secondary or unnecessary in the primary flow

The following material does not need to appear in the normal Quick Briefing flow:

- Full Scenario Explorer.
- Strategy Lab.
- Duplicate Personal Command Center presentations.
- Moving signal rail.
- Generic daily reflection quotes.
- Repeated music and player interfaces.
- Generic horoscope and compatibility content as a default feature.
- Celebrity and culture explanations with weak daily relevance.
- Daily Rhythm education section.
- Full memory classroom and simulated knowledge-quality scoring.
- Capability catalog.
- Normal-AI comparison section.
- Python, FastAPI, MCP, API, RAG, backend, and security education inside the briefing.
- Future Platform presentation.
- Scheduled repository-update process card.
- Large connection catalog.
- Generic Shared Space explainer.
- Terminal panel inside the daily briefing.
- Separate Help, Tour, and Vision promotion blocks.

Some of these may remain useful in Full Workspace, Help, documentation, or a separate product page. They should not compete with the daily brief.

### 5.4 Voice and copy problems identified

The assessment found recurring AI-style patterns:

- Ellipses in loading text.
- Contrast formulas such as `X, not Y` and `not X, but Y`.
- Generic philosophy instead of concrete information.
- Repeated use of `what matters`.
- Repeated use of `becomes`, `turns`, and `emerges`.
- Excessive `can`, `could`, `would`, `future`, and `planned` language.
- Product copy that narrates what the platform can do.
- Repeated demo, private, approved, structured, connected, and protected vocabulary.
- Anthropomorphic language such as `it knows` and `how it learns`.
- Fake precision through confidence percentages, workload percentages, knowledge scores, and simulated runway values.
- Generic poetic headings that do not help the user act.

The intended voice is:

- Direct.
- Calm.
- Specific.
- Human.
- Easy to scan.
- Slightly stylish without sounding theatrical.
- Occasionally dry or playful when appropriate.
- Focused on status, owner, timing, risk, and next action.

### 5.5 Technical ownership problem

Visible copy and behavior can be changed by late-loaded scripts after the original page renders. `brief-finalize.js` currently rewrites parts of the page after other files have loaded.

The broader loader chain includes many JavaScript and CSS layers. This makes it difficult to know:

- Which file owns visible copy.
- Which file owns current route state.
- Which file owns entry positioning.
- Which file owns Quick and Full visibility.
- Which patch will restore content that another file removed.
- Which test represents the actual product requirement.

A single ownership map and a reduction plan are still missing.

### 5.6 Date ownership problem

At the time of assessment, several source modules still contained August 3 edition values while the current date was August 4.

The daily update process needs one authoritative edition object and an automated stale-date check that understands intentionally historical content.

## 6. Active work: PR #31

**Pull request:** `#31 Start /brief cleanup and keep entry at the true top`  
**Branch:** `agent/brief-cleanup-top-fix`  
**Status:** Draft  
**Branch condition at this report timestamp:** The branch is 28 commits behind current `main` and must be updated before merge.

### 6.1 Confirmed entry-position bug

Normal entry resets the page to the top. A later navigation restore resolves the default Overview route to `#today` and calls `scrollIntoView()` after the entry transition. That delayed scroll overrides the first reset and places the viewport below the controls above the hero.

### 6.2 Fix currently implemented in PR #31

The draft fix:

- Resets normal entry to the true document top.
- Guards the top position during the delayed navigation window.
- Preserves deliberate deep links to requested sections.
- Preserves Full Workspace restoration from URL state.
- Stops guarding after the entry transition so normal user scrolling works.
- Adds explicit browser regression coverage for the delayed scroll.

### 6.3 Reversible Part 1 cleanup currently implemented

PR #31 also:

- Keeps Quick Briefing as the primary experience.
- Keeps the optional Map.
- Keeps Vision available through Help.
- Keeps Full Workspace as the deeper view.
- Hides duplicate Quick navigation.
- Hides Scenario Explorer from Quick.
- Hides education-heavy sections from Quick.
- Hides the separate Vision promotion card from Quick.
- Hides the terminal panel from Quick.
- Keeps hidden sections intact in Full Workspace.
- Shortens several generic entry and hero lines.
- Removes the pulsing Full Workspace treatment.

No major section or data file has been deleted in this phase.

### 6.4 Validation status for PR #31

Passing checks include:

- Static validation.
- Secret scan.
- Privacy audit.
- Navigation link guard.
- Terminal theme guard.
- Full source and smoke suite.

The latest browser matrix recorded:

- 223 passing tests.
- 2 failing tests.

The two failures require product-aware fixes:

1. A browser test expects the moving signal rail control to be visible from the initial viewport. The moving rail has already been identified as unnecessary in the primary flow. The test should be changed after the product decision is finalized.
2. A WebKit entry-position check returned `scrollY: -40`, which is consistent with top-edge overscroll behavior. The regression should test proximity to the true top and visible controls, while still catching a real jump to `#today`.

### 6.5 Required steps before PR #31 can merge

1. Update or rebase the branch onto current `main`.
2. Resolve conflicts caused by the 28 newer main-branch commits.
3. Decide whether the moving signal rail is removed, hidden, or retained in Full Workspace.
4. Update browser expectations around the decided product behavior.
5. Adjust the WebKit top-position assertion without weakening the regression.
6. Run the complete browser matrix again.
7. Review mobile and desktop screenshots manually.
8. Verify normal entry, deep links, Map, Help, Vision, Quick, and Full Workspace.
9. Merge only after the page is visually coherent and tests represent the intended behavior.
10. Verify the deployed page from a clean mobile session.

## 7. Goal intelligence workstream

The existing goal-intelligence concept defines the right direction: goals should influence plans, daily priorities, review loops, difficulty, recommendations, and structured learning.

### 7.1 Concept already defined

The concept currently includes:

- Goal capture and clarification.
- Goal connections and dependencies.
- Breakdown into milestones and actions.
- Planning and scheduling.
- Progress tracking.
- Review and adaptation.
- Personal, shared, team, and coach contexts.
- Privacy, source, progress, constraint, and task-reference fields.
- Boundaries against fake prediction, forced integrations, automatic personal exposure, and unsupported medical or financial conclusions.

### 7.2 Goal intelligence work still missing

Before implementation, the following artifacts are needed:

1. **Goal intelligence product specification**  
   Defines the exact user flow, screens, states, actions, empty states, and acceptance criteria.

2. **Goal schema and event model**  
   Defines goals, outcomes, milestones, constraints, evidence, check-ins, confidence, completion, abandonment, and revision history.

3. **Difficulty and feasibility model**  
   Defines what the difficulty control changes and prevents false precision.

4. **Recommendation policy**  
   Defines how the system selects the next action, handles uncertainty, asks questions, and avoids manipulative or unsafe guidance.

5. **Daily briefing output contract**  
   Defines which goal information appears in Quick Briefing, Full Workspace, reviews, reminders, and shared spaces.

6. **Privacy and sharing contract**  
   Defines which goal fields are private, shareable, team-visible, coach-visible, or derived.

7. **Review-loop specification**  
   Defines daily, weekly, milestone, stalled-goal, and completed-goal reviews.

8. **Agent and connector contract**  
   Defines which agents may read goal context, propose actions, create tasks, update progress, or request confirmation.

9. **Interface prototype**  
   Tests whether users understand the goal flow before backend implementation.

10. **Implementation sequence**  
    Starts with one thin personal-goal loop before shared, team, or predictive features.

## 8. Reports and specifications still missing

The following missing artifacts are the largest documentation gaps across the current project.

### 8.1 Authoritative product scope and acceptance criteria

**Missing:** One specification stating what `/brief` is, what must appear in Quick, what belongs in Full, and what belongs elsewhere.

**Why it matters:** Tests and scripts currently protect different versions of the product.

**Required output:** A section-level product contract with acceptance criteria for Personal, Relationship, Business, Trainer, and Team briefings.

### 8.2 Section inventory and disposition report

**Missing:** A complete inventory marking every section as Keep, Simplify, Move, Hide, Merge, or Remove.

**Why it matters:** Cleanup is currently spread across runtime visibility rules and informal decisions.

**Required output:** A table with section ID, owner file, current purpose, final location, dependencies, and removal risk.

### 8.3 Copy and voice inventory

**Missing:** A repository-wide list of visible copy, source file, current text, rewrite status, and final owner.

**Why it matters:** Late scripts can rewrite original HTML and reintroduce wording that was already removed elsewhere.

**Required output:** One copy source or generated catalog, with voice rules enforced by review and lightweight tests.

### 8.4 Navigation and state ownership map

**Missing:** A definitive map of entry state, preset state, Quick and Full state, tab state, URL state, hash state, Map state, drawer state, and back behavior.

**Why it matters:** The current top-position bug came from two systems owning entry navigation at different times.

**Required output:** State diagram, event order, source file ownership, and deep-link rules.

### 8.5 Loader and dependency map

**Missing:** A complete ordered map of loaded scripts, styles, injected assets, dependencies, retries, timers, and late patches.

**Why it matters:** The page has many layers that can silently override one another.

**Required output:** Current dependency graph plus a consolidation target.

### 8.6 Date, time, and edition ownership contract

**Missing:** One authoritative rule for edition date, time zones, live timestamps, historical content, and stale-date validation.

**Why it matters:** Multiple modules can display different dates.

**Required output:** One edition object, clear time-zone policy, and automated stale-date checks.

### 8.7 Data-source and provenance contract

**Missing:** A field-level contract for public, fictional, connected, private, shared, inferred, and user-confirmed information.

**Why it matters:** Trust depends on knowing where a value came from and whether it can drive an action.

**Required output:** Standard metadata for source, retrieved time, confidence, sensitivity, owner, sharing scope, expiration, and action permissions.

### 8.8 Privacy and permission matrix

**Missing:** A complete matrix across user, partner, coach, team member, manager, administrator, agent, and connector roles.

**Why it matters:** Shared spaces are central to the concept and require exact boundaries.

**Required output:** Read, write, share, approve, revoke, export, delete, and audit permissions by object type.

### 8.9 Backend architecture implementation plan

**Missing:** A repository-specific design for authentication, APIs, storage, jobs, connectors, indexing, audit logs, and deployments.

**Why it matters:** Current documents explain direction without assigning components, interfaces, or migration phases.

**Required output:** Service boundaries, API contracts, storage model, deployment topology, staging plan, and failure handling.

### 8.10 Agent workflow specification

**Missing:** A clear internal workflow for research, recommendations, task creation, updates, confirmations, and agent handoffs.

**Why it matters:** The future product depends on agents acting on structured context without exceeding permission.

**Required output:** Agent roles, allowed tools, input contracts, output schemas, approval gates, and audit requirements.

### 8.11 Semantic index and memory architecture

**Missing:** A design for master profile, current state, episodic history, user-confirmed facts, temporary context, semantic retrieval, and correction.

**Why it matters:** The page currently explains memory without a durable implementation model.

**Required output:** Memory classes, retrieval policy, expiry, correction, conflict resolution, deletion, and source tracing.

### 8.12 First-run and authorized-viewer flow

**Missing:** A complete experience for a new user, invited partner, coach, team member, or other approved viewer.

**Why it matters:** Current onboarding demonstrates the product but does not define real account creation, consent, permissions, or shared-space setup.

**Required output:** Account, invitation, consent, connection, privacy, recovery, and revocation flows.

### 8.13 Connector and action-confirmation plan

**Missing:** A provider-by-provider plan for calendars, email, tasks, music, finance, fitness, files, communication, and future tools.

**Why it matters:** Read access and write actions have different risk levels.

**Required output:** Supported operations, data minimization, refresh cadence, failure state, confirmation rule, and revocation behavior for each connector.

### 8.14 Security threat model and retention policy

**Missing:** A formal threat model covering account takeover, shared-space leakage, prompt injection, malicious connector content, unsafe agent actions, logging exposure, and public-cache mistakes.

**Why it matters:** The product combines sensitive personal and operational context.

**Required output:** Threats, controls, residual risks, incident response, retention periods, export, deletion, and recovery rules.

### 8.15 Performance and bundle-reduction report

**Missing:** A measured account of page weight, loaded modules, long tasks, layout shifts, repeated render passes, timers, and mobile cost.

**Why it matters:** The current layered architecture performs many delayed updates and renders.

**Required output:** Baseline metrics, target budgets, script-removal plan, and performance regression tests.

### 8.16 Accessibility contract

**Missing:** A final accessibility specification tied to the simplified product.

**Why it matters:** Existing tests cover several behaviors, but the final requirements are distributed across implementation files.

**Required output:** Keyboard order, focus restoration, dialog behavior, motion rules, contrast, screen-reader labels, touch targets, and zoom support.

### 8.17 Analytics and product-success plan

**Missing:** A privacy-safe definition of success for the briefing.

**Why it matters:** The product needs evidence that users understand the summary, complete useful actions, and return without adding surveillance.

**Required output:** Minimal event set, retention limits, opt-out behavior, success metrics, and experiment rules.

### 8.18 Release, rollback, and cache plan

**Missing:** A single release process for front-end changes, data changes, cache versions, branch validation, rollback, and deployment verification.

**Why it matters:** Daily content updates and product changes currently share a page with many cache-versioned files.

**Required output:** Staging, approval, deployment, smoke check, rollback, and post-release monitoring steps.

### 8.19 Deprecation and repository cleanup plan

**Missing:** A safe removal plan for duplicate scripts, obsolete validators, redundant navigation, abandoned reports, old workflows, and superseded pull requests.

**Why it matters:** Deleting files too early can break hidden dependencies. Leaving everything in place preserves confusion.

**Required output:** Dependency evidence, replacement owner, deletion order, test updates, and rollback commit for each removal group.

## 9. Recommended program sequence

### Phase 1: Stabilize and simplify the current front end

1. Bring PR #31 up to date with `main`.
2. Resolve the two browser-matrix failures based on final product behavior.
3. Complete the reversible Quick-flow cleanup.
4. Keep Map optional and Help available.
5. Verify normal entry and deliberate deep links.
6. Merge and validate production.

**Exit condition:** The page opens at the true top, Quick feels like a real daily briefing, Full remains available, and tests describe the intended experience.

### Phase 2: Rewrite visible content and establish ownership

1. Create the section inventory.
2. Create the copy inventory.
3. Assign one owner for visible copy.
4. Rewrite each briefing type in the approved voice.
5. Remove ellipses, contrast formulas, fake quotes, generic philosophy, and false precision.
6. Consolidate Help, onboarding, and Vision entry points.
7. Reduce duplicate profile and navigation controls.
8. Establish date and edition ownership.

**Exit condition:** Every visible line has a clear source, the page sounds human, and no late patch silently restores rejected copy.

### Phase 3: Consolidate front-end architecture

1. Map all loaders and runtime dependencies.
2. Move stable copy into an authoritative model.
3. Reduce late DOM rewrites.
4. Merge duplicate navigation and routing logic.
5. Remove obsolete experiments after approval.
6. Move backend and architecture explanations into documentation or a separate product page.
7. Simplify tests around the final product.
8. Review older briefing pull requests, including PR #27, and close or supersede them after useful coverage is retained.

**Exit condition:** The repository has understandable ownership, fewer runtime layers, and no hidden second implementation of the same feature.

### Phase 4: Specify and prototype goal intelligence

1. Obtain product-architecture signoff on the concept.
2. Define the thin personal-goal loop.
3. Complete the schema, review loop, recommendation policy, and privacy contract.
4. Design the goal workspace and daily outputs.
5. Prototype before backend implementation.
6. Test comprehension, correction, difficulty, and next-action behavior.

**Exit condition:** A user can define one goal, receive a grounded plan, act, report progress, and see the plan adapt without false certainty.

### Phase 5: Build the protected platform foundation

1. Implement authentication and account recovery.
2. Implement protected storage and object ownership.
3. Implement APIs for profile, current state, goals, tasks, briefings, and shared spaces.
4. Implement audit logs and approval records.
5. Implement background jobs and scheduled brief generation.
6. Implement semantic indexing and structured memory.
7. Implement connector reads with explicit scopes.
8. Implement write actions with confirmation rules.
9. Implement role-based shared spaces.
10. Add staging, backups, monitoring, rate limits, and incident procedures.

**Exit condition:** The product can generate a private briefing from real authorized data without exposing sensitive information in public JavaScript.

### Phase 6: Expand carefully

Potential later additions:

- Shared goal planning.
- Coach and trainer workflows.
- Team operating briefs.
- Cross-agent ingestion.
- Evidence-based recommendation comparisons.
- Deeper public-data graphs when they change a decision.
- Additional connectors with clear value and permission boundaries.

Expansion should follow proven daily usefulness, not feature count.

## 10. Decisions currently settled

- Quick Briefing should lead the experience.
- Full Workspace can hold deeper material.
- Map remains optional.
- Vision remains available through Help.
- Normal entry should start at the true page top.
- Deliberate deep links should still restore the requested section.
- The page should sound direct, calm, human, and useful.
- Ellipses and formulaic contrast writing should be removed.
- Architecture education should not dominate the daily briefing.
- Public, fictional, connected, private, and shared information must remain distinguishable.
- Sensitive data belongs behind server-side authentication and protected storage.
- Goal intelligence should begin with a thin useful loop.
- Cleanup should be reversible until the final page shape is approved.

## 11. Decisions still open

- Final Quick Briefing section order for each of the five briefing types.
- Whether music is a primary daily module or an optional preference panel.
- Whether astrology remains as optional entertainment, moves out of default views, or is removed.
- Whether the moving signal rail survives in Full Workspace.
- Which single Help or tour experience becomes canonical.
- Which scenario-switching control remains after entry.
- Whether Terminal remains anywhere in `/brief` or moves to a separate operator page.
- Which deeper educational sections remain in Full Workspace after the reversible phase.
- Whether all five briefing types launch together in the real product.
- Which connector provides the first real protected data.
- Which backend service owns brief assembly.
- How daily content and personal data are merged into one generated briefing.
- Which analytics are necessary and acceptable.
- How much historical memory the user can inspect, correct, expire, export, or delete.

## 12. Immediate next actions

1. Add this program ledger beside the goal-intelligence concept.
2. Update PR #31 onto current `main`.
3. Resolve its two browser failures.
4. Complete a visual review of the streamlined Quick experience.
5. Merge and production-check Part 1.
6. Create the section inventory and disposition report.
7. Create the copy and voice inventory.
8. Create the navigation and state ownership map.
9. Start Part 2 copy consolidation.
10. Turn the goal-intelligence concept into a signed-off product specification before implementation.

## 13. Update rules for this document

Update this report when:

- A cleanup phase merges.
- The product scope changes.
- A major report or specification is created.
- A backend component begins implementation.
- A new connector is approved.
- A privacy or permission decision changes.
- A test exposes a product-level conflict.
- A section moves, merges, or is permanently removed.
- Goal intelligence moves from concept to design or implementation.

Each update should include:

- Timestamp.
- Commit or pull request.
- Decision made.
- Work completed.
- New risk or dependency.
- Next action.

## 14. Current program conclusion

The `/brief` project has enough front-end breadth to demonstrate the larger vision. The current priority is to turn that breadth into a clear daily product.

The work should proceed in this order:

1. Stabilize entry and simplify Quick.
2. Rewrite and centralize visible content.
3. Consolidate the front-end architecture.
4. Specify goal intelligence fully.
5. Build protected backend foundations.
6. Add real connectors and controlled actions.
7. Expand shared and agent-driven workflows after the core daily loop proves useful.

That sequence protects the strongest part of the concept while reducing the risk of building a large backend around an unsettled front-end experience.
