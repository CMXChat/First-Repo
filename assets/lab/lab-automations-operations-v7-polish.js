(() => {
  "use strict";

  const STORE_KEY = "cmx-lab-automations-v1";
  let queued = false;
  let manageReturnFocus = null;

  function readAutomations() {
    try {
      const value = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      return Array.isArray(value?.automations) ? value.automations : [];
    } catch {
      return [];
    }
  }

  function patchChrome() {
    const brand = document.querySelector(".v3-brand");
    if (brand) {
      brand.href = "/lab/";
      brand.setAttribute("aria-label", "Back to Continuum Lab");
      const strong = brand.querySelector(".brand-copy strong");
      const small = brand.querySelector(".brand-copy small");
      if (strong) strong.textContent = "Continuum";
      if (small) small.textContent = "LAB · AUTOMATIONS";
    }

    const boundary = document.querySelector(".v3-lab-pill");
    if (boundary && boundary.dataset.v7Boundary !== "ready") {
      boundary.innerHTML = "<i></i> LAB · EXECUTION OFF";
      boundary.dataset.v7Boundary = "ready";
    }
  }

  function patchWorkspaceActions() {
    const actions = document.querySelector(".v7-ops-actions");
    if (!actions || actions.querySelector("[data-v7-open-planner]")) return;
    const manage = actions.querySelector("[data-v7-manage]");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "v7-planner-button";
    button.dataset.v7OpenPlanner = "";
    button.innerHTML = "<span>Planner</span><b>✦</b>";
    button.setAttribute("aria-label", "Open the local typed Automation Planner");
    if (manage) manage.before(button);
    else actions.append(button);
  }

  function patchDraftSummary() {
    const ops = window.CMXAutomationOperationsV7;
    const summary = document.querySelector(".v7-ops-summary");
    if (!ops?.assess || !summary) return;
    const drafts = readAutomations().filter(item => (item.status || "Draft") === "Draft");
    const assessments = drafts.map(item => ops.assess(item));
    const values = [
      drafts.length,
      assessments.filter(item => item.readiness === "ready").length,
      assessments.filter(item => item.readiness === "needs-setup").length,
      assessments.filter(item => item.runtimeLater).length
    ];
    summary.querySelectorAll(":scope > span > strong").forEach((node, index) => {
      if (Number.isInteger(values[index])) node.textContent = String(values[index]);
    });
  }

  function openPlanner() {
    const create = document.querySelector(".v7-workspace-head [data-new], [data-new]");
    if (!create) return;
    create.click();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const planner = document.querySelector(".v4-new-modal [data-v4-start='planner']");
      planner?.click();
    }));
  }

  function patchStartModal() {
    const modal = document.querySelector(".v4-new-modal");
    if (!modal) return;
    const intro = modal.querySelector("header p");
    if (intro) intro.textContent = "Choose how to create the same editable local Draft.";

    const planner = modal.querySelector("[data-v4-start='planner']");
    if (planner) {
      const label = planner.querySelector("b");
      const title = planner.querySelector("strong");
      const copy = planner.querySelector("small");
      if (label) label.textContent = "PLANNER";
      if (title) title.textContent = "Describe the outcome";
      if (copy) copy.textContent = "Create a local typed proposal before opening the Draft.";
    }
  }

  function patchPlannerModal() {
    const modal = document.querySelector(".v4-planner-modal");
    if (!modal) return;
    const label = modal.querySelector("header span");
    const title = modal.querySelector("header h2");
    const copy = modal.querySelector("header p");
    if (label) label.textContent = "PLANNER · LOCAL PREVIEW";
    if (title) title.textContent = "Describe what you want to happen.";
    if (copy) copy.textContent = "Supported intents become a typed proposal you can inspect and edit. No model call or provider action occurs.";
  }

  function patchManageModal() {
    const modal = document.querySelector(".v7-manage-modal");
    if (!modal) return;
    modal.tabIndex = -1;
    const title = modal.querySelector("h2");
    if (title) {
      title.id = "v7ManageTitle";
      modal.setAttribute("aria-labelledby", title.id);
      modal.removeAttribute("aria-label");
    }
    if (modal.dataset.v7Focus !== "ready") {
      modal.dataset.v7Focus = "ready";
      modal.focus({ preventScroll: true });
    }
  }

  function restoreManageFocus() {
    const target = manageReturnFocus;
    manageReturnFocus = null;
    requestAnimationFrame(() => {
      if (target?.isConnected && typeof target.focus === "function") target.focus({ preventScroll: true });
    });
  }

  function collapseStackedCatalogModals() {
    const backdrops = Array.from(document.querySelectorAll(".v4-modal-backdrop"));
    if (backdrops.length < 2) return;
    backdrops.slice(0, -1).forEach(node => node.remove());
  }

  function patch() {
    queued = false;
    patchChrome();
    patchWorkspaceActions();
    patchDraftSummary();
    patchStartModal();
    patchPlannerModal();
    patchManageModal();
    collapseStackedCatalogModals();
    document.documentElement.dataset.labAutomationsOperationsPolish = "v7";
  }

  function schedulePatch() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", event => {
    const plannerButton = event.target.closest("[data-v7-open-planner]");
    if (plannerButton) {
      event.preventDefault();
      openPlanner();
    }

    const manageButton = event.target.closest("[data-v7-manage]");
    if (manageButton) manageReturnFocus = manageButton;

    if (event.target.matches(".v7-manage-backdrop")) {
      event.preventDefault();
      event.target.querySelector("[data-v7-manage-close]")?.click();
      restoreManageFocus();
      return;
    }

    if (event.target.closest("[data-v7-manage-close]")) restoreManageFocus();
    schedulePatch();
  }, false);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.querySelector(".v7-manage-modal")) restoreManageFocus();
  });
  window.addEventListener("pageshow", schedulePatch);
  window.addEventListener("cmx:lab-automations-updated", schedulePatch);
  schedulePatch();
})();