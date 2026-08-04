# `/brief` Final Product Experience Standard

## Product hierarchy

The briefing has three clear layers:

1. **Quick briefing** for the few things worth attention now.
2. **Full workspace** for every detailed module, chart, profile and explanation.
3. **Map** for optional navigation when a person wants to jump somewhere specific.

Opening Full workspace must never open the Map drawer automatically. Full workspace opens directly and preserves normal reading. The Map remains available from its permanent controls.

## Help and walkthroughs

The top-right `?` opens one help center with two different experiences:

### Product tour

A short guided tour explains how to operate the interface:

- Quick briefing
- Pill views
- Full workspace
- Top controls
- Pause and Play
- Help

### Vision walkthrough

A separate six-scene story explains what the product could become:

1. The day is already organized in the morning.
2. Spotify favorites, an approved voice or silence shape the experience.
3. Context connects reminders to strategy.
4. Private, shared, role and leadership spaces protect boundaries.
5. Learning, workouts and accountability improve through correction.
6. A protected backend can prepare approved actions with permissions and audit history.

The Vision walkthrough is manual. It never auto-advances, never changes user data and can be closed at any time.

## Copy standard

High-visibility language should sound direct, useful and human.

Prefer:

- “Take me there”
- “Jump to what you need”
- “See the shape of the day at a glance”
- “The few things worth your attention right now”

Avoid:

- Repetitive product jargon
- Generic AI claims
- Dramatic promises without evidence
- Long explanations before the visitor understands the immediate value
- Calling fictional or disconnected data live

## Failure isolation

Navigation, theme integrity, final product cleanup and the Vision walkthrough remain separate modules. A failure in one optional layer must not prevent the core briefing from opening.

Dynamic loaders must continue after an optional script error. Permanent features use bounded retries and explicit events. Do not add broad DOM observers.

## Browser and accessibility requirements

- Chromium, Firefox and WebKit coverage
- iPhone WebKit and Android Chromium emulation
- Safe-area insets and changing visual viewports
- Portrait and landscape support
- Internal dialog scrolling
- Focus trapping and restoration
- Escape and backdrop dismissal
- Reduced motion
- Increased contrast and forced colors
- No automatic slide progression
- No autoplay assumptions

## Permanent files

Normal daily updates must not edit:

- `assets/brief/brief-finalize.js`
- `assets/brief/brief-finalize.css`
- `assets/brief/brief-vision-tour.js`
- `assets/brief/brief-vision-tour.css`
- `tests/brief-finalization-smoke.test.js`
- `tests/brief-finalization-e2e.spec.cjs`

## Validation

After changing final product behavior:

1. Confirm Full workspace opens without the Map drawer.
2. Confirm Map remains available on demand.
3. Confirm Help opens and closes correctly.
4. Complete all six Product-tour steps.
5. Complete all six Vision-walkthrough scenes.
6. Test focus, Escape, backdrop close and narrow landscape bounds.
7. Test dark and light themes.
8. Run all source tests and the browser matrix.
9. Do not claim universal physical-device perfection from browser emulation alone.
