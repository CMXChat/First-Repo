(() => {
  "use strict";

  let queued = false;

  function stageLabel(button) {
    const raw = button?.textContent?.replace(/\s+/g, " ").trim() || "";
    if (!raw) return "Step";
    return raw.replace(/^\d+\s*/, "");
  }

  function ensureStageShell(page, head, shell) {
    const rail = page.querySelector(".v3-stage-rail");
    if (!rail || !shell) return;

    let layout = page.querySelector(":scope > .v11-builder-layout");
    if (!layout) {
      layout = document.createElement("div");
      layout.className = "v11-builder-layout";
      shell.before(layout);
    }

    let stageShell = layout.querySelector(":scope > .v11-stage-shell");
    if (!stageShell) {
      stageShell = document.createElement("aside");
      stageShell.className = "v11-stage-shell";
      stageShell.setAttribute("aria-label", "Automation definition steps");
      stageShell.innerHTML = `<div class="v11-stage-heading"><span>DEFINITION</span><strong>Build flow</strong><small>Choose a step to edit.</small></div>`;
      layout.append(stageShell);
    }

    if (rail.parentElement !== stageShell) stageShell.append(rail);
    if (shell.parentElement !== layout) layout.append(shell);

    rail.querySelectorAll("[data-stage]").forEach((button, index) => {
      button.dataset.v11Step = String(index + 1);
      button.setAttribute("aria-label", `Step ${index + 1}: ${stageLabel(button)}`);
    });

    if (head) head.dataset.v11StageMoved = "true";
  }

  function ensureManageToggle(page, head) {
    const bar = head?.querySelector(".v10-object-bar");
    if (!bar) return;

    const state = bar.querySelector(".v10-object-state");
    if (state) {
      const small = state.querySelector("small");
      const readiness = page.querySelector(".v7-editor-status span:first-child strong")?.textContent?.trim() || "Draft definition";
      const model = page.querySelector(".v7-editor-status span:nth-child(2) strong")?.textContent?.trim() || "V5";
      const execution = page.querySelector(".v7-editor-status .is-off strong")?.textContent?.trim() || "OFF";
      if (small) small.textContent = `${readiness} · Model ${model} · Execution ${execution}`;
    }

    if (!bar.querySelector("[data-v11-manage]")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "v11-manage-toggle";
      button.dataset.v11Manage = "";
      button.setAttribute("aria-expanded", "false");
      button.textContent = "Manage";
      const menu = bar.querySelector(".v10-object-menu");
      if (menu) menu.before(button); else bar.append(button);
    }
  }

  function patchDefinition(page) {
    const head = page.querySelector(".v3-editor-head");
    const shell = page.querySelector(".v3-editor-shell");
    if (!head || !shell) return false;

    const isDefinition = (page.dataset.v10View || "definition") === "definition";
    page.dataset.workspaceV11 = "ready";
    page.dataset.v11Definition = isDefinition ? "true" : "false";

    if (!isDefinition) return true;

    ensureManageToggle(page, head);
    ensureStageShell(page, head, shell);

    const flowToggle = page.querySelector(".v8-flow-toggle");
    if (flowToggle) {
      flowToggle.setAttribute("aria-label", page.dataset.flowPreviewCollapsed === "true" ? "Expand flow preview" : "Collapse flow preview");
      flowToggle.title = flowToggle.getAttribute("aria-label");
    }

    document.documentElement.dataset.automationsWorkspace = "v11";
    return true;
  }

  function patch() {
    queued = false;
    const page = document.querySelector(".v3-editor-page");
    if (!page) return;
    patchDefinition(page);
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", event => {
    const target = event.target.closest("button,a");
    if (!target) return;

    if (target.matches("[data-v11-manage]")) {
      const page = target.closest(".v3-editor-page");
      if (!page) return;
      const next = page.dataset.v11ManageOpen !== "true";
      page.dataset.v11ManageOpen = next ? "true" : "false";
      target.setAttribute("aria-expanded", String(next));
      event.preventDefault();
      return;
    }

    if (target.matches("[data-v10-tab]")) {
      const page = target.closest(".v3-editor-page");
      if (page) page.dataset.v11ManageOpen = "false";
    }

    schedule();
  }, true);

  window.addEventListener("pageshow", schedule);
  window.addEventListener("popstate", schedule);
  document.addEventListener("cmx:v10-editor-bootstrap", schedule);
  document.addEventListener("cmx:lab-automations-updated", schedule);

  const app = document.getElementById("automationApp");
  if (app) new MutationObserver(schedule).observe(app, { childList: true, subtree: true });

  schedule();
})();
