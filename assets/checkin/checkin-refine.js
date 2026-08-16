(() => {
  "use strict";

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

  function normalizeVisibleCopy(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (isUserContent(node)) return;
      let next = node.nodeValue;
      COPY_REPLACEMENTS.forEach(([pattern, replacement]) => { next = next.replace(pattern, replacement); });
      if (next !== node.nodeValue) node.nodeValue = next;
    });
  }

  function clickView(view) {
    const target = document.querySelector(`[data-view="${view}"]`);
    if (target) target.click();
  }

  function makeButton(label, view, className = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", () => clickView(view));
    return button;
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
    const dashboard = overview.querySelector(".dashboard-grid");
    dashboard?.insertAdjacentElement("afterend", section);
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
    section.querySelector(".deadline-overview-head").append(makeButton("View deadline sequence", "timeline", "deadline-link"));
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
    section.querySelector(".gateway-unlock").addEventListener("click", () => $("#operatorButton")?.click());
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
    if (activity && !activity.querySelector('.protected-access-gateway[data-gateway="activity"]')) {
      activity.querySelector(".view-heading")?.insertAdjacentElement("afterend", gatewayMarkup("activity", "Private activity log", "Audit history is restricted. Authorization is required to review protected events and timestamps."));
    }
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

  function suppressLegacyPresentation() {
    const oldActivityGateway = $('[data-view-panel="activity"] .access-gateway[data-gateway="activity"]');
    if (oldActivityGateway) oldActivityGateway.hidden = true;
    const simulate = $("#simulateButton");
    if (simulate) simulate.hidden = true;
  }

  function updateStatePresentation() {
    const console = $("#statusConsole");
    if (!console) return;
    const state = console.dataset.state || "safe";
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
    const lockButton = $("#operatorButton");
    if (lockButton) lockButton.textContent = unlocked ? "Private access active" : "Private access";
    const operatorState = $("#operatorState");
    if (operatorState) operatorState.textContent = unlocked ? "AUTHORIZED" : "LOCKED";
    trimQuickPanel();
    updateStatePresentation();
  }

  function hidePublicCounts() {
    ["#recordNavCount", "#actionNavCount", "#documentPublicCount", "#contactPublicCount", "#organizationPublicCount", "#updatePublicCount", "#actionPublicCount"].forEach(selector => {
      const element = $(selector);
      if (element) element.setAttribute("aria-hidden", "true");
    });
  }

  function init() {
    ensurePressureBanner();
    ensureProtectedPackage();
    ensureDeadlineOverview();
    ensureGateways();
    trimQuickPanel();
    hidePublicCounts();
    suppressLegacyPresentation();
    normalizeVisibleCopy();
    updateAuthorizationPresentation();

    const observer = new MutationObserver(mutations => {
      let stateChanged = false;
      let authChanged = false;
      mutations.forEach(mutation => {
        if (mutation.target === $("#statusConsole") && mutation.attributeName === "data-state") stateChanged = true;
        if (mutation.target === document.body && mutation.attributeName === "class") authChanged = true;
      });
      suppressLegacyPresentation();
      normalizeVisibleCopy();
      trimQuickPanel();
      if (authChanged) updateAuthorizationPresentation();
      if (stateChanged) updateStatePresentation();
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class", "data-state"] });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();