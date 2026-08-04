# Brief interface final validation

Validated commit: `77ff1d2d287c6185744b38002e5097d9ee529f98`

## Coverage

- Nine source-level regression suites
- Chromium desktop
- Firefox desktop
- WebKit desktop
- WebKit iPhone 13 emulation
- Chromium Pixel 5 emulation
- All five permanent top briefing-map labels and drawers
- Quick cards, sticky map, contextual links and deep URLs
- Light and dark Quick and Full states across all five briefings
- Business charts, Team boards, terminals, media and drawer contrast
- Guided tour, safe-area bounds, landscape, Pause to Play and media behavior
- Cache-busted bridge v7 and interface assets v2

## Result

Static failures: 0
Browser status: 1
Install outcome: success

## Static log

```text
=== tests/brief-device-smoke.test.js ===
Brief device smoke test passed.
status=0
=== tests/brief-onboarding-smoke.test.js ===
Brief onboarding and browser compatibility smoke test passed.
status=0
=== tests/brief-navigation-smoke.test.js ===
Brief interconnected navigation smoke test passed.
status=0
=== tests/brief-theme-map-smoke.test.js ===
Brief map and theme integrity smoke test passed.
status=0
=== tests/brief-terminal-smoke.test.js ===
Brief terminal smoke test passed.
status=0
=== tests/brief-entry-watch-smoke.test.js ===
Brief entry and relationship watch smoke test passed.
status=0
=== tests/brief-stability-smoke.test.js ===
Brief stability smoke test passed.
status=0
=== tests/brief-workspace-team-smoke.test.js ===
Brief workspace and Team smoke test passed.
status=0
=== tests/brief-polish-smoke.test.js ===
Brief polish smoke test passed.
status=0
failures=0
```

## Browser log

```text

Running 55 tests using 2 workers

[1A[2K[1/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow
[1A[2K[2/55] [chromium-desktop] › tests/brief-theme-e2e.spec.cjs:116:1 › all five briefings remain readable in Quick and Full light and dark states
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /brief/?theme-sweep=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:24] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:25] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:26] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:26] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:26] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:27] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:27] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:28] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:28] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:28] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:28] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:28] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:28] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:28] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:28] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:28] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[3/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:125:1 › tips can be disabled and help remains available
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:35] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:35] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:35] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:35] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:35] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:35] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:36] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:37] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:37] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:37] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:37] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[4/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:138:1 › moving signal rail resumes after pause
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:40] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:41] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:41] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:41] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:41] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:42] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:42] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:42] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:43] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:43] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:43] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[5/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:153:1 › help and tour stay usable in landscape viewport
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[6/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:45] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:46] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:47] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:47] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:48] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:49] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:49] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:49] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:49] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:49] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:49] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:49] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:49] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:49] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:49] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[7/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:166:1 › team switch, full workspace and question-mark help remain functional
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:52] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:53] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:53] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:53] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:53] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:53] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:54] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:54] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:54] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:54] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:54] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:54] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:55] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:55] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:55] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:55] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[8/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:57] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:58] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:59] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:36:59] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[9/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:09] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:10] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:10] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:10] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:11] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:11] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:11] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  1) [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('[data-workspace-tab="day"]')
    Expected string: [32m"[7mtru[27me"[39m
    Received string: [31m"[7mfals[27me"[39m
    Timeout: 7000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 7000ms[22m
    [2m  - waiting for locator('[data-workspace-tab="day"]')[22m
    [2m    11 × locator resolved to <button role="tab" type="button" id="brief-tab-day" aria-selected="false" data-workspace-tab="day" data-device-ready="true" aria-controls="briefWorkspacePanel">Day</button>[22m
    [2m       - unexpected value "false"[22m


      186 |   await expect(dayCard).toBeVisible();
      187 |   await dayCard.click();
    > 188 |   await expect(page.locator('[data-workspace-tab="day"]')).toHaveAttribute('aria-selected', 'true');
          |                                                            ^
      189 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('day');
      190 |   await expect.poll(() => new URL(page.url()).searchParams.get('depth')).toBe('quick');
      191 |   await expect.poll(() => new URL(page.url()).hash).toBe('#briefWorkspace');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:188:60

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('[data-workspace-tab="day"]')
    Expected string: [32m"[7mtru[27me"[39m
    Received string: [31m"[7mfals[27me"[39m
    Timeout: 7000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 7000ms[22m
    [2m  - waiting for locator('[data-workspace-tab="day"]')[22m
    [2m    11 × locator resolved to <button role="tab" type="button" id="brief-tab-day" aria-selected="false" data-workspace-tab="day" data-device-ready="true" aria-controls="briefWorkspacePanel">Day</button>[22m
    [2m       - unexpected value "false"[22m


      186 |   await expect(dayCard).toBeVisible();
      187 |   await dayCard.click();
    > 188 |   await expect(page.locator('[data-workspace-tab="day"]')).toHaveAttribute('aria-selected', 'true');
          |                                                            ^
      189 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('day');
      190 |   await expect.poll(() => new URL(page.url()).searchParams.get('depth')).toBe('quick');
      191 |   await expect.poll(() => new URL(page.url()).hash).toBe('#briefWorkspace');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:188:60

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-desktop-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-desktop-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-desktop-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-desktop-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[10/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:21] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:22] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:22] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:22] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:22] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:23] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[11/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:35] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:36] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K  2) [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow 

    [31mTest timeout of 45000ms exceeded.[39m

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
    [2m  - waiting for locator('#briefTourNext')[22m
    [2m    - locator resolved to <button type="button" id="briefTourNext">Next</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is not stable[22m
    [2m  64 × retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - element is outside of the viewport[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m


      114 |     await page.waitForTimeout(420);
      115 |     await expectInsideViewport(page.locator('#briefTourBubble'), page);
    > 116 |     if (step < 5) await page.locator('#briefTourNext').click();
          |                                                        ^
      117 |   }
      118 |
      119 |   await expect(page.locator('#briefTourNext')).toHaveText('Done');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:116:56

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-firefox-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-firefox-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-firefox-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-firefox-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeEnabled[2m()[22m failed

    Locator:  locator('#enterBrief')
    Expected: enabled
    Received: disabled
    Timeout:  7000ms

    Call log:
    [2m  - Expect "toBeEnabled" with timeout 7000ms[22m
    [2m  - waiting for locator('#enterBrief')[22m
    [2m    11 × locator resolved to <button disabled type="button" id="enterBrief" aria-disabled="true" class="primary-action" data-device-ready="true" data-live-narration="true">Choose a briefing first</button>[22m
    [2m       - unexpected value "disabled"[22m


      12 |   await page.locator('.brief-entry-radio-card.is-individual').click();
      13 |   await expect(page.locator('body')).toHaveClass(/is-locked/);
    > 14 |   await expect(page.locator('#enterBrief')).toBeEnabled();
         |                                             ^
      15 |   await page.locator('#enterBrief').click();
      16 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      17 |   await expect(page.locator('#briefWorkspace')).toBeVisible();
        at enterPersonalBriefing (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:14:45)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:93:3

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-firefox-desktop-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-firefox-desktop-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-firefox-desktop-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-firefox-desktop-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[12/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:125:1 › tips can be disabled and help remains available
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:48] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:48] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:48] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:48] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:48] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:48] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:48] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] code 404, message File not found

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:37:49] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[13/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:125:1 › tips can be disabled and help remains available (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] code 404, message File not found

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:02] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K  3) [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:125:1 › tips can be disabled and help remains available 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeEnabled[2m()[22m failed

    Locator:  locator('#enterBrief')
    Expected: enabled
    Received: disabled
    Timeout:  7000ms

    Call log:
    [2m  - Expect "toBeEnabled" with timeout 7000ms[22m
    [2m  - waiting for locator('#enterBrief')[22m
    [2m    11 × locator resolved to <button disabled type="button" id="enterBrief" aria-disabled="true" class="primary-action" data-device-ready="true" data-live-narration="true">Choose a briefing first</button>[22m
    [2m       - unexpected value "disabled"[22m


      12 |   await page.locator('.brief-entry-radio-card.is-individual').click();
      13 |   await expect(page.locator('body')).toHaveClass(/is-locked/);
    > 14 |   await expect(page.locator('#enterBrief')).toBeEnabled();
         |                                             ^
      15 |   await page.locator('#enterBrief').click();
      16 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      17 |   await expect(page.locator('#briefWorkspace')).toBeVisible();
        at enterPersonalBriefing (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:14:45)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:126:3

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-tips-can-5fd68--and-help-remains-available-firefox-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-tips-can-5fd68--and-help-remains-available-firefox-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-tips-can-5fd68--and-help-remains-available-firefox-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-tips-can-5fd68--and-help-remains-available-firefox-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[14/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:138:1 › moving signal rail resumes after pause
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:06] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:07] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[15/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:12] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:13] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:14] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:15] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:15] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:15] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:15] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[16/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:153:1 › help and tour stay usable in landscape viewport
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] code 404, message File not found

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:23] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[17/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:166:1 › team switch, full workspace and question-mark help remain functional
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:27] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] code 404, message File not found

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:28] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[18/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:34] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[19/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:38:39] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K  4) [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route 

    [31mTest timeout of 45000ms exceeded.[39m

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
    [2m  - waiting for locator('#briefMapButton')[22m
    [2m    - locator resolved to <button type="button" id="briefMapButton" aria-expanded="false" aria-haspopup="dialog" class="brief-map-button">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m  2 × retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is not stable[22m
    [2m  76 × retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m


      211 |   await expect(page.locator('#briefNavigationDrawer')).toBeHidden();
      212 |
    > 213 |   await page.locator('#briefMapButton').click();
          |                                         ^
      214 |   await page.locator('#briefDrawerRoutes [data-nav-route="handoffs"]').click();
      215 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      216 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:213:41

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 45000ms exceeded.[39m

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
    [2m  - waiting for locator('#briefMapButton')[22m
    [2m    - locator resolved to <button type="button" id="briefMapButton" aria-expanded="false" aria-haspopup="dialog" class="brief-map-button" data-device-ready="true">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is not stable[22m
    [2m  - retrying click action[22m
    [2m    - waiting 100ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is visible, enabled and stable[22m
    [2m    - scrolling into view if needed[22m
    [2m    - done scrolling[22m
    [2m    - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 100ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m    73 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      211 |   await expect(page.locator('#briefNavigationDrawer')).toBeHidden();
      212 |
    > 213 |   await page.locator('#briefMapButton').click();
          |                                         ^
      214 |   await page.locator('#briefDrawerRoutes [data-nav-route="handoffs"]').click();
      215 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      216 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:213:41

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-desktop-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-desktop-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-desktop-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-desktop-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[20/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /brief/?view=team&tab=handoffs&depth=full HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:02] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:03] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:04] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:04] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:04] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:05] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:05] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:05] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:05] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:05] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:05] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[21/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /brief/?view=team&tab=handoffs&depth=full HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:15] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:16] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:16] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:16] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:16] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:16] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:16] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:16] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:16] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:16] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:16] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:17] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:17] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:17] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:17] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:17] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:17] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:17] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  5) [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('body')
    Expected string: [32m"full"[39m
    Received string: [31m"quick"[39m
    Timeout: 7000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 7000ms[22m
    [2m  - waiting for locator('body')[22m
    [2m    11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>[22m
    [2m       - unexpected value "quick"[22m


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('body')
    Expected string: [32m"full"[39m
    Received string: [31m"quick"[39m
    Timeout: 7000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 7000ms[22m
    [2m  - waiting for locator('body')[22m
    [2m    11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>[22m
    [2m       - unexpected value "quick"[22m


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-desktop-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-desktop-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-desktop-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-desktop-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[22/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:237:1 › the top briefing map remains available in all five briefing types
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:28] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:29] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:30] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:30] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:30] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:30] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[23/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:33] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:39:34] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[24/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:237:1 › the top briefing map remains available in all five briefing types (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:14] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:15] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  6) [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route 

    [31mTest timeout of 45000ms exceeded.[39m

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
    [2m  - waiting for locator('#briefMapButton')[22m
    [2m    - locator resolved to <button type="button" id="briefMapButton" aria-expanded="false" aria-haspopup="dialog" class="brief-map-button" data-device-ready="true">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m    4 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is not stable[22m
    [2m  15 × retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m       - waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is not stable[22m
    [2m  9 × retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m      - waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m  - retrying click action[22m
    [2m    - waiting 500ms[22m


      211 |   await expect(page.locator('#briefNavigationDrawer')).toBeHidden();
      212 |
    > 213 |   await page.locator('#briefMapButton').click();
          |                                         ^
      214 |   await page.locator('#briefDrawerRoutes [data-nav-route="handoffs"]').click();
      215 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      216 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:213:41

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-firefox-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-firefox-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-firefox-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-firefox-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 45000ms exceeded.[39m

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
    [2m  - waiting for locator('#briefDrawerPresets button').filter({ hasText: /^Team$/ })[22m
    [2m    - locator resolved to <button type="button" aria-pressed="false">Team</button>[22m
    [2m  - attempting click action[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is not stable[22m
    [2m  - retrying click action[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m    - element is not visible[22m
    [2m  - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    79 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is not visible[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      207 |   await expectInsideViewport(page.locator('.brief-navigation-panel'), page);
      208 |
    > 209 |   await page.locator('#briefDrawerPresets button').filter({ hasText: /^Team$/ }).click();
          |                                                                                  ^
      210 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
      211 |   await expect(page.locator('#briefNavigationDrawer')).toBeHidden();
      212 |
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:209:82

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-firefox-desktop-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-firefox-desktop-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-firefox-desktop-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-firefox-desktop-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[25/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry
[1A[2K  7) [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:237:1 › the top briefing map remains available in all five briefing types 

    [31mTest timeout of 45000ms exceeded.[39m

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
    [2m  - waiting for locator('[data-nav-close]').last()[22m
    [2m    - locator resolved to <button type="button" data-nav-close="">Done</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not visible[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    78 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is not visible[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      256 |     await expect(page.locator('#briefNavigationDrawer')).toBeVisible();
      257 |     await expect(map).toHaveAttribute('aria-expanded', 'true');
    > 258 |     await page.locator('[data-nav-close]').last().click();
          |                                                   ^
      259 |     await expect(page.locator('#briefNavigationDrawer')).toBeHidden();
      260 |   }
      261 | });
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:258:51

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-the-top--8afc2--in-all-five-briefing-types-chromium-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-the-top--8afc2--in-all-five-briefing-types-chromium-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-the-top--8afc2--in-all-five-briefing-types-chromium-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-the-top--8afc2--in-all-five-briefing-types-chromium-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[26/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:22] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:22] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:22] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:22] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:23] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /brief/?view=team&tab=handoffs&depth=full HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:24] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:25] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:26] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:26] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:26] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:26] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[27/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry (retry #1)
[1A[2K[28/55] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:39] "GET /brief/?view=team&tab=handoffs&depth=full HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:40] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:41] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:41] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:41] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:41] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:41] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:41] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:41] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:41] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:41] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:41] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:42] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  8) [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('body')
    Expected string: [32m"full"[39m
    Received string: [31m"quick"[39m
    Timeout: 7000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 7000ms[22m
    [2m  - waiting for locator('body')[22m
    [2m    11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>[22m
    [2m       - unexpected value "quick"[22m


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-firefox-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-firefox-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-firefox-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-firefox-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('body')
    Expected string: [32m"full"[39m
    Received string: [31m"quick"[39m
    Timeout: 7000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 7000ms[22m
    [2m  - waiting for locator('body')[22m
    [2m    10 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>[22m
    [2m       - unexpected value "quick"[22m


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-firefox-desktop-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-firefox-desktop-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-firefox-desktop-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-firefox-desktop-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[29/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:237:1 › the top briefing map remains available in all five briefing types
[1A[2K  9) [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 7000ms[22m
    [2m  - waiting for locator('.polish-team-flow > div').first()[22m
    [2m    8 × locator resolved to <div class="is-complete">…</div>[22m
    [2m      - unexpected value "hidden"[22m


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 7000ms[22m
    [2m  - waiting for locator('.polish-team-flow > div').first()[22m
    [2m    8 × locator resolved to <div class="is-complete">…</div>[22m
    [2m      - unexpected value "hidden"[22m


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-desktop-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-desktop-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-desktop-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-desktop-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:54] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:55] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:55] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:55] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:55] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:55] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:55] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:55] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:55] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:55] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:55] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:55] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:55] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[30/55] [firefox-desktop] › tests/brief-theme-e2e.spec.cjs:116:1 › all five briefings remain readable in Quick and Full light and dark states
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /brief/?theme-sweep=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:57] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:40:58] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[31/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:06] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[32/55] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:23] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:24] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[33/55] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:33] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:35] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:35] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:35] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:35] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:35] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:35] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:35] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:35] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:35] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:35] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:35] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:36] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:36] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:36] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:36] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:36] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:36] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:36] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  10) [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 7000ms[22m
    [2m  - waiting for locator('.polish-team-flow > div').first()[22m
    [2m    7 × locator resolved to <div class="is-complete">…</div>[22m
    [2m      - unexpected value "hidden"[22m


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-firefox-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-firefox-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-firefox-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-firefox-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 7000ms[22m
    [2m  - waiting for locator('.polish-team-flow > div').first()[22m
    [2m    8 × locator resolved to <div class="is-complete">…</div>[22m
    [2m      - unexpected value "hidden"[22m


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-firefox-desktop-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-firefox-desktop-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-firefox-desktop-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-firefox-desktop-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[34/55] [webkit-desktop] › tests/brief-theme-e2e.spec.cjs:116:1 › all five briefings remain readable in Quick and Full light and dark states
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /brief/?theme-sweep=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:40] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:41] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:42] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:42] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:42] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:42] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:42] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:42] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:42] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:42] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:42] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:42] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:42] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:43] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:43] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:43] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:43] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:43] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:43] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:41:43] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[35/55] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:125:1 › tips can be disabled and help remains available
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:05] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:06] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:06] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:06] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:06] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:06] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:07] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:07] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:07] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:07] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:07] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:07] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:07] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:07] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:07] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:07] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:07] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:08] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:08] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:08] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:08] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:08] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:08] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:08] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[36/55] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:16] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[37/55] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:138:1 › moving signal rail resumes after pause
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:17] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:17] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:17] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:17] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:17] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:17] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:17] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:17] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:18] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:19] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:19] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:19] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:19] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:19] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:19] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:19] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:19] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:20] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:20] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:20] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:20] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:20] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:20] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:21] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:21] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:21] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:21] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[38/55] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:153:1 › help and tour stay usable in landscape viewport
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:28] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:29] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:29] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:29] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:30] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:30] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:30] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:30] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:30] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:30] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:30] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:30] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:30] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:30] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:30] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:31] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:31] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:31] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:31] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[39/55] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:166:1 › team switch, full workspace and question-mark help remain functional
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:37] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:39] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[40/55] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:125:1 › tips can be disabled and help remains available
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:40] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:41] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:41] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:41] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:41] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:41] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:41] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:41] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:42] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:42] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:42] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:42] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:42] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:42] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:42] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:42] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:42] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:42] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:42] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:43] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:43] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:43] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:43] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:43] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:43] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:43] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[41/55] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:138:1 › moving signal rail resumes after pause
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:51] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:52] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:52] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:52] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:52] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:52] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:52] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:52] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:52] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:53] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:53] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:53] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:53] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:53] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:53] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[42/55] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:54] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:55] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:55] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:55] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:55] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:55] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:56] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:56] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:56] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:56] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:56] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:56] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:56] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:56] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:56] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:56] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:56] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:56] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:57] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:57] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:57] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:57] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:57] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:42:57] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[43/55] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:153:1 › help and tour stay usable in landscape viewport
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:01] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:02] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:02] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:02] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:02] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:02] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:02] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:02] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:02] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:02] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:02] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:02] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:03] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:03] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:03] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[44/55] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:03] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:03] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:03] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:03] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:04] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:05] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:05] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:05] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:05] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:05] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:05] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:05] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:05] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:06] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:06] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:06] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:06] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:06] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:06] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:06] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:06] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:06] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:07] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[45/55] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:166:1 › team switch, full workspace and question-mark help remain functional
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:12] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:14] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:14] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:14] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:14] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:14] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:14] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:14] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:14] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:14] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:14] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:14] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:15] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:15] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:15] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:15] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:15] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:15] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:15] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[46/55] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:25] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:27] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:28] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:28] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:28] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:28] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[47/55] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:34] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:35] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:35] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:35] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:35] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:35] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:35] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:35] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:35] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:35] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:35] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:35] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:36] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:36] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:36] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:36] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:36] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:36] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:36] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[48/55] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:52] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:53] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:53] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:53] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:53] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:53] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:53] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:53] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:53] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:53] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:53] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:53] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:53] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:54] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:54] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:54] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:54] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:54] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:43:54] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[49/55] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:21] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:22] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:23] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:23] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:23] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:23] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:23] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:23] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:23] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:23] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:24] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:24] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:24] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:24] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:24] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:24] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:24] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:24] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:24] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:24] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  11) [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route 

    [31mTest timeout of 45000ms exceeded.[39m

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
    [2m  - waiting for locator('#briefMapButton')[22m
    [2m    - locator resolved to <button type="button" id="briefMapButton" aria-expanded="false" aria-haspopup="dialog" class="brief-map-button">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    36 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m


      211 |   await expect(page.locator('#briefNavigationDrawer')).toBeHidden();
      212 |
    > 213 |   await page.locator('#briefMapButton').click();
          |                                         ^
      214 |   await page.locator('#briefDrawerRoutes [data-nav-route="handoffs"]').click();
      215 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      216 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:213:41

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 45000ms exceeded.[39m

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
    [2m  - waiting for locator('#briefMapButton')[22m
    [2m    - locator resolved to <button type="button" id="briefMapButton" aria-expanded="false" aria-haspopup="dialog" class="brief-map-button">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    41 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      211 |   await expect(page.locator('#briefNavigationDrawer')).toBeHidden();
      212 |
    > 213 |   await page.locator('#briefMapButton').click();
          |                                         ^
      214 |   await page.locator('#briefDrawerRoutes [data-nav-route="handoffs"]').click();
      215 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      216 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:213:41

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-desktop-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-desktop-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-desktop-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-desktop-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[50/55] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /brief/?view=team&tab=handoffs&depth=full HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:39] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:40] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:41] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:41] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:41] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:41] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:41] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:41] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:41] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:41] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:42] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:42] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:42] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:42] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:42] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:42] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:42] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:42] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:43] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:43] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[51/55] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /brief/?view=team&tab=handoffs&depth=full HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:56] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:57] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:57] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:57] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:57] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:57] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:57] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:57] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:57] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:57] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:57] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:57] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:58] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:58] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:58] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:59] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:59] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:59] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:44:59] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  12) [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route 

    [31mTest timeout of 45000ms exceeded.[39m

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
    [2m  - waiting for locator('#briefMapButton')[22m
    [2m    - locator resolved to <button type="button" id="briefMapButton" aria-expanded="false" aria-haspopup="dialog" class="brief-map-button">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    45 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      211 |   await expect(page.locator('#briefNavigationDrawer')).toBeHidden();
      212 |
    > 213 |   await page.locator('#briefMapButton').click();
          |                                         ^
      214 |   await page.locator('#briefDrawerRoutes [data-nav-route="handoffs"]').click();
      215 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      216 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:213:41

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-iphone/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-iphone/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-iphone/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-iphone/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    [31mTest timeout of 45000ms exceeded.[39m

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
    [2m  - waiting for locator('#briefMapButton')[22m
    [2m    - locator resolved to <button type="button" id="briefMapButton" aria-expanded="false" aria-haspopup="dialog" class="brief-map-button">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is visible, enabled and stable[22m
    [2m      - scrolling into view if needed[22m
    [2m      - done scrolling[22m
    [2m      - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    45 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      211 |   await expect(page.locator('#briefNavigationDrawer')).toBeHidden();
      212 |
    > 213 |   await page.locator('#briefMapButton').click();
          |                                         ^
      214 |   await page.locator('#briefDrawerRoutes [data-nav-route="handoffs"]').click();
      215 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      216 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:213:41

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-iphone-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-iphone-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-iphone-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-webkit-iphone-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[52/55] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry
[1A[2K  13) [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('body')
    Expected string: [32m"full"[39m
    Received string: [31m"quick"[39m
    Timeout: 7000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 7000ms[22m
    [2m  - waiting for locator('body')[22m
    [2m    10 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>[22m
    [2m       - unexpected value "quick"[22m


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('body')
    Expected string: [32m"full"[39m
    Received string: [31m"quick"[39m
    Timeout: 7000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 7000ms[22m
    [2m  - waiting for locator('body')[22m
    [2m    11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>[22m
    [2m       - unexpected value "quick"[22m


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-desktop-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-desktop-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-desktop-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-desktop-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /brief/?view=team&tab=handoffs&depth=full HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:09] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[53/55] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:237:1 › the top briefing map remains available in all five briefing types
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:10] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:11] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:12] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:12] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:12] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:12] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:12] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:12] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:12] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:12] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:12] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:12] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:12] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:12] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:13] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:13] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:13] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:13] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:13] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:13] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:14] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:14] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:14] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:14] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:14] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:14] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:14] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[54/55] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /brief/?view=team&tab=handoffs&depth=full HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:26] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:27] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:27] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:27] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:27] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:27] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:27] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:27] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:27] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:28] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:28] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:28] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:28] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:28] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:29] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:30] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:30] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:30] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:30] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[55/55] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:37] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:38] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:38] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:38] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:38] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:38] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:38] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:38] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:38] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:38] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:38] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:38] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:39] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:39] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:39] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:39] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:39] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:39] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:40] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  14) [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('body')
    Expected string: [32m"full"[39m
    Received string: [31m"quick"[39m
    Timeout: 7000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 7000ms[22m
    [2m  - waiting for locator('body')[22m
    [2m    11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>[22m
    [2m       - unexpected value "quick"[22m


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-iphone/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-iphone/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-iphone/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-iphone/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('body')
    Expected string: [32m"full"[39m
    Received string: [31m"quick"[39m
    Timeout: 7000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 7000ms[22m
    [2m  - waiting for locator('body')[22m
    [2m    11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>[22m
    [2m       - unexpected value "quick"[22m


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-iphone-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-iphone-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-iphone-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-webkit-iphone-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[56/55] (retries) [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:237:1 › the top briefing map remains available in all five briefing types
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:42] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:44] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:44] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:44] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:44] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:44] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:44] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:44] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:44] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:44] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:44] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:45] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:45] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:45] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:45] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:45] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:45] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:45] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:45] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[57/55] (retries) [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:45:58] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:00] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:00] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:00] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:00] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:00] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:00] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:00] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:00] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:00] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:00] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:00] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:01] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:01] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:01] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:01] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:01] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:01] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:01] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[58/55] (retries) [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:10] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:11] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:11] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:11] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:11] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:11] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:11] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:11] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:11] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:12] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:12] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:12] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:12] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:12] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:12] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:12] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:12] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:12] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:12] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  15) [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 7000ms[22m
    [2m  - waiting for locator('.polish-team-flow > div').first()[22m
    [2m    8 × locator resolved to <div class="is-complete">…</div>[22m
    [2m      - unexpected value "hidden"[22m


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 7000ms[22m
    [2m  - waiting for locator('.polish-team-flow > div').first()[22m
    [2m    8 × locator resolved to <div class="is-complete">…</div>[22m
    [2m      - unexpected value "hidden"[22m


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-desktop-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-desktop-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-desktop-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-desktop-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[59/55] (retries) [webkit-iphone] › tests/brief-theme-e2e.spec.cjs:116:1 › all five briefings remain readable in Quick and Full light and dark states
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /brief/?theme-sweep=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:20] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:21] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:21] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:21] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:21] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:21] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:22] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:22] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:22] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:22] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:22] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:22] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:22] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:22] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:22] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:22] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:22] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:23] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:23] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:23] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:23] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:23] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:23] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:23] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[60/55] (retries) [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:30] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:31] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:31] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:31] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:31] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:31] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:31] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:31] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:31] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:32] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:32] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:32] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:32] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:32] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:32] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:32] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:32] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:32] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:32] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  16) [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 7000ms[22m
    [2m  - waiting for locator('.polish-team-flow > div').first()[22m
    [2m    8 × locator resolved to <div class="is-complete">…</div>[22m
    [2m      - unexpected value "hidden"[22m


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-iphone/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-iphone/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-iphone/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-iphone/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 7000ms[22m
    [2m  - waiting for locator('.polish-team-flow > div').first()[22m
    [2m    8 × locator resolved to <div class="is-complete">…</div>[22m
    [2m      - unexpected value "hidden"[22m


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-iphone-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-iphone-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-iphone-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-webkit-iphone-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[61/55] (retries) [chromium-android] › tests/brief-theme-e2e.spec.cjs:116:1 › all five briefings remain readable in Quick and Full light and dark states
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /brief/?theme-sweep=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:48] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:49] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[62/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:09] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:10] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:10] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:10] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:10] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:10] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:10] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:10] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:10] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[63/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:16] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  17) [chromium-android] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow 

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m730[39m
    Received:    [31m1250.469482421875[39m

      36 |   expect(result.top).toBeGreaterThanOrEqual(-3);
      37 |   expect(result.right).toBeLessThanOrEqual(result.width + 3);
    > 38 |   expect(result.bottom).toBeLessThanOrEqual(result.height + 3);
         |                         ^
      39 | }
      40 |
      41 | async function ensureTheme(page, wanted) {
        at expectInsideViewport (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:38:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:115:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m730[39m
    Received:    [31m1197.5880126953125[39m

      36 |   expect(result.top).toBeGreaterThanOrEqual(-3);
      37 |   expect(result.right).toBeLessThanOrEqual(result.width + 3);
    > 38 |   expect(result.bottom).toBeLessThanOrEqual(result.height + 3);
         |                         ^
      39 | }
      40 |
      41 | async function ensureTheme(page, wanted) {
        at expectInsideViewport (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:38:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:115:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[64/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:125:1 › tips can be disabled and help remains available
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:23] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:24] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:24] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:24] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:24] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:24] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:24] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:24] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:24] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:24] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:24] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:24] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:24] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[65/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:138:1 › moving signal rail resumes after pause
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:26] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:27] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[66/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:153:1 › help and tour stay usable in landscape viewport
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:30] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[67/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:166:1 › team switch, full workspace and question-mark help remain functional
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:33] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[68/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:37] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[69/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:23] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:24] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  18) [chromium-android] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path 

    [31mTest timeout of 45000ms exceeded.[39m

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
    [2m  - waiting for locator('[data-quick-route="day"]').first()[22m
    [2m    - locator resolved to <article tabindex="0" role="button" data-quick-route="day" class="quick-signal-card tone-blue" aria-label="Website review with Morgan. Open Day.">…</article>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    - waiting for element to be visible, enabled and stable[22m
    [2m  - element was detached from the DOM, retrying[22m


      185 |   const dayCard = page.locator('[data-quick-route="day"]').first();
      186 |   await expect(dayCard).toBeVisible();
    > 187 |   await dayCard.click();
          |                 ^
      188 |   await expect(page.locator('[data-workspace-tab="day"]')).toHaveAttribute('aria-selected', 'true');
      189 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('day');
      190 |   await expect.poll(() => new URL(page.url()).searchParams.get('depth')).toBe('quick');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:187:17

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-android/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-android/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-android/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-android/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('[data-quick-route="day"]').first()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  7000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 7000ms[22m
    [2m  - waiting for locator('[data-quick-route="day"]').first()[22m


      184 |   await expect(page.locator('#briefMapButton')).toBeVisible();
      185 |   const dayCard = page.locator('[data-quick-route="day"]').first();
    > 186 |   await expect(dayCard).toBeVisible();
          |                         ^
      187 |   await dayCard.click();
      188 |   await expect(page.locator('[data-workspace-tab="day"]')).toHaveAttribute('aria-selected', 'true');
      189 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('day');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:186:25

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-android-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-android-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-android-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-quick-ca-5a926-eate-an-interconnected-path-chromium-android-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[70/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:33] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:48:34] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[71/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:23] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:24] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:24] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:24] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:24] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:24] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:24] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:24] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:24] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:24] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:24] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:24] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  19) [chromium-android] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route 

    [31mTest timeout of 45000ms exceeded.[39m

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
    [2m  - waiting for locator('#briefMapButton')[22m
    [2m    - locator resolved to <button type="button" id="briefMapButton" aria-expanded="false" aria-haspopup="dialog" class="brief-map-button">…</button>[22m
    [2m  - attempting click action[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m    - waiting 20ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m      - waiting 100ms[22m
    [2m    2 × waiting for element to be visible, enabled and stable[22m
    [2m      - element is not stable[22m
    [2m    - retrying click action[22m
    [2m      - waiting 500ms[22m
    [2m    80 × waiting for element to be visible, enabled and stable[22m
    [2m       - element is visible, enabled and stable[22m
    [2m       - scrolling into view if needed[22m
    [2m       - done scrolling[22m
    [2m       - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events[22m
    [2m     - retrying click action[22m
    [2m       - waiting 500ms[22m


      211 |   await expect(page.locator('#briefNavigationDrawer')).toBeHidden();
      212 |
    > 213 |   await page.locator('#briefMapButton').click();
          |                                         ^
      214 |   await page.locator('#briefDrawerRoutes [data-nav-route="handoffs"]').click();
      215 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      216 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:213:41

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-android/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-android/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-android/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-android/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m396[39m
    Received:    [31m410.17247009277344[39m

      35 |   expect(result.left).toBeGreaterThanOrEqual(-3);
      36 |   expect(result.top).toBeGreaterThanOrEqual(-3);
    > 37 |   expect(result.right).toBeLessThanOrEqual(result.width + 3);
         |                        ^
      38 |   expect(result.bottom).toBeLessThanOrEqual(result.height + 3);
      39 | }
      40 |
        at expectInsideViewport (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:37:24)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:207:3

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-android-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-android-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-android-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-briefing-7f1c1-d-remembers-a-handoff-route-chromium-android-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[72/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /brief/?view=team&tab=handoffs&depth=full HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:26] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:27] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[73/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /brief/?view=team&tab=handoffs&depth=full HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  20) [chromium-android] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('body')
    Expected string: [32m"full"[39m
    Received string: [31m"quick"[39m
    Timeout: 7000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 7000ms[22m
    [2m  - waiting for locator('body')[22m
    [2m    11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>[22m
    [2m       - unexpected value "quick"[22m


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-android/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-android/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-android/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-android/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveAttribute[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('body')
    Expected string: [32m"full"[39m
    Received string: [31m"quick"[39m
    Timeout: 7000ms

    Call log:
    [2m  - Expect "toHaveAttribute" with timeout 7000ms[22m
    [2m  - waiting for locator('body')[22m
    [2m    11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>[22m
    [2m       - unexpected value "quick"[22m


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-android-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-android-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-android-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-a-deep-U-447c3-ested-Team-view-after-entry-chromium-android-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[74/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:237:1 › the top briefing map remains available in all five briefing types
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:47] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[75/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:53] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[76/55] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-config.js?v=20260803-15 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-7 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-onboarding-bounds.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-navigation.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-theme-integrity.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-theme-integrity.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-navigation-runtime.css?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-navigation.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-map-top.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-navigation-runtime.js?v=20260803-6 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-map-top.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:56] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:57] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:57] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:57] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:57] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:57] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:57] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:57] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  21) [chromium-android] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeGreaterThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: >= [32m4[39m
    Received:    [31m1[39m

      79 |   await expect(locator).toBeVisible();
      80 |   const metrics = await contrastMetrics(locator, textSelector);
    > 81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
         |                         ^
      82 |   return metrics;
      83 | }
      84 |
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:81:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:269:17

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-android/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-android/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-android/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-android/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
    [2m  - Expect "toBeVisible" with timeout 7000ms[22m
    [2m  - waiting for locator('.polish-team-flow > div').first()[22m
    [2m    8 × locator resolved to <div class="is-complete">…</div>[22m
    [2m      - unexpected value "hidden"[22m


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-android-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-android-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-android-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-android-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K  19 failed
    [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path 
    [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route 
    [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry 
    [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 
    [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow 
    [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route 
    [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry 
    [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 
    [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route 
    [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry 
    [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 
    [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route 
    [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry 
    [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 
    [chromium-android] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow 
    [chromium-android] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path 
    [chromium-android] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route 
    [chromium-android] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry 
    [chromium-android] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 
  2 flaky
    [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:237:1 › the top briefing map remains available in all five briefing types 
    [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:125:1 › tips can be disabled and help remains available 
  34 passed (13.7m)
```
