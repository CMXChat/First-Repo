# `/brief` Interconnected Navigation and Theme Standard

## Product principle

Vertical scrolling remains the stable reading backbone. Important information must never depend on scrolling alone.

A visitor should be able to reach the same important view through several logical paths:

- Quick briefing pills
- Clickable signal cards
- Related-view links
- Sticky Full-workspace map
- Permanent top-right Map control
- Briefing map drawer
- Previous and next section controls
- Terminal commands where appropriate
- Direct URLs

The page should feel like an application with connected information, not a long presentation.

## Permanent Map control

Every briefing type must show the circular Map control in the top action bar:

- Personal
- Relationship
- Business
- Trainer
- Team

The control sits immediately after the private/shared-space control so it remains visible on narrow phones. Its accessible label changes with the current briefing, such as `Open Business briefing map`.

The Map control is separate from the `?` help and guided-tour control.

On narrow devices:

- The brand text may collapse visually while remaining accessible.
- The action bar may scroll horizontally.
- The Map control remains one of the first visible controls.
- All controls remain fixed circles with appropriate touch targets.

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

## Theme integrity contract

Light and dark mode are complete product states, not decorative filters.

The centralized integrity layer must keep these readable in both modes:

- Quick cards and daily quote
- Business KPI cards, chart labels, rings and decisions
- Team flow, board columns, handoffs and finance bars
- Profile, horoscope, culture, accountability and process cards
- Relationship media and video states
- Terminal output and input
- Sticky map, drawer and top Map controls
- Help center and guided tour

Theme switching also updates:

- `color-scheme`
- Browser `theme-color`
- The theme button label and pressed state
- iPhone and mobile browser chrome colors

Light mode must not leave white text on white cards, dark-only chart labels, black nested Team cards or low-contrast Map buttons. Dark mode must not inherit white surfaces or dark text from light mode.

Theme integrity styles load after component and navigation styles. Small control-level safeguards may load with the Map module to guarantee final contrast.

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
- Mobile targets remain at least 44px where layout allows.
- Horizontal route rails remain manually swipeable.
- No important information is available only through hover.
- Increased contrast and forced colors remain supported.

## Permanent files

Normal daily content updates must not edit:

- `assets/brief/brief-navigation.js`
- `assets/brief/brief-navigation-runtime.js`
- `assets/brief/brief-navigation.css`
- `assets/brief/brief-map-top.js`
- `assets/brief/brief-map-top.css`
- `assets/brief/brief-theme-integrity.js`
- `assets/brief/brief-theme-integrity.css`
- `tests/brief-navigation-smoke.test.js`
- `tests/brief-theme-map-smoke.test.js`
- Navigation and theme coverage in `tests/brief-browser-e2e.spec.cjs`

## Validation

After any permanent navigation or theme change:

1. Validate JavaScript syntax.
2. Run all source-level briefing tests.
3. Run the browser matrix in Chromium, Firefox and WebKit.
4. Run iPhone WebKit and Android Chromium projects.
5. Test Quick-card routing.
6. Test sticky Full-workspace routes.
7. Test the top Map control in all five briefings.
8. Test the briefing map drawer and focus behavior.
9. Test a Team switch and Handoffs route.
10. Test Back, Forward, refresh and a direct gated URL.
11. Test light and dark representative Quick cards, Business charts, Team cards, terminal and drawer.
12. Check browser theme-color, portrait, landscape, safe-area and horizontal-overflow behavior.

Browser emulation does not replace every physical device, browser version, text-size setting or embedded webview. Do not claim universal perfection without a physical-device lab.
