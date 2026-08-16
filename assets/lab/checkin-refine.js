(() => {
  "use strict";

  /*
   * /checkin presentation layer.
   * FastAPI remains authoritative for switch state, server time, access,
   * protected records, action configuration, and audit data.
   */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const isUnlocked = () => document.body.classList.contains("operator-unlocked");

  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }

  function openView(view) {
    const button = $(`.side-nav [data-view="${view}"]`) || $(`.mobile-nav [data-view="${view}"]`);
    button?.click();
  }

  function cleanNavigation() {
    const hiddenViews = new Set(["timeline", "updates"]);
    $$(".side-nav [data-view], .mobile-nav [data-view]").forEach(button => {
      if (hiddenViews.has(button.dataset.view)) button.hidden = true;
    });
    const settings = $("#mobileNavSettings");
    if (settings) settings.hidden = true;
  }

  function rewriteVisibleCopy() {
    const accessButton = $("#operatorButton");
    setText(accessButton, isUnlocked() ? "Access active" : "Access");

    setText($("#operatorSessionStrip strong"), "PRIVATE ACCESS ACTIVE");
    setText($("#operatorState"), isUnlocked() ? "AUTHORIZED" : "LOCKED");

    const hint = $("#checkinButtonHint");
    if (hint && /operator|authorization/i.test(hint.textContent || "")) setText(hint, "Private access required");

    $$(".quick-panel .quick-row").forEach(row => {
      const label = row.querySelector("span");
      if (label?.textContent.trim().toLowerCase() === "operator session") setText(label, "Private access");
    });

    [$("#authError"), $("#toast")].filter(Boolean).forEach(node => {
      const before = node.textContent || "";
      const after = before
        .replace(/Operator/gi, "Access")
        .replace(/15-minute/gi, "15 minute")
        .replace(/check-in/gi, "check in");
      if (after !== before) node.textContent = after;
    });
  }

  function ensureLiveStrip() {
    const console = $("#statusConsole");
    const head = console?.querySelector(".console-head");
    if (!console || !head || $("#liveStrip")) return;

    const strip = document.createElement("div");
    strip.id = "liveStrip";
    strip.className = "live-strip";
    strip.dataset.link = "connecting";
    strip.innerHTML = '<span><i></i><strong id="liveStripLabel">CONNECTING</strong></span><small id="liveStripMeta">SERVER CLOCK</small>';
    head.insertAdjacentElement("afterend", strip);
  }

  function updateLiveStrip() {
    const sync = ($("#syncState")?.textContent || "").trim().toUpperCase();
    const strip = $("#liveStrip");
    if (!strip) return;

    let link = "connecting";
    let label = "CONNECTING";
    let meta = "SERVER CLOCK";

    if (sync.includes("SYNCHRONIZED")) {
      link = "live";
      label = "LIVE";
      meta = "SERVER CLOCK";
    } else if (sync.includes("PARTIALLY")) {
      link = "limited";
      label = "LIMITED";
      meta = "SERVER STATUS";
    } else if (sync.includes("UNAVAILABLE")) {
      link = "offline";
      label = "LINK OFFLINE";
      meta = "STATUS UNVERIFIED";
    }

    strip.dataset.link = link;
    setText($("#liveStripLabel"), label);
    setText($("#liveStripMeta"), meta);
    const deadline = $("#deadlineReadiness");
    if (deadline) deadline.dataset.link = link;
    setText($("#deadlineReadinessState"), link === "live" ? "LIVE" : link === "offline" ? "OFFLINE" : link === "limited" ? "LIMITED" : "CONNECTING");
  }

  function ensurePressureBanner() {
    const overview = $('[data-view-panel="overview"]');
    if (!overview || $("#statePressureBanner")) return;
    const banner = document.createElement("section");
    banner.id = "statePressureBanner";
    banner.className = "state-pressure-banner";
    banner.hidden = true;
    banner.innerHTML = '<span class="pressure-mark">!</span><div><small id="pressureEyebrow"></small><strong id="pressureTitle"></strong><p id="pressureCopy"></p></div>';
    overview.querySelector(".dashboard-grid")?.insertAdjacentElement("beforebegin", banner);
  }

  function ensureProtectedPackage() {
    const overview = $('[data-view-panel="overview"]');
    const dashboard = overview?.querySelector(".dashboard-grid");
    if (!overview || !dashboard || $("#protectedPackage")) return;

    const section = document.createElement("section");
    section.id = "protectedPackage";
    section.className = "protected-package refine-card";
    section.innerHTML = `
      <div class="refine-head">
        <div><small>PROTECTED PACKAGE</small><h2>Records and actions</h2></div>
        <span class="seal-chip" id="packageSeal"><i></i>SEALED</span>
      </div>
      <div class="package-grid">
        <button type="button" class="package-card tone-blue" data-view-target="records"><span class="package-icon">▱</span><span><strong>Documents</strong><small><b id="packageDocumentCount">0</b> indexed</small></span></button>
        <button type="button" class="package-card tone-violet" data-view-target="records"><span class="package-icon">◎</span><span><strong>Contacts</strong><small><b id="packageContactCount">0</b> indexed</small></span></button>
        <button type="button" class="package-card tone-pink" data-view-target="records"><span class="package-icon">▦</span><span><strong>Organizations</strong><small><b id="packageOrganizationCount">0</b> indexed</small></span></button>
        <button type="button" class="package-card tone-mint" data-view-target="actions"><span class="package-icon">↯</span><span><strong>Actions</strong><small><b id="packageActionCount">0</b> configured</small></span></button>
      </div>`;

    section.querySelectorAll("[data-view-target]").forEach(button => button.addEventListener("click", () => openView(button.dataset.viewTarget)));
    dashboard.insertAdjacentElement("afterend", section);
  }

  function ensureDeadlineOverview() {
    const packageSection = $("#protectedPackage");
    if (!packageSection || $("#deadlineOverview")) return;

    const section = document.createElement("section");
    section.id = "deadlineOverview";
    section.className = "deadline-overview refine-card";
    section.innerHTML = `
      <div class="refine-head deadline-head">
        <div><small>DEADLINE</small><h2>Switch sequence</h2></div>
        <button type="button" id="openTimelineFromStatus">Timeline</button>
      </div>
      <div class="deadline-track">
        <span data-track-stage="safe"><i></i><strong>Safe</strong><small>72 hour window</small></span>
        <span data-track-stage="soon"><i></i><strong>Due soon</strong><small>Warning</small></span>
        <span data-track-stage="grace"><i></i><strong>Grace</strong><small>24 hours</small></span>
        <span data-track-stage="triggered"><i></i><strong>Trigger</strong><small>Grace expired</small></span>
      </div>`;
    packageSection.insertAdjacentElement("afterend", section);
    $("#openTimelineFromStatus")?.addEventListener("click", () => openView("timeline"));
  }

  function ensureProtectedGateways() {
    const definitions = {
      records: ["PROTECTED RECORDS", "Records", "Unlock to view documents, contacts, and organizations."],
      activity: ["PRIVATE AUDIT", "Activity", "Unlock to view protected event history."],
    };

    Object.entries(definitions).forEach(([view, [eyebrow, title, copy]]) => {
      const panel = $(`[data-view-panel="${view}"]`);
      if (!panel || panel.querySelector(`[data-refine-gateway="${view}"]`)) return;
      const gateway = document.createElement("section");
      gateway.className = "protected-gateway refine-card";
      gateway.dataset.refineGateway = view;
      gateway.innerHTML = `<span class="gateway-mark"><i></i><i></i><i></i></span><div><small>${eyebrow}</small><h2>${title}</h2><p>${copy}</p></div><button type="button">Unlock</button>`;
      gateway.querySelector("button")?.addEventListener("click", () => $("#operatorButton")?.click());
      panel.querySelector(".view-heading")?.insertAdjacentElement("afterend", gateway);
    });
  }

  function ensureActionWorkspace() {
    const panel = $('[data-view-panel="actions"]');
    const sequence = $("#publicActionSequence");
    if (!panel || !sequence || $("#actionWorkspace")) return;

    const workspace = document.createElement("section");
    workspace.id = "actionWorkspace";
    workspace.className = "action-workspace";
    workspace.innerHTML = `
      <div class="action-status-row">
        <span id="deadlineReadiness" data-link="connecting"><i></i><b>SWITCH</b><strong id="deadlineReadinessState">CONNECTING</strong></span>
        <span><i></i><b>CONFIG</b><strong id="actionPlanState">CHECKING</strong></span>
        <span class="is-pending"><i></i><b>DELIVERY</b><strong>PENDING</strong></span>
      </div>

      <section class="action-builder refine-card">
        <div class="refine-head">
          <div><small>ACTION BUILDER</small><h2>Create action</h2></div>
          <button type="button" id="actionBuilderAccess">Unlock</button>
        </div>
        <div class="action-type-grid" aria-label="Action types">
          <button type="button" class="action-type tone-blue" data-action-template="SMS"><i>SMS</i><strong>Send SMS</strong><small>Person or group</small></button>
          <button type="button" class="action-type tone-cyan" data-action-template="Email"><i>@</i><strong>Send email</strong><small>Person or organization</small></button>
          <button type="button" class="action-type tone-violet" data-action-template="AI Agent"><i>AI</i><strong>AI agent</strong><small>Run assigned task</small></button>
          <button type="button" class="action-type tone-pink" data-action-template="Publish"><i>WEB</i><strong>Publish web</strong><small>Page or account</small></button>
          <button type="button" class="action-type tone-coral" data-action-template="Privacy"><i>⌫</i><strong>Privacy cleanup</strong><small>Browser or account task</small></button>
          <button type="button" class="action-type tone-mint" data-action-template="Organization"><i>ORG</i><strong>Notify organization</strong><small>Contact or workflow</small></button>
        </div>
        <div class="action-compose-row">
          <span><small>SEND</small><strong id="composeType">Choose action</strong></span>
          <b>→</b>
          <span><small>TO</small><strong>Person / Organization</strong></span>
          <b>→</b>
          <span><small>WHEN</small><strong>Trigger + delay</strong></span>
          <b>→</b>
          <span><small>CONTENT</small><strong>Message / File / Task</strong></span>
        </div>
      </section>
    `;

    sequence.insertAdjacentElement("beforebegin", workspace);

    const unlock = () => {
      if (!isUnlocked()) {
        $("#operatorButton")?.click();
        return;
      }
      $("#actionForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    $("#actionBuilderAccess")?.addEventListener("click", unlock);
    workspace.querySelectorAll("[data-action-template]").forEach(button => {
      button.addEventListener("click", () => {
        setText($("#composeType"), button.dataset.actionTemplate);
        unlock();
      });
    });

    const head = document.createElement("div");
    head.id = "configuredSequenceHead";
    head.className = "configured-sequence-head";
    head.innerHTML = '<div><small>CONFIGURED SEQUENCE</small><strong id="configuredSequenceCount">0 actions</strong></div><span>SEALED</span>';
    sequence.insertAdjacentElement("beforebegin", head);
  }

  function readCount(selector) {
    const value = Number($(selector)?.textContent);
    return Number.isInteger(value) && value >= 0 ? value : 0;
  }

  function updateCounts() {
    const counts = {
      packageDocumentCount: readCount("#documentPublicCount"),
      packageContactCount: readCount("#contactPublicCount"),
      packageOrganizationCount: readCount("#organizationPublicCount"),
      packageActionCount: readCount("#actionPublicCount"),
    };

    Object.entries(counts).forEach(([id, value]) => setText(document.getElementById(id), String(value)));

    const actions = counts.packageActionCount;
    setText($("#configuredSequenceCount"), `${actions} action${actions === 1 ? "" : "s"}`);
    setText($("#actionPlanState"), actions ? "SAVED" : "EMPTY");
  }

  function stateName(value) {
    return value === "due_soon" ? "soon" : value || "safe";
  }

  function updateState() {
    const state = stateName($("#statusConsole")?.dataset.state);
    document.body.dataset.switchState = state;
    $$("[data-track-stage]").forEach(item => item.classList.toggle("is-current", item.dataset.trackStage === state));

    const banner = $("#statePressureBanner");
    const messages = {
      soon: ["DUE SOON", "Check in window closing", "A verified check in resets the 72 hour window."],
      grace: ["GRACE ACTIVE", "Primary deadline missed", "The 24 hour grace window is active."],
      triggered: ["TRIGGER STATE", "Grace expired", "The switch reached trigger state."],
    };
    const message = messages[state];
    if (banner) banner.hidden = !message;
    if (message) {
      setText($("#pressureEyebrow"), message[0]);
      setText($("#pressureTitle"), message[1]);
      setText($("#pressureCopy"), message[2]);
    }

    const seal = $("#packageSeal");
    if (seal) seal.innerHTML = isUnlocked() ? "<i></i>AUTHORIZED" : state === "triggered" ? "<i></i>ATTENTION" : "<i></i>SEALED";
  }

  function updateAccess() {
    document.body.classList.toggle("private-access-active", isUnlocked());
    rewriteVisibleCopy();
    updateState();
  }

  function hideDuplicateLockedCards() {
    if (isUnlocked()) return;
    $$("#actionsList .locked-card").forEach(card => { card.hidden = true; });
  }

  function observe() {
    const sync = $("#syncState");
    if (sync) new MutationObserver(updateLiveStrip).observe(sync, { childList: true, characterData: true, subtree: true });

    const statusConsole = $("#statusConsole");
    if (statusConsole) new MutationObserver(updateState).observe(statusConsole, { attributes: true, attributeFilter: ["data-state"] });

    let lastAccess = isUnlocked();
    new MutationObserver(() => {
      const next = isUnlocked();
      if (next === lastAccess) return;
      lastAccess = next;
      updateAccess();
      hideDuplicateLockedCards();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    ["#documentPublicCount", "#contactPublicCount", "#organizationPublicCount", "#actionPublicCount"].forEach(selector => {
      const node = $(selector);
      if (node) new MutationObserver(updateCounts).observe(node, { childList: true, characterData: true, subtree: true });
    });

    const actions = $("#actionsList");
    if (actions) new MutationObserver(hideDuplicateLockedCards).observe(actions, { childList: true });

    ["#checkinButtonHint", "#authError", "#toast"].forEach(selector => {
      const node = $(selector);
      if (!node) return;
      new MutationObserver(rewriteVisibleCopy).observe(node, { childList: true, characterData: true, subtree: true });
    });
  }

  function boot() {
    cleanNavigation();
    rewriteVisibleCopy();
    ensurePressureBanner();
    ensureLiveStrip();
    ensureProtectedPackage();
    ensureDeadlineOverview();
    ensureProtectedGateways();
    ensureActionWorkspace();
    updateCounts();
    updateLiveStrip();
    updateAccess();
    hideDuplicateLockedCards();
    observe();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
