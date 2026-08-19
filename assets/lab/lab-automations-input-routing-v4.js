(() => {
  "use strict";

  const AUTOMATIONS_KEY = "cmx-lab-automations-v1";
  const DIRECTORY_KEY = "cmx-lab-crm-v1";
  const DATA_BINDINGS_KEY = "cmx-lab-automation-data-bindings-v1";
  const INPUT_BINDINGS_KEY = "cmx-lab-automation-input-bindings-v1";
  let modal = null;
  let queued = false;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));

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

  function readDirectory() {
    const value = readJson(DIRECTORY_KEY, null);
    return value && Array.isArray(value.people) && Array.isArray(value.organizations)
      ? { ...value, groups: Array.isArray(value.groups) ? value.groups : [] }
      : { people: [], organizations: [], groups: [] };
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

  function fieldDefinitions(action) {
    if (!action || action.type === "action_ref") return [];
    if (action.type === "email") return [
      { id: "subject", label: "Subject", note: "Optional dynamic subject input" },
      { id: "body", label: "Body data", note: "Dynamic data available to the email body/instruction" }
    ];
    if (action.type === "ai_task") return [
      { id: "context", label: "Task context", note: "Typed context passed into the bounded AI task" },
      { id: "focus", label: "Focus value", note: "Optional value the task should focus on" }
    ];
    if (action.type === "manual_review") return [
      { id: "review_context", label: "Review context", note: "Value shown to the future human review step" }
    ];
    return [
      { id: "message", label: "Message data", note: "Dynamic data available to this notification step" }
    ];
  }

  function fieldLabel(action, fieldId) {
    return fieldDefinitions(action).find(field => field.id === fieldId)?.label || fieldId;
  }

  function activeMethods(person) {
    const values = Array.isArray(person?.contactMethods)
      ? person.contactMethods.filter(item => item?.active !== false && item?.value)
      : [];
    if (!values.length && person) {
      if (person.email) values.push({ type: "email", value: person.email });
      if (person.phone) values.push({ type: "phone", value: person.phone });
    }
    return values;
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

  function actionLabel(action) {
    return ({ notify: "Notify", email: "Email", ai_task: "AI task", manual_review: "Manual review" }[action?.type] || "Action");
  }

  function triggerLabel(trigger) {
    return ({ grace_start: "Grace begins", grace_expiry: "Grace expires", manual: "Manual start", calendar: "Calendar time" }[trigger] || "Trigger");
  }

  function sourceDefinitions(automation, action) {
    const directory = readDirectory();
    const currentIndex = (automation.actions || []).findIndex(item => item.id === action.id);
    const sources = [
      { sourceType: "trigger", sourceId: automation.trigger || "trigger", path: "event_type", label: "Trigger type", detail: triggerLabel(automation.trigger) },
      { sourceType: "trigger", sourceId: automation.trigger || "trigger", path: "occurred_at", label: "Trigger time", detail: "Normalized event time" }
    ];

    if (automation.trigger === "calendar") {
      sources.push({ sourceType: "trigger", sourceId: automation.trigger, path: "scheduled_for", label: "Scheduled time", detail: "Calendar occurrence" });
      sources.push({ sourceType: "trigger", sourceId: automation.trigger, path: "timezone", label: "Time zone", detail: "IANA time zone" });
    }
    if (["grace_start", "grace_expiry"].includes(automation.trigger)) {
      sources.push({ sourceType: "trigger", sourceId: automation.trigger, path: "incident_state", label: "Check In state", detail: "Protected state sample" });
    }

    (automation.actions || []).slice(0, Math.max(0, currentIndex)).forEach((step, index) => {
      const base = { sourceType: "step", sourceId: step.id };
      if (step.type === "ai_task") {
        sources.push({ ...base, path: "output.summary", label: `Step ${index + 1} · AI summary`, detail: "Structured summary output" });
        sources.push({ ...base, path: "output.priority", label: `Step ${index + 1} · AI priority`, detail: "Structured priority output" });
      } else if (step.type === "manual_review") {
        sources.push({ ...base, path: "output.decision", label: `Step ${index + 1} · Review decision`, detail: "Future human decision" });
        sources.push({ ...base, path: "output.note", label: `Step ${index + 1} · Review note`, detail: "Future review note" });
      } else {
        sources.push({ ...base, path: "output.status", label: `Step ${index + 1} · ${actionLabel(step)} status`, detail: "Simulated step outcome" });
        sources.push({ ...base, path: "output.resolved_people", label: `Step ${index + 1} · Resolved people`, detail: "Audience count from that step" });
      }
    });

    const people = resolveAudience(directory, action);
    sources.push({ sourceType: "directory", sourceId: action.id, path: "audience.resolved_people_count", label: "Audience · resolved people", detail: `${people.length} current unique People` });
    sources.push({ sourceType: "directory", sourceId: action.id, path: "audience.email_ready_count", label: "Audience · email ready", detail: `${people.filter(person => activeMethods(person).some(method => method.type === "email")).length} current email-ready People` });
    sources.push({ sourceType: "directory", sourceId: action.id, path: "audience.phone_ready_count", label: "Audience · phone ready", detail: `${people.filter(person => activeMethods(person).some(method => method.type === "phone")).length} current phone-ready People` });
    return sources;
  }

  function inputKey(automationId, actionId) {
    return `${automationId}:${actionId}`;
  }

  function inputBindingsFor(automation, action) {
    const store = readJson(INPUT_BINDINGS_KEY, { version: 1, automations: {} });
    const saved = store?.automations?.[inputKey(automation.id, action.id)] || [];
    if (Array.isArray(action?.inputBindings) && action.inputBindings.length) return action.inputBindings;
    if (saved.length) return saved;
    return Array.isArray(action?.inputBindings) ? action.inputBindings : [];
  }

  function bindingForField(automation, action, fieldId) {
    return inputBindingsFor(automation, action).find(binding => binding.targetField === fieldId) || null;
  }

  function sameSource(a, b) {
    return a?.sourceType === b?.sourceType && a?.sourceId === b?.sourceId && a?.path === b?.path;
  }

  function persistFieldBinding(context, action, fieldId, source) {
    const inputs = inputBindingsFor(context.automation, action).filter(binding => binding.targetField !== fieldId);
    if (source) inputs.push({ targetField: fieldId, ...source });

    const inputStore = readJson(INPUT_BINDINGS_KEY, { version: 1, automations: {} });
    if (!inputStore.automations) inputStore.automations = {};
    inputStore.automations[inputKey(context.automation.id, action.id)] = inputs;
    localStorage.setItem(INPUT_BINDINGS_KEY, JSON.stringify(inputStore));

    action.inputBindings = inputs;

    if (source) {
      const generic = Array.isArray(action.dataBindings) ? [...action.dataBindings] : [];
      if (!generic.some(binding => sameSource(binding, source))) generic.push(source);
      action.dataBindings = generic;

      const genericStore = readJson(DATA_BINDINGS_KEY, { version: 1, automations: {} });
      if (!genericStore.automations) genericStore.automations = {};
      genericStore.automations[inputKey(context.automation.id, action.id)] = generic;
      localStorage.setItem(DATA_BINDINGS_KEY, JSON.stringify(genericStore));
    }

    context.automation.updatedAt = new Date().toISOString();
    localStorage.setItem(AUTOMATIONS_KEY, JSON.stringify(context.store));
    document.dispatchEvent(new CustomEvent("cmx:lab-automations-updated", { detail: { automationId: context.automation.id, reason: "input-binding" } }));
    window.dispatchEvent(new CustomEvent("cmx:lab-automations-updated", { detail: { automationId: context.automation.id, reason: "input-binding" } }));
  }

  function patchCards(context) {
    const actions = context.automation.actions || [];
    document.querySelectorAll("[data-action-card]").forEach(card => {
      const action = actions.find(item => item.id === card.dataset.actionCard);
      const fields = fieldDefinitions(action);
      if (!action || !fields.length) return;

      let block = card.querySelector(".v43-input-routing");
      if (!block) {
        block = document.createElement("section");
        block.className = "v43-input-routing";
        const dataMap = card.querySelector(".v4-data-map");
        if (dataMap) dataMap.before(block); else card.append(block);
      }

      const rows = fields.map(field => {
        const binding = bindingForField(context.automation, action, field.id);
        return `<div class="v43-input-row ${binding ? "is-mapped" : ""}">
          <span><b>${esc(field.label)}</b><small>${esc(field.note)}</small></span>
          <strong>${binding ? esc(binding.label) : "Static / not mapped"}</strong>
          <button type="button" data-v43-route-input="${esc(action.id)}" data-v43-field="${esc(field.id)}">${binding ? "Change" : "Map"}</button>
        </div>`;
      }).join("");

      block.innerHTML = `<header><div><span>INPUT ROUTING</span><strong>Put flow data into specific fields.</strong></div><small>${fields.filter(field => bindingForField(context.automation, action, field.id)).length}/${fields.length} mapped</small></header><div>${rows}</div>`;
    });
  }

  function patchReview(context) {
    const review = document.querySelector(".v3-review-side");
    if (!review) return;
    const mapped = (context.automation.actions || []).flatMap(action => inputBindingsFor(context.automation, action));
    let block = review.querySelector(".v43-input-preflight");
    if (!block) {
      block = document.createElement("section");
      block.className = "v43-input-preflight";
      review.append(block);
    }
    block.innerHTML = `<span>INPUT ROUTING</span><div><strong>${mapped.length} mapped field${mapped.length === 1 ? "" : "s"}</strong><small>${mapped.length ? "Typed references point to specific receiving fields." : "Static instructions only. No dynamic field routing is configured."}</small></div><b>${mapped.length ? "LAB READY" : "OPTIONAL"}</b>`;
  }

  function augmentActionTest() {
    const context = currentContext();
    if (!context) return;
    const result = document.querySelector(".v4-step-test-result:not([hidden])");
    const list = result?.querySelector(".v4-action-test-list");
    if (!list) return;
    const articles = [...list.querySelectorAll("article")];
    (context.automation.actions || []).forEach((action, index) => {
      const article = articles[index];
      if (!article) return;
      const bindings = inputBindingsFor(context.automation, action);
      let row = article.querySelector(".v43-test-routing");
      if (!bindings.length) {
        row?.remove();
        return;
      }
      if (!row) {
        row = document.createElement("div");
        row.className = "v43-test-routing";
        const paragraph = article.querySelector("p");
        if (paragraph) paragraph.before(row); else article.append(row);
      }
      row.innerHTML = `<span>Input routing</span><em>${bindings.map(binding => `${esc(fieldLabel(action, binding.targetField))} ← ${esc(binding.label)}`).join(" · ")}</em>`;
    });
  }

  function openRouter(actionId, fieldId) {
    closeModal();
    const context = currentContext();
    if (!context) return;
    const action = (context.automation.actions || []).find(item => item.id === actionId);
    const field = fieldDefinitions(action).find(item => item.id === fieldId);
    if (!action || !field) return;
    const current = bindingForField(context.automation, action, fieldId);
    const sources = sourceDefinitions(context.automation, action);

    modal = document.createElement("div");
    modal.className = "v43-route-backdrop";
    modal.innerHTML = `<section class="v43-route-modal" role="dialog" aria-modal="true" aria-labelledby="v43RouteTitle">
      <header><div><span>MAP INPUT</span><h2 id="v43RouteTitle">${esc(field.label)}</h2><p>Choose one typed source for this field. The Lab stores a reference, not copied execution data or expression code.</p></div><button type="button" data-v43-route-close aria-label="Close">×</button></header>
      <div class="v43-route-body">
        <label class="v43-source-option is-static"><input type="radio" name="v43-source" value="" ${current ? "" : "checked"}><span><strong>Static / no mapped source</strong><small>Use the Action's normal instruction/configuration only.</small></span><i>✓</i></label>
        ${sources.map(source => {
          const key = `${source.sourceType}|${source.sourceId}|${source.path}`;
          const checked = current && sameSource(current, source);
          return `<label class="v43-source-option"><input type="radio" name="v43-source" value="${esc(key)}" data-source-type="${esc(source.sourceType)}" data-source-id="${esc(source.sourceId)}" data-source-path="${esc(source.path)}" data-source-label="${esc(source.label)}" ${checked ? "checked" : ""}><span><strong>${esc(source.label)}</strong><small>${esc(source.detail)}</small></span><i>✓</i></label>`;
        }).join("")}
      </div>
      <footer><span>Typed reference only · server validation later</span><div><button type="button" data-v43-route-close>Cancel</button><button type="button" class="primary" data-v43-route-save="${esc(actionId)}" data-v43-field="${esc(fieldId)}">Use input</button></div></footer>
    </section>`;
    document.body.append(modal);
    document.body.classList.add("v43-route-open");
  }

  function saveRouter(actionId, fieldId) {
    if (!modal) return;
    const context = currentContext();
    if (!context) return closeModal();
    const action = (context.automation.actions || []).find(item => item.id === actionId);
    if (!action) return closeModal();
    const input = modal.querySelector('input[name="v43-source"]:checked');
    const source = input?.dataset.sourceType ? {
      sourceType: input.dataset.sourceType,
      sourceId: input.dataset.sourceId,
      path: input.dataset.sourcePath,
      label: input.dataset.sourceLabel
    } : null;
    persistFieldBinding(context, action, fieldId, source);
    closeModal();
    schedule();
  }

  function closeModal() {
    modal?.remove();
    modal = null;
    document.body.classList.remove("v43-route-open");
  }

  function patch() {
    queued = false;
    const context = currentContext();
    if (!context || !document.querySelector(".v3-editor-page")) return;
    patchCards(context);
    patchReview(context);
    document.documentElement.dataset.labAutomationsInputs = "v4-3";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", event => {
    const route = event.target.closest?.("[data-v43-route-input]");
    if (route) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openRouter(route.dataset.v43RouteInput, route.dataset.v43Field);
      return;
    }
    const close = event.target.closest?.("[data-v43-route-close]");
    if (close || event.target === modal) {
      event.preventDefault();
      closeModal();
      return;
    }
    const save = event.target.closest?.("[data-v43-route-save]");
    if (save) {
      event.preventDefault();
      saveRouter(save.dataset.v43RouteSave, save.dataset.v43Field);
      return;
    }
    schedule();
  }, true);

  document.addEventListener("pointerup", event => {
    if (!event.target.closest?.("[data-v4-test-step]")) return;
    requestAnimationFrame(() => requestAnimationFrame(augmentActionTest));
  }, true);

  document.addEventListener("input", schedule, true);
  document.addEventListener("change", schedule, true);
  document.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("storage", event => {
    if ([AUTOMATIONS_KEY, DIRECTORY_KEY, DATA_BINDINGS_KEY, INPUT_BINDINGS_KEY].includes(event.key)) schedule();
  });
  window.addEventListener("pageshow", schedule);
  schedule();
})();