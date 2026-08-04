# `/brief` Interconnected Navigation Standard

## Product principle

Vertical scrolling remains the stable reading backbone. Important information must never depend on scrolling alone.

A visitor should be able to reach the same important view through several logical paths:

- Quick briefing pills
- Clickable signal cards
- Related-view links
- Sticky Full-workspace map
- Briefing map drawer
- Previous and next section controls
- Terminal commands where appropriate
- Direct URLs

The page should feel like an application with connected information, not a long presentation.

## Quick briefing

Quick briefing remains the default after entry and after a briefing-type change.

Every meaningful signal card should open its relevant Quick tab. Examples:

- Weather opens Day or Plans
- Revenue opens Finance
- A blocker opens Project
- Handoffs open Handoffs
- A workout signal opens Today or Habits
- Today’s Watch opens Watch

Quick navigation must remain inside the Quick workspace. It must not scroll toward a hidden Full-workspace target.

Every Quick panel should include a small Related route group and a clear path into the Full workspace map.

## Full workspace

Full workspace keeps normal vertical reading and adds:

- A sticky, horizontally scrollable section map
- A visible `You are here` indicator
- Active-section highlighting
- Related routes at the end of major sections
- Previous and next section controls
- A one-tap return to Quick briefing

The sticky map must remain compact and must not cover meaningful content.

## Briefing map drawer

The Map control is separate from the `?` help control.

The drawer includes:

- Current briefing and section
- Quick and Full depth controls
- Scenario-specific sections
- Recently viewed sections
- All five briefing types
- A short explanation that exact states can be bookmarked

The drawer must support:

- Touch, mouse and keyboard operation
- Escape and backdrop dismissal
- Focus trapping and focus restoration
- Internal scrolling
- Safe-area insets
- Dark and light modes
- Reduced motion and forced colors

## Scenario maps

### Personal

Overview, Day, Work, Finance, Wellness, Actions, Schedule, Intelligence and Memory.

### Relationship

Overview, Together, Profiles, Plans, Watch, Reflection and Shared space.

### Business

Overview, Executive pulse, Finance, Projects, Decisions, Markets, Partners and Actions.

### Trainer

Overview, Today, Habits, Progress, Recovery, Coach and Schedule.

### Team

Overview, Operating board, My work, Project, Handoffs, Procedure, Finance and Spaces.

## URL contract

Navigation state uses readable URL parameters:

- `view=personal|relationship|business|trainer|team`
- `tab=<scenario tab>`
- `depth=quick|full`
- A hash for the relevant section or workspace

Examples:

- `/brief/?view=business&tab=finance&depth=full#scenarioExperienceAddon`
- `/brief/?view=team&tab=handoffs&depth=full#scenarioStage`
- `/brief/?view=personal&tab=day&depth=quick#briefWorkspace`

A direct URL must never bypass the deliberate entry gate. It may preselect the requested briefing, then restore the exact route only after the user presses `Open this briefing`.

Browser Back, Forward, refresh and bookmark restoration must remain functional.

## Motion and active-section rules

Use `IntersectionObserver` to highlight the current Full-workspace section when supported. Use a bounded scroll fallback otherwise.

Do not use broad mutation observers.

Active-section highlighting must not continuously add browser-history entries. Passive scrolling updates the visual location only. User-initiated navigation may update the URL.

## Accessibility

- Use native buttons for routes.
- Clickable cards receive button semantics, keyboard focus and useful accessible names.
- `aria-current="location"` marks the active route.
- Route changes move focus only when initiated by the user.
- Reduced-motion users receive immediate scrolling.
- Mobile targets remain at least 44px.
- Horizontal route rails remain manually swipeable.
- No important information is available only through hover.

## Permanent files

Normal daily content updates must not edit:

- `assets/brief/brief-navigation.js`
- `assets/brief/brief-navigation-runtime.js`
- `assets/brief/brief-navigation.css`
- `tests/brief-navigation-smoke.test.js`
- Navigation coverage in `tests/brief-browser-e2e.spec.cjs`

## Validation

After any permanent navigation change:

1. Validate JavaScript syntax.
2. Run all source-level briefing tests.
3. Run the browser matrix in Chromium, Firefox and WebKit.
4. Run iPhone WebKit and Android Chromium projects.
5. Test Quick-card routing.
6. Test sticky Full-workspace routes.
7. Test the briefing map drawer and focus behavior.
8. Test a Team switch and Handoffs route.
9. Test Back, Forward, refresh and a direct gated URL.
10. Check portrait, landscape, safe-area and horizontal-overflow behavior.

Browser emulation does not replace every physical device, browser version, text-size setting or embedded webview. Do not claim universal perfection without a physical-device lab.
