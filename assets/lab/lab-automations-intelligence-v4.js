(() => {
  "use strict";

  const AUTOMATIONS_KEY = "cmx-lab-automations-v1";
  const DIRECTORY_KEY = "cmx-lab-crm-v1";
  const BINDINGS_KEY = "cmx-lab-automation-data-bindings-v1";
  let modal = null;
  let queued = false;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));
  const uniq = values => [...new Set((values || []).filter(Boolean))];

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function readAutomationStore() {
    const store = readJson(AUTOMATIONS_KEY, null);
    return store && Array.isArray(store.automations) ? store : { version: 1, automations: [] };
  }

  function readDirectory() {
    const store = readJson(DIRECTORY_KEY, null);
    return store && Array.isArray(store.people) && Array.isArray(store.organizations)
      ? { ...store, groups: Array.isArray(store.groups) ? store.groups : [] }
      : { people: [], organizations: [], groups: [] };
  }

  function readBindingStore() {
    const value = readJson(BINDINGS_KEY, null);
    return value && typeof value === "object" ? value : { version: 1, automations: {} };
  }

  function currentAutomationContext() {
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

  function actionLabel(action) {
    return ({ notify: "Notify", email: "Email", ai_task: "AI task", manual_review: "Manual review" }[action?.type] || "Action");
  }

  function triggerLabel(trigger) {
    return ({
      grace_start: "Grace begins",
      grace_expiry: "Grace expires",
      manual: "Manual start",
      calendar: "Calendar time"
    }[trigger] || "Trigger");
  }

  function activeMethods(person) {
    const methods = Array.isArray(person?.contactMethods)
      ? person.contactMethods.filter(item => item?.active !== false && item?.value)
      : [];
    if (!methods.length && person) {
      if (person.email) methods.push({ type: "email", value: person.email });
      if (person.phone) methods.push({ type: "phone", value: person.phone });
    }
    return methods;
  }

  function ready(person, type) {
    return activeMethods(person).some(item => item.type === type && item.value);
  }

  function peopleForOrganization(directory, orgId) {
    return directory.people.filter(person => (person.organizationIds || []).includes(orgId) || person.orgId === orgId);
  }

  function peopleForLabel(directory, label) {
    const key = String(label || "").toLowerCase();
    return directory.people.filter(person => [...(person.labels || []), ...(person.tags || [])]
      .map(value => String(value).toLowerCase()).includes(key));
  }

  function resolveGroup(directory, group) {
    const ids = new Set();
    (group?.selectors || []).forEach(selector => {
      if (selector.type === "person" && directory.people.some(person => person.id === selector.ref)) ids.add(selector.ref);
      if (selector.type === "organization") peopleForOrganization(directory, selector.ref).forEach(person => ids.add(person.id));
      if (selector.type === "label") peopleForLabel(directory, selector.ref).forEach(person => ids.add(person.id));
    });
    return [...ids].map(id => directory.people.find(person => person.id === id)).filter(Boolean);
  }

  function selectorsFor(action) {
    if (Array.isArray(action?.audienceSelectors) && action.audienceSelectors.length) return action.audienceSelectors;
    if (action?.targetRef?.kind && action?.targetRef?.id && ["person", "organization"].includes(action.targetRef.kind)) {
      return [{ type: action.targetRef.kind, ref: action.targetRef.id }];
    }
    return [];
  }

  function resolveAudience(directory, action) {
    const ids = new Set();
    selectorsFor(action).forEach(selector => {
      if (selector.type === "person" && directory.people.some(person => person.id === selector.ref)) ids.add(selector.ref);
      if (selector.type === "organization") peopleForOrganization(directory, selector.ref).forEach(person => ids.add(person.id));
      if (selector.type === "label") peopleForLabel(directory, selector.ref).forEach(person => ids.add(person.id));
      if (selector.type === "group") resolveGroup(directory, directory.groups.find(group => group.id === selector.ref)).forEach(person => ids.add(person.id));
    });
    return [...ids].map(id => directory.people.find(person => person.id === id)).filter(Boolean);
  }

  function audienceReadiness(directory, action) {
    const people = resolveAudience(directory, action);
    return {
      people,
      email: people.filter(person => ready(person, "email")).length,
      phone: people.filter(person => ready(person, "phone")).length
    };
  }

  function bindingKey(automationId, actionId) {
    return `${automationId}:${actionId}`;
  }

  function bindingsFor(automation, action) {
    if (Array.isArray(action?.dataBindings)) return action.dataBindings;
    const store = readBindingStore();
    return store.automations?.[bindingKey(automation.id, action.id)] || [];
  }

  function persistBindings(context, action, bindings) {
    const bindingStore = readBindingStore();
    if (!bindingStore.automations) bindingStore.automations = {};
    bindingStore.automations[bindingKey(context.automation.id, action.id)] = bindings;
    localStorage.setItem(BINDINGS_KEY, JSON.stringify(bindingStore));

    action.dataBindings = bindings;
    context.automation.updatedAt = new Date().toISOString();
    localStorage.setItem(AUTOMATIONS_KEY, JSON.stringify(context.store));
    document.dispatchEvent(new CustomEvent("cmx:lab-automations-updated", { detail: { automationId: context.automation.id, reason: "data-bindings" } }));
    window.dispatchEvent(new CustomEvent("cmx:lab-automations-updated", { detail: { automationId: context.automation.id, reason: "data-bindings" } }));
  }

  function recommendationIds(automation) {
    const ids = [];
    const trigger = automation?.trigger;
    if (trigger === "grace_start") ids.push("action.notify", "action.email", "action.manual_review", "action.ack");
    else if (trigger === "grace_expiry") ids.push("action.manual_review", "action.notify", "action.email", "action.ack");
    else if (trigger === "calendar") ids.push("action.ai_task", "action.manual_review", "action.notify", "action.library_document");
    else ids.push("action.manual_review", "action.ai_task", "action.notify", "action.email");

    if ((automation?.actions || []).some(action => action.type === "ai_task")) ids.unshift("action.manual_review", "action.email", "action.library_document");
    return uniq(ids).slice(0, 4);
  }

  function patchRecommendations(context) {
    const stage = document.querySelector(".v3-actions-stage");
    if (!stage) return;
    const catalog = Array.isArray(window.CMXAutomationCapabilityCatalog) ? window.CMXAutomationCapabilityCatalog : [];
    const items = recommendationIds(context.automation).map(id => catalog.find(item => item.id === id)).filter(Boolean);
    let panel = stage.querySelector(".v4-smart-recommendations");
    if (!panel) {
      panel = document.createElement("section");
      panel.className = "v4-smart-recommendations";
      const anchor = stage.querySelector(".v4-directory-strip") || stage.querySelector(".v3-action-stack") || stage.firstElementChild;
      if (anchor?.classList.contains("v3-action-stack")) anchor.before(panel); else anchor?.after(panel);
    }
    panel.innerHTML = `
      <header><div><span>RECOMMENDED NEXT</span><strong>Useful for ${esc(triggerLabel(context.automation.trigger))}</strong></div><button type="button" data-v4-open-catalog="action">All actions</button></header>
      <div>${items.map(item => {
        const usable = item.state === "lab" && item.proxy;
        const attr = usable ? `data-v4-use-capability="${esc(item.id)}"` : `data-v4-capability-info="${esc(item.id)}"`;
        return `<button type="button" ${attr}><b>${usable ? "LAB NOW" : "LATER"}</b><strong>${esc(item.label)}</strong><small>${esc(item.description)}</small><i>→</i></button>`;
      }).join("")}</div>`;
  }

  function patchActionBindings(context) {
    const actions = context.automation.actions || [];
    document.querySelectorAll("[data-action-card]").forEach(card => {
      const action = actions.find(item => item.id === card.dataset.actionCard);
      if (!action) return;
      let block = card.querySelector(".v4-data-map");
      if (!block) {
        block = document.createElement("section");
        block.className = "v4-data-map";
        card.append(block);
      }
      const bindings = bindingsFor(context.automation, action);
      block.innerHTML = `
        <div><span>USE DATA</span><small>Trigger, Directory and earlier-step outputs</small></div>
        <div class="v4-data-chips">${bindings.length ? bindings.map(binding => `<span>${esc(binding.label)}</span>`).join("") : `<em>No mapped data yet</em>`}</div>
        <button type="button" data-v4-map-action="${esc(action.id)}">${bindings.length ? "Manage data" : "＋ Use data"}</button>`;
    });
  }

  function sourceDefinitions(automation, action) {
    const currentIndex = (automation.actions || []).findIndex(item => item.id === action.id);
    const trigger = [
      { sourceType: "trigger", sourceId: automation.trigger || "trigger", path: "event_type", label: "Trigger type", detail: triggerLabel(automation.trigger) },
      { sourceType: "trigger", sourceId: automation.trigger || "trigger", path: "occurred_at", label: "Trigger time", detail: "Sample normalized event time" },
      { sourceType: "trigger", sourceId: automation.trigger || "trigger", path: "source", label: "Trigger source", detail: "Typed event source" }
    ];
    if (automation.trigger === "calendar") {
      trigger.push({ sourceType: "trigger", sourceId: automation.trigger, path: "scheduled_for", label: "Scheduled time", detail: "Calendar occurrence" });
      trigger.push({ sourceType: "trigger", sourceId: automation.trigger, path: "timezone", label: "Time zone", detail: "IANA time zone" });
    }
    if (["grace_start", "grace_expiry"].includes(automation.trigger)) {
      trigger.push({ sourceType: "trigger", sourceId: automation.trigger, path: "incident_state", label: "Check In state", detail: "Authoritative state sample" });
    }

    const earlier = (automation.actions || []).slice(0, Math.max(0, currentIndex)).flatMap((step, index) => {
      const base = { sourceType: "step", sourceId: step.id, stepIndex: index + 1 };
      if (step.type === "ai_task") return [
        { ...base, path: "output.summary", label: `Step ${index + 1} · AI summary`, detail: "Structured summary output" },
        { ...base, path: "output.priority", label: `Step ${index + 1} · AI priority`, detail: "Structured priority output" },
        { ...base, path: "output.status", label: `Step ${index + 1} · AI status`, detail: "Simulated task status" }
      ];
      if (step.type === "manual_review") return [
        { ...base, path: "output.decision", label: `Step ${index + 1} · Review decision`, detail: "Future human decision" },
        { ...base, path: "output.note", label: `Step ${index + 1} · Review note`, detail: "Future review note" }
      ];
      return [
        { ...base, path: "output.status", label: `Step ${index + 1} · ${actionLabel(step)} status`, detail: "Simulated step outcome" },
        { ...base, path: "output.resolved_people", label: `Step ${index + 1} · Resolved people`, detail: "Audience count from that step" }
      ];
    });

    const directory = [
      { sourceType: "directory", sourceId: action.id, path: "audience.resolved_people_count", label: "Audience · resolved people", detail: "Current unique People" },
      { sourceType: "directory", sourceId: action.id, path: "audience.email_ready_count", label: "Audience · email ready", detail: "Current email-ready People" },
      { sourceType: "directory", sourceId: action.id, path: "audience.phone_ready_count", label: "Audience · phone ready", detail: "Current phone-ready People" }
    ];

    return { trigger, earlier, directory };
  }

  function bindingId(source) {
    return `${source.sourceType}:${source.sourceId}:${source.path}`;
  }

  function openMapping(actionId) {
    closeModal();
    const context = currentAutomationContext();
    if (!context) return;
    const action = (context.automation.actions || []).find(item => item.id === actionId);
    if (!action) return;
    const selected = new Set(bindingsFor(context.automation, action).map(bindingId));
    const sources = sourceDefinitions(context.automation, action);

    modal = document.createElement("div");
    modal.className = "v4-data-modal-backdrop";
    modal.innerHTML = `
      <section class="v4-data-modal" role="dialog" aria-modal="true" aria-labelledby="v4DataTitle">
        <header><div><span>USE DATA</span><h2 id="v4DataTitle">Insert values from the flow</h2><p>Choose typed values from the Trigger, Directory or steps that happen earlier. Lab stores references and uses sample values only.</p></div><button type="button" data-v4-data-close aria-label="Close">×</button></header>
        <div class="v4-data-modal-body">
          ${sourceSection("Trigger", sources.trigger, selected)}
          ${sourceSection("Previous steps", sources.earlier, selected)}
          ${sourceSection("Directory & audience", sources.directory, selected)}
        </div>
        <footer><span>References only · no expression code · no provider call</span><div><button type="button" data-v4-data-close>Cancel</button><button type="button" class="primary" data-v4-data-save="${esc(actionId)}">Use selected data</button></div></footer>
      </section>`;
    document.body.append(modal);
    document.body.classList.add("v4-data-open");
  }

  function sourceSection(title, sources, selected) {
    return `<section><header><strong>${esc(title)}</strong><span>${sources.length}</span></header><div>${sources.length ? sources.map(source => {
      const id = bindingId(source);
      return `<label><input type="checkbox" data-v4-data-source data-source-type="${esc(source.sourceType)}" data-source-id="${esc(source.sourceId)}" data-source-path="${esc(source.path)}" data-source-label="${esc(source.label)}" ${selected.has(id) ? "checked" : ""}><span><strong>${esc(source.label)}</strong><small>${esc(source.detail)}</small></span><i>✓</i></label>`;
    }).join("") : `<p>No earlier-step outputs exist yet.</p>`}</div></section>`;
  }

  function selectedBindings() {
    if (!modal) return [];
    return [...modal.querySelectorAll("[data-v4-data-source]:checked")].map(input => ({
      sourceType: input.dataset.sourceType,
      sourceId: input.dataset.sourceId,
      path: input.dataset.sourcePath,
      label: input.dataset.sourceLabel
    }));
  }

  function saveMapping(actionId) {
    const context = currentAutomationContext();
    if (!context) return closeModal();
    const action = (context.automation.actions || []).find(item => item.id === actionId);
    if (!action) return closeModal();
    persistBindings(context, action, selectedBindings());
    closeModal();
    schedule();
  }

  function closeModal() {
    modal?.remove();
    modal = null;
    document.body.classList.remove("v4-data-open");
  }

  function sampleBindingValue(binding, context, action, directory) {
    if (binding.sourceType === "trigger") {
      if (binding.path === "event_type") return triggerLabel(context.automation.trigger);
      if (binding.path === "occurred_at") return new Date().toLocaleString();
      if (binding.path === "source") return "Normalized Lab event";
      if (binding.path === "scheduled_for") return new Date(Date.now() + 3600000).toLocaleString();
      if (binding.path === "timezone") return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      if (binding.path === "incident_state") return context.automation.trigger === "grace_expiry" ? "Triggered" : "In grace";
    }
    if (binding.sourceType === "directory") {
      const state = audienceReadiness(directory, action);
      if (binding.path.endsWith("resolved_people_count")) return String(state.people.length);
      if (binding.path.endsWith("email_ready_count")) return String(state.email);
      if (binding.path.endsWith("phone_ready_count")) return String(state.phone);
    }
    if (binding.sourceType === "step") {
      const step = (context.automation.actions || []).find(item => item.id === binding.sourceId);
      if (binding.path === "output.summary") return "Sample structured summary from the earlier AI step";
      if (binding.path === "output.priority") return "Needs review";
      if (binding.path === "output.decision") return "No decision in Lab sample";
      if (binding.path === "output.note") return "Sample review note";
      if (binding.path === "output.resolved_people") return String(audienceReadiness(directory, step || {}).people.length);
      if (binding.path === "output.status") return "simulated";
    }
    return "sample value";
  }

  function actionSimulation(context, action, index, directory) {
    const audience = audienceReadiness(directory, action);
    const bindings = bindingsFor(context.automation, action);
    const mapped = bindings.map(binding => ({ label: binding.label, value: sampleBindingValue(binding, context, action, directory) }));
    let outcome = "Definition is valid for local inspection.";
    if (action.type === "email") outcome = `Would prepare ${audience.email} email recipient${audience.email === 1 ? "" : "s"}. No email sent.`;
    if (action.type === "notify") outcome = `Would resolve ${audience.people.length} protected Person${audience.people.length === 1 ? "" : "s"}. No notification sent.`;
    if (action.type === "ai_task") outcome = "Would return a structured sample summary. No AI model called.";
    if (action.type === "manual_review") outcome = "Would wait for a human review decision. No Runtime state created.";
    return { index, label: actionLabel(action), audience, mapped, outcome };
  }

  function stageIndex() {
    const current = document.querySelector(".v3-stage-rail [data-stage].is-current");
    return Number(current?.dataset.stage || 0);
  }

  function resultNode() {
    const page = document.querySelector(".v3-editor-page");
    if (!page) return null;
    let result = page.querySelector(".v4-step-test-result");
    if (!result) {
      result = document.createElement("div");
      result.className = "v4-step-test-result";
      const tools = page.querySelector(".v4-stage-tools");
      tools?.insertAdjacentElement("afterend", result);
    }
    return result;
  }

  function runRichStageTest() {
    const context = currentAutomationContext();
    const result = resultNode();
    if (!context || !result) return;
    const directory = readDirectory();
    const index = stageIndex();
    result.hidden = false;
    result.classList.add("v4-rich-test-result");

    if (index === 0) {
      result.innerHTML = `<span>LOCAL SAMPLE · NO EVENT SOURCE</span><strong>Trigger normalized</strong><div class="v4-test-trace"><div><b>INPUT</b><span>${esc(triggerLabel(context.automation.trigger))}</span></div><div><b>NORMALIZE</b><span>Typed trigger payload prepared</span></div><div><b>OUTPUT</b><span>event_type · occurred_at · source</span></div></div><small>No production Check In event, schedule or Connection was read.</small>`;
      return;
    }

    if (index === 1) {
      const rules = Array.isArray(context.automation.conditions) ? context.automation.conditions : [];
      result.innerHTML = `<span>LOCAL SAMPLE · NO SERVER EVALUATION</span><strong>${rules.length ? `${rules.length} rule${rules.length === 1 ? "" : "s"} would be evaluated` : "No additional rules"}</strong><div class="v4-test-trace"><div><b>INPUT</b><span>Sample Trigger payload</span></div><div><b>RULES</b><span>${rules.length ? esc(rules.map(rule => rule.type).join(" · ")) : "Always continue after confirmation"}</span></div><div><b>OUTPUT</b><span>continue = sample only</span></div></div><small>No authoritative Condition service or Runtime evaluated this.</small>`;
      return;
    }

    if (index === 2) {
      const simulations = (context.automation.actions || []).map((action, actionIndex) => actionSimulation(context, action, actionIndex + 1, directory));
      result.innerHTML = `<span>LOCAL ACTION TRACE · NO SIDE EFFECTS</span><strong>${simulations.length} Action${simulations.length === 1 ? "" : "s"} inspected</strong><div class="v4-action-test-list">${simulations.map(item => `<article><header><b>STEP ${item.index}</b><strong>${esc(item.label)}</strong></header><div><span>Audience</span><em>${item.audience.people.length} people · ${item.audience.email} email · ${item.audience.phone} phone</em></div><div><span>Mapped data</span><em>${item.mapped.length ? esc(item.mapped.map(value => `${value.label} = ${value.value}`).join(" · ")) : "None"}</em></div><p>${esc(item.outcome)}</p></article>`).join("") || `<p>No Actions have been configured yet.</p>`}</div><small>No provider, AI model, server Runtime or connected account was touched.</small>`;
      return;
    }

    if (index === 3) {
      const timing = context.automation.timing || { mode: "none" };
      const repeat = context.automation.repeatConfig || { mode: "none" };
      result.innerHTML = `<span>LOCAL TIMING INTERPRETATION</span><strong>Timing configuration inspected</strong><div class="v4-test-trace"><div><b>START</b><span>${esc(timing.mode || "none")}</span></div><div><b>REPEAT</b><span>${esc(repeat.mode || "none")}</span></div><div><b>AUTHORITY</b><span>Browser does not schedule work</span></div></div><small>Future server time, timezone and recurrence validation remain authoritative.</small>`;
      return;
    }

    const communication = (context.automation.actions || []).filter(action => ["notify", "email"].includes(action.type));
    const blockers = [];
    communication.forEach(action => {
      const state = audienceReadiness(directory, action);
      if (!state.people.length) blockers.push(`${actionLabel(action)} needs an audience`);
      if (action.type === "email" && !state.email) blockers.push("Email needs at least one email-ready Person");
    });
    result.innerHTML = `<span>CONTINUUM PREFLIGHT · LAB</span><strong>${blockers.length ? `${blockers.length} issue${blockers.length === 1 ? "" : "s"} found` : "No local structural blockers found"}</strong><div class="v4-test-trace"><div><b>DRAFT</b><span>${esc(context.automation.name || "Untitled Automation")}</span></div><div><b>ACTIONS</b><span>${(context.automation.actions || []).length}</span></div><div><b>RUNTIME</b><span>OFF</span></div></div>${blockers.length ? `<ul>${blockers.map(item => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}<small>This is local prototype preflight only. Publish and Runtime remain unavailable.</small>`;
  }

  function patch() {
    queued = false;
    const context = currentAutomationContext();
    if (!context || !document.querySelector(".v3-editor-page")) return;
    patchRecommendations(context);
    patchActionBindings(context);
    document.documentElement.dataset.labAutomationsIntelligence = "v4-2";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", event => {
    const test = event.target.closest?.("[data-v4-test-step]");
    if (test) {
      event.preventDefault();
      event.stopImmediatePropagation();
      runRichStageTest();
      return;
    }
    const map = event.target.closest?.("[data-v4-map-action]");
    if (map) {
      event.preventDefault();
      openMapping(map.dataset.v4MapAction);
      return;
    }
    const close = event.target.closest?.("[data-v4-data-close]");
    if (close) {
      event.preventDefault();
      closeModal();
      return;
    }
    const save = event.target.closest?.("[data-v4-data-save]");
    if (save) {
      event.preventDefault();
      saveMapping(save.dataset.v4DataSave);
      return;
    }
    if (event.target === modal) {
      closeModal();
      return;
    }
    schedule();
  }, true);

  document.addEventListener("input", schedule, false);
  document.addEventListener("change", schedule, false);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("storage", event => {
    if ([AUTOMATIONS_KEY, DIRECTORY_KEY, BINDINGS_KEY].includes(event.key)) schedule();
  });
  window.addEventListener("cmx:lab-directory-updated", schedule);
  document.addEventListener("cmx:lab-automations-updated", schedule);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule, { once: true });
  else schedule();
})();