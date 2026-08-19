(() => {
  "use strict";

  const AUTOMATIONS_KEY = "cmx-lab-automations-v1";
  const CONTROLS_KEY = "cmx-lab-automation-flow-controls-v1";
  let modal = null;
  let queued = false;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));
  const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function readAutomationStore() {
    const value = readJson(AUTOMATIONS_KEY, null);
    return value && Array.isArray(value.automations) ? value : { version: 1, automations: [] };
  }

  function currentContext() {
    const store = readAutomationStore();
    const id = new URLSearchParams(location.search).get("automation");
    let automation = id ? store.automations.find(item => item.id === id) : null;
    if (!automation) {
      const actionIds = [...document.querySelectorAll("[data-action-card]")].map(card => card.dataset.actionCard).filter(Boolean);
      automation = store.automations.find(item => (item.actions || []).some(action => actionIds.includes(action.id))) || null;
    }
    if (!automation && document.querySelector(".v3-editor-page")) automation = store.automations[0] || null;
    return automation ? { store, automation } : null;
  }

  function controlsFor(automation) {
    const v5 = window.CMXAutomationModelV5;
    if (v5?.getFlowControls) {
      try {
        const controls = v5.getFlowControls(automation);
        if (Array.isArray(controls)) return controls;
      } catch {}
    }

    const fallback = readJson(CONTROLS_KEY, { version: 1, automations: {} });
    const saved = fallback?.automations?.[automation.id] || [];
    const inline = Array.isArray(automation.flowControls) ? automation.flowControls : [];
    const raw = inline.length ? inline : saved;
    const validAnchors = new Set((automation.actions || []).slice(0, -1).map(action => action.id));
    return raw.filter(control => control?.id && validAnchors.has(control.afterActionId) && ["condition", "wait"].includes(control.type));
  }

  function persistControls(context, controls) {
    const v5 = window.CMXAutomationModelV5;
    if (v5?.setFlowControls) {
      try {
        const model = v5.setFlowControls(context.automation.id, controls);
        if (model) return;
      } catch (error) {
        console.warn("Automations v5 flow-control write fell back to compatibility persistence.", error);
      }
    }

    const store = readJson(CONTROLS_KEY, { version: 1, automations: {} });
    if (!store.automations) store.automations = {};
    store.automations[context.automation.id] = controls;
    localStorage.setItem(CONTROLS_KEY, JSON.stringify(store));

    context.automation.flowControls = controls;
    context.automation.updatedAt = new Date().toISOString();
    localStorage.setItem(AUTOMATIONS_KEY, JSON.stringify(context.store));
    document.dispatchEvent(new CustomEvent("cmx:lab-automations-updated", { detail: { automationId: context.automation.id, reason: "flow-control" } }));
    window.dispatchEvent(new CustomEvent("cmx:lab-automations-updated", { detail: { automationId: context.automation.id, reason: "flow-control" } }));
  }

  function actionLabel(action) {
    return ({ notify: "Notify", email: "Email", ai_task: "AI task", manual_review: "Manual review" }[action?.type] || action?.actionLabel || "Action");
  }

  function triggerLabel(trigger) {
    return ({ grace_start: "Grace begins", grace_expiry: "Grace expires", manual: "Manual start", calendar: "Calendar time" }[trigger] || "Trigger");
  }

  function sourceDefinitions(automation, afterActionId) {
    const actionIndex = (automation.actions || []).findIndex(action => action.id === afterActionId);
    const sources = [
      { sourceType: "trigger", sourceId: automation.trigger || "trigger", path: "event_type", label: "Trigger type", detail: triggerLabel(automation.trigger) },
      { sourceType: "trigger", sourceId: automation.trigger || "trigger", path: "occurred_at", label: "Trigger time", detail: "Normalized event time" }
    ];

    (automation.actions || []).slice(0, actionIndex + 1).forEach((action, index) => {
      const base = { sourceType: "step", sourceId: action.id };
      if (action.type === "ai_task") {
        sources.push({ ...base, path: "output.summary", label: `Step ${index + 1} · AI summary`, detail: "Structured summary output" });
        sources.push({ ...base, path: "output.priority", label: `Step ${index + 1} · AI priority`, detail: "Structured priority output" });
        sources.push({ ...base, path: "output.status", label: `Step ${index + 1} · AI status`, detail: "Task outcome" });
      } else if (action.type === "manual_review") {
        sources.push({ ...base, path: "output.decision", label: `Step ${index + 1} · Review decision`, detail: "Future human decision" });
      } else {
        sources.push({ ...base, path: "output.status", label: `Step ${index + 1} · ${actionLabel(action)} status`, detail: "Step outcome" });
        sources.push({ ...base, path: "output.resolved_people", label: `Step ${index + 1} · Resolved people`, detail: "Resolved recipient count" });
      }
    });
    return sources;
  }

  function conditionSummary(control) {
    const op = ({ equals: "equals", not_equals: "does not equal", contains: "contains", greater_than: "is greater than", less_than: "is less than", is_true: "is true" }[control.operator] || control.operator);
    return `${control.source?.label || "Choose data"} ${op}${control.operator === "is_true" ? "" : ` ${control.compareValue || "…"}`}`;
  }

  function waitSummary(control) {
    const d = control.duration || {};
    const parts = [];
    if (Number(d.days)) parts.push(`${Number(d.days)}d`);
    if (Number(d.hours)) parts.push(`${Number(d.hours)}h`);
    if (Number(d.minutes)) parts.push(`${Number(d.minutes)}m`);
    return parts.join(" ") || "Set duration";
  }

  function patchFlowSummary(context) {
    const controls = controlsFor(context.automation);
    const nodes = [...document.querySelectorAll(".v3-flow-node")];
    const doNode = nodes.find(node => node.querySelector(":scope > span")?.textContent.trim().toUpperCase().startsWith("DO"));
    if (!doNode) return;

    let badge = doNode.querySelector(".v44-flow-summary");
    if (!controls.length) {
      badge?.remove();
      return;
    }

    if (!badge) {
      badge = document.createElement("small");
      badge.className = "v44-flow-summary";
      const open = doNode.querySelector(".v4-flow-open");
      if (open) open.before(badge); else doNode.append(badge);
    }

    const conditions = controls.filter(control => control.type === "condition").length;
    const waits = controls.filter(control => control.type === "wait").length;
    badge.textContent = `${conditions} IF · ${waits} WAIT`;
    badge.title = "Advanced inter-step flow controls · Lab preview";
  }

  function patchSequence(context) {
    const stage = document.querySelector(".v3-actions-stage");
    const stack = stage?.querySelector(".v3-action-stack");
    if (!stage || !stack) return;

    let intro = stage.querySelector(".v44-sequence-intro");
    if (!intro) {
      intro = document.createElement("section");
      intro.className = "v44-sequence-intro";
      stack.before(intro);
    }
    intro.innerHTML = `<div><span>ADVANCED FLOW · PREVIEW</span><strong>Logic can live between Actions.</strong><small>Explore future inter-step IF and WAIT controls. Runtime is still off.</small></div><b>LAB PREVIEW</b>`;

    stack.querySelectorAll(".v44-between").forEach(node => node.remove());
    const actions = context.automation.actions || [];
    const controls = controlsFor(context.automation);
    const cards = [...stack.querySelectorAll("[data-action-card]")];

    cards.forEach((card, index) => {
      if (index >= actions.length - 1) return;
      const action = actions.find(item => item.id === card.dataset.actionCard) || actions[index];
      const next = actions[index + 1];
      if (!action || !next) return;
      const atPoint = controls.filter(control => control.afterActionId === action.id);
      const connector = document.createElement("section");
      connector.className = "v44-between";
      connector.dataset.afterAction = action.id;
      connector.innerHTML = `<div class="v44-line"><i></i><span>${index + 1} → ${index + 2}</span><i></i></div>
        ${atPoint.length ? `<div class="v44-controls">${atPoint.map(control => `<article class="${control.type === "wait" ? "is-wait" : "is-condition"}"><b>${control.type === "wait" ? "WAIT" : "IF"}</b><span><strong>${esc(control.type === "wait" ? waitSummary(control) : conditionSummary(control))}</strong><small>${control.type === "wait" ? "Persist between steps in future Runtime." : "Continue the remaining linear path only when true."}</small></span><button type="button" data-v44-remove="${esc(control.id)}" aria-label="Remove flow control">×</button></article>`).join("")}</div>` : ""}
        <button type="button" class="v44-add" data-v44-add="${esc(action.id)}"><span>＋</span><strong>Add logic between steps</strong><small>Continue if… or wait before Step ${index + 2}</small></button>`;
      card.after(connector);
    });
  }

  function patchReview(context) {
    const review = document.querySelector(".v3-review-side");
    if (!review) return;
    const controls = controlsFor(context.automation);
    let block = review.querySelector(".v44-sequence-preflight");
    if (!block) {
      block = document.createElement("section");
      block.className = "v44-sequence-preflight";
      review.append(block);
    }
    const conditions = controls.filter(control => control.type === "condition").length;
    const waits = controls.filter(control => control.type === "wait").length;
    block.innerHTML = `<span>ADVANCED FLOW</span><div><strong>${controls.length} inter-step control${controls.length === 1 ? "" : "s"}</strong><small>${conditions} IF · ${waits} WAIT · Lab preview only</small></div><b>${controls.length ? "RUNTIME REQUIRED" : "OPTIONAL"}</b>`;
  }

  function openAdd(afterActionId) {
    closeModal();
    const context = currentContext();
    if (!context) return;
    const action = (context.automation.actions || []).find(item => item.id === afterActionId);
    const index = (context.automation.actions || []).findIndex(item => item.id === afterActionId);
    if (!action || index < 0 || index >= context.automation.actions.length - 1) return;

    modal = document.createElement("div");
    modal.className = "v44-backdrop";
    modal.innerHTML = `<section class="v44-modal" role="dialog" aria-modal="true" aria-labelledby="v44Title">
      <header><div><span>ADVANCED FLOW · PREVIEW</span><h2 id="v44Title">Between Step ${index + 1} and Step ${index + 2}</h2><p>Add a linear gate or an inter-step wait. These controls are stored only as Lab authoring intent and are not executable by current Runtime.</p></div><button type="button" data-v44-close aria-label="Close">×</button></header>
      <div class="v44-type-grid"><button type="button" data-v44-type="condition"><b>IF</b><strong>Continue if…</strong><small>Use Trigger or earlier-step data to gate the remaining path.</small></button><button type="button" data-v44-type="wait"><b>WAIT</b><strong>Wait between steps</strong><small>Represent a future persisted delay before the next Action.</small></button></div>
      <footer><span>Future Runtime control · no execution</span><button type="button" data-v44-close>Cancel</button></footer>
    </section>`;
    modal.dataset.afterAction = afterActionId;
    document.body.append(modal);
    document.body.classList.add("v44-open");
  }

  function openCondition(afterActionId) {
    const context = currentContext();
    if (!context || !modal) return;
    const sources = sourceDefinitions(context.automation, afterActionId);
    modal.querySelector(".v44-modal").innerHTML = `<header><div><span>IF · LINEAR GATE</span><h2>Continue if…</h2><p>Choose only data that exists by this point in the flow.</p></div><button type="button" data-v44-close aria-label="Close">×</button></header>
      <div class="v44-form"><label><span>DATA SOURCE</span><select data-v44-source><option value="">Choose typed data</option>${sources.map(source => `<option value="${esc(`${source.sourceType}|${source.sourceId}|${source.path}`)}" data-label="${esc(source.label)}">${esc(source.label)}</option>`).join("")}</select></label><label><span>OPERATOR</span><select data-v44-operator><option value="equals">Equals</option><option value="not_equals">Does not equal</option><option value="contains">Contains</option><option value="greater_than">Is greater than</option><option value="less_than">Is less than</option><option value="is_true">Is true</option></select></label><label class="v44-compare"><span>VALUE</span><input type="text" data-v44-value placeholder="Example: urgent"></label><aside><b>LINEAR GATE</b><p>If false, the remaining path stops in this preview. Branching into YES/NO paths remains a later capability.</p></aside></div>
      <footer><span>Typed source reference · no expression code</span><div><button type="button" data-v44-back>Back</button><button type="button" class="primary" data-v44-save-condition>Use condition</button></div></footer>`;
  }

  function openWait() {
    if (!modal) return;
    modal.querySelector(".v44-modal").innerHTML = `<header><div><span>WAIT · BETWEEN STEPS</span><h2>How long before the next Action?</h2><p>This is deliberately separate from the existing start-timing stage.</p></div><button type="button" data-v44-close aria-label="Close">×</button></header>
      <div class="v44-form v44-duration"><label><span>DAYS</span><input type="number" min="0" max="365" value="0" data-v44-days></label><label><span>HOURS</span><input type="number" min="0" max="23" value="1" data-v44-hours></label><label><span>MINUTES</span><input type="number" min="0" max="59" value="0" data-v44-minutes></label><aside><b>PERSISTED WAIT LATER</b><p>Future Runtime must store the due time so server restarts do not lose the workflow.</p></aside></div>
      <footer><span>Lab authoring preview · Runtime off</span><div><button type="button" data-v44-back>Back</button><button type="button" class="primary" data-v44-save-wait>Use wait</button></div></footer>`;
  }

  function selectedSource() {
    const select = modal?.querySelector("[data-v44-source]");
    if (!select?.value) return null;
    const [sourceType, sourceId, ...pathParts] = select.value.split("|");
    return { sourceType, sourceId, path: pathParts.join("|"), label: select.selectedOptions[0]?.dataset.label || select.selectedOptions[0]?.textContent || "Data" };
  }

  function saveCondition() {
    const context = currentContext();
    if (!context || !modal) return;
    const source = selectedSource();
    const operator = modal.querySelector("[data-v44-operator]")?.value || "equals";
    const compareValue = modal.querySelector("[data-v44-value]")?.value.trim() || "";
    if (!source) {
      modal.querySelector("[data-v44-source]")?.focus();
      return;
    }
    if (operator !== "is_true" && !compareValue) {
      modal.querySelector("[data-v44-value]")?.focus();
      return;
    }
    const controls = controlsFor(context.automation);
    controls.push({ id: makeId("gate"), type: "condition", afterActionId: modal.dataset.afterAction, source, operator, compareValue, enabled: true });
    persistControls(context, controls);
    closeModal();
    reloadExact(context.automation.id);
  }

  function saveWait() {
    const context = currentContext();
    if (!context || !modal) return;
    const duration = {
      days: Math.min(365, Math.max(0, Number(modal.querySelector("[data-v44-days]")?.value) || 0)),
      hours: Math.min(23, Math.max(0, Number(modal.querySelector("[data-v44-hours]")?.value) || 0)),
      minutes: Math.min(59, Math.max(0, Number(modal.querySelector("[data-v44-minutes]")?.value) || 0))
    };
    if (!duration.days && !duration.hours && !duration.minutes) {
      modal.querySelector("[data-v44-minutes]")?.focus();
      return;
    }
    const controls = controlsFor(context.automation);
    controls.push({ id: makeId("wait"), type: "wait", afterActionId: modal.dataset.afterAction, duration, enabled: true });
    persistControls(context, controls);
    closeModal();
    reloadExact(context.automation.id);
  }

  function removeControl(id) {
    const context = currentContext();
    if (!context) return;
    const controls = controlsFor(context.automation).filter(control => control.id !== id);
    persistControls(context, controls);
    reloadExact(context.automation.id);
  }

  function reloadExact(id) {
    const url = new URL(location.href);
    url.search = "";
    url.searchParams.set("automation", id);
    url.searchParams.set("from", "sequence-preview");
    location.assign(url.toString());
  }

  function closeModal() {
    modal?.remove();
    modal = null;
    document.body.classList.remove("v44-open");
  }

  function patch() {
    queued = false;
    const context = currentContext();
    if (!context || !document.querySelector(".v3-editor-page")) return;
    document.documentElement.dataset.labAutomationsSequence = "v4-4";
    document.documentElement.dataset.labAutomationsSequenceModel = window.CMXAutomationModelV5 ? "v5" : "compat";
    patchFlowSummary(context);
    patchSequence(context);
    patchReview(context);
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", event => {
    const add = event.target.closest?.("[data-v44-add]");
    if (add) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openAdd(add.dataset.v44Add);
      return;
    }
    const type = event.target.closest?.("[data-v44-type]");
    if (type && modal) {
      event.preventDefault();
      if (type.dataset.v44Type === "condition") openCondition(modal.dataset.afterAction);
      else openWait();
      return;
    }
    const back = event.target.closest?.("[data-v44-back]");
    if (back && modal) {
      event.preventDefault();
      openAdd(modal.dataset.afterAction);
      return;
    }
    const remove = event.target.closest?.("[data-v44-remove]");
    if (remove) {
      event.preventDefault();
      event.stopImmediatePropagation();
      removeControl(remove.dataset.v44Remove);
      return;
    }
    if (event.target.closest?.("[data-v44-save-condition]")) {
      event.preventDefault();
      saveCondition();
      return;
    }
    if (event.target.closest?.("[data-v44-save-wait]")) {
      event.preventDefault();
      saveWait();
      return;
    }
    if (event.target.closest?.("[data-v44-close]") || event.target === modal) {
      event.preventDefault();
      closeModal();
      return;
    }
    schedule();
  }, true);

  document.addEventListener("change", event => {
    if (event.target.matches?.("[data-v44-operator]") && modal) {
      const compare = modal.querySelector(".v44-compare");
      if (compare) compare.hidden = event.target.value === "is_true";
    }
  }, true);
  document.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("storage", event => {
    if ([AUTOMATIONS_KEY, CONTROLS_KEY].includes(event.key)) schedule();
  });
  window.addEventListener("pageshow", schedule);
  schedule();
})();