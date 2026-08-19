(() => {
  "use strict";

  const UI_KEY = "cmx-lab-automations-action-stack-ui-v1";
  const MOBILE_QUERY = "(max-width:760px)";
  const media = window.matchMedia(MOBILE_QUERY);
  let queued = false;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));

  function readUi() {
    try {
      const value = JSON.parse(sessionStorage.getItem(UI_KEY) || "null");
      return value && typeof value === "object" ? value : { automations: {} };
    } catch {
      return { automations: {} };
    }
  }

  function writeUi(value) {
    try { sessionStorage.setItem(UI_KEY, JSON.stringify(value)); } catch {}
  }

  function currentAutomationId(cards) {
    const fromUrl = new URLSearchParams(location.search).get("automation");
    if (fromUrl) return fromUrl;
    const ids = new Set(cards.map(card => card.dataset.actionCard).filter(Boolean));
    try {
      const store = JSON.parse(localStorage.getItem("cmx-lab-automations-v1") || "null");
      const automation = store?.automations?.find(item => (item.actions || []).some(action => ids.has(action.id)));
      return automation?.id || "current";
    } catch {
      return "current";
    }
  }

  function actionState(automationId, cards) {
    const ui = readUi();
    if (!ui.automations) ui.automations = {};
    let state = ui.automations[automationId];
    if (!state) {
      state = {
        initialized: true,
        expanded: cards.length <= 1 && cards[0]?.dataset.actionCard ? [cards[0].dataset.actionCard] : []
      };
      ui.automations[automationId] = state;
    }

    const valid = new Set(cards.map(card => card.dataset.actionCard).filter(Boolean));
    state.expanded = (state.expanded || []).filter(id => valid.has(id));
    writeUi(ui);
    return { ui, state };
  }

  function summaryFor(card) {
    const target = card.querySelector(".v3-target-button strong")?.textContent?.trim();
    const instruction = card.querySelector("[data-action-content]")?.value?.trim();
    const saved = card.querySelector(".v3-saved-action-body p")?.textContent?.trim();
    const parts = [];
    if (target && !/choose protected target|choose audience/i.test(target)) parts.push(target);
    if (instruction) parts.push(instruction);
    else if (saved) parts.push(saved);
    return parts.join(" · ") || "Tap Edit to configure this step.";
  }

  function labelControl(button, label, title = label) {
    if (!button) return;
    button.setAttribute("aria-label", label);
    button.setAttribute("title", title);
  }

  function patchControlLabels(card) {
    labelControl(card.querySelector("[data-move-up]"), "Move step up");
    labelControl(card.querySelector("[data-move-down]"), "Move step down");
    labelControl(card.querySelector("[data-duplicate-action]"), "Duplicate step");
    const toggle = card.querySelector("[data-toggle-action]");
    labelControl(toggle, toggle?.textContent?.includes("▶") ? "Resume step" : "Pause step");
    labelControl(card.querySelector("[data-remove-action]"), "Remove step");
  }

  function ensureMobileBar(card, index, total, expanded) {
    const body = card.querySelector(".v3-action-body");
    const header = body?.querySelector(":scope > header");
    if (!body || !header) return;

    let bar = body.querySelector(":scope > .v6-action-mobile-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "v6-action-mobile-bar";
      header.after(bar);
    }

    const id = card.dataset.actionCard;
    bar.innerHTML = `
      <button type="button" class="v6-action-toggle" data-v6-action-toggle="${esc(id)}" aria-expanded="${expanded ? "true" : "false"}">
        <span><small>STEP ${index + 1}</small><strong>${esc(summaryFor(card))}</strong></span>
        <b>${expanded ? "Hide" : "Edit"}</b>
      </button>
      <button type="button" class="v6-action-remove" data-v6-remove-step="${esc(id)}" ${total <= 1 ? "disabled" : ""} aria-label="${total <= 1 ? "Only step cannot be removed" : `Remove step ${index + 1}`}" title="${total <= 1 ? "Keep at least one action in this prototype" : "Remove step"}">
        <span aria-hidden="true">×</span><small>${total <= 1 ? "Only step" : "Remove"}</small>
      </button>`;
  }

  function ensureStackTools(stage, cards) {
    const stack = stage.querySelector(".v3-action-stack");
    if (!stack) return;
    let tools = stage.querySelector(".v6-action-stack-tools");
    if (!tools) {
      tools = document.createElement("div");
      tools.className = "v6-action-stack-tools";
      stack.before(tools);
    }
    tools.innerHTML = `<span><b>${cards.length} action${cards.length === 1 ? "" : "s"}</b><small>Open one step at a time on mobile.</small></span><button type="button" data-v6-collapse-all ${cards.length < 2 ? "disabled" : ""}>Collapse all</button>`;
  }

  function patch() {
    queued = false;
    const stage = document.querySelector(".v3-actions-stage");
    if (!stage) return;

    const cards = [...stage.querySelectorAll("[data-action-card]")];
    if (!cards.length) return;

    const automationId = currentAutomationId(cards);
    const { state } = actionState(automationId, cards);
    const expanded = new Set(state.expanded || []);

    stage.classList.add("v6-action-stage");
    ensureStackTools(stage, cards);

    cards.forEach((card, index) => {
      const id = card.dataset.actionCard;
      const isExpanded = expanded.has(id);
      card.classList.add("v6-action-card");
      card.classList.toggle("is-v6-expanded", isExpanded);
      card.dataset.v6ActionState = isExpanded ? "expanded" : "collapsed";
      card.draggable = !media.matches;
      patchControlLabels(card);
      ensureMobileBar(card, index, cards.length, isExpanded);
    });

    document.documentElement.dataset.labAutomationsActionStack = "v6-mobile";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  function updateExpanded(actionId, open) {
    const cards = [...document.querySelectorAll(".v3-actions-stage [data-action-card]")];
    if (!cards.length) return;
    const automationId = currentAutomationId(cards);
    const ui = readUi();
    if (!ui.automations) ui.automations = {};
    const state = ui.automations[automationId] || { initialized: true, expanded: [] };
    state.expanded = open ? [actionId] : (state.expanded || []).filter(id => id !== actionId);
    ui.automations[automationId] = state;
    writeUi(ui);
  }

  function collapseAll() {
    const cards = [...document.querySelectorAll(".v3-actions-stage [data-action-card]")];
    if (!cards.length) return;
    const automationId = currentAutomationId(cards);
    const ui = readUi();
    if (!ui.automations) ui.automations = {};
    ui.automations[automationId] = { initialized: true, expanded: [] };
    writeUi(ui);
    patch();
  }

  document.addEventListener("click", event => {
    const toggle = event.target.closest?.("[data-v6-action-toggle]");
    if (toggle) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const card = toggle.closest("[data-action-card]");
      const next = !card?.classList.contains("is-v6-expanded");
      updateExpanded(toggle.dataset.v6ActionToggle, next);
      patch();
      return;
    }

    const remove = event.target.closest?.("[data-v6-remove-step]");
    if (remove) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (remove.disabled) return;
      const card = remove.closest("[data-action-card]");
      const original = card?.querySelector("[data-remove-action]");
      if (!original || original.disabled) return;
      updateExpanded(remove.dataset.v6RemoveStep, false);
      original.click();
      schedule();
      return;
    }

    if (event.target.closest?.("[data-v6-collapse-all]")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      collapseAll();
      return;
    }

    schedule();
  }, true);

  document.addEventListener("input", schedule, true);
  document.addEventListener("change", schedule, true);
  document.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("pageshow", schedule);
  media.addEventListener?.("change", schedule);
  schedule();
})();