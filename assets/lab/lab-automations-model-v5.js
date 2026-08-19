(() => {
  "use strict";

  const STORE_KEY = "cmx-lab-automations-v1";
  const CONTROLS_KEY = "cmx-lab-automation-flow-controls-v1";
  const VERSION = 5;
  let syncTimer = null;

  const clone = value => JSON.parse(JSON.stringify(value ?? null));

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function readStore() {
    const value = readJson(STORE_KEY, null);
    return value && Array.isArray(value.automations) ? value : { version: 1, automations: [] };
  }

  function projectionSignature(automation) {
    return JSON.stringify({
      trigger: automation?.trigger || null,
      conditions: Array.isArray(automation?.conditions) ? automation.conditions : [],
      ruleMode: automation?.ruleMode || "all",
      actions: Array.isArray(automation?.actions) ? automation.actions : [],
      flowControls: Array.isArray(automation?.flowControls) ? automation.flowControls : [],
      timing: automation?.timing || null,
      repeatConfig: automation?.repeatConfig || null,
      outcome: automation?.outcome || "end"
    });
  }

  function legacyControls(automation) {
    const direct = Array.isArray(automation?.flowControls) ? automation.flowControls : [];
    if (direct.length) return direct;
    const fallback = readJson(CONTROLS_KEY, { version: 1, automations: {} });
    return Array.isArray(fallback?.automations?.[automation?.id]) ? fallback.automations[automation.id] : [];
  }

  function normalizeDuration(value = {}) {
    return {
      days: Math.max(0, Number(value.days) || 0),
      hours: Math.max(0, Number(value.hours) || 0),
      minutes: Math.max(0, Number(value.minutes) || 0)
    };
  }

  function derive(automation) {
    const controls = legacyControls(automation);
    const actions = Array.isArray(automation?.actions) ? automation.actions : [];
    const validActionIds = new Set(actions.map(action => action.id));
    const nodes = [];

    nodes.push({
      id: `v5-trigger:${automation.id}`,
      kind: "trigger",
      capabilityId: automation.trigger || null
    });

    (automation.conditions || []).forEach(rule => {
      nodes.push({
        id: rule.id,
        kind: "condition",
        phase: "pre",
        conditionType: rule.type,
        enabled: rule.enabled !== false
      });
    });

    actions.forEach((action, index) => {
      nodes.push({
        id: action.id,
        kind: "action",
        action: clone(action)
      });

      if (index >= actions.length - 1) return;
      controls.filter(control => control?.afterActionId === action.id).forEach(control => {
        if (!control?.id || !["condition", "wait"].includes(control.type)) return;
        if (control.type === "condition") {
          nodes.push({
            id: control.id,
            kind: "condition",
            phase: "sequence",
            source: clone(control.source),
            operator: control.operator || "equals",
            compareValue: control.compareValue || "",
            enabled: control.enabled !== false
          });
        } else {
          nodes.push({
            id: control.id,
            kind: "wait",
            phase: "sequence",
            duration: normalizeDuration(control.duration),
            enabled: control.enabled !== false
          });
        }
      });
    });

    nodes.push({
      id: `v5-finish:${automation.id}`,
      kind: "finish",
      outcome: automation.outcome || "end"
    });

    return {
      version: VERSION,
      automationId: automation.id,
      modelRevision: Number(automation.workflowV5?.modelRevision) || 1,
      nodes,
      policies: {
        preconditionMode: automation.ruleMode === "any" ? "any" : "all",
        start: clone(automation.timing || null),
        recurrence: clone(automation.repeatConfig || null)
      },
      projectionSignature: projectionSignature({
        ...automation,
        flowControls: controls.filter(control => validActionIds.has(control.afterActionId))
      })
    };
  }

  function validate(model) {
    const errors = [];
    const warnings = [];
    const nodes = Array.isArray(model?.nodes) ? model.nodes : [];
    const ids = new Set();
    const actionIndexes = new Map();
    let triggerCount = 0;
    let finishCount = 0;

    nodes.forEach((node, index) => {
      if (!node?.id) errors.push({ code: "node_missing_id", index });
      else if (ids.has(node.id)) errors.push({ code: "duplicate_node_id", nodeId: node.id });
      else ids.add(node.id);

      if (node?.kind === "trigger") triggerCount += 1;
      if (node?.kind === "finish") finishCount += 1;
      if (node?.kind === "action") actionIndexes.set(node.id, index);
    });

    if (triggerCount !== 1) errors.push({ code: "trigger_count", count: triggerCount });
    if (finishCount !== 1) errors.push({ code: "finish_count", count: finishCount });
    if (nodes[0]?.kind !== "trigger") errors.push({ code: "trigger_must_be_first" });
    if (nodes.at(-1)?.kind !== "finish") errors.push({ code: "finish_must_be_last" });

    const firstAction = nodes.findIndex(node => node.kind === "action");
    const lastAction = (() => {
      for (let i = nodes.length - 1; i >= 0; i -= 1) if (nodes[i]?.kind === "action") return i;
      return -1;
    })();

    if (firstAction < 0) warnings.push({ code: "no_actions" });

    nodes.forEach((node, index) => {
      if (node?.kind === "condition" && node.phase === "pre" && firstAction >= 0 && index > firstAction) {
        errors.push({ code: "precondition_after_action", nodeId: node.id });
      }
      if (["condition", "wait"].includes(node?.kind) && node.phase === "sequence") {
        if (firstAction < 0 || index <= firstAction || index >= lastAction) {
          errors.push({ code: "sequence_control_outside_actions", nodeId: node.id });
        }
        if (node.kind === "condition" && node.source?.sourceType === "step") {
          const sourceIndex = actionIndexes.get(node.source.sourceId);
          if (!Number.isInteger(sourceIndex) || sourceIndex >= index) {
            errors.push({ code: "condition_uses_future_or_missing_step", nodeId: node.id, sourceId: node.source.sourceId });
          }
        }
      }
    });

    return { ok: errors.length === 0, errors, warnings };
  }

  function build(automation) {
    const signature = projectionSignature({ ...automation, flowControls: legacyControls(automation) });
    const existing = automation?.workflowV5;
    if (existing?.version === VERSION && existing.projectionSignature === signature && validate(existing).ok) {
      return clone(existing);
    }
    const next = derive(automation);
    if (existing?.version === VERSION) next.modelRevision = (Number(existing.modelRevision) || 1) + 1;
    return next;
  }

  function flowControlsFromModel(model) {
    const controls = [];
    let lastActionId = null;
    (model?.nodes || []).forEach(node => {
      if (node.kind === "action") {
        lastActionId = node.id;
        return;
      }
      if (!lastActionId || node.phase !== "sequence") return;
      if (node.kind === "condition") {
        controls.push({
          id: node.id,
          type: "condition",
          afterActionId: lastActionId,
          source: clone(node.source),
          operator: node.operator || "equals",
          compareValue: node.compareValue || "",
          enabled: node.enabled !== false
        });
      }
      if (node.kind === "wait") {
        controls.push({
          id: node.id,
          type: "wait",
          afterActionId: lastActionId,
          duration: normalizeDuration(node.duration),
          enabled: node.enabled !== false
        });
      }
    });
    return controls;
  }

  function project(model, automation) {
    const verdict = validate(model);
    if (!verdict.ok) throw new Error(`Invalid v5 workflow model: ${verdict.errors.map(item => item.code).join(", ")}`);

    const trigger = model.nodes.find(node => node.kind === "trigger");
    const finish = [...model.nodes].reverse().find(node => node.kind === "finish");
    const preconditions = model.nodes.filter(node => node.kind === "condition" && node.phase === "pre");
    const actions = model.nodes.filter(node => node.kind === "action").map(node => ({ ...clone(node.action), id: node.id }));
    const controls = flowControlsFromModel(model);

    automation.trigger = trigger?.capabilityId || automation.trigger || null;
    automation.conditions = preconditions.map(node => ({ id: node.id, type: node.conditionType, enabled: node.enabled !== false }));
    automation.condition = automation.conditions[0]?.type || "none";
    automation.ruleMode = model.policies?.preconditionMode === "any" ? "any" : "all";
    automation.actions = actions;
    automation.flowControls = controls;
    automation.timing = clone(model.policies?.start || automation.timing || null);
    automation.repeatConfig = clone(model.policies?.recurrence || automation.repeatConfig || null);
    automation.outcome = finish?.outcome || automation.outcome || "end";

    model.projectionSignature = projectionSignature(automation);
    automation.workflowV5 = clone(model);
    return automation;
  }

  function mirrorControlStore(automationId, controls) {
    const store = readJson(CONTROLS_KEY, { version: 1, automations: {} });
    if (!store.automations) store.automations = {};
    store.automations[automationId] = controls;
    localStorage.setItem(CONTROLS_KEY, JSON.stringify(store));
  }

  function dispatchUpdate(automationId, reason) {
    const detail = { automationId, reason: reason || "workflow-v5" };
    document.dispatchEvent(new CustomEvent("cmx:lab-automations-updated", { detail }));
    window.dispatchEvent(new CustomEvent("cmx:lab-automations-updated", { detail }));
  }

  function commit(automationId, mutator, reason = "workflow-v5") {
    const store = readStore();
    const automation = store.automations.find(item => item.id === automationId);
    if (!automation) return null;

    const model = build(automation);
    const next = clone(model);
    mutator?.(next);
    next.version = VERSION;
    next.automationId = automationId;
    next.modelRevision = (Number(model.modelRevision) || 0) + 1;

    project(next, automation);
    automation.updatedAt = new Date().toISOString();
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    mirrorControlStore(automationId, automation.flowControls || []);
    dispatchUpdate(automationId, reason);
    return clone(automation.workflowV5);
  }

  function setFlowControls(automationId, controls) {
    const normalized = Array.isArray(controls) ? controls.filter(control => control?.id && ["condition", "wait"].includes(control.type)) : [];
    return commit(automationId, model => {
      model.nodes = model.nodes.filter(node => !(node.phase === "sequence" && ["condition", "wait"].includes(node.kind)));
      normalized.forEach(control => {
        const actionIndex = model.nodes.findIndex(node => node.kind === "action" && node.id === control.afterActionId);
        if (actionIndex < 0) return;
        const hasLaterAction = model.nodes.slice(actionIndex + 1).some(node => node.kind === "action");
        if (!hasLaterAction) return;

        let insertIndex = actionIndex + 1;
        while (insertIndex < model.nodes.length && model.nodes[insertIndex]?.phase === "sequence") insertIndex += 1;
        const node = control.type === "condition"
          ? {
              id: control.id,
              kind: "condition",
              phase: "sequence",
              source: clone(control.source),
              operator: control.operator || "equals",
              compareValue: control.compareValue || "",
              enabled: control.enabled !== false
            }
          : {
              id: control.id,
              kind: "wait",
              phase: "sequence",
              duration: normalizeDuration(control.duration),
              enabled: control.enabled !== false
            };
        model.nodes.splice(insertIndex, 0, node);
      });
    }, "workflow-v5-flow-controls");
  }

  function getFlowControls(automation) {
    return flowControlsFromModel(build(automation));
  }

  function summary(model) {
    const nodes = model?.nodes || [];
    return {
      trigger: nodes.filter(node => node.kind === "trigger").length,
      preconditions: nodes.filter(node => node.kind === "condition" && node.phase === "pre").length,
      actions: nodes.filter(node => node.kind === "action").length,
      sequenceConditions: nodes.filter(node => node.kind === "condition" && node.phase === "sequence").length,
      waits: nodes.filter(node => node.kind === "wait" && node.phase === "sequence").length,
      finish: nodes.filter(node => node.kind === "finish").length
    };
  }

  function syncStore() {
    syncTimer = null;
    const store = readStore();
    let changed = false;
    store.automations.forEach(automation => {
      const model = build(automation);
      if (JSON.stringify(automation.workflowV5 || null) !== JSON.stringify(model)) {
        automation.workflowV5 = model;
        changed = true;
      }
    });
    if (changed) localStorage.setItem(STORE_KEY, JSON.stringify(store));
    document.documentElement.dataset.labAutomationsModel = "v5";
  }

  function scheduleSync(delay = 900) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncStore, delay);
  }

  window.CMXAutomationModelV5 = Object.freeze({
    version: VERSION,
    build,
    validate,
    project,
    commit,
    getFlowControls,
    setFlowControls,
    flowControlsFromModel,
    summary,
    syncStore
  });

  document.addEventListener("cmx:lab-automations-updated", () => scheduleSync(60));
  window.addEventListener("cmx:lab-automations-updated", () => scheduleSync(60));
  document.addEventListener("input", () => scheduleSync(), true);
  document.addEventListener("change", () => scheduleSync(), true);
  document.addEventListener("click", () => scheduleSync(), true);
  window.addEventListener("storage", event => {
    if (event.key === STORE_KEY || event.key === CONTROLS_KEY) scheduleSync(60);
  });
  window.addEventListener("pageshow", () => scheduleSync(0));
  syncStore();
})();