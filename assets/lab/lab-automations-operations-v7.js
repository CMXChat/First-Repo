(() => {
  "use strict";

  const STORE_KEY = "cmx-lab-automations-v1";
  const UI_KEY = "cmx-lab-automations-operations-v7";
  const RUNTIME_TYPES = new Set(["notify", "email", "ai_task", "action_ref"]);
  const FUTURE_CAPABILITIES = Object.freeze([
    { id: "trigger.signal_observed", kind: "WHEN", category: "Signals", label: "Signal observed", description: "Start when an approved Signal records a meaningful change in current State." },
    { id: "condition.state_matches", kind: "IF", category: "State", label: "Current State matches", description: "Continue when protected operational State satisfies a typed condition." },
    { id: "action.goal_progress", kind: "DO", category: "Goals", label: "Update Goal progress", description: "Record approved progress or evidence against a future Goal or Mission." },
    { id: "workflow.wait_for_state", kind: "FLOW", category: "Runtime", label: "Wait for a State change", description: "Persist a wait until approved State changes, a deadline arrives or policy stops the Run." }
  ]);

  let queued = false;
  let filter = "all";
  let manageModal = null;
  let pendingDelete = null;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));
  const clone = value => JSON.parse(JSON.stringify(value ?? null));
  const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  function readStore() {
    try {
      const value = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      return value && Array.isArray(value.automations) ? value : { version: 1, automations: [] };
    } catch {
      return { version: 1, automations: [] };
    }
  }

  function announceUpdate(reason) {
    const detail = { reason: reason || "operations-v7" };
    document.dispatchEvent(new CustomEvent("cmx:lab-automations-updated", { detail }));
    window.dispatchEvent(new CustomEvent("cmx:lab-automations-updated", { detail }));
  }

  function writeStore(store, reason, reload = false) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    announceUpdate(reason);
    if (reload) {
      requestAnimationFrame(() => location.reload());
      return;
    }
    schedulePatch();
  }

  function activeActions(item) {
    return Array.isArray(item?.actions) ? item.actions.filter(action => action?.enabled !== false) : [];
  }

  function flowControls(item) {
    if (window.CMXAutomationModelV5?.getFlowControls) {
      try { return window.CMXAutomationModelV5.getFlowControls(item) || []; } catch {}
    }
    return Array.isArray(item?.flowControls) ? item.flowControls : [];
  }

  function hasAudience(action) {
    if (Array.isArray(action?.audienceSelectors) && action.audienceSelectors.length) return true;
    return Boolean(action?.targetRef || String(action?.targetLabel || "").trim());
  }

  function assess(item) {
    const actions = activeActions(item);
    const controls = flowControls(item);
    const blockers = [];
    let verdict = { ok: true, errors: [], warnings: [] };

    if (window.CMXAutomationModelV5?.build && window.CMXAutomationModelV5?.validate) {
      try { verdict = window.CMXAutomationModelV5.validate(window.CMXAutomationModelV5.build(item)); } catch {
        verdict = { ok: false, errors: [{ code: "model_unavailable" }], warnings: [] };
      }
    }

    if (!verdict.ok) blockers.push("Workflow structure needs attention");
    if (!actions.length) blockers.push("Add an enabled Action");

    actions.forEach(action => {
      if (["notify", "email"].includes(action.type) && !hasAudience(action)) blockers.push("Choose an audience");
      if (action.type === "ai_task" && !String(action.content || "").trim()) blockers.push("Describe the AI task");
      if (action.type === "action_ref" && !String(action.actionId || "").trim()) blockers.push("Choose a reusable Action");
    });

    if (item?.trigger === "calendar") {
      const recurrence = item?.repeatConfig?.mode || "none";
      const timing = item?.timing || {};
      const hasExact = timing.mode === "exact" && timing.at?.date && timing.at?.time;
      if (recurrence === "none" && !hasExact) blockers.push("Confirm schedule timing");
    }

    const waits = controls.filter(control => control?.type === "wait" && control.enabled !== false).length;
    const sequenceConditions = controls.filter(control => control?.type === "condition" && control.enabled !== false).length;
    const runtimeLater = waits > 0 || item?.repeatConfig?.mode === "until_ack" || item?.outcome === "no_ack";
    const providerSteps = actions.filter(action => RUNTIME_TYPES.has(action.type)).length;
    const uniqueBlockers = [...new Set(blockers)];

    return {
      readiness: uniqueBlockers.length ? "needs-setup" : "ready",
      blockers: uniqueBlockers,
      actions: actions.length,
      waits,
      sequenceConditions,
      runtimeLater,
      providerSteps,
      valid: verdict.ok
    };
  }

  function assessmentMap() {
    const map = new Map();
    readStore().automations.forEach(item => map.set(item.id, assess(item)));
    return map;
  }

  function counts() {
    const items = readStore().automations;
    const values = items.map(item => assess(item));
    return {
      total: items.length,
      drafts: items.filter(item => (item.status || "Draft") === "Draft").length,
      ready: values.filter(item => item.readiness === "ready").length,
      setup: values.filter(item => item.readiness === "needs-setup").length,
      runtime: values.filter(item => item.runtimeLater).length
    };
  }

  function operationsBarMarkup() {
    const c = counts();
    return `<section class="v7-operations-bar" aria-label="Automation workspace status">
      <div class="v7-ops-summary">
        <span><small>DRAFTS</small><strong>${c.drafts}</strong></span>
        <span class="is-ready"><small>READY TO TEST</small><strong>${c.ready}</strong></span>
        <span class="is-attention"><small>NEEDS SETUP</small><strong>${c.setup}</strong></span>
        <span class="is-runtime"><small>RUNTIME LATER</small><strong>${c.runtime}</strong></span>
      </div>
      <div class="v7-ops-actions">
        <div class="v7-filter-group" role="group" aria-label="Filter Automations">
          <button type="button" data-v7-filter="all" class="${filter === "all" ? "is-active" : ""}">All</button>
          <button type="button" data-v7-filter="ready" class="${filter === "ready" ? "is-active" : ""}">Ready</button>
          <button type="button" data-v7-filter="needs-setup" class="${filter === "needs-setup" ? "is-active" : ""}">Needs setup</button>
          <button type="button" data-v7-filter="runtime" class="${filter === "runtime" ? "is-active" : ""}">Runtime later</button>
        </div>
        <button type="button" class="v7-manage-button" data-v7-manage><span>Manage</span><b>${c.total}</b></button>
      </div>
    </section>`;
  }

  function patchHero(dashboard) {
    const hero = dashboard.querySelector(".v3-hero");
    if (!hero) return;
    hero.classList.add("v7-workspace-head");
    const eyebrow = hero.querySelector(".v3-eyebrow");
    const title = hero.querySelector("h1");
    const copy = hero.querySelector("p");
    if (eyebrow) eyebrow.textContent = "CONTINUUM · AUTOMATIONS";
    if (title) title.textContent = "Automation workspace";
    if (copy) copy.textContent = "Build, inspect and manage protected workflow definitions. Execution remains off in Lab.";
    const button = hero.querySelector("[data-new]");
    if (button) {
      button.textContent = "+ New automation";
      button.setAttribute("aria-label", "Create a new Automation Draft");
    }
  }

  function ensureOperationsBar(dashboard) {
    const nav = dashboard.querySelector(".v4-workspace-nav");
    if (!nav) return;
    const current = dashboard.querySelector(".v7-operations-bar");
    const holder = document.createElement("div");
    holder.innerHTML = operationsBarMarkup();
    if (current) current.replaceWith(holder.firstElementChild);
    else nav.insertAdjacentElement("afterend", holder.firstElementChild);
  }

  function cardId(card) {
    return card.dataset.open || card.getAttribute("data-open") || "";
  }

  function decorateCards(dashboard) {
    const store = readStore();
    const items = new Map(store.automations.map(item => [item.id, item]));
    const assessments = assessmentMap();
    dashboard.querySelectorAll(".v3-automation-card").forEach(card => {
      const id = cardId(card);
      const item = items.get(id);
      const info = assessments.get(id);
      if (!item || !info) return;

      card.dataset.v7Readiness = info.readiness;
      card.dataset.v7Runtime = info.runtimeLater ? "later" : "none";
      card.classList.add("v7-automation-row");

      let meta = card.querySelector(".v7-card-meta");
      if (!meta) {
        meta = document.createElement("span");
        meta.className = "v7-card-meta";
        card.querySelector(".v3-card-head")?.after(meta);
      }
      const readinessLabel = info.readiness === "ready" ? "Ready to test" : "Needs setup";
      const blocker = info.blockers[0] || "Definition is locally complete";
      meta.innerHTML = `<span class="v7-readiness is-${info.readiness}"><i></i>${esc(readinessLabel)}</span><span>${info.actions} action${info.actions === 1 ? "" : "s"}</span>${info.sequenceConditions ? `<span>${info.sequenceConditions} flow rule${info.sequenceConditions === 1 ? "" : "s"}</span>` : ""}${info.waits ? `<span>${info.waits} inter-step wait${info.waits === 1 ? "" : "s"}</span>` : ""}${info.runtimeLater ? `<span class="is-runtime">Runtime later</span>` : ""}<small>${esc(blocker)}</small>`;
    });
  }

  function applyFilter(dashboard) {
    const q = dashboard.querySelector("[data-v4-dashboard-search]")?.value.trim().toLowerCase() || "";
    let visible = 0;
    dashboard.querySelectorAll(".v3-automation-card").forEach(card => {
      const searchMatch = !q || card.textContent.toLowerCase().includes(q);
      const stateMatch = filter === "all"
        || (filter === "ready" && card.dataset.v7Readiness === "ready")
        || (filter === "needs-setup" && card.dataset.v7Readiness === "needs-setup")
        || (filter === "runtime" && card.dataset.v7Runtime === "later");
      card.hidden = !(searchMatch && stateMatch);
      if (!card.hidden) visible += 1;
    });

    const list = dashboard.querySelector(".v3-drafts");
    let empty = dashboard.querySelector(".v7-filter-empty");
    if (list && !visible && dashboard.querySelectorAll(".v3-automation-card").length) {
      if (!empty) {
        empty = document.createElement("div");
        empty.className = "v7-filter-empty";
        list.append(empty);
      }
      empty.innerHTML = `<strong>No matching Automations</strong><span>Change the filter or search to see the rest of the workspace.</span>`;
    } else empty?.remove();
  }

  function patchWorkspaceNav(dashboard) {
    const nav = dashboard.querySelector(".v4-workspace-nav");
    if (!nav) return;
    nav.classList.add("v7-workspace-nav");
    const catalog = nav.querySelector(".v4-catalog-button");
    if (catalog) catalog.firstChild.textContent = "Capabilities ";
    const search = nav.querySelector("[data-v4-dashboard-search]");
    if (search) search.placeholder = "Search Automations";
  }

  function patchTemplates(dashboard) {
    const section = dashboard.querySelector(".v3-template-section");
    if (!section) return;
    section.classList.add("v7-template-workspace");
    const intro = section.querySelector(".v4-template-intro");
    if (!intro) return;
    const label = intro.querySelector("span");
    const title = intro.querySelector("strong");
    const copy = intro.querySelector("p");
    if (label) label.textContent = "STARTING PATTERNS";
    if (title) title.textContent = "Templates";
    if (copy) copy.textContent = "Create an ordinary editable Draft from a known pattern.";
  }

  function patchRuns(dashboard) {
    const panel = dashboard.querySelector(".v4-runs-panel");
    if (!panel || panel.dataset.v7Runs === "ready") return;
    const head = panel.querySelector(".v4-runs-head");
    if (head) {
      const label = head.querySelector("div > span");
      const title = head.querySelector("h2");
      const copy = head.querySelector("p");
      if (label) label.textContent = "AUTHORITATIVE RUNS";
      if (title) title.textContent = "No Runtime history yet";
      if (copy) copy.textContent = "This view is reserved for server-owned occurrences, attempts, waits, outputs and failures. Local simulations never appear here as fake Runs.";
    }
    const preview = panel.querySelector(".v4-run-preview");
    if (preview && !panel.querySelector(".v7-run-columns")) preview.insertAdjacentHTML("beforebegin", `<div class="v7-run-columns" aria-hidden="true"><span>TIME</span><span>STEP</span><span>EVENT</span><span>SOURCE</span></div>`);
    panel.dataset.v7Runs = "ready";
  }

  function patchDashboard() {
    const dashboard = document.querySelector(".v3-dashboard[data-platform-v4='ready'], .v3-dashboard");
    if (!dashboard) return false;
    dashboard.dataset.operationsV7 = "ready";
    patchHero(dashboard);
    patchWorkspaceNav(dashboard);
    ensureOperationsBar(dashboard);
    decorateCards(dashboard);
    applyFilter(dashboard);
    patchTemplates(dashboard);
    patchRuns(dashboard);
    return true;
  }

  function currentAutomation() {
    const page = document.querySelector(".v3-editor-page");
    if (!page) return null;
    const store = readStore();
    const title = page.querySelector(".v3-title-button strong")?.textContent?.trim();
    if (title) return store.automations.find(item => String(item.name || "").trim() === title) || null;
    return null;
  }

  function editorStatusMarkup(item) {
    const info = assess(item || {});
    return `<div class="v7-editor-status" aria-label="Draft status">
      <span><small>DEFINITION</small><strong>${info.readiness === "ready" ? "READY TO TEST" : "NEEDS SETUP"}</strong></span>
      <span><small>MODEL</small><strong>V5</strong></span>
      <span><small>STATE</small><strong>LOCAL DRAFT</strong></span>
      <span class="is-off"><small>EXECUTION</small><strong>OFF</strong></span>
    </div>`;
  }

  function reviewReadinessMarkup(item) {
    const info = assess(item || {});
    const blockers = info.blockers.length
      ? info.blockers.map(text => `<li><i></i><span>${esc(text)}</span></li>`).join("")
      : `<li class="is-good"><i></i><span>Definition is locally ready for full Lab simulation.</span></li>`;
    return `<aside class="v7-review-readiness" aria-label="Automation readiness">
      <header><div><span>READINESS</span><strong>${info.readiness === "ready" ? "Ready to test" : "Setup still needed"}</strong></div><b>${info.valid ? "V5 VALID" : "CHECK MODEL"}</b></header>
      <ul>${blockers}</ul>
      <footer><span>${info.actions} enabled action${info.actions === 1 ? "" : "s"}</span><span>${info.sequenceConditions} inter-step rule${info.sequenceConditions === 1 ? "" : "s"}</span><span>${info.waits} inter-step wait${info.waits === 1 ? "" : "s"}</span>${info.runtimeLater ? `<span class="is-runtime">Runtime required later</span>` : ""}</footer>
    </aside>`;
  }

  function patchEditor() {
    const page = document.querySelector(".v3-editor-page");
    if (!page) return false;
    page.dataset.operationsV7 = "ready";
    const item = currentAutomation();
    const titleArea = page.querySelector(".v3-editor-title-row");
    const currentStatus = page.querySelector(".v7-editor-status");
    if (titleArea) {
      const holder = document.createElement("div");
      holder.innerHTML = editorStatusMarkup(item);
      if (currentStatus) currentStatus.replaceWith(holder.firstElementChild);
      else titleArea.insertAdjacentElement("afterend", holder.firstElementChild);
    }

    const review = page.querySelector(".v3-review-stage");
    if (review) {
      const holder = document.createElement("div");
      holder.innerHTML = reviewReadinessMarkup(item);
      const existing = review.querySelector(".v7-review-readiness");
      if (existing) existing.replaceWith(holder.firstElementChild);
      else review.insertAdjacentElement("afterbegin", holder.firstElementChild);
    }

    const liveHead = page.querySelector(".v3-live-head");
    if (liveHead) {
      const title = liveHead.querySelector("span");
      const hint = liveHead.querySelector("small");
      if (title) title.textContent = "FLOW PREVIEW";
      if (hint) hint.textContent = "Navigate the definition";
    }
    return true;
  }

  function futureCapabilityMarkup(item) {
    return `<button type="button" class="v7-future-capability" data-v7-future-info="${esc(item.id)}"><b>${esc(item.kind)}</b><span><strong>${esc(item.label)}</strong><small>${esc(item.description)}</small></span><em>LATER</em></button>`;
  }

  function patchFutureCatalog() {
    document.querySelectorAll(".v4-catalog-modal").forEach(modal => {
      if (modal.querySelector(".v7-future-capability-group")) return;
      const groups = modal.querySelector(".v4-modal-groups");
      if (!groups) return;
      groups.insertAdjacentHTML("beforeend", `<section class="v7-future-capability-group"><h3>Continuum control layer</h3><p>Future typed capabilities already accounted for in the architecture.</p><div>${FUTURE_CAPABILITIES.map(futureCapabilityMarkup).join("")}</div></section>`);
    });
  }

  function futureCapabilityInfo(id) {
    const item = FUTURE_CAPABILITIES.find(capability => capability.id === id);
    if (!item) return;
    document.body.insertAdjacentHTML("beforeend", `<div class="v4-modal-backdrop" data-v4-modal-close><section class="v4-modal v4-info-modal" role="dialog" aria-modal="true"><header><div><span>LATER · ${esc(item.category.toUpperCase())}</span><h2>${esc(item.label)}</h2><p>${esc(item.description)}</p></div><button type="button" data-v4-modal-close aria-label="Close">×</button></header><div class="v4-info-body"><div><span>TYPE</span><strong>${esc(item.kind)}</strong></div><div><span>STATUS</span><strong>LATER</strong></div><div><span>BOUNDARY</span><strong>Definition preview only</strong></div></div><p class="v4-info-note">This is architectural discoverability only. It becomes selectable after the protected service, typed definition, policy checks and Runtime behavior exist.</p></section></div>`);
  }

  function manageRows() {
    const store = readStore();
    if (!store.automations.length) return `<div class="v7-manage-empty"><strong>No Automations yet</strong><span>Create a Draft and it will appear here.</span></div>`;
    return store.automations.map(item => {
      const info = assess(item);
      const confirm = pendingDelete === item.id;
      return `<article class="v7-manage-row" data-v7-manage-row="${esc(item.id)}"><div class="v7-manage-copy"><span>${esc((item.status || "Draft").toUpperCase())}</span><strong>${esc(item.name || "Untitled automation")}</strong><small>${info.readiness === "ready" ? "Ready to test" : esc(info.blockers[0] || "Needs setup")}${info.runtimeLater ? " · Runtime later" : ""}</small></div><div class="v7-manage-actions"><button type="button" data-v7-duplicate="${esc(item.id)}">Duplicate</button><button type="button" data-v7-archive="${esc(item.id)}">${item.status === "Archived" ? "Restore" : "Archive"}</button>${confirm ? `<button type="button" class="is-danger" data-v7-delete-confirm="${esc(item.id)}">Delete local copy</button><button type="button" data-v7-delete-cancel>Cancel</button>` : `<button type="button" data-v7-delete="${esc(item.id)}">Delete</button>`}</div></article>`;
    }).join("");
  }

  function manageModalMarkup() {
    return `<div class="v7-manage-backdrop" data-v7-manage-close><section class="v7-manage-modal" role="dialog" aria-modal="true" aria-label="Manage Automations"><header><div><span>LOCAL WORKSPACE</span><h2>Manage Automations</h2><p>These controls only change browser-local Lab definitions. They do not publish, execute or touch production.</p></div><button type="button" data-v7-manage-close aria-label="Close">×</button></header><div class="v7-manage-list">${manageRows()}</div><footer><span>Execution remains off</span><button type="button" data-v7-manage-close>Done</button></footer></section></div>`;
  }

  function openManage() {
    closeManage();
    document.body.insertAdjacentHTML("beforeend", manageModalMarkup());
    manageModal = document.querySelector(".v7-manage-backdrop");
  }

  function refreshManage() {
    const list = document.querySelector(".v7-manage-list");
    if (list) list.innerHTML = manageRows();
  }

  function closeManage() {
    document.querySelectorAll(".v7-manage-backdrop").forEach(node => node.remove());
    manageModal = null;
    pendingDelete = null;
  }

  function duplicateAutomation(id) {
    const store = readStore();
    const source = store.automations.find(item => item.id === id);
    if (!source) return;
    const sourceControls = flowControls(source);
    const copy = clone(source);
    copy.id = makeId("auto");
    copy.name = `${source.name || "Untitled automation"} copy`;
    copy.nameAuto = false;
    copy.status = "Draft";
    copy.updatedAt = new Date().toISOString();

    const idMap = new Map();
    copy.actions = (copy.actions || []).map(action => {
      const nextId = makeId("step");
      idMap.set(action.id, nextId);
      return { ...action, id: nextId };
    });
    copy.conditions = (copy.conditions || []).map(rule => ({ ...rule, id: makeId("rule") }));
    copy.flowControls = sourceControls.map(control => ({
      ...clone(control),
      id: makeId(control.type === "wait" ? "wait" : "gate"),
      afterActionId: idMap.get(control.afterActionId) || control.afterActionId,
      source: control.source?.sourceType === "step"
        ? { ...clone(control.source), sourceId: idMap.get(control.source.sourceId) || control.source.sourceId }
        : clone(control.source)
    }));
    delete copy.workflowV5;
    store.automations.unshift(copy);
    writeStore(store, "operations-v7-duplicate", true);
  }

  function archiveAutomation(id) {
    const store = readStore();
    const item = store.automations.find(entry => entry.id === id);
    if (!item) return;
    item.status = item.status === "Archived" ? "Draft" : "Archived";
    item.updatedAt = new Date().toISOString();
    writeStore(store, "operations-v7-lifecycle", true);
  }

  function deleteAutomation(id) {
    const store = readStore();
    store.automations = store.automations.filter(item => item.id !== id);
    pendingDelete = null;
    writeStore(store, "operations-v7-delete-local", true);
  }

  function patch() {
    queued = false;
    const changed = patchDashboard() || patchEditor();
    patchFutureCatalog();
    if (changed) {
      document.documentElement.dataset.labAutomationsOperations = "v7";
      try { localStorage.setItem(UI_KEY, JSON.stringify({ version: 7, filter })); } catch {}
    }
  }

  function schedulePatch() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", event => {
    const target = event.target.closest("button,a,[role='button']");
    if (!target) return;
    if (target.matches("[data-v7-filter]")) { filter = target.dataset.v7Filter || "all"; schedulePatch(); return; }
    if (target.matches("[data-v7-manage]")) { openManage(); return; }
    if (target.matches("[data-v7-manage-close]")) {
      if (target.classList.contains("v7-manage-backdrop") && event.target !== target) return;
      closeManage(); return;
    }
    if (target.matches("[data-v7-duplicate]")) { duplicateAutomation(target.dataset.v7Duplicate); return; }
    if (target.matches("[data-v7-archive]")) { archiveAutomation(target.dataset.v7Archive); return; }
    if (target.matches("[data-v7-delete]")) { pendingDelete = target.dataset.v7Delete; refreshManage(); return; }
    if (target.matches("[data-v7-delete-cancel]")) { pendingDelete = null; refreshManage(); return; }
    if (target.matches("[data-v7-delete-confirm]")) { deleteAutomation(target.dataset.v7DeleteConfirm); return; }
    if (target.matches("[data-v7-future-info]")) { futureCapabilityInfo(target.dataset.v7FutureInfo); return; }
    schedulePatch();
  }, true);

  document.addEventListener("input", event => {
    if (event.target.matches("[data-v4-dashboard-search]")) requestAnimationFrame(() => applyFilter(document.querySelector(".v3-dashboard") || document));
    schedulePatch();
  }, true);
  document.addEventListener("change", schedulePatch, true);
  document.addEventListener("keydown", event => { if (event.key === "Escape" && manageModal) closeManage(); });
  window.addEventListener("storage", event => { if (event.key === STORE_KEY) schedulePatch(); });
  window.addEventListener("pageshow", schedulePatch);
  window.addEventListener("cmx:lab-automations-updated", schedulePatch);

  window.CMXAutomationOperationsV7 = Object.freeze({ assess, counts, futureCapabilities: FUTURE_CAPABILITIES });

  try {
    const saved = JSON.parse(localStorage.getItem(UI_KEY) || "null");
    if (["all", "ready", "needs-setup", "runtime"].includes(saved?.filter)) filter = saved.filter;
  } catch {}

  schedulePatch();
})();