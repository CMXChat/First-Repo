# `/brief` Onboarding and Browser Standard

## Purpose

The briefing contains a large amount of optional capability. First-time users need a fast explanation without being forced through a tutorial or reading a manual.

The permanent onboarding layer consists of:

1. The top-right `?` help control
2. A glass help center
3. An optional six-step guided tour
4. A first-time invitation that can be dismissed
5. A persistent tips preference
6. Cross-browser and device validation

## Question-mark contract

The top-right `?` is the permanent help entry point.

It must:

- Open the glass help center reliably
- Expose correct dialog ARIA attributes
- Remain usable after tips are disabled
- Allow the guided tour to be replayed at any time
- Explain top controls, Quick briefing, Full workspace, privacy and backend limits
- Restore focus after closing
- Close with Escape, its close controls or the outside backdrop

The older help implementation remains a fallback only. The onboarding module owns the capture-stage help request when it loads successfully.

## Guided-tour contract

The tour contains six short steps:

1. Quick briefing
2. Scenario-specific pill views
3. Full workspace
4. Top controls
5. Pause and Play for moving signals
6. Permanent question-mark help

The tour must:

- Stay optional
- Never open before the user enters the briefing
- Support Next, Back, Skip, Close and Done
- Never modify data or settings except the explicit tips preference
- Keep its glass bubble inside the visible viewport
- Internally scroll when text size or viewport height requires it
- Retry briefly when a target is still rendering
- Restore focus to the question-mark button
- Avoid broad DOM observers

## Tips preference

The first-time invitation offers:

- Start
- Not now
- Turn tips off

`Not now` suppresses the invitation for the current session. `Turn tips off` persists across sessions. Disabling tips must never disable the help center or the ability to replay the tour.

## Visual standard

The help center and tour use restrained glass treatment:

- Semi-transparent surfaces
- Blur and saturation where supported
- Solid accessible fallbacks when backdrop blur is unsupported
- Soft spotlight around the active control
- Short, readable copy
- True-black and genuine light-mode support
- No excessive motion or decorative autoplay

## iPhone and mobile requirements

The onboarding layer must account for:

- `viewport-fit=cover`
- Safe-area insets
- Safari’s changing visual viewport
- Address-bar expansion and collapse
- Keyboard appearance
- Portrait and landscape rotation
- Dynamic viewport units with fallbacks
- 44px or larger touch targets
- Internal modal scrolling
- No page-level horizontal overflow

Visual viewport offsets and dimensions are recalculated on resize, visual-viewport scroll, orientation change, focus changes and page restoration.

## Accessibility requirements

- Dialog semantics and labels
- Focus trapping inside active help or tour dialogs
- Focus restoration after close
- Escape support
- `inert` where available with an ARIA fallback
- `prefers-reduced-motion`
- Increased-contrast support
- Forced-colors support
- Keyboard and touch operation
- No important information available only through animation

## Permanent files

Normal daily content updates must not edit:

- `assets/brief/brief-onboarding.js`
- `assets/brief/brief-onboarding.css`
- `assets/brief/brief-onboarding-bounds.css`
- `assets/brief/brief-device.js`
- `assets/brief/brief-device.css`
- `tests/brief-onboarding-smoke.test.js`
- `tests/brief-browser-e2e.spec.cjs`
- `tests/playwright.config.cjs`
- `.github/workflows/brief-browser-matrix.yml`

## Validation

After any permanent onboarding, help, navigation, viewport or device change:

1. Run all source-level briefing smoke tests.
2. Run the browser matrix in Chromium, Firefox and WebKit.
3. Run the iPhone WebKit and Android Chromium device projects.
4. Check portrait and landscape viewport bounds.
5. Verify entry, help, every tour step, tips, focus restoration, Pause to Play, Team switching, Quick briefing and Full workspace.
6. Do not claim cross-browser validation passed if any project fails.

Browser emulation provides broad engine and viewport coverage. It does not replace a physical-device lab for every iPhone model, browser version, accessibility setting or embedded webview.
