(() => {
  "use strict";

  /*
   * FRONTEND / BACKEND HANDOFF
   * --------------------------
   * This file is presentation only. It must not calculate an authoritative
   * trigger, execute an action, release a record, or imply delivery succeeded.
   * The prepared post-trigger lifecycle below is intentionally display-only.
   * Backend work needed before those controls can become active is documented in:
   *   CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-NEXT.md
   *
   * Keep public quantities and private contents sealed. The existing FastAPI
   * service remains authoritative for state, timestamps, authentication, CSRF,
   * Origin checks, records, action configuration and audit data.
   */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const COPY_REPLACEMENTS = [
    [/\bOperator authorized\b/gi, "Private access active"],
    [/\bOperator unlock\b/gi, "Private access"],
    [/\bOperator authorization required\b/gi, "Private access required"],
    [/An authorized operator can record proof of life\./gi, "Authorization is required to record proof of life."],
    [/Operator session expired/gi, "Private session expired"],
    [/Operator key was not accepted/gi, "Access key was not accepted"],
    [/\bOperator session\b/gi, "Private session"],
    [/\bOperator key\b/gi, "Access key"],
    [/\bProtected operator access\b/gi, "Protected access"],
    [/\bOPERATOR AUTHORIZED\b/g, "PRIVATE ACCESS ACTIVE"],
    [/\bOPERATOR SESSION\b/g, "PRIVATE SESSION"],
    [/\bOPERATOR\b/g, "PRIVATE ACCESS"],
    [/15-minute/gi, "15 minute"],
    [/72-hour/gi, "72 hour"],
    [/24-hour/gi, "24 hour"],
    [/proof-of-life/gi, "proof of life"],
    [/check-in/gi, "check in"],
    [/Sealed and synchronized\. The current proof of life window is valid\./gi, "Sealed and synchronized."],
    [/The current proof of life window is valid\./gi, ""],
    [/\boperator\b/gi, "private access"],
  ];

  function isUserContent(node) {
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return Boolean(element?.closest("#richEditor, #updateMarkdown, input, textarea, [contenteditable='true']"));
  }

  function cleanText(value = "") {
    return COPY_REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
  }

  function normalizeTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE || isUserContent(node)) return;
    const next = cleanText(node.nodeValue || "");
    if (next !== node.nodeValue) node.nodeValue = next;
  }

  function normalizeVisibleCopy(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      normalizeTextNode(root);
      return;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) normalizeTextNode(walker.currentNode);
  }

  function clickView(view) {
    document.querySelector(`[data-view="${view}"]`)?.click();
  }

  function makeButton(label, view, className = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", () => clickView(view));
    return button;
  }

  function cleanOverviewHeading() {
    const heading = $('[data-view-panel="overview"] > .compact-heading');
    const eyebrow = heading?.querySelector(".eyebrow");
    if (eyebrow) eyebrow.remove();
  }

  function ensurePressureBanner() {
    const overview = $('[data-view-panel="overview"]');
    if (!overview || $("#statePressureBanner")) return;
    const banner = document.createElement("section");
    banner.id = "statePressureBanner";
    banner.className = "state-pressure-banner";
    banner.hidden = true;
    banner.innerHTML = '<span class="pressure-mark" aria-hidden="true">!</span><div><small id="pressureEyebrow">ATTENTION</small><strong id="pressureTitle">Check in required</strong><p id="pressureCopy"></p></div>';
    overview.insertBefore(banner, $("#statusConsole")?.closest(".dashboard-grid") || overview.firstChild);
  }

  function ensureProtectedPackage() {
    const overview = $('[data-view-panel="overview"]');
    if (!overview || $("#protectedPackage")) return;
    const section = document.createElement("section");
    section.id = "protectedPackage";
    section.className = "protected-package";
    section.innerHTML = `
      <div class="protected-package-head">
        <div><small>PROTECTED PACKAGE</small><h2>Contingency archive</h2><p>Protected records and contingency controls remain inaccessible while the switch is secured.</p></div>
        <span class="package-seal" id="packageSeal"><i></i>SEALED</span>
      </div>
      <div class="package-grid">
        <button type="button" class="package-card" data-package-view="records"><span class="package-icon" aria-hidden="true">▱</span><strong>Documents</strong><small>SEALED</small></button>
        <button type="button" class="package-card" data-package-view="records"><span class="package-icon" aria-hidden="true">◎</span><strong>Contacts</strong><small>SEALED</small></button>
        <button type="button" class="package-card" data-package-view="records"><span class="package-icon" aria-hidden="true">▦</span><strong>Organizations</strong><small>SEALED</small></button>
        <button type="button" class="package-card package-card-action" data-package-view="actions"><span class="package-icon" aria-hidden="true">↯</span><strong>Contingency actions</strong><small>PROTECTED</small></button>
      </div>`;
    section.querySelectorAll("[data-package-view]").forEach(button => button.addEventListener("click", () => clickView(button.dataset.packageView)));
    overview.querySelector(".dashboard-grid")?.insertAdjacentElement("afterend", section);
  }

  function ensureDeadlineOverview() {
    const overview = $('[data-view-panel="overview"]');
    if (!overview || $("#deadlineOverview")) return;
    const section = document.createElement("section");
    section.id = "deadlineOverview";
    section.className = "deadline-overview";
    section.innerHTML = `
      <div class="deadline-overview-head"><div><small>DEADLINE SEQUENCE</small><h2>Current window</h2></div></div>
      <div class="deadline-track" aria-label="Dead man switch state progression">
        <span data-track-stage="safe"><i></i><strong>Safe</strong><small>Current window</small></span>
        <span data-track-stage="soon"><i></i><strong>Due soon</strong><small>Deadline approaching</small></span>
        <span data-track-stage="grace"><i></i><strong>Grace</strong><small>Deadline missed</small></span>
        <span data-track-stage="triggered"><i></i><strong>Trigger state</strong><small>Grace expired</small></span>
      </div>`;
    section.querySelector(".deadline-overview-head")?.append(makeButton("Open timeline", "timeline", "deadline-link"));
    $("#protectedPackage")?.insertAdjacentElement("afterend", section);
  }

  function gatewayMarkup(kind, title, copy) {
    const section = document.createElement("section");
    section.className = `protected-access-gateway protected-access-${kind}`;
    section.dataset.gateway = kind;
    section.innerHTML = `
      <div class="gateway-visual" aria-hidden="true"><span></span><i></i></div>
      <p class="gateway-eyebrow">PROTECTED ACCESS</p>
      <h2>${title}</h2>
      <p>${copy}</p>
      <button type="button" class="gateway-unlock">Unlock protected controls</button>
      <small>Authorization is required to view protected contents.</small>`;
    section.querySelector(".gateway-unlock")?.addEventListener("click", () => $("#operatorButton")?.click());
    return section;
  }

  function ensureGateways() {
    const records = $('[data-view-panel="records"]');
    if (records && !records.querySelector('[data-gateway="records"]')) {
      records.querySelector(".view-heading")?.insertAdjacentElement("afterend", gatewayMarkup("records", "Protected records", "This archive contains restricted contingency records. Contents and quantities are withheld until authorization."));
    }
    const actions = $('[data-view-panel="actions"]');
    if (actions && !actions.querySelector('[data-gateway="actions"]')) {
      actions.querySelector(".view-heading")?.insertAdjacentElement("afterend", gatewayMarkup("actions", "Contingency actions", "Contingency action details are protected. Sequence contents remain sealed until authorization."));
    }
    const activity = $('[data-view-panel="activity"]');
    if (activity && !activity.querySelector('[data-gateway="activity"]')) {
      activity.querySelector(".view-heading")?.insertAdjacentElement("afterend", gatewayMarkup("activity", "Private activity log", "Audit history is restricted. Authorization is required to review protected events and timestamps."));
    }
  }

  function ensureTriggerLifecycle() {
    const actions = $('[data-view-panel="actions"]');
    if (!actions || $("#triggerLifecycle")) return;

    /*
     * BACKEND TODO: this is a prepared shell only. Before enabling any control,
     * FastAPI needs an authoritative execution run model, action-attempt states,
     * atomic claiming/idempotency, retry policy, delivery receipts, cancellation /
     * recovery semantics and audit events. The browser must never advance these
     * stages by itself.
     */
    const section = document.createElement("section");
    section.id = "triggerLifecycle";
    section.className = "trigger-lifecycle operator-only";
    section.dataset.backendRequired = "true";
    section.innerHTML = `
      <div class="trigger-lifecycle-head">
        <div><small>TRIGGER RESPONSE</small><h2>Post trigger lifecycle</h2><p>The interface is prepared for the execution service. External actions are not connected yet.</p></div>
        <span>BACKEND REQUIRED</span>
      </div>
      <div class="trigger-lifecycle-track" aria-label="Planned post trigger lifecycle">
        <article><b>01</b><strong>Trigger confirmed</strong><small>Server state</small></article>
        <article><b>02</b><strong>Preflight</strong><small>Validate protected inputs</small></article>
        <article><b>03</b><strong>Action queue</strong><small>Claim ordered work</small></article>
        <article><b>04</b><strong>Delivery</strong><small>Attempt configured actions</small></article>
        <article><b>05</b><strong>Audit</strong><small>Record final outcomes</small></article>
      </div>
      <div class="trigger-lifecycle-controls" aria-label="Planned emergency controls">
        <button type="button" disabled>Pause sequence</button>
        <button type="button" disabled>Cancel pending</button>
        <button type="button" disabled>Recover switch</button>
      </div>`;
    actions.querySelector(".view-heading")?.insertAdjacentElement("afterend", section);
  }

  function trimQuickPanel() {
    $$(".quick-panel .quick-row").forEach(row => {
      const label = row.querySelector("span")?.textContent.trim().toLowerCase();
      const alwaysHide = ["schedule", "grace period", "records", "trigger actions"].includes(label);
      const sessionExpiryHidden = label === "session expiry" && !document.body.classList.contains("operator-unlocked");
      row.classList.toggle("refine-hidden-row", alwaysHide || sessionExpiryHidden);
    });
    const title = $(".quick-panel .panel-title > span");
    if (title) title.textContent = "SYSTEM INTEGRITY";
  }

  function suppressLegacyControls() {
    const simulate = $("#simulateButton");
    if (simulate) simulate.hidden = true;
  }

  function displayState(rawState) {
    return rawState === "due_soon" ? "soon" : rawState || "safe";
  }

  function updateStatePresentation() {
    const console = $("#statusConsole");
    if (!console) return;
    const state = displayState(console.dataset.state);
    document.body.dataset.switchState = state;

    if (state === "safe" && $("#statusCopy")) $("#statusCopy").textContent = "Sealed and synchronized.";
    $$("[data-track-stage]").forEach(item => item.classList.toggle("is-current", item.dataset.trackStage === state));

    const banner = $("#statePressureBanner");
    const eyebrow = $("#pressureEyebrow");
    const title = $("#pressureTitle");
    const copy = $("#pressureCopy");
    if (banner && eyebrow && title && copy) {
      const messages = {
        soon: ["DEADLINE APPROACHING", "Check in window closing", "The current window is nearing its deadline. A verified check in will reset the countdown."],
        grace: ["GRACE PERIOD ACTIVE", "Required check in missed", "The primary deadline has passed. The grace countdown is now the controlling time boundary."],
        triggered: ["TRIGGER STATE", "Grace period expired", "The switch has entered trigger state. Protected contingency controls require immediate attention."],
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

  function updateAuthorizationPresentation() {
    const unlocked = document.body.classList.contains("operator-unlocked");
    document.body.classList.toggle("private-access-active", unlocked);
    const actionCount = Number($("#actionPublicCount")?.textContent || 0);

    $$(".package-card small").forEach(label => {
      if (unlocked) label.textContent = "AUTHORIZED";
      else if (label.closest(".package-card")?.classList.contains("package-card-action")) label.textContent = actionCount > 0 ? "CONFIGURED" : "PROTECTED";
      else label.textContent = "SEALED";
    });

    const accessButton = $("#operatorButton");
    if (accessButton) accessButton.textContent = unlocked ? "Access active" : "Access";
    const accessState = $("#operatorState");
    if (accessState) accessState.textContent = unlocked ? "AUTHORIZED" : "LOCKED";
    trimQuickPanel();
    updateStatePresentation();
  }

  function hidePublicCounts() {
    ["#recordNavCount", "#actionNavCount", "#documentPublicCount", "#contactPublicCount", "#organizationPublicCount", "#updatePublicCount", "#actionPublicCount"].forEach(selector => {
      const element = $(selector);
      if (element) element.setAttribute("aria-hidden", "true");
    });
  }

  function watchSmallDynamicCopy() {
    const targets = ["#statusCopy", "#checkinButtonHint", "#authError", "#toast", "#operatorSessionStrip"]
      .map(selector => $(selector))
      .filter(Boolean);
    if (!targets.length) return;

    const observer = new MutationObserver(mutations => {
      const roots = new Set();
      mutations.forEach(mutation => {
        const root = mutation.target.nodeType === Node.TEXT_NODE ? mutation.target.parentElement : mutation.target;
        if (root) roots.add(root);
      });
      roots.forEach(normalizeVisibleCopy);
      if ($("#statusConsole")?.dataset.state === "safe" && $("#statusCopy")) $("#statusCopy").textContent = "Sealed and synchronized.";
    });
    targets.forEach(target => observer.observe(target, { subtree: true, childList: true, characterData: true }));
  }

  function watchStateAndAccess() {
    const console = $("#statusConsole");
    if (console) {
      new MutationObserver(updateStatePresentation).observe(console, { attributes: true, attributeFilter: ["data-state"] });
    }

    let lastAccess = document.body.classList.contains("operator-unlocked");
    new MutationObserver(() => {
      const nextAccess = document.body.classList.contains("operator-unlocked");
      if (nextAccess === lastAccess) return;
      lastAccess = nextAccess;
      updateAuthorizationPresentation();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    const actionCount = $("#actionPublicCount");
    if (actionCount) {
      new MutationObserver(updateAuthorizationPresentation).observe(actionCount, { subtree: true, childList: true, characterData: true });
    }
  }

  function init() {
    cleanOverviewHeading();
    ensurePressureBanner();
    ensureProtectedPackage();
    ensureDeadlineOverview();
    ensureGateways();
    ensureTriggerLifecycle();
    trimQuickPanel();
    hidePublicCounts();
    suppressLegacyControls();

    /* One initial copy pass is cheap. After boot we observe only small dynamic nodes. */
    normalizeVisibleCopy(document.body);
    updateAuthorizationPresentation();
    watchSmallDynamicCopy();
    watchStateAndAccess();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();