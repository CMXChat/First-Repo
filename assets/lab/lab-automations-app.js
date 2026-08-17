(() => {
  "use strict";

  const STORAGE_KEY = "cmx-lab-automations-v1";
  const CRM_KEY = "cmx-lab-crm-v1";
  const INVENTORY_KEY = "cmx-lab-inventory-v1";
  const THEME_KEY = "cmx-lab-automations-theme-v1";

  const app = document.getElementById("automationApp");
  if (!app) return;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));

  const TRIGGERS = [
    { id:"grace_start", label:"Grace begins", note:"Start when the switch enters grace.", mark:"GRACE" },
    { id:"grace_expiry", label:"Grace expires", note:"Start at the final grace boundary.", mark:"FINAL" },
    { id:"manual", label:"Manual start", note:"An authorized person starts it.", mark:"MAN" },
    { id:"calendar", label:"Calendar time", note:"Future typed schedule from the backend.", mark:"TIME" }
  ];
  const CONDITIONS = [
    { id:"none", label:"No extra rule", note:"Continue whenever the trigger occurs.", mark:"NONE" },
    { id:"not_acknowledged", label:"Not acknowledged", note:"Continue only if acknowledgement is still missing.", mark:"ACK" },
    { id:"switch_in_grace", label:"Switch is still in grace", note:"Continue only while grace remains active.", mark:"GRACE" },
    { id:"previous_failed", label:"Previous step failed", note:"Use a typed outcome from a prior step.", mark:"FAIL" }
  ];
  const ACTION_TYPES = [
    { id:"notify", label:"Notify a person", note:"Protected notification step.", mark:"NTF" },
    { id:"email", label:"Send email", note:"Typed email step. Lab never sends it.", mark:"EML" },
    { id:"ai_task", label:"AI task", note:"Bounded task using approved records.", mark:"AI" },
    { id:"manual_review", label:"Manual review", note:"Require a human decision before continuing.", mark:"REV" }
  ];
  const WAITS = [
    { id:"none", label:"No wait" },
    { id:"1h", label:"Wait 1 hour" },
    { id:"6h", label:"Wait 6 hours" },
    { id:"24h", label:"Wait 24 hours" }
  ];
  const REPEATS = [
    { id:"none", label:"Do not repeat" },
    { id:"daily", label:"Repeat daily" },
    { id:"until_ack", label:"Repeat until acknowledged" }
  ];
  const OUTCOMES = [
    { id:"end", label:"End workflow", note:"Stop after this path completes.", mark:"END" },
    { id:"success", label:"Continue on success", note:"Move to the next typed step after success.", mark:"OK" },
    { id:"no_ack", label:"Escalate if not acknowledged", note:"Follow a future no-acknowledgement route.", mark:"ACK" },
    { id:"review", label:"Require review", note:"Stop for approval before continuing.", mark:"REV" }
  ];
  const STEPS = [
    { key:"basics", short:"START", label:"Name" },
    { key:"when", short:"WHEN", label:"Trigger" },
    { key:"if", short:"IF", label:"Rule" },
    { key:"do", short:"DO", label:"Actions" },
    { key:"wait", short:"WAIT", label:"Timing" },
    { key:"then", short:"THEN", label:"Outcome" },
    { key:"review", short:"REVIEW", label:"Review" }
  ];

  const state = { view:"dashboard", tab:"Draft", step:0, editing:null, dirty:false, saveTimer:null };
  let data = loadData();

  function option(list, id){ return list.find(item => item.id === id) || list[0]; }
  function now(){ return new Date().toISOString(); }
  function makeId(prefix="auto"){ return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`; }

  function blankAction(){
    return { id:makeId("step"), type:"notify", targetRef:null, targetLabel:"", content:"" };
  }

  function blankAutomation(){
    return {
      id:makeId(), name:"", description:"", status:"Draft", trigger:"grace_start", condition:"none",
      action:"notify", target:"", content:"", actions:[blankAction()], wait:"none", repeat:"none", outcome:"end",
      editorStep:0, updatedAt:now()
    };
  }

  function seedData(){
    return { version:1, automations:[
      {
        ...blankAutomation(), id:"auto-grace-escalation", name:"Grace escalation",
        description:"Escalate a missed check in through an acknowledgement path.", trigger:"grace_start", condition:"not_acknowledged",
        action:"notify", target:"Primary contact", content:"Ask the approved contact to acknowledge the contingency notice.",
        actions:[{ id:"step-grace-notify", type:"notify", targetRef:null, targetLabel:"Primary contact", content:"Ask the approved contact to acknowledge the contingency notice." }],
        wait:"6h", repeat:"none", outcome:"no_ack", updatedAt:new Date(Date.now()-42*60000).toISOString()
      },
      {
        ...blankAutomation(), id:"auto-briefing-draft", name:"Continuity briefing",
        description:"Prepare a bounded briefing from approved records for human review.", trigger:"manual", condition:"none",
        action:"ai_task", target:"Approved continuity records", content:"Summarize approved records and flag missing information. Do not contact anyone.",
        actions:[{ id:"step-brief-ai", type:"ai_task", targetRef:null, targetLabel:"Approved continuity records", content:"Summarize approved records and flag missing information. Do not contact anyone." }],
        wait:"none", repeat:"none", outcome:"review", updatedAt:new Date(Date.now()-3*3600000).toISOString()
      }
    ]};
  }

  function normalizeAutomation(item){
    const draft = { ...blankAutomation(), ...item };
    if (!Array.isArray(draft.actions) || !draft.actions.length) {
      draft.actions = [{ id:makeId("step"), type:draft.action || "notify", targetRef:null, targetLabel:draft.target || "", content:draft.content || "" }];
    }
    draft.actions = draft.actions.map(step => ({ ...blankAction(), ...step, id:step.id || makeId("step") }));
    draft.editorStep = Number.isInteger(draft.editorStep) ? Math.max(0, Math.min(STEPS.length-1,draft.editorStep)) : 0;
    return draft;
  }

  function loadData(){
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored?.version === 1 && Array.isArray(stored.automations)) {
        return { version:1, automations:stored.automations.map(normalizeAutomation) };
      }
    } catch {}
    const seeded = seedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  function persist(){
    if (state.editing) {
      state.editing.updatedAt = now();
      state.editing.editorStep = state.step;
      syncLegacyFields(state.editing);
      const index = data.automations.findIndex(item => item.id === state.editing.id);
      if (index >= 0) data.automations[index] = structuredCloneSafe(state.editing);
      else data.automations.unshift(structuredCloneSafe(state.editing));
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    state.dirty = false;
    setSaveState("Saved just now", "saved");
  }

  function structuredCloneSafe(value){ return JSON.parse(JSON.stringify(value)); }

  function syncLegacyFields(item){
    const first = item.actions?.[0] || blankAction();
    item.action = first.type || "notify";
    item.target = first.targetLabel || "";
    item.content = first.content || "";
  }

  function scheduleAutosave(){
    state.dirty = true;
    setSaveState("Unsaved changes", "dirty");
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => { persist(); }, 650);
  }

  function setSaveState(text, kind=""){
    const node = document.querySelector("#saveState");
    if (!node) return;
    node.textContent = text;
    node.className = `save-state ${kind ? `is-${kind}` : ""}`;
  }

  function relativeTime(iso){
    const age = Math.max(0,Date.now()-new Date(iso).getTime());
    if (age < 60000) return "just now";
    if (age < 3600000) return `${Math.floor(age/60000)}m ago`;
    if (age < 86400000) return `${Math.floor(age/3600000)}h ago`;
    return `${Math.floor(age/86400000)}d ago`;
  }

  function loadTargets(){
    const targets = [];
    try {
      const crm = JSON.parse(localStorage.getItem(CRM_KEY));
      (crm?.people || []).forEach(x => targets.push({kind:"person",id:x.id,label:x.name,meta:x.role||x.relationship||"Person"}));
      (crm?.organizations || []).forEach(x => targets.push({kind:"organization",id:x.id,label:x.name,meta:x.type||"Organization"}));
    } catch {}
    try {
      const inv = JSON.parse(localStorage.getItem(INVENTORY_KEY));
      (inv?.documents || []).forEach(x => targets.push({kind:"document",id:x.id,label:x.title,meta:x.category||"Document"}));
      (inv?.assets || []).forEach(x => targets.push({kind:"asset",id:x.id,label:x.name,meta:x.type||"Digital asset"}));
    } catch {}
    return targets;
  }

  function targetValue(ref){ return ref?.kind && ref?.id ? `${ref.kind}:${ref.id}` : ""; }
  function parseTarget(value){
    if (!value) return null;
    const [kind,...rest] = value.split(":");
    const id = rest.join(":");
    const found = loadTargets().find(t => t.kind===kind && t.id===id);
    return found ? { kind:found.kind,id:found.id } : null;
  }
  function targetLabel(ref){
    if (!ref) return "";
    return loadTargets().find(t => t.kind===ref.kind && t.id===ref.id)?.label || "";
  }

  function applyTheme(theme){
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_KEY,next);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === "light" ? "#f5f8fb" : "#05080d";
  }

  function shell(content){
    return `<header class="topbar">
      <a class="brand" href="/lab/" aria-label="Back to Check In Lab">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-copy"><strong>CHECK IN</strong><small>LAB · AUTOMATIONS</small></span>
      </a>
      <div class="top-actions"><span class="pill">ISOLATED · EXECUTION OFF</span><button class="icon-btn theme-label" type="button" data-theme-toggle aria-label="Toggle theme"></button></div>
    </header>${content}`;
  }

  function flowMarkup(item){
    const first = item.actions?.[0] || {type:item.action};
    const nodes = [
      ["when","WHEN",option(TRIGGERS,item.trigger).label],
      ["if","IF",option(CONDITIONS,item.condition).label],
      ["do","DO",`${item.actions?.length||1} action${(item.actions?.length||1)===1?"":"s"}`],
      ["wait","WAIT",item.wait==="none"?"None":option(WAITS,item.wait).label.replace(/^Wait /,"")],
      ["then","THEN",option(OUTCOMES,item.outcome).label]
    ];
    return `<div class="flow">${nodes.map(([tone,key,value])=>`<span class="flow-node tone-${tone}"><small>${key}</small><strong>${esc(value)}</strong></span>`).join("")}</div>`;
  }

  function automationCard(item){
    return `<button class="automation-card" type="button" data-open="${esc(item.id)}">
      <span class="card-top"><span class="card-title"><small>AUTOMATION ${esc(item.status.toUpperCase())}</small><strong>${esc(item.name||"Untitled automation")}</strong></span><em class="state-chip">${esc(item.status.toUpperCase())}</em></span>
      <p>${esc(item.description || summary(item))}</p>${flowMarkup(item)}
      <span class="card-foot"><b>${item.status === "Draft" ? "LOCAL DRAFT" : "PROTOTYPE"}</b><small>Updated ${esc(relativeTime(item.updatedAt))}</small></span>
    </button>`;
  }

  function summary(item){
    const actions = (item.actions||[]).map(step => option(ACTION_TYPES,step.type).label).join(" → ") || option(ACTION_TYPES,item.action).label;
    const ifText = item.condition === "none" ? "" : ` If ${option(CONDITIONS,item.condition).label.toLowerCase()},`;
    const waitText = item.wait === "none" ? "" : ` ${option(WAITS,item.wait).label}.`;
    const repeatText = item.repeat === "none" ? "" : ` ${option(REPEATS,item.repeat).label}.`;
    return `When ${option(TRIGGERS,item.trigger).label.toLowerCase()}.${ifText} ${actions}.${waitText}${repeatText} Then ${option(OUTCOMES,item.outcome).label.toLowerCase()}.`.replace(/\s+/g," ").trim();
  }

  function renderDashboard(){
    state.view = "dashboard";
    const drafts = data.automations.filter(x=>x.status==="Draft").length;
    const published = data.automations.filter(x=>x.status==="Published").length;
    const archived = data.automations.filter(x=>x.status==="Archived").length;
    const visible = data.automations.filter(x=>x.status===state.tab);
    app.innerHTML = shell(`<main class="shell">
      <section class="hero"><div><span class="eyebrow">AUTOMATION CONTROL</span><h1>Automations</h1><p>Design private workflows as readable steps. Drafts save here in the browser while the typed backend is still being built.</p></div><button class="primary" type="button" data-new>＋ New automation</button></section>
      <section class="status-strip"><div class="status-card"><small>DRAFTS</small><strong>${drafts}</strong></div><div class="status-card"><small>PUBLISHED</small><strong>${published} · backend pending</strong></div><div class="status-card is-safe"><small>EXECUTION</small><strong>OFF IN LAB</strong></div></section>
      <nav class="tabs" aria-label="Automation states">${[["Draft",drafts],["Published",published],["Archived",archived]].map(([name,count])=>`<button type="button" class="${state.tab===name?"is-active":""}" data-tab="${name}">${name}s · ${count}</button>`).join("")}</nav>
      <div class="section-head"><strong>${state.tab}s</strong><small>${state.tab==="Draft"?"Autosaved locally":"Lifecycle UI preview only"}</small></div>
      <section class="automation-list">${visible.length?visible.map(automationCard).join(""):`<div class="empty"><strong>No ${state.tab.toLowerCase()} automations</strong><span>${state.tab==="Draft"?"Create a draft to start shaping the workflow.":"The backend lifecycle will make this state real later."}</span></div>`}</section>
    </main>`);
    bindCommon();
  }

  function renderEditor(){
    state.view = "editor";
    const item = state.editing;
    if (!item) return renderDashboard();
    app.innerHTML = shell(`<main class="editor-page">
      <header class="editor-head"><div class="editor-title"><div class="editor-name"><small>AUTOMATION DRAFT</small><strong>${esc(item.name||"Untitled automation")}</strong><span id="saveState" class="save-state is-saved">Saved</span></div><button class="icon-btn" type="button" data-close aria-label="Close editor">×</button></div>
      <div class="step-rail-wrap"><nav class="step-rail">${STEPS.map((step,index)=>`<button type="button" class="step-chip ${index===state.step?"is-current":""} ${index<state.step?"is-complete":""}" data-step="${index}"><b>${index<state.step?"✓":String(index+1).padStart(2,"0")}</b><span><small>${step.short}</small><em>${step.label}</em></span></button>`).join("")}</nav></div></header>
      <div class="editor-body">${renderStep(item)}</div>
      <footer class="editor-footer"><div class="footer-inner"><button class="back-btn" type="button" data-back ${state.step===0?"disabled":""}>Back</button><button class="save-btn" type="button" data-save>Save draft</button><button class="continue-btn ${state.step===STEPS.length-1?"publish-disabled":""}" type="button" data-continue>${state.step===STEPS.length-1?"Publish unavailable":"Continue"}</button></div></footer>
    </main>`);
    bindCommon();
  }

  function renderStep(item){
    if (state.step===0) return `<section class="step-section"><header class="step-heading"><small>START</small><h2>Name the automation</h2><p>Keep the name short enough that you can recognize it in a list.</p></header><label class="field"><span>Automation name</span><input data-bind="name" maxlength="80" value="${esc(item.name)}" placeholder="Grace escalation" /></label><label class="field"><span>Description · optional</span><textarea data-bind="description" maxlength="240" placeholder="What is this workflow for?">${esc(item.description)}</textarea></label></section>`;
    if (state.step===1) return choiceStep("WHEN","What starts this workflow?","Choose one typed trigger. The backend will validate the real event later.",TRIGGERS,"trigger",item.trigger);
    if (state.step===2) return choiceStep("IF","Does a rule have to be true?","Optional. Keep conditions explicit and typed.",CONDITIONS,"condition",item.condition);
    if (state.step===3) return renderDo(item);
    if (state.step===4) return renderTiming(item);
    if (state.step===5) return choiceStep("THEN","What happens after this path?","Choose the intended outcome or handoff.",OUTCOMES,"outcome",item.outcome);
    return renderReview(item);
  }

  function choiceStep(kicker,title,copy,list,field,current){
    return `<section class="step-section"><header class="step-heading"><small>${kicker}</small><h2>${title}</h2><p>${copy}</p></header><div class="choice-list">${list.map(x=>`<button type="button" class="choice ${current===x.id?"is-selected":""}" data-choice data-field="${field}" data-value="${esc(x.id)}"><span class="choice-mark">${esc(x.mark||"•")}</span><span class="choice-copy"><strong>${esc(x.label)}</strong><small>${esc(x.note||"")}</small></span><span class="choice-check">${current===x.id?"✓":""}</span></button>`).join("")}</div></section>`;
  }

  function targetOptions(currentRef,currentLabel){
    const targets = loadTargets();
    let html = `<option value="">${targets.length?"Choose a protected target":"No Lab People / Records yet"}</option>`;
    html += targets.map(t=>`<option value="${esc(`${t.kind}:${t.id}`)}" ${targetValue(currentRef)===`${t.kind}:${t.id}`?"selected":""}>${esc(t.label)} · ${esc(t.meta)}</option>`).join("");
    if (!currentRef && currentLabel) html += `<option value="legacy" selected>${esc(currentLabel)} · legacy text target</option>`;
    return html;
  }

  function renderDo(item){
    return `<section class="step-section"><header class="step-heading"><small>DO</small><h2>What should happen?</h2><p>Add one or more action steps. Each future production step will resolve stable protected target IDs.</p></header><div class="do-list">${item.actions.map((step,index)=>`<article class="do-card" data-do-card="${esc(step.id)}"><header class="do-card-head"><span><small>DO ${String(index+1).padStart(2,"0")}</small><strong>${esc(option(ACTION_TYPES,step.type).label)}</strong></span>${item.actions.length>1?`<button class="remove-step" type="button" data-remove-action="${esc(step.id)}">Remove</button>`:""}</header><div class="split"><label class="field"><span>Action type</span><select data-action-bind="type" data-action-id="${esc(step.id)}">${ACTION_TYPES.map(x=>`<option value="${x.id}" ${step.type===x.id?"selected":""}>${esc(x.label)}</option>`).join("")}</select></label><label class="field"><span>Target</span><select data-action-target data-action-id="${esc(step.id)}">${targetOptions(step.targetRef,step.targetLabel)}</select></label></div><label class="field"><span>Content / instruction</span><textarea data-action-bind="content" data-action-id="${esc(step.id)}" placeholder="What should this step do?">${esc(step.content)}</textarea></label></article>`).join("")}</div><button class="add-step" type="button" data-add-action>＋ Add another DO step</button><div class="backend-note"><strong>Backend handoff:</strong> each DO step becomes a typed Action definition/reference with a stable target ID. No provider secret or raw credential belongs in this draft.</div></section>`;
  }

  function renderTiming(item){
    return `<section class="step-section"><header class="step-heading"><small>WAIT / REPEAT</small><h2>Does timing happen between steps?</h2><p>Keep delay and recurrence separate. The real backend will persist due timestamps instead of relying on the browser.</p></header><div class="timing-grid"><div class="timing-block"><h3>Wait</h3><small>Optional delay before continuing.</small><div class="choice-list">${WAITS.map(x=>compactChoice(x,"wait",item.wait)).join("")}</div></div><div class="timing-block"><h3>Repeat</h3><small>Optional cadence.</small><div class="choice-list">${REPEATS.map(x=>compactChoice(x,"repeat",item.repeat)).join("")}</div></div></div></section>`;
  }

  function compactChoice(x,field,current){
    return `<button type="button" class="choice ${current===x.id?"is-selected":""}" data-choice data-field="${field}" data-value="${esc(x.id)}"><span class="choice-mark">${field==="wait"?"⌛":"↻"}</span><span class="choice-copy"><strong>${esc(x.label)}</strong></span><span class="choice-check">${current===x.id?"✓":""}</span></button>`;
  }

  function renderReview(item){
    const actions = item.actions.map((step,index)=>`${index+1}. ${option(ACTION_TYPES,step.type).label}${step.targetLabel?` → ${step.targetLabel}`:""}`).join(" · ");
    return `<section class="step-section"><header class="step-heading"><small>REVIEW</small><h2>Read it like a person</h2><p>This is what the typed backend should eventually validate and publish as an immutable version.</p></header><article class="review-card"><h3>${esc(item.name||"Untitled automation")}</h3><p class="review-sentence">${esc(summary(item))}</p><div class="review-details"><div class="review-row"><small>WHEN</small><span>${esc(option(TRIGGERS,item.trigger).label)}</span></div><div class="review-row"><small>IF</small><span>${esc(option(CONDITIONS,item.condition).label)}</span></div><div class="review-row"><small>DO</small><span>${esc(actions||"No actions")}</span></div><div class="review-row"><small>WAIT</small><span>${esc(option(WAITS,item.wait).label)} · ${esc(option(REPEATS,item.repeat).label)}</span></div><div class="review-row"><small>THEN</small><span>${esc(option(OUTCOMES,item.outcome).label)}</span></div></div><div class="backend-note"><strong>Publishing is deliberately unavailable.</strong> Phase 2A must add the real Automation/AutomationVersion models, registries, validation and protected publish API first. Your draft is still autosaved locally.</div></article></section>`;
  }

  function openEditor(id){
    const found = data.automations.find(x=>x.id===id);
    state.editing = normalizeAutomation(structuredCloneSafe(found || blankAutomation()));
    state.step = state.editing.editorStep || 0;
    state.dirty = false;
    renderEditor();
  }

  function mutate(field,value){
    state.editing[field] = value;
    scheduleAutosave();
    renderEditor();
    setSaveState("Unsaved changes","dirty");
  }

  function bindCommon(){
    document.querySelectorAll("[data-theme-toggle]").forEach(btn=>btn.addEventListener("click",()=>applyTheme(document.documentElement.dataset.theme==="light"?"dark":"light")));
    document.querySelector("[data-new]")?.addEventListener("click",()=>openEditor(null));
    document.querySelectorAll("[data-open]").forEach(btn=>btn.addEventListener("click",()=>openEditor(btn.dataset.open)));
    document.querySelectorAll("[data-tab]").forEach(btn=>btn.addEventListener("click",()=>{state.tab=btn.dataset.tab;renderDashboard();}));
    document.querySelector("[data-close]")?.addEventListener("click",()=>{ if(state.dirty) persist(); state.editing=null; renderDashboard(); });
    document.querySelector("[data-save]")?.addEventListener("click",()=>{ persist(); toast("Draft saved"); });
    document.querySelector("[data-back]")?.addEventListener("click",()=>{ if(state.step>0){ state.step--; if(state.editing) state.editing.editorStep=state.step; scheduleAutosave(); renderEditor(); }});
    document.querySelector("[data-continue]")?.addEventListener("click",()=>{ if(state.step<STEPS.length-1){ state.step++; if(state.editing) state.editing.editorStep=state.step; scheduleAutosave(); renderEditor(); } });
    document.querySelectorAll("[data-step]").forEach(btn=>btn.addEventListener("click",()=>{state.step=Number(btn.dataset.step)||0; if(state.editing) state.editing.editorStep=state.step; scheduleAutosave(); renderEditor();}));
    document.querySelectorAll("[data-bind]").forEach(el=>el.addEventListener("input",()=>{state.editing[el.dataset.bind]=el.value;scheduleAutosave(); const title=document.querySelector(".editor-name strong"); if(title && el.dataset.bind==="name") title.textContent=el.value||"Untitled automation";}));
    document.querySelectorAll("[data-choice]").forEach(btn=>btn.addEventListener("click",()=>mutate(btn.dataset.field,btn.dataset.value)));
    document.querySelectorAll("[data-action-bind]").forEach(el=>el.addEventListener("input",()=>{const step=state.editing.actions.find(x=>x.id===el.dataset.actionId);if(!step)return;step[el.dataset.actionBind]=el.value;scheduleAutosave(); if(el.tagName==="SELECT")renderEditor();}));
    document.querySelectorAll("[data-action-target]").forEach(el=>el.addEventListener("change",()=>{const step=state.editing.actions.find(x=>x.id===el.dataset.actionId);if(!step)return;if(el.value==="legacy")return;step.targetRef=parseTarget(el.value);step.targetLabel=targetLabel(step.targetRef);scheduleAutosave();renderEditor();}));
    document.querySelector("[data-add-action]")?.addEventListener("click",()=>{state.editing.actions.push(blankAction());scheduleAutosave();renderEditor();});
    document.querySelectorAll("[data-remove-action]").forEach(btn=>btn.addEventListener("click",()=>{if(state.editing.actions.length<=1)return;state.editing.actions=state.editing.actions.filter(x=>x.id!==btn.dataset.removeAction);scheduleAutosave();renderEditor();}));
  }

  function toast(message){
    document.querySelector(".toast")?.remove();
    const node=document.createElement("div");node.className="toast";node.textContent=message;document.body.append(node);setTimeout(()=>node.remove(),1500);
  }

  window.addEventListener("beforeunload",()=>{ if(state.dirty) persist(); });
  window.addEventListener("storage",event=>{ if(event.key===STORAGE_KEY && state.view==="dashboard"){ data=loadData(); renderDashboard(); } });

  applyTheme(localStorage.getItem(THEME_KEY) || "dark");
  renderDashboard();
})();
