# Spaces Visual Design and Interaction System

Status: Current direction for `/spaces/` and its product bridges  
Last reconciled: **August 8, 2026**

## Authority and purpose

This document is the current visual and interaction standard for the Spaces demo. Read it with `spaces-demo-continuity.md` before changing the entry, Today, Explore, Everything, Spaces, How it works, or the bridge to `/doc/`.

Where this document conflicts with the older `briefing-design-standard.md`, this document controls the current `/spaces/` experience. The older file remains as design history for the pre-Spaces briefing.

The goal is an elegant product demonstration that feels useful, realistic, intentional, and complete. It should make the depth of the product visible without turning the interface into a crowded dashboard or a collection of decorative cards.

## Product feeling

Spaces should feel:

- calm enough to trust;
- rich enough to reward exploration;
- precise enough to resemble a working application;
- warm enough to feel personal;
- structured enough for an investor to understand the system;
- honest about fictional, planned, connected, and approval-gated behavior.

The interface should not feel sparse, generic, generated, or unfinished. Richness comes from information hierarchy, realistic states, visual evidence, and strong movement between related sections. It does not come from filling every open area.

## Non-negotiable visual principles

### One visual idea per section

Each major section needs one dominant visual idea that matches the decision being made there. Supporting text, small metrics, and actions should reinforce that idea.

Examples:

- time and order use timelines, schedules, and sequence markers;
- performance and change use charts with context and comparison;
- allocation uses a proportional chart with a labeled legend;
- projects use health, trajectory, ownership, blockers, and workstream evidence;
- habits use weekly rhythm, completion patterns, and the next review point;
- handoffs use sender, receiver, status, and missing evidence;
- privacy uses permission layers, scope, confirmation state, and a visible log;
- shared Spaces use a clear boundary between private context, the permission gate, and approved shared records.

Do not default to three identical cards when the information has a stronger natural form.

### Realistic product states

Visuals should show plausible examples from the active briefing. A chart needs a period, comparison, label, or decision consequence. A project view needs owners and next evidence. A calendar needs local time, event scope, and change state. A finance view needs a clear fictional-data boundary.

Decorative charts with unexplained values are not evidence. If a visual is illustrative, label it. If a number cannot be derived from the scenario, present it as interface demonstration rather than a live or calculated fact.

### Depth without clutter

Use a small number of composed surfaces with internal structure. Prefer one command view containing a chart, signals, and a detailed record over a grid of unrelated boxes.

Within a surface, create depth with:

- nested layers;
- restrained gradients;
- a clear foreground and background;
- thin borders;
- soft shadows;
- circular indicators, rings, or orbits when they explain state;
- lines that connect steps, sources, or ownership;
- whitespace around the primary decision.

Avoid repeated floating cards with equal visual weight.

### Prominent actions and destinations

If a user can open another category, supporting view, or product explanation, the destination must look intentionally clickable. A useful destination should never read like a footnote.

Primary discovery actions may use richer gradients, orbital details, numbered marks, previews, or stronger depth. Secondary text links remain quieter but still need a visible focus and hover treatment.

### Honest motion

Motion should explain change, location, progress, or selection. It may move a carousel, fill a progress rail, center an active category, or confirm a local demo action. Do not add perpetual animation only to make a static view appear live.

Respect `prefers-reduced-motion` for smooth scrolling, automatic movement, and animated transitions.

## Color direction

### Foundation

Light mode is the default for the current public demo. Dark mode is a complete alternate appearance, not a separate design identity.

Current light foundation:

- background: cool pale blue-gray;
- primary surface: white;
- supporting surface: near-white blue-gray;
- primary text: deep navy;
- muted text: readable slate;
- borders: cool, low-contrast blue-gray.

Current dark foundation:

- background: near-black neutral;
- primary surface: deep charcoal;
- supporting surface: slightly lifted charcoal;
- primary text: soft white;
- muted text: cool gray;
- borders: neutral charcoal with enough separation to remain legible.

Dark mode must remain neutral. Avoid green, teal, or washed-blue page foundations.

### Accent family

The Spaces palette uses electric blue as the primary product accent, with violet, cyan, rose, coral, green, and amber as controlled supporting colors.

Use accents by meaning:

| Accent | Preferred use |
|---|---|
| Electric blue | Product identity, active navigation, current path, primary information |
| Violet | Shared intelligence, adaptation, cross-context synthesis, selected depth |
| Cyan | Fresh data, time, weather, active input, connected flow |
| Rose or coral | Attention, human concerns, exceptions, unresolved risk |
| Green | Confirmed, accepted, healthy, complete, inside plan |
| Amber | Watch state, due soon, review needed, conditional readiness |

Brighter color is welcome inside meaningful visuals. Keep the surrounding page calm so those colors retain value.

### Gradient rules

Gradients should create light, depth, direction, or category identity. Use two or three related stops. A strong gradient belongs on an active destination, core visualization, device concept, or focused status, not on every surface.

Avoid:

- rainbow gradients with no semantic reason;
- identical blue-purple gradients on every module;
- pale gradients that reduce text contrast;
- glowing every border;
- using red for ordinary emphasis.

### Contrast

All essential copy, controls, labels, chart keys, and active states must remain readable in both themes. Muted text still needs WCAG AA contrast at its rendered size. Color cannot be the only indicator of state.

### Appearance control

`/spaces/` and `/doc/` use the same explicit segmented `Dark` and `Light` control. The selected half has a moving thumb, the button keeps a visible text label in both states, and `aria-pressed` plus the accessible name explain the next action. Do not reduce the control to an ambiguous sun, moon, or half-circle icon.

## Shape, scale, and composition

- Major composed modules use approximately 22 to 36 pixel corner radii.
- Internal records use approximately 11 to 18 pixel corner radii.
- Pills are reserved for status, compact navigation, filters, and concise controls.
- Large headings use tight line height and restrained negative letter spacing.
- Small uppercase labels identify function, source, or state. They should not replace the actual heading.
- Dense data should use alignment and repeated columns. Explanations should use comfortable line length.
- Important visuals need room. Do not compress a chart into a decorative thumbnail when it carries the section's main meaning.

## Navigation and interlinking

### No dead ends

Every major route and long section should lead naturally to its related material.

- Entry can open the selected Brief and can reach `/doc/`.
- Today can open the exact supporting Explore category.
- Explore exposes every category of the selected Space on the page and keeps the category controls available to bring one to the top.
- Each Explore category can still offer connected next contexts after its main content.
- Everything exposes every category in one long review and links back to focused views.
- Everything ends with a clear bridge to `/doc/`.
- `/doc/` provides visible paths back into the demo.

Internal `/spaces/` and `/doc/` links normally stay in the same tab. This keeps the two-part product story navigable without creating duplicate tabs.

### Explore

Explore is the complete category view for the selected Space. The currently selected category remains in the established focused panel at the top, while every other category is rendered in full underneath it. A person who scrolls can therefore see the complete Space without first opening preview cards or repeating a category-selection step.

The category controls remain the primary navigation for Explore. They preserve real tab semantics, keyboard support, active state, and exact-section deep links. Choosing a category brings that category into the focused top panel and rerenders the rest below, so every category appears exactly once.

Do not add a second full category index immediately inside each category. The former `Explore the full picture` card rail duplicated the category controls and is intentionally removed from the active visual experience. Discovery richness should come from the real category content, specialized visual modules, and useful connected-next actions.

Mobile keeps the category rail horizontally usable without creating page-level overflow. The full rendered categories below it must remain readable at 320 pixels and wider. Data-heavy tables may scroll inside their own named region; the document itself must not slide horizontally.

### Everything

Everything is the complete briefing, not a reduced summary. It must reuse the strongest specialized visuals from Explore.

The sticky category navigator remains visible while the user scrolls. It:

- names all major sections;
- highlights the current section;
- automatically keeps the active label in view;
- lets each label scroll directly to its section;
- includes a thin multicolor completion rail driven by page position;
- reports its value through accessible progress semantics;
- never pretends that data is still loading.

Direct jumps in Everything account for both the topbar and the sticky category navigator. The destination heading remains immediately below those controls and fully visible.

At the end, focused-view actions support continued product use and the final `/doc/` bridge continues into the product explanation.

## Briefing section standard

Each briefing section should answer as many of these questions as the subject supports:

1. What changed?
2. What matters now?
3. What is the relevant time, owner, or scope?
4. What evidence supports the view?
5. What is the next useful action?
6. What remains private, fictional, planned, or approval gated?

A strong section combines:

- a clear headline;
- one primary visual or operational structure;
- realistic labels and states;
- a compact interpretation;
- a useful destination or action when another view contains deeper evidence.

### Visualization selection

| Information shape | Preferred visual |
|---|---|
| Change over time | Line, area, trend, or burndown chart |
| Proportion | Donut, stacked bar, allocation meter |
| Sequence | Timeline, guided steps, route, flow |
| Ownership and state | Board, lane, handoff, workstream table |
| Daily rhythm | Week grid, streak, completion heatmap |
| Readiness or health | Ring plus supporting factors |
| Private and shared context | Boundary map, orbit, permission gate |
| Alternatives | Comparison, ranked options, decision matrix |
| Sources and permissions | Connection map, scope ledger, activity log |

Do not use a chart where a short labeled value is clearer.

### Priority delivery preview

Each Brief may expose one scenario-aware `Alert routing` control beside its priority notice. This is the single entry point for delivery settings in the current demo. Do not repeat WhatsApp, text, push, or email buttons across ordinary cards.

The preview should show:

- the active Space and its priority rule;
- realistic destinations appropriate to that Space;
- immediate and fallback timing;
- the narrow information scope allowed through each route;
- quiet hours;
- a message preview that returns the user to Spaces for source and action review;
- clear switch state, keyboard focus, and restored trigger focus;
- an explicit statement that no message was sent.

WhatsApp and text are delivery routes, not substitutes for the Brief. Sensitive financial, health, relationship, or professional detail stays inside Spaces unless the configured scope and recipient permission explicitly allow it. A production connection requires authenticated accounts, recipient consent, revocation, delivery logs, and failure handling.

## Scenario realism

Every scenario should have a recognizable operating language while sharing the same product system.

- Personal uses daily timing, private habits, money checks, and practical next steps.
- Relationship uses two private profiles, an approved shared layer, mutual approval, and repair without false psychological certainty.
- Family uses household timing, availability-only blocks, owners, chores, shopping, meals, and age-aware access.
- Business partners use local times, joint decision windows, projects, pipeline, cash rules, and partner-specific concerns.
- Accountant and client use separate roles, source records, plan versus actual, deadlines, preparation, review, and professional boundaries.
- Trainer and student use readiness, completed evidence, adaptation, pain boundaries, and coach review.
- Team and project use ownership, blockers, release trajectory, handoffs, procedures, and restricted lead context.

Do not flatten different scenarios into the same chart with different labels. Shared renderers are useful only when the underlying decision has the same structure.

## Entry behavior

The entry should explain the depth of each Brief before the user commits.

- Choices use rich neutral surfaces with a strong selected state only after an explicit choice in the current entry session.
- URL or browser-history context may prepare the underlying scenario, but it must not make a card look freshly selected before the person chooses it.
- The rotating product-idea pill can use brighter paired accents.
- The selected Brief preview uses a light scenario-specific pastel field. Its three metrics sit on brighter lifted surfaces. Team and Project's lilac and pink balance is the reference for brightness, while Personal, Relationship, Family, Business, Accounting, and Training keep their own blue, rose, mint, peach, aqua, and blush identities.
- The selected Brief preview remains available where the viewport has enough room to add understanding. Phones hide this large preview because the selected card, confirmation label, and open action already communicate the choice.
- Desktop keeps the choice and action hierarchy compact enough for common viewports.
- Mobile keeps the natural bottom action visible before any choice as a disabled `Choose a Briefing` control.
- After a choice, the same natural action becomes `Open [type] Briefing`.
- The contextual sticky action may appear after selection, but it yields while the natural action is visible so duplicate actions do not compete.
- The entry carousel does not show previous and next arrow buttons. Touch swiping and automatic rotation remain available.

## Mobile and responsive behavior

Mobile is a first-class composition, not a scaled desktop.

- No page-level horizontal overflow at 320 pixels or wider.
- Horizontal tables, category rails, and similar modules scroll within their own region.
- Sticky controls account for the mobile navigation and safe area.
- Tap targets remain comfortable and labels remain explicit.
- Complex three-column visuals collapse into a readable sequence with the meaning intact.
- Project dashboards become one-column command views and card-shaped workstreams. A hidden desktop column heading must not leave a 760-pixel intrinsic track on phones.
- Portfolio command views use `minmax(0, 1fr)` tracks so charts and allocation panels remain inside narrow Everything sections.
- Charts retain labels, keys, and decision context.
- Device concepts, rings, and maps scale without clipping.
- Long pages keep location and continuation obvious.
- Focus order follows visual order.

## Copy and tone

Use plain, connected sentences. Labels and statuses may be compact. Explanations should sound like a thoughtful product, not promotional filler.

Avoid:

- em dashes used for drama;
- ellipses used as atmosphere;
- stacked sentence fragments presented as insight;
- repeated slogans;
- vague claims such as seamless, revolutionary, intelligent, or game-changing;
- copy that defines the product only by what it is not;
- claims that fictional records are live, connected, calculated, or personalized by a backend;
- excessive exclamation points;
- charts or metrics that imply certainty the demo does not have.

Prefer specific owners, dates, sources, states, boundaries, and consequences.

## Interaction and accessibility

- Use native links for route changes and native buttons for interface actions.
- Expose selected state with `aria-current`, `aria-pressed`, or the appropriate native state.
- Progress visuals need accessible names and values.
- Charts need concise text alternatives that describe their useful meaning.
- Decorative SVG and orbital detail remain hidden from assistive technology.
- Focus styles must be visible in light and dark mode.
- Dialogs need a labeled title, predictable close action, focus management, and restored focus.
- Disabled actions need a clear label that explains what the user must do next.
- Hover cannot reveal essential information unavailable to keyboard and touch users.

## Demo truth and boundaries

Public and private-looking records must be labeled accurately.

Use these terms consistently:

- `LIVE` only for a verified current public source;
- `CONNECTED` only when a real authorized connection exists;
- `FICTIONAL` or `DEMO` for illustrative records;
- `PLANNED` for unbuilt or unconnected behavior;
- `REQUIRES APPROVAL` for prepared actions that still need confirmation;
- `PRIVATE` and `SHARED` only when the visible scope is explained.

The visual quality of a demo must never make an unbuilt backend sound complete.

## Implementation ownership

| File | Visual responsibility |
|---|---|
| `assets/brief/brief-demo.css` | Foundation tokens, global layout, shared surfaces, base responsive behavior |
| `assets/brief/brief-demo-conversation.css` | Entry, discovery modules, contextual conversation, navigation richness |
| `assets/brief/brief-demo-advanced.css` | Specialized scenario visuals and data-heavy modules |
| `assets/brief/brief-demo-experience.css` | Everything, long-form progress, complete-view visuals, habits, family coordination |
| `assets/brief/brief-demo-explore.css` | Complete Explore composition, duplicate category-index removal, and neutral pre-choice entry treatment |
| `assets/brief/brief-demo-topbar-polish.css` | Topbar controls and compact final polish |
| `assets/brief/brief-demo-data.js` | Fictional records and scenario-specific meaning |
| `assets/brief/brief-demo-advanced.js` | Specialized renderers that reflect a real information shape |
| `assets/brief/brief-demo-experience.js` | Everything composition, long-form progress, and complete-view bridges |
| `assets/brief/brief-demo-explore.js` | Full selected-Space category rendering while preserving the focused category and tab behavior |

Keep a renderer near the data shape it understands. Do not solve a scenario-specific need with global CSS if that would distort unrelated sections.

## Review checklist

Before a visual change ships, confirm:

1. The section has one clear visual idea.
2. The visual matches the underlying information.
3. The next action or destination is obvious.
4. The section does not end without a useful continuation when related material exists.
5. Fictional and planned states remain explicit.
6. Light and dark modes both preserve hierarchy and contrast.
7. Desktop, tablet, and phone layouts preserve meaning.
8. No page-level horizontal overflow appears.
9. Keyboard, touch, reduced motion, and accessible state remain correct.
10. The page does not become a collection of equal boxes.
11. Colors explain state or category instead of acting as decoration alone.
12. Explore renders every category once without restoring the duplicate full-picture card rail.
13. Cache versions, static expectations, browser coverage, and production verification are updated.

## Multi-perspective product audit

Before a major demo round is called complete, review `/spaces/` and `/doc/` from these perspectives:

- first-time user: the next useful action and product idea are understandable without prior explanation;
- returning user: navigation is fast and repeated explanation does not block the Brief;
- mobile user: 320, 360, 390, and 430 pixel widths contain every chart, dialog, control, and long label;
- investor or buyer: the demo proves a differentiated workflow while current and planned capabilities remain precise;
- product designer: every section has one dominant information shape and the page avoids equal-weight box repetition;
- accessibility reviewer: keyboard order, focus restoration, contrast, semantics, reduced motion, and touch targets work;
- technical buyer: sources, permission scope, demo boundaries, connector requirements, and failure states are visible;
- privacy reviewer: external delivery cannot expose broader Space context than the named route permits.

Remove or consolidate an element when it repeats a nearby explanation, competes with the primary action, adds visual weight without evidence, or becomes unusable at a supported width. Repeat the audit after fixes and record the completed result in `/updates/`.

## Change rule

New visual work should extend this system. If a product need requires a different pattern, document the reason, keep the behavior honest, and update this file after the change is verified. Do not silently replace the visual direction through one-off overrides.