(() => {
  "use strict";

  const EMAIL_KEY = "cmx-lab-email-actions-v1";
  const AI_KEY = "cmx-lab-ai-task-actions-v1";
  const AUDIENCE_KEY = "cmx-lab-audience-links-v1";
  const CRM_KEY = "cmx-lab-crm-v1";
  const CONTENT_KEY = "cmx-lab-content-assets-v1";
  const app = document.getElementById("automationApp");
  if (!app) return;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"
  }[ch]));
  const now = () => new Date().toISOString();
  const load = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const uniq = values => [...new Set((values || []).filter(Boolean))];

  function defaultEmail() {
    return {
      senderConnectionId: null,
      fromDisplayName: "",
      replyTo: "",
      updatedAt: now()
    };
  }

  function emailStore() {
    const store = load(EMAIL_KEY, {version:1,actions:{}});
    store.version = 1;
    store.actions = store.actions && typeof store.actions === "object" ? store.actions : {};
    return store;
  }

  function emailConfig(stepId) {
    return {...defaultEmail(), ...(emailStore().actions[stepId] || {})};
  }

  function updateEmail(stepId, patch) {
    const store = emailStore();
    store.actions[stepId] = {...defaultEmail(), ...(store.actions[stepId] || {}), ...patch, updatedAt:now()};
    save(EMAIL_KEY, store);
  }

  function defaultAi(seed = "") {
    return {
      objective: seed || "",
      instructions: "",
      context: ["incident_state", "linked_content"],
      tools: ["library_search", "content_read"],
      autonomy: "draft_only",
      limits: {maxSteps:12,maxRuntimeMinutes:10,maxMessages:0,maxRecipients:25},
      updatedAt: now()
    };
  }

  function aiStore() {
    const store = load(AI_KEY, {version:1,tasks:{}});
    store.version = 1;
    store.tasks = store.tasks && typeof store.tasks === "object" ? store.tasks : {};
    return store;
  }

  function aiConfig(stepId, seed = "") {
    const existing = aiStore().tasks[stepId];
    const base = defaultAi(seed);
    return existing ? {...base,...existing,limits:{...base.limits,...(existing.limits||{})}} : base;
  }

  function persistAi(stepId, config) {
    const store = aiStore();
    store.tasks[stepId] = {...config,updatedAt:now()};
    save(AI_KEY, store);
  }

  function crm() {
    const data = load(CRM_KEY, {version:1,people:[],organizations:[],labels:[],groups:[]});
    data.people = Array.isArray(data.people) ? data.people : [];
    data.organizations = Array.isArray(data.organizations) ? data.organizations : [];
    data.labels = Array.isArray(data.labels) ? data.labels : [];
    data.groups = Array.isArray(data.groups) ? data.groups : [];
    data.people.forEach(person => {
      person.organizationIds = uniq([...(Array.isArray(person.organizationIds)?person.organizationIds:[]), person.orgId]);
      person.labels = uniq([...(Array.isArray(person.labels)?person.labels:[]), ...(Array.isArray(person.tags)?person.tags:[])]);
    });
    return data;
  }

  function audienceLinks() {
    const store = load(AUDIENCE_KEY, {version:1,links:{}});
    store.links = store.links && typeof store.links === "object" ? store.links : {};
    return store.links;
  }

  function resolveRef(data, ref, seen = new Set()) {
    if (!ref?.kind || !ref?.id) return [];
    if (ref.kind === "person") return data.people.filter(person => person.id === ref.id);
    if (ref.kind === "organization") return data.people.filter(person => (person.organizationIds || []).includes(ref.id));
    if (ref.kind === "label") return data.people.filter(person => (person.labels || []).includes(ref.id));
    if (ref.kind === "group") {
      if (seen.has(ref.id)) return [];
      seen.add(ref.id);
      const group = data.groups.find(item => item.id === ref.id);
      return (group?.members || []).flatMap(member => resolveRef(data, member, new Set(seen)));
    }
    return [];
  }

  function refName(data, ref) {
    if (ref.kind === "person") return data.people.find(x=>x.id===ref.id)?.name || ref.id;
    if (ref.kind === "organization") return data.organizations.find(x=>x.id===ref.id)?.name || ref.id;
    if (ref.kind === "label") return `${data.labels.find(x=>x.id===ref.id)?.name || ref.id} label`;
    if (ref.kind === "group") return data.groups.find(x=>x.id===ref.id)?.name || ref.id;
    return ref.id;
  }

  function audienceSummary(selectorId) {
    const data = crm();
    const refs = audienceLinks()[selectorId]?.refs || [];
    const people = new Map();
    refs.flatMap(ref => resolveRef(data, ref)).forEach(person => {
      if (person?.id && String(person.status || "Active").toLowerCase() !== "archived") people.set(person.id, person);
    });
    const resolved = [...people.values()];
    const label = refs.length
      ? refs.slice(0,2).map(ref=>refName(data,ref)).join(" + ") + (refs.length>2?` +${refs.length-2}`:"")
      : "None selected";
    return {refs,people:resolved,emailReady:resolved.filter(x=>x.email).length,label};
  }

  function contentAsset(stepId) {
    const store = load(CONTENT_KEY, {version:1,assets:[],links:{}});
    const id = store.links?.[stepId];
    return id ? (store.assets || []).find(item => item.id === id) || null : null;
  }

  function actionType(card) {
    return card?.querySelector(".do-card-head strong")?.textContent?.trim().toLowerCase() || "";
  }

  function stepIdFor(card) {
    return card?.querySelector("[data-action-content]")?.dataset.actionContent || "";
  }

  function roleId(stepId, role) {
    if (role === "to") return stepId;
    return `${stepId}:${role}`;
  }

  function roleCard(stepId, role, label) {
    const summary = audienceSummary(roleId(stepId, role));
    return `<button type="button" class="email-recipient-card" data-audience-open="${esc(roleId(stepId,role))}">
      <small>${esc(label)}</small><strong>${esc(summary.label)}</strong><span>${summary.people.length} unique · ${summary.emailReady} email-ready</span>
    </button>`;
  }

  function emailPanel(stepId) {
    const config = emailConfig(stepId);
    const asset = contentAsset(stepId);
    const to = audienceSummary(stepId);
    const cc = audienceSummary(roleId(stepId,"cc"));
    const bcc = audienceSummary(roleId(stepId,"bcc"));
    const subject = asset?.draft?.subject?.trim() || "No subject yet";
    const sender = config.fromDisplayName ? `${config.fromDisplayName} · verified sender pending` : "Verified sender connection required";
    return `<section class="email-action-panel" data-email-panel="${esc(stepId)}">
      <header><span><small>EMAIL ACTION</small><strong>Complete email composer</strong></span><button type="button" data-email-compose="${esc(stepId)}">Open composer</button></header>
      <div class="email-action-grid">
        <div><small>FROM</small><strong>${esc(sender)}</strong></div>
        <div><small>TO</small><strong>${esc(to.label)}</strong><span>${to.emailReady} email-ready</span></div>
        <div><small>CC</small><strong>${esc(cc.label)}</strong></div>
        <div><small>BCC</small><strong>${esc(bcc.label)}</strong></div>
        <div class="email-subject-summary"><small>SUBJECT</small><strong>${esc(subject)}</strong></div>
      </div>
      <footer><span>Rich HTML + plain-text fallback + exact FileVersion attachments</span><b>EXECUTION OFF IN LAB</b></footer>
    </section>`;
  }

  function autonomyLabel(mode) {
    if (mode === "approval") return "Approval before external action";
    if (mode === "contingency") return "Pre-authorized contingency";
    return "Draft only";
  }

  function aiPanel(stepId, seed) {
    const cfg = aiConfig(stepId, seed);
    const objective = cfg.objective.trim() || "No objective configured yet";
    return `<section class="ai-task-panel" data-ai-panel="${esc(stepId)}">
      <header><span><small>AI TASK</small><strong>Bounded delegated work</strong></span><button type="button" data-ai-open="${esc(stepId)}">Configure AI task</button></header>
      <p>${esc(objective.slice(0,180))}${objective.length>180?"…":""}</p>
      <div class="ai-task-summary"><span><small>AUTONOMY</small><strong>${esc(autonomyLabel(cfg.autonomy))}</strong></span><span><small>TOOLS</small><strong>${cfg.tools.length} allowed in definition</strong></span><span><small>LIMIT</small><strong>${cfg.limits.maxSteps} steps · ${cfg.limits.maxRuntimeMinutes} min</strong></span></div>
      <footer>Lab defines authority only. No model, provider, email, message or external mutation runs here.</footer>
    </section>`;
  }

  function enhanceDoCards() {
    document.querySelectorAll(".do-card").forEach(card => {
      const stepId = stepIdFor(card);
      if (!stepId) return;
      const type = actionType(card);
      card.querySelectorAll("[data-email-panel],[data-ai-panel]").forEach(node=>node.remove());
      const audience = card.querySelector(`[data-audience-card="${CSS.escape(stepId)}"]`);
      const content = card.querySelector(".content-asset-card");
      const textarea = card.querySelector(`[data-action-content="${CSS.escape(stepId)}"]`);
      const field = textarea?.closest(".field");

      if (type === "send email") {
        if (audience) {
          audience.hidden = false;
          const kicker = audience.querySelector(".audience-target-copy small");
          if (kicker) kicker.textContent = "TO";
        }
        if (content) content.hidden = true;
        const split = card.querySelector(".split");
        (split || field || card.querySelector(".do-card-head"))?.insertAdjacentHTML("afterend", emailPanel(stepId));
      } else if (type === "ai task") {
        if (audience) audience.hidden = true;
        if (content) content.hidden = true;
        if (field) field.hidden = true;
        const split = card.querySelector(".split");
        (split || card.querySelector(".do-card-head"))?.insertAdjacentHTML("afterend", aiPanel(stepId, textarea?.value || ""));
      } else {
        if (audience) audience.hidden = false;
        if (content) content.hidden = false;
        if (field && !field.classList.contains("content-legacy-field")) field.hidden = false;
      }
    });
  }

  function enhanceActionFamilyGuide() {
    const heading = document.querySelector(".step-section .step-heading");
    if (!heading || heading.querySelector("small")?.textContent?.trim() !== "DO") return;
    if (document.querySelector("[data-action-family-guide]")) return;
    heading.insertAdjacentHTML("afterend", `<section class="action-family-guide" data-action-family-guide>
      <div><small>ACTION FRAMEWORK</small><strong>One workflow, typed methods</strong><span>Email and AI Task are being modeled deeply first so later Message, Discord, File/Document and Web Request actions can reuse the same Audience, Content, Connection, Runtime and Authority rules.</span></div>
      <div class="action-family-chips"><b>EMAIL</b><b>AI TASK</b><span>MESSAGE · NEXT</span><span>DISCORD · LATER</span><span>FILE / DOCUMENT</span><span>WEB REQUEST</span></div>
    </section>`);
  }

  function injectEmailEnvelope(stepId) {
    const overlay = document.querySelector(`.content-editor-overlay[data-content-editor="${CSS.escape(stepId)}"]`);
    if (!overlay) return;
    overlay.classList.add("email-composer-overlay");
    const heading = overlay.querySelector(".content-editor-heading");
    if (heading) {
      const small = heading.querySelector("small");
      const strong = heading.querySelector("strong");
      if (small) small.textContent = "EMAIL ACTION · LAB DRAFT";
      if (strong) strong.textContent = "Email composer";
    }

    const meta = overlay.querySelector(".content-meta-card");
    if (!meta) return;
    let envelope = overlay.querySelector("[data-email-envelope]");
    if (!envelope) {
      const cfg = emailConfig(stepId);
      envelope = document.createElement("section");
      envelope.className = "email-envelope-card";
      envelope.dataset.emailEnvelope = stepId;
      envelope.innerHTML = `<div class="email-envelope-head"><span><small>DELIVERY ENVELOPE</small><strong>Who this email is from and who receives it</strong></span><em>Provider connection pending</em></div>
        <div class="email-sender-row">
          <div class="email-sender-identity"><small>FROM</small><strong>Verified sender connection</strong><span>The production From address must come from an authorized Connection + SenderIdentity. It is never a freeform provider credential.</span></div>
          <label><span>From display name · optional</span><input type="text" maxlength="120" data-email-from-name value="${esc(cfg.fromDisplayName)}" placeholder="Your name or organization"></label>
          <label><span>Reply-To · optional</span><input type="email" inputmode="email" maxlength="254" data-email-reply-to value="${esc(cfg.replyTo)}" placeholder="reply@example.com"></label>
        </div>
        <div class="email-recipient-grid" data-email-recipient-grid>${roleCard(stepId,"to","TO")}${roleCard(stepId,"cc","CC")}${roleCard(stepId,"bcc","BCC")}</div>
        <div class="email-subject-slot" data-email-subject-slot></div>
        <div class="email-envelope-note"><strong>Privacy-aware recipient snapshot</strong><span>Production resolves authorized selectors when the Run begins, deduplicates recipients safely, freezes the exact To/CC/BCC snapshot, and only then renders/sends the immutable content version.</span></div>`;
      meta.before(envelope);
    }

    const subject = meta.querySelector("[data-content-subject]")?.closest("label");
    const subjectSlot = envelope.querySelector("[data-email-subject-slot]");
    if (subject && subjectSlot && !subjectSlot.contains(subject)) {
      subject.classList.add("email-subject-field");
      const label = subject.querySelector("span");
      if (label) label.textContent = "Subject";
      subjectSlot.append(subject);
    }

    const grid = envelope.querySelector("[data-email-recipient-grid]");
    if (grid) grid.innerHTML = `${roleCard(stepId,"to","TO")}${roleCard(stepId,"cc","CC")}${roleCard(stepId,"bcc","BCC")}`;

    const attachment = overlay.querySelector(".content-attachments-card");
    if (attachment) {
      const title = attachment.querySelector("strong");
      const copy = attachment.querySelector("p");
      if (title) title.textContent = "Email attachments from exact private FileVersions";
      if (copy) copy.textContent = "Production will attach authorized immutable FileVersions through the provider adapter. Lab never stores fake binary uploads or provider drafts.";
    }

    updateEmailPreview(stepId);
  }

  function updateEmailPreview(stepId) {
    const overlay = document.querySelector(`.content-editor-overlay[data-content-editor="${CSS.escape(stepId)}"]`);
    const preview = overlay?.querySelector("[data-content-preview-view]");
    if (!preview) return;
    let envelope = preview.querySelector("[data-email-preview-envelope]");
    if (!envelope) {
      envelope = document.createElement("div");
      envelope.className = "email-preview-envelope";
      envelope.dataset.emailPreviewEnvelope = "";
      preview.querySelector(".content-paper")?.prepend(envelope);
    }
    const cfg = emailConfig(stepId);
    const to = audienceSummary(stepId);
    const cc = audienceSummary(roleId(stepId,"cc"));
    const bcc = audienceSummary(roleId(stepId,"bcc"));
    envelope.innerHTML = `<div><small>FROM</small><strong>${esc(cfg.fromDisplayName || "Verified sender")}</strong></div><div><small>TO</small><strong>${esc(to.label)}</strong></div><div><small>CC</small><strong>${esc(cc.label)}</strong></div><div><small>BCC</small><strong>${esc(bcc.label)}</strong></div>`;
  }

  const AI_CONTEXTS = [
    ["incident_state","Current Incident + switch state","Read the authoritative Incident/trigger context for this Run."],
    ["linked_content","Explicitly linked Content/File versions","Read only content versions attached to this task/Automation."],
    ["directory","Approved Directory records","Search/read only People/Organizations granted to this task."],
    ["library_search","Approved Library search scope","Search only authorized Library scope; a search hit never expands authority."]
  ];
  const AI_TOOLS = [
    ["directory_search","Search Directory","Read-only","tier0"],
    ["library_search","Search Library","Read-only","tier0"],
    ["content_read","Read exact content version","Read-only","tier0"],
    ["document_draft","Create/update document draft","Draft write","tier1"],
    ["email_draft","Create email draft","Draft write","tier1"],
    ["email_send","Send approved email","External action","tier3"],
    ["message_send","Send approved message","External action","tier3"]
  ];

  function checkboxRows(items, selected, attr) {
    return items.map(([id,label,note,tier])=>`<label class="ai-capability-row"><input type="checkbox" ${selected.includes(id)?"checked":""} ${attr}="${esc(id)}"><span><strong>${esc(label)}</strong><small>${esc(note)}</small></span>${tier?`<em>${esc(tier.toUpperCase())}</em>`:""}</label>`).join("");
  }

  function openAiTask(stepId) {
    document.querySelector(".ai-task-overlay")?.remove();
    const textarea = document.querySelector(`[data-action-content="${CSS.escape(stepId)}"]`);
    const cfg = aiConfig(stepId, textarea?.value || "");
    const overlay = document.createElement("div");
    overlay.className = "ai-task-overlay";
    overlay.dataset.aiTaskOverlay = stepId;
    overlay.innerHTML = `<div class="ai-task-app" role="dialog" aria-modal="true" aria-label="AI task definition">
      <header class="ai-task-topbar"><div><button type="button" data-ai-close aria-label="Close AI task">←</button><span><small>AI TASK · DEFINITION ONLY</small><strong>Bounded AI task</strong><em>Describe the job, then separately define context, tools, authority and limits.</em></span></div><div><button type="button" data-ai-save>Save task</button><button type="button" class="primary" data-ai-done>Done</button></div></header>
      <main class="ai-task-main">
        <section class="ai-definition-card"><small>1 · OBJECTIVE</small><h2>What should AI accomplish?</h2><label><span>Objective</span><textarea data-ai-objective maxlength="1200" placeholder="Prepare a concise continuity briefing from the approved records.">${esc(cfg.objective)}</textarea></label><label><span>Instructions</span><textarea data-ai-instructions maxlength="6000" placeholder="Important constraints, preferred structure, what to flag, and what not to assume.">${esc(cfg.instructions)}</textarea></label><p>Production can promote substantial reusable instructions into versioned private Content rather than stuffing large prompts into Automation JSON.</p></section>
        <section class="ai-definition-card"><small>2 · CONTEXT</small><h2>What may AI read?</h2><p>These are capability buckets for the Lab. Production grants resolve to explicit authorized stable IDs/selectors and exact immutable versions.</p><div class="ai-capability-list">${checkboxRows(AI_CONTEXTS,cfg.context,"data-ai-context")}</div></section>
        <section class="ai-definition-card"><small>3 · TOOLS</small><h2>What may AI do?</h2><p>Tool selection does not create authority by itself. External actions still require Runtime + Connection + an active server-side grant.</p><div class="ai-capability-list">${checkboxRows(AI_TOOLS,cfg.tools,"data-ai-tool")}</div></section>
        <section class="ai-definition-card"><small>4 · AUTONOMY</small><h2>When can it act?</h2><div class="ai-autonomy-grid">
          <label class="ai-autonomy-card ${cfg.autonomy==="draft_only"?"is-selected":""}"><input type="radio" name="ai-autonomy" value="draft_only" ${cfg.autonomy==="draft_only"?"checked":""}><strong>Draft only</strong><span>Read approved context and produce drafts. No external side effects.</span></label>
          <label class="ai-autonomy-card ${cfg.autonomy==="approval"?"is-selected":""}"><input type="radio" name="ai-autonomy" value="approval" ${cfg.autonomy==="approval"?"checked":""}><strong>Approval required</strong><span>May prepare external actions but pauses at policy-defined approval checkpoints.</span></label>
          <label class="ai-autonomy-card ${cfg.autonomy==="contingency"?"is-selected":""}"><input type="radio" name="ai-autonomy" value="contingency" ${cfg.autonomy==="contingency"?"checked":""}><strong>Pre-authorized contingency</strong><span>A previously published AuthorityGrant may activate during a qualifying Incident when the user may be unavailable.</span></label>
        </div><div class="ai-contingency-note ${cfg.autonomy==="contingency"?"is-active":""}" data-ai-contingency-note><strong>Delegated authority is standing permission, not prompt permission.</strong><span>The backend must verify Incident state, grant version, allowed tools/resources/audiences/connections, limits and expiry. AI cannot activate, widen, renew or delegate its own grant.</span></div></section>
        <section class="ai-definition-card"><small>5 · LIMITS</small><h2>Bound the task even when authority is active</h2><div class="ai-limit-grid">
          <label><span>Max tool steps</span><input type="number" min="1" max="100" inputmode="numeric" data-ai-limit="maxSteps" value="${Number(cfg.limits.maxSteps)||12}"></label>
          <label><span>Max runtime · minutes</span><input type="number" min="1" max="120" inputmode="numeric" data-ai-limit="maxRuntimeMinutes" value="${Number(cfg.limits.maxRuntimeMinutes)||10}"></label>
          <label><span>Max outbound messages</span><input type="number" min="0" max="100" inputmode="numeric" data-ai-limit="maxMessages" value="${Number(cfg.limits.maxMessages)||0}"></label>
          <label><span>Max unique recipients</span><input type="number" min="1" max="500" inputmode="numeric" data-ai-limit="maxRecipients" value="${Number(cfg.limits.maxRecipients)||25}"></label>
        </div></section>
        <section class="ai-authority-summary"><div><small>SERVER AUTHORITY MODEL</small><strong>Normal approval + contingency delegation can coexist</strong><span>Normal sessions can require approval. A qualifying Incident can activate only the exact standing authority the user deliberately published beforehand.</span></div><b>NO AI EXECUTION IN LAB</b></section>
      </main>
    </div>`;
    document.body.append(overlay);
    document.body.classList.add("ai-task-open");
  }

  function collectAi(stepId) {
    const overlay = document.querySelector(`.ai-task-overlay[data-ai-task-overlay="${CSS.escape(stepId)}"]`);
    if (!overlay) return null;
    const selected = selector => [...overlay.querySelectorAll(`${selector}:checked`)].map(input=>input.value || input.dataset.aiContext || input.dataset.aiTool);
    const limits = {};
    overlay.querySelectorAll("[data-ai-limit]").forEach(input => {
      const key = input.dataset.aiLimit;
      const min = Number(input.min) || 0;
      const max = Number(input.max) || 999999;
      limits[key] = Math.min(max, Math.max(min, Number(input.value) || min));
    });
    return {
      objective: overlay.querySelector("[data-ai-objective]")?.value.trim() || "",
      instructions: overlay.querySelector("[data-ai-instructions]")?.value.trim() || "",
      context: selected("[data-ai-context]"),
      tools: selected("[data-ai-tool]"),
      autonomy: overlay.querySelector('input[name="ai-autonomy"]:checked')?.value || "draft_only",
      limits
    };
  }

  function saveAiTask(stepId, announce = false) {
    const config = collectAi(stepId);
    if (!config) return;
    persistAi(stepId, config);
    const textarea = document.querySelector(`[data-action-content="${CSS.escape(stepId)}"]`);
    if (textarea) {
      textarea.value = config.objective;
      textarea.dispatchEvent(new Event("input", {bubbles:true}));
    }
    const topbar = document.querySelector(".ai-task-topbar em");
    if (announce && topbar) topbar.textContent = "Saved locally · execution and authority remain disabled in Lab.";
  }

  function closeAiTask(stepId) {
    saveAiTask(stepId);
    document.querySelector(".ai-task-overlay")?.remove();
    document.body.classList.remove("ai-task-open");
    scheduleEnhance();
  }

  function scheduleEnhance() {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      enhanceActionFamilyGuide();
      enhanceDoCards();
      const emailOverlay = document.querySelector(".content-editor-overlay[data-content-editor]");
      if (emailOverlay) {
        const stepId = emailOverlay.dataset.contentEditor;
        const card = document.querySelector(`.do-card [data-action-content="${CSS.escape(stepId)}"]`)?.closest(".do-card");
        if (actionType(card) === "send email") injectEmailEnvelope(stepId);
      }
    }));
  }

  document.addEventListener("click", event => {
    const compose = event.target.closest("[data-email-compose]");
    if (compose) {
      event.preventDefault();
      const stepId = compose.dataset.emailCompose;
      document.querySelector(`[data-content-open="${CSS.escape(stepId)}"]`)?.click();
      requestAnimationFrame(()=>requestAnimationFrame(()=>injectEmailEnvelope(stepId)));
      return;
    }

    const aiOpen = event.target.closest("[data-ai-open]");
    if (aiOpen) { event.preventDefault(); openAiTask(aiOpen.dataset.aiOpen); return; }

    const aiClose = event.target.closest("[data-ai-close]");
    const aiDone = event.target.closest("[data-ai-done]");
    const aiSave = event.target.closest("[data-ai-save]");
    if (aiClose || aiDone || aiSave) {
      const overlay = event.target.closest(".ai-task-overlay");
      const stepId = overlay?.dataset.aiTaskOverlay;
      if (!stepId) return;
      if (aiSave) saveAiTask(stepId, true); else closeAiTask(stepId);
      return;
    }

    if (event.target.closest("[data-content-mode='preview']")) {
      const overlay = event.target.closest(".content-editor-overlay");
      const stepId = overlay?.dataset.contentEditor;
      if (stepId) requestAnimationFrame(()=>updateEmailPreview(stepId));
    }

    scheduleEnhance();
  });

  document.addEventListener("input", event => {
    const from = event.target.closest("[data-email-from-name]");
    const reply = event.target.closest("[data-email-reply-to]");
    if (from || reply) {
      const overlay = event.target.closest(".content-editor-overlay");
      const stepId = overlay?.dataset.contentEditor;
      if (stepId) updateEmail(stepId, from ? {fromDisplayName:from.value} : {replyTo:reply.value});
    }
  });

  document.addEventListener("change", event => {
    const autonomy = event.target.closest('input[name="ai-autonomy"]');
    if (autonomy) {
      const note = event.target.closest(".ai-definition-card")?.querySelector("[data-ai-contingency-note]");
      if (note) note.classList.toggle("is-active", autonomy.value === "contingency");
      event.target.closest(".ai-autonomy-grid")?.querySelectorAll(".ai-autonomy-card").forEach(card => card.classList.toggle("is-selected", card.contains(autonomy) && autonomy.checked));
    }
  });

  document.addEventListener("cmx:lab-crm-updated", scheduleEnhance);
  window.addEventListener("pageshow", scheduleEnhance);
  window.addEventListener("storage", event => {
    if ([EMAIL_KEY,AI_KEY,AUDIENCE_KEY,CRM_KEY,CONTENT_KEY].includes(event.key)) scheduleEnhance();
  });

  scheduleEnhance();
})();