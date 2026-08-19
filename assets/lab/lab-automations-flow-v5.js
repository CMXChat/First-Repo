(() => {
  "use strict";

  const STORE_KEY = "cmx-lab-automations-v1";
  let queued = false;
  const expanded = new Map();

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));

  function readStore() {
    try {
      const value = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      return value && Array.isArray(value.automations) ? value : { automations: [] };
    } catch {
      return { automations: [] };
    }
  }

  function currentAutomation() {
    const store = readStore();
    const id = new URLSearchParams(location.search).get("automation");
    let automation = id ? store.automations.find(item => item.id === id) : null;
    if (!automation) {
      const actionIds = [...document.querySelectorAll("[data-action-card]")].map(card => card.dataset.actionCard).filter(Boolean);
      automation = store.automations.find(item => (item.actions || []).some(action => actionIds.includes(action.id))) || null;
    }
    if (!automation && document.querySelector(".v3-editor-page")) automation = store.automations[0] || null;
    return automation || null;
  }

  function flowNode(flow, prefix) {
    return [...flow.querySelectorAll(".v3-flow-node")].find(node => node.querySelector(":scope > span")?.textContent.trim().toUpperCase().startsWith(prefix));
  }

  function stageTruth(flow) {
    const when = flowNode(flow, "WHEN");
    const rule = flowNode(flow, "IF");
    const timing = flowNode(flow, "WAIT");
    const finish = flowNode(flow, "FINISH");
    const actions = [...flow.querySelectorAll(".v3-flow-node")].filter(node => node.querySelector(":scope > span")?.textContent.trim().toUpperCase().startsWith("DO"));
    return {
      trigger: Boolean(when && !when.classList.contains("is-pending")),
      rules: Boolean(rule && !rule.classList.contains("is-pending")),
      actions: Boolean(actions.length && actions.every(node => !node.classList.contains("is-pending"))),
      timing: Boolean(timing && !timing.classList.contains("is-pending")),
      finish: Boolean(finish && !finish.classList.contains("is-pending")),
      timingText: timing?.querySelector("strong")?.textContent.trim() || "Not set yet"
    };
  }

  function triggerLabel(id) {
    return ({ grace_start: "Grace begins", grace_expiry: "Grace expires", manual: "Manual start", calendar: "Calendar time" }[id] || id || "Choose a trigger");
  }

  function preconditionLabel(type) {
    return ({
      not_acknowledged: "No acknowledgement",
      switch_in_grace: "Still in grace",
      previous_failed: "Earlier action failed"
    }[type] || type || "Condition");
  }

  function actionLabel(action) {
    if (action?.type === "action_ref") return action.actionLabel || "Saved action";
    return ({ notify: "Notify", email: "Email", ai_task: "AI task", manual_review: "Manual review" }[action?.type] || action?.type || "Action");
  }

  function finishLabel(outcome) {
    return ({ end: "End workflow", success: "Continue on success", no_ack: "Escalate if not acknowledged", review: "Require review" }[outcome] || outcome || "Finish");
  }

  function operatorLabel(operator) {
    return ({ equals: "equals", not_equals: "does not equal", contains: "contains", greater_than: "is greater than", less_than: "is less than", is_true: "is true" }[operator] || operator || "matches");
  }

  function waitLabel(duration = {}) {
    const parts = [];
    if (Number(duration.days)) parts.push(`${Number(duration.days)}d`);
    if (Number(duration.hours)) parts.push(`${Number(duration.hours)}h`);
    if (Number(duration.minutes)) parts.push(`${Number(duration.minutes)}m`);
    return parts.length ? `Wait ${parts.join(" ")}` : "Wait duration not set";
  }

  function truncate(value, max = 92) {
    const text = String(value || "").trim().replace(/\s+/g, " ");
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
  }

  function nodeView(node, truth) {
    if (node.kind === "trigger") {
      return truth.trigger
        ? { badge: "WHEN", tone: "trigger", title: triggerLabel(node.capabilityId), detail: "Workflow trigger", stage: 0 }
        : { badge: "WHEN", tone: "pending", title: "Choose a trigger", detail: "Nothing selected yet", stage: 0 };
    }
    if (node.kind === "condition" && node.phase === "pre") {
      if (!truth.rules) return null;
      return { badge: "IF", tone: "condition", title: preconditionLabel(node.conditionType), detail: "Pre-action rule", stage: 1 };
    }
    if (node.kind === "action") {
      if (!truth.actions) return null;
      return {
        badge: "DO",
        tone: "action",
        title: actionLabel(node.action),
        detail: truncate(node.action?.content) || "Configured action",
        stage: 2
      };
    }
    if (node.kind === "condition" && node.phase === "sequence") {
      if (!truth.actions) return null;
      const op = operatorLabel(node.operator);
      const suffix = node.operator === "is_true" ? "" : ` ${node.compareValue || "…"}`;
      return {
        badge: "IF",
        tone: "sequence-condition",
        title: `${node.source?.label || "Flow data"} ${op}${suffix}`,
        detail: "Inter-step linear gate · Runtime later",
        stage: 2
      };
    }
    if (node.kind === "wait" && node.phase === "sequence") {
      if (!truth.actions) return null;
      return { badge: "WAIT", tone: "wait", title: waitLabel(node.duration), detail: "Persisted inter-step delay · Runtime later", stage: 2 };
    }
    if (node.kind === "finish") {
      return truth.finish
        ? { badge: "FINISH", tone: "finish", title: finishLabel(node.outcome), detail: "End behavior", stage: 4 }
        : { badge: "FINISH", tone: "pending", title: "Not set yet", detail: "Choose what happens at the end", stage: 4 };
    }
    return null;
  }

  function renderRows(model, truth) {
    const rows = [];
    const hasPreconditions = model.nodes.some(node => node.kind === "condition" && node.phase === "pre");
    const hasActions = model.nodes.some(node => node.kind === "action");

    model.nodes.forEach(node => {
      const view = nodeView(node, truth);
      if (view) rows.push(view);
      if (node.kind === "trigger" && truth.rules && !hasPreconditions) {
        rows.push({ badge: "IF", tone: "condition", title: "Always continue", detail: "No pre-action rule", stage: 1 });
      }
    });

    if (!truth.rules && rows.length) {
      const triggerIndex = rows.findIndex(row => row.badge === "WHEN");
      rows.splice(triggerIndex + 1, 0, { badge: "IF", tone: "pending", title: "Not set yet", detail: "Optional rule step", stage: 1 });
    }
    if (!truth.actions) {
      const finishIndex = rows.findIndex(row => row.badge === "FINISH");
      const insertAt = finishIndex >= 0 ? finishIndex : rows.length;
      rows.splice(insertAt, 0, { badge: "DO", tone: "pending", title: "Choose an action", detail: "Nothing selected yet", stage: 2 });
    } else if (!hasActions) {
      rows.push({ badge: "DO", tone: "pending", title: "Choose an action", detail: "Nothing selected yet", stage: 2 });
    }
    return rows;
  }

  function complexity(model) {
    const summary = window.CMXAutomationModelV5?.summary?.(model);
    if (!summary) return 0;
    return summary.actions + summary.sequenceConditions * 2 + summary.waits * 2 + summary.preconditions;
  }

  function patchFlow(flow, automation, model) {
    const truth = stageTruth(flow);
    const rows = renderRows(model, truth);
    const complex = complexity(model) > 2;
    if (!expanded.has(automation.id)) expanded.set(automation.id, complex);
    const isExpanded = expanded.get(automation.id) === true;

    let section = flow.parentElement?.querySelector(":scope > .v5-ordered-flow");
    if (!section) {
      section = document.createElement("section");
      section.className = "v5-ordered-flow";
      flow.after(section);
    }

    section.dataset.expanded = String(isExpanded);
    section.innerHTML = `
      <header>
        <div><span>ORDERED SEQUENCE</span><strong>${rows.length} visible step${rows.length === 1 ? "" : "s"}</strong></div>
        <button type="button" data-v5-sequence-toggle="${esc(automation.id)}" aria-expanded="${isExpanded}">${isExpanded ? "Hide" : "Show"}</button>
      </header>
      ${isExpanded ? `<div class="v5-sequence-list">${rows.map((row, index) => `
        <button type="button" class="v5-sequence-node is-${esc(row.tone)}" data-v5-flow-stage="${row.stage}">
          <b>${esc(row.badge)}</b>
          <span><strong>${esc(row.title)}</strong><small>${esc(row.detail)}</small></span>
          <i>${index < rows.length - 1 ? "↓" : "✓"}</i>
        </button>`).join("")}</div>
        <button type="button" class="v5-start-policy ${truth.timing ? "" : "is-pending"}" data-v5-flow-stage="3"><b>START</b><span><strong>${esc(truth.timing ? truth.timingText : "Not set yet")}</strong><small>${truth.timing ? "Start timing / recurrence" : "Confirm when Actions may start"}</small></span><i>›</i></button>` : ""}
      <footer><span>V5 MODEL</span><small>${complex ? "Full ordered flow" : "Simple flow"} · Runtime ${model.nodes.some(node => node.kind === "wait" || (node.kind === "condition" && node.phase === "sequence")) ? "required for advanced controls" : "off"}</small></footer>`;
  }

  function patch() {
    queued = false;
    const api = window.CMXAutomationModelV5;
    const automation = currentAutomation();
    if (!api || !automation || !document.querySelector(".v3-editor-page")) return;
    const model = api.build(automation);
    const verdict = api.validate(model);
    if (!verdict.ok) return;

    document.querySelectorAll(".v3-live-panel .v3-flow,.v3-mobile-flow .v3-flow").forEach(flow => patchFlow(flow, automation, model));
    document.documentElement.dataset.labAutomationsFlow = "v5";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(patch)));
  }

  document.addEventListener("click", event => {
    const toggle = event.target.closest?.("[data-v5-sequence-toggle]");
    if (toggle) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const id = toggle.dataset.v5SequenceToggle;
      expanded.set(id, expanded.get(id) !== true);
      schedule();
      return;
    }

    const node = event.target.closest?.("[data-v5-flow-stage]");
    if (node) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const stage = Number(node.dataset.v5FlowStage);
      if (!Number.isFinite(stage)) return;
      const target = document.querySelector(`.v3-stage-rail [data-stage="${stage}"]`);
      if (target && !target.disabled) target.click();
      return;
    }
    schedule();
  }, true);

  document.addEventListener("input", schedule, true);
  document.addEventListener("change", schedule, true);
  document.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("storage", event => { if (event.key === STORE_KEY) schedule(); });
  window.addEventListener("pageshow", schedule);
  schedule();
})();