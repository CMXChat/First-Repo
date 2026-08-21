(() => {
  "use strict";

  const STORE_KEY = "cmx-lab-automations-v1";
  const HISTORY_KEY = "cmxLabAutomationsNavigation";
  const SECTIONS = ["overview", "definition", "runs", "permissions", "related", "history", "settings"];
  let queued = false;

  function currentAutomationId() {
    const fromHistory = history.state?.[HISTORY_KEY]?.snapshot?.automationId;
    if (fromHistory && fromHistory !== "__new__") return fromHistory;
    const title = document.querySelector(".v3-editor-page .v3-title-button strong")?.textContent?.trim();
    if (!title) return "";
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      const matches = (data?.automations || []).filter(item => String(item?.name || "").trim() === title);
      return matches.length === 1 ? matches[0].id || "" : "";
    } catch {
      return "";
    }
  }

  function lifecycleLabel(automationId) {
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      const record = (data?.automations || []).find(item => item?.id === automationId);
      if (record?.status) return record.status;
    } catch {}
    return document.querySelector(".v3-editor-page .v3-title-button")?.closest(".v3-editor-title-row")?.querySelector(".v3-draft-badge")?.textContent?.trim() || "Draft";
  }

  function ensureDashboardCard(card) {
    const automationId = card?.dataset?.open;
    if (!automationId) return;
    let shell = card.parentElement?.classList.contains("v10-card-shell") ? card.parentElement : null;
    if (!shell) {
      shell = document.createElement("div");
      shell.className = "v10-card-shell";
      card.before(shell);
      shell.append(card);
    }
    shell.hidden = card.hidden;
    if (!shell.querySelector(":scope > [data-v10-card-menu]")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "v10-card-menu-button";
      button.dataset.v10CardMenu = automationId;
      button.setAttribute("aria-label", "Automation actions");
      button.setAttribute("aria-haspopup", "menu");
      button.textContent = "•••";
      shell.append(button);
    }
  }

  function patchDashboardFallback() {
    const dashboard = document.querySelector(".v3-dashboard");
    if (!dashboard) return false;

    dashboard.querySelectorAll(".v3-automation-card[data-open]").forEach(ensureDashboardCard);
    const manage = dashboard.querySelector("[data-v7-manage] span");
    if (manage) manage.textContent = "Manage all";
    const heroCopy = dashboard.querySelector(".v3-hero p");
    if (heroCopy) heroCopy.textContent = "Build, inspect and control Automation definitions. Execution remains off in Lab.";

    dashboard.dataset.controlV10 = "ready";
    document.documentElement.dataset.labAutomationsControl = "v10";
    return true;
  }

  function patchEditorChrome() {
    const page = document.querySelector(".v3-editor-page");
    const head = page?.querySelector(".v3-editor-head");
    if (!page || !head) return false;

    const automationId = currentAutomationId();
    const view = page.dataset.v10View || "definition";
    page.dataset.controlV10 = "ready";
    page.dataset.v10View = view;

    let bar = head.querySelector(".v10-object-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "v10-object-bar";
      bar.innerHTML = `<button class="v10-exit" type="button" data-v10-exit><span>←</span><strong>Automations</strong></button>
        <div class="v10-object-state"><span>AUTOMATION CONTROL</span><strong>${lifecycleLabel(automationId)}</strong><small>Definition control</small></div>
        <button class="v10-object-menu" type="button" data-v10-editor-menu="${automationId}" aria-label="Automation actions">•••</button>
        <button class="v10-object-close" type="button" data-v10-exit aria-label="Close Automation">×</button>`;
      head.insertAdjacentElement("afterbegin", bar);
    } else {
      const menu = bar.querySelector("[data-v10-editor-menu]");
      if (menu && automationId) menu.dataset.v10EditorMenu = automationId;
    }

    let nav = head.querySelector(".v10-control-nav");
    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "v10-control-nav";
      nav.setAttribute("aria-label", "Automation sections");
      nav.innerHTML = SECTIONS.map(section => `<button type="button" data-v10-tab="${section}" class="${view === section ? "is-active" : ""}" aria-selected="${view === section}">${section[0].toUpperCase()}${section.slice(1)}</button>`).join("");
      const rail = head.querySelector(".v3-stage-rail");
      if (rail) rail.insertAdjacentElement("beforebegin", nav);
      else head.append(nav);
    }

    document.documentElement.dataset.labAutomationsControl = "v10";
    document.dispatchEvent(new CustomEvent("cmx:v10-editor-bootstrap", { detail: { view, automationId } }));
    return true;
  }

  function patch() {
    queued = false;
    const dashboard = patchDashboardFallback();
    const editor = patchEditorChrome();
    if (dashboard || editor) document.documentElement.dataset.labAutomationsControl = "v10";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    queueMicrotask(patch);
  }

  document.addEventListener("click", schedule, true);
  document.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("popstate", schedule);

  const app = document.getElementById("automationApp");
  if (app) new MutationObserver(schedule).observe(app, { childList: true, subtree: true });

  schedule();
})();
