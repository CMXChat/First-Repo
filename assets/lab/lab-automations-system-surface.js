(() => {
  "use strict";

  const AUTOMATIONS_KEY = "cmx-lab-automations-v1";
  const ACTIONS_KEY = "cmx-lab-actions-v1";
  const CRM_KEY = "cmx-lab-crm-v1";
  const INVENTORY_KEY = "cmx-lab-inventory-v1";
  const ACTION_CONTROL_SELECTORS = Object.freeze([
    ["[data-move-up]", "Move up"],
    ["[data-move-down]", "Move down"],
    ["[data-duplicate-action]", "Duplicate action"],
    ["[data-toggle-action]", null],
    ["[data-remove-action]", "Remove action"]
  ]);

  let queued = false;
  let tooltipHideTimer = null;

  function readStore(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "null");
    } catch {
      return null;
    }
  }

  function countConnectedRecords() {
    const crm = readStore(CRM_KEY) || {};
    const inventory = readStore(INVENTORY_KEY) || {};
    return (crm.people?.length || 0)
      + (crm.organizations?.length || 0)
      + (inventory.documents?.length || 0)
      + (inventory.assets?.length || 0);
  }

  function countDrafts() {
    const store = readStore(AUTOMATIONS_KEY);
    return Array.isArray(store?.automations)
      ? store.automations.filter(item => (item.status || "Draft") === "Draft").length
      : 0;
  }

  function countSavedActions() {
    const store = readStore(ACTIONS_KEY);
    return Array.isArray(store?.actions) ? store.actions.length : 0;
  }

  function stat(label, value, note, tone = "") {
    return `<div class="v3-system-stat ${tone ? `is-${tone}` : ""}">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${note}</small>
    </div>`;
  }

  function actionControlLabel(button, fallback) {
    if (!button.matches("[data-toggle-action]")) return fallback;
    return button.textContent.trim() === "▶" ? "Resume action" : "Pause action";
  }

  function patchActionControlTooltips(page) {
    ACTION_CONTROL_SELECTORS.forEach(([selector, fallback]) => {
      page.querySelectorAll(selector).forEach(button => {
        const label = actionControlLabel(button, fallback);
        button.dataset.actionControlTooltip = label;
        button.setAttribute("aria-label", label);
        button.setAttribute("title", label);
      });
    });
  }

  function ensureTooltip() {
    let tooltip = document.getElementById("v3ActionControlTooltip");
    if (tooltip) return tooltip;
    tooltip = document.createElement("div");
    tooltip.id = "v3ActionControlTooltip";
    tooltip.className = "v3-action-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.hidden = true;
    document.body.appendChild(tooltip);
    return tooltip;
  }

  function positionTooltip(tooltip, target) {
    const targetRect = target.getBoundingClientRect();
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const center = targetRect.left + targetRect.width / 2;
    const x = Math.max(width / 2 + 10, Math.min(viewportWidth - width / 2 - 10, center));
    const showBelow = targetRect.top < height + 18;
    tooltip.dataset.placement = showBelow ? "bottom" : "top";
    tooltip.style.left = `${Math.round(x)}px`;
    tooltip.style.top = `${Math.round(showBelow ? targetRect.bottom + 8 : targetRect.top - 8)}px`;
  }

  function showActionTooltip(target, { temporary = false } = {}) {
    const label = target?.dataset?.actionControlTooltip;
    if (!label) return;
    clearTimeout(tooltipHideTimer);
    const tooltip = ensureTooltip();
    tooltip.textContent = label;
    tooltip.hidden = false;
    tooltip.classList.add("is-visible");
    positionTooltip(tooltip, target);
    if (temporary) tooltipHideTimer = setTimeout(hideActionTooltip, 1350);
  }

  function hideActionTooltip() {
    clearTimeout(tooltipHideTimer);
    const tooltip = document.getElementById("v3ActionControlTooltip");
    if (!tooltip) return;
    tooltip.classList.remove("is-visible");
    tooltip.hidden = true;
  }

  function tooltipTarget(node) {
    return node instanceof Element ? node.closest("[data-action-control-tooltip]") : null;
  }

  function patchDashboard() {
    const dashboard = document.querySelector(".v3-dashboard");
    if (!dashboard) return false;

    const hero = dashboard.querySelector(".v3-hero");
    const templateSection = dashboard.querySelector(".v3-template-section");
    const dashboardBar = dashboard.querySelector(".v3-dashboard-bar");
    const drafts = dashboard.querySelector(".v3-drafts");
    if (!hero || !templateSection || !dashboardBar || !drafts) return false;

    const eyebrow = hero.querySelector(".v3-eyebrow");
    const title = hero.querySelector("h1");
    const copy = hero.querySelector("p");
    if (eyebrow) eyebrow.textContent = "CONTINUUM · AUTOMATIONS";
    if (title) title.textContent = "Automations";
    if (copy) copy.textContent = "Build, test and manage private workflows. Drafts stay local to Lab and external execution remains off.";

    let deck = dashboard.querySelector(".v3-system-deck");
    if (!deck) {
      deck = document.createElement("section");
      deck.className = "v3-system-deck";
      deck.setAttribute("aria-label", "Automation workspace status");
    }
    deck.innerHTML = [
      stat("DRAFTS", String(countDrafts()), "Shared Lab workflows"),
      stat("REUSABLE ACTIONS", String(countSavedActions()), "Available from Action library"),
      stat("CONNECTED RECORDS", String(countConnectedRecords()), "People, orgs, docs and assets"),
      stat("EXECUTION", "OFF", "Simulation only", "safe")
    ].join("");

    let workHeading = dashboard.querySelector(".v3-system-section-head");
    if (!workHeading) {
      workHeading = document.createElement("div");
      workHeading.className = "v3-system-section-head";
    }
    const activeTab = dashboardBar.querySelector(".v3-tabs .is-active")?.textContent?.replace(/\s+\d+\s*$/, "")?.trim() || "Drafts";
    workHeading.innerHTML = `<div><span>WORKFLOWS</span><h2>${activeTab}</h2></div><small>Open one to continue building or testing it.</small>`;

    hero.after(deck);
    deck.after(workHeading);
    workHeading.after(dashboardBar);
    dashboardBar.after(drafts);
    drafts.after(templateSection);

    const templateEyebrow = templateSection.querySelector(".v3-section-title span");
    const templateTitle = templateSection.querySelector(".v3-section-title h2");
    const templateHint = templateSection.querySelector(".v3-section-title > small");
    if (templateEyebrow) templateEyebrow.textContent = "QUICK START";
    if (templateTitle) templateTitle.textContent = "Templates";
    if (templateHint) templateHint.textContent = "Create a draft from a starting pattern";

    dashboard.dataset.systemSurface = "ready";
    return true;
  }

  function patchEditor() {
    const page = document.querySelector(".v3-editor-page");
    if (!page) return false;

    const draftLabel = page.querySelector(".v3-title-button > span");
    if (draftLabel) draftLabel.textContent = "DRAFT";

    const liveHint = page.querySelector(".v3-live-head small");
    if (liveHint) liveHint.textContent = "Live preview";

    const context = page.querySelector(".v3-step-context");
    if (context) context.setAttribute("aria-label", context.querySelector("small")?.textContent || "Builder step");

    patchActionControlTooltips(page);
    page.dataset.systemSurface = "ready";
    return true;
  }

  function patch() {
    queued = false;
    const changed = patchDashboard() || patchEditor();
    if (changed) document.documentElement.dataset.labAutomationsSystemSurface = "ready";
  }

  function schedulePatch() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("pointerover", event => {
    const target = tooltipTarget(event.target);
    if (target && !target.contains(event.relatedTarget)) showActionTooltip(target);
  }, false);
  document.addEventListener("pointerout", event => {
    const target = tooltipTarget(event.target);
    if (target && !target.contains(event.relatedTarget)) hideActionTooltip();
  }, false);
  document.addEventListener("focusin", event => {
    const target = tooltipTarget(event.target);
    if (target) showActionTooltip(target);
  }, false);
  document.addEventListener("focusout", event => {
    if (tooltipTarget(event.target)) hideActionTooltip();
  }, false);
  document.addEventListener("pointerdown", event => {
    const target = tooltipTarget(event.target);
    if (target && event.pointerType === "touch") showActionTooltip(target, { temporary: true });
  }, false);
  document.addEventListener("click", event => {
    if (tooltipTarget(event.target)) hideActionTooltip();
    schedulePatch();
  }, false);
  document.addEventListener("input", schedulePatch, false);
  document.addEventListener("change", schedulePatch, false);
  window.addEventListener("resize", hideActionTooltip);
  window.addEventListener("scroll", hideActionTooltip, { passive: true });
  window.addEventListener("pageshow", schedulePatch);
  window.addEventListener("storage", event => {
    if ([AUTOMATIONS_KEY, ACTIONS_KEY, CRM_KEY, INVENTORY_KEY].includes(event.key)) schedulePatch();
  });
  window.addEventListener("cmx:lab-automations-updated", schedulePatch);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedulePatch, { once: true });
  } else {
    schedulePatch();
  }
})();