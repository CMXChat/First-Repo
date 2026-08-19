(() => {
  "use strict";

  const STORE_KEY = "cmx-lab-automations-v1";
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  let queued = false;
  let activePlan = null;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));
  const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const EXAMPLES = Object.freeze({
    "daily-briefing": "Every morning, prepare an AI briefing from approved information and stop for my review.",
    "missed-checkin": "If my Check In grace expires and nobody has acknowledged it, notify the primary contact, wait two hours, then prepare a backup notification.",
    "notify-later": "When I start it manually, wait six hours before preparing a reminder notification.",
    "ai-report": "Use AI to prepare a report from approved information and send it to manual review.",
    "urgent-ai": "Use AI to assess approved information. If the AI priority is urgent, prepare a notification."
  });

  function blankTiming() {
    return { mode: "none", delay: { days: 0, hours: 0, minutes: 0 }, at: { date: "", time: "", timezone: localZone } };
  }

  function blankRepeat() {
    return { mode: "none", every: 1, unit: "days", timezone: localZone };
  }

  function readStore() {
    try {
      const value = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      return value && Array.isArray(value.automations) ? value : { version: 1, automations: [] };
    } catch {
      return { version: 1, automations: [] };
    }
  }

  function planFromIntent(intent) {
    const text = String(intent || "").trim();
    const q = text.toLowerCase();
    const plan = {
      intent: text,
      name: "Planned automation",
      rationale: "Local deterministic preview matched the closest supported Lab pattern.",
      trigger: "manual",
      conditions: [],
      actions: [],
      flowControls: [],
      timing: blankTiming(),
      repeatConfig: blankRepeat(),
      outcome: "end",
      operations: [],
      blockers: []
    };

    if ((q.includes("urgent") || q.includes("priority")) && q.includes("ai")) {
      plan.name = "Urgent AI follow-up";
      plan.trigger = "manual";
      plan.actions = [
        { key: "ai", type: "ai_task", content: "Assess approved information and return a structured priority plus concise summary." },
        { key: "notify", type: "notify", content: "Prepare an urgent notification using the approved audience and mapped AI result." }
      ];
      plan.flowControls = [{ type: "condition", afterKey: "ai", sourceKey: "ai", path: "output.priority", label: "Step 1 · AI priority", operator: "equals", compareValue: "urgent" }];
      plan.blockers.push("Notification audience still needs a protected Directory selection.");
    } else if (q.includes("check in") || q.includes("grace") || q.includes("continuity") || q.includes("emergency")) {
      plan.name = "Continuity escalation";
      plan.trigger = "grace_expiry";
      plan.conditions = [{ type: "not_acknowledged" }];
      plan.actions = [
        { key: "primary", type: "notify", content: "Prepare the primary protected escalation notice." },
        { key: "backup", type: "notify", content: "Prepare the backup escalation notice if the path still needs attention." }
      ];
      plan.flowControls = [{ type: "wait", afterKey: "primary", duration: { days: 0, hours: 2, minutes: 0 } }];
      plan.outcome = "no_ack";
      plan.blockers.push("Primary and backup Audiences still need protected Directory selections.");
      plan.blockers.push("Inter-step WAIT requires future Runtime before execution.");
    } else if (q.includes("brief") || q.includes("morning") || q.includes("daily")) {
      plan.name = "Daily AI briefing";
      plan.trigger = "calendar";
      plan.actions = [
        { key: "ai", type: "ai_task", content: "Prepare a concise briefing from approved information and clearly flag uncertainty." },
        { key: "review", type: "manual_review", content: "Review the briefing and choose any follow-up deliberately." }
      ];
      plan.repeatConfig = { mode: "daily", every: 1, unit: "days", timezone: localZone };
      plan.outcome = "review";
      plan.blockers.push("The exact schedule/time still needs confirmation in Timing.");
    } else if (q.includes("report") || (q.includes("ai") && q.includes("review"))) {
      plan.name = "AI report with review";
      plan.trigger = "manual";
      plan.actions = [
        { key: "ai", type: "ai_task", content: "Prepare the requested report using only approved information." },
        { key: "review", type: "manual_review", content: "Review the generated report before any consequential follow-up." }
      ];
      plan.outcome = "review";
    } else if (q.includes("later") || q.includes("remind") || q.includes("reminder") || q.includes("six hour") || q.includes("6 hour")) {
      plan.name = "Delayed reminder";
      plan.trigger = "manual";
      plan.actions = [{ key: "notify", type: "notify", content: "Prepare the approved reminder notification." }];
      plan.timing = { mode: "delay", delay: { days: 0, hours: 6, minutes: 0 }, at: { date: "", time: "", timezone: localZone } };
      plan.blockers.push("Notification audience still needs a protected Directory selection.");
    } else {
      plan.name = "Review requested outcome";
      plan.trigger = "manual";
      plan.actions = [{ key: "review", type: "manual_review", content: text || "Review the requested outcome and choose the next step." }];
      plan.outcome = "review";
      plan.rationale = "No specific local pattern matched, so the preview keeps the request bounded behind manual review.";
    }

    plan.operations = [
      { type: "automation.create_draft", detail: plan.name },
      { type: "automation.set_trigger", detail: triggerLabel(plan.trigger) },
      ...(plan.conditions.length ? [{ type: "automation.set_preconditions", detail: `${plan.conditions.length} pre-action rule${plan.conditions.length === 1 ? "" : "s"}` }] : []),
      ...plan.actions.map(action => ({ type: "automation.add_action", detail: actionLabel(action.type) })),
      ...plan.flowControls.map(control => ({ type: control.type === "wait" ? "automation.add_wait" : "automation.add_condition", detail: control.type === "wait" ? durationLabel(control.duration) : `${control.label} ${operatorLabel(control.operator)} ${control.compareValue}` })),
      { type: "automation.set_finish", detail: finishLabel(plan.outcome) }
    ];
    return plan;
  }

  function triggerLabel(id) {
    return ({ manual: "Manual start", calendar: "Calendar time", grace_start: "Grace begins", grace_expiry: "Grace expires" }[id] || id);
  }

  function actionLabel(type) {
    return ({ notify: "Notify", email: "Email", ai_task: "AI task", manual_review: "Manual review" }[type] || type);
  }

  function finishLabel(outcome) {
    return ({ end: "End workflow", review: "Require review", no_ack: "Escalate if not acknowledged", success: "Continue on success" }[outcome] || outcome);
  }

  function operatorLabel(operator) {
    return ({ equals: "equals", not_equals: "does not equal", contains: "contains", greater_than: "is greater than", less_than: "is less than", is_true: "is true" }[operator] || operator);
  }

  function durationLabel(duration = {}) {
    const parts = [];
    if (Number(duration.days)) parts.push(`${Number(duration.days)}d`);
    if (Number(duration.hours)) parts.push(`${Number(duration.hours)}h`);
    if (Number(duration.minutes)) parts.push(`${Number(duration.minutes)}m`);
    return `Wait ${parts.join(" ") || "duration"}`;
  }

  function sequenceRows(plan) {
    const rows = [{ badge: "WHEN", title: triggerLabel(plan.trigger), detail: "Trigger" }];
    if (plan.conditions.length) rows.push(...plan.conditions.map(rule => ({ badge: "IF", title: rule.type === "not_acknowledged" ? "No acknowledgement" : rule.type, detail: "Pre-action rule" })));
    else rows.push({ badge: "IF", title: "Always continue", detail: "No pre-action rule" });

    plan.actions.forEach(action => {
      rows.push({ badge: "DO", title: actionLabel(action.type), detail: action.content });
      plan.flowControls.filter(control => control.afterKey === action.key).forEach(control => {
        if (control.type === "wait") rows.push({ badge: "WAIT", title: durationLabel(control.duration), detail: "Inter-step control · Runtime later" });
        else rows.push({ badge: "IF", title: `${control.label} ${operatorLabel(control.operator)} ${control.operator === "is_true" ? "" : control.compareValue}`.trim(), detail: "Inter-step linear gate · Runtime later" });
      });
    });
    rows.push({ badge: "FINISH", title: finishLabel(plan.outcome), detail: "Finish policy" });
    return rows;
  }

  function renderPlan(plan) {
    const panel = document.querySelector(".v4-planner-modal .v5-planner-result");
    if (!panel) return;
    const rows = sequenceRows(plan);
    panel.hidden = false;
    panel.innerHTML = `
      <header><div><span>TYPED PLAN PREVIEW · LOCAL</span><strong>${esc(plan.name)}</strong><small>${esc(plan.rationale)}</small></div><b>NO AI CALL</b></header>
      <section class="v5-planner-sequence"><span>ORDERED V5 FLOW</span><div>${rows.map((row, index) => `<article><b>${esc(row.badge)}</b><span><strong>${esc(row.title)}</strong><small>${esc(row.detail)}</small></span><i>${index < rows.length - 1 ? "↓" : "✓"}</i></article>`).join("")}</div></section>
      <section class="v5-planner-ops"><span>CHANGE PLAN</span><div>${plan.operations.map((operation, index) => `<article><b>${String(index + 1).padStart(2, "0")}</b><span><small>${esc(operation.type)}</small><strong>${esc(operation.detail)}</strong></span></article>`).join("")}</div></section>
      <section class="v5-planner-blockers ${plan.blockers.length ? "has-blockers" : ""}"><span>${plan.blockers.length ? "PREFLIGHT" : "PREFLIGHT · CLEAR"}</span>${plan.blockers.length ? `<ul>${plan.blockers.map(item => `<li>${esc(item)}</li>`).join("")}</ul>` : `<p>No additional blocker is represented by this local pattern. Production preflight would still validate real capabilities, references, authority and Connections.</p>`}</section>
      <footer><span>This preview creates a normal editable Lab Draft. It does not publish or execute anything.</span><button type="button" data-v5-planner-use>Use this draft</button></footer>`;
  }

  function createDraft(plan) {
    const store = readStore();
    const id = makeId("auto");
    const actions = plan.actions.map(action => ({
      id: makeId("step"),
      type: action.type,
      targetRef: null,
      targetLabel: "",
      content: action.content,
      enabled: true,
      plannerKey: action.key
    }));
    const byKey = Object.fromEntries(actions.map(action => [action.plannerKey, action.id]));
    actions.forEach(action => delete action.plannerKey);

    const flowControls = plan.flowControls.map(control => {
      if (control.type === "wait") return {
        id: makeId("wait"), type: "wait", afterActionId: byKey[control.afterKey], duration: { ...control.duration }, enabled: true
      };
      return {
        id: makeId("gate"),
        type: "condition",
        afterActionId: byKey[control.afterKey],
        source: { sourceType: "step", sourceId: byKey[control.sourceKey], path: control.path, label: control.label },
        operator: control.operator,
        compareValue: control.compareValue,
        enabled: true
      };
    }).filter(control => control.afterActionId);

    const draft = {
      id,
      name: plan.name,
      nameAuto: false,
      description: `Planner preview from: ${plan.intent || plan.name}`,
      status: "Draft",
      trigger: plan.trigger,
      condition: plan.conditions[0]?.type || "none",
      conditions: plan.conditions.map(rule => ({ id: makeId("rule"), type: rule.type })),
      ruleMode: "all",
      actions,
      flowControls,
      timing: plan.timing,
      repeatConfig: plan.repeatConfig,
      outcome: plan.outcome,
      editorStage: 0,
      editorStep: 1,
      plannerPreview: { source: "local-deterministic-v5", intent: plan.intent, createdAt: new Date().toISOString() },
      updatedAt: new Date().toISOString()
    };

    store.automations.unshift(draft);
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    window.CMXAutomationModelV5?.syncStore?.();
    location.assign(`${location.pathname}?automation=${encodeURIComponent(id)}&from=planner-preview`);
  }

  function patchPlanner() {
    queued = false;
    const modal = document.querySelector(".v4-planner-modal");
    if (!modal || modal.dataset.v5Planner === "ready") return;
    modal.dataset.v5Planner = "ready";

    const field = modal.querySelector(".v4-planner-field");
    const textarea = modal.querySelector("[data-v4-planner-text]");
    if (!field || !textarea) return;

    modal.querySelectorAll("[data-v4-planner-template]").forEach(button => {
      button.dataset.v5PlannerExample = button.dataset.v4PlannerTemplate;
      button.removeAttribute("data-v4-planner-template");
    });

    const examples = modal.querySelector(".v4-planner-examples>div") || modal.querySelector(".v4-planner-examples");
    if (examples && !examples.querySelector("[data-v5-planner-example='urgent-ai']")) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.v5PlannerExample = "urgent-ai";
      button.textContent = "Urgent AI follow-up";
      examples.append(button);
    }

    const action = document.createElement("button");
    action.type = "button";
    action.className = "v5-planner-preview-button";
    action.dataset.v5PlannerPreview = "true";
    action.textContent = "Preview typed plan";
    field.after(action);

    const result = document.createElement("section");
    result.className = "v5-planner-result";
    result.hidden = true;
    action.after(result);

    const boundary = modal.querySelector(".v4-planner-boundary");
    if (boundary) boundary.querySelector("span").textContent = "Local deterministic intent matching only. No model request, production API call, provider execution or publish operation occurs here.";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patchPlanner));
  }

  document.addEventListener("click", event => {
    const start = event.target.closest?.("[data-v4-start='planner']");
    if (start) {
      schedule();
      return;
    }

    const example = event.target.closest?.("[data-v5-planner-example]");
    if (example) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const textarea = document.querySelector(".v4-planner-modal [data-v4-planner-text]");
      if (!textarea) return;
      textarea.value = EXAMPLES[example.dataset.v5PlannerExample] || "";
      activePlan = planFromIntent(textarea.value);
      renderPlan(activePlan);
      return;
    }

    if (event.target.closest?.("[data-v5-planner-preview]")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const textarea = document.querySelector(".v4-planner-modal [data-v4-planner-text]");
      activePlan = planFromIntent(textarea?.value || "");
      renderPlan(activePlan);
      return;
    }

    if (event.target.closest?.("[data-v5-planner-use]")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (activePlan) createDraft(activePlan);
      return;
    }
    schedule();
  }, true);

  document.addEventListener("input", event => {
    if (event.target.matches?.(".v4-planner-modal [data-v4-planner-text]")) activePlan = null;
  }, true);
  window.addEventListener("pageshow", schedule);
  schedule();
})();