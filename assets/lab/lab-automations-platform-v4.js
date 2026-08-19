(() => {
  "use strict";

  const AUTOMATIONS_KEY = "cmx-lab-automations-v1";
  const ACTIONS_KEY = "cmx-lab-actions-v1";
  const PLATFORM_KEY = "cmx-lab-automations-platform-v4";

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));

  const CAPABILITIES = Object.freeze([
    { id: "trigger.grace_start", kind: "trigger", category: "Check In", label: "Grace begins", description: "Start when the protected Check In window enters grace.", state: "lab", proxy: "grace_start" },
    { id: "trigger.grace_expiry", kind: "trigger", category: "Check In", label: "Grace expires", description: "Start when the authoritative grace boundary expires.", state: "lab", proxy: "grace_expiry" },
    { id: "trigger.manual", kind: "trigger", category: "Manual", label: "Manual start", description: "Start from an authorized manual decision.", state: "lab", proxy: "manual" },
    { id: "trigger.calendar", kind: "trigger", category: "Time", label: "Calendar time", description: "Start from a scheduled calendar rule.", state: "lab", proxy: "calendar" },
    { id: "trigger.email_received", kind: "trigger", category: "Messages", label: "Email received", description: "React to a normalized inbound email event from an approved Connection.", state: "later" },
    { id: "trigger.reply_received", kind: "trigger", category: "Messages", label: "Reply received", description: "React to a verified reply correlated to a prior communication.", state: "later" },
    { id: "trigger.directory_changed", kind: "trigger", category: "People", label: "Directory record changes", description: "React to a supported Person or Organization change.", state: "later" },
    { id: "trigger.library_version", kind: "trigger", category: "Library", label: "New saved version", description: "React when approved content gains a new immutable version.", state: "later" },
    { id: "trigger.automation_called", kind: "trigger", category: "Workflow", label: "Called by another Automation", description: "Start as a reusable subflow from another published workflow.", state: "later" },

    { id: "condition.not_acknowledged", kind: "condition", category: "Check In", label: "Not acknowledged", description: "Continue while the expected acknowledgement is still missing.", state: "lab", proxy: "not_acknowledged" },
    { id: "condition.switch_in_grace", kind: "condition", category: "Check In", label: "Still in grace", description: "Continue only while the protected switch remains in grace.", state: "lab", proxy: "switch_in_grace" },
    { id: "condition.previous_failed", kind: "condition", category: "Workflow", label: "Earlier action failed", description: "Continue based on a typed failure outcome from an earlier step.", state: "lab", proxy: "previous_failed" },
    { id: "condition.person_in_group", kind: "condition", category: "People", label: "Person is in group", description: "Evaluate current authorized Directory membership.", state: "later" },
    { id: "condition.value_matches", kind: "condition", category: "Data", label: "Previous value matches", description: "Compare a typed output from an earlier step to an approved value.", state: "later" },
    { id: "condition.time_window", kind: "condition", category: "Time", label: "Inside time window", description: "Continue only during an approved local time window.", state: "later" },

    { id: "action.notify", kind: "action", category: "Communicate", label: "Notify a person", description: "Create a protected notification step for a selected target.", state: "lab", proxy: "notify" },
    { id: "action.email", kind: "action", category: "Communicate", label: "Send email", description: "Configure an email step. Lab does not send anything.", state: "lab", proxy: "email" },
    { id: "action.ai_task", kind: "action", category: "AI", label: "AI task", description: "Describe a bounded AI task using approved context and tools.", state: "lab", proxy: "ai_task" },
    { id: "action.manual_review", kind: "action", category: "Control", label: "Manual review", description: "Pause the intended path for a human decision.", state: "lab", proxy: "manual_review" },
    { id: "action.discord", kind: "action", category: "Communicate", label: "Send Discord message", description: "Send through an approved Discord Connection and sender identity.", state: "later" },
    { id: "action.sms", kind: "action", category: "Communicate", label: "Send SMS", description: "Send through an approved messaging Connection with frozen recipients.", state: "later" },
    { id: "action.ack", kind: "action", category: "Communicate", label: "Request acknowledgement", description: "Ask a protected audience to explicitly acknowledge receipt.", state: "later" },
    { id: "action.library_document", kind: "action", category: "Library", label: "Create Library document", description: "Create protected content through the Library service.", state: "later" },
    { id: "action.library_save", kind: "action", category: "Library", label: "Save information", description: "Persist approved normalized information with provenance.", state: "later" },
    { id: "action.directory_label", kind: "action", category: "People", label: "Add Directory label", description: "Apply a descriptive label through typed Directory services.", state: "later" },
    { id: "action.approval", kind: "action", category: "Control", label: "Request approval", description: "Require a bounded approval before a consequential step proceeds.", state: "later" },
    { id: "action.webhook", kind: "action", category: "Connected apps", label: "Call approved webhook", description: "Call a constrained endpoint through an approved Connection.", state: "later" },
    { id: "action.http", kind: "action", category: "Advanced", label: "HTTP / API request", description: "Use a constrained HTTP capability with host, secret, timeout and authority controls.", state: "later" },

    { id: "workflow.wait", kind: "workflow", category: "Workflow", label: "Wait", description: "Persist a due time between two individual actions.", state: "later" },
    { id: "workflow.branch", kind: "workflow", category: "Workflow", label: "Branch", description: "Route into typed paths based on supported conditions.", state: "later" },
    { id: "workflow.subflow", kind: "workflow", category: "Workflow", label: "Run reusable Automation", description: "Invoke a published reusable subflow under the same authority boundary.", state: "later" }
  ]);

  const SURFACES = [
    { id: "automations", label: "Automations" },
    { id: "templates", label: "Templates" },
    { id: "runs", label: "Runs", future: true }
  ];

  let surface = "automations";
  let searchText = "";
  let queued = false;
  let bypassNewIntercept = false;
  let modal = null;

  window.CMXAutomationCapabilityCatalog = CAPABILITIES;

  function readStore(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
  }

  function countAutomations() {
    const store = readStore(AUTOMATIONS_KEY);
    return Array.isArray(store?.automations) ? store.automations.length : 0;
  }

  function countSavedActions() {
    const store = readStore(ACTIONS_KEY);
    return Array.isArray(store?.actions) ? store.actions.length : 0;
  }

  function statusLabel(state) {
    if (state === "lab") return "LAB NOW";
    if (state === "backend") return "BACKEND READY";
    return "LATER";
  }

  function statusClass(state) {
    if (state === "lab") return "is-now";
    if (state === "backend") return "is-ready";
    return "is-later";
  }

  function dashboardNav() {
    return `<div class="v4-workspace-nav" role="navigation" aria-label="Automation workspace views">
      <div class="v4-workspace-tabs">${SURFACES.map(item => `<button type="button" class="${surface === item.id ? "is-active" : ""}" data-v4-surface="${item.id}"><span>${item.label}</span>${item.future ? `<small>PREVIEW</small>` : ""}</button>`).join("")}</div>
      <div class="v4-workspace-tools">
        <label class="v4-search"><span>Search Automations</span><input type="search" value="${esc(searchText)}" data-v4-dashboard-search placeholder="Search workflows…"></label>
        <button type="button" class="v4-catalog-button" data-v4-open-catalog="all">Capabilities <b>${CAPABILITIES.length}</b></button>
      </div>
    </div>`;
  }

  function ensureDashboardNav(dashboard) {
    let nav = dashboard.querySelector(".v4-workspace-nav");
    if (!nav) {
      const hero = dashboard.querySelector(".v3-hero");
      if (!hero) return;
      hero.insertAdjacentHTML("afterend", dashboardNav());
      nav = dashboard.querySelector(".v4-workspace-nav");
    }
    nav.querySelectorAll("[data-v4-surface]").forEach(button => button.classList.toggle("is-active", button.dataset.v4Surface === surface));
    const input = nav.querySelector("[data-v4-dashboard-search]");
    if (input && input.value !== searchText) input.value = searchText;
  }

  function ensureCommandDeck(dashboard) {
    const deck = dashboard.querySelector(".v3-system-deck");
    if (!deck || deck.dataset.v4Deck === "ready") return;
    const stats = [...deck.querySelectorAll(".v3-system-stat")];
    stats.forEach(stat => stat.classList.add("v4-command-stat"));
    deck.dataset.v4Deck = "ready";
  }

  function ensureRunsPanel(dashboard) {
    let panel = dashboard.querySelector(".v4-runs-panel");
    if (!panel) {
      panel = document.createElement("section");
      panel.className = "v4-runs-panel";
      panel.innerHTML = `<div class="v4-runs-head"><div><span>RUN HISTORY</span><h2>Execution will live here.</h2><p>Lab simulations are intentionally separate from authoritative Runtime Runs. Once Runtime exists, this surface can show occurrences, attempts, waits, outputs and failures step by step.</p></div><span class="v4-runtime-off"><i></i> RUNTIME OFF</span></div>
        <div class="v4-run-preview" aria-label="Future Runtime preview">
          <div><span>08:00:00</span><b>WHEN</b><strong>Trigger received</strong><small>Future server event</small></div>
          <div><span>08:00:01</span><b>IF</b><strong>Rules evaluated</strong><small>Typed conditions</small></div>
          <div><span>08:00:02</span><b>DO</b><strong>Action attempt</strong><small>Provider or domain service</small></div>
          <div><span>08:00:03</span><b>DONE</b><strong>Result recorded</strong><small>Immutable execution history</small></div>
        </div>`;
      dashboard.append(panel);
    }
    return panel;
  }

  function ensureTemplateIntro(dashboard) {
    const section = dashboard.querySelector(".v3-template-section");
    if (!section || section.querySelector(".v4-template-intro")) return;
    const intro = document.createElement("div");
    intro.className = "v4-template-intro";
    intro.innerHTML = `<div><span>SCENARIOS</span><strong>Start with intent, then change anything.</strong><p>Templates create ordinary editable Drafts. They are combinations of the same Trigger, Rule, Action and Timing pieces used everywhere else.</p></div><button type="button" data-v4-open-catalog="all">Browse capability catalog</button>`;
    section.prepend(intro);
  }

  function applyDashboardSurface(dashboard) {
    const deck = dashboard.querySelector(".v3-system-deck");
    const heading = dashboard.querySelector(".v3-system-section-head");
    const bar = dashboard.querySelector(".v3-dashboard-bar");
    const drafts = dashboard.querySelector(".v3-drafts");
    const templates = dashboard.querySelector(".v3-template-section");
    const runs = ensureRunsPanel(dashboard);

    [deck, heading, bar, drafts, templates, runs].forEach(node => { if (node) node.hidden = true; });

    if (surface === "automations") {
      [deck, heading, bar, drafts].forEach(node => { if (node) node.hidden = false; });
    } else if (surface === "templates") {
      if (templates) templates.hidden = false;
    } else if (surface === "runs") {
      if (runs) runs.hidden = false;
    }

    const search = dashboard.querySelector(".v4-search");
    if (search) search.hidden = surface !== "automations";
    filterAutomationCards(dashboard);
  }

  function filterAutomationCards(dashboard) {
    const q = searchText.trim().toLowerCase();
    dashboard.querySelectorAll(".v3-automation-card").forEach(card => {
      card.hidden = Boolean(q) && !card.textContent.toLowerCase().includes(q);
    });
  }

  function patchDashboard() {
    const dashboard = document.querySelector(".v3-dashboard");
    if (!dashboard) return false;
    dashboard.dataset.platformV4 = "ready";
    ensureDashboardNav(dashboard);
    ensureCommandDeck(dashboard);
    ensureTemplateIntro(dashboard);
    applyDashboardSurface(dashboard);

    const hero = dashboard.querySelector(".v3-hero");
    if (hero) {
      const title = hero.querySelector("h1");
      const copy = hero.querySelector("p");
      const button = hero.querySelector("[data-new]");
      if (title) title.textContent = "Automations";
      if (copy) copy.textContent = "Build workflows from protected people, information, timing and approved capabilities. Start simple, then add depth only when the flow needs it.";
      if (button) button.textContent = "＋ New automation";
    }

    const heading = dashboard.querySelector(".v3-system-section-head");
    if (heading) {
      const label = heading.querySelector("span");
      const hint = heading.querySelector(":scope > small");
      if (label) label.textContent = "YOUR AUTOMATIONS";
      if (hint) hint.textContent = "Open a workflow to edit its actual flow.";
    }
    document.documentElement.dataset.labAutomationsPlatform = "v4";
    return true;
  }

  function stageIndex() {
    const current = document.querySelector(".v3-stage-rail [data-stage].is-current");
    return Number(current?.dataset.stage || 0);
  }

  function flowStage(node) {
    const key = node.querySelector(":scope > span")?.textContent.trim().toUpperCase() || "";
    if (key.startsWith("WHEN")) return 0;
    if (key.startsWith("IF")) return 1;
    if (key.startsWith("DO")) return 2;
    if (key.startsWith("WAIT")) return 3;
    if (key.startsWith("FINISH")) return 4;
    return null;
  }

  function patchFlowNavigator(page) {
    page.querySelectorAll(".v3-flow-node").forEach(node => {
      const target = flowStage(node);
      if (target === null) return;
      node.dataset.v4FlowStage = String(target);
      node.setAttribute("role", "button");
      node.setAttribute("tabindex", "0");
      node.setAttribute("aria-label", `Open ${node.querySelector(":scope > span")?.textContent.trim() || "workflow"} configuration`);
      if (!node.querySelector(".v4-flow-open")) node.insertAdjacentHTML("beforeend", `<i class="v4-flow-open" aria-hidden="true">›</i>`);
    });
  }

  function stageTestCopy(index) {
    if (index === 0) return { title: "Trigger sample accepted", body: "The Lab can walk a sample event through this Trigger definition. No external event source was contacted." };
    if (index === 1) return { title: "Rule check simulated", body: "Current Draft rules were treated as local typed conditions. No production eligibility decision was made." };
    if (index === 2) return { title: "Action stack inspected", body: "The Lab can resolve the visible steps and protected target references for simulation. No provider or external side effect ran." };
    if (index === 3) return { title: "Timing interpreted", body: "The configured start policy and recurrence were interpreted locally. The browser never becomes an authoritative scheduler." };
    return { title: "Use the full preflight below", body: "Review combines definition checks with the complete safe flow simulation. Runtime and provider execution remain off." };
  }

  function ensureStageTools(page) {
    const section = page.querySelector(".v3-stage-section");
    if (!section || section.querySelector(".v4-stage-tools")) return;
    const index = stageIndex();
    const kind = index === 0 ? "trigger" : index === 1 ? "condition" : index === 2 ? "action" : "all";
    const tools = document.createElement("div");
    tools.className = "v4-stage-tools";
    tools.innerHTML = `<button type="button" data-v4-test-step><span>TEST THIS STEP</span><strong>Run local check</strong></button>${index <= 2 ? `<button type="button" data-v4-open-catalog="${kind}"><span>CAPABILITIES</span><strong>${index === 0 ? "Browse triggers" : index === 1 ? "Browse rules" : "Browse actions"}</strong></button>` : ""}`;
    section.querySelector(":scope > header")?.insertAdjacentElement("afterend", tools);
  }

  function ensureStepResult(page) {
    let result = page.querySelector(".v4-step-test-result");
    if (result) return result;
    const tools = page.querySelector(".v4-stage-tools");
    if (!tools) return null;
    result = document.createElement("div");
    result.className = "v4-step-test-result";
    result.hidden = true;
    tools.insertAdjacentElement("afterend", result);
    return result;
  }

  function patchActionStage(page) {
    const add = page.querySelector(".v3-add-action");
    if (!add) return;
    const small = add.querySelector("small");
    if (small) small.textContent = "Search capabilities or use a reusable Lab Action";
    page.querySelectorAll(".v3-action-card").forEach(card => card.classList.add("v4-action-card"));
  }

  function patchReview(page) {
    const review = page.querySelector(".v3-review-stage");
    if (!review || review.querySelector(".v4-preflight-banner")) return;
    const check = review.querySelector(".v3-check-card");
    if (!check) return;
    const banner = document.createElement("div");
    banner.className = "v4-preflight-banner";
    banner.innerHTML = `<span>CONTINUUM PREFLIGHT</span><strong>Definition first. Execution later.</strong><p>This review checks the Draft you built. It does not claim a Connection, provider, Runtime worker or published version exists.</p><div><b class="is-good">✓ Draft structure</b><b class="is-lab">LAB Simulation only</b><b class="is-off">Runtime off</b></div>`;
    check.before(banner);
  }

  function patchEditor() {
    const page = document.querySelector(".v3-editor-page");
    if (!page) return false;
    page.dataset.platformV4 = "ready";
    patchFlowNavigator(page);
    ensureStageTools(page);
    patchActionStage(page);
    patchReview(page);

    const liveHead = page.querySelector(".v3-live-head");
    if (liveHead) {
      const title = liveHead.querySelector("span");
      const hint = liveHead.querySelector("small");
      if (title) title.textContent = "FLOW";
      if (hint) hint.textContent = "Tap a block to edit it";
    }
    const mobile = page.querySelector(".v3-mobile-flow-toggle small");
    if (mobile) mobile.textContent = "FLOW";
    document.documentElement.dataset.labAutomationsPlatform = "v4";
    return true;
  }

  function capabilityCard(capability, compact = false) {
    const action = capability.state === "lab" && capability.proxy
      ? `data-v4-use-capability="${esc(capability.id)}"`
      : `data-v4-capability-info="${esc(capability.id)}"`;
    return `<button type="button" class="v4-capability ${statusClass(capability.state)} ${compact ? "is-compact" : ""}" ${action} data-v4-capability-card data-kind="${capability.kind}" data-category="${esc(capability.category)}">
      <span class="v4-capability-mark">${esc(capability.kind === "trigger" ? "WHEN" : capability.kind === "condition" ? "IF" : capability.kind === "action" ? "DO" : "FLOW")}</span>
      <span class="v4-capability-copy"><strong>${esc(capability.label)}</strong><small>${esc(capability.description)}</small></span>
      <span class="v4-capability-status">${statusLabel(capability.state)}</span>
    </button>`;
  }

  function patchActionPicker() {
    const picker = document.querySelector(".v3-picker");
    if (!picker || !picker.querySelector("[data-choose-inline]") || picker.dataset.platformV4 === "ready") return false;
    picker.dataset.platformV4 = "ready";
    const results = picker.querySelector("[data-picker-results]");
    if (!results) return false;

    const originalSections = [...results.querySelectorAll(":scope > section")];
    originalSections.forEach(section => {
      if (!section.classList.contains("v3-saved-picker")) section.classList.add("v4-original-capabilities");
    });

    const actions = CAPABILITIES.filter(item => item.kind === "action" || item.kind === "workflow");
    const categories = [...new Set(actions.map(item => item.category))];
    const browser = document.createElement("section");
    browser.className = "v4-picker-browser";
    browser.innerHTML = `<div class="v4-picker-browser-head"><span>CAPABILITY CATALOG</span><strong>Choose what this step should do.</strong><small>Available Lab steps can be added now. Later capabilities show the shape of the platform without pretending they execute.</small></div><div class="v4-category-rail"><button type="button" class="is-active" data-v4-category="all">Recommended</button>${categories.map(category => `<button type="button" data-v4-category="${esc(category)}">${esc(category)}</button>`).join("")}</div><div class="v4-capability-grid" data-v4-capability-grid>${actions.map(item => capabilityCard(item, true)).join("")}</div>`;
    results.prepend(browser);

    const search = picker.querySelector("[data-picker-search]");
    if (search) search.placeholder = "Search email, AI, Library, wait…";
    applyCatalogFilter(picker, "all", search?.value || "");
    return true;
  }

  function applyCatalogFilter(root, category = root.dataset.v4Category || "all", query = root.querySelector("[data-picker-search]")?.value || "") {
    root.dataset.v4Category = category;
    const q = query.trim().toLowerCase();
    root.querySelectorAll("[data-v4-category]").forEach(button => button.classList.toggle("is-active", button.dataset.v4Category === category));
    root.querySelectorAll("[data-v4-capability-card]").forEach(card => {
      const categoryMatch = category === "all" || card.dataset.category === category;
      const queryMatch = !q || card.textContent.toLowerCase().includes(q);
      card.hidden = !(categoryMatch && queryMatch);
    });
  }

  function capabilityModal(kind = "all") {
    const available = kind === "all" ? CAPABILITIES : CAPABILITIES.filter(item => item.kind === kind || (kind === "action" && item.kind === "workflow"));
    const groups = [...new Set(available.map(item => item.category))];
    return `<div class="v4-modal-backdrop" data-v4-modal-close><section class="v4-modal v4-catalog-modal" role="dialog" aria-modal="true" aria-label="Automation capability catalog"><header><div><span>CONTINUUM CAPABILITIES</span><h2>${kind === "trigger" ? "Trigger catalog" : kind === "condition" ? "Rule catalog" : kind === "action" ? "Action catalog" : "Capability catalog"}</h2><p>The catalog can grow without redesigning the builder. LAB NOW items are usable in this prototype. LATER items are intentionally non-executable previews.</p></div><button type="button" data-v4-modal-close aria-label="Close">×</button></header><label class="v4-modal-search"><span>Search capabilities</span><input type="search" data-v4-modal-search placeholder="Search by name or category…"></label><div class="v4-modal-groups">${groups.map(group => `<section><h3>${esc(group)}</h3><div>${available.filter(item => item.category === group).map(item => capabilityCard(item)).join("")}</div></section>`).join("")}</div></section></div>`;
  }

  function openCatalog(kind = "all") {
    closeModal();
    document.body.insertAdjacentHTML("beforeend", capabilityModal(kind));
    modal = document.querySelector(".v4-modal-backdrop");
    modal?.querySelector("input")?.focus({ preventScroll: true });
  }

  function capabilityInfo(id) {
    const item = CAPABILITIES.find(cap => cap.id === id);
    if (!item) return;
    closeModal();
    document.body.insertAdjacentHTML("beforeend", `<div class="v4-modal-backdrop" data-v4-modal-close><section class="v4-modal v4-info-modal" role="dialog" aria-modal="true"><header><div><span>${esc(statusLabel(item.state))}</span><h2>${esc(item.label)}</h2><p>${esc(item.description)}</p></div><button type="button" data-v4-modal-close aria-label="Close">×</button></header><div class="v4-info-body"><div><span>TYPE</span><strong>${esc(item.kind)}</strong></div><div><span>CATEGORY</span><strong>${esc(item.category)}</strong></div><div><span>AVAILABILITY</span><strong>${esc(statusLabel(item.state))}</strong></div></div><p class="v4-info-note">${item.state === "lab" ? "This capability can be selected in the current Lab prototype." : "This capability belongs in the scalable catalog, but it is not executable in Lab or production yet. It will become selectable only when its typed definition and required services are real."}</p>${item.state === "lab" && item.proxy ? `<button type="button" class="v4-primary-modal" data-v4-use-capability="${esc(item.id)}">Use this capability</button>` : ""}</section></div>`);
    modal = document.querySelector(".v4-modal-backdrop");
  }

  function newAutomationModal() {
    return `<div class="v4-modal-backdrop" data-v4-modal-close><section class="v4-modal v4-new-modal" role="dialog" aria-modal="true" aria-label="Create Automation"><header><div><span>NEW AUTOMATION</span><h2>How do you want to start?</h2><p>Every path creates the same editable Automation Draft.</p></div><button type="button" data-v4-modal-close aria-label="Close">×</button></header><div class="v4-start-grid"><button type="button" data-v4-start="manual"><b>BUILD</b><strong>Build manually</strong><small>Start at WHEN and assemble the flow yourself.</small><i>→</i></button><button type="button" data-v4-start="templates"><b>TEMPLATES</b><strong>Start from a scenario</strong><small>Choose a useful pattern, then change anything.</small><i>→</i></button><button type="button" data-v4-start="planner"><b>AI PLANNER</b><strong>Describe what you want</strong><small>Preview the future Planner entry point. No AI model is connected in Lab.</small><i>✦</i></button></div></section></div>`;
  }

  function openNewAutomation() {
    closeModal();
    document.body.insertAdjacentHTML("beforeend", newAutomationModal());
    modal = document.querySelector(".v4-modal-backdrop");
  }

  function plannerPreview() {
    closeModal();
    document.body.insertAdjacentHTML("beforeend", `<div class="v4-modal-backdrop" data-v4-modal-close><section class="v4-modal v4-planner-modal" role="dialog" aria-modal="true"><header><div><span>AI PLANNER · PREVIEW</span><h2>Describe the outcome.</h2><p>Later, Planner will translate natural language into the same typed Draft a human builds. This Lab screen makes that entry point tangible without claiming a model call exists.</p></div><button type="button" data-v4-modal-close aria-label="Close">×</button></header><label class="v4-planner-field"><span>What should happen?</span><textarea data-v4-planner-text placeholder="Every morning, prepare a briefing from approved updates and save it for review."></textarea></label><div class="v4-planner-examples"><span>TRY A STARTING PATTERN</span><button type="button" data-v4-planner-template="daily-briefing">Morning briefing</button><button type="button" data-v4-planner-template="missed-checkin">Continuity escalation</button><button type="button" data-v4-planner-template="notify-later">Notify someone later</button><button type="button" data-v4-planner-template="ai-report">AI prepares report</button></div><div class="v4-planner-boundary"><b>LAB BOUNDARY</b><span>No model request, production API call, provider execution or publish operation occurs here.</span></div></section></div>`);
    modal = document.querySelector(".v4-modal-backdrop");
  }

  function closeModal() {
    document.querySelectorAll(".v4-modal-backdrop").forEach(node => node.remove());
    modal = null;
  }

  function useCapability(id) {
    const capability = CAPABILITIES.find(item => item.id === id);
    if (!capability?.proxy || capability.state !== "lab") return capabilityInfo(id);
    closeModal();

    if (capability.kind === "trigger") {
      const button = document.querySelector(`[data-trigger="${CSS.escape(capability.proxy)}"]`);
      button?.click();
      return;
    }
    if (capability.kind === "condition") {
      const button = document.querySelector(`[data-add-rule="${CSS.escape(capability.proxy)}"]`);
      if (button) button.click(); else capabilityInfo(id);
      return;
    }
    if (capability.kind === "action") {
      const existing = document.querySelector(`[data-choose-inline="${CSS.escape(capability.proxy)}"]`);
      if (existing) {
        existing.click();
        return;
      }
      const add = document.querySelector("[data-add-action]");
      add?.click();
      requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector(`[data-choose-inline="${CSS.escape(capability.proxy)}"]`)?.click()));
    }
  }

  function goToStage(index) {
    const button = document.querySelector(`.v3-stage-rail [data-stage="${index}"]`);
    if (!button || button.disabled) return;
    button.click();
    if (index === 2) requestAnimationFrame(() => document.querySelector(".v3-action-stack")?.scrollIntoView({ block: "start", behavior: "smooth" }));
  }

  function runStageTest() {
    const page = document.querySelector(".v3-editor-page");
    if (!page) return;
    const result = ensureStepResult(page);
    if (!result) return;
    const index = stageIndex();
    const copy = stageTestCopy(index);
    const actionCount = index === 2 ? page.querySelectorAll(".v3-action-card:not(.is-disabled)").length : 0;
    result.innerHTML = `<span>LOCAL TEST</span><strong>✓ ${esc(copy.title)}</strong><p>${esc(copy.body)}</p>${index === 2 ? `<small>${actionCount} visible action step${actionCount === 1 ? "" : "s"} inspected.</small>` : ""}`;
    result.hidden = false;
    result.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function selectTemplate(id) {
    closeModal();
    const template = document.querySelector(`[data-template="${CSS.escape(id)}"]`);
    if (template) template.click();
  }

  function patch() {
    queued = false;
    patchDashboard();
    patchEditor();
    patchActionPicker();
  }

  function schedulePatch() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", event => {
    const target = event.target.closest("button,[role='button'],a");
    if (!target) return;

    if (target.matches("[data-new]") && !bypassNewIntercept) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openNewAutomation();
      return;
    }

    if (target.matches("[data-v4-modal-close]")) {
      if (target.closest(".v4-modal") && !target.matches("button")) return;
      event.preventDefault();
      closeModal();
      return;
    }

    if (target.matches("[data-v4-surface]")) {
      surface = target.dataset.v4Surface;
      schedulePatch();
      return;
    }

    if (target.matches("[data-v4-open-catalog]")) {
      openCatalog(target.dataset.v4OpenCatalog || "all");
      return;
    }

    if (target.matches("[data-v4-category]")) {
      const picker = target.closest(".v3-picker");
      if (picker) applyCatalogFilter(picker, target.dataset.v4Category, picker.querySelector("[data-picker-search]")?.value || "");
      return;
    }

    if (target.matches("[data-v4-use-capability]")) {
      useCapability(target.dataset.v4UseCapability);
      return;
    }

    if (target.matches("[data-v4-capability-info]")) {
      capabilityInfo(target.dataset.v4CapabilityInfo);
      return;
    }

    if (target.matches("[data-v4-start]")) {
      const mode = target.dataset.v4Start;
      if (mode === "manual") {
        closeModal();
        const button = document.querySelector("[data-new]");
        if (button) {
          bypassNewIntercept = true;
          button.click();
          bypassNewIntercept = false;
        }
      } else if (mode === "templates") {
        closeModal();
        surface = "templates";
        schedulePatch();
      } else if (mode === "planner") plannerPreview();
      return;
    }

    if (target.matches("[data-v4-planner-template]")) {
      selectTemplate(target.dataset.v4PlannerTemplate);
      return;
    }

    if (target.matches("[data-v4-flow-stage]")) {
      goToStage(Number(target.dataset.v4FlowStage));
      return;
    }

    if (target.matches("[data-v4-test-step]")) {
      runStageTest();
      return;
    }

    schedulePatch();
  }, true);

  document.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-v4-flow-stage]")) {
      event.preventDefault();
      goToStage(Number(event.target.dataset.v4FlowStage));
    }
    if (event.key === "Escape" && modal) closeModal();
  });

  document.addEventListener("input", event => {
    if (event.target.matches("[data-v4-dashboard-search]")) {
      searchText = event.target.value;
      filterAutomationCards(document.querySelector(".v3-dashboard") || document);
      return;
    }
    if (event.target.matches("[data-picker-search]")) {
      const picker = event.target.closest(".v3-picker");
      if (picker) applyCatalogFilter(picker, picker.dataset.v4Category || "all", event.target.value);
      return;
    }
    if (event.target.matches("[data-v4-modal-search]")) {
      const q = event.target.value.trim().toLowerCase();
      event.target.closest(".v4-modal")?.querySelectorAll("[data-v4-capability-card]").forEach(card => {
        card.hidden = Boolean(q) && !card.textContent.toLowerCase().includes(q);
      });
      return;
    }
    schedulePatch();
  }, true);

  document.addEventListener("change", schedulePatch, true);
  window.addEventListener("pageshow", schedulePatch);
  window.addEventListener("storage", event => {
    if ([AUTOMATIONS_KEY, ACTIONS_KEY].includes(event.key)) schedulePatch();
  });
  window.addEventListener("cmx:lab-automations-updated", schedulePatch);

  try { localStorage.setItem(PLATFORM_KEY, JSON.stringify({ version: 4, catalogVersion: 1 })); } catch {}
  schedulePatch();
})();