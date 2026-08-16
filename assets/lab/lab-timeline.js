(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /**
   * BACKEND HANDOFF — SWITCH POLICY + SIMULATION ENGINE
   * ---------------------------------------------------
   * Lab owns presentation and synthetic simulation only.
   * Production must move policy, clock, eligibility, state transitions,
   * execution outcomes, approvals, retries, and immutable trace events to
   * FastAPI + PostgreSQL + server-side workers.
   *
   * The browser must never be authoritative for:
   * - current server time or proof-of-life deadlines
   * - whether a trigger is eligible
   * - action execution/outcomes
   * - repeat-cycle rearming
   * - approval state or retry accounting
   *
   * Policy storage here is intentionally local mock data. Production should
   * persist a versioned switch_policy record and derive each incident/cycle
   * from an immutable policy snapshot.
   */

  const POLICY_KEY = "cmx-lab-switch-policy-v1";
  const ACTION_KEY = "cmx-lab-actions-v1";
  const SIM_KEY = "cmx-lab-simulations-v1";
  const MAX_HISTORY = 10;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? "").replace(/[&<>'\"]/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));

  function defaultPolicy() {
    return {
      version: 1,
      intervalHours: 72,
      graceHours: 24,
      repeat: true,
      preferredUnit: "hours",
      updatedAt: new Date().toISOString()
    };
  }

  function normalizePolicy(input = {}) {
    const intervalHours = Math.max(1, Math.min(720, Number(input.intervalHours || 72)));
    const graceHours = Math.max(0, Math.min(24, Number(input.graceHours ?? 24)));
    return {
      version: 1,
      intervalHours,
      graceHours,
      repeat: input.repeat !== false,
      preferredUnit: input.preferredUnit === "days" ? "days" : "hours",
      updatedAt: input.updatedAt || new Date().toISOString()
    };
  }

  function loadPolicy() {
    try {
      const stored = JSON.parse(localStorage.getItem(POLICY_KEY));
      if (stored?.version === 1) return normalizePolicy(stored);
    } catch {}
    const seeded = defaultPolicy();
    localStorage.setItem(POLICY_KEY, JSON.stringify(seeded));
    return seeded;
  }

  function savePolicy(next) {
    policy = normalizePolicy({ ...next, updatedAt: new Date().toISOString() });
    localStorage.setItem(POLICY_KEY, JSON.stringify(policy));
    document.dispatchEvent(new CustomEvent("cmx:lab-switch-policy-updated", { detail: { ...policy } }));
  }

  function loadActions() {
    try {
      const stored = JSON.parse(localStorage.getItem(ACTION_KEY));
      if (stored?.version === 1 && Array.isArray(stored.actions)) return stored.actions;
    } catch {}
    return [];
  }

  function loadSimStore() {
    try {
      const stored = JSON.parse(localStorage.getItem(SIM_KEY));
      if (stored?.version === 1 && Array.isArray(stored.history)) return stored;
    } catch {}
    return { version: 1, current: null, history: [] };
  }

  function saveSimStore() {
    simStore.history = simStore.history.slice(0, MAX_HISTORY);
    localStorage.setItem(SIM_KEY, JSON.stringify(simStore));
    document.dispatchEvent(new CustomEvent("cmx:lab-simulation-updated", { detail: simStore.current }));
  }

  let policy = loadPolicy();
  let simStore = loadSimStore();
  let timelineRoot = null;
  let policyDialog = null;
  let observerQueued = false;

  function duration(hours, compact = false) {
    const value = Number(hours || 0);
    if (value === 0) return compact ? "0H" : "0 hours";
    if (value % 24 === 0) {
      const days = value / 24;
      return compact ? `${days}D` : `${days} day${days === 1 ? "" : "s"}`;
    }
    return compact ? `${value}H` : `${value} hour${value === 1 ? "" : "s"}`;
  }

  function totalHours() {
    return policy.intervalHours + policy.graceHours;
  }

  function deadlinePercent() {
    const total = Math.max(1, totalHours());
    return Math.max(0, Math.min(100, (policy.intervalHours / total) * 100));
  }

  function incidentState(hour) {
    if (hour < policy.intervalHours) return { key: "safe", label: "SAFE WINDOW", tone: "safe" };
    if (hour < totalHours()) return { key: "grace", label: "GRACE PERIOD", tone: "grace" };
    return { key: "triggered", label: "TRIGGER STATE", tone: "triggered" };
  }

  function actionHour(action) {
    const trigger = action?.trigger || {};
    if (trigger.mode === "deadline") return policy.intervalHours;
    if (trigger.mode === "grace_offset") {
      return policy.intervalHours + Math.max(0, Math.min(policy.graceHours, Number(trigger.offsetHours || 0)));
    }
    if (trigger.mode === "grace_expiry") return totalHours();
    return null;
  }

  function triggerLabel(action) {
    const trigger = action?.trigger || {};
    if (trigger.mode === "deadline") return `${duration(policy.intervalHours)} deadline`;
    if (trigger.mode === "grace_offset") return `${Math.max(0, Math.min(policy.graceHours, Number(trigger.offsetHours || 0)))}h into grace`;
    if (trigger.mode === "grace_expiry") return policy.graceHours ? `Grace expiration at T+${totalHours()}h` : "Immediate final trigger";
    if (trigger.mode === "scheduled") return "Calendar scheduled";
    if (trigger.mode === "manual") return "Manual only";
    return "Unconfigured";
  }

  function enabledTimelineActions() {
    return loadActions().filter(action => action.status === "Enabled" && actionHour(action) !== null)
      .sort((a, b) => actionHour(a) - actionHour(b));
  }

  function simulationDefault() {
    const states = {};
    loadActions().forEach(action => {
      states[action.id] = action.status === "Enabled" ? "WAITING" : action.status.toUpperCase();
    });
    return {
      id: `sim-${Date.now().toString(36)}`,
      startedAt: new Date().toISOString(),
      policySnapshot: { ...policy },
      hour: 0,
      states,
      approvals: {},
      trace: [{ code: "SIMULATION_STARTED", detail: `Synthetic incident started with ${duration(policy.intervalHours)} window.`, hour: 0 }],
      completed: false
    };
  }

  function currentSimulation() {
    if (!simStore.current || simStore.current.completed) simStore.current = simulationDefault();
    if (!simStore.current.policySnapshot) simStore.current.policySnapshot = { ...policy };
    return simStore.current;
  }

  function addTrace(code, detail, actionId = "", hour = currentSimulation().hour) {
    const sim = currentSimulation();
    sim.trace.unshift({ code, detail, actionId, hour, at: new Date().toISOString() });
    sim.trace = sim.trace.slice(0, 100);
  }

  function recomputeEligibility() {
    const sim = currentSimulation();
    const actions = loadActions();
    const priorState = incidentState(Math.max(0, sim.hour - 0.001)).key;
    const state = incidentState(sim.hour).key;
    if (state !== priorState) {
      if (state === "grace") addTrace("DEADLINE_REACHED", `Proof-of-life window expired at T+${policy.intervalHours}h.`);
      if (state === "triggered") addTrace("GRACE_EXPIRED", `Grace window expired at T+${totalHours()}h.`);
    }

    actions.forEach(action => {
      const old = sim.states[action.id];
      if (action.status !== "Enabled") {
        sim.states[action.id] = action.status.toUpperCase();
        return;
      }
      const due = actionHour(action);
      if (due === null) {
        sim.states[action.id] = action.trigger?.mode === "manual" ? "MANUAL" : "CALENDAR";
        return;
      }
      if (["SUCCEEDED", "FAILED", "RETRY QUEUED", "AWAITING APPROVAL"].includes(old)) return;
      if (sim.hour >= due) {
        if (action.guardrails?.requireApproval) {
          sim.states[action.id] = "AWAITING APPROVAL";
          if (old !== "AWAITING APPROVAL") addTrace("APPROVAL_REQUIRED", `${action.name} reached eligibility and is waiting for operator approval.`, action.id, due);
        } else {
          sim.states[action.id] = "ELIGIBLE";
          if (old !== "ELIGIBLE") addTrace("ACTION_ELIGIBLE", `${action.name} became eligible.`, action.id, due);
        }
      } else {
        sim.states[action.id] = "WAITING";
      }
    });
    saveSimStore();
  }

  function advanceTo(hour) {
    const sim = currentSimulation();
    const next = Math.max(0, Math.min(totalHours() + 24, Number(hour || 0)));
    const old = sim.hour;
    sim.hour = next;
    if (next !== old) addTrace("CLOCK_MOVED", `Simulation clock moved from T+${old}h to T+${next}h.`, "", next);
    recomputeEligibility();
    renderTimeline();
    renderActivityTrace();
  }

  function runAction(actionId, outcome = "success") {
    const sim = currentSimulation();
    const action = loadActions().find(item => item.id === actionId);
    if (!action) return;
    const state = sim.states[actionId];
    if (!["ELIGIBLE", "AWAITING APPROVAL", "RETRY QUEUED"].includes(state)) return;

    if (state === "AWAITING APPROVAL") {
      sim.approvals[actionId] = true;
      addTrace("ACTION_APPROVED", `${action.name} received simulated operator approval.`, actionId);
    }

    sim.states[actionId] = "EXECUTING";
    addTrace("SIMULATED_EXECUTION", `${action.name} entered synthetic execution. No external side effect occurred.`, actionId);

    if (outcome === "failure") {
      const retries = Number(action.guardrails?.retryCount || 0);
      if (retries > 0) {
        sim.states[actionId] = "RETRY QUEUED";
        addTrace("SIMULATED_FAILURE", `${action.name} failed. Retry policy allows ${retries} attempt${retries === 1 ? "" : "s"}.`, actionId);
      } else {
        sim.states[actionId] = "FAILED";
        addTrace("SIMULATED_FAILURE", `${action.name} failed with no retries configured.`, actionId);
      }
    } else {
      sim.states[actionId] = "SUCCEEDED";
      addTrace("SIMULATED_SUCCESS", `${action.name} completed successfully in simulation.`, actionId);
    }
    saveSimStore();
    renderTimeline();
    renderActivityTrace();
  }

  function runEligible() {
    const sim = currentSimulation();
    loadActions().forEach(action => {
      if (sim.states[action.id] === "ELIGIBLE") runAction(action.id, "success");
    });
    renderTimeline();
  }

  function resetSimulation(archive = true) {
    if (archive && simStore.current) {
      const old = { ...simStore.current, completed: true, completedAt: new Date().toISOString() };
      simStore.history.unshift(old);
    }
    simStore.current = simulationDefault();
    saveSimStore();
    renderTimeline();
    renderActivityTrace();
  }

  function stateClass(state) {
    return String(state || "WAITING").toLowerCase().replace(/\s+/g, "-");
  }

  function actionMark(type) {
    return ({ sms: "SMS", email: "EML", social: "SOC", ai: "AI", organization_notice: "ORG", publish: "PUB", webhook: "API", digital_account: "ACC", custom: "CUS", scheduled: "CAL" }[type] || "ACT");
  }

  function markerPosition(action) {
    const hour = actionHour(action);
    if (hour === null) return null;
    return Math.max(0, Math.min(100, (hour / Math.max(1, totalHours())) * 100));
  }

  function nextEvent() {
    const sim = currentSimulation();
    const events = [];
    if (sim.hour < policy.intervalHours) events.push({ hour: policy.intervalHours, title: "Proof-of-life deadline", detail: "Grace period begins if no valid check-in is accepted." });
    if (sim.hour < totalHours()) events.push({ hour: totalHours(), title: "Final trigger boundary", detail: policy.graceHours ? "Grace expires and the switch enters trigger state." : "The switch enters trigger state at the deadline." });
    enabledTimelineActions().forEach(action => {
      const hour = actionHour(action);
      const state = sim.states[action.id];
      if (hour > sim.hour && state === "WAITING") events.push({ hour, title: action.name, detail: `Action becomes eligible · ${triggerLabel(action)}` });
    });
    return events.sort((a, b) => a.hour - b.hour)[0] || null;
  }

  function mainTimeline() {
    const actions = enabledTimelineActions();
    const deadline = deadlinePercent();
    const sim = currentSimulation();
    const clockPct = Math.min(100, (sim.hour / Math.max(1, totalHours())) * 100);
    return `<div class="lab-sequence-rail" style="--deadline:${deadline}%;--clock:${clockPct}%">
      <div class="lab-sequence-track"><span class="safe"></span><span class="grace"></span></div>
      <span class="lab-sequence-clock"><i></i><b>T+${sim.hour}h</b></span>
      <span class="lab-sequence-boundary start"><i></i><strong>T+0</strong><small>CHECKED IN</small></span>
      <span class="lab-sequence-boundary deadline"><i></i><strong>T+${policy.intervalHours}h</strong><small>DEADLINE</small></span>
      <span class="lab-sequence-boundary final"><i></i><strong>T+${totalHours()}h</strong><small>FINAL TRIGGER</small></span>
      ${actions.map(action => {
        const pct = markerPosition(action);
        const state = sim.states[action.id] || "WAITING";
        return `<button type="button" class="lab-sequence-marker risk-${esc(String(action.risk || "Important").toLowerCase())} state-${stateClass(state)}" style="left:${pct}%" data-sequence-action="${esc(action.id)}" title="${esc(action.name)} · ${esc(triggerLabel(action))}"><span>${actionMark(action.type)}</span><b>${esc(action.name)}</b><small>${esc(state)}</small></button>`;
      }).join("")}
    </div>`;
  }

  function executionQueue() {
    const sim = currentSimulation();
    const actions = loadActions().filter(action => action.status === "Enabled");
    if (!actions.length) return '<div class="lab-sequence-empty"><strong>No enabled actions</strong><p>Enable actions in the Actions workspace to place them into the simulation queue.</p></div>';
    actions.sort((a, b) => (actionHour(a) ?? 99999) - (actionHour(b) ?? 99999));
    return `<div class="lab-sim-queue">${actions.map(action => {
      const state = sim.states[action.id] || "WAITING";
      const canRun = ["ELIGIBLE", "AWAITING APPROVAL", "RETRY QUEUED"].includes(state);
      return `<article class="lab-sim-action state-${stateClass(state)} risk-${esc(String(action.risk || "Important").toLowerCase())}">
        <span class="lab-sim-mark">${actionMark(action.type)}</span>
        <div><small>${esc(triggerLabel(action))}</small><strong>${esc(action.name)}</strong><p>${esc(action.risk || "Important")} risk · ${esc(action.status)}</p></div>
        <span class="lab-sim-state">${esc(state)}</span>
        <div class="lab-sim-outcomes">${canRun ? `<button type="button" data-sim-action="${esc(action.id)}" data-sim-outcome="success">${state === "AWAITING APPROVAL" ? "Approve + succeed" : "Simulate success"}</button><button type="button" data-sim-action="${esc(action.id)}" data-sim-outcome="failure">Simulate failure</button>` : ""}</div>
      </article>`;
    }).join("")}</div>`;
  }

  function traceRows(limit = 18) {
    const trace = currentSimulation().trace || [];
    return trace.slice(0, limit).map(event => `<div class="lab-trace-row"><span><i></i><strong>${esc(event.code)}</strong></span><p>${esc(event.detail)}</p><time>T+${Number(event.hour || 0)}h</time></div>`).join("") || '<div class="lab-sequence-empty"><strong>No trace events</strong></div>';
  }

  function historyRows() {
    if (!simStore.history.length) return '<p class="lab-sequence-muted">No archived Lab simulations yet.</p>';
    return simStore.history.slice(0, 5).map(run => {
      const states = Object.values(run.states || {});
      const success = states.filter(value => value === "SUCCEEDED").length;
      const failed = states.filter(value => value === "FAILED" || value === "RETRY QUEUED").length;
      return `<div class="lab-history-row"><span><strong>${esc(run.id.toUpperCase())}</strong><small>${new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(run.startedAt))}</small></span><b>${success} success · ${failed} failed</b></div>`;
    }).join("");
  }

  function renderTimeline() {
    if (!timelineRoot) return;
    policy = loadPolicy();
    const sim = currentSimulation();
    const state = incidentState(sim.hour);
    const next = nextEvent();

    timelineRoot.innerHTML = `
      <header class="lab-sequence-topbar">
        <div class="lab-sequence-brand"><span>SEQ</span><div><strong>Contingency sequence</strong><small>Configurable switch policy · simulation only</small></div></div>
        <div class="lab-sequence-top-actions"><button type="button" data-sequence-command="policy">Switch policy</button><button class="primary" type="button" data-sequence-command="reset">New simulation</button></div>
      </header>

      <section class="lab-policy-summary">
        <div><small>PROOF-OF-LIFE WINDOW</small><strong>${duration(policy.intervalHours)}</strong><span>Deadline at T+${policy.intervalHours}h</span></div>
        <div><small>GRACE WINDOW</small><strong>${duration(policy.graceHours)}</strong><span>${policy.graceHours ? `Final trigger T+${totalHours()}h` : "Immediate trigger"}</span></div>
        <div><small>CYCLE MODE</small><strong>${policy.repeat ? "Rolling repeat" : "One-shot"}</strong><span>${policy.repeat ? "Successful check-in rearms the next cycle" : "Manual rearm required after completion"}</span></div>
        <div class="state-${state.tone}"><small>SIMULATED STATE</small><strong>${state.label}</strong><span>Clock T+${sim.hour}h</span></div>
      </section>

      <section class="lab-sequence-stage">
        <div class="lab-sequence-stage-head"><div><small>INCIDENT CLOCK</small><h2>${duration(policy.intervalHours)} window + ${duration(policy.graceHours)} grace</h2></div><span>LAB · NO EXTERNAL EXECUTION</span></div>
        ${mainTimeline()}
        <div class="lab-sequence-controls">
          <button type="button" data-sequence-jump="0">Reset clock</button>
          <button type="button" data-sequence-jump="${policy.intervalHours}">Jump to deadline</button>
          <button type="button" data-sequence-add="1">+1 hour</button>
          <button type="button" data-sequence-add="6">+6 hours</button>
          <button type="button" data-sequence-jump="${totalHours()}">Jump to final trigger</button>
          <button class="run" type="button" data-sequence-command="run-eligible">Run eligible</button>
        </div>
      </section>

      <div class="lab-sequence-grid">
        <section class="lab-sequence-panel queue"><div class="lab-sequence-panel-head"><span><small>EXECUTION QUEUE</small><strong>Action states</strong></span><b>${loadActions().filter(a=>a.status==="Enabled").length}</b></div>${executionQueue()}</section>
        <aside class="lab-sequence-panel next"><div class="lab-sequence-panel-head"><span><small>NEXT EVENT</small><strong>What happens next?</strong></span><b>→</b></div>${next ? `<div class="lab-next-event"><span>T+${next.hour}h</span><strong>${esc(next.title)}</strong><p>${esc(next.detail)}</p><small>${Math.max(0,next.hour-sim.hour)} simulated hour${Math.max(0,next.hour-sim.hour)===1?"":"s"} away</small></div>` : '<div class="lab-next-event complete"><span>END</span><strong>No future automatic event</strong><p>The simulated clock is beyond every configured switch boundary.</p></div>'}<div class="lab-sequence-policy-mini"><span>Repeat behavior</span><strong>${policy.repeat ? "ROLLING" : "ONE-SHOT"}</strong><p>${policy.repeat ? "A valid future check-in creates a fresh cycle using the then-current policy." : "Completion does not automatically create another cycle."}</p></div></aside>
      </div>

      <section class="lab-sequence-panel trace"><div class="lab-sequence-panel-head"><span><small>EXECUTION TRACE</small><strong>Simulation events</strong></span><b>${(sim.trace||[]).length}</b></div><div class="lab-trace-list">${traceRows()}</div></section>
      <section class="lab-sequence-panel history"><div class="lab-sequence-panel-head"><span><small>RECENT RUNS</small><strong>Simulation history</strong></span><b>${simStore.history.length}</b></div>${historyRows()}</section>`;

    applyPolicyPresentation();
  }

  function openPolicyDialog() {
    if (!policyDialog) return;
    const unit = policy.preferredUnit === "days" && policy.intervalHours % 24 === 0 ? "days" : "hours";
    const value = unit === "days" ? policy.intervalHours / 24 : policy.intervalHours;
    policyDialog.innerHTML = `<form method="dialog" class="lab-policy-dialog-shell" id="labPolicyForm">
      <header><span><small>LAB SWITCH POLICY</small><h2>Configure the proof-of-life cycle</h2><p>These settings affect only the isolated Lab simulation.</p></span><button value="cancel" type="submit" aria-label="Close">×</button></header>
      <div class="lab-policy-dialog-warning"><b>!</b><span><strong>PRODUCTION REMAINS UNCHANGED</strong><small>The live /checkin switch does not read these settings.</small></span></div>
      <div class="lab-policy-form-grid">
        <label><span>Check-in window</span><div class="lab-policy-duration"><input id="labIntervalValue" type="number" min="1" max="720" step="1" value="${value}" required /><select id="labIntervalUnit"><option value="hours"${unit==="hours"?" selected":""}>Hours</option><option value="days"${unit==="days"?" selected":""}>Days</option></select></div><small>1 hour to 30 days.</small></label>
        <label><span>Grace period</span><div class="lab-policy-duration"><input id="labGraceValue" type="number" min="0" max="24" step="1" value="${policy.graceHours}" required /><span>Hours</span></div><small>0 means final trigger occurs at the deadline.</small></label>
      </div>
      <label class="lab-repeat-toggle"><input id="labRepeatEnabled" type="checkbox" ${policy.repeat?"checked":""} /><span><i></i><strong>Repeat this cycle</strong><small>${policy.repeat?"Rolling mode: each accepted check-in rearms another cycle.":"One-shot mode: completion requires a manual rearm."}</small></span></label>
      <section class="lab-policy-preview"><div><small>WINDOW</small><strong id="labPolicyPreviewWindow">${duration(policy.intervalHours)}</strong></div><div><small>FINAL BOUNDARY</small><strong id="labPolicyPreviewFinal">T+${totalHours()}h</strong></div><div><small>MODE</small><strong id="labPolicyPreviewMode">${policy.repeat?"ROLLING":"ONE-SHOT"}</strong></div></section>
      <footer><span><b>BACKEND NOTE</b><small>Production policy must be versioned server-side and snapshotted into each cycle.</small></span><div><button value="cancel" type="submit">Cancel</button><button class="primary" type="button" id="labSavePolicy">Save Lab policy</button></div></footer>
    </form>`;
    policyDialog.showModal();
    bindPolicyPreview();
  }

  function bindPolicyPreview() {
    const value = $("#labIntervalValue", policyDialog);
    const unit = $("#labIntervalUnit", policyDialog);
    const grace = $("#labGraceValue", policyDialog);
    const repeat = $("#labRepeatEnabled", policyDialog);
    const update = () => {
      const hours = Math.max(1, Number(value?.value || 1)) * (unit?.value === "days" ? 24 : 1);
      const g = Math.max(0, Math.min(24, Number(grace?.value || 0)));
      $("#labPolicyPreviewWindow", policyDialog).textContent = duration(hours);
      $("#labPolicyPreviewFinal", policyDialog).textContent = `T+${hours+g}h`;
      $("#labPolicyPreviewMode", policyDialog).textContent = repeat?.checked ? "ROLLING" : "ONE-SHOT";
      const copy = $(".lab-repeat-toggle small", policyDialog);
      if (copy) copy.textContent = repeat?.checked ? "Rolling mode: each accepted check-in rearms another cycle." : "One-shot mode: completion requires a manual rearm.";
    };
    [value, unit, grace, repeat].forEach(node => node?.addEventListener("input", update));
  }

  function savePolicyFromDialog() {
    const value = Math.max(1, Number($("#labIntervalValue", policyDialog)?.value || 72));
    const unit = $("#labIntervalUnit", policyDialog)?.value === "days" ? "days" : "hours";
    const intervalHours = value * (unit === "days" ? 24 : 1);
    if (intervalHours > 720) {
      alert("The Lab supports a maximum 30-day proof-of-life window.");
      return;
    }
    const graceHours = Math.max(0, Math.min(24, Number($("#labGraceValue", policyDialog)?.value || 0)));
    const repeat = Boolean($("#labRepeatEnabled", policyDialog)?.checked);
    savePolicy({ intervalHours, graceHours, repeat, preferredUnit: unit });
    policyDialog.close();
    simStore.current = simulationDefault();
    saveSimStore();
    applyPolicyPresentation();
    renderTimeline();
    setTimeout(() => location.reload(), 120);
  }

  function applyPolicyPresentation() {
    policy = loadPolicy();
    const total = totalHours();
    document.documentElement.style.setProperty("--lab-deadline-pct", `${deadlinePercent()}%`);

    const intervalNode = $("#intervalValue");
    const graceNode = $("#graceValue");
    if (intervalNode) intervalNode.textContent = `${duration(policy.intervalHours)} ${policy.repeat ? "rolling" : "one-shot"}`;
    if (graceNode) graceNode.textContent = duration(policy.graceHours);

    const modeStrip = $(".mode-strip");
    if (modeStrip) {
      const strong = $("strong", modeStrip);
      const copy = $("p", modeStrip);
      if (strong) strong.textContent = `Primary ${duration(policy.intervalHours)} switch`;
      if (copy) copy.textContent = `Verified proof of life opens a ${duration(policy.intervalHours)} operating window. ${policy.graceHours ? `A ${duration(policy.graceHours)} grace period follows the deadline.` : "No grace period is configured."} ${policy.repeat ? "The cycle repeats after each accepted check-in." : "This Lab policy is one-shot."}`;
    }

    const quickPanel = $(".quick-panel");
    if (quickPanel && !$("[data-lab-repeat-row]", quickPanel)) {
      const row = document.createElement("div");
      row.className = "quick-row";
      row.dataset.labRepeatRow = "true";
      row.innerHTML = `<span>Cycle mode</span><strong>${policy.repeat ? "ROLLING REPEAT" : "ONE-SHOT"}</strong>`;
      const schedule = $(".quick-row", quickPanel);
      schedule?.after(row);
    } else if (quickPanel) {
      const repeat = $("[data-lab-repeat-row] strong", quickPanel);
      if (repeat) repeat.textContent = policy.repeat ? "ROLLING REPEAT" : "ONE-SHOT";
    }

    patchActionPolicyCopy();
  }

  function patchActionPolicyCopy() {
    const roots = [$(".lab-actions"), $(".lab-action-builder")].filter(Boolean);
    const replacements = [
      [/At 72-hour deadline/g, `At ${duration(policy.intervalHours)} deadline`],
      [/72H DEADLINE/g, `${duration(policy.intervalHours,true)} DEADLINE`],
      [/Inside 24-hour grace/g, `Inside ${duration(policy.graceHours)} grace`],
      [/24-hour grace/g, `${duration(policy.graceHours)} grace`],
      [/96H FINAL/g, "FINAL TRIGGER"],
      [/the 72-hour check-in deadline/g, `the ${duration(policy.intervalHours)} check-in deadline`],
      [/the 72-hour deadline/g, `the ${duration(policy.intervalHours)} deadline`],
      [/72-hour operating window/g, `${duration(policy.intervalHours)} operating window`],
      [/24-hour grace period/g, `${duration(policy.graceHours)} grace period`],
      [/72H/g, duration(policy.intervalHours,true)],
      [/96H/g, `${totalHours()}H`]
    ];
    roots.forEach(root => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        let text = node.nodeValue;
        replacements.forEach(([pattern, replacement]) => { text = text.replace(pattern, replacement); });
        node.nodeValue = text;
      });
    });

    $$(".lab-execution-line").forEach(line => {
      const deadline = $(".lab-execution-node.deadline", line);
      const deadlineLabel = $(".lab-execution-label.deadline", line);
      const grace = $(".lab-execution-grace", line);
      if (deadline) deadline.style.left = `${deadlinePercent()}%`;
      if (deadlineLabel) deadlineLabel.style.left = `${deadlinePercent()}%`;
      if (grace) { grace.style.left = `${deadlinePercent()}%`; grace.style.width = `${100-deadlinePercent()}%`; }
    });

    const offsetInput = $("[data-trigger-field='offsetHours']", $(".lab-action-builder"));
    if (offsetInput) {
      offsetInput.max = String(policy.graceHours);
      if (Number(offsetInput.value) > policy.graceHours) offsetInput.value = String(policy.graceHours);
      const label = offsetInput.closest("label");
      const heading = $("span", label);
      const small = $("small", label);
      if (heading) heading.textContent = `Hours after ${duration(policy.intervalHours)} deadline`;
      if (small) small.textContent = `0 = deadline. ${policy.graceHours} = final grace expiration.`;
    }

    adjustLegacyActionMarkers();
  }

  function adjustLegacyActionMarkers() {
    $$(".lab-execution-line").forEach(line => {
      const marker = $(".lab-execution-marker", line);
      if (!marker) return;
      const container = line.closest(".lab-boundary-card,.lab-builder-section,.lab-review-grid") || line.parentElement;
      const text = container?.textContent || "";
      let pct = null;
      const match = text.match(/(\d+(?:\.\d+)?)h into grace/i);
      if (match) pct = ((policy.intervalHours + Math.min(policy.graceHours, Number(match[1]))) / Math.max(1,totalHours())) * 100;
      else if (/FINAL TRIGGER|grace expiration|final grace/i.test(text)) pct = 100;
      else if (/DEADLINE/i.test(text)) pct = deadlinePercent();
      const checked = $("[data-trigger-mode]:checked", container);
      if (checked?.value === "deadline") pct = deadlinePercent();
      if (checked?.value === "grace_expiry") pct = 100;
      if (checked?.value === "grace_offset") {
        const offset = Number($("[data-trigger-field='offsetHours']", container)?.value || 0);
        pct = ((policy.intervalHours + Math.min(policy.graceHours, offset)) / Math.max(1,totalHours())) * 100;
      }
      if (pct !== null) marker.style.left = `${Math.max(0,Math.min(100,pct))}%`;
    });
  }

  function renderActivityTrace() {
    const panel = $('[data-view-panel="activity"]');
    if (!panel) return;
    let box = $(".lab-sim-activity", panel);
    if (!box) {
      box = document.createElement("section");
      box.className = "lab-sim-activity";
      const heading = $(".view-heading", panel);
      heading?.after(box);
    }
    box.innerHTML = `<div class="lab-sequence-panel-head"><span><small>LAB EXECUTION TRACE</small><strong>Current simulation</strong></span><b>${(currentSimulation().trace||[]).length}</b></div><div class="lab-trace-list">${traceRows(10)}</div>`;
  }

  function buildTimeline() {
    const panel = $('[data-view-panel="timeline"]');
    if (!panel) return false;

    $$('[data-view="timeline"]').forEach(button => {
      button.hidden = false;
      button.classList.remove("legacy-nav-target", "legacy-mobile-target");
      const label = $("span:last-of-type", button) || $("small", button);
      if (button.closest(".side-nav")) {
        const spans = $$('span', button);
        if (spans[1]) spans[1].textContent = "Sequence";
      } else {
        const small = $("small", button);
        if (small) small.textContent = "Sequence";
      }
    });

    panel.innerHTML = '<div class="view-heading"><div><p class="eyebrow">CONTINGENCY STATE ENGINE · LAB</p><h1 id="timelineTitle">Sequence simulator</h1></div><p>Move through the configured proof-of-life window, grace period, and synthetic action eligibility without touching production.</p></div><section class="lab-sequence-root"></section>';
    timelineRoot = $(".lab-sequence-root", panel);

    policyDialog = document.createElement("dialog");
    policyDialog.className = "lab-policy-dialog";
    policyDialog.id = "labPolicyDialog";
    document.body.append(policyDialog);

    timelineRoot.addEventListener("click", event => {
      const command = event.target.closest("[data-sequence-command]")?.dataset.sequenceCommand;
      if (command === "policy") return openPolicyDialog();
      if (command === "reset") return resetSimulation(true);
      if (command === "run-eligible") return runEligible();

      const jump = event.target.closest("[data-sequence-jump]");
      if (jump) return advanceTo(Number(jump.dataset.sequenceJump));
      const add = event.target.closest("[data-sequence-add]");
      if (add) return advanceTo(currentSimulation().hour + Number(add.dataset.sequenceAdd));

      const run = event.target.closest("[data-sim-action]");
      if (run) return runAction(run.dataset.simAction, run.dataset.simOutcome || "success");

      const marker = event.target.closest("[data-sequence-action]");
      if (marker) {
        const actionId = marker.dataset.sequenceAction;
        const actionButton = $(`[data-action-id='${CSS.escape(actionId)}']`, $(".lab-actions"));
        const actionNav = $('[data-view="actions"]');
        actionNav?.click();
        setTimeout(() => actionButton?.click(), 60);
      }
    });

    policyDialog.addEventListener("click", event => {
      if (event.target.id === "labSavePolicy") savePolicyFromDialog();
    });

    ["#openSettings", "#quickSettings", "#mobileSettings", "#mobileNavSettings"].forEach(selector => {
      const button = $(selector);
      if (!button) return;
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        openPolicyDialog();
      }, true);
    });

    document.addEventListener("cmx:lab-actions-updated", () => {
      const sim = currentSimulation();
      loadActions().forEach(action => { if (!sim.states[action.id]) sim.states[action.id] = action.status === "Enabled" ? "WAITING" : action.status.toUpperCase(); });
      recomputeEligibility();
      renderTimeline();
    });

    renderTimeline();
    renderActivityTrace();
    return true;
  }

  function queuePolicyPresentation() {
    if (observerQueued) return;
    observerQueued = true;
    requestAnimationFrame(() => {
      observerQueued = false;
      applyPolicyPresentation();
    });
  }

  function boot(attempt = 0) {
    applyPolicyPresentation();
    if (!buildTimeline() && attempt < 12) {
      requestAnimationFrame(() => boot(attempt + 1));
      return;
    }
    new MutationObserver(queuePolicyPresentation).observe(document.body, { childList: true, subtree: true });
  }

  window.CMX_LAB_SWITCH_POLICY = Object.freeze({
    get: () => ({ ...loadPolicy() }),
    totalHours: () => loadPolicy().intervalHours + loadPolicy().graceHours,
    duration
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => boot(), { once: true });
  else boot();
})();