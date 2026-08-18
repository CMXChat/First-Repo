(() => {
  "use strict";

  const STORAGE_KEY = "cmx-lab-automations-v1";
  const CRM_KEY = "cmx-lab-crm-v1";
  const INVENTORY_KEY = "cmx-lab-inventory-v1";
  const ACTIONS_KEY = "cmx-lab-actions-v1";
  const THEME_KEY = "cmx-lab-automations-theme-v1";
  const app = document.getElementById("automationApp");
  if (!app) return;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));
  const clone = value => JSON.parse(JSON.stringify(value));
  const now = () => new Date().toISOString();
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const makeId = (prefix = "auto") => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const TRIGGERS = [
    { id: "grace_start", label: "Grace begins", note: "Start when the switch enters its grace window.", mark: "GRACE" },
    { id: "grace_expiry", label: "Grace expires", note: "Start at the final grace boundary.", mark: "FINAL" },
    { id: "manual", label: "Manual start", note: "An authorized person starts it when needed.", mark: "MAN" },
    { id: "calendar", label: "Calendar time", note: "Start from a scheduled date or recurring calendar rule.", mark: "TIME" }
  ];

  const CONDITIONS = [
    { id: "not_acknowledged", label: "Check-in has not been acknowledged", short: "No acknowledgement", mark: "ACK" },
    { id: "switch_in_grace", label: "Switch is still in grace", short: "Still in grace", mark: "GRACE" },
    { id: "previous_failed", label: "An earlier action failed", short: "Action failed", mark: "FAIL" }
  ];

  const INLINE_ACTIONS = [
    { id: "notify", label: "Notify a person", group: "Communication", note: "Create a protected notification step.", mark: "NTF" },
    { id: "email", label: "Send email", group: "Communication", note: "Prepare an email step. Lab never sends it.", mark: "EML" },
    { id: "ai_task", label: "AI task", group: "Intelligence", note: "Run a bounded task using approved Lab records.", mark: "AI" },
    { id: "manual_review", label: "Manual review", group: "Control", note: "Require a human decision before continuing.", mark: "REV" }
  ];

  const OUTCOMES = [
    { id: "end", label: "End workflow", note: "Stop after the final action completes." },
    { id: "success", label: "Continue on success", note: "Leave the path ready for a future next step." },
    { id: "no_ack", label: "Escalate if not acknowledged", note: "Keep the escalation intent explicit." },
    { id: "review", label: "Require review", note: "Stop for approval before anything continues." }
  ];

  const STAGES = [
    { id: "trigger", label: "Trigger", short: "WHEN" },
    { id: "rules", label: "Rules", short: "IF" },
    { id: "actions", label: "Actions", short: "DO" },
    { id: "timing", label: "Timing", short: "WAIT" },
    { id: "review", label: "Review", short: "TEST" }
  ];

  const TIMEZONES = [...new Set([
    localZone, "UTC", "America/New_York", "America/Chicago", "America/Denver",
    "America/Los_Angeles", "Europe/London", "Pacific/Auckland"
  ])];

  const ACTION_LIBRARY_TYPE_LABELS = {
    sms: "SMS text", email: "Email", social: "Social post", ai: "AI task",
    organization_notice: "Organization notice", publish: "Publish / release",
    webhook: "Webhook / API", digital_account: "Digital account action",
    custom: "Custom action", scheduled: "Scheduled task"
  };

  const TEMPLATES = [
    {
      id: "missed-checkin", eyebrow: "CHECK IN", name: "Missed check-in escalation",
      description: "Grace expires, confirm no acknowledgement, notify the right person, then escalate.",
      trigger: "grace_expiry", conditions: [{ id: makeId("rule"), type: "not_acknowledged" }],
      actions: [{ id: makeId("step"), type: "notify", targetRef: null, targetLabel: "", content: "Ask the approved contact to acknowledge the missed check-in.", enabled: true }],
      timing: { mode: "none", delay: { days: 0, hours: 0, minutes: 0 }, at: { date: "", time: "", timezone: localZone } },
      repeatConfig: { mode: "none", every: 1, unit: "days", timezone: localZone }, outcome: "no_ack"
    },
    {
      id: "daily-briefing", eyebrow: "AI", name: "Daily briefing",
      description: "Start on a calendar schedule and prepare a bounded briefing for review.",
      trigger: "calendar", conditions: [],
      actions: [
        { id: makeId("step"), type: "ai_task", targetRef: null, targetLabel: "", content: "Prepare a concise briefing from approved records and flag anything that needs attention.", enabled: true },
        { id: makeId("step"), type: "manual_review", targetRef: null, targetLabel: "", content: "Review the briefing before any follow-up action.", enabled: true }
      ],
      timing: { mode: "none", delay: { days: 0, hours: 0, minutes: 0 }, at: { date: "", time: "", timezone: localZone } },
      repeatConfig: { mode: "daily", every: 1, unit: "days", timezone: localZone }, outcome: "review"
    },
    {
      id: "notify-later", eyebrow: "REMINDER", name: "Notify someone later",
      description: "Start manually, wait a precise amount of time, then notify a protected contact.",
      trigger: "manual", conditions: [],
      actions: [{ id: makeId("step"), type: "notify", targetRef: null, targetLabel: "", content: "Send the approved reminder or notification.", enabled: true }],
      timing: { mode: "delay", delay: { days: 0, hours: 6, minutes: 0 }, at: { date: "", time: "", timezone: localZone } },
      repeatConfig: { mode: "none", every: 1, unit: "days", timezone: localZone }, outcome: "end"
    },
    {
      id: "ai-report", eyebrow: "AI", name: "AI prepares report",
      description: "Run a bounded AI task, then route the output into a human review step.",
      trigger: "manual", conditions: [],
      actions: [
        { id: makeId("step"), type: "ai_task", targetRef: null, targetLabel: "", content: "Create the requested report using only approved linked records.", enabled: true },
        { id: makeId("step"), type: "manual_review", targetRef: null, targetLabel: "", content: "Review the generated report and decide what happens next.", enabled: true }
      ],
      timing: { mode: "none", delay: { days: 0, hours: 0, minutes: 0 }, at: { date: "", time: "", timezone: localZone } },
      repeatConfig: { mode: "none", every: 1, unit: "days", timezone: localZone }, outcome: "review"
    },
    {
      id: "emergency-contact", eyebrow: "ESCALATION", name: "Multi-step emergency contact",
      description: "Notify a primary contact, wait, then create a second escalation step.",
      trigger: "grace_expiry", conditions: [{ id: makeId("rule"), type: "not_acknowledged" }],
      actions: [
        { id: makeId("step"), type: "notify", targetRef: null, targetLabel: "Primary contact", content: "Send the first protected escalation notice.", enabled: true },
        { id: makeId("step"), type: "notify", targetRef: null, targetLabel: "Secondary contact", content: "Send the secondary escalation notice if the path still requires attention.", enabled: true }
      ],
      timing: { mode: "delay", delay: { days: 0, hours: 1, minutes: 0 }, at: { date: "", time: "", timezone: localZone } },
      repeatConfig: { mode: "until_ack", every: 1, unit: "hours", timezone: localZone }, outcome: "no_ack"
    }
  ];

  const state = { view: "dashboard", tab: "Draft", stage: 0, editing: null, saveTimer: null, dirty: false, picker: null, detailsOpen: false, flowOpen: false, simulation: null, simulationTimer: null, dragActionId: null };
  let data = loadData();

  function option(list, id) { return list.find(item => item.id === id) || list[0]; }
  function blankTiming() { return { mode: "none", delay: { days: 0, hours: 0, minutes: 0 }, at: { date: "", time: "", timezone: localZone } }; }
  function blankRepeat() { return { mode: "none", every: 1, unit: "days", timezone: localZone }; }
  function blankAction(type = "notify") { return { id: makeId("step"), type, targetRef: null, targetLabel: "", content: "", enabled: true }; }
  function blankAutomation() { return { id: makeId(), name: "", nameAuto: true, description: "", status: "Draft", trigger: "grace_start", condition: "none", conditions: [], ruleMode: "all", actions: [blankAction()], timing: blankTiming(), repeatConfig: blankRepeat(), outcome: "end", editorStage: 0, editorStep: 1, updatedAt: now() }; }

  function normalizeAction(action) {
    if (action?.type === "action_ref") return { id: action.id || makeId("step"), type: "action_ref", actionId: action.actionId || "", actionLabel: action.actionLabel || "Saved action", enabled: action.enabled !== false, targetRef: null, targetLabel: "", content: action.content || "" };
    return { ...blankAction(action?.type || "notify"), ...action, id: action?.id || makeId("step"), enabled: action?.enabled !== false };
  }

  function normalizeAutomation(item) {
    const draft = { ...blankAutomation(), ...item };
    draft.timing = item?.timing ? { ...blankTiming(), ...item.timing, delay: { ...blankTiming().delay, ...(item.timing.delay || {}) }, at: { ...blankTiming().at, ...(item.timing.at || {}) } } : legacyTiming(item?.wait);
    draft.repeatConfig = item?.repeatConfig ? { ...blankRepeat(), ...item.repeatConfig } : legacyRepeat(item?.repeat);
    draft.actions = Array.isArray(item?.actions) && item.actions.length ? item.actions.map(normalizeAction) : [normalizeAction({ type: item?.action || "notify", targetLabel: item?.target || "", content: item?.content || "" })];
    if (Array.isArray(item?.conditions)) draft.conditions = item.conditions.filter(rule => CONDITIONS.some(x => x.id === rule.type)).map(rule => ({ id: rule.id || makeId("rule"), type: rule.type }));
    else if (item?.condition && item.condition !== "none") draft.conditions = [{ id: makeId("rule"), type: item.condition }];
    else draft.conditions = [];
    draft.ruleMode = item?.ruleMode === "any" ? "any" : "all";
    draft.condition = draft.conditions[0]?.type || "none";
    draft.editorStage = Number.isInteger(item?.editorStage) ? Math.max(0, Math.min(4, item.editorStage)) : legacyStage(item?.editorStep);
    draft.editorStep = stageToLegacyStep(draft.editorStage);
    draft.nameAuto = typeof item?.nameAuto === "boolean" ? item.nameAuto : !String(item?.name || "").trim();
    if (draft.nameAuto) draft.name = generateName(draft);
    return draft;
  }

  function legacyTiming(wait) { const t = blankTiming(); if (wait === "1h") { t.mode = "delay"; t.delay.hours = 1; } if (wait === "6h") { t.mode = "delay"; t.delay.hours = 6; } if (wait === "24h") { t.mode = "delay"; t.delay.days = 1; } return t; }
  function legacyRepeat(repeat) { if (repeat === "daily") return { mode: "daily", every: 1, unit: "days", timezone: localZone }; if (repeat === "weekly") return { mode: "weekly", every: 1, unit: "weeks", timezone: localZone }; if (repeat === "until_ack") return { mode: "until_ack", every: 1, unit: "hours", timezone: localZone }; return blankRepeat(); }
  function legacyStage(step) { if (step === 2) return 1; if (step === 3) return 2; if (step === 4) return 3; if (step === 5 || step === 6) return 4; return 0; }
  function stageToLegacyStep(stage) { return [1, 2, 3, 4, 6][stage] ?? 1; }

  function seedData() {
    const a = normalizeAutomation({ id: "auto-grace-escalation", name: "Grace escalation", nameAuto: false, description: "Escalate a missed check in through an acknowledgement path.", status: "Draft", trigger: "grace_start", conditions: [{ id: "rule-grace-ack", type: "not_acknowledged" }], actions: [{ id: "step-grace-notify", type: "notify", targetRef: null, targetLabel: "Primary contact", content: "Ask the approved contact to acknowledge the contingency notice.", enabled: true }], timing: { mode: "delay", delay: { days: 0, hours: 6, minutes: 0 }, at: { date: "", time: "", timezone: localZone } }, repeatConfig: blankRepeat(), outcome: "no_ack", updatedAt: new Date(Date.now() - 42 * 60000).toISOString() });
    const b = normalizeAutomation({ id: "auto-briefing-draft", name: "Continuity briefing", nameAuto: false, description: "Prepare a bounded briefing from approved records for human review.", status: "Draft", trigger: "manual", actions: [{ id: "step-brief-ai", type: "ai_task", targetRef: null, targetLabel: "Approved continuity records", content: "Summarize approved records and flag missing information. Do not contact anyone.", enabled: true }], outcome: "review", updatedAt: new Date(Date.now() - 3 * 3600000).toISOString() });
    return { version: 1, automations: [a, b] };
  }

  function loadData() {
    try { const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (stored?.version === 1 && Array.isArray(stored.automations)) return { version: 1, automations: stored.automations.map(normalizeAutomation) }; } catch {}
    const seeded = seedData(); localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded)); return seeded;
  }

  function syncLegacy(item) {
    item.condition = item.conditions[0]?.type || "none";
    const first = item.actions.find(action => action.enabled !== false) || item.actions[0] || blankAction();
    if (first.type === "action_ref") { item.action = "manual_review"; item.target = first.actionLabel || "Saved action"; item.content = `Reusable Action reference: ${first.actionId}`; }
    else { item.action = first.type; item.target = first.targetLabel || ""; item.content = first.content || ""; }
    const d = item.timing.delay || {};
    item.wait = item.timing.mode === "delay" && Number(d.days) === 0 && Number(d.minutes) === 0 && [1, 6].includes(Number(d.hours)) ? `${d.hours}h` : item.timing.mode === "delay" && Number(d.days) === 1 && Number(d.hours) === 0 && Number(d.minutes) === 0 ? "24h" : "none";
    item.repeat = item.repeatConfig.mode === "daily" ? "daily" : item.repeatConfig.mode === "weekly" ? "weekly" : item.repeatConfig.mode === "until_ack" ? "until_ack" : "none";
    item.editorStep = stageToLegacyStep(item.editorStage || 0);
  }

  function persist({ announce = false } = {}) {
    clearTimeout(state.saveTimer); state.saveTimer = null;
    if (state.editing) {
      if (state.editing.nameAuto !== false) state.editing.name = generateName(state.editing);
      state.editing.updatedAt = now(); state.editing.editorStage = state.stage; syncLegacy(state.editing);
      const index = data.automations.findIndex(x => x.id === state.editing.id);
      if (index >= 0) data.automations[index] = clone(state.editing); else data.automations.unshift(clone(state.editing));
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); state.dirty = false; updateSaveState("Saved", "saved");
    window.dispatchEvent(new CustomEvent("cmx:lab-automations-updated")); if (announce) toast("Draft saved");
  }
  function scheduleAutosave() { state.dirty = true; updateSaveState("Saving…", "dirty"); clearTimeout(state.saveTimer); state.saveTimer = setTimeout(() => persist(), 450); }
  function updateSaveState(text, kind) { const node = document.querySelector("[data-v3-save-state]"); if (node) { node.textContent = text; node.dataset.state = kind || ""; } }

  function loadTargets() {
    const out = [];
    try { const crm = JSON.parse(localStorage.getItem(CRM_KEY)); (crm?.people || []).forEach(x => out.push({ kind: "person", id: x.id, label: x.name, meta: x.role || x.relationship || "Person" })); (crm?.organizations || []).forEach(x => out.push({ kind: "organization", id: x.id, label: x.name, meta: x.type || "Organization" })); } catch {}
    try { const inv = JSON.parse(localStorage.getItem(INVENTORY_KEY)); (inv?.documents || []).forEach(x => out.push({ kind: "document", id: x.id, label: x.title, meta: x.category || "Document" })); (inv?.assets || []).forEach(x => out.push({ kind: "asset", id: x.id, label: x.name, meta: x.type || "Digital asset" })); } catch {}
    return out;
  }
  function loadSavedActions() { try { const stored = JSON.parse(localStorage.getItem(ACTIONS_KEY)); if (stored?.version === 1 && Array.isArray(stored.actions)) return stored.actions; } catch {} return []; }
  function savedAction(actionId) { return loadSavedActions().find(action => action.id === actionId) || null; }
  function targetLabel(ref) { return loadTargets().find(target => target.kind === ref?.kind && target.id === ref?.id)?.label || ""; }

  function generateName(item) {
    const trigger = option(TRIGGERS, item?.trigger || "grace_start")?.label || "Automation";
    const first = (item?.actions || []).find(action => action.enabled !== false) || item?.actions?.[0];
    let action = "workflow";
    if (first?.type === "action_ref") action = first.actionLabel || savedAction(first.actionId)?.name || "saved action";
    else if (first) action = option(INLINE_ACTIONS, first.type)?.label || "workflow";
    return `${trigger.replace(/^Manual start$/, "Manual")} → ${action}`.slice(0, 80);
  }
  function relativeTime(iso) { const age = Math.max(0, Date.now() - new Date(iso).getTime()); if (age < 60000) return "just now"; if (age < 3600000) return `${Math.floor(age / 60000)}m ago`; if (age < 86400000) return `${Math.floor(age / 3600000)}h ago`; return `${Math.floor(age / 86400000)}d ago`; }

  function applyTheme(theme) { const next = theme === "light" ? "light" : "dark"; document.documentElement.dataset.theme = next; localStorage.setItem(THEME_KEY, next); document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "light" ? "#f5f8fb" : "#030509"); renderThemeLabel(); }
  function renderThemeLabel() { const node = document.querySelector("[data-v3-theme-label]"); if (node) node.textContent = document.documentElement.dataset.theme === "light" ? "Dark" : "Light"; }
  function shell(content) { return `<header class="v3-topbar"><a class="brand v3-brand" href="/lab/#lab=view%3Aactions" aria-label="Back to Check In Lab Actions"><span class="brand-mark"></span><span class="brand-copy"><strong>CHECK IN</strong><small>LAB · AUTOMATIONS</small></span></a><div class="v3-top-actions"><span class="v3-lab-pill"><i></i> LAB · SIMULATION ONLY</span><button class="v3-theme" type="button" data-v3-theme><span data-v3-theme-label>Light</span></button></div></header>${content}`; }

  function actionLabel(action) { if (action.type === "action_ref") return action.actionLabel || savedAction(action.actionId)?.name || "Saved action"; return option(INLINE_ACTIONS, action.type)?.label || "Action"; }
  function timingLabel(item) { const t = item.timing || blankTiming(); if (t.mode === "none") return "Immediately"; if (t.mode === "exact") return !t.at?.date || !t.at?.time ? "Exact time not set" : `${t.at.date} · ${t.at.time}`; const p = []; if (Number(t.delay?.days)) p.push(`${t.delay.days}d`); if (Number(t.delay?.hours)) p.push(`${t.delay.hours}h`); if (Number(t.delay?.minutes)) p.push(`${t.delay.minutes}m`); return p.length ? `Wait ${p.join(" ")}` : "Custom delay"; }
  function repeatLabel(item) { const r = item.repeatConfig || blankRepeat(); if (r.mode === "none") return "No repeat"; if (r.mode === "daily") return `Daily · ${r.timezone || localZone}`; if (r.mode === "weekly") return `Weekly · ${r.timezone || localZone}`; if (r.mode === "until_ack") return "Until acknowledged"; return `Every ${r.every || 1} ${r.unit || "days"}`; }
  function compactSentence(item) { const rules = item.conditions.length ? item.conditions.map(rule => option(CONDITIONS, rule.type).short).join(item.ruleMode === "any" ? " OR " : " AND ") : "Always continue"; const actions = item.actions.filter(action => action.enabled !== false).map(actionLabel).join(" → ") || "No enabled actions"; return `${option(TRIGGERS, item.trigger).label} → ${rules} → ${actions} → ${timingLabel(item)} → ${option(OUTCOMES, item.outcome).label}`; }

  function renderDashboard() {
    stopSimulation(); state.view = "dashboard"; state.editing = null; state.picker = null; state.detailsOpen = false;
    const counts = { Draft: 0, Published: 0, Archived: 0 }; data.automations.forEach(item => { counts[item.status] = (counts[item.status] || 0) + 1; });
    const visible = data.automations.filter(item => item.status === state.tab);
    app.innerHTML = shell(`<main class="v3-dashboard"><section class="v3-hero"><div><span class="v3-eyebrow">AUTOMATION WORKSPACE</span><h1>Build the flow.<br><em>Read it like a sentence.</em></h1><p>Choose what starts it, add only the rules you need, stack the actions, set timing, then simulate the whole path before anything ever leaves Lab.</p></div><button class="v3-primary" type="button" data-new>＋ New automation</button></section>
      <section class="v3-template-section"><div class="v3-section-title"><div><span>QUICK START</span><h2>Start with a template</h2></div><small>Editable after you open it</small></div><div class="v3-template-strip">${TEMPLATES.map(t => `<button class="v3-template" type="button" data-template="${esc(t.id)}"><span>${esc(t.eyebrow)}</span><strong>${esc(t.name)}</strong><small>${esc(t.description)}</small><b>Use template →</b></button>`).join("")}</div></section>
      <section class="v3-dashboard-bar"><div class="v3-tabs">${["Draft", "Published", "Archived"].map(tab => `<button type="button" class="${state.tab === tab ? "is-active" : ""}" data-tab="${tab}">${tab}s <b>${counts[tab] || 0}</b></button>`).join("")}</div><div class="v3-connection"><i></i><span>Lab records connected</span><small>Execution off</small></div></section>
      <section class="v3-drafts">${visible.length ? visible.map(renderAutomationCard).join("") : `<div class="v3-empty"><strong>No ${esc(state.tab.toLowerCase())} automations</strong><span>${state.tab === "Draft" ? "Start from a blank flow or template." : "Lifecycle remains a Lab preview."}</span></div>`}</section></main>`);
    bindDashboard(); bindShell(); renderThemeLabel(); document.documentElement.dataset.labAutomationsExperience = "v3";
  }

  function renderAutomationCard(item) { const enabled = item.actions.filter(a => a.enabled !== false); return `<button class="v3-automation-card" type="button" data-open="${esc(item.id)}"><span class="v3-card-head"><span><small>${esc(item.status.toUpperCase())}</small><strong>${esc(item.name || generateName(item))}</strong></span><em>${enabled.length} action${enabled.length === 1 ? "" : "s"}</em></span><p>${esc(item.description || compactSentence(item))}</p>${renderMiniFlow(item)}<span class="v3-card-foot"><b>${esc(timingLabel(item))}</b><small>Updated ${esc(relativeTime(item.updatedAt))}</small></span></button>`; }
  function renderMiniFlow(item) { const first = item.actions.find(a => a.enabled !== false); const count = item.actions.filter(a => a.enabled !== false).length; return `<span class="v3-mini-flow"><span><i>WHEN</i><b>${esc(option(TRIGGERS, item.trigger).label)}</b></span><u></u><span><i>IF</i><b>${item.conditions.length ? `${item.conditions.length} rule${item.conditions.length === 1 ? "" : "s"}` : "No rule"}</b></span><u></u><span><i>DO</i><b>${esc(first ? actionLabel(first) : "No action")}${count > 1 ? ` +${count - 1}` : ""}</b></span></span>`; }
  function bindDashboard() { document.querySelector("[data-new]")?.addEventListener("click", () => openEditor(null)); document.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => openEditor(b.dataset.open))); document.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => { state.tab = b.dataset.tab; renderDashboard(); })); document.querySelectorAll("[data-template]").forEach(b => b.addEventListener("click", () => createFromTemplate(b.dataset.template))); }
  function createFromTemplate(id) { const template = TEMPLATES.find(t => t.id === id); if (!template) return; const item = normalizeAutomation({ ...clone(template), id: makeId(), status: "Draft", updatedAt: now(), editorStage: 0, nameAuto: false }); data.automations.unshift(item); localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); openEditor(item.id); }
  function openEditor(id) { const found = data.automations.find(item => item.id === id); state.editing = normalizeAutomation(clone(found || blankAutomation())); state.stage = state.editing.editorStage || 0; state.view = "editor"; state.dirty = false; state.picker = null; state.detailsOpen = false; renderEditor(); }

  function renderEditor({ preserveScroll = false } = {}) {
    const item = state.editing; if (!item) return renderDashboard(); const scrollY = preserveScroll ? window.scrollY : 0; state.view = "editor"; item.editorStage = state.stage; if (item.nameAuto !== false) item.name = generateName(item); const stage = STAGES[state.stage];
    app.innerHTML = shell(`<main class="v3-editor-page"><header class="v3-editor-head"><div class="v3-editor-title-row"><button class="v3-close" type="button" data-close aria-label="Close automation">←</button><button class="v3-title-button" type="button" data-details><span>AUTOMATION DRAFT</span><strong>${esc(item.name || generateName(item))}</strong><small><b data-v3-save-state data-state="saved">Saved</b> · Edit details</small></button><button class="v3-save" type="button" data-save>Save</button></div><nav class="v3-stage-rail">${STAGES.map((entry, index) => `<button type="button" class="${index === state.stage ? "is-current" : ""} ${index < state.stage ? "is-complete" : ""}" data-stage="${index}"><b>${index < state.stage ? "✓" : String(index + 1).padStart(2, "0")}</b><span><small>${entry.short}</small><strong>${entry.label}</strong></span></button>`).join("")}</nav></header>
      <div class="v3-editor-shell"><section class="v3-editor-main"><button class="v3-mobile-flow-toggle" type="button" data-flow-toggle aria-expanded="${state.flowOpen}"><span><small>LIVE FLOW</small><strong>${esc(compactSentence(item))}</strong></span><b>${state.flowOpen ? "−" : "+"}</b></button>${state.flowOpen ? `<div class="v3-mobile-flow">${renderFlow(item, true)}</div>` : ""}<div class="v3-step-context"><span>${stage.short}</span><small>Step ${state.stage + 1} of ${STAGES.length}</small></div>${renderStage(item)}</section><aside class="v3-live-panel"><div class="v3-live-head"><span>LIVE FLOW</span><small>Updates as you build</small></div>${renderFlow(item)}<div class="v3-live-summary"><span>READABLE VERSION</span><p>${esc(compactSentence(item))}</p></div></aside></div>
      <footer class="v3-editor-footer"><div><button class="v3-footer-secondary" type="button" data-back ${state.stage === 0 ? "disabled" : ""}>Back</button><button class="v3-footer-primary" type="button" data-next>${state.stage === 4 ? "Done" : "Continue"}</button></div></footer>${state.detailsOpen ? renderDetailsModal(item) : ""}${state.picker ? renderPicker() : ""}</main>`);
    bindShell(); bindEditor(); renderThemeLabel(); document.documentElement.dataset.labAutomationsExperience = "v3"; requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "instant" }));
  }

  function renderStage(item) { if (state.stage === 0) return renderTrigger(item); if (state.stage === 1) return renderRules(item); if (state.stage === 2) return renderActions(item); if (state.stage === 3) return renderTiming(item); return renderReview(item); }
  function renderTrigger(item) { return `<section class="v3-stage-section"><header><span>WHEN</span><h2>What should start this?</h2><p>Pick the event. The Automation name updates automatically while you build.</p></header><div class="v3-choice-grid">${TRIGGERS.map(t => `<button type="button" class="v3-choice ${item.trigger === t.id ? "is-selected" : ""}" data-trigger="${esc(t.id)}"><b>${esc(t.mark)}</b><span><strong>${esc(t.label)}</strong><small>${esc(t.note)}</small></span><i>${item.trigger === t.id ? "✓" : ""}</i></button>`).join("")}</div>${item.trigger === "calendar" ? `<div class="v3-info-card"><span>CALENDAR TRIGGER</span><strong>Set the cadence in Timing.</strong><p>Keeping the schedule in one place makes the flow easier to scan and edit.</p></div>` : ""}</section>`; }

  function renderRules(item) {
    const unused = CONDITIONS.filter(c => !item.conditions.some(r => r.type === c.id));
    return `<section class="v3-stage-section"><header><span>IF</span><h2>Only continue when…</h2><p>Most Automations need zero or one rule. Add more only when the logic actually needs it.</p></header>${item.conditions.length === 0 ? `<div class="v3-always-card"><b>✓</b><span><strong>Always continue</strong><small>The trigger is enough. No extra condition is blocking this path.</small></span></div>` : `<div class="v3-rule-mode"><span>When there are multiple rules:</span><div><button type="button" class="${item.ruleMode === "all" ? "is-selected" : ""}" data-rule-mode="all">Match all · AND</button><button type="button" class="${item.ruleMode === "any" ? "is-selected" : ""}" data-rule-mode="any">Match any · OR</button></div></div><div class="v3-rule-stack">${item.conditions.map((rule, index) => { const c = option(CONDITIONS, rule.type); return `<article class="v3-rule-card"><span class="v3-rule-join">${index === 0 ? "IF" : item.ruleMode === "any" ? "OR" : "AND"}</span><b>${esc(c.mark)}</b><span><strong>${esc(c.label)}</strong><small>Continue only while this is true.</small></span><button type="button" data-remove-rule="${esc(rule.id)}">×</button></article>`; }).join("")}</div>`}${unused.length ? `<div class="v3-add-rule"><span>Add a rule</span>${unused.map(c => `<button type="button" data-add-rule="${esc(c.id)}">＋ ${esc(c.short)}</button>`).join("")}</div>` : ""}</section>`;
  }

  function renderActions(item) { return `<section class="v3-stage-section v3-actions-stage"><header><span>DO</span><h2>Build the action stack.</h2><p>Actions run top to bottom in the prototype. Reorder, duplicate, pause, or replace any step.</p></header><div class="v3-action-stack">${item.actions.map((a, i) => renderActionCard(a, i, item.actions.length)).join("")}</div><button class="v3-add-action" type="button" data-add-action><b>＋</b><span><strong>Add action</strong><small>Inline action or reusable Lab Action</small></span></button></section>`; }
  function renderActionCard(action, index, total) {
    const saved = action.type === "action_ref" ? savedAction(action.actionId) : null; const label = actionLabel(action); const meta = action.type === "action_ref" ? `${ACTION_LIBRARY_TYPE_LABELS[saved?.type] || saved?.type || "Saved Action"}${saved?.risk ? ` · ${saved.risk}` : ""}` : option(INLINE_ACTIONS, action.type)?.group || "Action";
    return `<article class="v3-action-card ${action.enabled === false ? "is-disabled" : ""}" draggable="true" data-action-card="${esc(action.id)}"><div class="v3-action-rail"><span>${String(index + 1).padStart(2, "0")}</span><i></i></div><div class="v3-action-body"><header><button class="v3-action-type" type="button" data-pick-action-type="${esc(action.id)}"><small>${action.type === "action_ref" ? "SAVED ACTION" : esc(meta.toUpperCase())}</small><strong>${esc(label)}</strong></button><div class="v3-action-controls"><button type="button" data-move-up="${esc(action.id)}" ${index === 0 ? "disabled" : ""}>↑</button><button type="button" data-move-down="${esc(action.id)}" ${index === total - 1 ? "disabled" : ""}>↓</button><button type="button" data-duplicate-action="${esc(action.id)}">⧉</button><button type="button" data-toggle-action="${esc(action.id)}">${action.enabled === false ? "▶" : "Ⅱ"}</button><button type="button" data-remove-action="${esc(action.id)}" ${total === 1 ? "disabled" : ""}>×</button></div></header>${action.type === "action_ref" ? renderSavedActionBody(action, saved) : renderInlineActionBody(action)}</div></article>`;
  }
  function renderInlineActionBody(action) { const target = action.targetRef ? targetLabel(action.targetRef) : action.targetLabel; return `<div class="v3-action-fields"><button class="v3-target-button" type="button" data-pick-target="${esc(action.id)}"><span>TARGET</span><strong>${esc(target || "Choose protected target")}</strong><b>Change</b></button><label><span>Instruction</span><textarea data-action-content="${esc(action.id)}" placeholder="Describe exactly what this step should do.">${esc(action.content || "")}</textarea></label></div>`; }
  function renderSavedActionBody(action, saved) { return `<div class="v3-saved-action-body"><div><span>REFERENCE</span><strong>${esc(action.actionId || "Missing Action ID")}</strong></div><div><span>TYPE</span><strong>${esc(ACTION_LIBRARY_TYPE_LABELS[saved?.type] || saved?.type || "Unknown")}</strong></div><div><span>STATUS</span><strong>${esc(saved?.status || "Unavailable")}</strong></div><p>${saved ? "This Automation stores a reference to the reusable Lab Action. It does not silently convert its type." : "This saved Action is no longer available in the local Action library."}</p><a href="/lab/#lab=view%3Aactions">Open Action library →</a></div>`; }

  function renderTiming(item) {
    const t = item.timing, r = item.repeatConfig;
    return `<section class="v3-stage-section"><header><span>WAIT</span><h2>Place the actions on the timeline.</h2><p>Set the delay or exact time, then decide whether this path repeats.</p></header><div class="v3-timeline-preview"><span class="v3-time-dot is-start"><i></i><b>TRIGGER</b><small>${esc(option(TRIGGERS, item.trigger).label)}</small></span><u class="${t.mode !== "none" ? "has-wait" : ""}"><em>${esc(timingLabel(item))}</em></u><span class="v3-time-dot is-action"><i></i><b>ACTIONS</b><small>${item.actions.filter(a => a.enabled !== false).length} enabled</small></span>${r.mode !== "none" ? `<u class="has-repeat"><em>${esc(repeatLabel(item))}</em></u><span class="v3-time-dot is-repeat"><i></i><b>REPEAT</b><small>Cadence loop</small></span>` : ""}</div>
      <div class="v3-timing-modes">${[["none", "Immediate", "Continue with no wait"], ["delay", "Delay", "Wait an exact duration"], ["exact", "Exact time", "Wait until a date and minute"]].map(([mode, label, note]) => `<button type="button" class="${t.mode === mode ? "is-selected" : ""}" data-timing-mode="${mode}"><strong>${label}</strong><small>${note}</small><i>${t.mode === mode ? "✓" : ""}</i></button>`).join("")}</div>
      ${t.mode === "delay" ? `<article class="v3-precision-card"><div class="v3-precision-head"><span><small>DELAY</small><strong>${esc(timingLabel(item))}</strong></span><div>${["15m", "1h", "6h", "24h"].map(p => `<button type="button" data-delay-preset="${p}">${p}</button>`).join("")}</div></div><div class="v3-duration-grid">${numberField("Days", "days", t.delay.days, 365)}${numberField("Hours", "hours", t.delay.hours, 23)}${numberField("Minutes", "minutes", t.delay.minutes, 59)}</div></article>` : ""}
      ${t.mode === "exact" ? `<article class="v3-precision-card"><div class="v3-exact-grid"><label><span>Date</span><input type="date" data-exact-date value="${esc(t.at.date || "")}"></label><label><span>Time</span><input type="time" step="60" data-exact-time value="${esc(t.at.time || "")}"></label><label><span>Timezone</span><select data-exact-zone>${TIMEZONES.map(z => `<option value="${esc(z)}" ${t.at.timezone === z ? "selected" : ""}>${esc(z)}${z === localZone ? " (device)" : ""}</option>`).join("")}</select></label></div></article>` : ""}
      <article class="v3-repeat-card"><div><span>REPEAT</span><strong>${esc(repeatLabel(item))}</strong></div><div class="v3-repeat-pills">${[["none", "No repeat"], ["daily", "Daily"], ["weekly", "Weekly"], ["custom", "Custom"], ["until_ack", "Until acknowledged"]].map(([mode, label]) => `<button type="button" class="${r.mode === mode ? "is-selected" : ""}" data-repeat-mode="${mode}">${label}</button>`).join("")}</div>${r.mode === "custom" ? `<div class="v3-custom-repeat"><label><span>Every</span><input type="number" min="1" max="999" data-repeat-every value="${Number(r.every) || 1}"></label><label><span>Unit</span><select data-repeat-unit>${["minutes", "hours", "days", "weeks", "months", "years"].map(u => `<option value="${u}" ${r.unit === u ? "selected" : ""}>${u}</option>`).join("")}</select></label></div>` : ""}${["daily", "weekly", "custom"].includes(r.mode) && !["minutes", "hours"].includes(r.unit) ? `<label class="v3-repeat-zone"><span>Calendar timezone</span><select data-repeat-zone>${TIMEZONES.map(z => `<option value="${esc(z)}" ${r.timezone === z ? "selected" : ""}>${esc(z)}${z === localZone ? " (device)" : ""}</option>`).join("")}</select></label>` : ""}</article></section>`;
  }
  function numberField(label, key, value, max) { return `<label><span>${label}</span><input type="number" min="0" max="${max}" inputmode="numeric" value="${Number(value) || 0}" data-delay-field="${key}"></label>`; }

  function renderReview(item) {
    const issues = validationIssues(item), nodes = simulationNodes(item), sim = state.simulation;
    return `<section class="v3-stage-section v3-review-stage"><header><span>TEST</span><h2>Simulate the Automation.</h2><p>Read the complete flow, change the finish behavior, then run a safe visual test. Nothing executes outside this page.</p></header><div class="v3-review-grid"><article class="v3-review-flow"><div class="v3-review-heading"><span><small>WORKFLOW</small><strong>${esc(item.name)}</strong></span><em>${issues.length ? `${issues.length} thing${issues.length === 1 ? "" : "s"} to review` : "Ready to simulate"}</em></div><div class="v3-simulation-flow">${nodes.map((node, index) => `<div class="v3-sim-node ${sim?.running && sim.index === index ? "is-running" : ""} ${sim && index < sim.index ? "is-complete" : ""}"><b>${esc(node.key)}</b><span><strong>${esc(node.title)}</strong><small>${esc(node.detail)}</small></span><i>${sim && index < sim.index ? "✓" : sim?.running && sim.index === index ? "●" : ""}</i></div>${index < nodes.length - 1 ? `<u></u>` : ""}`).join("")}</div>${sim ? `<div class="v3-sim-log"><span>SIMULATION LOG</span>${sim.log.map(line => `<p>${esc(line)}</p>`).join("")}${sim.done ? `<strong>✓ Simulation complete. No external action ran.</strong>` : ""}</div>` : ""}</article><aside class="v3-review-side"><div class="v3-finish-card"><span>FINISH</span><h3>What happens at the end?</h3><div>${OUTCOMES.map(o => `<button type="button" class="${item.outcome === o.id ? "is-selected" : ""}" data-outcome="${o.id}"><strong>${esc(o.label)}</strong><small>${esc(o.note)}</small></button>`).join("")}</div></div><div class="v3-check-card"><span>PRE-FLIGHT</span>${issues.length ? issues.map(issue => `<p><i>!</i>${esc(issue)}</p>`).join("") : `<p class="is-good"><i>✓</i>No blocking setup issues found in this Lab draft.</p>`}</div><button class="v3-simulate" type="button" data-simulate ${sim?.running ? "disabled" : ""}>${sim?.running ? "Simulation running…" : sim?.done ? "Run simulation again" : "▶ Run simulation"}</button><button class="v3-done" type="button" data-save-close>Save draft & close</button></aside></div></section>`;
  }

  function validationIssues(item) { const issues = []; if (!item.actions.some(a => a.enabled !== false)) issues.push("Enable at least one action."); if (item.timing.mode === "exact" && (!item.timing.at.date || !item.timing.at.time)) issues.push("Finish the exact date and time."); item.actions.forEach(a => { if (a.enabled === false) return; if (a.type === "action_ref") { if (!a.actionId || !savedAction(a.actionId)) issues.push(`Saved Action “${a.actionLabel || "Unknown"}” is unavailable.`); return; } if (["notify", "email"].includes(a.type) && !a.targetRef && !a.targetLabel) issues.push(`${actionLabel(a)} needs a target.`); if (a.type === "ai_task" && !String(a.content || "").trim()) issues.push("AI task needs an instruction."); }); return [...new Set(issues)]; }
  function simulationNodes(item) { const nodes = [{ key: "WHEN", title: option(TRIGGERS, item.trigger).label, detail: "Trigger becomes eligible" }, { key: "IF", title: item.conditions.length ? `${item.conditions.length} rule${item.conditions.length === 1 ? "" : "s"} checked` : "No extra rule", detail: item.conditions.length ? item.conditions.map(rule => option(CONDITIONS, rule.type).short).join(item.ruleMode === "any" ? " OR " : " AND ") : "Continue" }]; item.actions.filter(a => a.enabled !== false).forEach((a, i) => nodes.push({ key: `DO ${i + 1}`, title: actionLabel(a), detail: a.type === "action_ref" ? "Resolve reusable Action reference" : a.targetLabel || targetLabel(a.targetRef) || "Protected step" })); if (item.timing.mode !== "none") nodes.push({ key: "WAIT", title: timingLabel(item), detail: "Scheduler boundary preview" }); if (item.repeatConfig.mode !== "none") nodes.push({ key: "REPEAT", title: repeatLabel(item), detail: "Cadence preview" }); nodes.push({ key: "FINISH", title: option(OUTCOMES, item.outcome).label, detail: "End-state preview" }); return nodes; }
  function renderFlow(item, compact = false) { const actions = item.actions.filter(a => a.enabled !== false); const nodes = [{ tone: "when", key: "WHEN", title: option(TRIGGERS, item.trigger).label, detail: "Starts the flow" }, { tone: "if", key: "IF", title: item.conditions.length ? item.conditions.map(rule => option(CONDITIONS, rule.type).short).join(item.ruleMode === "any" ? " OR " : " AND ") : "Always continue", detail: item.conditions.length ? `${item.conditions.length} active rule${item.conditions.length === 1 ? "" : "s"}` : "No extra rule" }, ...actions.map((a, i) => ({ tone: "do", key: `DO ${String(i + 1).padStart(2, "0")}`, title: actionLabel(a), detail: a.type === "action_ref" ? "Reusable Action" : a.targetLabel || targetLabel(a.targetRef) || "Set target / instruction" })), { tone: "wait", key: "WAIT", title: timingLabel(item), detail: repeatLabel(item) }, { tone: "finish", key: "FINISH", title: option(OUTCOMES, item.outcome).label, detail: "End of this path" }]; return `<div class="v3-flow ${compact ? "is-compact" : ""}">${nodes.map((n, i) => `<div class="v3-flow-node tone-${n.tone}"><span>${esc(n.key)}</span><div><strong>${esc(n.title)}</strong><small>${esc(n.detail)}</small></div></div>${i < nodes.length - 1 ? `<i class="v3-flow-line"></i>` : ""}`).join("")}</div>`; }

  function renderDetailsModal(item) { return `<div class="v3-modal-backdrop" data-modal-close><section class="v3-modal v3-details-modal" role="dialog" aria-modal="true" data-modal-panel><header><div><span>DETAILS</span><h2>Automation details</h2></div><button type="button" data-modal-close>×</button></header><label><span>Name</span><input data-details-name maxlength="80" value="${esc(item.name)}"></label><label><span>Description</span><textarea data-details-description maxlength="240" placeholder="What is this Automation for?">${esc(item.description || "")}</textarea></label><button class="v3-auto-name" type="button" data-auto-name>↻ Use automatic name <small>${esc(generateName(item))}</small></button><footer><button type="button" data-modal-close>Cancel</button><button type="button" data-details-save>Save details</button></footer></section></div>`; }
  function renderPicker() { const p = state.picker; if (!p) return ""; if (p.kind === "target") return renderTargetPicker(); const saved = loadSavedActions(); const groups = [...new Set(INLINE_ACTIONS.map(a => a.group))]; return `<div class="v3-modal-backdrop" data-picker-close><section class="v3-modal v3-picker" role="dialog" aria-modal="true" data-modal-panel><header><div><span>ACTION PICKER</span><h2>${p.replaceId ? "Replace action" : "Add an action"}</h2></div><button type="button" data-picker-close>×</button></header><label class="v3-picker-search"><span>Search</span><input type="search" data-picker-search placeholder="Email, AI, saved action…"></label><div class="v3-picker-scroll" data-picker-results>${groups.map(group => `<section><h3>${esc(group)}</h3>${INLINE_ACTIONS.filter(a => a.group === group).map(a => `<button type="button" data-choose-inline="${esc(a.id)}"><b>${esc(a.mark)}</b><span><strong>${esc(a.label)}</strong><small>${esc(a.note)}</small></span><i>＋</i></button>`).join("")}</section>`).join("")}<section class="v3-saved-picker"><h3>Reusable Lab Actions <span>${saved.length}</span></h3>${saved.length ? saved.map(a => `<button type="button" data-choose-saved="${esc(a.id)}"><b>${esc(String(a.type || "ACT").slice(0, 3).toUpperCase())}</b><span><strong>${esc(a.name || "Untitled Action")}</strong><small>${esc(ACTION_LIBRARY_TYPE_LABELS[a.type] || a.type || "Action")} · ${esc(a.risk || "")}${a.status ? ` · ${esc(a.status)}` : ""}</small></span><i>↗</i></button>`).join("") : `<div class="v3-picker-empty"><strong>No saved Actions yet</strong><span>Create them in the main Lab Action library.</span><a href="/lab/#lab=view%3Aactions">Open Action library</a></div>`}</section></div></section></div>`; }
  function renderTargetPicker() { const targets = loadTargets(); return `<div class="v3-modal-backdrop" data-picker-close><section class="v3-modal v3-picker" role="dialog" aria-modal="true" data-modal-panel><header><div><span>PROTECTED TARGET</span><h2>Choose a Lab record</h2></div><button type="button" data-picker-close>×</button></header><label class="v3-picker-search"><span>Search</span><input type="search" data-picker-search placeholder="Person, organization, document…"></label><div class="v3-picker-scroll" data-picker-results>${targets.length ? ["person", "organization", "document", "asset"].map(kind => { const subset = targets.filter(t => t.kind === kind); if (!subset.length) return ""; return `<section><h3>${esc(kind === "asset" ? "Digital assets" : `${kind}s`)}</h3>${subset.map(t => `<button type="button" data-choose-target="${esc(kind)}:${esc(t.id)}"><b>${esc(kind.slice(0, 3).toUpperCase())}</b><span><strong>${esc(t.label)}</strong><small>${esc(t.meta)}</small></span><i>＋</i></button>`).join("")}</section>`; }).join("") : `<div class="v3-picker-empty"><strong>No protected Lab targets yet</strong><span>Add People, Organizations, Documents, or Digital Assets in the main Lab.</span><a href="/lab/#lab=view%3Aactions">Open Lab</a></div>`}</div></section></div>`; }

  function bindShell() { document.querySelector("[data-v3-theme]")?.addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light")); }
  function bindEditor() {
    document.querySelector("[data-close]")?.addEventListener("click", () => { persist(); renderDashboard(); }); document.querySelector("[data-save]")?.addEventListener("click", () => persist({ announce: true })); document.querySelector("[data-details]")?.addEventListener("click", () => { state.detailsOpen = true; renderEditor({ preserveScroll: true }); }); document.querySelector("[data-flow-toggle]")?.addEventListener("click", () => { state.flowOpen = !state.flowOpen; renderEditor({ preserveScroll: true }); }); document.querySelector("[data-back]")?.addEventListener("click", () => navigateStage(state.stage - 1)); document.querySelector("[data-next]")?.addEventListener("click", () => { if (state.stage < 4) navigateStage(state.stage + 1); else { persist(); renderDashboard(); } }); document.querySelectorAll("[data-stage]").forEach(b => b.addEventListener("click", () => navigateStage(Number(b.dataset.stage))));
    document.querySelectorAll("[data-trigger]").forEach(b => b.addEventListener("click", () => { state.editing.trigger = b.dataset.trigger; changed(); })); document.querySelectorAll("[data-rule-mode]").forEach(b => b.addEventListener("click", () => { state.editing.ruleMode = b.dataset.ruleMode; changed(); })); document.querySelectorAll("[data-add-rule]").forEach(b => b.addEventListener("click", () => { state.editing.conditions.push({ id: makeId("rule"), type: b.dataset.addRule }); changed(); })); document.querySelectorAll("[data-remove-rule]").forEach(b => b.addEventListener("click", () => { state.editing.conditions = state.editing.conditions.filter(r => r.id !== b.dataset.removeRule); changed(); }));
    document.querySelector("[data-add-action]")?.addEventListener("click", () => { state.picker = { kind: "action", replaceId: null }; renderEditor({ preserveScroll: true }); }); document.querySelectorAll("[data-pick-action-type]").forEach(b => b.addEventListener("click", () => { state.picker = { kind: "action", replaceId: b.dataset.pickActionType }; renderEditor({ preserveScroll: true }); })); document.querySelectorAll("[data-pick-target]").forEach(b => b.addEventListener("click", () => { state.picker = { kind: "target", actionId: b.dataset.pickTarget }; renderEditor({ preserveScroll: true }); })); document.querySelectorAll("[data-action-content]").forEach(el => el.addEventListener("input", () => { const a = state.editing.actions.find(x => x.id === el.dataset.actionContent); if (a) { a.content = el.value; scheduleAutosave(); } })); document.querySelectorAll("[data-remove-action]").forEach(b => b.addEventListener("click", () => { if (state.editing.actions.length > 1) { state.editing.actions = state.editing.actions.filter(a => a.id !== b.dataset.removeAction); changed(); } })); document.querySelectorAll("[data-toggle-action]").forEach(b => b.addEventListener("click", () => { const a = state.editing.actions.find(x => x.id === b.dataset.toggleAction); if (a) a.enabled = a.enabled === false; changed(); })); document.querySelectorAll("[data-duplicate-action]").forEach(b => b.addEventListener("click", () => duplicateAction(b.dataset.duplicateAction))); document.querySelectorAll("[data-move-up]").forEach(b => b.addEventListener("click", () => moveAction(b.dataset.moveUp, -1))); document.querySelectorAll("[data-move-down]").forEach(b => b.addEventListener("click", () => moveAction(b.dataset.moveDown, 1))); bindDragAndDrop();
    document.querySelectorAll("[data-timing-mode]").forEach(b => b.addEventListener("click", () => { state.editing.timing.mode = b.dataset.timingMode; changed(); })); document.querySelectorAll("[data-delay-preset]").forEach(b => b.addEventListener("click", () => applyDelayPreset(b.dataset.delayPreset))); document.querySelectorAll("[data-delay-field]").forEach(i => i.addEventListener("input", () => { state.editing.timing.delay[i.dataset.delayField] = Math.max(0, Number(i.value) || 0); scheduleAutosave(); refreshLiveText(); })); document.querySelector("[data-exact-date]")?.addEventListener("input", e => { state.editing.timing.at.date = e.target.value; scheduleAutosave(); refreshLiveText(); }); document.querySelector("[data-exact-time]")?.addEventListener("input", e => { state.editing.timing.at.time = e.target.value; scheduleAutosave(); refreshLiveText(); }); document.querySelector("[data-exact-zone]")?.addEventListener("change", e => { state.editing.timing.at.timezone = e.target.value; changed(); }); document.querySelectorAll("[data-repeat-mode]").forEach(b => b.addEventListener("click", () => { state.editing.repeatConfig.mode = b.dataset.repeatMode; changed(); })); document.querySelector("[data-repeat-every]")?.addEventListener("input", e => { state.editing.repeatConfig.every = Math.max(1, Number(e.target.value) || 1); scheduleAutosave(); refreshLiveText(); }); document.querySelector("[data-repeat-unit]")?.addEventListener("change", e => { state.editing.repeatConfig.unit = e.target.value; changed(); }); document.querySelector("[data-repeat-zone]")?.addEventListener("change", e => { state.editing.repeatConfig.timezone = e.target.value; changed(); });
    document.querySelectorAll("[data-outcome]").forEach(b => b.addEventListener("click", () => { state.editing.outcome = b.dataset.outcome; changed(); })); document.querySelector("[data-simulate]")?.addEventListener("click", runSimulation); document.querySelector("[data-save-close]")?.addEventListener("click", () => { persist({ announce: true }); renderDashboard(); }); bindDetailsModal(); bindPicker();
  }

  function bindDetailsModal() { if (!state.detailsOpen) return; document.querySelectorAll("[data-modal-close]").forEach(node => node.addEventListener("click", e => { if (e.target.closest("[data-modal-panel]") && !e.target.matches("[data-modal-close]")) return; state.detailsOpen = false; renderEditor({ preserveScroll: true }); })); document.querySelector("[data-auto-name]")?.addEventListener("click", () => { state.editing.nameAuto = true; state.editing.name = generateName(state.editing); scheduleAutosave(); renderEditor({ preserveScroll: true }); }); document.querySelector("[data-details-save]")?.addEventListener("click", () => { const name = document.querySelector("[data-details-name]")?.value.trim(); const description = document.querySelector("[data-details-description]")?.value.trim() || ""; if (name) { state.editing.name = name; state.editing.nameAuto = false; } else { state.editing.nameAuto = true; state.editing.name = generateName(state.editing); } state.editing.description = description; state.detailsOpen = false; changed(); }); }
  function bindPicker() { if (!state.picker) return; document.querySelectorAll("[data-picker-close]").forEach(node => node.addEventListener("click", e => { if (e.target.closest("[data-modal-panel]") && !e.target.matches("[data-picker-close]")) return; state.picker = null; renderEditor({ preserveScroll: true }); })); document.querySelector("[data-picker-search]")?.addEventListener("input", e => { const q = e.target.value.trim().toLowerCase(); document.querySelectorAll("[data-picker-results] section button").forEach(b => { b.hidden = q && !b.textContent.toLowerCase().includes(q); }); }); document.querySelectorAll("[data-choose-inline]").forEach(b => b.addEventListener("click", () => replaceOrAppendAction(blankAction(b.dataset.chooseInline)))); document.querySelectorAll("[data-choose-saved]").forEach(b => b.addEventListener("click", () => { const s = savedAction(b.dataset.chooseSaved); if (s) replaceOrAppendAction({ id: makeId("step"), type: "action_ref", actionId: s.id, actionLabel: s.name || "Saved action", enabled: true, targetRef: null, targetLabel: "", content: "" }); })); document.querySelectorAll("[data-choose-target]").forEach(b => b.addEventListener("click", () => chooseTarget(b.dataset.chooseTarget))); }

  function replaceOrAppendAction(next) { const replaceId = state.picker?.replaceId; if (replaceId) { const index = state.editing.actions.findIndex(a => a.id === replaceId); if (index >= 0) { next.id = replaceId; state.editing.actions[index] = next; } } else state.editing.actions.push(next); if (state.editing.actions.length > 1 && state.editing.actions[0].type === "notify" && !state.editing.actions[0].content && !state.editing.actions[0].targetRef && !state.editing.actions[0].targetLabel) state.editing.actions.shift(); state.picker = null; changed(); }
  function chooseTarget(key) { const [kind, ...rest] = key.split(":"); const id = rest.join(":"); const target = loadTargets().find(t => t.kind === kind && t.id === id); const action = state.editing.actions.find(a => a.id === state.picker?.actionId); if (target && action) { action.targetRef = { kind: target.kind, id: target.id }; action.targetLabel = target.label; state.picker = null; changed(); } }
  function duplicateAction(id) { const index = state.editing.actions.findIndex(a => a.id === id); if (index < 0) return; const copy = clone(state.editing.actions[index]); copy.id = makeId("step"); state.editing.actions.splice(index + 1, 0, copy); changed(); }
  function moveAction(id, delta) { const index = state.editing.actions.findIndex(a => a.id === id), next = index + delta; if (index < 0 || next < 0 || next >= state.editing.actions.length) return; const [action] = state.editing.actions.splice(index, 1); state.editing.actions.splice(next, 0, action); changed(); }
  function bindDragAndDrop() { document.querySelectorAll("[data-action-card]").forEach(card => { card.addEventListener("dragstart", e => { state.dragActionId = card.dataset.actionCard; card.classList.add("is-dragging"); e.dataTransfer?.setData("text/plain", state.dragActionId); }); card.addEventListener("dragend", () => { state.dragActionId = null; card.classList.remove("is-dragging"); }); card.addEventListener("dragover", e => { e.preventDefault(); card.classList.add("is-drop-target"); }); card.addEventListener("dragleave", () => card.classList.remove("is-drop-target")); card.addEventListener("drop", e => { e.preventDefault(); card.classList.remove("is-drop-target"); const sourceId = state.dragActionId || e.dataTransfer?.getData("text/plain"), targetId = card.dataset.actionCard; if (!sourceId || sourceId === targetId) return; const s = state.editing.actions.findIndex(a => a.id === sourceId), t = state.editing.actions.findIndex(a => a.id === targetId); if (s < 0 || t < 0) return; const [action] = state.editing.actions.splice(s, 1); state.editing.actions.splice(t, 0, action); changed(); }); }); }
  function applyDelayPreset(p) { state.editing.timing.mode = "delay"; state.editing.timing.delay = { days: 0, hours: 0, minutes: 0 }; if (p === "15m") state.editing.timing.delay.minutes = 15; if (p === "1h") state.editing.timing.delay.hours = 1; if (p === "6h") state.editing.timing.delay.hours = 6; if (p === "24h") state.editing.timing.delay.days = 1; changed(); }
  function navigateStage(next) { if (!Number.isInteger(next) || next < 0 || next >= STAGES.length || next === state.stage) return; persist(); state.stage = next; state.editing.editorStage = next; stopSimulation(); renderEditor(); window.scrollTo({ top: 0, behavior: "instant" }); }
  function autoName() { if (state.editing.nameAuto !== false) state.editing.name = generateName(state.editing); }
  function changed() { autoName(); scheduleAutosave(); renderEditor({ preserveScroll: true }); updateSaveState("Saving…", "dirty"); }
  function refreshLiveText() { autoName(); const sentence = compactSentence(state.editing); const mobile = document.querySelector(".v3-mobile-flow-toggle strong"), readable = document.querySelector(".v3-live-summary p"); if (mobile) mobile.textContent = sentence; if (readable) readable.textContent = sentence; }

  function runSimulation() { stopSimulation(); const nodes = simulationNodes(state.editing); state.simulation = { running: true, index: 0, log: ["Simulation started. External execution remains off."], done: false }; renderEditor({ preserveScroll: true }); const advance = () => { if (!state.simulation?.running) return; const node = nodes[state.simulation.index]; if (node) state.simulation.log.push(`${node.key}: ${node.title}`); state.simulation.index += 1; if (state.simulation.index >= nodes.length) { state.simulation.running = false; state.simulation.done = true; state.simulation.log.push("Reached the configured finish state."); renderEditor({ preserveScroll: true }); return; } renderEditor({ preserveScroll: true }); state.simulationTimer = setTimeout(advance, 650); }; state.simulationTimer = setTimeout(advance, 650); }
  function stopSimulation() { clearTimeout(state.simulationTimer); state.simulationTimer = null; if (state.simulation?.running) state.simulation.running = false; }
  function toast(message) { document.querySelector(".v3-toast")?.remove(); const node = document.createElement("div"); node.className = "v3-toast"; node.textContent = message; document.body.append(node); setTimeout(() => node.remove(), 1500); }

  window.addEventListener("beforeunload", () => { if (state.dirty) persist(); });
  window.addEventListener("storage", event => { if ([STORAGE_KEY, CRM_KEY, INVENTORY_KEY, ACTIONS_KEY].includes(event.key)) { if (event.key === STORAGE_KEY) data = loadData(); if (state.view === "dashboard") renderDashboard(); else if (state.view === "editor") renderEditor({ preserveScroll: true }); } });

  applyTheme(localStorage.getItem(THEME_KEY) || "dark");
  renderDashboard();
})();
