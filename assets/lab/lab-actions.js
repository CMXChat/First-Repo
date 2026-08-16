(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /**
   * BACKEND HANDOFF — ACTION BUILDER
   * --------------------------------
   * This module is a Lab-only presentation + local mock adapter. It MUST NOT
   * execute SMS, email, social posts, AI tools, webhooks, account operations,
   * publication, or any other external side effect from the browser.
   *
   * Production replacement plan:
   * 1) PostgreSQL owns action definitions, targets, trigger rules, guardrails,
   *    revisions, execution snapshots, and immutable execution events.
   * 2) FastAPI validates every mutation and resolves stable record IDs.
   * 3) A server-side scheduler/worker owns eligibility and execution. Browsers
   *    never decide that an action is due and never perform the action.
   * 4) Trigger boundaries are derived from the authoritative switch deadline:
   *      deadline_at = last_checkin_at + 72h
   *      grace_expires_at = deadline_at + 24h
   * 5) The action definition references people, organizations, documents, and
   *    digital assets by stable IDs. Do not copy recipient/account metadata into
   *    the definition. At execution time, snapshot the fully resolved inputs.
   * 6) Secrets belong in the future secret-management layer. Definitions may
   *    store a secret_ref/connection_ref, never passwords, tokens, keys, cookies,
   *    MFA seeds, or recovery codes.
   * 7) Destructive actions require stronger server policy than this UI alone.
   *    The Lab forces approval as a UX preview, but backend policy is authoritative.
   *
   * Suggested production models/endpoints are documented in:
   * assets/lab/ACTIONS-BACKEND-HANDOFF.md
   */

  const ACTION_STORAGE_KEY = "cmx-lab-actions-v1";
  const CRM_STORAGE_KEY = "cmx-lab-crm-v1";
  const INVENTORY_STORAGE_KEY = "cmx-lab-inventory-v1";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? "").replace(/[&<>'"]/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));
  const nowIso = offsetHours => new Date(Date.now() - offsetHours * 3600000).toISOString();
  const clone = value => JSON.parse(JSON.stringify(value));

  const TYPE_META = {
    sms: {
      label: "SMS text",
      mark: "SMS",
      risk: "Important",
      description: "Send a concise text message to selected people.",
      targetHint: "People are the normal recipients. Other records can be linked as context."
    },
    email: {
      label: "Email",
      mark: "EML",
      risk: "Important",
      description: "Deliver an email with optional linked document context.",
      targetHint: "People and organizations are normal recipients. Documents can be attached later by the backend."
    },
    social: {
      label: "Social post",
      mark: "SOC",
      risk: "Critical",
      description: "Prepare a post for a selected social-account asset.",
      targetHint: "Link the intended social-account asset and any records the post depends on."
    },
    ai: {
      label: "AI task",
      mark: "AI",
      risk: "Critical",
      description: "Generate a controlled AI output from approved records and instructions.",
      targetHint: "People, organizations, documents, and assets can become approved AI context."
    },
    organization_notice: {
      label: "Organization notice",
      mark: "ORG",
      risk: "Important",
      description: "Prepare a formal notice for one or more organizations.",
      targetHint: "Organizations are the primary target. People can be linked as named contacts."
    },
    publish: {
      label: "Publish / release",
      mark: "PUB",
      risk: "Critical",
      description: "Release an approved package or statement through a future server-side publisher.",
      targetHint: "Link the documents/assets that form the release package."
    },
    webhook: {
      label: "Webhook / API",
      mark: "API",
      risk: "Critical",
      description: "Call a future authenticated integration from the server worker.",
      targetHint: "Link the records this integration is allowed to reference."
    },
    digital_account: {
      label: "Digital account action",
      mark: "ACC",
      risk: "Destructive",
      description: "Request a controlled account handoff, disablement, archive, or credential operation.",
      targetHint: "Digital assets are the primary targets. Destructive risk always requires approval."
    },
    custom: {
      label: "Custom action",
      mark: "CUS",
      risk: "Critical",
      description: "Define a future server-side handler with explicit instructions and boundaries.",
      targetHint: "Link every record the custom handler is allowed to resolve."
    },
    scheduled: {
      label: "Scheduled task",
      mark: "CAL",
      risk: "Important",
      description: "Run a defined task at a specific date/time or calendar boundary.",
      targetHint: "Link any records the scheduled task needs."
    }
  };

  const RISKS = ["Informational", "Important", "Critical", "Destructive"];
  const STATUSES = ["Draft", "Enabled", "Suspended"];
  const TRIGGERS = {
    deadline: {
      label: "At 72-hour deadline",
      short: "72H DEADLINE",
      detail: "Eligible when the current 72-hour proof-of-life window expires."
    },
    grace_offset: {
      label: "Inside 24-hour grace",
      short: "GRACE OFFSET",
      detail: "Eligible a chosen number of hours after the 72-hour deadline, before final trigger."
    },
    grace_expiry: {
      label: "At grace expiration",
      short: "96H FINAL",
      detail: "Eligible when the additional 24-hour grace period expires."
    },
    scheduled: {
      label: "Specific date & time",
      short: "CALENDAR",
      detail: "Eligible at an explicit calendar date/time independent of the rolling switch boundary."
    },
    manual: {
      label: "Manual only",
      short: "MANUAL",
      detail: "Never becomes automatically eligible from the switch timeline."
    }
  };

  function seedActions() {
    return {
      version: 1,
      actions: [
        {
          id: "act-legal-sms",
          name: "Primary legal escalation",
          type: "sms",
          risk: "Critical",
          status: "Enabled",
          config: { message: "Lab sample: urgent contingency notice. Review protected instructions and acknowledge receipt." },
          targets: [{ kind: "person", id: "p-maya" }],
          trigger: { mode: "grace_expiry", offsetHours: 24, at: "", timezone: "America/New_York" },
          guardrails: { oneTime: true, requireOverdue: true, requireApproval: false, retryCount: 2, retryIntervalMinutes: 15 },
          updatedAt: nowIso(1),
          activity: [
            { title: "Action reviewed", detail: "Synthetic trigger action reviewed in Lab.", at: nowIso(1) },
            { title: "Target linked", detail: "Maya Chen linked by stable person ID.", at: nowIso(20) }
          ]
        },
        {
          id: "act-continuity-email",
          name: "Business continuity packet",
          type: "email",
          risk: "Important",
          status: "Enabled",
          config: {
            subject: "Contingency continuity notice",
            body: "Lab sample email. Follow the linked continuity plan and confirm operational handoff."
          },
          targets: [
            { kind: "person", id: "p-daniel" },
            { kind: "organization", id: "o-atlas" },
            { kind: "document", id: "d-business-continuity" }
          ],
          trigger: { mode: "grace_offset", offsetHours: 3, at: "", timezone: "America/New_York" },
          guardrails: { oneTime: true, requireOverdue: true, requireApproval: false, retryCount: 1, retryIntervalMinutes: 30 },
          updatedAt: nowIso(6),
          activity: [
            { title: "Timing changed", detail: "Set to three hours inside the grace period.", at: nowIso(6) }
          ]
        },
        {
          id: "act-ai-brief",
          name: "Prepare contingency briefing",
          type: "ai",
          risk: "Critical",
          status: "Enabled",
          config: {
            objective: "Prepare a concise handoff briefing from approved Lab records.",
            instructions: "Summarize linked instructions and operational assets. Flag missing information. Do not contact anyone.",
            aiMode: "Generate output only",
            output: "Save to protected activity draft"
          },
          targets: [
            { kind: "document", id: "d-emergency-instructions" },
            { kind: "document", id: "d-business-continuity" },
            { kind: "asset", id: "a-primary-domain" }
          ],
          trigger: { mode: "deadline", offsetHours: 0, at: "", timezone: "America/New_York" },
          guardrails: { oneTime: true, requireOverdue: true, requireApproval: false, retryCount: 0, retryIntervalMinutes: 15 },
          updatedAt: nowIso(11),
          activity: [
            { title: "AI boundary set", detail: "Generate-output-only permission selected.", at: nowIso(11) }
          ]
        },
        {
          id: "act-account-handoff",
          name: "Primary domain handoff request",
          type: "digital_account",
          risk: "Destructive",
          status: "Enabled",
          config: {
            operation: "Transfer access",
            instructions: "Prepare the approved domain handoff workflow for operator review."
          },
          targets: [
            { kind: "asset", id: "a-primary-domain" },
            { kind: "person", id: "p-noah" }
          ],
          trigger: { mode: "grace_expiry", offsetHours: 24, at: "", timezone: "America/New_York" },
          guardrails: { oneTime: true, requireOverdue: true, requireApproval: true, retryCount: 0, retryIntervalMinutes: 15 },
          updatedAt: nowIso(18),
          activity: [
            { title: "Approval required", detail: "Destructive-risk Lab action requires operator approval.", at: nowIso(18) }
          ]
        }
      ]
    };
  }

  function loadData() {
    try {
      const stored = JSON.parse(localStorage.getItem(ACTION_STORAGE_KEY));
      if (stored?.version === 1 && Array.isArray(stored.actions)) return stored;
    } catch {}
    const seeded = seedActions();
    localStorage.setItem(ACTION_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  function loadCrm() {
    try {
      const stored = JSON.parse(localStorage.getItem(CRM_STORAGE_KEY));
      if (stored?.version === 1) return stored;
    } catch {}
    return { people: [], organizations: [] };
  }

  function loadInventory() {
    try {
      const stored = JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY));
      if (stored?.version === 1) return stored;
    } catch {}
    return { documents: [], assets: [] };
  }

  let data = loadData();
  let crm = loadCrm();
  let inventory = loadInventory();
  let root;
  let builder;
  let builderState = null;
  const ui = { selectedId: data.actions[0]?.id || null, query: "", filter: "all", sort: "updated" };

  function typeMeta(type) { return TYPE_META[type] || TYPE_META.custom; }
  function actionFor(id = ui.selectedId) { return data.actions.find(action => action.id === id) || null; }
  function personFor(id) { return crm.people?.find(person => person.id === id) || null; }
  function orgFor(id) { return crm.organizations?.find(org => org.id === id) || null; }
  function docFor(id) { return inventory.documents?.find(doc => doc.id === id) || null; }
  function assetFor(id) { return inventory.assets?.find(asset => asset.id === id) || null; }

  function stableTarget(target) {
    if (!target) return null;
    if (target.kind === "person") {
      const record = personFor(target.id);
      return record ? { ...target, name: record.name, meta: record.role || record.relationship || "Person" } : null;
    }
    if (target.kind === "organization") {
      const record = orgFor(target.id);
      return record ? { ...target, name: record.name, meta: record.type || "Organization" } : null;
    }
    if (target.kind === "document") {
      const record = docFor(target.id);
      return record ? { ...target, name: record.title, meta: record.category || "Document" } : null;
    }
    if (target.kind === "asset") {
      const record = assetFor(target.id);
      return record ? { ...target, name: record.name, meta: record.type || "Digital asset" } : null;
    }
    return null;
  }

  function allTargets() {
    return [
      ...(crm.people || []).map(record => ({ kind: "person", id: record.id, name: record.name, meta: record.role || record.relationship || "Person" })),
      ...(crm.organizations || []).map(record => ({ kind: "organization", id: record.id, name: record.name, meta: record.type || "Organization" })),
      ...(inventory.documents || []).map(record => ({ kind: "document", id: record.id, name: record.title, meta: record.category || "Document" })),
      ...(inventory.assets || []).map(record => ({ kind: "asset", id: record.id, name: record.name, meta: record.type || "Digital asset" }))
    ];
  }

  function slugId() {
    return `act-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function configuredCount() {
    return data.actions.filter(action => action.status !== "Draft").length;
  }

  function saveData(source = "actions") {
    localStorage.setItem(ACTION_STORAGE_KEY, JSON.stringify(data));
    syncPublicCount();
    document.dispatchEvent(new CustomEvent("cmx:lab-actions-updated", {
      detail: { total: data.actions.length, configured: configuredCount(), source }
    }));
  }

  function syncPublicCount() {
    const count = configuredCount();
    const publicCount = $("#actionPublicCount");
    const quickCount = $("#actionCount");
    if (publicCount) publicCount.textContent = String(count);
    if (quickCount) quickCount.textContent = `${count} configured`;
  }

  function shortDate(iso) {
    if (!iso) return "—";
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 3600000) return `${Math.max(1, Math.floor(diff / 60000))}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 7 * 86400000) return `${Math.floor(diff / 86400000)}d`;
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(iso));
  }

  function longDate(iso) {
    if (!iso) return "Not set";
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
  }

  function riskRank(risk) {
    return ({ Destructive: 0, Critical: 1, Important: 2, Informational: 3 }[risk] ?? 4);
  }

  function triggerLabel(action) {
    const trigger = action?.trigger || {};
    if (trigger.mode === "grace_offset") return `${Number(trigger.offsetHours || 0)}h into grace`;
    if (trigger.mode === "scheduled") return trigger.at ? longDate(trigger.at) : "Calendar time not set";
    return TRIGGERS[trigger.mode]?.label || "Trigger not set";
  }

  function triggerSummary(action) {
    const trigger = action?.trigger || {};
    if (trigger.mode === "deadline") return "when the 72-hour check-in deadline is reached";
    if (trigger.mode === "grace_expiry") return "when the additional 24-hour grace period expires";
    if (trigger.mode === "grace_offset") return `${Number(trigger.offsetHours || 0)} hours after the 72-hour deadline`;
    if (trigger.mode === "scheduled") return trigger.at ? `at ${longDate(trigger.at)} (${trigger.timezone || "local time"})` : "at a specific date/time that still needs to be set";
    if (trigger.mode === "manual") return "only after a manual operator decision";
    return "when its trigger rule is satisfied";
  }

  function markerPosition(action) {
    const trigger = action?.trigger || {};
    if (trigger.mode === "deadline") return 75;
    if (trigger.mode === "grace_expiry") return 100;
    if (trigger.mode === "grace_offset") return Math.min(99, 75 + (Math.max(0, Math.min(24, Number(trigger.offsetHours || 0))) / 24) * 25);
    return null;
  }

  function toast(message) {
    const node = $("#toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("is-visible"), 2600);
  }

  function filteredActions() {
    let actions = [...data.actions];
    if (ui.query) {
      actions = actions.filter(action => {
        const targets = (action.targets || []).map(stableTarget).filter(Boolean).map(target => target.name);
        return [action.name, typeMeta(action.type).label, action.risk, action.status, triggerLabel(action), ...targets]
          .join(" ").toLowerCase().includes(ui.query);
      });
    }
    if (ui.filter !== "all") actions = actions.filter(action => action.status === ui.filter || action.risk === ui.filter || action.type === ui.filter);
    actions.sort((a, b) => {
      if (ui.sort === "name") return a.name.localeCompare(b.name);
      if (ui.sort === "risk") return riskRank(a.risk) - riskRank(b.risk) || a.name.localeCompare(b.name);
      if (ui.sort === "trigger") return triggerSortValue(a) - triggerSortValue(b);
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });
    return actions;
  }

  function triggerSortValue(action) {
    const mode = action.trigger?.mode;
    if (mode === "deadline") return 72;
    if (mode === "grace_offset") return 72 + Number(action.trigger.offsetHours || 0);
    if (mode === "grace_expiry") return 96;
    if (mode === "scheduled") return 1000 + (new Date(action.trigger.at || 0).getTime() / 1e13 || 0);
    return 9999;
  }

  function buildShell() {
    const panel = $('[data-view-panel="actions"]');
    if (!panel || $(".lab-actions", panel)) return false;

    const heading = $(".view-heading", panel);
    if (heading) {
      const eyebrow = $(".eyebrow", heading);
      const title = $("h1", heading);
      if (eyebrow) eyebrow.textContent = "CONTINGENCY AUTOMATION · LAB";
      if (title) title.textContent = "Trigger actions";
      if (!$(".heading-meta", heading)) {
        const meta = document.createElement("div");
        meta.className = "heading-meta lab-action-heading-meta";
        meta.innerHTML = '<span>SIMULATION ONLY</span><small>Production execution blocked</small>';
        heading.append(meta);
      }
    }

    ["#secretActionSequence", "#publicActionSequence", "#actionForm", "#actionsList"].forEach(selector => {
      const node = $(selector, panel);
      if (node) node.hidden = true;
    });

    root = document.createElement("section");
    root.className = "lab-actions";
    root.setAttribute("aria-label", "Lab contingency action workspace");
    panel.append(root);

    builder = document.createElement("dialog");
    builder.className = "lab-action-builder";
    builder.id = "labActionBuilder";
    document.body.append(builder);

    root.addEventListener("click", handleRootClick);
    root.addEventListener("input", handleRootInput);
    root.addEventListener("change", handleRootChange);
    builder.addEventListener("click", handleBuilderClick);
    builder.addEventListener("input", handleBuilderInput);
    builder.addEventListener("change", handleBuilderChange);

    document.addEventListener("cmx:lab-crm-updated", refreshRelations);
    document.addEventListener("cmx:lab-inventory-updated", refreshRelations);

    syncPublicCount();
    render();
    return true;
  }

  function refreshRelations() {
    crm = loadCrm();
    inventory = loadInventory();
    if (root) render();
  }

  function render() {
    if (!root) return;
    const actions = filteredActions();
    if (!ui.selectedId || !data.actions.some(action => action.id === ui.selectedId)) ui.selectedId = actions[0]?.id || data.actions[0]?.id || null;

    root.innerHTML = `
      <header class="lab-action-topbar">
        <div class="lab-action-topbar-main">
          <span class="lab-action-topbar-mark" aria-hidden="true">ACT</span>
          <span><strong>Contingency control</strong><small>${configuredCount()} configured · ${data.actions.length} total · local mock</small></span>
        </div>
        <div class="lab-action-tools">
          <label class="lab-action-search"><span class="sr-only">Search actions</span><input type="search" data-action-search value="${esc(ui.query)}" placeholder="Search actions, targets, triggers…" /></label>
          <select data-action-filter aria-label="Filter actions">
            <option value="all"${ui.filter === "all" ? " selected" : ""}>All actions</option>
            ${STATUSES.map(value => `<option value="${value}"${ui.filter === value ? " selected" : ""}>${value}</option>`).join("")}
            ${RISKS.map(value => `<option value="${value}"${ui.filter === value ? " selected" : ""}>${value} risk</option>`).join("")}
          </select>
          <select data-action-sort aria-label="Sort actions">
            <option value="updated"${ui.sort === "updated" ? " selected" : ""}>Recently updated</option>
            <option value="trigger"${ui.sort === "trigger" ? " selected" : ""}>Execution order</option>
            <option value="risk"${ui.sort === "risk" ? " selected" : ""}>Risk</option>
            <option value="name"${ui.sort === "name" ? " selected" : ""}>Name A–Z</option>
          </select>
          <button type="button" class="lab-action-button primary" data-action-command="new">＋ New action</button>
        </div>
      </header>

      <div class="lab-action-warning">
        <span class="lab-action-warning-mark">!</span>
        <span><strong>TRIGGER-CONTROLLED AUTOMATION</strong><small>Every action below is synthetic. The Lab cannot send, publish, execute AI tools, call APIs, or modify accounts.</small></span>
        <b>LAB</b>
      </div>

      <div class="lab-action-layout" data-mobile-detail="false">
        <aside class="lab-action-list-panel">
          <div class="lab-action-pane-head"><span>Action sequence</span><strong>${actions.length}</strong></div>
          <div class="lab-action-list">${actions.length ? actions.map(actionListItem).join("") : emptyActions()}</div>
          <div class="lab-action-list-foot"><span>Definitions stored in this browser</span><button type="button" data-action-command="reset">Reset sample</button></div>
        </aside>
        <section class="lab-action-detail-panel">${renderDetail()}</section>
        <aside class="lab-action-context-panel"><div class="lab-action-pane-head"><span>Execution context</span><strong>LAB</strong></div>${renderContext()}</aside>
      </div>`;
  }

  function emptyActions() {
    return '<div class="lab-action-empty"><strong>No matching actions</strong><p>Change the filters or create a new Lab action.</p></div>';
  }

  function actionListItem(action) {
    const meta = typeMeta(action.type);
    const active = action.id === ui.selectedId;
    return `<button type="button" class="lab-action-list-item risk-${action.risk.toLowerCase()}${active ? " is-active" : ""}" data-action-id="${esc(action.id)}" aria-current="${active}">
      <span class="lab-action-list-alert" aria-hidden="true">!</span>
      <span class="lab-action-type-mark" aria-hidden="true">${meta.mark}</span>
      <span class="lab-action-list-copy"><strong>${esc(action.name)}</strong><small>${esc(meta.label)} · ${esc(triggerLabel(action))}</small></span>
      <span class="lab-action-list-meta"><span class="lab-action-state state-${action.status.toLowerCase()}">${esc(action.status)}</span><span>${esc(shortDate(action.updatedAt))}</span></span>
    </button>`;
  }

  function renderDetail() {
    const action = actionFor();
    if (!action) return '<div class="lab-action-detail empty"><strong>Select an action</strong><p>Open a directive from the sequence or create a new one.</p></div>';
    const meta = typeMeta(action.type);
    const targets = (action.targets || []).map(stableTarget).filter(Boolean);
    const marker = markerPosition(action);
    return `<div class="lab-action-detail">
      <button type="button" class="lab-action-mobile-back" data-action-command="mobile-back">← Action sequence</button>
      <header class="lab-action-profile-head">
        <span class="lab-action-profile-mark risk-${action.risk.toLowerCase()}" aria-hidden="true">${meta.mark}</span>
        <div class="lab-action-profile-title">
          <span class="lab-action-kicker"><i></i>${esc(meta.label.toUpperCase())} · ${esc(action.risk.toUpperCase())} RISK</span>
          <h2>${esc(action.name)}</h2>
          <p>${esc(triggerLabel(action))} · ${targets.length} linked record${targets.length === 1 ? "" : "s"}</p>
          <div class="lab-action-chip-row"><span class="lab-action-chip state-${action.status.toLowerCase()}">${esc(action.status)}</span><span class="lab-action-chip">${esc(action.id.toUpperCase())}</span><span class="lab-action-chip lab-only">SIMULATION ONLY</span></div>
        </div>
        <div class="lab-action-profile-actions">
          <button type="button" class="lab-action-button" data-action-command="duplicate">Duplicate</button>
          <button type="button" class="lab-action-button" data-action-command="edit">Edit</button>
          <button type="button" class="lab-action-button primary" data-action-command="toggle">${action.status === "Enabled" ? "Suspend" : "Enable"}</button>
        </div>
      </header>

      <section class="lab-boundary-card">
        <div class="lab-card-head"><strong>Execution boundary</strong><small>${esc(TRIGGERS[action.trigger?.mode]?.short || "UNSET")}</small></div>
        ${executionTimeline(action, marker)}
        <div class="lab-boundary-copy"><span><small>ELIGIBILITY</small><strong>${esc(triggerLabel(action))}</strong></span><p>${esc(TRIGGERS[action.trigger?.mode]?.detail || "No trigger configured.")}</p></div>
      </section>

      <div class="lab-action-detail-grid">
        <section class="lab-action-card"><div class="lab-card-head"><strong>Action configuration</strong><small>${esc(meta.mark)}</small></div>${configSummary(action)}</section>
        <section class="lab-action-card"><div class="lab-card-head"><strong>Guardrails</strong><small>${action.guardrails?.requireApproval ? "APPROVAL" : "AUTOMATIC"}</small></div>${guardrailSummary(action)}</section>
        <section class="lab-action-card full"><div class="lab-card-head"><strong>Linked targets & context</strong><small>${targets.length} RECORD${targets.length === 1 ? "" : "S"}</small></div>${targets.length ? `<div class="lab-action-target-grid">${targets.map(targetChip).join("")}</div>` : '<p class="lab-action-body-copy">No records linked yet.</p>'}</section>
        <section class="lab-action-card full"><div class="lab-card-head"><strong>Execution summary</strong><small>HUMAN READABLE</small></div><p class="lab-action-execution-summary">${esc(humanSummary(action))}</p></section>
        <section class="lab-action-card full"><div class="lab-card-head"><strong>Definition activity</strong><small>${(action.activity || []).length} EVENTS</small></div>${activityTimeline(action.activity)}</section>
      </div>

      <footer class="lab-action-danger-foot">
        <span><b>!</b><strong>NO EXTERNAL EXECUTION</strong><small>This Lab definition cannot cause an external side effect.</small></span>
        <button type="button" data-action-command="delete">Delete Lab action</button>
      </footer>
    </div>`;
  }

  function executionTimeline(action, marker) {
    const trigger = action.trigger || {};
    if (trigger.mode === "scheduled" || trigger.mode === "manual") {
      return `<div class="lab-calendar-boundary"><span>${trigger.mode === "scheduled" ? "CAL" : "MAN"}</span><div><strong>${esc(triggerLabel(action))}</strong><small>${trigger.mode === "scheduled" ? esc(trigger.timezone || "Local timezone") : "No automatic eligibility"}</small></div></div>`;
    }
    return `<div class="lab-execution-line" aria-label="72 hour deadline and 24 hour grace timeline">
      <span class="lab-execution-base"></span>
      <span class="lab-execution-grace"></span>
      <i class="lab-execution-node start" title="Check in"></i>
      <i class="lab-execution-node deadline" title="72 hour deadline"></i>
      <i class="lab-execution-node final" title="Grace expires"></i>
      ${marker !== null ? `<b class="lab-execution-marker risk-${action.risk.toLowerCase()}" style="left:${marker}%"><em>!</em><small>${esc(TRIGGERS[trigger.mode]?.short || "ACTION")}</small></b>` : ""}
      <span class="lab-execution-label start">CHECK IN</span>
      <span class="lab-execution-label deadline">72H DEADLINE</span>
      <span class="lab-execution-label final">+24H TRIGGER</span>
    </div>`;
  }

  function configSummary(action) {
    const c = action.config || {};
    const rows = [];
    if (action.type === "sms") rows.push(["Message", c.message || "Not set"]);
    else if (action.type === "email") rows.push(["Subject", c.subject || "Not set"], ["Body", c.body || "Not set"]);
    else if (action.type === "social") rows.push(["Post", c.content || "Not set"], ["Audience", c.audience || "Configured later"]);
    else if (action.type === "ai") rows.push(["Objective", c.objective || "Not set"], ["AI mode", c.aiMode || "Generate output only"], ["Output", c.output || "Protected draft"]);
    else if (action.type === "organization_notice") rows.push(["Subject", c.subject || "Not set"], ["Notice", c.body || "Not set"]);
    else if (action.type === "publish") rows.push(["Package", c.packageName || "Not set"], ["Instruction", c.instructions || "Not set"]);
    else if (action.type === "webhook") rows.push(["Endpoint", c.endpoint || "Mock endpoint not set"], ["Method", c.method || "POST"]);
    else if (action.type === "digital_account") rows.push(["Operation", c.operation || "Not set"], ["Instruction", c.instructions || "Not set"]);
    else if (action.type === "scheduled") rows.push(["Task", c.task || "Not set"], ["Instruction", c.instructions || "Not set"]);
    else rows.push(["Handler", c.handler || "Not set"], ["Instruction", c.instructions || "Not set"]);
    return `<div class="lab-config-summary">${rows.map(([label, value]) => `<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("")}</div>`;
  }

  function guardrailSummary(action) {
    const g = action.guardrails || {};
    const values = [
      ["One time", g.oneTime ? "Yes" : "No"],
      ["Still overdue", g.requireOverdue ? "Required" : "Not required"],
      ["Approval", g.requireApproval ? "Required" : "Not required"],
      ["Retries", Number(g.retryCount || 0) ? `${Number(g.retryCount)} × every ${Number(g.retryIntervalMinutes || 15)}m` : "No retries"]
    ];
    return `<div class="lab-guardrail-grid">${values.map(([label, value]) => `<span><small>${esc(label)}</small><strong>${esc(value)}</strong></span>`).join("")}</div>`;
  }

  function targetChip(target) {
    const marks = { person: "PER", organization: "ORG", document: "DOC", asset: "WEB" };
    return `<div class="lab-action-target"><span>${marks[target.kind] || "REC"}</span><div><strong>${esc(target.name)}</strong><small>${esc(target.meta)}</small></div></div>`;
  }

  function activityTimeline(events = []) {
    if (!events.length) return '<p class="lab-action-body-copy">No definition activity yet.</p>';
    return `<div class="lab-action-activity">${events.slice(0, 8).map(event => `<div><i></i><span><strong>${esc(event.title)}</strong><small>${esc(event.detail || "")}</small></span><time>${esc(longDate(event.at))}</time></div>`).join("")}</div>`;
  }

  function renderContext() {
    const action = actionFor();
    if (!action) return '<div class="lab-action-context-empty">Select an action to inspect its execution context.</div>';
    const targets = (action.targets || []).map(stableTarget).filter(Boolean);
    return `<div class="lab-action-context">
      <section class="lab-action-context-block">
        <div class="lab-action-context-title"><strong>Control state</strong><span>${esc(action.status.toUpperCase())}</span></div>
        <div class="lab-action-context-body">
          <div class="lab-action-risk-panel risk-${action.risk.toLowerCase()}"><span>RISK CLASS</span><strong>${esc(action.risk)}</strong><small>${action.risk === "Destructive" ? "Approval enforced in Lab" : "Review before enabling"}</small></div>
          <div class="lab-action-context-tile"><span>Trigger boundary</span><strong>${esc(triggerLabel(action))}</strong><small>${esc(TRIGGERS[action.trigger?.mode]?.short || "UNSET")}</small></div>
        </div>
      </section>
      <section class="lab-action-context-block">
        <div class="lab-action-context-title"><strong>Resolved records</strong><span>${targets.length}</span></div>
        <div class="lab-action-context-body">${targets.slice(0, 6).map(targetChip).join("") || '<div class="lab-action-context-tile"><span>Targets</span><strong>None linked</strong><small>Edit this action to select records.</small></div>'}</div>
      </section>
      <section class="lab-action-context-block">
        <div class="lab-action-context-title"><strong>Execution boundary</strong><span>SAFE</span></div>
        <div class="lab-action-context-body">
          <div class="lab-action-context-tile"><span>Browser capability</span><strong>Definition only</strong><small>No network side effects are implemented.</small></div>
          <div class="lab-action-context-tile"><span>Backend owner</span><strong>Scheduler + worker</strong><small>Future FastAPI/PostgreSQL execution path.</small></div>
        </div>
      </section>
    </div>`;
  }

  function humanSummary(action) {
    const meta = typeMeta(action.type);
    const targets = (action.targets || []).map(stableTarget).filter(Boolean);
    const targetText = targets.length ? targets.map(target => target.name).join(", ") : "no linked records yet";
    const g = action.guardrails || {};
    const approval = g.requireApproval ? " Operator approval is required before execution." : "";
    const overdue = g.requireOverdue ? " The switch must still be overdue when eligibility is evaluated." : "";
    const retries = Number(g.retryCount || 0) ? ` A failed execution may retry ${Number(g.retryCount)} time${Number(g.retryCount) === 1 ? "" : "s"} every ${Number(g.retryIntervalMinutes || 15)} minutes.` : "";
    return `${meta.label} “${action.name}” becomes eligible ${triggerSummary(action)}. Linked records: ${targetText}.${overdue}${approval}${retries} This Lab version only saves and previews the definition.`;
  }

  function handleRootClick(event) {
    const record = event.target.closest("[data-action-id]");
    if (record) {
      ui.selectedId = record.dataset.actionId;
      if (matchMedia("(max-width:700px)").matches) $(".lab-action-layout", root)?.setAttribute("data-mobile-detail", "true");
      render();
      if (matchMedia("(max-width:700px)").matches) $(".lab-action-layout", root)?.setAttribute("data-mobile-detail", "true");
      return;
    }

    const command = event.target.closest("[data-action-command]")?.dataset.actionCommand;
    if (!command) return;
    if (command === "new") return openBuilder();
    if (command === "edit") return openBuilder(actionFor());
    if (command === "duplicate") return duplicateAction();
    if (command === "toggle") return toggleAction();
    if (command === "delete") return deleteAction();
    if (command === "reset") return resetActions();
    if (command === "mobile-back") {
      $(".lab-action-layout", root)?.setAttribute("data-mobile-detail", "false");
    }
  }

  function handleRootInput(event) {
    if (event.target.matches("[data-action-search]")) {
      ui.query = event.target.value.trim().toLowerCase();
      render();
    }
  }

  function handleRootChange(event) {
    if (event.target.matches("[data-action-filter]")) {
      ui.filter = event.target.value;
      render();
    }
    if (event.target.matches("[data-action-sort]")) {
      ui.sort = event.target.value;
      render();
    }
  }

  function toggleAction() {
    const action = actionFor();
    if (!action) return;
    if (action.status === "Enabled") action.status = "Suspended";
    else action.status = "Enabled";
    if (action.risk === "Destructive") action.guardrails.requireApproval = true;
    action.updatedAt = new Date().toISOString();
    action.activity = [{ title: `Action ${action.status.toLowerCase()}`, detail: "State changed in Lab mock storage.", at: action.updatedAt }, ...(action.activity || [])];
    saveData("state");
    render();
    toast(`Action ${action.status.toLowerCase()}.`);
  }

  function duplicateAction() {
    const action = actionFor();
    if (!action) return;
    const copy = clone(action);
    copy.id = slugId();
    copy.name = `${action.name} copy`;
    copy.status = "Draft";
    copy.updatedAt = new Date().toISOString();
    copy.activity = [{ title: "Action duplicated", detail: `Copied from ${action.name}.`, at: copy.updatedAt }];
    data.actions.unshift(copy);
    ui.selectedId = copy.id;
    saveData("duplicate");
    render();
    toast("Draft copy created.");
  }

  function deleteAction() {
    const action = actionFor();
    if (!action) return;
    if (!confirm(`Delete the Lab action “${action.name}”? This only removes the local mock definition.`)) return;
    data.actions = data.actions.filter(item => item.id !== action.id);
    ui.selectedId = data.actions[0]?.id || null;
    saveData("delete");
    render();
    toast("Lab action deleted.");
  }

  function resetActions() {
    if (!confirm("Reset all Lab actions to the synthetic sample set?")) return;
    data = seedActions();
    ui.selectedId = data.actions[0]?.id || null;
    ui.query = "";
    ui.filter = "all";
    ui.sort = "updated";
    saveData("reset");
    render();
    toast("Sample actions restored.");
  }

  function newDraft() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    return {
      id: slugId(),
      name: "",
      type: "sms",
      risk: TYPE_META.sms.risk,
      status: "Draft",
      config: {},
      targets: [],
      trigger: { mode: "grace_expiry", offsetHours: 24, at: "", timezone },
      guardrails: { oneTime: true, requireOverdue: true, requireApproval: false, retryCount: 0, retryIntervalMinutes: 15 },
      updatedAt: new Date().toISOString(),
      activity: []
    };
  }

  function openBuilder(existing = null) {
    builderState = {
      step: 0,
      editing: Boolean(existing),
      action: existing ? clone(existing) : newDraft()
    };
    renderBuilder();
    builder.showModal();
  }

  function renderBuilder() {
    if (!builderState) return;
    const action = builderState.action;
    const steps = ["Action", "Configure", "Targets", "Trigger", "Guardrails", "Review"];
    const step = builderState.step;
    builder.innerHTML = `<div class="lab-builder-shell">
      <header class="lab-builder-head">
        <div><small>CONTINGENCY ACTION BUILDER · LAB</small><h2>${builderState.editing ? "Edit action" : "Create action"}</h2><p>Definition and simulation only. No external execution is available from Lab.</p></div>
        <button type="button" class="lab-builder-close" data-builder-command="close" aria-label="Close">×</button>
      </header>
      <nav class="lab-builder-steps" aria-label="Action builder steps">${steps.map((label, index) => `<button type="button" data-builder-step="${index}" class="${index === step ? "is-active" : index < step ? "is-complete" : ""}" ${index > step ? "disabled" : ""}><span>${index + 1}</span><small>${label}</small></button>`).join("")}</nav>
      <main class="lab-builder-body">${renderBuilderStep()}</main>
      <footer class="lab-builder-foot">
        <button type="button" class="lab-action-button" data-builder-command="back" ${step === 0 ? "disabled" : ""}>← Back</button>
        <span><b>LAB SAFE MODE</b><small>Definitions are stored only in this browser.</small></span>
        <div>
          <button type="button" class="lab-action-button" data-builder-command="close">Cancel</button>
          ${step < 5 ? '<button type="button" class="lab-action-button primary" data-builder-command="next">Continue →</button>' : '<button type="button" class="lab-action-button" data-builder-command="save-draft">Save draft</button><button type="button" class="lab-action-button primary" data-builder-command="save-enabled">Save & enable</button>'}
        </div>
      </footer>
    </div>`;
  }

  function renderBuilderStep() {
    const step = builderState.step;
    if (step === 0) return libraryStep();
    if (step === 1) return configureStep();
    if (step === 2) return targetsStep();
    if (step === 3) return triggerStep();
    if (step === 4) return guardrailsStep();
    return reviewStep();
  }

  function libraryStep() {
    const action = builderState.action;
    return `<section class="lab-builder-section">
      <div class="lab-builder-title"><span>01</span><div><small>ACTION LIBRARY</small><h3>What should happen?</h3><p>Choose a capability family. The backend will eventually map each family to an approved server-side executor.</p></div></div>
      <div class="lab-action-library">${Object.entries(TYPE_META).map(([type, meta]) => `<button type="button" class="lab-library-card risk-${meta.risk.toLowerCase()}${action.type === type ? " is-selected" : ""}" data-builder-type="${type}"><span class="lab-library-mark">${meta.mark}</span><div><strong>${esc(meta.label)}</strong><small>${esc(meta.description)}</small></div><em>${esc(meta.risk)}</em></button>`).join("")}</div>
    </section>`;
  }

  function configureStep() {
    const action = builderState.action;
    const meta = typeMeta(action.type);
    return `<section class="lab-builder-section">
      <div class="lab-builder-title"><span>02</span><div><small>${esc(meta.mark)} CONFIGURATION</small><h3>Define the action</h3><p>Only fields relevant to ${esc(meta.label)} are shown.</p></div></div>
      <div class="lab-builder-form-grid">
        <label class="wide"><span>Action name</span><input data-builder-field="name" value="${esc(action.name)}" placeholder="e.g. Primary legal escalation" /></label>
        <label><span>Risk classification</span><select data-builder-field="risk">${RISKS.map(risk => `<option value="${risk}"${action.risk === risk ? " selected" : ""}>${risk}</option>`).join("")}</select></label>
        <div class="lab-builder-readonly"><span>Action family</span><strong>${esc(meta.label)}</strong><small>${esc(meta.description)}</small></div>
      </div>
      <div class="lab-type-config">${typeConfigFields(action)}</div>
    </section>`;
  }

  function typeConfigFields(action) {
    const c = action.config || {};
    if (action.type === "sms") return `<label><span>Message template</span><textarea data-config-field="message" placeholder="Write the SMS body…">${esc(c.message || "")}</textarea><small>Recipients come from linked People records.</small></label>`;
    if (action.type === "email") return `<div class="lab-builder-form-grid"><label><span>Email subject</span><input data-config-field="subject" value="${esc(c.subject || "")}" placeholder="Subject" /></label><label class="wide"><span>Email body</span><textarea data-config-field="body" placeholder="Write the message…">${esc(c.body || "")}</textarea><small>Documents linked in the next step can become attachments when the backend exists.</small></label></div>`;
    if (action.type === "social") return `<div class="lab-builder-form-grid"><label class="wide"><span>Post content</span><textarea data-config-field="content" placeholder="Write the post…">${esc(c.content || "")}</textarea></label><label><span>Audience note</span><input data-config-field="audience" value="${esc(c.audience || "")}" placeholder="e.g. Public, followers, private group" /></label></div>`;
    if (action.type === "ai") return `<div class="lab-builder-form-grid"><label class="wide"><span>Objective</span><input data-config-field="objective" value="${esc(c.objective || "")}" placeholder="What should the AI produce?" /></label><label class="wide"><span>Instructions</span><textarea data-config-field="instructions" placeholder="Approved instructions and boundaries…">${esc(c.instructions || "")}</textarea></label><label><span>AI permission mode</span><select data-config-field="aiMode"><option${(c.aiMode || "Generate output only") === "Generate output only" ? " selected" : ""}>Generate output only</option><option${c.aiMode === "Generate and save draft" ? " selected" : ""}>Generate and save draft</option></select></label><label><span>Output destination</span><input data-config-field="output" value="${esc(c.output || "Protected activity draft")}" placeholder="Protected activity draft" /></label></div>`;
    if (action.type === "organization_notice") return `<div class="lab-builder-form-grid"><label><span>Notice subject</span><input data-config-field="subject" value="${esc(c.subject || "")}" placeholder="Notice subject" /></label><label class="wide"><span>Notice body</span><textarea data-config-field="body" placeholder="Formal notice…">${esc(c.body || "")}</textarea></label></div>`;
    if (action.type === "publish") return `<div class="lab-builder-form-grid"><label><span>Release package</span><input data-config-field="packageName" value="${esc(c.packageName || "")}" placeholder="Package name" /></label><label class="wide"><span>Publication instructions</span><textarea data-config-field="instructions" placeholder="Where and how the backend should publish after approval…">${esc(c.instructions || "")}</textarea></label></div>`;
    if (action.type === "webhook") return `<div class="lab-builder-form-grid"><label><span>Mock endpoint</span><input data-config-field="endpoint" value="${esc(c.endpoint || "")}" placeholder="https://example.test/webhook" /></label><label><span>Method</span><select data-config-field="method">${["POST", "PUT", "PATCH"].map(method => `<option${(c.method || "POST") === method ? " selected" : ""}>${method}</option>`).join("")}</select></label><label class="wide"><span>Payload template</span><textarea data-config-field="body" placeholder='{"event":"contingency"}'>${esc(c.body || "")}</textarea><small>Lab never calls this URL.</small></label></div>`;
    if (action.type === "digital_account") return `<div class="lab-builder-form-grid"><label><span>Requested operation</span><select data-config-field="operation">${["Transfer access", "Disable account", "Archive account", "Rotate credentials (request)", "Custom account operation"].map(value => `<option${(c.operation || "Transfer access") === value ? " selected" : ""}>${value}</option>`).join("")}</select></label><label class="wide"><span>Operator instructions</span><textarea data-config-field="instructions" placeholder="Describe the approved account workflow…">${esc(c.instructions || "")}</textarea><small>Secrets are never stored here. Link the Digital Asset record instead.</small></label></div>`;
    if (action.type === "scheduled") return `<div class="lab-builder-form-grid"><label class="wide"><span>Task</span><input data-config-field="task" value="${esc(c.task || "")}" placeholder="What should run?" /></label><label class="wide"><span>Instructions</span><textarea data-config-field="instructions" placeholder="Task instructions…">${esc(c.instructions || "")}</textarea></label></div>`;
    return `<div class="lab-builder-form-grid"><label><span>Future handler name</span><input data-config-field="handler" value="${esc(c.handler || "")}" placeholder="e.g. custom.contingency.handler" /></label><label class="wide"><span>Instructions</span><textarea data-config-field="instructions" placeholder="Define the custom server-side action…">${esc(c.instructions || "")}</textarea><small>A custom handler must be explicitly registered and approved by the backend.</small></label></div>`;
  }

  function targetsStep() {
    const action = builderState.action;
    const meta = typeMeta(action.type);
    const selected = new Set((action.targets || []).map(target => `${target.kind}:${target.id}`));
    const groups = [
      ["People", "person", crm.people || []],
      ["Organizations", "organization", crm.organizations || []],
      ["Documents", "document", inventory.documents || []],
      ["Digital assets", "asset", inventory.assets || []]
    ];
    return `<section class="lab-builder-section">
      <div class="lab-builder-title"><span>03</span><div><small>STABLE RECORD REFERENCES</small><h3>Choose targets & context</h3><p>${esc(meta.targetHint)}</p></div></div>
      <label class="lab-target-search"><span class="sr-only">Search available records</span><input type="search" data-target-search placeholder="Search people, organizations, documents, assets…" /></label>
      <div class="lab-target-groups">${groups.map(([label, kind, records]) => `<section><div class="lab-target-group-head"><strong>${label}</strong><small>${records.length}</small></div><div class="lab-target-options">${records.map(record => {
        const id = record.id;
        const name = kind === "document" ? record.title : record.name;
        const secondary = kind === "person" ? (record.role || record.relationship) : kind === "organization" ? record.type : kind === "document" ? record.category : record.type;
        const key = `${kind}:${id}`;
        return `<label class="lab-target-option" data-target-search-value="${esc(`${name} ${secondary || ""}`.toLowerCase())}"><input type="checkbox" data-target-kind="${kind}" data-target-id="${esc(id)}" ${selected.has(key) ? "checked" : ""} /><span class="lab-target-check"></span><span><strong>${esc(name)}</strong><small>${esc(secondary || label.slice(0, -1))}</small></span><em>${kind === "person" ? "PER" : kind === "organization" ? "ORG" : kind === "document" ? "DOC" : "WEB"}</em></label>`;
      }).join("") || '<p class="lab-action-body-copy">No Lab records in this group.</p>'}</div></section>`).join("")}</div>
    </section>`;
  }

  function triggerStep() {
    const trigger = builderState.action.trigger || {};
    const modes = ["deadline", "grace_offset", "grace_expiry", "scheduled", "manual"];
    return `<section class="lab-builder-section">
      <div class="lab-builder-title"><span>04</span><div><small>EXECUTION ELIGIBILITY</small><h3>When can this action run?</h3><p>The 72-hour deadline and the extra 24-hour grace period are separate boundaries.</p></div></div>
      <div class="lab-trigger-layout">
        <div class="lab-trigger-options">${modes.map(mode => `<label class="lab-trigger-option${trigger.mode === mode ? " is-selected" : ""}"><input type="radio" name="builderTrigger" data-trigger-mode value="${mode}" ${trigger.mode === mode ? "checked" : ""} /><span><strong>${esc(TRIGGERS[mode].label)}</strong><small>${esc(TRIGGERS[mode].detail)}</small></span><em>${esc(TRIGGERS[mode].short)}</em></label>`).join("")}</div>
        <aside class="lab-trigger-preview">${builderTimelinePreview(builderState.action)}${triggerFields(trigger)}</aside>
      </div>
    </section>`;
  }

  function builderTimelinePreview(action) {
    const marker = markerPosition(action);
    if (["scheduled", "manual"].includes(action.trigger?.mode)) {
      return `<div class="lab-builder-calendar-preview"><span>${action.trigger.mode === "scheduled" ? "CAL" : "MAN"}</span><strong>${esc(triggerLabel(action))}</strong><small>${esc(TRIGGERS[action.trigger.mode].detail)}</small></div>`;
    }
    return `<div class="lab-builder-boundary-preview"><div class="lab-execution-line"><span class="lab-execution-base"></span><span class="lab-execution-grace"></span><i class="lab-execution-node start"></i><i class="lab-execution-node deadline"></i><i class="lab-execution-node final"></i>${marker !== null ? `<b class="lab-execution-marker risk-${builderState.action.risk.toLowerCase()}" style="left:${marker}%"><em>!</em></b>` : ""}<span class="lab-execution-label start">CHECK IN</span><span class="lab-execution-label deadline">72H</span><span class="lab-execution-label final">96H</span></div><p>Blue = 72-hour operating window. Red = 24-hour grace period.</p></div>`;
  }

  function triggerFields(trigger) {
    if (trigger.mode === "grace_offset") return `<label class="lab-trigger-field"><span>Hours after 72h deadline</span><input type="number" min="0" max="24" step="1" data-trigger-field="offsetHours" value="${Number(trigger.offsetHours || 0)}" /><small>0 = deadline. 24 = final grace expiration.</small></label>`;
    if (trigger.mode === "scheduled") {
      const localValue = trigger.at ? new Date(trigger.at).toISOString().slice(0, 16) : "";
      return `<label class="lab-trigger-field"><span>Date & time</span><input type="datetime-local" data-trigger-field="at" value="${esc(localValue)}" /></label><label class="lab-trigger-field"><span>Display timezone</span><input data-trigger-field="timezone" value="${esc(trigger.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC")}" /></label>`;
    }
    return `<div class="lab-trigger-field readonly"><span>Selected boundary</span><strong>${esc(TRIGGERS[trigger.mode]?.label || "Not set")}</strong><small>${esc(TRIGGERS[trigger.mode]?.detail || "")}</small></div>`;
  }

  function guardrailsStep() {
    const action = builderState.action;
    const g = action.guardrails || {};
    const destructive = action.risk === "Destructive";
    if (destructive) g.requireApproval = true;
    return `<section class="lab-builder-section">
      <div class="lab-builder-title"><span>05</span><div><small>SAFETY & FAILURE POLICY</small><h3>Set guardrails</h3><p>These become server-enforced policy later. The browser is never authoritative.</p></div></div>
      ${destructive ? '<div class="lab-destructive-warning"><b>!</b><span><strong>DESTRUCTIVE RISK</strong><small>Operator approval is mandatory for this Lab definition and should also be enforced by backend policy.</small></span></div>' : ""}
      <div class="lab-guardrail-options">
        <label><input type="checkbox" data-guardrail="oneTime" ${g.oneTime ? "checked" : ""} /><span><strong>Execute once</strong><small>Do not run the same action repeatedly for one switch incident.</small></span></label>
        <label><input type="checkbox" data-guardrail="requireOverdue" ${g.requireOverdue ? "checked" : ""} /><span><strong>Switch must still be overdue</strong><small>Cancel eligibility if a valid check-in returns the switch to Safe.</small></span></label>
        <label class="${destructive ? "is-locked" : ""}"><input type="checkbox" data-guardrail="requireApproval" ${g.requireApproval ? "checked" : ""} ${destructive ? "disabled" : ""} /><span><strong>Require operator approval</strong><small>Pause after eligibility until an authorized operator approves execution.</small></span>${destructive ? "<em>REQUIRED</em>" : ""}</label>
      </div>
      <div class="lab-builder-form-grid compact">
        <label><span>Retry attempts</span><select data-guardrail-field="retryCount">${[0, 1, 2, 3, 5].map(value => `<option value="${value}"${Number(g.retryCount || 0) === value ? " selected" : ""}>${value === 0 ? "No retries" : `${value} retries`}</option>`).join("")}</select></label>
        <label><span>Retry interval</span><select data-guardrail-field="retryIntervalMinutes">${[5, 15, 30, 60].map(value => `<option value="${value}"${Number(g.retryIntervalMinutes || 15) === value ? " selected" : ""}>${value} minutes</option>`).join("")}</select></label>
      </div>
      <div class="lab-phase-note"><span>PHASE 6</span><p>Conditional rules, dependencies, fallback channels, acknowledgement gates, and failure routing will plug into this policy layer next.</p></div>
    </section>`;
  }

  function reviewStep() {
    const action = builderState.action;
    const meta = typeMeta(action.type);
    const targets = (action.targets || []).map(stableTarget).filter(Boolean);
    const marker = markerPosition(action);
    return `<section class="lab-builder-section review">
      <div class="lab-builder-title"><span>06</span><div><small>FINAL REVIEW</small><h3>Review the directive</h3><p>Read the plain-language execution summary before saving this definition.</p></div></div>
      <div class="lab-review-hero risk-${action.risk.toLowerCase()}"><span class="lab-library-mark">${meta.mark}</span><div><small>${esc(meta.label.toUpperCase())} · ${esc(action.risk.toUpperCase())}</small><h4>${esc(action.name || "Unnamed action")}</h4><p>${esc(triggerLabel(action))}</p></div><b>LAB</b></div>
      <div class="lab-review-grid">
        <section><span>EXECUTION BOUNDARY</span>${executionTimeline(action, marker)}</section>
        <section><span>LINKED RECORDS</span><div class="lab-action-target-grid">${targets.length ? targets.map(targetChip).join("") : '<p class="lab-action-body-copy">No records linked.</p>'}</div></section>
        <section class="wide"><span>PLAIN-LANGUAGE SUMMARY</span><p class="lab-action-execution-summary">${esc(humanSummary(action))}</p></section>
        <section><span>CONFIGURATION</span>${configSummary(action)}</section>
        <section><span>GUARDRAILS</span>${guardrailSummary(action)}</section>
      </div>
      <div class="lab-review-warning"><b>!</b><span><strong>SIMULATION-ONLY DEFINITION</strong><small>Saving or enabling this action changes only local Lab data. No recipient, platform, AI service, API, account, or external system is contacted.</small></span></div>
    </section>`;
  }

  function captureBuilderFields() {
    if (!builderState) return;
    const action = builderState.action;
    const name = $("[data-builder-field='name']", builder);
    const risk = $("[data-builder-field='risk']", builder);
    if (name) action.name = name.value.trim();
    if (risk) action.risk = risk.value;

    $$("[data-config-field]", builder).forEach(input => {
      action.config[input.dataset.configField] = input.value;
    });

    const targetInputs = $$("[data-target-kind][data-target-id]", builder);
    if (targetInputs.length) {
      action.targets = targetInputs.filter(input => input.checked).map(input => ({ kind: input.dataset.targetKind, id: input.dataset.targetId }));
    }

    const triggerMode = $("[data-trigger-mode]:checked", builder);
    if (triggerMode) {
      action.trigger.mode = triggerMode.value;
      if (triggerMode.value === "deadline") action.trigger.offsetHours = 0;
      if (triggerMode.value === "grace_expiry") action.trigger.offsetHours = 24;
    }
    $$("[data-trigger-field]", builder).forEach(input => {
      const key = input.dataset.triggerField;
      if (key === "offsetHours") action.trigger[key] = Math.max(0, Math.min(24, Number(input.value || 0)));
      else if (key === "at") action.trigger[key] = input.value ? new Date(input.value).toISOString() : "";
      else action.trigger[key] = input.value.trim();
    });

    $$("[data-guardrail]", builder).forEach(input => {
      action.guardrails[input.dataset.guardrail] = input.checked;
    });
    $$("[data-guardrail-field]", builder).forEach(input => {
      action.guardrails[input.dataset.guardrailField] = Number(input.value);
    });
    if (action.risk === "Destructive") action.guardrails.requireApproval = true;
  }

  function validateCurrentStep() {
    const action = builderState.action;
    if (builderState.step === 1 && !action.name.trim()) {
      toast("Give the action a name first.");
      return false;
    }
    if (builderState.step === 3 && action.trigger.mode === "scheduled" && !action.trigger.at) {
      toast("Choose a date and time for the scheduled trigger.");
      return false;
    }
    return true;
  }

  function handleBuilderClick(event) {
    const type = event.target.closest("[data-builder-type]")?.dataset.builderType;
    if (type) {
      captureBuilderFields();
      builderState.action.type = type;
      builderState.action.risk = TYPE_META[type].risk;
      if (type === "scheduled") builderState.action.trigger.mode = "scheduled";
      if (type === "digital_account") builderState.action.guardrails.requireApproval = true;
      renderBuilder();
      return;
    }

    const stepButton = event.target.closest("[data-builder-step]");
    if (stepButton && !stepButton.disabled) {
      captureBuilderFields();
      builderState.step = Number(stepButton.dataset.builderStep);
      renderBuilder();
      return;
    }

    const command = event.target.closest("[data-builder-command]")?.dataset.builderCommand;
    if (!command) return;
    if (command === "close") {
      builder.close();
      builderState = null;
      return;
    }
    if (command === "back") {
      captureBuilderFields();
      builderState.step = Math.max(0, builderState.step - 1);
      renderBuilder();
      return;
    }
    if (command === "next") {
      captureBuilderFields();
      if (!validateCurrentStep()) return;
      builderState.step = Math.min(5, builderState.step + 1);
      renderBuilder();
      return;
    }
    if (command === "save-draft") return saveBuilder("Draft");
    if (command === "save-enabled") return saveBuilder("Enabled");
  }

  function handleBuilderInput(event) {
    if (event.target.matches("[data-target-search]")) {
      const query = event.target.value.trim().toLowerCase();
      $$("[data-target-search-value]", builder).forEach(option => {
        option.hidden = query && !option.dataset.targetSearchValue.includes(query);
      });
    }
  }

  function handleBuilderChange(event) {
    if (event.target.matches("[data-trigger-mode]")) {
      captureBuilderFields();
      builderState.action.trigger.mode = event.target.value;
      if (event.target.value === "deadline") builderState.action.trigger.offsetHours = 0;
      if (event.target.value === "grace_expiry") builderState.action.trigger.offsetHours = 24;
      renderBuilder();
    }
    if (event.target.matches("[data-builder-field='risk']")) {
      captureBuilderFields();
      renderBuilder();
    }
  }

  function saveBuilder(status) {
    captureBuilderFields();
    const action = builderState.action;
    if (!action.name.trim()) {
      builderState.step = 1;
      renderBuilder();
      toast("Action name is required.");
      return;
    }
    if (action.trigger.mode === "scheduled" && !action.trigger.at) {
      builderState.step = 3;
      renderBuilder();
      toast("Scheduled actions need a date and time.");
      return;
    }
    if (action.risk === "Destructive") action.guardrails.requireApproval = true;
    action.status = status;
    action.updatedAt = new Date().toISOString();
    const event = { title: builderState.editing ? "Action updated" : "Action created", detail: `${typeMeta(action.type).label} definition saved as ${status}.`, at: action.updatedAt };
    action.activity = [event, ...(action.activity || [])];

    const index = data.actions.findIndex(item => item.id === action.id);
    if (index >= 0) data.actions[index] = action;
    else data.actions.unshift(action);
    ui.selectedId = action.id;
    saveData("builder");
    builder.close();
    builderState = null;
    render();
    toast(status === "Enabled" ? "Action enabled in Lab." : "Draft action saved.");
  }

  function boot(attempt = 0) {
    if (!buildShell() && attempt < 12) {
      requestAnimationFrame(() => boot(attempt + 1));
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => boot(), { once: true });
  else boot();
})();
