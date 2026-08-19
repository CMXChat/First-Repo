(() => {
  "use strict";

  const STORE_KEY = "cmx-lab-automations-v1";
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const SCENARIOS = Object.freeze([
    {
      id: "weekly-planning-review",
      eyebrow: "WEEKLY",
      name: "Weekly planning review",
      description: "Open a recurring weekly review and keep the final decision human-controlled.",
      trigger: "calendar",
      conditions: [],
      actions: [{ type: "manual_review", content: "Review the week, current priorities and anything that needs a deliberate next step." }],
      timing: { mode: "none" },
      repeat: { mode: "weekly", every: 1, unit: "weeks" },
      outcome: "review"
    },
    {
      id: "grace-heads-up",
      eyebrow: "CHECK IN",
      name: "Grace-window heads-up",
      description: "When grace begins, prepare a protected notification before the final trigger boundary.",
      trigger: "grace_start",
      conditions: [{ type: "switch_in_grace" }],
      actions: [{ type: "notify", content: "Notify the approved person that the Check In window has entered grace." }],
      timing: { mode: "none" },
      repeat: { mode: "none" },
      outcome: "end"
    },
    {
      id: "final-continuity-review",
      eyebrow: "CONTINUITY",
      name: "Final continuity review",
      description: "At the final grace boundary, require a human review step before any future consequential action.",
      trigger: "grace_expiry",
      conditions: [],
      actions: [{ type: "manual_review", content: "Review the final continuity state and decide whether the next approved path should proceed." }],
      timing: { mode: "none" },
      repeat: { mode: "none" },
      outcome: "review"
    },
    {
      id: "ai-note-summary",
      eyebrow: "AI",
      name: "AI note summary",
      description: "Prepare a bounded summary from approved records and route it into human review.",
      trigger: "manual",
      conditions: [],
      actions: [
        { type: "ai_task", content: "Summarize the approved records, preserve uncertainty and flag anything that needs attention." },
        { type: "manual_review", content: "Review the AI summary before any follow-up action." }
      ],
      timing: { mode: "none" },
      repeat: { mode: "none" },
      outcome: "review"
    },
    {
      id: "six-hour-reminder",
      eyebrow: "REMINDER",
      name: "Six-hour reminder",
      description: "Start manually, wait six elapsed hours, then prepare a protected notification.",
      trigger: "manual",
      conditions: [],
      actions: [{ type: "notify", content: "Send the approved reminder after the configured delay." }],
      timing: { mode: "delay", hours: 6 },
      repeat: { mode: "none" },
      outcome: "end"
    },
    {
      id: "daily-records-check",
      eyebrow: "DAILY",
      name: "Daily records check",
      description: "Open a daily review of approved records without allowing the Lab to execute outside the page.",
      trigger: "calendar",
      conditions: [],
      actions: [{ type: "manual_review", content: "Review the approved records and note anything that needs an explicit next step." }],
      timing: { mode: "none" },
      repeat: { mode: "daily", every: 1, unit: "days" },
      outcome: "review"
    },
    {
      id: "no-ack-follow-up",
      eyebrow: "FOLLOW UP",
      name: "No-ack follow-up",
      description: "After the final grace boundary, confirm acknowledgement is still missing and prepare a delayed follow-up.",
      trigger: "grace_expiry",
      conditions: [{ type: "not_acknowledged" }],
      actions: [{ type: "notify", content: "Prepare the approved follow-up for the protected contact." }],
      timing: { mode: "delay", hours: 1 },
      repeat: { mode: "until_ack", every: 1, unit: "hours" },
      outcome: "no_ack"
    },
    {
      id: "ai-briefing-review",
      eyebrow: "BRIEFING",
      name: "AI briefing with review",
      description: "Prepare a recurring bounded briefing, then stop for a deliberate human review.",
      trigger: "calendar",
      conditions: [],
      actions: [
        { type: "ai_task", content: "Prepare a concise briefing using only approved Lab records and clearly separate facts from uncertainty." },
        { type: "manual_review", content: "Review the briefing and choose any follow-up manually." }
      ],
      timing: { mode: "none" },
      repeat: { mode: "daily", every: 1, unit: "days" },
      outcome: "review"
    }
  ]);

  let queued = false;

  function esc(value) {
    return String(value ?? "").replace(/[&<>'"]/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[ch]));
  }

  function timingShape(source = {}) {
    return {
      mode: source.mode || "none",
      delay: { days: Number(source.days) || 0, hours: Number(source.hours) || 0, minutes: Number(source.minutes) || 0 },
      at: { date: "", time: "", timezone: localZone }
    };
  }

  function repeatShape(source = {}) {
    return {
      mode: source.mode || "none",
      every: Number(source.every) || 1,
      unit: source.unit || "days",
      timezone: localZone
    };
  }

  function createDraft(scenario) {
    const id = makeId("auto");
    return {
      id,
      name: scenario.name,
      nameAuto: false,
      description: scenario.description,
      status: "Draft",
      trigger: scenario.trigger,
      condition: scenario.conditions[0]?.type || "none",
      conditions: scenario.conditions.map(rule => ({ id: makeId("rule"), type: rule.type })),
      ruleMode: "all",
      actions: scenario.actions.map(action => ({
        id: makeId("step"),
        type: action.type,
        targetRef: null,
        targetLabel: "",
        content: action.content || "",
        enabled: true
      })),
      timing: timingShape(scenario.timing),
      repeatConfig: repeatShape(scenario.repeat),
      outcome: scenario.outcome || "end",
      editorStage: 0,
      editorStep: 1,
      updatedAt: new Date().toISOString()
    };
  }

  function seedScenario(id) {
    const scenario = SCENARIOS.find(item => item.id === id);
    if (!scenario) return;
    let store = { version: 1, automations: [] };
    try {
      const existing = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (existing?.version === 1 && Array.isArray(existing.automations)) store = existing;
    } catch {}
    const draft = createDraft(scenario);
    store.automations.unshift(draft);
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    location.assign(`${location.pathname}?automation=${encodeURIComponent(draft.id)}&from=templates`);
  }

  function patchTemplates() {
    const strip = document.querySelector(".v3-template-strip");
    if (!strip || strip.dataset.v4Scenarios === "ready") return false;
    strip.dataset.v4Scenarios = "ready";
    SCENARIOS.forEach(scenario => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "v3-template v4-scenario-card";
      button.dataset.v4Scenario = scenario.id;
      button.innerHTML = `<span>${esc(scenario.eyebrow)}</span><strong>${esc(scenario.name)}</strong><small>${esc(scenario.description)}</small><b>Use scenario →</b>`;
      strip.append(button);
    });
    const title = document.querySelector(".v3-template-section .v3-section-title > small");
    if (title) title.textContent = `${5 + SCENARIOS.length} editable starting patterns`;
    return true;
  }

  function patch() {
    queued = false;
    if (patchTemplates()) document.documentElement.dataset.labAutomationsScenarios = "v4";
  }

  function schedulePatch() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", event => {
    const scenario = event.target.closest?.("[data-v4-scenario]");
    if (scenario) {
      event.preventDefault();
      seedScenario(scenario.dataset.v4Scenario);
      return;
    }
    schedulePatch();
  }, true);

  window.addEventListener("pageshow", schedulePatch);
  window.addEventListener("cmx:lab-automations-updated", schedulePatch);
  schedulePatch();
})();