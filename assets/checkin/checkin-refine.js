(() => {
  "use strict";

  /*
   * Lightweight presentation layer for /checkin.
   *
   * Authoritative state, server time, authentication, CSRF, records, action
   * configuration and audit data remain owned by checkin.js + FastAPI.
   * This file never calculates a trigger, executes an action, or claims delivery.
   * It adds richer UI around the existing live data with only targeted observers.
   */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function clickView(view) {
    const button = $(`.side-nav [data-view="${view}"]`) || $(`.mobile-nav [data-view="${view}"]`);
    button?.click();
  }

  function hideLegacyNavigation() {
    const hiddenViews = new Set(["timeline", "updates"]);
    $$(".side-nav [data-view], .mobile-nav [data-view]").forEach(button => {
      const hidden = hiddenViews.has(button.dataset.view);
      button.hidden = hidden;
      button.classList.toggle("legacy-nav-target", hidden && button.closest(".side-nav"));
      button.classList.toggle("legacy-mobile-target", hidden && button.closest(".mobile-nav"));
    });

    const settings = $("#mobileNavSettings");
    if (settings) settings.hidden = true;

    const primaryOrder = ["overview", "records", "actions", "activity"];
    const desktop = $(".side-nav");
    const mobile = $(".mobile-nav");
    primaryOrder.forEach(view => {
      const button = desktop?.querySelector(`[data-view="${view}"]`);
      if (button) desktop.append(button);
    });
    primaryOrder.forEach(view => {
      const button = mobile?.querySelector(`[data-view="${view}"]`);
      if (button) mobile.append(button);
    });
  }

  function normalizeStaticCopy() {
    const accessButton = $("#operatorButton");
    if (accessButton && !document.body.classList.contains("operator-unlocked")) accessButton.textContent = "Access";

    const sessionLabel = $("#operatorSessionStrip strong");
    if (sessionLabel) sessionLabel.textContent = "PRIVATE ACCESS ACTIVE";

    $$(".quick-panel .quick-row").forEach(row => {
      const label = row.querySelector("span");
      if (label?.textContent.trim().toLowerCase() === "operator session") label.textContent = "Private access";
    });

    const hint = $("#checkinButtonHint");
    if (hint && /operator|authorization/i.test(hint.textContent || "")) hint.textContent = "Private access required";

    const accessState = $("#operatorState");
    if (accessState) accessState.textContent = document.body.classList.contains("operator-unlocked") ? "AUTHORIZED" : "LOCKED";

    [$("#authError"), $("#toast")].filter(Boolean).forEach(node => {
      const text = node.textContent || "";
      const next = text
        .replace(/Operator/gi, match => match === match.toUpperCase() ? "ACCESS" : match[0] === match[0].toUpperCase() ? "Access" : "access")
        .replace(/15-minute/gi, "15 minute")
        .replace(/check-in/gi, "check in");
      if (next !== text) node.textContent = next;
    });
  }

  function ensureServerContinuity() {
    const console = $("#statusConsole");
    if (!console || $("#serverContinuity")) return;

    const strip = document.createElement("section");
    strip.id = "serverContinuity";
    strip.className = "server-continuity";
    strip.setAttribute("aria-live", "polite");
    strip.innerHTML = `
      <div class="server-live-badge" id="serverLiveBadge" data-link="connecting"><i></i><strong>CONNECTING</strong></div>
      <div class="server-live-copy">
        <strong id="serverLiveTitle">Server clock connecting</strong>
        <span id="serverLiveCopy">The timer on this page is waiting for the authoritative server status.</span>
      </div>
      <button type="button" id="serverDetailsButton">How it works</button>`;

    console.querySelector(".console-head")?.insertAdjacentElement("afterend", strip);
    $("#serverDetailsButton")?.addEventListener("click", () => {
      const panel = $("#serverContinuityDetails");
      if (!panel) return;
      panel.hidden = !panel.hidden;
      $("#serverDetailsButton").textContent = panel.hidden ? "How it works" : "Hide details";
    });

    const details = document.createElement("div");
    details.id = "serverContinuityDetails";
    details.className = "server-continuity-details";
    details.hidden = true;
    details.innerHTML = `
      <span><strong>SERVER TIME</strong>The countdown is derived from server timestamps, not your phone clock.</span>
      <span><strong>PAGE INDEPENDENT</strong>Closing this page does not change the deadline saved by the service.</span>
      <span><strong>DELIVERY STATUS</strong>Automatic external action delivery is not connected yet, so this page does not claim actions were sent.</span>`;
    strip.insertAdjacentElement("afterend", details);
  }

  function updateServerContinuity() {
    const syncText = ($("#syncState")?.textContent || "").trim().toUpperCase();
    const badge = $("#serverLiveBadge");
    const badgeText = badge?.querySelector("strong");
    const title = $("#serverLiveTitle");
    const copy = $("#serverLiveCopy");
    if (!badge || !badgeText || !title || !copy) return;

    let link = "connecting";
    let label = "CONNECTING";
    let heading = "Server clock connecting";
    let message = "The timer on this page is waiting for the authoritative server status.";

    if (syncText.includes("SYNCHRONIZED")) {
      link = "live";
      label = "LIVE";
      heading = "Server clock synchronized";
      message = "This countdown is using the server supplied deadline and server time offset.";
    } else if (syncText.includes("PARTIALLY")) {
      link = "limited";
      label = "LIMITED";
      heading = "Server status partially available";
      message = "Some status data is available, but the page is withholding deadline details until the expected server contract is complete.";
    } else if (syncText.includes("UNAVAILABLE")) {
      link = "offline";
      label = "LINK OFFLINE";
      heading = "This page cannot verify the server right now";
      message = "The failed page sync did not change the stored deadline. Reconnect before relying on the displayed status.";
    }

    badge.dataset.link = link;
    badgeText.textContent = label;
    title.textContent = heading;
    copy.textContent = message;

    const readiness = $("#deadlineReadiness");
    const readinessState = $("#deadlineReadinessState");
    if (readiness) readiness.dataset.link = link;
    if (readinessState) readinessState.textContent = link === "live" ? "LIVE" : link === "offline" ? "UNVERIFIED" : link === "limited" ? "LIMITED" : "CONNECTING";
  }

  function ensurePressureBanner() {
    const overview = $('[data-view-panel="overview"]');
    if (!overview || $("#statePressureBanner")) return;
    const banner = document.createElement("section");
    banner.id = "statePressureBanner";
    banner.className = "state-pressure-banner";
    banner.hidden = true;
    banner.innerHTML = '<span class="pressure-mark" aria-hidden="true">!</span><div><small id="pressureEyebrow">ATTENTION</small><strong id="pressureTitle">Check in required</strong><p id="pressureCopy"></p></div>';
    overview.insertBefore(banner, overview.querySelector(".dashboard-grid") || overview.firstChild);
  }

  function ensureProtectedPackage() {
    const overview = $('[data-view-panel="overview"]');
    const dashboard = overview?.querySelector(".dashboard-grid");
    if (!overview || !dashboard || $("#protectedPackage")) return;

    const section = document.createElement("section");
    section.id = "protectedPackage";
    section.className = "protected-package refine-rich-card";
    section.innerHTML = `
      <div class="protected-package-head">
        <div>
          <small>PROTECTED PACKAGE</small>
          <h2>Contingency archive</h2>
          <p>Protected records and configured contingency controls remain sealed behind private access.</p>
        </div>
        <span class="package-seal" id="packageSeal"><i></i>SEALED</span>
      </div>
      <div class="package-grid">
        <button type="button" class="package-card" data-package-view="records" data-package-kind="documents"><span class="package-icon" aria-hidden="true">▱</span><span><strong>Documents</strong><small><b id="packageDocumentCount">0</b> indexed</small></span></button>
        <button type="button" class="package-card" data-package-view="records" data-package-kind="contacts"><span class="package-icon" aria-hidden="true">◎</span><span><strong>Contacts</strong><small><b id="packageContactCount">0</b> indexed</small></span></button>
        <button type="button" class="package-card" data-package-view="records" data-package-kind="organizations"><span class="package-icon" aria-hidden="true">▦</span><span><strong>Organizations</strong><small><b id="packageOrganizationCount">0</b> indexed</small></span></button>
        <button type="button" class="package-card package-card-action" data-package-view="actions" data-package-kind="actions"><span class="package-icon" aria-hidden="true">↯</span><span><strong>Actions</strong><small><b id="packageActionCount">0</b> configured</small></span></button>
      </div>`;

    section.querySelectorAll("[data-package-view]").forEach(button => button.addEventListener("click", () => clickView(button.dataset.packageView)));
    dashboard.insertAdjacentElement("afterend", section);
  }

  function ensureDeadlineOverview() {
    const packageSection = $("#protectedPackage");
    if (!packageSection || $("#deadlineOverview")) return;

    const section = document.createElement("section");
    section.id = "deadlineOverview";
    section.className = "deadline-overview refine-rich-card";
    section.innerHTML = `
      <div class="deadline-overview-head">
        <div><small>DEADLINE SEQUENCE</small><h2>Current window</h2><p>The server moves through these states from the latest verified check in.</p></div>
        <button type="button" id="openTimelineFromStatus">Open timeline</button>
      </div>
      <div class="deadline-track" aria-label="Dead man switch state progression">
        <span data-track-stage="safe"><i></i><strong>Safe</strong><small>Current window</small></span>
        <span data-track-stage="soon"><i></i><strong>Due soon</strong><small>12 hour warning</small></span>
        <span data-track-stage="grace"><i></i><strong>Grace</strong><small>24 hour grace</small></span>
        <span data-track-stage="triggered"><i></i><strong>Trigger state</strong><small>Grace expired</small></span>
      </div>`;
    packageSection.insertAdjacentElement("afterend", section);
    $("#openTimelineFromStatus")?.addEventListener("click", () => clickView("timeline"));
  }

  function ensureProtectedGateways() {
    const configs = [
      ["records", "Protected records", "Document, contact and organization details remain private until access is granted."],
      ["activity", "Private activity log", "Protected events and detailed timestamps require private access."],
    ];

    configs.forEach(([view, title, copy]) => {
      const panel = $(`[data-view-panel="${view}"]`);
      if (!panel || panel.querySelector(`[data-refine-gateway="${view}"]`)) return;
      const gateway = document.createElement("section");
      gateway.className = "protected-access-gateway refine-rich-card";
      gateway.dataset.refineGateway = view;
      gateway.innerHTML = `
        <span class="gateway-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <div><small>PROTECTED ACCESS</small><h2>${title}</h2><p>${copy}</p><span class="gateway-state">SEALED</span></div>
        <button type="button">Unlock access</button>`;
      gateway.querySelector("button")?.addEventListener("click", () => $("#operatorButton")?.click());
      panel.querySelector(".view-heading")?.insertAdjacentElement("afterend", gateway);
    });
  }

  function ensureActionIntegrity() {
    const actions = $('[data-view-panel="actions"]');
    if (!actions || $("#actionIntegrity")) return;

    const section = document.createElement("section");
    section.id = "actionIntegrity";
    section.className = "action-integrity refine-rich-card";
    section.innerHTML = `
      <div class="action-integrity-head">
        <div><small>ACTION READINESS</small><h2>Server tracked, delivery pending</h2></div>
        <span class="readiness-badge">CONFIGURATION ONLY</span>
      </div>
      <div class="readiness-grid">
        <article data-readiness="live" id="deadlineReadiness"><i></i><span><strong>Deadline engine</strong><small>Server tracked</small></span><b id="deadlineReadinessState">CONNECTING</b></article>
        <article data-readiness="saved" id="actionPlanReadiness"><i></i><span><strong>Protected action plan</strong><small id="actionPlanSummary">Loading configuration</small></span><b id="actionPlanState">CHECKING</b></article>
        <article data-readiness="pending"><i></i><span><strong>External delivery engine</strong><small>Automatic execution service</small></span><b>PENDING</b></article>
      </div>
      <p class="action-integrity-note">The live server tracks the switch and saved action configuration. Automatic external delivery is not connected yet, so the interface will not claim messages, files, webhooks, or other actions were sent.</p>
      <div class="delivery-pipeline">
        <div class="delivery-pipeline-head"><small>PLANNED EXECUTION PATH</small><span>BACKEND REQUIRED</span></div>
        <div class="delivery-pipeline-track">
          <article><b>01</b><strong>Trigger state</strong><small>Server confirms deadline state</small></article>
          <article><b>02</b><strong>Preflight</strong><small>Validate protected inputs</small></article>
          <article><b>03</b><strong>Queue</strong><small>Claim ordered actions</small></article>
          <article><b>04</b><strong>Delivery</strong><small>Attempt configured outputs</small></article>
          <article><b>05</b><strong>Audit</strong><small>Record final outcomes</small></article>
        </div>
      </div>`;

    const sequence = $("#publicActionSequence");
    sequence?.insertAdjacentElement("beforebegin", section);
  }

  function ensureActionSequenceHeading() {
    const sequence = $("#publicActionSequence");
    if (!sequence || $("#configuredSequenceHead")) return;
    const head = document.createElement("div");
    head.id = "configuredSequenceHead";
    head.className = "configured-sequence-head";
    head.innerHTML = '<div><small>CONFIGURED SEQUENCE</small><strong id="configuredSequenceCount">0 protected actions</strong></div><span>SEALED</span>';
    sequence.insertAdjacentElement("beforebegin", head);
  }

  function trimOverview() {
    const overview = $('[data-view-panel="overview"]');
    if (!overview) return;
    overview.querySelector(".mode-strip")?.classList.add("refine-hidden-row");
    overview.querySelector(".inventory-strip")?.classList.add("refine-hidden-row");
    overview.querySelector(".metric-grid")?.classList.add("refine-hidden-row");
    overview.querySelector(".recent-panel")?.classList.add("refine-hidden-row");

    $$(".quick-panel .quick-row").forEach(row => {
      const label = row.querySelector("span")?.textContent.trim().toLowerCase();
      const hide = ["schedule", "grace period", "records", "trigger actions"].includes(label);
      row.classList.toggle("refine-hidden-row", hide);
    });
    const title = $(".quick-panel .panel-title > span");
    if (title) title.textContent = "SYSTEM INTEGRITY";
  }

  function suppressDuplicateLockedActionCard() {
    if (document.body.classList.contains("operator-unlocked")) return;
    $$("#actionsList .locked-card").forEach(card => { card.hidden = true; });
  }

  function readCount(selector) {
    const value = Number($(selector)?.textContent);
    return Number.isInteger(value) && value >= 0 ? value : 0;
  }

  function updateCounts() {
    const values = {
      packageDocumentCount: readCount("#documentPublicCount"),
      packageContactCount: readCount("#contactPublicCount"),
      packageOrganizationCount: readCount("#organizationPublicCount"),
      packageActionCount: readCount("#actionPublicCount"),
    };
    Object.entries(values).forEach(([id, value]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = String(value);
    });

    const actions = values.packageActionCount;
    const configuredCount = $("#configuredSequenceCount");
    if (configuredCount) configuredCount.textContent = `${actions} protected action${actions === 1 ? "" : "s"}`;

    const actionPlanSummary = $("#actionPlanSummary");
    const actionPlanState = $("#actionPlanState");
    const actionPlanReadiness = $("#actionPlanReadiness");
    if (actionPlanSummary) actionPlanSummary.textContent = actions ? `${actions} configured action${actions === 1 ? "" : "s"}` : "No actions configured";
    if (actionPlanState) actionPlanState.textContent = actions ? "READY" : "EMPTY";
    if (actionPlanReadiness) actionPlanReadiness.dataset.readiness = actions ? "saved" : "empty";

    suppressDuplicateLockedActionCard();
  }

  function displayState(rawState) {
    return rawState === "due_soon" ? "soon" : rawState || "safe";
  }

  function updateStatePresentation() {
    const console = $("#statusConsole");
    if (!console) return;
    const state = displayState(console.dataset.state);
    document.body.dataset.switchState = state;

    $$("[data-track-stage]").forEach(item => item.classList.toggle("is-current", item.dataset.trackStage === state));

    const banner = $("#statePressureBanner");
    const eyebrow = $("#pressureEyebrow");
    const title = $("#pressureTitle");
    const copy = $("#pressureCopy");
    if (banner && eyebrow && title && copy) {
      const messages = {
        soon: ["DEADLINE APPROACHING", "Check in window closing", "The live server deadline is approaching. A verified check in resets the 72 hour window."],
        grace: ["GRACE PERIOD ACTIVE", "Required check in missed", "The primary deadline passed. The 24 hour grace countdown is now the controlling window."],
        triggered: ["TRIGGER STATE", "Grace period expired", "The server has entered trigger state. Automatic external delivery is still pending backend implementation."],
      };
      const message = messages[state];
      banner.hidden = !message;
      if (message) [eyebrow.textContent, title.textContent, copy.textContent] = message;
    }

    const seal = $("#packageSeal");
    if (seal) {
      const unlocked = document.body.classList.contains("operator-unlocked");
      seal.innerHTML = unlocked ? "<i></i>AUTHORIZED" : state === "triggered" ? "<i></i>ATTENTION" : "<i></i>SEALED";
    }
  }

  function updateAccessPresentation() {
    const unlocked = document.body.classList.contains("operator-unlocked");
    document.body.classList.toggle("private-access-active", unlocked);

    const accessButton = $("#operatorButton");
    if (accessButton) accessButton.textContent = unlocked ? "Access active" : "Access";
    const accessState = $("#operatorState");
    if (accessState) accessState.textContent = unlocked ? "AUTHORIZED" : "LOCKED";
    $$("[data-refine-gateway] .gateway-state").forEach(state => { state.textContent = unlocked ? "AUTHORIZED" : "SEALED"; });

    suppressDuplicateLockedActionCard();
    updateStatePresentation();
  }

  function watchDynamicNodes() {
    const sync = $("#syncState");
    if (sync) new MutationObserver(updateServerContinuity).observe(sync, { childList: true, characterData: true, subtree: true });

    const console = $("#statusConsole");
    if (console) new MutationObserver(updateStatePresentation).observe(console, { attributes: true, attributeFilter: ["data-state"] });

    let lastAccess = document.body.classList.contains("operator-unlocked");
    new MutationObserver(() => {
      const next = document.body.classList.contains("operator-unlocked");
      if (next === lastAccess) return;
      lastAccess = next;
      updateAccessPresentation();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    ["#documentPublicCount", "#contactPublicCount", "#organizationPublicCount", "#actionPublicCount"].forEach(selector => {
      const node = $(selector);
      if (node) new MutationObserver(updateCounts).observe(node, { childList: true, characterData: true, subtree: true });
    });

    const actionsList = $("#actionsList");
    if (actionsList) new MutationObserver(suppressDuplicateLockedActionCard).observe(actionsList, { childList: true, subtree: false });

    const dynamicCopy = ["#checkinButtonHint", "#authError", "#toast", "#operatorSessionStrip"]
      .concat(["#operatorState"])
      .map(selector => $(selector))
      .filter(Boolean);
    dynamicCopy.forEach(node => {
      new MutationObserver(normalizeStaticCopy).observe(node, { childList: true, characterData: true, subtree: true });
    });
  }

  function boot() {
    hideLegacyNavigation();
    normalizeStaticCopy();
    trimOverview();
    ensurePressureBanner();
    ensureServerContinuity();
    ensureProtectedPackage();
    ensureDeadlineOverview();
    ensureProtectedGateways();
    ensureActionIntegrity();
    ensureActionSequenceHeading();
    updateCounts();
    updateServerContinuity();
    updateAccessPresentation();
    watchDynamicNodes();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();