(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /**
   * BACKEND HANDOFF — DECISION ENGINE / PHASE 6
   * --------------------------------------------
   * This is a Lab-only typed-rule simulator. It must never become an arbitrary
   * browser-side code executor and it must never perform an external side effect.
   *
   * Production replacement:
   * - PostgreSQL owns conditions, dependencies, routes, acknowledgement policy,
   *   approval events, condition evaluations, incident action state, and versions.
   * - FastAPI validates every typed rule and rejects dependency cycles.
   * - Server-authoritative workers evaluate eligibility and outcome routing.
   * - Every evaluation result is auditable: rule id, input snapshot, result, time.
   * - Delivery and acknowledgement are separate states.
   * - Route activation is an incident-scoped signal, not a mutable action field.
   * - Browsers only render/explain state and request authorized mutations.
   *
   * See assets/lab/DECISIONS-BACKEND-HANDOFF.md.
   */

  const DECISION_KEY = "cmx-lab-decisions-v1";
  const RUNTIME_KEY = "cmx-lab-decision-runtime-v1";
  const ACTION_KEY = "cmx-lab-actions-v1";
  const INVENTORY_KEY = "cmx-lab-inventory-v1";
  const SIM_KEY = "cmx-lab-simulations-v1";
  const POLICY_KEY = "cmx-lab-switch-policy-v1";
  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];
  const esc = value => String(value ?? "").replace(/[&<>'\"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[char]));
  const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;

  const CONDITION_META = {
    switch_overdue: { label: "Switch remains overdue", detail: "True after the proof-of-life deadline while this incident is still unresolved." },
    grace_expired: { label: "Grace period has expired", detail: "True only at or after the final trigger boundary." },
    action_state: { label: "Another action has a state", detail: "Require a selected upstream action to reach a specific incident state." },
    asset_status: { label: "Digital asset has a status", detail: "Evaluate the current mock status of a linked Digital Asset record." }
  };

  const ROUTE_META = {
    success: { label: "On success", short: "SUCCESS" },
    failure: { label: "On final failure", short: "FAILURE" },
    acknowledged: { label: "On acknowledgement", short: "ACK" },
    no_ack: { label: "On no acknowledgement", short: "NO ACK" },
    approval_denied: { label: "On approval denied", short: "DENIED" }
  };

  const OUTCOME_STATES = ["SUCCEEDED", "FAILED", "ACKNOWLEDGED", "NO ACKNOWLEDGEMENT", "APPROVAL DENIED"];

  function loadJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch { return fallback; }
  }

  function actions() {
    const store = loadJson(ACTION_KEY, { actions: [] });
    return Array.isArray(store.actions) ? store.actions : [];
  }

  function assets() {
    const store = loadJson(INVENTORY_KEY, { assets: [] });
    return Array.isArray(store.assets) ? store.assets : [];
  }

  function policy() {
    const p = loadJson(POLICY_KEY, { intervalHours: 72, graceHours: 24 });
    return { intervalHours: Number(p.intervalHours || 72), graceHours: Number(p.graceHours ?? 24) };
  }

  function currentSim() {
    return loadJson(SIM_KEY, { current: null }).current;
  }

  function seedPolicies() {
    const existing = new Set(actions().map(action => action.id));
    const policies = {};
    const put = (id, value) => { if (existing.has(id)) policies[id] = normalizePolicy(value); };

    put("act-ai-brief", {
      logic: "AND",
      conditions: [{ id:"cond-ai-overdue", type:"switch_overdue" }],
      acknowledgement: { required:false, timeoutMinutes:30 },
      routes: { success:"act-continuity-email", failure:"", acknowledged:"", no_ack:"", approval_denied:"" },
      branchExclusive: true
    });
    put("act-continuity-email", {
      logic: "AND",
      conditions: [
        { id:"cond-email-overdue", type:"switch_overdue" },
        { id:"cond-email-ai", type:"action_state", sourceActionId:"act-ai-brief", expectedState:"SUCCEEDED" }
      ],
      acknowledgement: { required:true, timeoutMinutes:30 },
      routes: { success:"", failure:"act-legal-sms", acknowledged:"", no_ack:"act-legal-sms", approval_denied:"" },
      branchExclusive: true
    });
    put("act-legal-sms", {
      logic: "AND",
      conditions: [{ id:"cond-sms-overdue", type:"switch_overdue" }],
      acknowledgement: { required:true, timeoutMinutes:60 },
      routes: { success:"", failure:"", acknowledged:"", no_ack:"", approval_denied:"" },
      branchExclusive: true
    });
    put("act-account-handoff", {
      logic: "AND",
      conditions: [{ id:"cond-handoff-final", type:"grace_expired" }],
      acknowledgement: { required:false, timeoutMinutes:30 },
      routes: { success:"", failure:"", acknowledged:"", no_ack:"", approval_denied:"" },
      branchExclusive: true
    });

    return { version:1, policies };
  }

  function normalizePolicy(input = {}) {
    return {
      logic: input.logic === "OR" ? "OR" : "AND",
      conditions: Array.isArray(input.conditions) ? input.conditions.map(condition => ({ ...condition, id: condition.id || uid("cond") })) : [],
      acknowledgement: {
        required: Boolean(input.acknowledgement?.required),
        timeoutMinutes: Math.max(1, Math.min(10080, Number(input.acknowledgement?.timeoutMinutes || 30)))
      },
      routes: {
        success: input.routes?.success || "",
        failure: input.routes?.failure || "",
        acknowledged: input.routes?.acknowledged || "",
        no_ack: input.routes?.no_ack || "",
        approval_denied: input.routes?.approval_denied || ""
      },
      branchExclusive: input.branchExclusive !== false,
      updatedAt: input.updatedAt || new Date().toISOString()
    };
  }

  function loadDecisionStore() {
    const raw = loadJson(DECISION_KEY, null);
    if (raw?.version === 1 && raw.policies) {
      const normalized = { version:1, policies:{} };
      Object.entries(raw.policies).forEach(([id, value]) => normalized.policies[id] = normalizePolicy(value));
      return normalized;
    }
    const seeded = seedPolicies();
    localStorage.setItem(DECISION_KEY, JSON.stringify(seeded));
    return seeded;
  }

  function saveDecisionStore() {
    localStorage.setItem(DECISION_KEY, JSON.stringify(decisionStore));
    document.dispatchEvent(new CustomEvent("cmx:lab-decisions-updated", { detail:{ policies:Object.keys(decisionStore.policies).length } }));
  }

  function loadRuntimeStore() {
    const raw = loadJson(RUNTIME_KEY, null);
    return raw?.version === 1 && raw.bySimulation ? raw : { version:1, bySimulation:{} };
  }

  function saveRuntimeStore() {
    const ids = Object.keys(runtimeStore.bySimulation);
    if (ids.length > 12) ids.slice(0, ids.length - 12).forEach(id => delete runtimeStore.bySimulation[id]);
    localStorage.setItem(RUNTIME_KEY, JSON.stringify(runtimeStore));
  }

  function decisionFor(actionId) {
    if (!decisionStore.policies[actionId]) decisionStore.policies[actionId] = normalizePolicy({});
    return decisionStore.policies[actionId];
  }

  function runtime() {
    const sim = currentSim();
    if (!sim?.id) return null;
    if (!runtimeStore.bySimulation[sim.id]) {
      runtimeStore.bySimulation[sim.id] = {
        states:{}, attempts:{}, acknowledgement:{}, approvals:{}, routeSignals:{}, trace:[], createdAt:new Date().toISOString()
      };
      saveRuntimeStore();
    }
    return runtimeStore.bySimulation[sim.id];
  }

  function actionById(id) { return actions().find(action => action.id === id) || null; }
  function actionName(id) { return actionById(id)?.name || id || "Unassigned"; }
  function actionMark(type) { return ({sms:"SMS",email:"EML",social:"SOC",ai:"AI",organization_notice:"ORG",publish:"PUB",webhook:"API",digital_account:"ACC",custom:"CUS",scheduled:"CAL"}[type] || "ACT"); }

  function actionHour(action) {
    const p = policy();
    const total = p.intervalHours + p.graceHours;
    const trigger = action?.trigger || {};
    if (trigger.mode === "deadline") return p.intervalHours;
    if (trigger.mode === "grace_offset") return p.intervalHours + Math.max(0, Math.min(p.graceHours, Number(trigger.offsetHours || 0)));
    if (trigger.mode === "grace_expiry") return total;
    return null;
  }

  function inboundRoutes(actionId) {
    const inbound = [];
    Object.entries(decisionStore.policies).forEach(([sourceId, dp]) => {
      Object.entries(dp.routes || {}).forEach(([event, targetId]) => {
        if (targetId === actionId) inbound.push({ sourceId, event });
      });
    });
    return inbound;
  }

  function routeSignalSatisfied(actionId, rt) {
    const inbound = inboundRoutes(actionId);
    if (!inbound.length) return { pass:true, reason:"No inbound route gate" };
    const signal = rt?.routeSignals?.[actionId];
    if (!signal) return { pass:false, reason:`Waiting for ${inbound.map(edge => `${ROUTE_META[edge.event]?.short || edge.event} from ${actionName(edge.sourceId)}`).join(" or ")}` };
    return { pass:true, reason:`Activated by ${ROUTE_META[signal.event]?.short || signal.event} from ${actionName(signal.sourceId)}` };
  }

  function resolvedState(actionId, sim, rt) {
    return rt?.states?.[actionId] || sim?.states?.[actionId] || "WAITING";
  }

  function evaluateCondition(condition, sim, rt) {
    const p = policy();
    const hour = Number(sim?.hour || 0);
    if (condition.type === "switch_overdue") {
      const pass = hour >= p.intervalHours;
      return { pass, label:CONDITION_META.switch_overdue.label, detail:pass?`Deadline reached at T+${p.intervalHours}h.`:`Deadline has not been reached yet.` };
    }
    if (condition.type === "grace_expired") {
      const final = p.intervalHours + p.graceHours;
      const pass = hour >= final;
      return { pass, label:CONDITION_META.grace_expired.label, detail:pass?`Final boundary reached at T+${final}h.`:`Final boundary is T+${final}h.` };
    }
    if (condition.type === "action_state") {
      const actual = resolvedState(condition.sourceActionId, sim, rt);
      const expected = condition.expectedState || "SUCCEEDED";
      return { pass:actual === expected, label:`${actionName(condition.sourceActionId)} = ${expected}`, detail:`Current state: ${actual}.` };
    }
    if (condition.type === "asset_status") {
      const asset = assets().find(item => item.id === condition.assetId);
      const expected = condition.expectedStatus || "Active";
      const actual = asset?.status || "Missing";
      return { pass:actual.toLowerCase() === expected.toLowerCase(), label:`${asset?.name || "Asset"} status = ${expected}`, detail:`Current status: ${actual}.` };
    }
    return { pass:false, label:"Unknown condition", detail:"This condition type is not supported by the Lab evaluator." };
  }

  function decisionEvaluation(action, sim, rt) {
    const dp = decisionFor(action.id);
    const due = actionHour(action);
    const timePass = due === null ? action.trigger?.mode === "manual" : Number(sim?.hour || 0) >= due;
    const timeReason = due === null ? (action.trigger?.mode === "manual" ? "Manual-only action" : "Calendar-controlled action") : `${timePass ? "Reached" : "Waiting for"} T+${due}h eligibility boundary`;
    const route = routeSignalSatisfied(action.id, rt);
    const conditionResults = dp.conditions.map(condition => evaluateCondition(condition, sim, rt));
    const conditionsPass = !conditionResults.length || (dp.logic === "OR" ? conditionResults.some(result => result.pass) : conditionResults.every(result => result.pass));
    return { timePass, timeReason, route, conditionResults, conditionsPass, pass:timePass && route.pass && conditionsPass };
  }

  function addDecisionTrace(code, detail, actionId = "") {
    const sim = currentSim();
    const rt = runtime();
    if (!sim || !rt) return;
    rt.trace.unshift({ id:uid("evt"), code, detail, actionId, hour:Number(sim.hour || 0), at:new Date().toISOString() });
    rt.trace = rt.trace.slice(0,100);
    saveRuntimeStore();
  }

  function activateRoute(sourceId, event) {
    const rt = runtime();
    if (!rt) return;
    const dp = decisionFor(sourceId);
    const targetId = dp.routes?.[event];
    if (!targetId) return;
    rt.routeSignals[targetId] = { sourceId, event, atHour:Number(currentSim()?.hour || 0), at:new Date().toISOString() };
    addDecisionTrace("ROUTE_ACTIVATED", `${ROUTE_META[event]?.label || event} routed ${actionName(sourceId)} → ${actionName(targetId)}.`, sourceId);
    if (dp.branchExclusive) {
      Object.entries(dp.routes || {}).forEach(([otherEvent, otherTarget]) => {
        if (!otherTarget || otherEvent === event || otherTarget === targetId) return;
        const state = resolvedState(otherTarget, currentSim(), rt);
        if (!["SUCCEEDED","FAILED","ACKNOWLEDGED","NO ACKNOWLEDGEMENT"].includes(state)) {
          rt.states[otherTarget] = "CANCELLED";
          addDecisionTrace("BRANCH_CANCELLED", `${actionName(otherTarget)} was cancelled because the ${ROUTE_META[event]?.short || event} branch was selected.`, otherTarget);
        }
      });
    }
    saveRuntimeStore();
  }

  function reconcileRuntime() {
    const sim = currentSim();
    const rt = runtime();
    if (!sim || !rt) return;
    const currentActions = actions();

    currentActions.forEach(action => {
      const sticky = rt.states[action.id];
      if (["SUCCEEDED","FAILED","AWAITING ACKNOWLEDGEMENT","ACKNOWLEDGED","NO ACKNOWLEDGEMENT","APPROVAL DENIED","CANCELLED","RETRY QUEUED"].includes(sticky)) return;
      if (action.status !== "Enabled") {
        rt.states[action.id] = action.status.toUpperCase();
        return;
      }
      const evaluation = decisionEvaluation(action, sim, rt);
      if (!evaluation.pass) {
        rt.states[action.id] = "BLOCKED";
        return;
      }
      if (action.guardrails?.requireApproval && !rt.approvals[action.id]) rt.states[action.id] = "AWAITING APPROVAL";
      else rt.states[action.id] = "ELIGIBLE";
    });

    Object.entries(rt.acknowledgement || {}).forEach(([actionId, ack]) => {
      if (rt.states[actionId] !== "AWAITING ACKNOWLEDGEMENT") return;
      if (Number(sim.hour || 0) >= Number(ack.deadlineHour || Infinity)) {
        rt.states[actionId] = "NO ACKNOWLEDGEMENT";
        addDecisionTrace("ACK_TIMEOUT", `${actionName(actionId)} reached its acknowledgement timeout.`, actionId);
        activateRoute(actionId, "no_ack");
      }
    });
    saveRuntimeStore();
  }

  function executeAction(actionId, outcome = "success") {
    const sim = currentSim();
    const rt = runtime();
    const action = actionById(actionId);
    if (!sim || !rt || !action) return;
    reconcileRuntime();
    const state = rt.states[actionId];
    if (!["ELIGIBLE","AWAITING APPROVAL","RETRY QUEUED"].includes(state)) return;

    if (state === "AWAITING APPROVAL" && !rt.approvals[actionId]) {
      if (outcome === "deny") {
        rt.states[actionId] = "APPROVAL DENIED";
        addDecisionTrace("APPROVAL_DENIED", `${action.name} was denied in simulation.`, actionId);
        activateRoute(actionId, "approval_denied");
        saveRuntimeStore();
        refresh();
        return;
      }
      rt.approvals[actionId] = true;
      addDecisionTrace("ACTION_APPROVED", `${action.name} received simulated operator approval.`, actionId);
    }

    const attempts = Number(rt.attempts[actionId] || 0) + 1;
    rt.attempts[actionId] = attempts;
    rt.states[actionId] = "EXECUTING";
    addDecisionTrace("SIMULATED_EXECUTION", `${action.name} entered synthetic execution attempt ${attempts}. No external side effect occurred.`, actionId);

    if (outcome === "failure") {
      const maxAttempts = Number(action.guardrails?.retryCount || 0) + 1;
      if (attempts < maxAttempts) {
        rt.states[actionId] = "RETRY QUEUED";
        addDecisionTrace("RETRY_QUEUED", `${action.name} failed attempt ${attempts}. ${maxAttempts - attempts} simulated attempt${maxAttempts - attempts === 1 ? "" : "s"} remain.`, actionId);
      } else {
        rt.states[actionId] = "FAILED";
        addDecisionTrace("FINAL_FAILURE", `${action.name} exhausted its configured simulated attempts.`, actionId);
        activateRoute(actionId, "failure");
      }
    } else {
      const dp = decisionFor(actionId);
      if (dp.acknowledgement.required) {
        const timeoutHours = dp.acknowledgement.timeoutMinutes / 60;
        rt.states[actionId] = "AWAITING ACKNOWLEDGEMENT";
        rt.acknowledgement[actionId] = {
          deliveredAtHour:Number(sim.hour || 0),
          deadlineHour:Number(sim.hour || 0) + timeoutHours,
          timeoutMinutes:dp.acknowledgement.timeoutMinutes
        };
        addDecisionTrace("DELIVERED_AWAITING_ACK", `${action.name} simulated delivery succeeded. Acknowledgement is required within ${dp.acknowledgement.timeoutMinutes} minutes.`, actionId);
      } else {
        rt.states[actionId] = "SUCCEEDED";
        addDecisionTrace("SIMULATED_SUCCESS", `${action.name} completed successfully in simulation.`, actionId);
        activateRoute(actionId, "success");
      }
    }
    saveRuntimeStore();
    reconcileRuntime();
    refresh();
  }

  function acknowledge(actionId, acknowledged = true) {
    const rt = runtime();
    if (!rt || rt.states[actionId] !== "AWAITING ACKNOWLEDGEMENT") return;
    if (acknowledged) {
      rt.states[actionId] = "ACKNOWLEDGED";
      rt.acknowledgement[actionId] = { ...(rt.acknowledgement[actionId] || {}), acknowledgedAt:new Date().toISOString() };
      addDecisionTrace("ACKNOWLEDGED", `${actionName(actionId)} received a simulated acknowledgement.`, actionId);
      activateRoute(actionId, "acknowledged");
    } else {
      rt.states[actionId] = "NO ACKNOWLEDGEMENT";
      addDecisionTrace("NO_ACKNOWLEDGEMENT", `${actionName(actionId)} was marked unacknowledged in simulation.`, actionId);
      activateRoute(actionId, "no_ack");
    }
    saveRuntimeStore();
    reconcileRuntime();
    refresh();
  }

  function runEligible() {
    reconcileRuntime();
    const rt = runtime();
    actions().filter(action => rt?.states[action.id] === "ELIGIBLE").forEach(action => executeAction(action.id, "success"));
    refresh();
  }

  function evaluationRows(actionId) {
    const sim = currentSim();
    const rt = runtime();
    const action = actionById(actionId);
    if (!sim || !rt || !action) return [];
    const evaluation = decisionEvaluation(action, sim, rt);
    return [
      { pass:evaluation.timePass, label:"Time boundary", detail:evaluation.timeReason },
      { pass:evaluation.route.pass, label:"Route gate", detail:evaluation.route.reason },
      ...evaluation.conditionResults
    ];
  }

  function cycleCheck(candidateStore) {
    const graph = new Map();
    actions().forEach(action => graph.set(action.id, new Set()));
    Object.entries(candidateStore.policies).forEach(([sourceId, dp]) => {
      Object.values(dp.routes || {}).filter(Boolean).forEach(targetId => graph.get(sourceId)?.add(targetId));
      (dp.conditions || []).filter(c => c.type === "action_state" && c.sourceActionId).forEach(c => graph.get(c.sourceActionId)?.add(sourceId));
    });
    const visiting = new Set(), visited = new Set();
    const visit = id => {
      if (visiting.has(id)) return true;
      if (visited.has(id)) return false;
      visiting.add(id);
      for (const next of graph.get(id) || []) if (visit(next)) return true;
      visiting.delete(id); visited.add(id); return false;
    };
    for (const id of graph.keys()) if (visit(id)) return true;
    return false;
  }

  function edgeList() {
    const edges = [];
    Object.entries(decisionStore.policies).forEach(([sourceId, dp]) => {
      Object.entries(dp.routes || {}).forEach(([event, targetId]) => {
        if (targetId) edges.push({ sourceId, targetId, event });
      });
      (dp.conditions || []).filter(c => c.type === "action_state" && c.sourceActionId).forEach(c => {
        if (!edges.some(edge => edge.sourceId === c.sourceActionId && edge.targetId === sourceId)) edges.push({ sourceId:c.sourceActionId, targetId:sourceId, event:"dependency" });
      });
    });
    return edges;
  }

  function graphNode(action) {
    const rt = runtime();
    const state = resolvedState(action.id, currentSim(), rt);
    const dp = decisionFor(action.id);
    const inbound = inboundRoutes(action.id).length;
    return `<button type="button" class="lab-decision-node state-${esc(state.toLowerCase().replace(/\s+/g,"-"))} risk-${esc(String(action.risk || "Important").toLowerCase())}" data-decision-node="${esc(action.id)}"><span class="lab-decision-node-mark">${actionMark(action.type)}</span><span class="lab-decision-node-copy"><small>${esc(action.risk || "Important")} · ${dp.conditions.length} condition${dp.conditions.length === 1 ? "" : "s"}</small><strong>${esc(action.name)}</strong><em>${esc(state)}</em></span>${inbound ? `<b>${inbound} IN</b>` : ""}</button>`;
  }

  function inspectorHtml(actionId) {
    const action = actionById(actionId);
    if (!action) return '<div class="lab-decision-empty"><strong>Select a node</strong><p>Choose an action to inspect why it can or cannot run.</p></div>';
    const rt = runtime();
    const dp = decisionFor(actionId);
    const state = resolvedState(actionId, currentSim(), rt);
    const rows = evaluationRows(actionId);
    const ack = rt?.acknowledgement?.[actionId];
    return `<div class="lab-decision-inspector"><header><span class="lab-decision-node-mark">${actionMark(action.type)}</span><div><small>DECISION INSPECTOR</small><strong>${esc(action.name)}</strong><em>${esc(state)}</em></div><button type="button" data-decision-edit="${esc(action.id)}">Edit logic</button></header><section class="lab-decision-why"><div class="lab-decision-section-title"><strong>${["SUCCEEDED","ACKNOWLEDGED","FAILED","NO ACKNOWLEDGEMENT"].includes(state) ? "Why did this resolve?" : "Why hasn't this run?"}</strong><span>${dp.logic}</span></div>${rows.map(row => `<div class="lab-decision-check ${row.pass ? "pass" : "fail"}"><b>${row.pass ? "✓" : "×"}</b><span><strong>${esc(row.label)}</strong><small>${esc(row.detail)}</small></span></div>`).join("") || '<p class="lab-decision-muted">No extra conditions. Timing and route gates still apply.</p>'}</section><section class="lab-decision-inspector-grid"><div><small>ACKNOWLEDGEMENT</small><strong>${dp.acknowledgement.required ? `Required · ${dp.acknowledgement.timeoutMinutes}m` : "Not required"}</strong>${ack ? `<span>Deadline T+${Number(ack.deadlineHour || 0).toFixed(2)}h</span>` : ""}</div><div><small>ATTEMPTS</small><strong>${Number(rt?.attempts?.[actionId] || 0)}</strong><span>${Number(action.guardrails?.retryCount || 0)} retries configured</span></div></section><section class="lab-decision-routes"><div class="lab-decision-section-title"><strong>Outcome routing</strong><span>${dp.branchExclusive ? "EXCLUSIVE" : "PARALLEL"}</span></div>${Object.entries(ROUTE_META).map(([event, meta]) => `<div><span>${esc(meta.label)}</span><strong>${dp.routes[event] ? esc(actionName(dp.routes[event])) : "No route"}</strong></div>`).join("")}</section></div>`;
  }

  function decisionTrace() {
    const events = runtime()?.trace || [];
    return events.slice(0,12).map(event => `<div class="lab-decision-trace-row"><span><i></i><strong>${esc(event.code)}</strong></span><p>${esc(event.detail)}</p><time>T+${Number(event.hour || 0).toFixed(2)}h</time></div>`).join("") || '<p class="lab-decision-muted">No decision events in this simulation yet.</p>';
  }

  let graphRoot, inspectorRoot, modal, selectedId = "";

  function renderDecisionWorkspace() {
    if (!graphRoot) return;
    reconcileRuntime();
    const enabled = actions().filter(action => action.status === "Enabled");
    if (!selectedId || !actionById(selectedId)) selectedId = enabled[0]?.id || actions()[0]?.id || "";
    graphRoot.innerHTML = `<header class="lab-decision-head"><div><span class="lab-decision-kicker">DECISION ENGINE · LAB</span><h2>Logic & routing map</h2><p>Typed conditions, dependency gates, acknowledgements, and outcome branches for the current synthetic incident.</p></div><div><span><b>${edgeList().length}</b><small>LINKS</small></span><span><b>${enabled.length}</b><small>ENABLED</small></span><button type="button" data-decision-edit="${esc(selectedId)}">Configure selected</button></div></header><div class="lab-decision-map-shell"><div class="lab-decision-map" id="labDecisionMap"><svg class="lab-decision-svg" aria-hidden="true"></svg><div class="lab-decision-nodes">${enabled.map(graphNode).join("") || '<div class="lab-decision-empty"><strong>No enabled actions</strong></div>'}</div></div><aside class="lab-decision-inspector-root">${inspectorHtml(selectedId)}</aside></div><section class="lab-decision-trace"><div class="lab-decision-section-title"><strong>Decision trace</strong><span>${runtime()?.trace?.length || 0} EVENTS</span></div>${decisionTrace()}</section>`;
    inspectorRoot = $(".lab-decision-inspector-root", graphRoot);
    requestAnimationFrame(drawEdges);
  }

  function drawEdges() {
    const map = $("#labDecisionMap", graphRoot);
    const svg = $(".lab-decision-svg", map);
    if (!map || !svg) return;
    const rect = map.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${Math.max(1, rect.width)} ${Math.max(1, rect.height)}`);
    svg.innerHTML = '<defs><marker id="labDecisionArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z"></path></marker></defs>';
    edgeList().forEach((edge, index) => {
      const source = $(`[data-decision-node="${CSS.escape(edge.sourceId)}"]`, map);
      const target = $(`[data-decision-node="${CSS.escape(edge.targetId)}"]`, map);
      if (!source || !target) return;
      const a = source.getBoundingClientRect(), b = target.getBoundingClientRect();
      const x1 = a.right - rect.left, y1 = a.top + a.height / 2 - rect.top;
      const x2 = b.left - rect.left, y2 = b.top + b.height / 2 - rect.top;
      const mid = x1 + Math.max(28, (x2 - x1) / 2);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`);
      path.setAttribute("class", `route-${edge.event}`);
      path.setAttribute("marker-end", "url(#labDecisionArrow)");
      svg.append(path);
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", String(mid)); text.setAttribute("y", String((y1 + y2) / 2 - 5)); text.setAttribute("class", `route-${edge.event}`);
      text.textContent = edge.event === "dependency" ? "REQUIRES" : (ROUTE_META[edge.event]?.short || edge.event.toUpperCase());
      svg.append(text);
    });
  }

  function patchSequenceDom() {
    const sim = currentSim(), rt = runtime();
    if (!sim || !rt) return;
    actions().forEach(action => {
      const state = resolvedState(action.id, sim, rt);
      const slug = state.toLowerCase().replace(/\s+/g,"-");
      const queue = $(`[data-sim-action="${CSS.escape(action.id)}"]`)?.closest(".lab-sim-action") || $(`.lab-sim-action .lab-sim-outcomes [data-sim-action="${CSS.escape(action.id)}"]`)?.closest(".lab-sim-action");
      const candidates = $$(".lab-sim-action").filter(row => row.textContent.includes(action.name));
      const row = queue || candidates[0];
      if (row) {
        [...row.classList].filter(name => name.startsWith("state-")).forEach(name => row.classList.remove(name));
        row.classList.add(`state-${slug}`);
        const stateNode = $(".lab-sim-state", row); if (stateNode) stateNode.textContent = state;
        const outcomes = $(".lab-sim-outcomes", row);
        if (outcomes) {
          let buttons = "";
          if (state === "ELIGIBLE" || state === "RETRY QUEUED") buttons = `<button type="button" data-decision-run="${esc(action.id)}" data-decision-outcome="success">${state === "RETRY QUEUED" ? "Retry success" : "Simulate success"}</button><button type="button" data-decision-run="${esc(action.id)}" data-decision-outcome="failure">${state === "RETRY QUEUED" ? "Retry failure" : "Simulate failure"}</button>`;
          if (state === "AWAITING APPROVAL") buttons = `<button type="button" data-decision-run="${esc(action.id)}" data-decision-outcome="success">Approve + run</button><button type="button" data-decision-run="${esc(action.id)}" data-decision-outcome="deny">Deny</button>`;
          if (state === "AWAITING ACKNOWLEDGEMENT") buttons = `<button type="button" data-decision-ack="${esc(action.id)}" data-decision-ack-value="yes">Acknowledge</button><button type="button" data-decision-ack="${esc(action.id)}" data-decision-ack-value="no">No response</button>`;
          outcomes.innerHTML = buttons;
        }
      }
      const marker = $(`[data-sequence-action="${CSS.escape(action.id)}"]`);
      if (marker) {
        [...marker.classList].filter(name => name.startsWith("state-")).forEach(name => marker.classList.remove(name));
        marker.classList.add(`state-${slug}`);
        const small = $("small", marker); if (small) small.textContent = state;
      }
    });
  }

  function refresh() {
    reconcileRuntime();
    renderDecisionWorkspace();
    requestAnimationFrame(patchSequenceDom);
    renderActionLogicCard();
    renderDecisionActivity();
  }

  function renderDecisionActivity() {
    const activityPanel = $("[data-view-panel='activity']");
    if (!activityPanel) return;
    let box = $(".lab-decision-activity", activityPanel);
    if (!box) { box = document.createElement("section"); box.className = "lab-decision-activity"; $(".lab-sim-activity", activityPanel)?.after(box); }
    box.innerHTML = `<div class="lab-decision-section-title"><strong>DECISION TRACE</strong><span>${runtime()?.trace?.length || 0}</span></div>${decisionTrace()}`;
  }

  function renderActionLogicCard() {
    const root = $(".lab-actions");
    if (!root) return;
    const selected = $("[data-action-id].is-active", root)?.dataset.actionId || selectedId;
    const action = actionById(selected);
    if (!action) return;
    let button = $("[data-decision-edit]", $(".lab-action-profile-actions", root));
    if (!button) {
      button = document.createElement("button"); button.type = "button"; button.className = "lab-action-button"; $(".lab-action-profile-actions", root)?.prepend(button);
    }
    button.dataset.decisionEdit = action.id; button.textContent = "Logic";
    const grid = $(".lab-action-detail-grid", root);
    if (!grid) return;
    let card = $(".lab-action-decision-card", grid);
    if (!card) { card = document.createElement("section"); card.className = "lab-action-card full lab-action-decision-card"; grid.prepend(card); }
    const dp = decisionFor(action.id), inbound = inboundRoutes(action.id);
    card.innerHTML = `<div class="lab-card-head"><strong>Decision policy</strong><small>PHASE 6</small></div><div class="lab-action-decision-summary"><span><small>CONDITIONS</small><strong>${dp.conditions.length} · ${dp.logic}</strong></span><span><small>INBOUND ROUTES</small><strong>${inbound.length}</strong></span><span><small>ACKNOWLEDGEMENT</small><strong>${dp.acknowledgement.required ? `${dp.acknowledgement.timeoutMinutes}m required` : "Not required"}</strong></span><button type="button" data-decision-edit="${esc(action.id)}">Configure logic & routing</button></div>`;
  }

  function routeOptions(current, selfId) {
    return `<option value="">No route</option>${actions().filter(action => action.id !== selfId).map(action => `<option value="${esc(action.id)}"${current === action.id ? " selected" : ""}>${esc(action.name)}</option>`).join("")}`;
  }

  function conditionEditor(condition, selfId) {
    const type = condition.type || "switch_overdue";
    let detail = "";
    if (type === "action_state") detail = `<select data-condition-source>${actions().filter(action => action.id !== selfId).map(action => `<option value="${esc(action.id)}"${condition.sourceActionId === action.id ? " selected" : ""}>${esc(action.name)}</option>`).join("")}</select><select data-condition-state>${OUTCOME_STATES.map(state => `<option value="${esc(state)}"${condition.expectedState === state ? " selected" : ""}>${esc(state)}</option>`).join("")}</select>`;
    if (type === "asset_status") detail = `<select data-condition-asset>${assets().map(asset => `<option value="${esc(asset.id)}"${condition.assetId === asset.id ? " selected" : ""}>${esc(asset.name)}</option>`).join("")}</select><select data-condition-asset-status>${["Active","Review Due","Archived","Restricted","Inactive"].map(status => `<option${condition.expectedStatus === status ? " selected" : ""}>${status}</option>`).join("")}</select>`;
    return `<div class="lab-condition-editor" data-condition-id="${esc(condition.id)}"><span class="lab-condition-grip">⋮⋮</span><select data-condition-type>${Object.entries(CONDITION_META).map(([key, meta]) => `<option value="${key}"${type === key ? " selected" : ""}>${esc(meta.label)}</option>`).join("")}</select><div class="lab-condition-detail">${detail || `<small>${esc(CONDITION_META[type]?.detail || "")}</small>`}</div><button type="button" data-condition-remove="${esc(condition.id)}" aria-label="Remove condition">×</button></div>`;
  }

  let editingPolicy = null;

  function openLogicModal(actionId) {
    const action = actionById(actionId); if (!action) return;
    selectedId = actionId;
    editingPolicy = JSON.parse(JSON.stringify(decisionFor(actionId)));
    renderLogicModal(action);
    modal.showModal();
  }

  function renderLogicModal(action) {
    const dp = editingPolicy;
    modal.innerHTML = `<div class="lab-decision-modal-shell"><header><div><small>DECISION POLICY · LAB</small><h2>${esc(action.name)}</h2><p>Configure typed gates and outcome routing. No external action can execute from this browser.</p></div><button type="button" data-decision-modal="close" aria-label="Close">×</button></header><div class="lab-decision-modal-warning"><b>!</b><span><strong>SERVER POLICY LATER</strong><small>FastAPI must validate these rules, reject cycles, and persist immutable evaluation results in production.</small></span></div><main><section class="lab-decision-modal-section"><div class="lab-decision-modal-title"><span><small>01</small><strong>Conditions</strong></span><label>Combine with <select id="labDecisionLogic"><option value="AND"${dp.logic === "AND" ? " selected" : ""}>AND</option><option value="OR"${dp.logic === "OR" ? " selected" : ""}>OR</option></select></label></div><div id="labConditionEditors">${dp.conditions.map(condition => conditionEditor(condition, action.id)).join("") || '<p class="lab-decision-muted">No extra conditions. Timing and route gates still apply.</p>'}</div><button type="button" class="lab-decision-add-condition" data-decision-modal="add-condition">＋ Add condition</button></section><section class="lab-decision-modal-section"><div class="lab-decision-modal-title"><span><small>02</small><strong>Acknowledgement</strong></span></div><label class="lab-decision-toggle"><input id="labAckRequired" type="checkbox" ${dp.acknowledgement.required ? "checked" : ""} /><span><i></i><strong>Require acknowledgement after successful delivery</strong><small>Delivery can succeed while the incident still waits for a human acknowledgement.</small></span></label><label class="lab-decision-timeout"><span>Timeout</span><input id="labAckTimeout" type="number" min="1" max="10080" value="${dp.acknowledgement.timeoutMinutes}" /><b>minutes</b></label></section><section class="lab-decision-modal-section"><div class="lab-decision-modal-title"><span><small>03</small><strong>Outcome routing</strong></span><label class="lab-decision-inline-check"><input id="labBranchExclusive" type="checkbox" ${dp.branchExclusive ? "checked" : ""} /> Cancel sibling branches</label></div><div class="lab-route-editors">${Object.entries(ROUTE_META).map(([event, meta]) => `<label><span>${esc(meta.label)}</span><select data-route-event="${event}">${routeOptions(dp.routes[event], action.id)}</select></label>`).join("")}</div></section><section class="lab-decision-modal-section compact"><div class="lab-decision-modal-title"><span><small>04</small><strong>Safety preview</strong></span></div><div class="lab-decision-safety-preview"><span><small>DEPENDENCY CYCLES</small><strong>Rejected on save</strong></span><span><small>ARBITRARY CODE</small><strong>Unavailable</strong></span><span><small>EXTERNAL EXECUTION</small><strong>Blocked</strong></span></div></section></main><footer><span><b>LAB SAFE MODE</b><small>Typed definitions are stored only in this browser.</small></span><div><button type="button" data-decision-modal="close">Cancel</button><button type="button" class="primary" data-decision-modal="save">Save decision policy</button></div></footer></div>`;
  }

  function captureModal() {
    if (!editingPolicy) return;
    editingPolicy.logic = $("#labDecisionLogic", modal)?.value === "OR" ? "OR" : "AND";
    editingPolicy.acknowledgement.required = Boolean($("#labAckRequired", modal)?.checked);
    editingPolicy.acknowledgement.timeoutMinutes = Math.max(1, Math.min(10080, Number($("#labAckTimeout", modal)?.value || 30)));
    editingPolicy.branchExclusive = Boolean($("#labBranchExclusive", modal)?.checked);
    $$('[data-route-event]', modal).forEach(select => editingPolicy.routes[select.dataset.routeEvent] = select.value);
    editingPolicy.conditions = $$(".lab-condition-editor", modal).map(row => {
      const type = $("[data-condition-type]", row)?.value || "switch_overdue";
      const condition = { id:row.dataset.conditionId || uid("cond"), type };
      if (type === "action_state") { condition.sourceActionId = $("[data-condition-source]", row)?.value || ""; condition.expectedState = $("[data-condition-state]", row)?.value || "SUCCEEDED"; }
      if (type === "asset_status") { condition.assetId = $("[data-condition-asset]", row)?.value || ""; condition.expectedStatus = $("[data-condition-asset-status]", row)?.value || "Active"; }
      return condition;
    });
  }

  function saveModalPolicy() {
    captureModal();
    const next = JSON.parse(JSON.stringify(decisionStore));
    next.policies[selectedId] = normalizePolicy({ ...editingPolicy, updatedAt:new Date().toISOString() });
    if (cycleCheck(next)) {
      const note = $(".lab-decision-modal-warning small", modal); if (note) note.textContent = "This change creates a dependency cycle. Remove the circular route/dependency before saving.";
      modal.classList.add("has-cycle-error");
      return;
    }
    decisionStore = next;
    saveDecisionStore();
    editingPolicy = null;
    modal.close();
    reconcileRuntime();
    refresh();
  }

  function handleModalClick(event) {
    const command = event.target.closest("[data-decision-modal]")?.dataset.decisionModal;
    if (command === "close") { modal.close(); editingPolicy = null; return; }
    if (command === "save") return saveModalPolicy();
    if (command === "add-condition") {
      captureModal();
      editingPolicy.conditions.push({ id:uid("cond"), type:"switch_overdue" });
      renderLogicModal(actionById(selectedId));
      return;
    }
    const remove = event.target.closest("[data-condition-remove]")?.dataset.conditionRemove;
    if (remove) {
      captureModal(); editingPolicy.conditions = editingPolicy.conditions.filter(condition => condition.id !== remove); renderLogicModal(actionById(selectedId));
    }
  }

  function handleModalChange(event) {
    if (!event.target.matches("[data-condition-type]")) return;
    captureModal();
    const row = event.target.closest(".lab-condition-editor");
    const condition = editingPolicy.conditions.find(item => item.id === row?.dataset.conditionId);
    if (condition) {
      condition.type = event.target.value;
      if (condition.type === "action_state") { condition.sourceActionId = actions().find(action => action.id !== selectedId)?.id || ""; condition.expectedState = "SUCCEEDED"; }
      if (condition.type === "asset_status") { condition.assetId = assets()[0]?.id || ""; condition.expectedStatus = "Active"; }
    }
    renderLogicModal(actionById(selectedId));
  }

  function interceptSequence(event) {
    const run = event.target.closest("[data-sim-action]");
    if (run) { event.preventDefault(); event.stopImmediatePropagation(); executeAction(run.dataset.simAction, run.dataset.simOutcome || "success"); return; }
    const runEligibleButton = event.target.closest('[data-sequence-command="run-eligible"]');
    if (runEligibleButton) { event.preventDefault(); event.stopImmediatePropagation(); runEligible(); }
  }

  function handleGlobalDecisionClick(event) {
    const run = event.target.closest("[data-decision-run]"); if (run) return executeAction(run.dataset.decisionRun, run.dataset.decisionOutcome || "success");
    const ack = event.target.closest("[data-decision-ack]"); if (ack) return acknowledge(ack.dataset.decisionAck, ack.dataset.decisionAckValue === "yes");
    const edit = event.target.closest("[data-decision-edit]"); if (edit) return openLogicModal(edit.dataset.decisionEdit);
    const node = event.target.closest("[data-decision-node]"); if (node) { selectedId = node.dataset.decisionNode; renderDecisionWorkspace(); renderActionLogicCard(); }
  }

  function buildWorkspace(attempt = 0) {
    const sequenceRoot = $(".lab-sequence-root");
    if (!sequenceRoot) { if (attempt < 18) requestAnimationFrame(() => buildWorkspace(attempt + 1)); return; }
    let section = $(".lab-decision-workspace", sequenceRoot);
    if (!section) { section = document.createElement("section"); section.className = "lab-decision-workspace"; sequenceRoot.append(section); }
    graphRoot = section;
    if (!modal) { modal = document.createElement("dialog"); modal.className = "lab-decision-modal"; modal.id = "labDecisionModal"; document.body.append(modal); modal.addEventListener("click", handleModalClick); modal.addEventListener("change", handleModalChange); }
    graphRoot.addEventListener("click", handleGlobalDecisionClick);
    document.addEventListener("click", handleGlobalDecisionClick);
    document.addEventListener("click", interceptSequence, true);
    document.addEventListener("cmx:lab-simulation-updated", () => requestAnimationFrame(refresh));
    document.addEventListener("cmx:lab-actions-updated", () => { decisionStore = loadDecisionStore(); reconcileRuntime(); requestAnimationFrame(refresh); });
    document.addEventListener("cmx:lab-inventory-updated", () => requestAnimationFrame(refresh));
    window.addEventListener("resize", () => requestAnimationFrame(drawEdges));
    const sequencePanel = $("[data-view-panel='timeline']"); if (sequencePanel) new MutationObserver(() => requestAnimationFrame(() => { patchSequenceDom(); if (!$(".lab-decision-workspace", sequenceRoot)) sequenceRoot.append(graphRoot); })).observe(sequencePanel,{ childList:true, subtree:true });
    const actionRoot = $(".lab-actions"); if (actionRoot) new MutationObserver(() => requestAnimationFrame(renderActionLogicCard)).observe(actionRoot,{ childList:true, subtree:true });
    refresh();
  }

  let decisionStore = loadDecisionStore();
  let runtimeStore = loadRuntimeStore();

  window.CMX_LAB_DECISIONS = Object.freeze({
    getPolicy: actionId => JSON.parse(JSON.stringify(decisionFor(actionId))),
    evaluate: actionId => evaluationRows(actionId),
    getState: actionId => resolvedState(actionId, currentSim(), runtime()),
    reconcile: () => { reconcileRuntime(); refresh(); }
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => buildWorkspace(), { once:true });
  else buildWorkspace();
})();