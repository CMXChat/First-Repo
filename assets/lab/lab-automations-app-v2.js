(() => {
  "use strict";

  const STORAGE_KEY = "cmx-lab-automations-v1";
  const CRM_KEY = "cmx-lab-crm-v1";
  const INVENTORY_KEY = "cmx-lab-inventory-v1";
  const THEME_KEY = "cmx-lab-automations-theme-v1";
  const app = document.getElementById("automationApp");
  if (!app) return;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
  const clone = value => JSON.parse(JSON.stringify(value));
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const TRIGGERS = [
    {id:"grace_start",label:"Grace begins",note:"Start when the switch enters grace.",mark:"GRACE"},
    {id:"grace_expiry",label:"Grace expires",note:"Start at the final grace boundary.",mark:"FINAL"},
    {id:"manual",label:"Manual start",note:"An authorized person starts it.",mark:"MAN"},
    {id:"calendar",label:"Calendar time",note:"Start from a future typed schedule.",mark:"TIME"}
  ];
  const CONDITIONS = [
    {id:"none",label:"No extra rule",note:"Continue whenever the trigger occurs.",mark:"NONE"},
    {id:"not_acknowledged",label:"Not acknowledged",note:"Continue only if acknowledgement is still missing.",mark:"ACK"},
    {id:"switch_in_grace",label:"Switch is still in grace",note:"Continue only while grace remains active.",mark:"GRACE"},
    {id:"previous_failed",label:"An earlier action failed",note:"Continue only when a previous DO action reports failure.",mark:"FAIL"}
  ];
  const ACTION_TYPES = [
    {id:"notify",label:"Notify a person",note:"Protected notification step.",mark:"NTF"},
    {id:"email",label:"Send email",note:"Typed email step. Lab never sends it.",mark:"EML"},
    {id:"ai_task",label:"AI task",note:"Bounded task using approved records.",mark:"AI"},
    {id:"manual_review",label:"Manual review",note:"Require a human decision before continuing.",mark:"REV"}
  ];
  const OUTCOMES = [
    {id:"end",label:"End workflow",note:"Stop after this path completes.",mark:"END"},
    {id:"success",label:"Continue on success",note:"Move to the next typed step after success.",mark:"OK"},
    {id:"no_ack",label:"Escalate if not acknowledged",note:"Follow a future no-acknowledgement route.",mark:"ACK"},
    {id:"review",label:"Require review",note:"Stop for approval before continuing.",mark:"REV"}
  ];
  const STEPS = [
    {short:"START",label:"Name"},{short:"WHEN",label:"Trigger"},{short:"IF",label:"Rule"},
    {short:"DO",label:"Actions"},{short:"WAIT",label:"Timing"},{short:"THEN",label:"Outcome"},{short:"REVIEW",label:"Review"}
  ];
  const TIMEZONES = [...new Set([localZone,"UTC","America/New_York","America/Chicago","America/Denver","America/Los_Angeles","Europe/London","Pacific/Auckland"])];
  const REPEAT_UNITS = ["minutes","hours","days","weeks","months","years"];

  const state = {view:"dashboard",tab:"Draft",step:0,editing:null,dirty:false,saveTimer:null,openDropdown:null};
  let data = loadData();

  function option(list,id){ return list.find(x=>x.id===id) || list[0]; }
  function now(){ return new Date().toISOString(); }
  function makeId(prefix="auto"){ return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`; }
  function blankAction(){ return {id:makeId("step"),type:"notify",targetRef:null,targetLabel:"",content:""}; }
  function blankTiming(){ return {mode:"none",delay:{days:0,hours:0,minutes:0},at:{date:"",time:"",timezone:localZone}}; }
  function blankRepeat(){ return {mode:"none",every:1,unit:"days",timezone:localZone}; }
  function blankAutomation(){
    return {id:makeId(),name:"",description:"",status:"Draft",trigger:"grace_start",condition:"none",action:"notify",target:"",content:"",actions:[blankAction()],wait:"none",repeat:"none",timing:blankTiming(),repeatConfig:blankRepeat(),outcome:"end",editorStep:0,updatedAt:now()};
  }

  function legacyTiming(wait){
    const t = blankTiming();
    if (wait === "1h") { t.mode="delay"; t.delay.hours=1; }
    if (wait === "6h") { t.mode="delay"; t.delay.hours=6; }
    if (wait === "24h") { t.mode="delay"; t.delay.days=1; }
    return t;
  }
  function legacyRepeat(repeat){
    if (repeat === "daily") return {mode:"daily",every:1,unit:"days",timezone:localZone};
    if (repeat === "until_ack") return {mode:"until_ack",every:1,unit:"days",timezone:localZone};
    return blankRepeat();
  }
  function normalizeAutomation(item){
    const draft = {...blankAutomation(),...item};
    if (!Array.isArray(draft.actions) || !draft.actions.length) draft.actions=[{...blankAction(),type:draft.action||"notify",targetLabel:draft.target||"",content:draft.content||""}];
    draft.actions=draft.actions.map(x=>({...blankAction(),...x,id:x.id||makeId("step")}));
    draft.timing = item?.timing ? {...blankTiming(),...item.timing,delay:{...blankTiming().delay,...item.timing.delay},at:{...blankTiming().at,...item.timing.at}} : legacyTiming(item?.wait);
    draft.repeatConfig = item?.repeatConfig ? {...blankRepeat(),...item.repeatConfig} : legacyRepeat(item?.repeat);
    if (!REPEAT_UNITS.includes(draft.repeatConfig.unit)) draft.repeatConfig.unit="days";
    if (!draft.repeatConfig.timezone) draft.repeatConfig.timezone=localZone;
    draft.editorStep=Number.isInteger(draft.editorStep)?Math.max(0,Math.min(6,draft.editorStep)):0;
    return draft;
  }
  function seedData(){
    const a=blankAutomation(); a.id="auto-grace-escalation"; a.name="Grace escalation"; a.description="Escalate a missed check in through an acknowledgement path."; a.trigger="grace_start"; a.condition="not_acknowledged"; a.actions=[{id:"step-grace-notify",type:"notify",targetRef:null,targetLabel:"Primary contact",content:"Ask the approved contact to acknowledge the contingency notice."}]; a.timing={mode:"delay",delay:{days:0,hours:6,minutes:0},at:{date:"",time:"",timezone:localZone}}; a.outcome="no_ack"; a.updatedAt=new Date(Date.now()-42*60000).toISOString();
    const b=blankAutomation(); b.id="auto-briefing-draft"; b.name="Continuity briefing"; b.description="Prepare a bounded briefing from approved records for human review."; b.trigger="manual"; b.actions=[{id:"step-brief-ai",type:"ai_task",targetRef:null,targetLabel:"Approved continuity records",content:"Summarize approved records and flag missing information. Do not contact anyone."}]; b.outcome="review"; b.updatedAt=new Date(Date.now()-3*3600000).toISOString();
    return {version:1,automations:[a,b]};
  }
  function loadData(){
    try{ const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)); if(stored?.version===1&&Array.isArray(stored.automations)) return {version:1,automations:stored.automations.map(normalizeAutomation)}; }catch{}
    const seeded=seedData(); localStorage.setItem(STORAGE_KEY,JSON.stringify(seeded)); return seeded;
  }
  function syncLegacy(item){
    const first=item.actions[0]||blankAction(); item.action=first.type; item.target=first.targetLabel||""; item.content=first.content||"";
    const d=item.timing.delay||{}; item.wait=item.timing.mode==="delay"&&d.days===0&&d.minutes===0&&[1,6].includes(Number(d.hours))?`${d.hours}h`:item.timing.mode==="delay"&&Number(d.days)===1&&Number(d.hours)===0&&Number(d.minutes)===0?"24h":"none";
    item.repeat=item.repeatConfig.mode==="daily"?"daily":item.repeatConfig.mode==="until_ack"?"until_ack":"none";
  }
  function persist(){
    if(state.editing){ state.editing.updatedAt=now(); state.editing.editorStep=state.step; syncLegacy(state.editing); const i=data.automations.findIndex(x=>x.id===state.editing.id); if(i>=0)data.automations[i]=clone(state.editing); else data.automations.unshift(clone(state.editing)); }
    localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); state.dirty=false; setSaveState("Saved just now","saved");
  }
  function scheduleAutosave(){ state.dirty=true; setSaveState("Unsaved changes","dirty"); clearTimeout(state.saveTimer); state.saveTimer=setTimeout(persist,650); }
  function setSaveState(text,kind=""){ const node=document.getElementById("saveState"); if(node){node.textContent=text;node.className=`save-state ${kind?`is-${kind}`:""}`;} }

  function loadTargets(){
    const out=[];
    try{const crm=JSON.parse(localStorage.getItem(CRM_KEY));(crm?.people||[]).forEach(x=>out.push({kind:"person",id:x.id,label:x.name,meta:x.role||x.relationship||"Person"}));(crm?.organizations||[]).forEach(x=>out.push({kind:"organization",id:x.id,label:x.name,meta:x.type||"Organization"}));}catch{}
    try{const inv=JSON.parse(localStorage.getItem(INVENTORY_KEY));(inv?.documents||[]).forEach(x=>out.push({kind:"document",id:x.id,label:x.title,meta:x.category||"Document"}));(inv?.assets||[]).forEach(x=>out.push({kind:"asset",id:x.id,label:x.name,meta:x.type||"Digital asset"}));}catch{}
    return out;
  }
  function targetKey(ref){return ref?.kind&&ref?.id?`${ref.kind}:${ref.id}`:"";}
  function targetFromKey(key){const [kind,...parts]=String(key).split(":");const id=parts.join(":");const x=loadTargets().find(t=>t.kind===kind&&t.id===id);return x?{kind:x.kind,id:x.id}:null;}
  function targetLabel(ref){return loadTargets().find(t=>t.kind===ref?.kind&&t.id===ref?.id)?.label||"";}
  function relativeTime(iso){const age=Math.max(0,Date.now()-new Date(iso).getTime());if(age<60000)return"just now";if(age<3600000)return`${Math.floor(age/60000)}m ago`;if(age<86400000)return`${Math.floor(age/3600000)}h ago`;return`${Math.floor(age/86400000)}d ago`;}

  function applyTheme(theme){const next=theme==="light"?"light":"dark";document.documentElement.dataset.theme=next;localStorage.setItem(THEME_KEY,next);const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=next==="light"?"#f5f8fb":"#05080d";}
  function shell(content){return `<header class="topbar"><a class="brand" href="/lab/" aria-label="Back to Check In Lab"><span class="brand-mark"></span><span class="brand-copy"><strong>CHECK IN</strong><small>LAB · AUTOMATIONS</small></span></a><div class="top-actions"><span class="pill">ISOLATED · EXECUTION OFF</span><button class="icon-btn theme-label" type="button" data-theme-toggle aria-label="Toggle theme"></button></div></header>${content}`;}

  function timingLabel(item){
    const t=item.timing;
    if(!t||t.mode==="none") return "No wait";
    if(t.mode==="exact") return t.at.date&&t.at.time?`${t.at.date} · ${t.at.time} · ${t.at.timezone}`:"Exact time not set";
    const p=[]; if(Number(t.delay.days))p.push(`${t.delay.days}d`);if(Number(t.delay.hours))p.push(`${t.delay.hours}h`);if(Number(t.delay.minutes))p.push(`${t.delay.minutes}m`);return p.length?`Wait ${p.join(" ")}`:"Custom delay";
  }
  function repeatLabel(item){const r=item.repeatConfig;if(!r||r.mode==="none")return"Do not repeat";if(r.mode==="daily")return"Repeat daily";if(r.mode==="weekly")return"Repeat weekly";if(r.mode==="until_ack")return"Repeat until acknowledged";const zone=["months","years"].includes(r.unit)?` · ${r.timezone||localZone}`:"";return`Every ${r.every||1} ${r.unit||"days"}${zone}`;}
  function summary(item){const acts=item.actions.map(x=>option(ACTION_TYPES,x.type).label).join(" → ");const ifText=item.condition==="none"?"":` If ${option(CONDITIONS,item.condition).label.toLowerCase()},`;return `When ${option(TRIGGERS,item.trigger).label.toLowerCase()}.${ifText} ${acts}. ${timingLabel(item)}. ${repeatLabel(item)}. Then ${option(OUTCOMES,item.outcome).label.toLowerCase()}.`.replace(/\s+/g," ").trim();}
  function flowMarkup(item){const nodes=[["when","WHEN",option(TRIGGERS,item.trigger).label],["if","IF",option(CONDITIONS,item.condition).label],["do","DO",`${item.actions.length} action${item.actions.length===1?"":"s"}`],["wait","WAIT",timingLabel(item)],["then","THEN",option(OUTCOMES,item.outcome).label]];return `<div class="flow">${nodes.map(([tone,k,v])=>`<span class="flow-node tone-${tone}"><small>${k}</small><strong>${esc(v)}</strong></span>`).join("")}</div>`;}
  function automationCard(item){return `<button class="automation-card" type="button" data-open="${esc(item.id)}"><span class="card-top"><span class="card-title"><small>AUTOMATION ${esc(item.status.toUpperCase())}</small><strong>${esc(item.name||"Untitled automation")}</strong></span><em class="state-chip">${esc(item.status.toUpperCase())}</em></span><p>${esc(item.description||summary(item))}</p>${flowMarkup(item)}<span class="card-foot"><b>${item.status==="Draft"?"LOCAL DRAFT":"PROTOTYPE"}</b><small>Updated ${esc(relativeTime(item.updatedAt))}</small></span></button>`;}

  function renderDashboard(){
    state.view="dashboard";state.openDropdown=null;const counts={Draft:0,Published:0,Archived:0};data.automations.forEach(x=>counts[x.status]=(counts[x.status]||0)+1);const visible=data.automations.filter(x=>x.status===state.tab);
    app.innerHTML=shell(`<main class="shell"><section class="hero"><div><span class="eyebrow">AUTOMATION CONTROL</span><h1>Automations</h1><p>Design private workflows as readable steps. Drafts autosave locally while the typed backend is being built.</p></div><button class="primary" type="button" data-new>＋ New automation</button></section><section class="status-strip"><div class="status-card"><small>DRAFTS</small><strong>${counts.Draft}</strong></div><div class="status-card"><small>PUBLISHED</small><strong>${counts.Published} · backend pending</strong></div><div class="status-card is-safe"><small>EXECUTION</small><strong>OFF IN LAB</strong></div></section><nav class="tabs">${["Draft","Published","Archived"].map(n=>`<button type="button" class="${state.tab===n?"is-active":""}" data-tab="${n}">${n}s · ${counts[n]}</button>`).join("")}</nav><div class="section-head"><strong>${state.tab}s</strong><small>${state.tab==="Draft"?"Autosaved locally":"Lifecycle preview only"}</small></div><section class="automation-list">${visible.length?visible.map(automationCard).join(""):`<div class="empty"><strong>No ${state.tab.toLowerCase()} automations</strong><span>Create or publish one later.</span></div>`}</section></main>`);bindCommon();
  }
  function renderEditor(){
    state.view="editor";state.openDropdown=null;const item=state.editing;if(!item)return renderDashboard();
    app.innerHTML=shell(`<main class="editor-page"><header class="editor-head"><div class="editor-title"><div class="editor-name"><small>AUTOMATION DRAFT</small><strong>${esc(item.name||"Untitled automation")}</strong><span id="saveState" class="save-state is-saved">Saved</span></div><button class="icon-btn" type="button" data-close aria-label="Close editor">×</button></div><div class="step-rail-wrap"><nav class="step-rail">${STEPS.map((s,i)=>`<button type="button" class="step-chip ${i===state.step?"is-current":""} ${i<state.step?"is-complete":""}" data-step="${i}"><b>${i<state.step?"✓":String(i+1).padStart(2,"0")}</b><span><small>${s.short}</small><em>${s.label}</em></span></button>`).join("")}</nav></div></header><div class="editor-body">${renderStep(item)}</div><footer class="editor-footer"><div class="footer-inner"><button class="back-btn" type="button" data-back ${state.step===0?"disabled":""}>Back</button><button class="save-btn" type="button" data-save>Save draft</button><button class="continue-btn ${state.step===6?"publish-disabled":""}" type="button" data-continue>${state.step===6?"Publish unavailable":"Continue"}</button></div></footer></main>`);bindCommon();
  }
  function renderStep(item){
    if(state.step===0)return `<section class="step-section"><header class="step-heading"><small>START</small><h2>Name the automation</h2><p>Give it a short name you will recognize later.</p></header><label class="field"><span>Automation name</span><input data-bind="name" maxlength="80" value="${esc(item.name)}" placeholder="Grace escalation"></label><label class="field"><span>Description · optional</span><textarea data-bind="description" maxlength="240" placeholder="What is this workflow for?">${esc(item.description)}</textarea></label></section>`;
    if(state.step===1)return choiceStep("WHEN","What starts this workflow?","Choose the event that begins this path.",TRIGGERS,"trigger",item.trigger);
    if(state.step===2)return choiceStep("IF","Only continue when…","Optional. Add a rule only when the workflow actually needs one.",CONDITIONS,"condition",item.condition);
    if(state.step===3)return renderDo(item);
    if(state.step===4)return renderTiming(item);
    if(state.step===5)return choiceStep("THEN","What happens after this path?","Choose the intended outcome or handoff.",OUTCOMES,"outcome",item.outcome);
    return renderReview(item);
  }
  function choiceStep(kicker,title,copy,list,field,current){return `<section class="step-section"><header class="step-heading"><small>${kicker}</small><h2>${title}</h2><p>${copy}</p></header><div class="choice-list">${list.map(x=>`<button type="button" class="choice ${current===x.id?"is-selected":""}" data-choice data-field="${field}" data-value="${esc(x.id)}"><span class="choice-mark">${esc(x.mark)}</span><span class="choice-copy"><strong>${esc(x.label)}</strong><small>${esc(x.note)}</small></span><span class="choice-check">${current===x.id?"✓":""}</span></button>`).join("")}</div></section>`;}

  function dropdownMarkup({id,label,value,placeholder,options,search=false}){
    const selected=options.find(x=>x.value===value);const text=selected?.label||placeholder;
    return `<div class="field smart-field"><span>${esc(label)}</span><div class="smart-select ${state.openDropdown===id?"is-open":""}" data-dropdown="${esc(id)}"><button class="smart-trigger" type="button" data-dropdown-trigger="${esc(id)}" aria-expanded="${state.openDropdown===id}"><span>${esc(text)}</span><b>⌄</b></button><div class="smart-menu" ${state.openDropdown===id?"":"hidden"}>${search?`<div class="smart-search"><input type="search" placeholder="Search targets" data-dropdown-search="${esc(id)}"></div>`:""}<div class="smart-options">${options.length?options.map(x=>`<button type="button" class="smart-option ${x.value===value?"is-selected":""}" data-dropdown-option="${esc(id)}" data-value="${esc(x.value)}"><span><strong>${esc(x.label)}</strong>${x.meta?`<small>${esc(x.meta)}</small>`:""}</span><i>${x.value===value?"✓":""}</i></button>`).join(""):`<div class="smart-empty">No protected targets are available in Lab yet.</div>`}</div></div></div></div>`;
  }
  function actionTypeDropdown(step){return dropdownMarkup({id:`action:${step.id}`,label:"Action type",value:step.type,placeholder:"Choose action type",options:ACTION_TYPES.map(x=>({value:x.id,label:x.label,meta:x.note}))});}
  function targetDropdown(step){const targets=loadTargets().map(x=>({value:`${x.kind}:${x.id}`,label:x.label,meta:`${x.meta} · ${x.kind}`}));if(!step.targetRef&&step.targetLabel)targets.unshift({value:"legacy",label:step.targetLabel,meta:"Existing text target"});return dropdownMarkup({id:`target:${step.id}`,label:"Target",value:step.targetRef?targetKey(step.targetRef):(step.targetLabel?"legacy":""),placeholder:"Choose a protected target",options:targets,search:true});}
  function renderDo(item){return `<section class="step-section"><header class="step-heading"><small>DO</small><h2>What should happen?</h2><p>Add one or more action steps. Dropdowns stay inside the page instead of opening the Android system picker.</p></header><div class="do-list">${item.actions.map((step,i)=>`<article class="do-card"><header class="do-card-head"><span><small>DO ${String(i+1).padStart(2,"0")}</small><strong>${esc(option(ACTION_TYPES,step.type).label)}</strong></span>${item.actions.length>1?`<button class="remove-step" type="button" data-remove-action="${esc(step.id)}">Remove</button>`:""}</header><div class="split">${actionTypeDropdown(step)}${targetDropdown(step)}</div><label class="field"><span>Content / instruction</span><textarea data-action-content="${esc(step.id)}" placeholder="What should this step do?">${esc(step.content)}</textarea></label></article>`).join("")}</div><button class="add-step" type="button" data-add-action>＋ Add another DO step</button><div class="backend-note"><strong>Future backend:</strong> Action type and target become typed IDs. Provider secrets never belong in the workflow JSON.</div></section>`;}

  function timingModeButton(mode,label,mark,item){return `<button type="button" class="timing-mode ${item.timing.mode===mode?"is-selected":""}" data-timing-mode="${mode}"><b>${mark}</b><span><strong>${label}</strong><small>${mode==="none"?"Continue immediately":mode==="delay"?"Wait a precise duration":"Wait until a date and time"}</small></span>${item.timing.mode===mode?"<i>✓</i>":""}</button>`;}
  function numberField(label,key,value,max){return `<label class="time-number"><span>${label}</span><input type="number" min="0" max="${max}" inputmode="numeric" value="${Number(value)||0}" data-delay-field="${key}"></label>`;}
  function timezoneOptions(value){return TIMEZONES.map(z=>({value:z,label:z===localZone?`${z} (device)`:z,meta:z==="UTC"?"Coordinated Universal Time":"IANA timezone"}));}
  function timezoneDropdown(item){return dropdownMarkup({id:"timezone",label:"Timezone",value:item.timing.at.timezone||localZone,placeholder:localZone,options:timezoneOptions(item.timing.at.timezone)});}
  function repeatTimezoneDropdown(item){return dropdownMarkup({id:"repeat-timezone",label:"Calendar timezone",value:item.repeatConfig.timezone||localZone,placeholder:localZone,options:timezoneOptions(item.repeatConfig.timezone)});}
  function repeatControls(item){
    const r=item.repeatConfig;const modes=[["none","Do not repeat"],["daily","Daily"],["weekly","Weekly"],["custom","Custom cadence"],["until_ack","Until acknowledged"]];
    const calendarUnit=["months","years"].includes(r.unit);
    return `<div class="repeat-block"><div class="timing-title"><div><h3>Repeat</h3><small>Optional cadence after the action becomes due.</small></div></div><div class="repeat-pills">${modes.map(([m,l])=>`<button type="button" class="repeat-pill ${r.mode===m?"is-selected":""}" data-repeat-mode="${m}">${l}</button>`).join("")}</div>${r.mode==="custom"?`<div class="custom-repeat"><label class="time-number"><span>Every</span><input type="number" min="1" max="999" inputmode="numeric" value="${Number(r.every)||1}" data-repeat-every></label>${dropdownMarkup({id:"repeat-unit",label:"Unit",value:r.unit||"days",placeholder:"days",options:REPEAT_UNITS.map(x=>({value:x,label:x}))})}</div>${calendarUnit?`<div class="repeat-zone">${repeatTimezoneDropdown(item)}</div>`:""}<div class="calendar-cadence-note"><strong>${calendarUnit?"Calendar cadence":"Custom cadence"}</strong><span>${calendarUnit?"Months and years follow calendar boundaries in the selected timezone. They are never converted to 30-day or 365-day durations.":"Minutes, hours, days and weeks are elapsed cadence units. Months and years use calendar semantics."}</span></div>`:""}</div>`;
  }
  function renderTiming(item){
    const t=item.timing;const exactReady=t.at.date&&t.at.time;
    return `<section class="step-section"><header class="step-heading"><small>WAIT / REPEAT</small><h2>When should the next step happen?</h2><p>Use a shortcut, enter an exact delay, or wait until a specific date and minute.</p></header><div class="timing-mode-grid">${timingModeButton("none","No wait","→",item)}${timingModeButton("delay","Delay","⌛",item)}${timingModeButton("exact","Exact date & time","◷",item)}</div>${t.mode==="delay"?`<article class="precision-card"><div class="timing-title"><div><h3>Delay</h3><small>Set the duration precisely.</small></div><span>${esc(timingLabel(item))}</span></div><div class="preset-row"><button type="button" data-delay-preset="15m">15 min</button><button type="button" data-delay-preset="1h">1 hour</button><button type="button" data-delay-preset="6h">6 hours</button><button type="button" data-delay-preset="24h">24 hours</button></div><div class="duration-inputs">${numberField("Days","days",t.delay.days,365)}${numberField("Hours","hours",t.delay.hours,23)}${numberField("Minutes","minutes",t.delay.minutes,59)}</div></article>`:""}${t.mode==="exact"?`<article class="precision-card"><div class="timing-title"><div><h3>Exact date & time</h3><small>Minute precision. The backend will later store an authoritative timestamp plus timezone.</small></div><span>${exactReady?"READY":"SET DATE + TIME"}</span></div><div class="exact-grid"><label class="field"><span>Date</span><input type="date" value="${esc(t.at.date)}" data-exact-date></label><label class="field"><span>Time</span><input type="time" step="60" value="${esc(t.at.time)}" data-exact-time></label>${timezoneDropdown(item)}</div><div class="time-preview"><small>WAIT UNTIL</small><strong>${exactReady?esc(`${t.at.date} at ${t.at.time} · ${t.at.timezone}`):"Choose a date and time"}</strong></div></article>`:""}${repeatControls(item)}<div class="backend-note"><strong>Future backend:</strong> relative waits persist a due timestamp; exact waits carry a local date/time plus IANA timezone and resolve server-side. Recurrence is typed separately. Monthly/yearly recurrence advances by calendar boundaries in its own IANA timezone, with explicit end-of-month and DST rules; it must never be approximated as 30 or 365 elapsed days. The browser never sleeps until the time arrives.</div></section>`;
  }

  function renderReview(item){const actions=item.actions.map((x,i)=>`${i+1}. ${option(ACTION_TYPES,x.type).label}${x.targetLabel?` → ${x.targetLabel}`:""}`).join(" · ");return `<section class="step-section"><header class="step-heading"><small>REVIEW</small><h2>Read it like a person</h2><p>This is the draft the typed backend should eventually validate and publish.</p></header><article class="review-card"><h3>${esc(item.name||"Untitled automation")}</h3><p class="review-sentence">${esc(summary(item))}</p><div class="review-details"><div class="review-row"><small>WHEN</small><span>${esc(option(TRIGGERS,item.trigger).label)}</span></div><div class="review-row"><small>IF</small><span>${esc(option(CONDITIONS,item.condition).label)}</span></div><div class="review-row"><small>DO</small><span>${esc(actions||"No actions")}</span></div><div class="review-row"><small>WAIT</small><span>${esc(timingLabel(item))}</span></div><div class="review-row"><small>REPEAT</small><span>${esc(repeatLabel(item))}</span></div><div class="review-row"><small>THEN</small><span>${esc(option(OUTCOMES,item.outcome).label)}</span></div></div><div class="backend-note"><strong>Publishing remains unavailable.</strong> The real Automation/AutomationVersion API must validate and publish this server-side first.</div></article></section>`;}

  function openEditor(id){const found=data.automations.find(x=>x.id===id);state.editing=normalizeAutomation(clone(found||blankAutomation()));state.step=state.editing.editorStep||0;state.dirty=false;renderEditor();}
  function mutate(field,value){state.editing[field]=value;scheduleAutosave();renderEditor();setSaveState("Unsaved changes","dirty");}
  function closeDropdown(){if(state.openDropdown){state.openDropdown=null;renderEditor();}}

  function bindCommon(){
    document.querySelectorAll("[data-theme-toggle]").forEach(b=>b.addEventListener("click",()=>applyTheme(document.documentElement.dataset.theme==="light"?"dark":"light")));
    document.querySelector("[data-new]")?.addEventListener("click",()=>openEditor(null));
    document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>openEditor(b.dataset.open)));
    document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{state.tab=b.dataset.tab;renderDashboard();}));
    document.querySelector("[data-close]")?.addEventListener("click",()=>{if(state.dirty)persist();state.editing=null;renderDashboard();});
    document.querySelector("[data-save]")?.addEventListener("click",()=>{persist();toast("Draft saved");});
    document.querySelector("[data-back]")?.addEventListener("click",()=>{if(state.step>0){state.step--;state.editing.editorStep=state.step;scheduleAutosave();renderEditor();}});
    document.querySelector("[data-continue]")?.addEventListener("click",()=>{if(state.step<6){state.step++;state.editing.editorStep=state.step;scheduleAutosave();renderEditor();}});
    document.querySelectorAll("[data-step]").forEach(b=>b.addEventListener("click",()=>{state.step=Number(b.dataset.step)||0;state.editing.editorStep=state.step;scheduleAutosave();renderEditor();}));
    document.querySelectorAll("[data-bind]").forEach(el=>el.addEventListener("input",()=>{state.editing[el.dataset.bind]=el.value;scheduleAutosave();const t=document.querySelector(".editor-name strong");if(t&&el.dataset.bind==="name")t.textContent=el.value||"Untitled automation";}));
    document.querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>mutate(b.dataset.field,b.dataset.value)));
    document.querySelectorAll("[data-action-content]").forEach(el=>el.addEventListener("input",()=>{const s=state.editing.actions.find(x=>x.id===el.dataset.actionContent);if(s){s.content=el.value;scheduleAutosave();}}));
    document.querySelector("[data-add-action]")?.addEventListener("click",()=>{state.editing.actions.push(blankAction());scheduleAutosave();renderEditor();});
    document.querySelectorAll("[data-remove-action]").forEach(b=>b.addEventListener("click",()=>{if(state.editing.actions.length>1){state.editing.actions=state.editing.actions.filter(x=>x.id!==b.dataset.removeAction);scheduleAutosave();renderEditor();}}));

    document.querySelectorAll("[data-dropdown-trigger]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();state.openDropdown=state.openDropdown===b.dataset.dropdownTrigger?null:b.dataset.dropdownTrigger;renderEditor();requestAnimationFrame(()=>document.querySelector(`[data-dropdown-search="${CSS.escape(state.openDropdown||"")}"]`)?.focus());}));
    document.querySelectorAll("[data-dropdown-option]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();const id=b.dataset.dropdownOption,val=b.dataset.value;if(id.startsWith("action:")){const sid=id.slice(7);const s=state.editing.actions.find(x=>x.id===sid);if(s)s.type=val;}else if(id.startsWith("target:")){const sid=id.slice(7);const s=state.editing.actions.find(x=>x.id===sid);if(s&&val!=="legacy"){s.targetRef=targetFromKey(val);s.targetLabel=targetLabel(s.targetRef);}}else if(id==="timezone")state.editing.timing.at.timezone=val;else if(id==="repeat-unit")state.editing.repeatConfig.unit=val;else if(id==="repeat-timezone")state.editing.repeatConfig.timezone=val;state.openDropdown=null;scheduleAutosave();renderEditor();}));
    document.querySelectorAll("[data-dropdown-search]").forEach(input=>input.addEventListener("input",()=>{const q=input.value.trim().toLowerCase();input.closest(".smart-menu")?.querySelectorAll(".smart-option").forEach(o=>o.hidden=q&&!o.textContent.toLowerCase().includes(q));}));

    document.querySelectorAll("[data-timing-mode]").forEach(b=>b.addEventListener("click",()=>{state.editing.timing.mode=b.dataset.timingMode;scheduleAutosave();renderEditor();}));
    document.querySelectorAll("[data-delay-preset]").forEach(b=>b.addEventListener("click",()=>{const p=b.dataset.delayPreset;state.editing.timing.mode="delay";state.editing.timing.delay={days:p==="24h"?1:0,hours:p==="1h"?1:p==="6h"?6:0,minutes:p==="15m"?15:0};scheduleAutosave();renderEditor();}));
    document.querySelectorAll("[data-delay-field]").forEach(el=>el.addEventListener("input",()=>{state.editing.timing.delay[el.dataset.delayField]=Math.max(0,Number(el.value)||0);scheduleAutosave();}));
    document.querySelector("[data-exact-date]")?.addEventListener("input",e=>{state.editing.timing.at.date=e.target.value;scheduleAutosave();});
    document.querySelector("[data-exact-time]")?.addEventListener("input",e=>{state.editing.timing.at.time=e.target.value;scheduleAutosave();});
    document.querySelectorAll("[data-repeat-mode]").forEach(b=>b.addEventListener("click",()=>{state.editing.repeatConfig.mode=b.dataset.repeatMode;scheduleAutosave();renderEditor();}));
    document.querySelector("[data-repeat-every]")?.addEventListener("input",e=>{state.editing.repeatConfig.every=Math.max(1,Number(e.target.value)||1);scheduleAutosave();});
  }

  document.addEventListener("click",e=>{if(state.view==="editor"&&state.openDropdown&&!e.target.closest(".smart-select")){state.openDropdown=null;renderEditor();}});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&state.openDropdown){e.preventDefault();closeDropdown();}});
  window.addEventListener("beforeunload",()=>{if(state.dirty)persist();});
  window.addEventListener("storage",e=>{if(e.key===STORAGE_KEY&&state.view==="dashboard"){data=loadData();renderDashboard();}});
  function toast(message){document.querySelector(".toast")?.remove();const n=document.createElement("div");n.className="toast";n.textContent=message;document.body.append(n);setTimeout(()=>n.remove(),1500);}

  applyTheme(localStorage.getItem(THEME_KEY)||"dark");
  renderDashboard();
})();