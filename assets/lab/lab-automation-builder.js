(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /**
   * CHECK IN LAB — AUTOMATION BUILDER PROTOTYPE
   * -------------------------------------------
   * UX-only Lab adapter for the future typed Automation domain.
   * It deliberately does not call providers, schedule work, publish production
   * definitions, or claim that an Automation can execute. Browser-local drafts
   * exist only so the interaction can be evaluated before Phase 2A APIs exist.
   *
   * Official product direction:
   *   WHEN -> IF -> DO -> WAIT / REPEAT -> THEN
   *
   * The existing Action Builder remains the editor/library for reusable DO steps.
   */

  const STORAGE_KEY = "cmx-lab-automations-v1";
  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];
  const esc = value => String(value ?? "").replace(/[&<>'"]/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));
  const clone = value => JSON.parse(JSON.stringify(value));

  const TRIGGERS = Object.freeze([
    { id: "grace_start", label: "Grace begins", note: "Start when the switch enters its grace period.", mark: "GRACE" },
    { id: "grace_expiry", label: "Grace expires", note: "Start when the grace period reaches its final boundary.", mark: "FINAL" },
    { id: "manual", label: "Manual start", note: "Start only when an authorized person chooses to run it.", mark: "MANUAL" },
    { id: "calendar", label: "Calendar time", note: "Start from a future typed schedule once the backend supports it.", mark: "TIME" }
  ]);

  const CONDITIONS = Object.freeze([
    { id: "none", label: "No extra rule", note: "Continue whenever the trigger occurs." },
    { id: "not_acknowledged", label: "Not acknowledged", note: "Continue only if the prior notification still has no acknowledgement." },
    { id: "switch_in_grace", label: "Switch is still in grace", note: "Continue only while the switch remains in grace." },
    { id: "previous_failed", label: "Previous step failed", note: "Use a future typed action outcome as the rule." }
  ]);

  const ACTIONS = Object.freeze([
    { id: "notify", label: "Notify a person", note: "Prepare a notification step for an approved protected target.", mark: "NTF" },
    { id: "email", label: "Send email", note: "Prepare a typed email step. No email is sent from Lab.", mark: "EML" },
    { id: "ai_task", label: "AI task", note: "Prepare a bounded AI task using approved records and an explicit output.", mark: "AI" },
    { id: "manual_review", label: "Manual review", note: "Pause the workflow for a human decision before continuing.", mark: "REV" }
  ]);

  const WAITS = Object.freeze([
    { id: "none", label: "No wait", hours: 0 },
    { id: "1h", label: "Wait 1 hour", hours: 1 },
    { id: "6h", label: "Wait 6 hours", hours: 6 },
    { id: "24h", label: "Wait 24 hours", hours: 24 }
  ]);

  const REPEATS = Object.freeze([
    { id: "none", label: "Do not repeat" },
    { id: "daily", label: "Repeat daily" },
    { id: "until_ack", label: "Repeat until acknowledged" }
  ]);

  const OUTCOMES = Object.freeze([
    { id: "end", label: "End workflow", note: "Stop after this path completes." },
    { id: "success", label: "Continue on success", note: "Hand off to the next typed step after success." },
    { id: "no_ack", label: "Escalate if not acknowledged", note: "Take a future no-acknowledgement route." },
    { id: "review", label: "Require review", note: "Stop for approval before the next consequential step." }
  ]);

  const STEPS = Object.freeze([
    { key: "basics", short: "START", label: "Name" },
    { key: "when", short: "WHEN", label: "Trigger" },
    { key: "if", short: "IF", label: "Rule" },
    { key: "do", short: "DO", label: "Action" },
    { key: "wait", short: "WAIT", label: "Timing" },
    { key: "then", short: "THEN", label: "Outcome" },
    { key: "review", short: "REVIEW", label: "Review" }
  ]);

  function option(list, id) {
    return list.find(item => item.id === id) || list[0];
  }

  function blankAutomation() {
    return {
      id: "",
      name: "",
      description: "",
      status: "Draft",
      trigger: "grace_start",
      condition: "none",
      action: "notify",
      target: "",
      content: "",
      wait: "none",
      repeat: "none",
      outcome: "end",
      updatedAt: new Date().toISOString()
    };
  }

  function seedData() {
    const now = Date.now();
    return {
      version: 1,
      automations: [
        {
          ...blankAutomation(),
          id: "auto-grace-escalation",
          name: "Grace escalation",
          description: "Escalate a missed check in through a deliberate acknowledgement path.",
          trigger: "grace_start",
          condition: "not_acknowledged",
          action: "notify",
          target: "Primary contact",
          content: "Ask the approved contact to acknowledge the contingency notice.",
          wait: "6h",
          repeat: "none",
          outcome: "no_ack",
          updatedAt: new Date(now - 42 * 60000).toISOString()
        },
        {
          ...blankAutomation(),
          id: "auto-briefing-draft",
          name: "Continuity briefing",
          description: "Prepare a bounded briefing from approved records for human review.",
          trigger: "manual",
          condition: "none",
          action: "ai_task",
          target: "Approved continuity records",
          content: "Summarize the approved records and flag missing information. Do not contact anyone.",
          wait: "none",
          repeat: "none",
          outcome: "review",
          updatedAt: new Date(now - 3 * 3600000).toISOString()
        }
      ]
    };
  }

  function loadData() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored?.version === 1 && Array.isArray(stored.automations)) return stored;
    } catch {}
    const seeded = seedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  let data = loadData();
  let workspace = null;
  let dialog = null;
  let editor = null;

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    document.dispatchEvent(new CustomEvent("cmx:lab-automations-updated", {
      detail: { total: data.automations.length, drafts: data.automations.filter(item => item.status === "Draft").length }
    }));
  }

  function makeId() {
    return `auto-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function relativeTime(iso) {
    const age = Math.max(0, Date.now() - new Date(iso).getTime());
    if (age < 60000) return "just now";
    if (age < 3600000) return `${Math.floor(age / 60000)}m ago`;
    if (age < 86400000) return `${Math.floor(age / 3600000)}h ago`;
    return `${Math.floor(age / 86400000)}d ago`;
  }

  function summary(item) {
    const when = option(TRIGGERS, item.trigger).label;
    const condition = option(CONDITIONS, item.condition).label;
    const action = option(ACTIONS, item.action).label;
    const wait = option(WAITS, item.wait).label;
    const repeat = option(REPEATS, item.repeat).label;
    const then = option(OUTCOMES, item.outcome).label;
    const target = item.target.trim() ? ` for ${item.target.trim()}` : "";
    const ifPart = item.condition === "none" ? "" : ` If ${condition.toLowerCase()},`;
    const waitPart = item.wait === "none" ? "" : ` ${wait}.`;
    const repeatPart = item.repeat === "none" ? "" : ` ${repeat}.`;
    return `When ${when.toLowerCase()}.${ifPart} ${action}${target}.${waitPart}${repeatPart} Then ${then.toLowerCase()}.`.replace(/\s+/g, " ").trim();
  }

  function flowMarkup(item) {
    const values = [
      ["when", "WHEN", option(TRIGGERS, item.trigger).label],
      ["if", "IF", option(CONDITIONS, item.condition).label],
      ["do", "DO", option(ACTIONS, item.action).label],
      ["wait", "WAIT", item.wait === "none" ? "None" : option(WAITS, item.wait).label.replace(/^Wait /, "")],
      ["then", "THEN", option(OUTCOMES, item.outcome).label]
    ];
    return `<div class="lab-auto-flow">${values.map(([tone, key, value]) => `
      <span class="lab-auto-node tone-${tone}"><small>${key}</small><strong>${esc(value)}</strong></span>`).join('<i aria-hidden="true">→</i>')}</div>`;
  }

  function automationCard(item) {
    return `<button class="lab-auto-card" type="button" data-auto-open="${esc(item.id)}">
      <span class="lab-auto-card-top">
        <span><small>AUTOMATION DRAFT</small><strong>${esc(item.name || "Untitled automation")}</strong></span>
        <em>${esc(item.status.toUpperCase())}</em>
      </span>
      <p>${esc(item.description || summary(item))}</p>
      ${flowMarkup(item)}
      <span class="lab-auto-card-foot"><b>LOCAL ONLY</b><small>Updated ${esc(relativeTime(item.updatedAt))}</small></span>
    </button>`;
  }

  function renderWorkspace() {
    if (!workspace) return;
    const drafts = data.automations.filter(item => item.status === "Draft").length;
    workspace.innerHTML = `
      <header class="lab-auto-head">
        <div>
          <small>AUTOMATIONS</small>
          <h2>Build a workflow</h2>
          <p>Connect a trigger, rules, actions, timing and outcomes in one readable plan.</p>
        </div>
        <button class="lab-auto-new" type="button" data-auto-new><span>＋</span> New automation</button>
      </header>

      <div class="lab-auto-state-row" aria-label="Automation prototype status">
        <span><small>DRAFTS</small><strong>${drafts}</strong></span>
        <span><small>PUBLISHING</small><strong>NOT CONNECTED</strong></span>
        <span class="is-safe"><small>EXECUTION</small><strong>OFF IN LAB</strong></span>
      </div>

      <div class="lab-auto-intro">
        <span class="lab-auto-intro-mark" aria-hidden="true">⌁</span>
        <div><strong>One workflow, five decisions</strong><p><b>WHEN</b> it starts · <b>IF</b> a rule is true · <b>DO</b> something · <b>WAIT</b> when needed · <b>THEN</b> choose what happens next.</p></div>
      </div>

      <div class="lab-auto-list-head"><strong>Your drafts</strong><small>Browser-local prototype data</small></div>
      <div class="lab-auto-grid">
        ${data.automations.length ? data.automations.map(automationCard).join("") : '<div class="lab-auto-empty"><strong>No automation drafts yet</strong><p>Create one to test the future workflow-builder experience.</p></div>'}
      </div>

      <footer class="lab-auto-library-link">
        <div><small>REUSABLE DO STEPS</small><strong>Action library</strong><p>The existing Lab Actions workspace stays below for detailed action definitions, targets and guardrails.</p></div>
        <button type="button" data-auto-library>Open action library ↓</button>
      </footer>`;
  }

  function createWorkspace() {
    const panel = $('[data-view-panel="actions"]');
    const actionRoot = $(".lab-actions", panel);
    if (!panel || !actionRoot) return false;

    workspace = $("#labAutomationWorkspace", panel);
    if (!workspace) {
      workspace = document.createElement("section");
      workspace.id = "labAutomationWorkspace";
      workspace.className = "lab-automation-workspace";
      workspace.setAttribute("aria-label", "Automation builder prototype");
      actionRoot.before(workspace);
    }

    const heading = $(".view-heading", panel);
    if (heading) {
      const eyebrow = $(".eyebrow", heading);
      const title = $("h1", heading);
      if (eyebrow) eyebrow.textContent = "AUTOMATION CONTROL";
      if (title) title.textContent = "Actions";
    }

    actionRoot.dataset.automationLibrary = "true";
    renderWorkspace();
    return true;
  }

  function createDialog() {
    if (dialog) return dialog;
    dialog = document.createElement("dialog");
    dialog.id = "labAutomationDialog";
    dialog.className = "lab-automation-dialog";
    dialog.setAttribute("aria-label", "Automation draft editor");
    document.body.append(dialog);
    return dialog;
  }

  function choiceCards(list, field, current, tone) {
    return `<div class="lab-auto-choice-grid">${list.map(item => `
      <button type="button" class="lab-auto-choice ${current === item.id ? "is-selected" : ""}" data-auto-choice data-field="${field}" data-value="${esc(item.id)}">
        ${item.mark ? `<span class="lab-auto-choice-mark tone-${tone}">${esc(item.mark)}</span>` : ""}
        <span><strong>${esc(item.label)}</strong>${item.note ? `<small>${esc(item.note)}</small>` : ""}</span>
        <i aria-hidden="true">${current === item.id ? "✓" : ""}</i>
      </button>`).join("")}</div>`;
  }

  function stepBasics(item) {
    return `<section class="lab-auto-step">
      <header><small>START</small><h3>Name the automation</h3><p>Give the workflow a clear name you will recognize later.</p></header>
      <label class="lab-auto-field"><span>Automation name</span><input data-auto-bind="name" maxlength="80" placeholder="Grace escalation" value="${esc(item.name)}" /></label>
      <label class="lab-auto-field"><span>Description <small>optional</small></span><textarea data-auto-bind="description" maxlength="220" placeholder="What is this workflow for?">${esc(item.description)}</textarea></label>
    </section>`;
  }

  function stepWhen(item) {
    return `<section class="lab-auto-step"><header><small>WHEN</small><h3>What starts this?</h3><p>The backend will eventually own and validate the real trigger.</p></header>${choiceCards(TRIGGERS, "trigger", item.trigger, "when")}</section>`;
  }

  function stepIf(item) {
    return `<section class="lab-auto-step"><header><small>IF</small><h3>Does a rule have to be true?</h3><p>Keep it simple. No arbitrary code or hidden logic.</p></header>${choiceCards(CONDITIONS, "condition", item.condition, "if")}</section>`;
  }

  function stepDo(item) {
    return `<section class="lab-auto-step">
      <header><small>DO</small><h3>What should happen?</h3><p>This chooses one typed action step. Detailed provider setup comes later.</p></header>
      ${choiceCards(ACTIONS, "action", item.action, "do")}
      <div class="lab-auto-do-fields">
        <label class="lab-auto-field"><span>Target or protected reference</span><input data-auto-bind="target" maxlength="120" placeholder="Primary contact" value="${esc(item.target)}" /></label>
        <label class="lab-auto-field"><span>Content / instructions</span><textarea data-auto-bind="content" maxlength="600" placeholder="What should this step communicate or produce?">${esc(item.content)}</textarea></label>
      </div>
    </section>`;
  }

  function stepWait(item) {
    return `<section class="lab-auto-step">
      <header><small>WAIT / REPEAT</small><h3>Should time pass before the next outcome?</h3><p>This is a UI preview only. The future server will persist due times instead of keeping a browser timer alive.</p></header>
      <div class="lab-auto-subhead"><strong>Wait</strong><small>Optional delay</small></div>
      ${choiceCards(WAITS, "wait", item.wait, "wait")}
      <div class="lab-auto-subhead"><strong>Repeat</strong><small>Optional cadence</small></div>
      ${choiceCards(REPEATS, "repeat", item.repeat, "wait")}
    </section>`;
  }

  function stepThen(item) {
    return `<section class="lab-auto-step"><header><small>THEN</small><h3>What happens after this path?</h3><p>Outcomes become typed routes once the runtime exists.</p></header>${choiceCards(OUTCOMES, "outcome", item.outcome, "then")}</section>`;
  }

  function reviewRow(label, value, tone) {
    return `<div class="lab-auto-review-row tone-${tone}"><small>${label}</small><strong>${esc(value)}</strong></div>`;
  }

  function stepReview(item) {
    return `<section class="lab-auto-step lab-auto-review">
      <header><small>REVIEW</small><h3>Read the workflow like a person</h3><p>If this summary is confusing, the workflow is too complicated.</p></header>
      <div class="lab-auto-review-summary"><small>PLAIN-LANGUAGE PREVIEW</small><strong>${esc(summary(item))}</strong></div>
      <div class="lab-auto-review-grid">
        ${reviewRow("WHEN", option(TRIGGERS, item.trigger).label, "when")}
        ${reviewRow("IF", option(CONDITIONS, item.condition).label, "if")}
        ${reviewRow("DO", option(ACTIONS, item.action).label + (item.target.trim() ? ` → ${item.target.trim()}` : ""), "do")}
        ${reviewRow("WAIT", `${option(WAITS, item.wait).label} · ${option(REPEATS, item.repeat).label}`, "wait")}
        ${reviewRow("THEN", option(OUTCOMES, item.outcome).label, "then")}
      </div>
      <div class="lab-auto-review-safety"><span>LAB DRAFT</span><p>Saving stores this prototype in this browser only. It does not publish a backend Automation or execute an Action.</p></div>
    </section>`;
  }

  function stepContent() {
    const item = editor.item;
    switch (STEPS[editor.step].key) {
      case "basics": return stepBasics(item);
      case "when": return stepWhen(item);
      case "if": return stepIf(item);
      case "do": return stepDo(item);
      case "wait": return stepWait(item);
      case "then": return stepThen(item);
      default: return stepReview(item);
    }
  }

  function renderDialog() {
    if (!dialog || !editor) return;
    const item = editor.item;
    const isReview = editor.step === STEPS.length - 1;
    dialog.innerHTML = `<div class="lab-auto-dialog-shell">
      <header class="lab-auto-dialog-head">
        <div><small>AUTOMATION DRAFT</small><strong>${esc(item.name || "Untitled automation")}</strong></div>
        <button type="button" data-auto-close aria-label="Close">×</button>
      </header>
      <div class="lab-auto-editor">
        <nav class="lab-auto-step-rail" aria-label="Automation builder steps">
          ${STEPS.map((step, index) => `<button type="button" class="${index === editor.step ? "is-current" : index < editor.step ? "is-done" : ""}" data-auto-step="${index}"><span>${index < editor.step ? "✓" : String(index + 1).padStart(2, "0")}</span><small>${step.short}</small><strong>${step.label}</strong></button>`).join("")}
        </nav>
        <main class="lab-auto-editor-main">${stepContent()}</main>
      </div>
      <footer class="lab-auto-dialog-foot">
        <div>${editor.existingId ? '<button class="lab-auto-delete" type="button" data-auto-delete>Delete draft</button>' : ""}</div>
        <div class="lab-auto-dialog-actions">
          <button type="button" class="lab-auto-secondary" data-auto-back ${editor.step === 0 ? "disabled" : ""}>Back</button>
          ${isReview
            ? '<button type="button" class="lab-auto-publish" disabled title="Requires the typed Automation backend">Publish</button><button type="button" class="lab-auto-primary" data-auto-save>Save draft</button>'
            : '<button type="button" class="lab-auto-primary" data-auto-next>Continue</button>'}
        </div>
      </footer>
    </div>`;
  }

  function openEditor(id = null) {
    const source = id ? data.automations.find(item => item.id === id) : null;
    editor = { existingId: source?.id || null, step: 0, item: clone(source || blankAutomation()) };
    createDialog();
    renderDialog();
    dialog.showModal();
  }

  function closeEditor() {
    if (dialog?.open) dialog.close();
    editor = null;
  }

  function updateBoundField(target) {
    if (!editor) return;
    const key = target.dataset.autoBind;
    if (!key || !(key in editor.item)) return;
    editor.item[key] = target.value;
    const headerTitle = $(".lab-auto-dialog-head strong", dialog);
    if (key === "name" && headerTitle) headerTitle.textContent = target.value.trim() || "Untitled automation";
  }

  function saveEditor() {
    if (!editor) return;
    const item = editor.item;
    item.name = item.name.trim() || "Untitled automation";
    item.description = item.description.trim();
    item.target = item.target.trim();
    item.content = item.content.trim();
    item.status = "Draft";
    item.updatedAt = new Date().toISOString();
    if (editor.existingId) {
      const index = data.automations.findIndex(candidate => candidate.id === editor.existingId);
      if (index >= 0) data.automations[index] = { ...item, id: editor.existingId };
    } else {
      item.id = makeId();
      data.automations.unshift(item);
    }
    saveData();
    renderWorkspace();
    closeEditor();
  }

  function deleteEditor() {
    if (!editor?.existingId) return;
    data.automations = data.automations.filter(item => item.id !== editor.existingId);
    saveData();
    renderWorkspace();
    closeEditor();
  }

  function handleClick(event) {
    const open = event.target.closest("[data-auto-open]");
    if (open) return openEditor(open.dataset.autoOpen);
    if (event.target.closest("[data-auto-new]")) return openEditor();
    if (event.target.closest("[data-auto-library]")) {
      $(".lab-actions")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!dialog?.contains(event.target)) return;
    if (event.target.closest("[data-auto-close]")) return closeEditor();
    if (event.target.closest("[data-auto-back]") && editor?.step > 0) {
      editor.step -= 1;
      renderDialog();
      return;
    }
    if (event.target.closest("[data-auto-next]") && editor?.step < STEPS.length - 1) {
      editor.step += 1;
      renderDialog();
      return;
    }
    const step = event.target.closest("[data-auto-step]");
    if (step && editor) {
      editor.step = Math.max(0, Math.min(STEPS.length - 1, Number(step.dataset.autoStep) || 0));
      renderDialog();
      return;
    }
    const choice = event.target.closest("[data-auto-choice]");
    if (choice && editor) {
      const field = choice.dataset.field;
      if (field in editor.item) editor.item[field] = choice.dataset.value;
      renderDialog();
      return;
    }
    if (event.target.closest("[data-auto-save]")) return saveEditor();
    if (event.target.closest("[data-auto-delete]")) return deleteEditor();
  }

  function boot() {
    if (!createWorkspace()) {
      // The Actions module normally boots before this layer. One short deferred
      // retry handles slower mobile parsing without introducing a broad observer.
      setTimeout(() => {
        if (createWorkspace()) document.body.dataset.labAutomationBuilder = "ready";
      }, 120);
      return;
    }
    document.body.dataset.labAutomationBuilder = "ready";
  }

  document.addEventListener("click", handleClick);
  document.addEventListener("input", event => {
    if (event.target.matches("[data-auto-bind]")) updateBoundField(event.target);
  });
  document.addEventListener("change", event => {
    if (event.target.matches("[data-auto-bind]")) updateBoundField(event.target);
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();