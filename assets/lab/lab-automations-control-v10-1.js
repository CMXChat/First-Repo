(() => {
  "use strict";

  const STORE_KEY = "cmx-lab-automations-v1";
  const AI_POLICY_KEY = "cmx-lab-automation-ai-participation-v1";
  const HISTORY_KEY = "cmxLabAutomationsNavigation";
  const MODES = [
    ["off", "Off", "No ambient AI influence in this Automation."],
    ["writing", "Writing only", "AI may help draft wording; it does not choose recipients or operate the workflow."],
    ["advisory", "Recommendations", "AI may analyze and recommend; execution remains separate."],
    ["planning", "Planning + recommendations", "AI may help shape the plan where allowed; protected rules still govern execution."],
    ["explicit", "Only explicit AI steps", "AI participates only where an AI Task/step is deliberately added."],
    ["preauthorized", "Pre-approved options", "Future AI may choose only among options already permitted by protected policy."],
  ];

  let queued = false;
  let dependencyDialog = null;
  let settleFrames = 0;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));

  function automationStore() {
    try {
      const value = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      return value && Array.isArray(value.automations) ? value : { version: 1, automations: [] };
    } catch {
      return { version: 1, automations: [] };
    }
  }

  function currentAutomation() {
    const store = automationStore();
    const fromHistory = history.state?.[HISTORY_KEY]?.snapshot?.automationId;
    if (fromHistory && fromHistory !== "__new__") {
      const found = store.automations.find(item => item.id === fromHistory);
      if (found) return found;
    }

    const title = document.querySelector(".v3-editor-page .v3-title-button strong")?.textContent?.trim();
    if (!title) return null;
    const matches = store.automations.filter(item => String(item?.name || "").trim() === title);
    return matches.length === 1 ? matches[0] : null;
  }

  function readPolicies() {
    try {
      const value = JSON.parse(localStorage.getItem(AI_POLICY_KEY) || "null");
      return value && typeof value === "object" ? value : { version: 1, automations: {} };
    } catch {
      return { version: 1, automations: {} };
    }
  }

  function modeFor(automationId) {
    return readPolicies().automations?.[automationId]?.mode || "off";
  }

  function saveMode(automationId, mode) {
    if (!automationId || !MODES.some(([value]) => value === mode)) return;
    const value = readPolicies();
    if (!value.automations) value.automations = {};
    value.automations[automationId] = {
      mode,
      updatedAt: new Date().toISOString(),
      labOnly: true,
    };
    localStorage.setItem(AI_POLICY_KEY, JSON.stringify(value));
    document.dispatchEvent(new CustomEvent("cmx:lab-automations-ai-participation-updated", {
      detail: { automationId, mode }
    }));
    schedule();
  }

  function patchDashboardTruth() {
    const dashboard = document.querySelector(".v3-dashboard");
    if (!dashboard) return;
    const manage = dashboard.querySelector("[data-v7-manage] span");
    if (manage) manage.textContent = "Manage all";
    const heroCopy = dashboard.querySelector(".v3-hero p");
    if (heroCopy) heroCopy.textContent = "Build, inspect and control Automation definitions. Execution remains off in Lab.";
    dashboard.dataset.controlV10 = "ready";
    document.documentElement.dataset.labAutomationsControl = "v10";
  }

  function settleLegacyRenders() {
    patchDashboardTruth();
    patchPermissions();
    patchTriggerSemantics();
    settleFrames += 1;
    if (settleFrames < 12) requestAnimationFrame(settleLegacyRenders);
  }

  function patchPermissions() {
    const panel = document.querySelector('.v10-control-panel[data-v10-panel="permissions"]');
    const automation = currentAutomation();
    if (!panel || !automation) return;

    const selected = modeFor(automation.id);
    let section = panel.querySelector(".v101-ai-participation");
    if (!section) {
      section = document.createElement("section");
      section.className = "v10-section v101-ai-participation";
      const firstSection = panel.querySelector(".v10-section");
      if (firstSection) firstSection.before(section);
      else panel.append(section);
    }

    section.innerHTML = `
      <header>
        <span>AI INVOLVEMENT · LAB PREVIEW</span>
        <h3>Choose where AI is allowed to influence this Automation</h3>
        <p>This setting is browser-local product design only. It does not run a model, grant a capability, create authority or change production.</p>
      </header>
      <div class="v101-ai-mode-list" role="radiogroup" aria-label="AI involvement">
        ${MODES.map(([value, label, copy]) => `
          <button type="button" role="radio" aria-checked="${selected === value ? "true" : "false"}" class="${selected === value ? "is-selected" : ""}" data-v101-ai-mode="${esc(value)}">
            <span><strong>${esc(label)}</strong><small>${esc(copy)}</small></span><i aria-hidden="true">${selected === value ? "✓" : ""}</i>
          </button>`).join("")}
      </div>
      <div class="v10-callout v101-ai-boundary">
        <strong>Participation is not authority</strong>
        <span>Future protected policy can narrow this further by step, capability, Connection, audience, data sensitivity or consequence. A narrower deny should normally win.</span>
      </div>
      <div class="v101-future-row"><span><strong>Per-step exceptions</strong><small>Example: AI may draft an email while a payment/recipient step stays AI-off.</small></span><button type="button" disabled>Backend later</button></div>`;

    panel.dataset.v101AiParticipation = selected;
    document.documentElement.dataset.labAutomationsAiParticipation = "v10-1";
  }

  function recursivelyContains(value, needle) {
    if (value == null) return false;
    if (typeof value === "string") return value === needle;
    if (Array.isArray(value)) return value.some(item => recursivelyContains(item, needle));
    if (typeof value === "object") return Object.values(value).some(item => recursivelyContains(item, needle));
    return false;
  }

  function dependenciesFor(automation, actionId) {
    const findings = [];
    const add = (key, label) => {
      if (!findings.some(item => item.key === key)) findings.push({ key, label });
    };

    (automation?.conditions || []).forEach((condition, index) => {
      if (recursivelyContains(condition?.source, actionId) || recursivelyContains(condition?.dataBinding, actionId) || condition?.sourceId === actionId) {
        add(`condition-${condition?.id || index}`, `IF condition ${index + 1} reads this step output`);
      }
    });

    (automation?.flowControls || []).forEach((control, index) => {
      if (control?.afterActionId === actionId) {
        add(`control-anchor-${control?.id || index}`, `${String(control?.type || "flow control").toUpperCase()} is anchored after this step`);
      }
      if (control?.source?.sourceId === actionId || recursivelyContains(control?.source, actionId)) {
        add(`control-source-${control?.id || index}`, `${String(control?.type || "flow control").toUpperCase()} reads this step output`);
      }
    });

    (automation?.actions || []).forEach((action, index) => {
      if (action?.id === actionId) return;
      const fields = {
        inputBindings: action?.inputBindings,
        dataBindings: action?.dataBindings,
        bindings: action?.bindings,
        inputs: action?.inputs,
        source: action?.source,
      };
      Object.entries(fields).forEach(([field, value]) => {
        if (recursivelyContains(value, actionId)) {
          add(`action-${action?.id || index}-${field}`, `Step ${index + 1} uses this step through ${field}`);
        }
      });
    });

    return findings;
  }

  function closeDependencyDialog() {
    dependencyDialog?.remove();
    dependencyDialog = null;
  }

  function openDependencyDialog(button, automation, actionId, dependencies) {
    closeDependencyDialog();
    const actions = automation?.actions || [];
    const index = actions.findIndex(action => action?.id === actionId);
    const action = actions[index];
    const label = action?.actionLabel || action?.type || `Step ${index + 1}`;

    const layer = document.createElement("div");
    layer.className = "v101-dependency-layer";
    layer.dataset.v101DependencyDialog = "";
    layer.innerHTML = `
      <section class="v101-dependency-dialog" role="dialog" aria-modal="true" aria-labelledby="v101DependencyTitle" tabindex="-1">
        <span>DEPENDENCY CHECK · LAB LOCAL</span>
        <h2 id="v101DependencyTitle">Remove “${esc(label)}”?</h2>
        <p>This step is referenced by ${dependencies.length} other part${dependencies.length === 1 ? "" : "s"} of the Draft. Removing it now can leave the workflow invalid.</p>
        <div class="v101-dependency-list">
          ${dependencies.map(item => `<article><i>↳</i><span><strong>${esc(item.label)}</strong><small>Review or repair this reference before removal.</small></span></article>`).join("")}
        </div>
        <div class="v10-callout"><strong>Protected backend direction</strong><span>The real service will return typed impact findings and atomic repair options. This Lab guard prevents accidental silent breakage but does not implement server repair semantics.</span></div>
        <div class="v101-dependency-actions">
          <button type="button" data-v101-dependency-cancel>Keep step</button>
          <button type="button" data-v101-review-flow>Review flow</button>
          <button type="button" class="is-danger" data-v101-remove-anyway>Remove anyway in Lab</button>
        </div>
      </section>`;
    document.body.append(layer);
    dependencyDialog = layer;

    layer.querySelector("[data-v101-dependency-cancel]")?.addEventListener("click", closeDependencyDialog);
    layer.querySelector("[data-v101-review-flow]")?.addEventListener("click", () => {
      closeDependencyDialog();
      document.querySelector('[data-v10-tab="definition"]')?.click();
      requestAnimationFrame(() => document.querySelector(".v3-actions-stage")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    });
    layer.querySelector("[data-v101-remove-anyway]")?.addEventListener("click", () => {
      closeDependencyDialog();
      button.dataset.v101Confirmed = "1";
      button.click();
    });
    layer.addEventListener("click", event => {
      if (event.target === layer) closeDependencyDialog();
    });
    requestAnimationFrame(() => layer.querySelector(".v101-dependency-dialog")?.focus({ preventScroll: true }));
  }

  function patchTriggerSemantics() {
    const triggerControl = document.querySelector(".v3-editor-page [data-trigger]");
    const stage = triggerControl?.closest(".v3-stage-section");
    if (!stage || stage.querySelector(".v101-structural-note")) return;
    const note = document.createElement("div");
    note.className = "v101-structural-note";
    note.innerHTML = `<strong>Trigger is structural</strong><span>A valid workflow keeps one Trigger. Change it by editing or replacing it rather than leaving the definition without one.</span>`;
    const header = stage.querySelector(":scope > header");
    if (header) header.insertAdjacentElement("afterend", note);
    else stage.prepend(note);
  }

  function patch() {
    queued = false;
    patchDashboardTruth();
    patchPermissions();
    patchTriggerSemantics();
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  window.CMXAutomationControlV101 = {
    modes: MODES.map(([value, label]) => ({ value, label })),
    dependenciesFor,
  };

  document.addEventListener("click", event => {
    const mode = event.target.closest?.("[data-v101-ai-mode]");
    if (mode) {
      event.preventDefault();
      const automation = currentAutomation();
      if (automation) saveMode(automation.id, mode.dataset.v101AiMode);
      return;
    }

    const removeButton = event.target.closest?.("[data-remove-action]");
    if (removeButton) {
      if (removeButton.dataset.v101Confirmed === "1") {
        delete removeButton.dataset.v101Confirmed;
        return;
      }
      const card = removeButton.closest("[data-action-card]");
      const automation = currentAutomation();
      const actionId = card?.dataset?.actionCard;
      if (!automation || !actionId) return;
      const dependencies = dependenciesFor(automation, actionId);
      if (!dependencies.length) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openDependencyDialog(removeButton, automation, actionId, dependencies);
      return;
    }

    if (event.target.closest?.("[data-v101-dependency-cancel]")) {
      event.preventDefault();
      closeDependencyDialog();
      return;
    }

    settleFrames = 0;
    schedule();
    requestAnimationFrame(settleLegacyRenders);
  }, true);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && dependencyDialog) {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeDependencyDialog();
    }
  }, true);

  document.addEventListener("cmx:lab-automations-updated", () => {
    settleFrames = 0;
    schedule();
    requestAnimationFrame(settleLegacyRenders);
  });
  document.addEventListener("cmx:lab-automations-ai-participation-updated", schedule);
  window.addEventListener("pageshow", () => {
    settleFrames = 0;
    schedule();
    requestAnimationFrame(settleLegacyRenders);
  });
  window.addEventListener("popstate", schedule);
  schedule();
  requestAnimationFrame(settleLegacyRenders);
})();
