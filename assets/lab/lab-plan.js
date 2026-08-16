(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /**
   * CHECK IN LAB — LONG-HORIZON PLAN VIEW
   * -------------------------------------
   * Lab-only planning metadata: optional delay after eligibility, active duration,
   * repeat cadence, and visual lane. Existing Decision Policy success/failure routes
   * remain the outcome graph. This module is presentation/planning authority only.
   * Production scheduling must be server-authoritative. See CHECKINLABCLONE.md.
   */

  const ACTION_KEY = "cmx-lab-actions-v1";
  const POLICY_KEY = "cmx-lab-switch-policy-v1";
  const DECISION_KEY = "cmx-lab-decisions-v1";
  const SIM_KEY = "cmx-lab-simulations-v1";
  const UI_KEY = "cmx-lab-plan-ui-v1";
  const MAX_HOURS = 17520;
  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];
  const esc = value => String(value ?? "").replace(/[&<>'\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

  const LANE_META = {
    notifications:{label:"Messages",types:["sms","email","social","organization_notice"]},
    ai:{label:"AI",types:["ai"]},
    digital:{label:"Digital",types:["webhook","digital_account","publish"]},
    tasks:{label:"Tasks",types:["scheduled","custom"]}
  };
  const MARKS = {sms:"SMS",email:"EML",social:"SOC",ai:"AI",organization_notice:"ORG",publish:"PUB",webhook:"API",digital_account:"ACC",custom:"CUS",scheduled:"CAL"};
  const UNIT = {hours:1,days:24,weeks:168,months:720};

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function actionStore() { return load(ACTION_KEY,{version:1,actions:[]}); }
  function actions() { return actionStore().actions || []; }
  function policy() { return load(POLICY_KEY,{intervalHours:72,graceHours:24}); }
  function decisionStore() { return load(DECISION_KEY,{version:1,policies:{}}); }
  function decisions() { return decisionStore().policies || {}; }
  function simulation() { return load(SIM_KEY,{current:null}).current; }
  function actionById(id) { return actions().find(action => action.id === id) || null; }
  function actionName(id) { return actionById(id)?.name || "End of plan"; }
  function saveUi() { localStorage.setItem(UI_KEY,JSON.stringify(ui)); }

  function autoLane(action) {
    return Object.entries(LANE_META).find(([,meta]) => meta.types.includes(action?.type))?.[0] || "tasks";
  }

  function normalizeSchedule(action) {
    const source = action?.schedule || {};
    const durationHours = Math.max(0,Math.min(MAX_HOURS,Number(source.durationHours || 0)));
    const mode = source.mode === "running" || durationHours > 0 ? "running" : "instant";
    return {
      mode,
      delayHours:Math.max(0,Math.min(MAX_HOURS,Number(source.delayHours || 0))),
      durationHours:mode === "running" ? Math.max(1,durationHours || 24) : 0,
      repeatEveryHours:mode === "running" ? Math.max(0,Math.min(MAX_HOURS,Number(source.repeatEveryHours || 0))) : 0,
      repeatLimit:Math.max(0,Math.min(1000,Number(source.repeatLimit || 0))),
      lane:LANE_META[source.lane] ? source.lane : autoLane(action)
    };
  }

  function totalSwitchHours() {
    const p=policy();
    return Number(p.intervalHours || 72)+Number(p.graceHours || 0);
  }

  function baseHour(action) {
    const p=policy(), trigger=action?.trigger || {};
    if(trigger.mode === "deadline") return Number(p.intervalHours || 72);
    if(trigger.mode === "grace_offset") return Number(p.intervalHours || 72)+Math.max(0,Math.min(Number(p.graceHours || 0),Number(trigger.offsetHours || 0)));
    if(trigger.mode === "grace_expiry") return totalSwitchHours();
    if(trigger.mode === "scheduled" && trigger.at){
      const origin=simulation()?.startedAt ? new Date(simulation().startedAt).getTime() : Date.now();
      return Math.max(0,(new Date(trigger.at).getTime()-origin)/3600000);
    }
    return null;
  }

  function inboundRoutes(actionId) {
    const rows=[];
    Object.entries(decisions()).forEach(([sourceId,dp]) => {
      Object.entries(dp.routes || {}).forEach(([event,targetId]) => {
        if(targetId===actionId) rows.push({sourceId,event});
      });
    });
    return rows;
  }
  function routeFor(actionId,event){ return decisions()[actionId]?.routes?.[event] || ""; }

  function projectedStart(action, stack=new Set()) {
    if(!action || stack.has(action.id)) return baseHour(action);
    const base=baseHour(action);
    if(base===null) return null;
    const schedule=normalizeSchedule(action);
    let start=base+schedule.delayHours;
    const nextStack=new Set(stack);nextStack.add(action.id);
    inboundRoutes(action.id).filter(edge=>["success","acknowledged"].includes(edge.event)).forEach(edge=>{
      const source=actionById(edge.sourceId);
      const end=projectedEnd(source,nextStack);
      if(Number.isFinite(end)) start=Math.max(start,end);
    });
    return Math.min(MAX_HOURS,start);
  }
  function projectedEnd(action,stack=new Set()){
    const start=projectedStart(action,stack);
    if(start===null)return null;
    const schedule=normalizeSchedule(action);
    return Math.min(MAX_HOURS,start+(schedule.mode==="running"?schedule.durationHours:0));
  }

  function durationLabel(hours) {
    const h=Number(hours || 0);
    if(!h)return "Once";
    if(h>=720 && h%720===0)return `${h/720} month${h===720?"":"s"}`;
    if(h>=168 && h%168===0)return `${h/168} week${h===168?"":"s"}`;
    if(h>=24 && h%24===0)return `${h/24} day${h===24?"":"s"}`;
    return `${Number(h.toFixed(2))} hour${h===1?"":"s"}`;
  }
  function timeLabel(hour) {
    const h=Number(hour || 0);
    if(h<24)return `T+${Number(h.toFixed(1))}h`;
    if(h<168)return `Day ${Number((h/24).toFixed(h%24?1:0))}`;
    if(h<720)return `Week ${Number((h/168).toFixed(1))}`;
    return `Month ${Number((h/720).toFixed(1))}`;
  }
  function scheduleSummary(action) {
    const s=normalizeSchedule(action),start=projectedStart(action);
    const parts=[start===null?"Manual start":timeLabel(start)];
    if(s.mode==="running")parts.push(`runs ${durationLabel(s.durationHours)}`);
    if(s.repeatEveryHours)parts.push(`every ${durationLabel(s.repeatEveryHours)}`);
    return parts.join(" · ");
  }

  function expectedBranch(action) {
    const inbound=inboundRoutes(action.id);
    if(inbound.some(edge=>["failure","no_ack","approval_denied"].includes(edge.event)))return "failure";
    if(inbound.length)return "success";
    return "";
  }
  function planActions() {
    return actions().filter(action=>action.status==="Enabled" && projectedStart(action)!==null).map(action=>({
      action,
      schedule:normalizeSchedule(action),
      start:projectedStart(action),
      end:projectedEnd(action),
      branch:expectedBranch(action)
    })).sort((a,b)=>a.start-b.start);
  }
  function horizon(){ return Math.max(totalSwitchHours(),...planActions().map(item=>item.end || item.start || 0),24); }

  function eventList() {
    const p=policy();
    const list=[
      {hour:Number(p.intervalHours || 72),title:"Check-in deadline",detail:"Grace starts"},
      {hour:totalSwitchHours(),title:"Final trigger",detail:"Grace ends"}
    ];
    planActions().forEach(item=>{
      list.push({hour:item.start,title:item.action.name,detail:item.schedule.mode==="running"?"Starts":"Runs"});
      if(item.schedule.mode!=="running")return;
      if(item.schedule.repeatEveryHours){
        const byTime=Math.floor(item.schedule.durationHours/item.schedule.repeatEveryHours);
        const limit=item.schedule.repeatLimit?Math.min(byTime,item.schedule.repeatLimit-1):Math.min(byTime,40);
        for(let index=1;index<=limit;index+=1){
          const at=item.start+index*item.schedule.repeatEveryHours;
          if(at<item.end)list.push({hour:at,title:item.action.name,detail:`Repeat ${index+1}`});
        }
      }
      const success=routeFor(item.action.id,"success");
      list.push({hour:item.end,title:item.action.name,detail:success?`Ends → ${actionName(success)}`:"Ends successfully"});
    });
    return list.filter(item=>Number.isFinite(item.hour)).sort((a,b)=>a.hour-b.hour);
  }

  function canvasWidth() {
    const h=horizon();
    if(ui.zoom==="hours")return Math.min(12000,Math.max(1000,h*14));
    if(ui.zoom==="days")return Math.min(12000,Math.max(1000,(h/24)*90));
    if(ui.zoom==="weeks")return Math.min(8000,Math.max(1000,(h/168)*150));
    if(ui.zoom==="months")return Math.min(6000,Math.max(1000,(h/720)*170));
    return Math.min(1800,Math.max(800,h*2.2));
  }
  function ticks(){const h=horizon(),count=6;return Array.from({length:count+1},(_,i)=>({hour:h/count*i,pct:i/count*100}));}

  function actionBlock(item) {
    const h=Math.max(1,horizon()),left=item.start/h*100,duration=Math.max(0,item.end-item.start);
    const width=item.schedule.mode==="running"?Math.max(2,duration/h*100):2.2;
    const classes=["lab-plan-action",`risk-${String(item.action.risk || "Important").toLowerCase()}`];
    if(item.schedule.mode==="running")classes.push("is-running");
    if(item.schedule.repeatEveryHours)classes.push("has-repeat");
    if(item.branch)classes.push(`branch-${item.branch}`);
    return `<button type="button" class="${classes.join(" ")}" style="left:${left}%;width:${Math.max(2,Math.min(100-left,width))}%" data-plan-action="${esc(item.action.id)}"><span>${MARKS[item.action.type] || "ACT"}</span><div><strong>${esc(item.action.name)}</strong><small>${esc(scheduleSummary(item.action))}</small></div><em>${item.schedule.mode==="running"?timeLabel(item.end):timeLabel(item.start)}</em></button>`;
  }
  function lanesHtml(){
    const rows=planActions();
    return Object.entries(LANE_META).map(([key,meta])=>{
      const items=rows.filter(item=>item.schedule.lane===key);
      return items.length?`<section class="lab-plan-lane"><div class="lab-plan-lane-label">${esc(meta.label)}</div><div class="lab-plan-lane-track">${items.map(actionBlock).join("")}</div></section>`:"";
    }).join("") || '<div class="lab-plan-next-empty">No timed actions yet.</div>';
  }
  function nextHtml(){
    const next=eventList().filter(event=>event.hour>ui.clock+.0001).slice(0,5);
    return next.length?next.map(event=>`<div class="lab-plan-next-event"><span>${esc(timeLabel(event.hour))}</span><div><strong>${esc(event.title)}</strong><small>${esc(event.detail)}</small></div></div>`).join(""):'<div class="lab-plan-next-empty">No later planned event.</div>';
  }
  function boardHtml(){
    const h=Math.max(1,horizon()),nowPct=Math.max(0,Math.min(100,ui.clock/h*100));
    return `<section class="lab-plan-board"><header class="lab-plan-head"><div><small>PLAN</small><h2>Long-range timeline</h2><p>Starts, repeats, endings, and handoffs from hours to months.</p></div><div>${["auto","hours","days","weeks","months"].map(value=>`<button type="button" class="${ui.zoom===value?"is-active":""}" data-plan-zoom="${value}">${value[0].toUpperCase()+value.slice(1)}</button>`).join("")}</div></header><div class="lab-plan-layout"><div class="lab-plan-scroll"><div class="lab-plan-canvas" style="width:${canvasWidth()}px"><div class="lab-plan-axis"><i class="lab-plan-now" style="left:${nowPct}%"></i>${ticks().map(tick=>`<span style="left:${tick.pct}%"><strong>${esc(timeLabel(tick.hour))}</strong></span>`).join("")}</div><div class="lab-plan-lanes">${lanesHtml()}</div></div></div><aside class="lab-plan-next"><header><strong>Up next</strong><span>${esc(timeLabel(ui.clock))}</span></header><div class="lab-plan-next-list">${nextHtml()}</div></aside></div></section>`;
  }
  function modebarHtml(){
    return `<div class="lab-plan-modebar"><nav aria-label="Sequence mode"><button type="button" class="${ui.mode==="plan"?"is-active":""}" data-plan-mode="plan">Plan</button><button type="button" class="${ui.mode==="run"?"is-active":""}" data-plan-mode="run">Run / Test</button></nav><button type="button" data-plan-command="next" ${ui.mode!=="plan"?"hidden":""}>Next event</button><button type="button" class="lab-plan-play${playing?" is-playing":""}" data-plan-command="play" ${ui.mode!=="plan"?"hidden":""}>${playing?"Pause":"▶ Play"}</button><select data-plan-speed aria-label="Preview speed" ${ui.mode!=="plan"?"hidden":""}><option value="slow"${ui.speed==="slow"?" selected":""}>Slow</option><option value="normal"${ui.speed==="normal"?" selected":""}>Normal</option><option value="fast"${ui.speed==="fast"?" selected":""}>Fast</option></select><span>PREVIEW <b>${esc(timeLabel(ui.clock))}</b></span></div>`;
  }

  function renderSignature(){
    return [ui.mode,ui.zoom,ui.clock,ui.speed,playing,localStorage.getItem(ACTION_KEY)||"",localStorage.getItem(POLICY_KEY)||"",localStorage.getItem(DECISION_KEY)||""].join("|");
  }
  function bindRoot(root){
    if(root.dataset.planBound==="true")return;
    root.dataset.planBound="true";
    root.addEventListener("click",event=>{
      const mode=event.target.closest("[data-plan-mode]")?.dataset.planMode;if(mode)return setMode(mode);
      const zoom=event.target.closest("[data-plan-zoom]")?.dataset.planZoom;if(zoom){ui.zoom=zoom;saveUi();queueRender();return;}
      const command=event.target.closest("[data-plan-command]")?.dataset.planCommand;if(command==="next")return nextEvent();if(command==="play")return togglePlay();
      const actionId=event.target.closest("[data-plan-action]")?.dataset.planAction;if(actionId)return openAction(actionId);
    });
    root.addEventListener("change",event=>{if(event.target.matches("[data-plan-speed]")){ui.speed=event.target.value;saveUi();}});
  }
  function ensureSequence(){
    const root=$(".lab-sequence-root");if(!root)return;
    const signature=renderSignature();
    const hasMode=$(".lab-plan-modebar",root),hasBoard=$(".lab-plan-board",root);
    root.dataset.sequenceMode=ui.mode;
    if(root.dataset.planSignature!==signature || !hasMode || !hasBoard){
      if(hasMode)hasMode.outerHTML=modebarHtml();else root.insertAdjacentHTML("afterbegin",modebarHtml());
      const board=$(".lab-plan-board",root);if(board)board.outerHTML=boardHtml();else root.insertAdjacentHTML("beforeend",boardHtml());
      root.dataset.planSignature=signature;
    }
    bindRoot(root);
    document.body.dataset.labPlan="ready";
  }

  function setMode(mode){ui.mode=mode==="plan"?"plan":"run";saveUi();queueRender();}
  function nextEvent(){const next=eventList().find(event=>event.hour>ui.clock+.0001);if(!next){playing=false;queueRender();return;}ui.clock=next.hour;saveUi();queueRender();}
  function togglePlay(){playing=!playing;queueRender();if(playing)playLoop();}
  async function playLoop(){
    while(playing){
      const next=eventList().find(event=>event.hour>ui.clock+.0001);if(!next){playing=false;queueRender();break;}
      ui.clock=next.hour;saveUi();queueRender();
      await new Promise(resolve=>setTimeout(resolve,({slow:1150,normal:650,fast:260}[ui.speed]||650)));
    }
  }
  function openAction(id){$('[data-view="actions"]')?.click();setTimeout(()=>$(`[data-action-id="${CSS.escape(id)}"]`,$(".lab-actions"))?.click(),70);}

  function splitUnit(hours){const h=Number(hours||0);if(h>=720&&h%720===0)return{value:h/720,unit:"months"};if(h>=168&&h%168===0)return{value:h/168,unit:"weeks"};if(h>=24&&h%24===0)return{value:h/24,unit:"days"};return{value:h,unit:"hours"};}
  function unitOptions(selected){return Object.keys(UNIT).map(unit=>`<option value="${unit}"${selected===unit?" selected":""}>${unit[0].toUpperCase()+unit.slice(1)}</option>`).join("");}
  function readDuration(prefix){const value=Math.max(0,Number($(`#${prefix}Value`,dialog)?.value||0)),unit=$(`#${prefix}Unit`,dialog)?.value||"hours";return Math.min(MAX_HOURS,value*(UNIT[unit]||1));}

  function timingSignature(action){return [action.id,action.updatedAt,JSON.stringify(action.schedule||{}),JSON.stringify(decisions()[action.id]?.routes||{})].join("|");}
  function timingCard(action){
    const s=normalizeSchedule(action),start=projectedStart(action),success=routeFor(action.id,"success"),failure=routeFor(action.id,"failure");
    return `<section class="lab-plan-timing-card"><div class="lab-card-head"><strong>Timing</strong><small>${s.mode==="running"?"RUNNING":"ONCE"}</small></div><div class="lab-plan-timing-grid"><span><small>START</small><strong>${start===null?"Manual":timeLabel(start)}</strong></span><span><small>RUNS FOR</small><strong>${s.mode==="running"?durationLabel(s.durationHours):"Once"}</strong></span><span><small>REPEAT</small><strong>${s.repeatEveryHours?`Every ${durationLabel(s.repeatEveryHours)}`:"No"}</strong></span><span><small>ENDS</small><strong>${success?actionName(success):"Complete"}</strong></span></div><div class="lab-plan-timing-foot"><span>${failure?`If it fails → ${actionName(failure)}`:"Failure ends this branch"}</span><button type="button" data-plan-edit="${esc(action.id)}">Edit timing</button></div></section>`;
  }
  function polishActionDetail(){
    const root=$(".lab-actions");if(!root)return;
    const selected=$("[data-action-id].is-active",root)?.dataset.actionId,action=actionById(selected);if(!action)return;
    const grid=$(".lab-action-detail-grid",root);if(!grid)return;
    const signature=timingSignature(action);let card=$(".lab-plan-timing-card",grid);
    if(card?.dataset.planSignature===signature)return;
    if(card)card.outerHTML=timingCard(action);else grid.insertAdjacentHTML("afterbegin",timingCard(action));
    card=$(".lab-plan-timing-card",grid);if(card)card.dataset.planSignature=signature;
    const list=$("[data-action-id].is-active .lab-action-list-copy small",root);if(list)list.title=scheduleSummary(action);
  }

  function openTiming(id){
    const action=actionById(id);if(!action)return;editingId=id;
    const s=normalizeSchedule(action),delay=splitUnit(s.delayHours),duration=splitUnit(s.durationHours),repeat=splitUnit(s.repeatEveryHours),success=routeFor(id,"success"),failure=routeFor(id,"failure");
    dialog.innerHTML=`<form method="dialog" class="lab-plan-dialog-shell"><header><div><small>TIMING</small><h2>${esc(action.name)}</h2></div><button value="cancel" aria-label="Close">×</button></header><div class="lab-plan-dialog-body"><div class="lab-plan-form"><label><span>Start after eligibility</span><div class="lab-plan-duration"><input id="labDelayValue" type="number" min="0" step="1" value="${delay.value}"><select id="labDelayUnit">${unitOptions(delay.unit)}</select></div></label><label><span>Lane</span><select id="labPlanLane"><option value="auto">Auto</option>${Object.entries(LANE_META).map(([key,meta])=>`<option value="${key}"${s.lane===key?" selected":""}>${esc(meta.label)}</option>`).join("")}</select></label><label class="lab-plan-toggle"><input id="labRunningEnabled" type="checkbox" ${s.mode==="running"?"checked":""}><span><strong>Keeps running</strong><small>Start and end are tracked.</small></span></label><label><span>Runs for</span><div class="lab-plan-duration"><input id="labDurationValue" type="number" min="1" step="1" value="${duration.value||1}"><select id="labDurationUnit">${unitOptions(duration.unit)}</select></div></label><label class="lab-plan-toggle"><input id="labRepeatEnabled2" type="checkbox" ${s.repeatEveryHours?"checked":""}><span><strong>Repeat while active</strong><small>Repeats stop when the action ends.</small></span></label><label><span>Repeat every</span><div class="lab-plan-duration"><input id="labRepeatValue" type="number" min="1" step="1" value="${repeat.value||1}"><select id="labRepeatUnit">${unitOptions(repeat.unit)}</select></div></label><label><span>Maximum runs</span><input id="labRepeatLimit" type="number" min="0" max="1000" value="${s.repeatLimit||0}" aria-label="Maximum runs, zero means until end"></label><div></div><div class="lab-plan-route-preview"><span><small>SUCCESS</small><strong>${esc(success?actionName(success):"End branch")}</strong></span><span><small>FAILURE</small><strong>${esc(failure?actionName(failure):"End branch")}</strong></span></div></div></div><footer><button value="cancel">Cancel</button><button type="button" class="primary" data-plan-save>Save timing</button></footer></form>`;
    dialog.showModal();
  }
  function saveTiming(){
    const store=actionStore(),action=store.actions.find(item=>item.id===editingId);if(!action)return;
    const running=Boolean($("#labRunningEnabled",dialog)?.checked),repeating=Boolean($("#labRepeatEnabled2",dialog)?.checked)&&running,lane=$("#labPlanLane",dialog)?.value;
    action.schedule={mode:running?"running":"instant",delayHours:readDuration("labDelay"),durationHours:running?Math.max(1,readDuration("labDuration")):0,repeatEveryHours:repeating?Math.max(1,readDuration("labRepeat")):0,repeatLimit:repeating?Math.max(0,Math.min(1000,Number($("#labRepeatLimit",dialog)?.value||0))):0,lane:lane==="auto"?autoLane(action):lane};
    action.updatedAt=new Date().toISOString();action.activity=[{title:"Timing updated",detail:scheduleSummary(action),at:action.updatedAt},...(action.activity||[])];
    localStorage.setItem(ACTION_KEY,JSON.stringify(store));document.dispatchEvent(new CustomEvent("cmx:lab-actions-updated",{detail:{total:store.actions.length,source:"timing"}}));
    dialog.close();editingId="";ui.clock=0;saveUi();queueRender();
  }

  function injectPlanShortcut(){
    const center=$("#labTestCenter");if(!center||$("[data-plan-open]",center))return;
    const full=$(".lab-test-full",center);if(!full)return;
    const button=document.createElement("button");button.type="button";button.dataset.planOpen="true";button.className="lab-action-button";button.textContent="Preview long plan";button.addEventListener("click",()=>setMode("plan"));full.after(button);
  }

  let renderQueued=false;
  function render(){renderQueued=false;ensureSequence();polishActionDetail();injectPlanShortcut();}
  function queueRender(){if(renderQueued)return;renderQueued=true;requestAnimationFrame(render);}

  let ui=load(UI_KEY,{mode:"run",zoom:"auto",clock:0,speed:"normal"});
  if(!["run","plan"].includes(ui.mode))ui.mode="run";
  if(!["auto","hours","days","weeks","months"].includes(ui.zoom))ui.zoom="auto";
  if(!["slow","normal","fast"].includes(ui.speed))ui.speed="normal";
  let playing=false,editingId="";
  const dialog=document.createElement("dialog");dialog.className="lab-plan-dialog";dialog.id="labPlanDialog";document.body.append(dialog);
  dialog.addEventListener("click",event=>{if(event.target.closest("[data-plan-save]")){event.preventDefault();saveTiming();}});

  document.addEventListener("click",event=>{
    const edit=event.target.closest("[data-plan-edit]");if(edit){event.preventDefault();openTiming(edit.dataset.planEdit);}
    if(event.target.closest("[data-test-center-open]")){ui.mode="run";saveUi();queueRender();}
  },true);
  ["cmx:lab-actions-updated","cmx:lab-decisions-updated","cmx:lab-switch-policy-updated","cmx:lab-simulation-updated"].forEach(name=>document.addEventListener(name,queueRender));
  const sequencePanel=$('[data-view-panel="timeline"]');if(sequencePanel)new MutationObserver(queueRender).observe(sequencePanel,{childList:true,subtree:true});
  const actionPanel=$('[data-view-panel="actions"]');if(actionPanel)new MutationObserver(()=>requestAnimationFrame(polishActionDetail)).observe(actionPanel,{childList:true,subtree:true});

  window.CMX_LAB_PLAN=Object.freeze({setMode,openTiming,horizon,events:()=>eventList().map(event=>({...event})),summary:actionId=>{const action=actionById(actionId);return action?{...normalizeSchedule(action),start:projectedStart(action),end:projectedEnd(action)}:null;}});

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(queueRender,50),{once:true});else setTimeout(queueRender,50);
})();
