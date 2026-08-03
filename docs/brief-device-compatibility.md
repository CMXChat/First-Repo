# `/brief` Device Compatibility Rules

## Supported target

The briefing should work on current versions of:

- iOS Safari and Chrome
- Android Chrome and Samsung Internet
- Desktop Chrome, Safari, Firefox, and Edge
- Portrait and landscape phone layouts
- Touch, mouse, and keyboard input

Ancient browsers without modern JavaScript support are outside the target. The page must still fail clearly instead of trapping the user behind an apparently interactive control.

## Entry-gate requirements

Only one controller may own the briefing selector and Enter button.

The selector must:

- start on a disabled placeholder
- use a native `select` control on phones
- use at least 16px text to avoid iOS zoom
- respond to `input`, `change`, keyboard, and touch completion
- never be reset by a later-loading enhancement script
- preserve a valid choice made before the core app finishes loading

The Enter button must:

- remain disabled until a valid briefing is selected
- show a preparing state if the core app is still loading
- automatically continue when the core becomes ready
- include a fallback unlock if the normal click handler fails
- never require a second tap after the user has already chosen a briefing

Music and narration must both start unchecked.

## Responsive requirements

- No page-level horizontal scrolling at phone widths.
- Charts, tables, process maps, navigation rows, and docks may scroll inside their own containers when necessary.
- Every grid child must be allowed to shrink with `min-width: 0`.
- Images, SVGs, videos, canvases, and iframes must never exceed their container.
- The entry gate and modal heights must follow the visible mobile viewport and respect safe-area insets.
- Interactive controls need at least a 44px target, with 48px preferred on coarse pointers.
- Text must wrap without forcing the page wider.

## Capability fallbacks

- If speech synthesis is unavailable, disable narration controls and keep the written briefing usable.
- If an external media player fails, the rest of the briefing must remain interactive.
- If an optional enhancement script fails, later modules must continue loading.
- If the device is offline, show a plain warning that live sources and media may be unavailable while allowing the fictional demo to open.
- Reduced-motion preferences must disable unnecessary smooth motion.

## Required smoke test after permanent changes

Test the following sequence at a narrow phone width and a desktop width:

1. Load the page with a clean session.
2. Confirm no briefing is preselected.
3. Confirm music and narration are unchecked.
4. Select Personal and confirm the Enter button enables.
5. Enter and confirm the page opens on the selected Personal view.
6. Repeat for Relationship, Business, and Trainer.
7. Switch views from the top menu and final cards and confirm the page returns to the beginning.
8. Toggle private and shared views.
9. Open and close Help.
10. Toggle light and dark mode.
11. Rotate a phone-sized viewport between portrait and landscape.
12. Confirm no page-level horizontal scroll.
13. Confirm tables and process maps remain usable inside their own scroll areas.
14. Confirm Spotify or other external players failing does not block the page.
15. Confirm keyboard focus and Enter/Space activation work on desktop.

## Permanent files

Treat these as permanent product functionality:

- `assets/brief/brief-config.js`
- `assets/brief/brief-device.js`
- `assets/brief/brief-device.css`
- `brief/index.html`

Daily refreshes must not edit them.
