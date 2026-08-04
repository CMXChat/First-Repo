# Brief interface browser failures

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;

---

    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)

---

    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

---

          - unexpected value "hidden"


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


---

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

---

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

---


    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"



---


    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {

---

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();

---


    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^

---

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;

---

    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)

---

    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

---

          - unexpected value "hidden"


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


---

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

---

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



---


[WebServer] 127.0.0.1 - - [04/Aug/2026 01:46:32] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

  16) [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"



---


  16) [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {

---

  16) [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();

---


    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^

---

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;

---

    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)

---

    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

---

          - unexpected value "hidden"


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


---

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

---

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

---


    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"



---


    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {

---

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();

---


    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^

---

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;

---

    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)

---

    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

---

          - unexpected value "hidden"


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


---

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

---

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



---


[WebServer] 127.0.0.1 - - [04/Aug/2026 01:47:17] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

  17) [chromium-android] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow 

    Error: expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 730
    Received:    1250.469482421875

      36 |   expect(result.top).toBeGreaterThanOrEqual(-3);
      37 |   expect(result.right).toBeLessThanOrEqual(result.width + 3);
    > 38 |   expect(result.bottom).toBeLessThanOrEqual(result.height + 3);
         |                         ^
      39 | }
      40 |
      41 | async function ensureTheme(page, wanted) {
        at expectInsideViewport (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:38:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:115:5

---


  17) [chromium-android] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow 

    Error: expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 730
    Received:    1250.469482421875

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

---

  17) [chromium-android] › tests/brief-browser-e2e.spec.cjs:92:1 › entry, help center and guided tour work without overflow 

    Error: expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 730
    Received:    1250.469482421875

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

---

    Error: expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 730
    Received:    1250.469482421875

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


---


    Expected: <= 730
    Received:    1250.469482421875

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

---

    Expected: <= 730
    Received:    1250.469482421875

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


---

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

---


    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 730
    Received:    1197.5880126953125

      36 |   expect(result.top).toBeGreaterThanOrEqual(-3);
      37 |   expect(result.right).toBeLessThanOrEqual(result.width + 3);
    > 38 |   expect(result.bottom).toBeLessThanOrEqual(result.height + 3);
         |                         ^
      39 | }
      40 |
      41 | async function ensureTheme(page, wanted) {
        at expectInsideViewport (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:38:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:115:5

---


    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 730
    Received:    1197.5880126953125

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

---

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 730
    Received:    1197.5880126953125

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

---

    Error: expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 730
    Received:    1197.5880126953125

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


---


    Expected: <= 730
    Received:    1197.5880126953125

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

---

    Expected: <= 730
    Received:    1197.5880126953125

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


---

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



---


  18) [chromium-android] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path 

    Test timeout of 45000ms exceeded.

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
      - waiting for locator('[data-quick-route="day"]').first()
        - locator resolved to <article tabindex="0" role="button" data-quick-route="day" class="quick-signal-card tone-blue" aria-label="Website review with Morgan. Open Day.">…</article>
      - attempting click action
        2 × waiting for element to be visible, enabled and stable
          - element is not stable
        - retrying click action
        - waiting 20ms
        - waiting for element to be visible, enabled and stable
      - element was detached from the DOM, retrying


      185 |   const dayCard = page.locator('[data-quick-route="day"]').first();

---

  18) [chromium-android] › tests/brief-browser-e2e.spec.cjs:179:1 › quick cards, sticky map and contextual links create an interconnected path 

    Test timeout of 45000ms exceeded.

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
      - waiting for locator('[data-quick-route="day"]').first()
        - locator resolved to <article tabindex="0" role="button" data-quick-route="day" class="quick-signal-card tone-blue" aria-label="Website review with Morgan. Open Day.">…</article>
      - attempting click action
        2 × waiting for element to be visible, enabled and stable
          - element is not stable
        - retrying click action
        - waiting 20ms
        - waiting for element to be visible, enabled and stable
      - element was detached from the DOM, retrying


      185 |   const dayCard = page.locator('[data-quick-route="day"]').first();
      186 |   await expect(dayCard).toBeVisible();

---


    Test timeout of 45000ms exceeded.

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
      - waiting for locator('[data-quick-route="day"]').first()
        - locator resolved to <article tabindex="0" role="button" data-quick-route="day" class="quick-signal-card tone-blue" aria-label="Website review with Morgan. Open Day.">…</article>
      - attempting click action
        2 × waiting for element to be visible, enabled and stable
          - element is not stable
        - retrying click action
        - waiting 20ms
        - waiting for element to be visible, enabled and stable
      - element was detached from the DOM, retrying


      185 |   const dayCard = page.locator('[data-quick-route="day"]').first();
      186 |   await expect(dayCard).toBeVisible();
    > 187 |   await dayCard.click();

---

        - waiting 20ms
        - waiting for element to be visible, enabled and stable
      - element was detached from the DOM, retrying


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

---

        - waiting for element to be visible, enabled and stable
      - element was detached from the DOM, retrying


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


---


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

---

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

---


    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('[data-quick-route="day"]').first()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('[data-quick-route="day"]').first()


      184 |   await expect(page.locator('#briefMapButton')).toBeVisible();
      185 |   const dayCard = page.locator('[data-quick-route="day"]').first();

---


    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('[data-quick-route="day"]').first()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('[data-quick-route="day"]').first()


      184 |   await expect(page.locator('#briefMapButton')).toBeVisible();
      185 |   const dayCard = page.locator('[data-quick-route="day"]').first();
    > 186 |   await expect(dayCard).toBeVisible();
          |                         ^

---

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('[data-quick-route="day"]').first()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('[data-quick-route="day"]').first()


      184 |   await expect(page.locator('#briefMapButton')).toBeVisible();
      185 |   const dayCard = page.locator('[data-quick-route="day"]').first();
    > 186 |   await expect(dayCard).toBeVisible();
          |                         ^
      187 |   await dayCard.click();

---


    Error: expect(locator).toBeVisible() failed

    Locator:  locator('[data-quick-route="day"]').first()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('[data-quick-route="day"]').first()


      184 |   await expect(page.locator('#briefMapButton')).toBeVisible();
      185 |   const dayCard = page.locator('[data-quick-route="day"]').first();
    > 186 |   await expect(dayCard).toBeVisible();
          |                         ^
      187 |   await dayCard.click();
      188 |   await expect(page.locator('[data-workspace-tab="day"]')).toHaveAttribute('aria-selected', 'true');

---

    Locator:  locator('[data-quick-route="day"]').first()
    Expected: visible
    Received: <element(s) not found>
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('[data-quick-route="day"]').first()


      184 |   await expect(page.locator('#briefMapButton')).toBeVisible();
      185 |   const dayCard = page.locator('[data-quick-route="day"]').first();
    > 186 |   await expect(dayCard).toBeVisible();
          |                         ^
      187 |   await dayCard.click();
      188 |   await expect(page.locator('[data-workspace-tab="day"]')).toHaveAttribute('aria-selected', 'true');
      189 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('day');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:186:25


---

    Expected: visible
    Received: <element(s) not found>
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('[data-quick-route="day"]').first()


      184 |   await expect(page.locator('#briefMapButton')).toBeVisible();
      185 |   const dayCard = page.locator('[data-quick-route="day"]').first();
    > 186 |   await expect(dayCard).toBeVisible();
          |                         ^
      187 |   await dayCard.click();
      188 |   await expect(page.locator('[data-workspace-tab="day"]')).toHaveAttribute('aria-selected', 'true');
      189 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('day');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:186:25

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────

---

    Received: <element(s) not found>
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('[data-quick-route="day"]').first()


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

---

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('[data-quick-route="day"]').first()


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

---

      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('[data-quick-route="day"]').first()


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


---

      - waiting for locator('[data-quick-route="day"]').first()


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

---

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


---

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



---


  19) [chromium-android] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route 

    Test timeout of 45000ms exceeded.

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
      - waiting for locator('#briefMapButton')
        - locator resolved to <button type="button" id="briefMapButton" aria-expanded="false" aria-haspopup="dialog" class="brief-map-button">…</button>
      - attempting click action
        2 × waiting for element to be visible, enabled and stable
          - element is not stable
        - retrying click action
        - waiting 20ms
        2 × waiting for element to be visible, enabled and stable
          - element is not stable
        - retrying click action
          - waiting 100ms
        2 × waiting for element to be visible, enabled and stable

---

  19) [chromium-android] › tests/brief-browser-e2e.spec.cjs:202:1 › briefing map switches to Team and remembers a handoff route 

    Test timeout of 45000ms exceeded.

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
      - waiting for locator('#briefMapButton')
        - locator resolved to <button type="button" id="briefMapButton" aria-expanded="false" aria-haspopup="dialog" class="brief-map-button">…</button>
      - attempting click action
        2 × waiting for element to be visible, enabled and stable
          - element is not stable
        - retrying click action
        - waiting 20ms
        2 × waiting for element to be visible, enabled and stable
          - element is not stable
        - retrying click action
          - waiting 100ms
        2 × waiting for element to be visible, enabled and stable
          - element is not stable

---


    Test timeout of 45000ms exceeded.

    Error: locator.click: Test timeout of 45000ms exceeded.
    Call log:
      - waiting for locator('#briefMapButton')
        - locator resolved to <button type="button" id="briefMapButton" aria-expanded="false" aria-haspopup="dialog" class="brief-map-button">…</button>
      - attempting click action
        2 × waiting for element to be visible, enabled and stable
          - element is not stable
        - retrying click action
        - waiting 20ms
        2 × waiting for element to be visible, enabled and stable
          - element is not stable
        - retrying click action
          - waiting 100ms
        2 × waiting for element to be visible, enabled and stable
          - element is not stable
        - retrying click action

---

           - <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body> intercepts pointer events
         - retrying click action
           - waiting 500ms


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

---

           - waiting 500ms


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

---


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

---

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


---

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

---


    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 396
    Received:    410.17247009277344

      35 |   expect(result.left).toBeGreaterThanOrEqual(-3);
      36 |   expect(result.top).toBeGreaterThanOrEqual(-3);
    > 37 |   expect(result.right).toBeLessThanOrEqual(result.width + 3);
         |                        ^
      38 |   expect(result.bottom).toBeLessThanOrEqual(result.height + 3);
      39 | }
      40 |
        at expectInsideViewport (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:37:24)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:207:3

---


    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 396
    Received:    410.17247009277344

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

---

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 396
    Received:    410.17247009277344

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

---

    Error: expect(received).toBeLessThanOrEqual(expected)

    Expected: <= 396
    Received:    410.17247009277344

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


---


    Expected: <= 396
    Received:    410.17247009277344

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

---

    Expected: <= 396
    Received:    410.17247009277344

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


---


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

---

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



---


[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:37] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

  20) [chromium-android] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry 

    Error: expect(locator).toHaveAttribute(expected) failed

    Locator: locator('body')
    Expected string: "full"
    Received string: "quick"
    Timeout: 7000ms

    Call log:
      - Expect "toHaveAttribute" with timeout 7000ms
      - waiting for locator('body')
        11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>
           - unexpected value "quick"



---


  20) [chromium-android] › tests/brief-browser-e2e.spec.cjs:223:1 › a deep URL preserves the deliberate gate and restores the requested Team view after entry 

    Error: expect(locator).toHaveAttribute(expected) failed

    Locator: locator('body')
    Expected string: "full"
    Received string: "quick"
    Timeout: 7000ms

    Call log:
      - Expect "toHaveAttribute" with timeout 7000ms
      - waiting for locator('body')
        11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>
           - unexpected value "quick"


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');

---

    Locator: locator('body')
    Expected string: "full"
    Received string: "quick"
    Timeout: 7000ms

    Call log:
      - Expect "toHaveAttribute" with timeout 7000ms
      - waiting for locator('body')
        11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>
           - unexpected value "quick"


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');

---

    Expected string: "full"
    Received string: "quick"
    Timeout: 7000ms

    Call log:
      - Expect "toHaveAttribute" with timeout 7000ms
      - waiting for locator('body')
        11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>
           - unexpected value "quick"


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38

---

    Received string: "quick"
    Timeout: 7000ms

    Call log:
      - Expect "toHaveAttribute" with timeout 7000ms
      - waiting for locator('body')
        11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>
           - unexpected value "quick"


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38


---

      - waiting for locator('body')
        11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>
           - unexpected value "quick"


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

---

           - unexpected value "quick"


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

---


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

---

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

---


    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toHaveAttribute(expected) failed

    Locator: locator('body')
    Expected string: "full"
    Received string: "quick"
    Timeout: 7000ms

    Call log:
      - Expect "toHaveAttribute" with timeout 7000ms
      - waiting for locator('body')
        11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>
           - unexpected value "quick"



---


    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toHaveAttribute(expected) failed

    Locator: locator('body')
    Expected string: "full"
    Received string: "quick"
    Timeout: 7000ms

    Call log:
      - Expect "toHaveAttribute" with timeout 7000ms
      - waiting for locator('body')
        11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>
           - unexpected value "quick"


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');

---

    Locator: locator('body')
    Expected string: "full"
    Received string: "quick"
    Timeout: 7000ms

    Call log:
      - Expect "toHaveAttribute" with timeout 7000ms
      - waiting for locator('body')
        11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>
           - unexpected value "quick"


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');

---

    Expected string: "full"
    Received string: "quick"
    Timeout: 7000ms

    Call log:
      - Expect "toHaveAttribute" with timeout 7000ms
      - waiting for locator('body')
        11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>
           - unexpected value "quick"


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38

---

    Received string: "quick"
    Timeout: 7000ms

    Call log:
      - Expect "toHaveAttribute" with timeout 7000ms
      - waiting for locator('body')
        11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>
           - unexpected value "quick"


      229 |   await expect(page.locator('body')).not.toHaveClass(/is-locked/);
      230 |   await expect.poll(() => page.evaluate(() => window.BRIEF_APP.getPreset())).toBe('team');
    > 231 |   await expect(page.locator('body')).toHaveAttribute('data-brief-depth', 'full');
          |                                      ^
      232 |   await expect(page.locator('[data-workspace-tab="handoffs"]')).toHaveAttribute('aria-selected', 'true');
      233 |   await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe('team');
      234 |   await expect.poll(() => new URL(page.url()).searchParams.get('tab')).toBe('handoffs');
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:231:38


---

      - waiting for locator('body')
        11 × locator resolved to <body data-brief-depth="quick" data-space-mode="private" class="has-entry-radio has-brief-workspace has-brief-navigation">…</body>
           - unexpected value "quick"


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

---

           - unexpected value "quick"


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

---


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

---

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



---


[WebServer] 127.0.0.1 - - [04/Aug/2026 01:49:57] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

  21) [chromium-android] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 

    Error: expect(received).toBeGreaterThanOrEqual(expected)

    Expected: >= 4
    Received:    1

      79 |   await expect(locator).toBeVisible();
      80 |   const metrics = await contrastMetrics(locator, textSelector);
    > 81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
         |                         ^
      82 |   return metrics;
      83 | }
      84 |
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:81:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:269:17

---


  21) [chromium-android] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 

    Error: expect(received).toBeGreaterThanOrEqual(expected)

    Expected: >= 4
    Received:    1

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

---

  21) [chromium-android] › tests/brief-browser-e2e.spec.cjs:263:1 › light and dark themes keep representative cards, charts and maps readable 

    Error: expect(received).toBeGreaterThanOrEqual(expected)

    Expected: >= 4
    Received:    1

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

---

    Error: expect(received).toBeGreaterThanOrEqual(expected)

    Expected: >= 4
    Received:    1

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


---

    Expected: >= 4
    Received:    1

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


---

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

---


    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"



---


    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {

---

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();

---


    Error: expect(locator).toBeVisible() failed

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^

---

    Locator:  locator('.polish-team-flow > div').first()
    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;

---

    Expected: visible
    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)

---

    Received: hidden
    Timeout:  7000ms

    Call log:
      - Expect "toBeVisible" with timeout 7000ms
      - waiting for locator('.polish-team-flow > div').first()
        8 × locator resolved to <div class="is-complete">…</div>
          - unexpected value "hidden"


      77 |
      78 | async function expectReadable(locator, textSelector, minimum = 4) {
    > 79 |   await expect(locator).toBeVisible();
         |                         ^
      80 |   const metrics = await contrastMetrics(locator, textSelector);
      81 |   expect(metrics.ratio).toBeGreaterThanOrEqual(minimum);
      82 |   return metrics;
        at expectReadable (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:79:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:285:9

---

          - unexpected value "hidden"


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


---

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

---

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



---

        npx playwright show-trace test-results/brief-browser-e2e-light-an-3aacc-ds-charts-and-maps-readable-chromium-android-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


  19 failed
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