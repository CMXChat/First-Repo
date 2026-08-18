(() => {
  "use strict";

  /**
   * CHECK IN LAB BOOTSTRAP
   * ----------------------
   * This file is deliberately EXTERNAL. Do not move this code back into an inline
   * <script> in lab/index.html. The loader constructs script tags while transforming
   * the frozen Check In snapshot; raw </script> text inside an inline script causes
   * the HTML parser to terminate that script early and print/break the remaining code.
   *
   * LAB SAFETY:
   * - the production snapshot is treated as immutable input
   * - production asset paths are rewritten to /assets/lab/
   * - production API connectivity is removed from the snapshot CSP
   * - lab-mock-api.js is loaded before the copied Check In status/client scripts
   * - script execution remains restricted to same-origin assets
   * - Lab permits inline STYLE declarations because the inherited Check In UI and
   *   Sequence/Action visualizations calculate positions through element.style.
   *   Do not copy this compatibility exception into the official app by default.
   * - all additional product layers remain Lab-only
   *
   * OFFICIAL PROJECT MIGRATION:
   * This loader is compatibility scaffolding for the static Lab clone. Never port it
   * into the official application. Rebuild approved Lab behavior with the official
   * router/components/API client/backend instead. See CHECKINLABCLONE.md.
   */

  const BUILD = "20260817-auto1";
  const SNAPSHOT_URL = `/assets/lab/checkin-index-snapshot.html?v=${BUILD}`;

  const LAB_STYLES = Object.freeze([
    ["lab-safety.css", "20260816-lab-safe1"],
    ["lab-crm.css", "20260816-crm1"],
    ["lab-inventory.css", "20260816-inventory1"],
    ["lab-actions.css", "20260816-actions1"],
    ["lab-timeline.css", "20260816-sequence1"],
    ["lab-timeline-responsive.css", "20260816-sequence1"],
    ["lab-decisions.css", "20260816-decisions1"],
    ["lab-audit.css", "20260816-audit2"],
    ["lab-command.css", "20260816-phase8-1"],
    ["lab-test-center.css", "20260816-test1"],
    ["lab-acceptance.css", "20260816-acceptance1"],
    ["lab-product-polish.css", "20260816-mobile1"],
    ["lab-experience.css", "20260816-product2"],
    ["lab-plan.css", "20260816-plan1"],
    ["lab-plan-overrides.css", "20260816-plan1"],
    ["lab-status-top.css", "20260818-status1"],
    ["lab-automation-builder.css", "20260817-auto1"]
  ]);

  const LAB_SCRIPTS = Object.freeze([
    ["lab-crm.js", "20260816-crm1"],
    ["lab-inventory.js", "20260816-inventory1"],
    ["lab-actions.js", "20260816-actions1"],
    ["lab-timeline-live.js", "20260816-sequence1"],
    ["lab-decisions.js", "20260816-decisions1"],
    ["lab-decisions-events.js", "20260816-decisions1"],
    ["lab-audit-bootstrap.js", "20260816-audit2"],
    ["lab-audit.js", "20260816-audit2"],
    ["lab-command.js", "20260816-phase8-1"],
    ["lab-test-center.js", "20260816-test1"],
    ["lab-product-polish.js", "20260816-mobile3"],
    ["lab-plan.js", "20260816-plan1"],
    ["lab-experience.js", "20260816-product2"],
    ["lab-automation-builder.js", "20260817-auto1"],
    ["lab-acceptance.js", "20260816-acceptance1"]
  ]);

  function styleTags() {
    return LAB_STYLES.map(([file, version]) => `  <link rel="stylesheet" href="/assets/lab/${file}?v=${version}" />`).join("\n");
  }

  function scriptTags() {
    return LAB_SCRIPTS.map(([file, version]) => `  <script src="/assets/lab/${file}?v=${version}"></script>`).join("\n");
  }

  function replaceRequired(source, needle, replacement, label) {
    if (!source.includes(needle)) throw new Error(`Lab snapshot contract changed: ${label}`);
    return source.replace(needle, replacement);
  }

  function transformSnapshot(source) {
    if (typeof source !== "string" || !source.includes("<!DOCTYPE html>")) {
      throw new Error("Lab snapshot response was not valid HTML.");
    }

    let html = source
      .replaceAll("/assets/checkin/", "/assets/lab/")
      .replaceAll("https://db.cmxchat.com/checkin/", "https://db.cmxchat.com/lab/")
      .replaceAll('href="/checkin/"', 'href="/lab/"');

    html = replaceRequired(
      html,
      "connect-src 'self' https://api.cmxchat.com;",
      "connect-src 'self';",
      "production API CSP"
    );
    html = replaceRequired(
      html,
      "style-src 'self';",
      "style-src 'self' 'unsafe-inline';",
      "Lab dynamic-style CSP compatibility"
    );
    html = replaceRequired(
      html,
      "<title>Check In · Dead Man Switch</title>",
      "<title>Check In Lab · Dead Man Switch</title>",
      "document title"
    );
    html = replaceRequired(
      html,
      "</head>",
      `  <meta name="cmx-lab-build" content="${BUILD}" />\n${styleTags()}\n</head>`,
      "head close"
    );
    html = replaceRequired(
      html,
      "<body>",
      '<body data-lab-mode="true">',
      "body element"
    );

    const snapshotStatusContract = '<script src="/assets/lab/checkin-status-contract.js?v=20260816-2"></script>';
    const labStatusContract = '<script src="/assets/lab/checkin-status-contract.js?v=20260816-acceptance2"></script>';
    html = replaceRequired(
      html,
      snapshotStatusContract,
      `<script src="/assets/lab/lab-mock-api.js?v=20260816-lab-safe5"></script>\n  ${labStatusContract}`,
      "status contract script"
    );
    html = replaceRequired(
      html,
      "</body>",
      `${scriptTags()}\n</body>`,
      "body close"
    );

    if (html.includes("/assets/checkin/")) throw new Error("Lab snapshot still references production asset paths.");
    if (html.includes("connect-src 'self' https://api.cmxchat.com;")) throw new Error("Lab snapshot still permits the production API in CSP.");
    if (!html.includes("style-src 'self' 'unsafe-inline';")) throw new Error("Lab dynamic visualization styles are not permitted by CSP.");
    if (!html.includes('data-lab-mode="true"')) throw new Error("Lab mode marker was not applied.");
    if (!html.includes("/assets/lab/lab-mock-api.js")) throw new Error("Lab mock API was not inserted.");
    if (!html.includes("/assets/lab/lab-command.js")) throw new Error("Phase 8 integration layer was not inserted.");
    if (!html.includes("/assets/lab/lab-test-center.js")) throw new Error("Lab Test Center was not inserted.");
    if (!html.includes("/assets/lab/lab-product-polish.js")) throw new Error("Lab product polish layer was not inserted.");
    if (!html.includes("/assets/lab/lab-plan.js")) throw new Error("Long-horizon Plan layer was not inserted.");
    if (!html.includes("/assets/lab/lab-experience.js")) throw new Error("User experience layer was not inserted.");
    if (!html.includes("/assets/lab/lab-automation-builder.js")) throw new Error("Automation Builder prototype was not inserted.");
    if (!html.includes("/assets/lab/lab-acceptance.js")) throw new Error("Acceptance hardening layer was not inserted.");

    return html;
  }

  function renderFailure(error) {
    const message = error instanceof Error ? error.message : String(error || "Unknown loader failure");
    const shell = typeof document !== "undefined" ? document.getElementById("labBootShell") : null;
    if (shell) {
      shell.dataset.state = "error";
      shell.innerHTML = `
        <div class="lab-boot-card" role="alert">
          <span class="lab-boot-kicker">CHECK IN LAB</span>
          <strong>Lab snapshot unavailable</strong>
          <p>The isolated workspace could not finish loading.</p>
          <small>${message.replace(/[&<>"']/g, "")}</small>
          <button type="button" id="labBootRetry">Retry</button>
        </div>`;
      document.getElementById("labBootRetry")?.addEventListener("click", () => location.reload());
    } else if (typeof document !== "undefined" && document.body) {
      document.body.textContent = "Check In Lab could not load.";
    }
    if (typeof console !== "undefined") console.error("Check In Lab bootstrap failed", error);
  }

  async function boot() {
    try {
      const response = await fetch(SNAPSHOT_URL, { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) throw new Error(`Snapshot request failed (${response.status}).`);
      const html = transformSnapshot(await response.text());
      document.open();
      document.write(html);
      document.close();
    } catch (error) {
      renderFailure(error);
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { BUILD, LAB_STYLES, LAB_SCRIPTS, transformSnapshot };
  }

  if (typeof window !== "undefined" && typeof document !== "undefined") boot();
})();