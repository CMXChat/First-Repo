(() => {
  "use strict";

  const API = window.CMXAutomationsLabApi;
  const app = document.getElementById("automationApp");
  if (!API || !app) return;

  const SECTIONS = ["overview", "definition", "runs", "permissions", "related", "history", "settings"];
  const STAGES = [
    { key: "trigger", short: "WHEN", label: "Trigger" },
    { key: "conditions", short: "IF", label: "Rules" },
    { key: "actions", short: "DO", label: "Actions" },
    { key: "start", short: "WAIT", label: "Timing" },
    { key: "review", short: "TEST", label: "Review" },
  ];
  const TRIGGERS = [
    { type: "manual", label: "Manual start", mark: "MAN", note: "An owner starts the published Automation explicitly." },
    { type: "checkin_grace_start", label: "Grace begins", mark: "GRACE", note: "Definition support exists; unattended Runtime is not enabled by this Lab." },
    { type: "checkin_grace_expiry", label: "Grace expires", mark: "FINAL", note: "Definition support exists; unattended Runtime is not enabled by this Lab." },
  ];

  const state = {
    automations: [],
    listStatus: "loading",
    listError: null,
    current: null,
    view: "definition",
    stage: 0,
    saveStatus: "saved",
    saveMessage: "",
    pendingDefinition: null,
    resources: {
      people: [],
      contacts: new Map(),
      connections: [],
      senders: new Map(),
      content: [],
    },
    resourceError: null,
    resourceLoading: false,
    preflight: null,
    runs: [],
    selectedRun: null,
    runtimeStatus: "idle",
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => String(value ?? "").replace(/[&<>'\"]/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '\"': "&quot;"
  }[ch]));
  const clone = (value) => JSON.parse(JSON.stringify(value ?? null));
  const relative = (iso) => {
    const stamp = Date.parse(iso || "");
    if (!Number.isFinite(stamp)) return "—";
    const age = Math.max(0, Date.now() - stamp);
    if (age < 60000) return "just now";
    if (age < 3600000) return `${Math.floor(age / 60000)}m ago`;
    if (age < 86400000) return `${Math.floor(age / 3600000)}h ago`;
    return `${Math.floor(age / 86400000)}d ago`;
  };
  const uuid = () => crypto.randomUUID();

  function errorText(error) {
    if (error?.status === 401) return "Private operator access is required. Unlock Check In, then reload Automations.";
    if (error?.status === 403) return error.message || "Protected Automation access was rejected.";
    if (error?.status === 404) return "The protected Automation API is not available in this environment yet.";
    return error?.message || "Protected Automation request failed.";
  }

  function saveStateLabel(long = false) {
    if (state.saveStatus === "conflict") return "Draft changed elsewhere";
    if (state.saveStatus === "saving") return long ? "Saving…" : "Saving";
    if (state.saveStatus === "error") return "Save failed";
    return long ? "Server saved" : "Saved";
  }

  function shell(content) {
    return `<header class="v3-topbar"><a class="brand v3-brand" href="/lab/#lab=view%3Aactions" aria-label="Back to Check In Lab Actions"><span class="brand-mark"></span><span class="brand-copy"><strong>CHECK IN</strong><small>LAB · AUTOMATIONS</small></span></a><div class="v3-top-actions"><span class="v3-lab-pill server-contract-pill"><i></i> LAB · REAL CONTRACT</span><button class="v3-theme" type="button" data-server-theme><span>${document.documentElement.dataset.theme === "dark" ? "Light" : "Dark"}</span></button></div></header>${content}`;
  }

  async function refreshList() {
    state.listStatus = "loading";
    state.listError = null;
    renderServerDashboardSection();
    try {
      state.automations = await API.listAutomations();
      state.listStatus = "ready";
    } catch (error) {
      state.automations = [];
      state.listStatus = "error";
      state.listError = error;
    }
    renderServerDashboardSection();
  }

  function serverCard(item) {
    return `<button class="v3-automation-card server-automation-card" type="button" data-server-automation="${esc(item.id)}"><span class="v3-card-head"><span><small>SERVER · ${esc(String(item.lifecycle || "draft").toUpperCase())}</small><strong>${esc(item.name)}</strong></span><em>UUID</em></span><p>${esc(item.description || "Protected backend Automation with a durable Draft identity.")}</p><span class="v3-mini-flow"><span><i>ID</i><b>${esc(item.id.slice(0, 8))}…</b></span><u></u><span><i>DRAFT</i><b>Server truth</b></span><u></u><span><i>RUN</i><b>${item.current_published_version_id ? "Published version exists" : "Publish first"}</b></span></span><span class="v3-card-foot"><b>${esc(item.lifecycle || "draft")}</b><small>Updated ${esc(relative(item.updated_at))}</small></span></button>`;
  }

  function serverSectionMarkup() {
    if (state.listStatus === "loading") {
      return `<section class="server-automations-section" data-server-automations-section><div class="v3-section-title"><div><span>SERVER-BACKED</span><h2>Real Automations</h2></div><small>Reading protected backend…</small></div><div class="v3-empty"><strong>Loading protected Automations</strong><span>No browser-local Automation is being substituted for server truth.</span></div></section>`;
    }
    if (state.listStatus === "error") {
      return `<section class="server-automations-section" data-server-automations-section><div class="v3-section-title"><div><span>SERVER-BACKED</span><h2>Real Automations</h2></div><button class="server-small-button" type="button" data-server-refresh>Retry</button></div><div class="v3-empty server-error"><strong>Protected Automations unavailable</strong><span>${esc(errorText(state.listError))}</span><small>Local Lab Automations below remain separate prototypes. They are not a persistence fallback.</small></div></section>`;
    }
    return `<section class="server-automations-section" data-server-automations-section><div class="v3-section-title"><div><span>SERVER-BACKED · ${state.automations.length}</span><h2>Real Automations</h2></div><div class="server-section-actions"><button class="server-small-button" type="button" data-server-refresh>Refresh</button><button class="v3-primary server-new-button" type="button" data-server-new>＋ New real Automation</button></div></div><p class="server-section-copy">Durable protected Automation identities and Drafts. Existing browser-local Lab Automations remain below as a separate proving surface.</p><div class="v3-drafts server-drafts">${state.automations.length ? state.automations.map(serverCard).join("") : `<div class="v3-empty"><strong>No server-backed Automations yet</strong><span>Create one without touching the local Lab dataset.</span></div>`}</div></section>`;
  }

  function renderServerDashboardSection() {
    const dashboard = $(".v3-dashboard");
    if (!dashboard) return;
    let section = $("[data-server-automations-section]", dashboard);
    if (!section) {
      section = document.createElement("section");
      section.dataset.serverAutomationsSection = "";
      const anchor = $(".v3-template-section", dashboard) || $(".v3-hero", dashboard);
      anchor?.insertAdjacentElement("afterend", section);
    }
    section.outerHTML = serverSectionMarkup();
    document.documentElement.dataset.serverAutomations = state.listStatus;
  }

  function showCreateDialog() {
    closeOverlay();
    const layer = document.createElement("div");
    layer.className = "v10-confirm-layer server-form-layer";
    layer.dataset.serverOverlay = "";
    layer.innerHTML = `<form class="v10-confirm-dialog server-create-dialog" data-server-create-form><span>GENUINELY NEW · SERVER IDENTITY</span><h2>Create real Automation</h2><p>The backend creates the stable Automation and blank progressive Draft. No local Automation record is created.</p><label class="server-field"><span>Name</span><input name="name" maxlength="255" required autocomplete="off" placeholder="Example: Send continuity email"></label><label class="server-field"><span>Description <small>optional</small></span><textarea name="description" rows="3" maxlength="4000"></textarea></label><p class="server-form-error" data-server-form-error></p><div class="v10-confirm-actions"><button type="button" data-server-overlay-close>Cancel</button><button type="submit">Create on server</button></div></form>`;
    document.body.append(layer);
    requestAnimationFrame(() => $("input[name='name']", layer)?.focus());
  }

  function closeOverlay() {
    $$('[data-server-overlay]').forEach((node) => node.remove());
  }

  async function createAutomation(form) {
    const errorNode = $("[data-server-form-error]", form);
    const submit = $("button[type='submit']", form);
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      description: String(data.get("description") || "").trim() || null,
    };
    if (!payload.name) return;
    submit.disabled = true;
    if (errorNode) errorNode.textContent = "";
    try {
      const details = await API.createAutomation(payload);
      closeOverlay();
      state.automations.unshift(details.automation);
      await openServerAutomation(details.automation.id, details);
    } catch (error) {
      if (errorNode) errorNode.textContent = errorText(error);
      submit.disabled = false;
    }
  }

  async function loadResources() {
    state.resourceLoading = true;
    state.resourceError = null;
    state.resources.people = [];
    state.resources.contacts = new Map();
    state.resources.connections = [];
    state.resources.senders = new Map();
    state.resources.content = [];
    try {
      const [people, connections, library] = await Promise.all([
        API.listPeople(),
        API.listConnections(),
        API.listLibrary(),
      ]);
      state.resources.people = Array.isArray(people) ? people : [];
      state.resources.connections = Array.isArray(connections) ? connections : [];
      state.resources.content = (library?.items || []).filter((item) => item.item_type === "content" && item.lifecycle === "active");

      const contacts = await Promise.all(state.resources.people.map(async (person) => [
        person.id,
        await API.listContacts(person.id),
      ]));
      state.resources.contacts = new Map(contacts);

      const senders = await Promise.all(state.resources.connections.map(async (connection) => [
        connection.id,
        await API.listSenders(connection.id),
      ]));
      state.resources.senders = new Map(senders);
    } catch (error) {
      state.resourceError = error;
    } finally {
      state.resourceLoading = false;
    }
  }

  async function openServerAutomation(automationId, supplied = null) {
    state.current = null;
    state.view = "definition";
    state.stage = 0;
    state.saveStatus = "saved";
    state.saveMessage = "";
    state.pendingDefinition = null;
    state.preflight = null;
    state.runs = [];
    state.selectedRun = null;
    app.innerHTML = shell(`<main class="server-automation-editor"><div class="server-editor-loading"><strong>Loading protected Automation…</strong><span>${esc(automationId)}</span></div></main>`);
    bindStaticServerControls();
    try {
      const [details] = await Promise.all([
        supplied ? Promise.resolve(supplied) : API.getAutomation(automationId),
        loadResources(),
      ]);
      state.current = details;
      renderServerEditor();
    } catch (error) {
      app.innerHTML = shell(`<main class="server-automation-editor"><section class="v10-control-panel"><div class="v10-callout"><strong>Protected Automation unavailable</strong><span>${esc(errorText(error))}</span></div><button class="server-small-button" data-server-exit>← Back to Automations</button></section></main>`);
      bindStaticServerControls();
    }
  }

  function currentDefinition() {
    return state.current?.draft?.definition || {
      schema_version: 1,
      trigger: null,
      conditions: [],
      actions: [],
      start_policy: null,
      finish: null,
    };
  }

  function triggerLabel(definition) {
    return TRIGGERS.find((item) => item.type === definition.trigger?.type)?.label || "Not set";
  }

  function personFor(id) {
    return state.resources.people.find((item) => item.id === id) || null;
  }
  function contactFor(id) {
    for (const contacts of state.resources.contacts.values()) {
      const found = contacts.find((item) => item.id === id);
      if (found) return found;
    }
    return null;
  }
  function connectionFor(id) {
    return state.resources.connections.find((item) => item.id === id) || null;
  }
  function senderFor(id) {
    for (const senders of state.resources.senders.values()) {
      const found = senders.find((item) => item.id === id);
      if (found) return found;
    }
    return null;
  }
  function contentFor(id) {
    return state.resources.content.find((item) => item.stable_id === id) || null;
  }

  function readableFlow(definition) {
    const actions = definition.actions || [];
    const actionLabel = actions.length ? actions.map((action) => {
      const person = personFor(action.recipient_person_id);
      return action.type === "email" ? `Email ${person?.display_name || "recipient"}` : action.type;
    }).join(" → ") : "No action";
    return `${triggerLabel(definition)} → No server conditions → ${actionLabel} → ${definition.start_policy ? "Immediate" : "Timing not set"} → ${definition.finish ? "Finish" : "Finish not set"}`;
  }

  function lifecycle() {
    return state.current?.automation?.lifecycle || "draft";
  }

  function renderObjectHeader() {
    const automation = state.current.automation;
    const draft = state.current.draft;
    return `<header class="v3-editor-head server-editor-head"><div class="v10-object-bar"><button class="v10-exit" type="button" data-server-exit><span>←</span><strong>Automations</strong></button><div class="v10-object-state"><span>SERVER AUTOMATION</span><strong>${esc(String(lifecycle()).toUpperCase())}</strong><small>Draft revision ${esc(draft.revision)} · ${esc(saveStateLabel(true))}</small></div><button class="v10-object-menu" type="button" data-server-menu aria-label="Automation actions">•••</button><button class="v10-object-close" type="button" data-server-exit aria-label="Close Automation">×</button></div><div class="v3-editor-title-row"><button class="v3-title-button server-title-button" type="button" disabled><span>AUTOMATION · SERVER-BACKED</span><strong>${esc(automation.name)}</strong><small><b data-state="${esc(state.saveStatus)}">${esc(saveStateLabel())}</b> · ${esc(automation.id)}</small></button></div><nav class="v10-control-nav" aria-label="Automation sections">${SECTIONS.map((section) => `<button type="button" data-server-section="${section}" class="${state.view === section ? "is-active" : ""}" aria-selected="${state.view === section}">${section[0].toUpperCase() + section.slice(1)}</button>`).join("")}</nav>${state.view === "definition" ? `<nav class="v3-stage-rail">${STAGES.map((entry, index) => `<button type="button" class="${index === state.stage ? "is-current" : ""}" data-server-stage="${index}"><b>${String(index + 1).padStart(2, "0")}</b><span><small>${entry.short}</small><strong>${entry.label}</strong></span></button>`).join("")}</nav>` : ""}</header>`;
  }

  function renderOverview() {
    const automation = state.current.automation;
    const draft = state.current.draft;
    const published = state.current.current_published_version;
    return `<section class="v10-control-panel server-control-panel"><header class="v10-panel-head"><div><span>OVERVIEW · SERVER</span><h2>${esc(automation.name)}</h2><p>Protected Automation identity and mutable Draft state from the backend.</p></div><b>${esc(String(automation.lifecycle).toUpperCase())}</b></header><div class="v10-stat-grid"><article class="v10-stat"><span>Automation ID</span><strong>${esc(automation.id.slice(0, 8))}…</strong><small>Stable backend UUID</small></article><article class="v10-stat"><span>Draft</span><strong>Revision ${draft.revision}</strong><small>${esc(relative(draft.updated_at))}</small></article><article class="v10-stat"><span>Published</span><strong>${published ? `v${published.version_number}` : "None"}</strong><small>${published ? "Immutable version exists" : "Draft only"}</small></article><article class="v10-stat"><span>Readiness</span><strong>${state.preflight ? (state.preflight.ready ? "Ready" : `${state.preflight.issues.length} blocker${state.preflight.issues.length === 1 ? "" : "s"}`) : "Backend preflight"}</strong><small>Backend decides</small></article></div><section class="v10-section"><header><span>SOURCE OF TRUTH</span><h3>Server-backed object</h3></header><p>The Automation, Draft revision, published versions and Runtime history are server canonical. <code>cmx-lab-automations-v1</code> remains only for the separate local Lab cards.</p></section></section>`;
  }

  function renderTriggerStage(definition) {
    return `<section class="v3-stage-section"><header><span>WHEN</span><h2>What should start this?</h2><p>Choose a backend-supported trigger. The Draft may remain incomplete while you work.</p></header><div class="v3-choice-grid">${TRIGGERS.map((trigger) => `<button type="button" class="v3-choice ${definition.trigger?.type === trigger.type ? "is-selected" : ""}" data-server-trigger="${trigger.type}"><b>${esc(trigger.mark)}</b><span><strong>${esc(trigger.label)}</strong><small>${esc(trigger.note)}</small></span><i>${definition.trigger?.type === trigger.type ? "✓" : ""}</i></button>`).join("")}</div><button class="server-link-button" type="button" data-server-clear-trigger>Clear trigger</button></section>`;
  }

  function renderConditionsStage() {
    return `<section class="v3-stage-section"><header><span>IF</span><h2>Conditions stay visible, but server support is narrow.</h2><p>The current backend Automation slice rejects non-empty conditions. This server-backed Draft therefore persists <code>conditions: []</code>.</p></header><div class="v3-always-card"><b>✓</b><span><strong>Always continue</strong><small>REUSED stage · backend limitation explicitly preserved</small></span></div><div class="v10-callout"><strong>Local Lab rules are still available on local Automations.</strong><span>They are not copied into this protected Automation because the real API does not support them yet.</span></div></section>`;
  }

  function selectOptions(items, selected, label, valueKey = "id", labelFn = (item) => item.display_name || item.address || item.display_name) {
    return `<option value="">${esc(label)}</option>${items.map((item) => `<option value="${esc(item[valueKey])}" ${item[valueKey] === selected ? "selected" : ""}>${esc(labelFn(item))}</option>`).join("")}`;
  }

  function renderEmailAction(action, index, total) {
    const people = state.resources.people;
    const contacts = action.recipient_person_id ? (state.resources.contacts.get(action.recipient_person_id) || []) : [];
    const connections = state.resources.connections;
    const senders = action.connection_id ? (state.resources.senders.get(action.connection_id) || []) : [];
    const content = state.resources.content;
    return `<article class="v3-action-card server-email-action" data-server-action-card="${esc(action.step_id)}"><div class="v3-action-rail"><span>${String(index + 1).padStart(2, "0")}</span><i></i></div><div class="v3-action-body"><header><button class="v3-action-type" type="button" disabled><small>COMMUNICATION · SERVER</small><strong>Send email</strong></button><div class="v3-action-controls"><button type="button" data-server-move-up="${esc(action.step_id)}" ${index === 0 ? "disabled" : ""}>↑</button><button type="button" data-server-move-down="${esc(action.step_id)}" ${index === total - 1 ? "disabled" : ""}>↓</button><button type="button" data-server-duplicate-action="${esc(action.step_id)}" title="Duplicate with a new stable step ID">⧉</button><button type="button" disabled title="The backend EmailActionDraft has no enabled/disabled field">Ⅱ</button><button type="button" data-server-remove-action="${esc(action.step_id)}">×</button></div></header><div class="v3-action-fields server-action-fields"><label><span>PERSON · stable person_id</span><select data-server-action-field="${esc(action.step_id)}" data-field="recipient_person_id">${selectOptions(people, action.recipient_person_id, "Choose real Person", "id", (person) => `${person.display_name} · ${person.lifecycle}`)}</select></label><label><span>EMAIL CONTACT · stable contact_method_id</span><select data-server-action-field="${esc(action.step_id)}" data-field="recipient_contact_method_id" ${action.recipient_person_id ? "" : "disabled"}>${selectOptions(contacts, action.recipient_contact_method_id, action.recipient_person_id ? "Choose email" : "Choose Person first", "id", (contact) => `${contact.address} · ${contact.lifecycle}`)}</select></label><label><span>CONNECTION</span><select data-server-action-field="${esc(action.step_id)}" data-field="connection_id">${selectOptions(connections, action.connection_id, "Choose Connection", "id", (connection) => `${connection.display_name} · ${connection.readiness} · ${connection.lifecycle}`)}</select></label><label><span>SENDER IDENTITY</span><select data-server-action-field="${esc(action.step_id)}" data-field="sender_identity_id" ${action.connection_id ? "" : "disabled"}>${selectOptions(senders, action.sender_identity_id, action.connection_id ? "Choose sender" : "Choose Connection first", "id", (sender) => `${sender.display_name ? `${sender.display_name} · ` : ""}${sender.address} · ${sender.lifecycle}`)}</select></label><label class="server-field-span"><span>CONTENT ASSET · mutable while drafting</span><select data-server-action-field="${esc(action.step_id)}" data-field="content_asset_id">${selectOptions(content, action.content_asset_id, "Choose existing Library content", "stable_id", (item) => `${item.display_name} · ${item.current_version_id ? `v${item.current_version_number || "saved"}` : "no saved version"}`)}</select></label><div class="server-action-identity server-field-span"><small>STEP ID</small><code>${esc(action.step_id)}</code></div></div></div></article>`;
  }

  function renderActionsStage(definition) {
    if (state.resourceLoading) return `<section class="v3-stage-section"><header><span>DO</span><h2>Loading protected resources…</h2></header></section>`;
    const resourceWarning = state.resourceError ? `<div class="v10-callout"><strong>Some protected selectors are unavailable.</strong><span>${esc(errorText(state.resourceError))} No empty selector result is being treated as confirmed server absence.</span></div>` : "";
    return `<section class="v3-stage-section v3-actions-stage"><header><span>DO</span><h2>Build the real Email action stack.</h2><p>REUSED action-card interaction. Protected UUIDs stay canonical; names and addresses are live display data.</p></header>${resourceWarning}<div class="v3-action-stack">${(definition.actions || []).map((action, index) => renderEmailAction(action, index, definition.actions.length)).join("") || `<div class="v3-empty"><strong>No server Actions yet</strong><span>An incomplete Draft is still editable and saveable.</span></div>`}</div><button class="v3-add-action" type="button" data-server-add-email><b>＋</b><span><strong>Add Email action</strong><small>Real backend EmailActionDraft</small></span></button><p class="server-stage-note">Drafts may contain multiple Actions and retain reorder/duplicate/remove UX. Current fake Runtime later accepts exactly one published Email action per Run.</p></section>`;
  }

  function renderStartStage(definition) {
    return `<section class="v3-stage-section"><header><span>WAIT</span><h2>When may the Action sequence start?</h2><p>The existing timing stage remains. The current backend supports only the typed <strong>immediate</strong> start policy.</p></header><div class="v3-choice-grid"><button type="button" class="v3-choice ${definition.start_policy?.type === "immediate" ? "is-selected" : ""}" data-server-start-immediate><b>NOW</b><span><strong>Immediate</strong><small>Backend start_policy: immediate</small></span><i>${definition.start_policy?.type === "immediate" ? "✓" : ""}</i></button></div><button class="server-link-button" type="button" data-server-clear-start>Clear start policy</button><div class="v10-callout"><strong>WAIT remains part of the product language.</strong><span>Delays, schedules and unattended timing are not mapped into the current protected Automation contract.</span></div></section>`;
  }

  function renderReviewStage(definition) {
    return `<section class="v3-stage-section"><header><span>TEST</span><h2>Review the mutable Draft.</h2><p>The Draft is server-backed. The lifecycle panel below reads authoritative backend preflight before Review or Publish.</p></header><div class="server-review-flow"><div><span>WHEN</span><strong>${esc(triggerLabel(definition))}</strong></div><div><span>IF</span><strong>No server conditions</strong></div><div><span>DO</span><strong>${definition.actions.length} Email action${definition.actions.length === 1 ? "" : "s"}</strong></div><div><span>WAIT</span><strong>${definition.start_policy?.type || "Not set"}</strong></div><div><span>FINISH</span><strong>${definition.finish?.type || "Not set"}</strong></div></div><button class="server-small-button" type="button" data-server-set-finish>${definition.finish ? "Finish set ✓" : "Set Finish"}</button><button class="server-link-button" type="button" data-server-clear-finish>Clear finish</button></section>`;
  }

  function renderDefinitionStage() {
    const definition = currentDefinition();
    const stage = STAGES[state.stage];
    const body = state.stage === 0 ? renderTriggerStage(definition)
      : state.stage === 1 ? renderConditionsStage()
      : state.stage === 2 ? renderActionsStage(definition)
      : state.stage === 3 ? renderStartStage(definition)
      : renderReviewStage(definition);
    const conflict = state.saveStatus === "conflict" ? `<div class="server-conflict-banner"><strong>Draft changed elsewhere.</strong><span>${esc(state.saveMessage)}</span><button type="button" data-server-reload-draft>Reload server Draft</button></div>` : "";
    const saveFailure = state.saveStatus === "error" ? `<div class="server-conflict-banner"><strong>Draft save failed.</strong><span>${esc(state.saveMessage)}</span><button type="button" data-server-reload-draft>Reload server Draft</button></div>` : "";
    const busy = state.saveStatus === "saving";
    return `<div class="v3-editor-shell server-definition-shell" ${busy ? 'inert aria-busy="true"' : ''}><section class="v3-editor-main">${conflict}${saveFailure}<button class="v3-mobile-flow-toggle" type="button" disabled><span><small>LIVE FLOW · SERVER</small><strong>${esc(readableFlow(definition))}</strong></span></button><div class="v3-step-context"><span>${stage.short}</span><small>Step ${state.stage + 1} of ${STAGES.length}</small></div>${body}</section><aside class="v3-live-panel"><div class="v3-live-head"><span>LIVE FLOW</span><small>Backend Draft revision ${state.current.draft.revision}</small></div><div class="server-live-flow">${STAGES.map((item, index) => `<div class="${index === state.stage ? "is-current" : ""}"><small>${item.short}</small><strong>${index === 0 ? triggerLabel(definition) : index === 1 ? "No server conditions" : index === 2 ? `${definition.actions.length} action${definition.actions.length === 1 ? "" : "s"}` : index === 3 ? (definition.start_policy?.type || "Not set") : (definition.finish?.type || "Not set")}</strong></div>`).join("")}</div><div class="v3-live-summary"><span>READABLE VERSION</span><p>${esc(readableFlow(definition))}</p></div></aside></div><footer class="v3-editor-footer"><div><button class="v3-footer-secondary" type="button" data-server-stage-back ${state.stage === 0 ? "disabled" : ""}>Back</button><button class="v3-footer-primary" type="button" data-server-stage-next>${state.stage === 4 ? "Stay in TEST" : "Continue"}</button></div></footer>`;
  }

  function placeholderPanel(section) {
    const labels = {
      runs: ["RUNS", "Loading durable Runtime records from the protected backend."],
      permissions: ["PERMISSIONS", "Loading current execution and authority truth for this Automation."],
      related: ["RELATED", "Loading protected references from the current Draft."],
      history: ["HISTORY", "Loading the current Draft revision and immutable published Versions."],
      settings: ["SETTINGS", "Loading only the protected operations supported by this frontend contract."],
    };
    const [title, copy] = labels[section] || [section.toUpperCase(), "Loading server-backed state."];
    return `<section class="v10-control-panel server-control-panel"><header class="v10-panel-head"><div><span>${esc(title)} · SERVER</span><h2>${esc(state.current.automation.name)}</h2><p>${esc(copy)}</p></div><b>SERVER</b></header><div class="v10-callout"><strong>No browser-only substitute</strong><span>This panel remains server-backed while its current data loads.</span></div></section>`;
  }

  function renderServerEditor() {
    if (!state.current) return;
    const body = state.view === "definition" ? renderDefinitionStage()
      : state.view === "overview" ? renderOverview()
      : placeholderPanel(state.view);
    app.innerHTML = shell(`<main class="server-automation-editor" data-server-editor="${esc(state.current.automation.id)}">${renderObjectHeader()}${body}</main>`);
    bindServerEditor();
    document.documentElement.dataset.serverAutomationEditor = "ready";
  }

  async function saveDefinition(nextDefinition) {
    if (!state.current || state.saveStatus === "saving") return;
    const revision = state.current.draft.revision;
    state.saveStatus = "saving";
    state.saveMessage = "";
    renderServerEditor();
    try {
      const draft = await API.updateDraft(state.current.automation.id, {
        expected_revision: revision,
        definition: nextDefinition,
      });
      state.current.draft = draft;
      state.current.automation.lifecycle = "draft";
      state.saveStatus = "saved";
      state.pendingDefinition = null;
      renderServerEditor();
    } catch (error) {
      if (error?.status === 409) {
        state.saveStatus = "conflict";
        state.saveMessage = errorText(error);
        state.pendingDefinition = nextDefinition;
      } else {
        state.saveStatus = "error";
        state.saveMessage = errorText(error);
      }
      renderServerEditor();
    }
  }

  function mutateDefinition(mutator) {
    const definition = clone(currentDefinition());
    mutator(definition);
    definition.schema_version = 1;
    definition.conditions = [];
    saveDefinition(definition);
  }

  async function reloadCurrentDraft() {
    if (!state.current) return;
    try {
      state.current = await API.getAutomation(state.current.automation.id);
      state.saveStatus = "saved";
      state.saveMessage = "";
      state.pendingDefinition = null;
      await loadResources();
      renderServerEditor();
    } catch (error) {
      state.saveStatus = "error";
      state.saveMessage = errorText(error);
      renderServerEditor();
    }
  }

  function changeActionField(stepId, field, value) {
    mutateDefinition((definition) => {
      const action = definition.actions.find((item) => item.step_id === stepId);
      if (!action) return;
      action[field] = value || null;
      if (field === "recipient_person_id") {
        const contact = contactFor(action.recipient_contact_method_id);
        if (!contact || contact.person_id !== action.recipient_person_id) action.recipient_contact_method_id = null;
      }
      if (field === "connection_id") {
        const sender = senderFor(action.sender_identity_id);
        if (!sender || sender.connection_id !== action.connection_id) action.sender_identity_id = null;
      }
    });
  }

  function actionIndex(definition, stepId) {
    return definition.actions.findIndex((item) => item.step_id === stepId);
  }

  function bindServerEditor() {
    bindStaticServerControls();
    $$('[data-server-section]').forEach((button) => button.addEventListener("click", () => {
      state.view = button.dataset.serverSection;
      renderServerEditor();
    }));
    $$('[data-server-stage]').forEach((button) => button.addEventListener("click", () => {
      state.stage = Number(button.dataset.serverStage);
      renderServerEditor();
    }));
    $$('[data-server-trigger]').forEach((button) => button.addEventListener("click", () => mutateDefinition((definition) => {
      definition.trigger = { type: button.dataset.serverTrigger };
    })));
    $("[data-server-clear-trigger]")?.addEventListener("click", () => mutateDefinition((definition) => { definition.trigger = null; }));
    $("[data-server-start-immediate]")?.addEventListener("click", () => mutateDefinition((definition) => { definition.start_policy = { type: "immediate" }; }));
    $("[data-server-clear-start]")?.addEventListener("click", () => mutateDefinition((definition) => { definition.start_policy = null; }));
    $("[data-server-set-finish]")?.addEventListener("click", () => mutateDefinition((definition) => { definition.finish = { type: "finish" }; }));
    $("[data-server-clear-finish]")?.addEventListener("click", () => mutateDefinition((definition) => { definition.finish = null; }));
    $("[data-server-add-email]")?.addEventListener("click", () => mutateDefinition((definition) => {
      definition.actions.push({
        type: "email",
        step_id: uuid(),
        connection_id: null,
        sender_identity_id: null,
        recipient_person_id: null,
        recipient_contact_method_id: null,
        content_asset_id: null,
      });
    }));
    $$('[data-server-action-field]').forEach((select) => select.addEventListener("change", () => {
      changeActionField(select.dataset.serverActionField, select.dataset.field, select.value);
    }));
    $$('[data-server-remove-action]').forEach((button) => button.addEventListener("click", () => mutateDefinition((definition) => {
      definition.actions = definition.actions.filter((item) => item.step_id !== button.dataset.serverRemoveAction);
    })));
    $$('[data-server-duplicate-action]').forEach((button) => button.addEventListener("click", () => mutateDefinition((definition) => {
      const index = actionIndex(definition, button.dataset.serverDuplicateAction);
      if (index < 0) return;
      const copy = clone(definition.actions[index]);
      copy.step_id = uuid();
      definition.actions.splice(index + 1, 0, copy);
    })));
    $$('[data-server-move-up]').forEach((button) => button.addEventListener("click", () => mutateDefinition((definition) => {
      const index = actionIndex(definition, button.dataset.serverMoveUp);
      if (index <= 0) return;
      [definition.actions[index - 1], definition.actions[index]] = [definition.actions[index], definition.actions[index - 1]];
    })));
    $$('[data-server-move-down]').forEach((button) => button.addEventListener("click", () => mutateDefinition((definition) => {
      const index = actionIndex(definition, button.dataset.serverMoveDown);
      if (index < 0 || index >= definition.actions.length - 1) return;
      [definition.actions[index + 1], definition.actions[index]] = [definition.actions[index], definition.actions[index + 1]];
    })));
    $("[data-server-stage-back]")?.addEventListener("click", () => {
      state.stage = Math.max(0, state.stage - 1);
      renderServerEditor();
    });
    $("[data-server-stage-next]")?.addEventListener("click", () => {
      state.stage = Math.min(4, state.stage + 1);
      renderServerEditor();
    });
    $("[data-server-reload-draft]")?.addEventListener("click", reloadCurrentDraft);
  }

  function bindStaticServerControls() {
    $$('[data-server-exit]').forEach((button) => button.addEventListener("click", () => location.reload()));
    $("[data-server-theme]")?.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("cmx-lab-automations-theme-v1", next); } catch {}
      renderServerEditor();
    });
    $("[data-server-menu]")?.addEventListener("click", () => {
      state.view = "overview";
      renderServerEditor();
    });
  }

  function bindDocumentEvents() {
    document.addEventListener("click", (event) => {
      const target = event.target.closest?.("[data-server-new],[data-server-refresh],[data-server-automation],[data-server-overlay-close]");
      if (!target) return;
      if (target.matches("[data-server-new]")) {
        event.preventDefault();
        event.stopPropagation();
        showCreateDialog();
      } else if (target.matches("[data-server-refresh]")) {
        event.preventDefault();
        event.stopPropagation();
        refreshList();
      } else if (target.matches("[data-server-automation]")) {
        event.preventDefault();
        event.stopPropagation();
        openServerAutomation(target.dataset.serverAutomation);
      } else if (target.matches("[data-server-overlay-close]")) {
        event.preventDefault();
        closeOverlay();
      }
    }, true);
    document.addEventListener("submit", (event) => {
      const form = event.target.closest?.("[data-server-create-form]");
      if (!form) return;
      event.preventDefault();
      createAutomation(form);
    });
  }

  let syncQueued = false;
  function scheduleDashboardSync() {
    if (syncQueued || state.current) return;
    syncQueued = true;
    requestAnimationFrame(() => {
      syncQueued = false;
      if ($(".v3-dashboard")) renderServerDashboardSection();
    });
  }

  const observer = new MutationObserver(scheduleDashboardSync);
  observer.observe(app, { childList: true, subtree: true });
  bindDocumentEvents();
  refreshList();
  scheduleDashboardSync();
})();
