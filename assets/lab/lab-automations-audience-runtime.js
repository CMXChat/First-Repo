(() => {
  "use strict";

  const CRM_KEY = "cmx-lab-crm-v1";
  const AUDIENCE_KEY = "cmx-lab-audience-links-v1";
  const PRESET_LABELS = [
    ["family","Family"],["friend","Friend"],["work","Work"],["colleague","Colleague"],
    ["client","Client"],["legal","Legal"],["emergency","Emergency"],["trusted","Trusted"],
    ["vendor","Vendor"],["technical","Technical"],["financial","Financial"],["personal","Personal"]
  ];

  let manager = {stepId:null,tab:"people",query:"",selected:[],personId:null,mode:"browse"};

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
  const slug = value => String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48) || `label-${Date.now().toString(36)}`;
  const uniq = values => [...new Set((values || []).filter(Boolean))];
  const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
  const now = () => new Date().toISOString();

  function fallbackCrm() { return {version:1,people:[],organizations:[],labels:[],groups:[]}; }

  function normalizeCrm(raw) {
    const data = raw && typeof raw === "object" ? raw : fallbackCrm();
    data.version = 1;
    data.people = Array.isArray(data.people) ? data.people : [];
    data.organizations = Array.isArray(data.organizations) ? data.organizations : [];
    data.labels = Array.isArray(data.labels) ? data.labels : [];
    data.groups = Array.isArray(data.groups) ? data.groups : [];

    const existing = new Map(data.labels.map(item => [item.id,item]));
    PRESET_LABELS.forEach(([id,name]) => {
      if (!existing.has(id)) data.labels.push({id,name,preset:true,createdAt:"preset"});
    });

    data.people.forEach(person => {
      person.organizationIds = uniq([...(Array.isArray(person.organizationIds)?person.organizationIds:[]), person.orgId]);
      const relationship = person.relationship ? slug(person.relationship) : "";
      person.labels = uniq([...(Array.isArray(person.labels)?person.labels:[]), ...(Array.isArray(person.tags)?person.tags.map(slug):[]), relationship]);
    });

    if (!data.groups.length && data.people.length) {
      data.groups.push(
        {id:"grp-emergency-tier-1",name:"Emergency Tier 1",description:"Priority people and organizations for urgent continuity contact.",preset:true,members:[{kind:"label",id:"emergency"},{kind:"organization",id:"o-northstar"}],createdAt:"preset"},
        {id:"grp-work-contacts",name:"Work contacts",description:"People connected to the work/operations side of the directory.",preset:true,members:[{kind:"label",id:"work"},{kind:"organization",id:"o-atlas"}],createdAt:"preset"},
        {id:"grp-family",name:"Family",description:"Saved family audience based on the Family label.",preset:true,members:[{kind:"label",id:"family"}],createdAt:"preset"}
      );
    }
    return data;
  }

  function loadCrm() {
    try { return normalizeCrm(JSON.parse(localStorage.getItem(CRM_KEY))); } catch { return normalizeCrm(fallbackCrm()); }
  }

  function saveCrm(data) {
    localStorage.setItem(CRM_KEY, JSON.stringify(normalizeCrm(data)));
    document.dispatchEvent(new CustomEvent("cmx:lab-crm-updated", {detail:{source:"audiences"}}));
  }

  function loadLinks() {
    try {
      const parsed = JSON.parse(localStorage.getItem(AUDIENCE_KEY));
      if (parsed?.version === 1 && parsed.links && typeof parsed.links === "object") return parsed;
    } catch {}
    return {version:1,links:{}};
  }

  function saveLinks(store) { localStorage.setItem(AUDIENCE_KEY, JSON.stringify(store)); }
  function linkFor(stepId) { return loadLinks().links[stepId] || {refs:[],resolutionMode:"live"}; }

  function labelName(data,id) { return data.labels.find(x=>x.id===id)?.name || id; }
  function orgName(data,id) { return data.organizations.find(x=>x.id===id)?.name || id; }
  function personName(data,id) { return data.people.find(x=>x.id===id)?.name || id; }
  function groupName(data,id) { return data.groups.find(x=>x.id===id)?.name || id; }

  function peopleForOrg(data,id) {
    return data.people.filter(person => (person.organizationIds || []).includes(id));
  }

  function peopleForLabel(data,id) {
    return data.people.filter(person => (person.labels || []).includes(id));
  }

  function resolveRef(data,ref,seenGroups=new Set()) {
    if (!ref?.kind || !ref?.id) return [];
    if (ref.kind === "person") return data.people.filter(p => p.id === ref.id);
    if (ref.kind === "organization") return peopleForOrg(data,ref.id);
    if (ref.kind === "label") return peopleForLabel(data,ref.id);
    if (ref.kind === "group") {
      if (seenGroups.has(ref.id)) return [];
      seenGroups.add(ref.id);
      const group = data.groups.find(g => g.id === ref.id);
      return (group?.members || []).flatMap(member => resolveRef(data,member,new Set(seenGroups)));
    }
    return [];
  }

  function resolveRefs(data,refs) {
    const map = new Map();
    (refs || []).flatMap(ref => resolveRef(data,ref)).forEach(person => {
      if (person?.id && String(person.status || "Active").toLowerCase() !== "archived") map.set(person.id,person);
    });
    return [...map.values()];
  }

  function refLabel(data,ref) {
    if (ref.kind === "person") return personName(data,ref.id);
    if (ref.kind === "organization") return orgName(data,ref.id);
    if (ref.kind === "label") return `${labelName(data,ref.id)} label`;
    if (ref.kind === "group") return groupName(data,ref.id);
    return ref.id;
  }

  function refKey(ref) { return `${ref.kind}:${ref.id}`; }
  function hasSelected(ref) { return manager.selected.some(item => refKey(item) === refKey(ref)); }

  function audienceSummary(stepId) {
    const data = loadCrm();
    const link = linkFor(stepId);
    const refs = link.refs || [];
    const people = resolveRefs(data,refs);
    const emailReady = people.filter(p=>p.email).length;
    const phoneReady = people.filter(p=>p.phone).length;
    return {
      refs,people,emailReady,phoneReady,
      title: refs.length ? refs.slice(0,2).map(ref=>refLabel(data,ref)).join(" + ") + (refs.length>2?` +${refs.length-2}`:"") : "Choose who receives this",
      meta: refs.length ? `${people.length} unique ${people.length===1?"person":"people"} · ${emailReady} email-ready · ${phoneReady} phone-ready` : "Person, organization, group, or label"
    };
  }

  function enhanceActionCards() {
    document.querySelectorAll(".do-card").forEach(card => {
      const textarea = card.querySelector("[data-action-content]");
      const stepId = textarea?.dataset.actionContent;
      if (!stepId) return;
      const split = card.querySelector(".split");
      if (!split) return;
      const targetField = [...split.querySelectorAll(".smart-field")].find(field => field.querySelector(":scope > span")?.textContent?.trim() === "Target");
      if (targetField) targetField.hidden = true;
      if (split.querySelector(`[data-audience-card="${CSS.escape(stepId)}"]`)) return;

      const summary = audienceSummary(stepId);
      const node = document.createElement("section");
      node.className = "audience-target-card";
      node.dataset.audienceCard = stepId;
      node.innerHTML = `<div class="audience-target-copy"><small>AUDIENCE</small><strong data-audience-title>${esc(summary.title)}</strong><span data-audience-meta>${esc(summary.meta)}</span></div><button type="button" data-audience-open="${esc(stepId)}">${summary.refs.length?"Edit audience":"Choose audience"}</button>`;
      split.append(node);
    });
  }

  function tabsMarkup() {
    const tabs = [["people","People"],["organizations","Organizations"],["groups","Groups"],["labels","Labels"]];
    return tabs.map(([id,label])=>`<button type="button" data-audience-tab="${id}" class="${manager.tab===id?"is-active":""}">${label}</button>`).join("");
  }

  function peopleCard(data,person) {
    const orgs = (person.organizationIds||[]).map(id=>orgName(data,id)).filter(Boolean);
    const labels = (person.labels||[]).slice(0,4).map(id=>labelName(data,id));
    const ref={kind:"person",id:person.id};
    return `<article class="audience-card ${hasSelected(ref)?"is-selected":""}">
      <button type="button" class="audience-card-main" data-audience-toggle="person:${esc(person.id)}">
        <span class="audience-avatar">${esc(String(person.name||"?").split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase())}</span>
        <span><strong>${esc(person.name)}</strong><small>${esc(person.role||person.relationship||"Person")}</small><em>${esc(orgs.join(" · ") || "No organization")}</em></span><b>${hasSelected(ref)?"✓":"＋"}</b>
      </button>
      <div class="audience-card-foot"><span>${labels.map(label=>`<i>${esc(label)}</i>`).join("") || "<i>No labels</i>"}</span><button type="button" data-person-manage="${esc(person.id)}">Manage</button></div>
    </article>`;
  }

  function organizationCard(data,org) {
    const people = peopleForOrg(data,org.id);
    const emailReady=people.filter(p=>p.email).length;
    const ref={kind:"organization",id:org.id};
    return `<article class="audience-card ${hasSelected(ref)?"is-selected":""}"><button type="button" class="audience-card-main" data-audience-toggle="organization:${esc(org.id)}"><span class="audience-avatar org">ORG</span><span><strong>${esc(org.name)}</strong><small>${esc(org.type||"Organization")}</small><em>${people.length} ${people.length===1?"person":"people"} · ${emailReady} email-ready</em></span><b>${hasSelected(ref)?"✓":"＋"}</b></button><div class="audience-member-preview">${people.slice(0,5).map(p=>`<span>${esc(p.name)}</span>`).join("")}${people.length>5?`<span>+${people.length-5}</span>`:""}</div></article>`;
  }

  function groupCard(data,group) {
    const people = resolveRef(data,{kind:"group",id:group.id});
    const ref={kind:"group",id:group.id};
    return `<article class="audience-card ${hasSelected(ref)?"is-selected":""}"><button type="button" class="audience-card-main" data-audience-toggle="group:${esc(group.id)}"><span class="audience-avatar group">GRP</span><span><strong>${esc(group.name)}</strong><small>${group.preset?"Suggested group":"Custom group"}</small><em>${people.length} resolved ${people.length===1?"person":"people"}</em></span><b>${hasSelected(ref)?"✓":"＋"}</b></button><p class="audience-card-description">${esc(group.description||"Saved audience")}</p></article>`;
  }

  function labelCard(data,label) {
    const people=peopleForLabel(data,label.id);
    const ref={kind:"label",id:label.id};
    return `<article class="audience-card ${hasSelected(ref)?"is-selected":""}"><button type="button" class="audience-card-main" data-audience-toggle="label:${esc(label.id)}"><span class="audience-avatar label">#</span><span><strong>${esc(label.name)}</strong><small>${label.preset?"Suggested label":"Custom label"}</small><em>${people.length} ${people.length===1?"person":"people"}</em></span><b>${hasSelected(ref)?"✓":"＋"}</b></button></article>`;
  }

  function filteredItems(data) {
    const q=manager.query.trim().toLowerCase();
    if (manager.tab === "people") return data.people.filter(x=>!q||`${x.name} ${x.role} ${(x.labels||[]).join(" ")}`.toLowerCase().includes(q));
    if (manager.tab === "organizations") return data.organizations.filter(x=>!q||`${x.name} ${x.type}`.toLowerCase().includes(q));
    if (manager.tab === "groups") return data.groups.filter(x=>!q||`${x.name} ${x.description}`.toLowerCase().includes(q));
    return data.labels.filter(x=>!q||x.name.toLowerCase().includes(q));
  }

  function managerMarkup() {
    const data=loadCrm();
    const items=filteredItems(data);
    const resolved=resolveRefs(data,manager.selected);
    const emailReady=resolved.filter(p=>p.email).length;
    const phoneReady=resolved.filter(p=>p.phone).length;
    const render = item => manager.tab==="people"?peopleCard(data,item):manager.tab==="organizations"?organizationCard(data,item):manager.tab==="groups"?groupCard(data,item):labelCard(data,item);
    return `<div class="audience-manager-overlay" role="dialog" aria-modal="true" aria-label="Choose audience"><div class="audience-manager-app">
      <header class="audience-manager-topbar"><div><button type="button" data-audience-close>←</button><span><small>PROTECTED DIRECTORY · LAB</small><strong>Choose audience</strong><em>Organizations, groups and labels resolve to unique people.</em></span></div><button type="button" class="audience-done" data-audience-done>Done</button></header>
      <main class="audience-manager-main">
        <section class="audience-explainer"><div><strong>Who should receive this action?</strong><p>Select one or more audiences. Duplicate people are automatically counted once.</p></div><div class="audience-resolution"><small>RESOLUTION</small><strong>Keep membership current</strong><span>Production will resolve current authorized members when the Run starts, then freeze the exact recipient snapshot into Run history.</span></div></section>
        <div class="audience-controls"><nav>${tabsMarkup()}</nav><label><span>⌕</span><input type="search" data-audience-search value="${esc(manager.query)}" placeholder="Search ${esc(manager.tab)}" /></label></div>
        <div class="audience-subtools">${manager.tab==="groups"?`<button type="button" data-group-new>＋ Create custom group</button>`:""}${manager.tab==="labels"?`<button type="button" data-label-new>＋ Create custom label</button>`:""}<span>Preset choices are suggestions. You can create your own.</span></div>
        <section class="audience-list">${items.length?items.map(render).join(""):`<div class="audience-empty"><strong>No matches</strong><span>Try another search or create your own.</span></div>`}</section>
        <section class="audience-selection-summary"><div><small>SELECTED AUDIENCE</small><strong>${resolved.length} unique ${resolved.length===1?"person":"people"}</strong><span>${emailReady} email-ready · ${phoneReady} phone-ready</span></div><div class="audience-selection-chips">${manager.selected.length?manager.selected.map(ref=>`<button type="button" data-audience-remove="${esc(refKey(ref))}">${esc(refLabel(data,ref))} ×</button>`).join(""):`<span>No audience selected yet.</span>`}</div></section>
      </main></div></div>`;
  }

  function openManager(stepId) {
    const link=linkFor(stepId);
    manager={stepId,tab:"people",query:"",selected:[...(link.refs||[])],personId:null,mode:"browse"};
    document.querySelector(".audience-manager-overlay")?.remove();
    document.body.insertAdjacentHTML("beforeend",managerMarkup());
    document.body.classList.add("audience-manager-open");
  }

  function rerenderManager() {
    const old=document.querySelector(".audience-manager-overlay");
    if (!old) return;
    old.outerHTML=managerMarkup();
  }

  function saveCurrentSelection() {
    if (!manager.stepId) return;
    const store=loadLinks();
    store.links[manager.stepId]={refs:manager.selected,resolutionMode:"live",updatedAt:now()};
    saveLinks(store);
  }

  function closeManager(save=true) {
    if (save) saveCurrentSelection();
    document.querySelector(".audience-manager-overlay")?.remove();
    document.querySelector(".directory-subdialog")?.remove();
    document.body.classList.remove("audience-manager-open");
    requestAnimationFrame(enhanceActionCards);
  }

  function toggleRef(value) {
    const [kind,...rest]=String(value).split(":"); const id=rest.join(":");
    const ref={kind,id}; const key=refKey(ref);
    manager.selected = hasSelected(ref) ? manager.selected.filter(item=>refKey(item)!==key) : [...manager.selected,ref];
    rerenderManager();
  }

  function personDialog(personId) {
    const data=loadCrm(); const person=data.people.find(p=>p.id===personId); if(!person)return;
    document.querySelector(".directory-subdialog")?.remove();
    const orgIds=new Set(person.organizationIds||[]); const labelIds=new Set(person.labels||[]);
    document.body.insertAdjacentHTML("beforeend",`<div class="directory-subdialog" role="dialog" aria-modal="true"><div class="directory-subdialog-app"><header><span><small>PERSON RELATIONSHIPS</small><strong>${esc(person.name)}</strong><em>One person can belong to multiple organizations and carry multiple labels.</em></span><button type="button" data-directory-dialog-close>×</button></header><main>
      <section><div class="subdialog-heading"><strong>Organizations</strong><span>Memberships can overlap.</span></div><div class="relationship-grid">${data.organizations.map(org=>`<label><input type="checkbox" data-person-org="${esc(org.id)}" ${orgIds.has(org.id)?"checked":""}><span><strong>${esc(org.name)}</strong><small>${esc(org.type||"Organization")}</small></span></label>`).join("")}</div></section>
      <section><div class="subdialog-heading"><strong>Labels</strong><span>Preset and custom labels are both allowed.</span></div><div class="relationship-grid labels">${data.labels.map(label=>`<label><input type="checkbox" data-person-label="${esc(label.id)}" ${labelIds.has(label.id)?"checked":""}><span><strong>${esc(label.name)}</strong><small>${label.preset?"Suggested":"Custom"}</small></span></label>`).join("")}</div></section>
      <button type="button" class="subdialog-save" data-person-save="${esc(person.id)}">Save relationships</button>
    </main></div></div>`);
  }

  function createLabelDialog() {
    document.querySelector(".directory-subdialog")?.remove();
    document.body.insertAdjacentHTML("beforeend",`<div class="directory-subdialog" role="dialog" aria-modal="true"><div class="directory-subdialog-app compact"><header><span><small>NEW LABEL</small><strong>Create your own label</strong><em>Examples: Gym, School, Contractors, NZ friends, Vault.</em></span><button type="button" data-directory-dialog-close>×</button></header><main><label class="dialog-field"><span>Label name</span><input type="text" maxlength="40" data-new-label-name placeholder="Custom label" /></label><button type="button" class="subdialog-save" data-label-create>Create label</button></main></div></div>`);
    requestAnimationFrame(()=>document.querySelector("[data-new-label-name]")?.focus());
  }

  function createGroupDialog() {
    const data=loadCrm();
    document.querySelector(".directory-subdialog")?.remove();
    document.body.insertAdjacentHTML("beforeend",`<div class="directory-subdialog" role="dialog" aria-modal="true"><div class="directory-subdialog-app"><header><span><small>NEW GROUP</small><strong>Create custom group</strong><em>Add people, whole organizations, or labels. Resolution deduplicates people.</em></span><button type="button" data-directory-dialog-close>×</button></header><main>
      <label class="dialog-field"><span>Group name</span><input type="text" maxlength="70" data-new-group-name placeholder="People to notify first" /></label>
      <section><div class="subdialog-heading"><strong>People</strong><span>Direct members</span></div><div class="relationship-grid">${data.people.map(p=>`<label><input type="checkbox" data-group-member="person:${esc(p.id)}"><span><strong>${esc(p.name)}</strong><small>${esc(p.role||"Person")}</small></span></label>`).join("")}</div></section>
      <section><div class="subdialog-heading"><strong>Organizations</strong><span>All current members</span></div><div class="relationship-grid">${data.organizations.map(o=>`<label><input type="checkbox" data-group-member="organization:${esc(o.id)}"><span><strong>${esc(o.name)}</strong><small>${peopleForOrg(data,o.id).length} people</small></span></label>`).join("")}</div></section>
      <section><div class="subdialog-heading"><strong>Labels</strong><span>Everyone matching</span></div><div class="relationship-grid labels">${data.labels.map(l=>`<label><input type="checkbox" data-group-member="label:${esc(l.id)}"><span><strong>${esc(l.name)}</strong><small>${peopleForLabel(data,l.id).length} people</small></span></label>`).join("")}</div></section>
      <button type="button" class="subdialog-save" data-group-create>Create group</button>
    </main></div></div>`);
  }

  function savePersonRelationships(personId) {
    const data=loadCrm(); const person=data.people.find(p=>p.id===personId); if(!person)return;
    person.organizationIds=[...document.querySelectorAll("[data-person-org]:checked")].map(x=>x.dataset.personOrg);
    person.orgId=person.organizationIds[0]||"";
    person.labels=[...document.querySelectorAll("[data-person-label]:checked")].map(x=>x.dataset.personLabel);
    person.updatedAt=now(); saveCrm(data); document.querySelector(".directory-subdialog")?.remove(); rerenderManager();
  }

  function createLabel() {
    const input=document.querySelector("[data-new-label-name]"); const name=input?.value.trim(); if(!name)return;
    const data=loadCrm(); let id=slug(name); if(data.labels.some(l=>l.id===id)) id=`${id}-${Math.random().toString(36).slice(2,5)}`;
    data.labels.push({id,name,preset:false,createdAt:now()}); saveCrm(data); document.querySelector(".directory-subdialog")?.remove(); manager.tab="labels"; rerenderManager();
  }

  function createGroup() {
    const name=document.querySelector("[data-new-group-name]")?.value.trim(); if(!name)return;
    const members=[...document.querySelectorAll("[data-group-member]:checked")].map(input=>{const [kind,...rest]=input.dataset.groupMember.split(":");return{kind,id:rest.join(":")};});
    const data=loadCrm(); data.groups.push({id:makeId("grp"),name,description:"Custom saved audience",preset:false,members,createdAt:now()}); saveCrm(data); document.querySelector(".directory-subdialog")?.remove(); manager.tab="groups"; rerenderManager();
  }

  document.addEventListener("click",event=>{
    if (event.target.closest("[data-audience-open]")) { event.preventDefault(); openManager(event.target.closest("[data-audience-open]").dataset.audienceOpen); return; }
    if (event.target.closest("[data-audience-close]")) { closeManager(false); return; }
    if (event.target.closest("[data-audience-done]")) { closeManager(true); return; }
    const tab=event.target.closest("[data-audience-tab]"); if(tab){manager.tab=tab.dataset.audienceTab;manager.query="";rerenderManager();return;}
    const toggle=event.target.closest("[data-audience-toggle]"); if(toggle){toggleRef(toggle.dataset.audienceToggle);return;}
    const remove=event.target.closest("[data-audience-remove]"); if(remove){manager.selected=manager.selected.filter(ref=>refKey(ref)!==remove.dataset.audienceRemove);rerenderManager();return;}
    const person=event.target.closest("[data-person-manage]"); if(person){personDialog(person.dataset.personManage);return;}
    if(event.target.closest("[data-group-new]")){createGroupDialog();return;}
    if(event.target.closest("[data-label-new]")){createLabelDialog();return;}
    if(event.target.closest("[data-directory-dialog-close]")){document.querySelector(".directory-subdialog")?.remove();return;}
    const ps=event.target.closest("[data-person-save]"); if(ps){savePersonRelationships(ps.dataset.personSave);return;}
    if(event.target.closest("[data-label-create]")){createLabel();return;}
    if(event.target.closest("[data-group-create]")){createGroup();return;}
    requestAnimationFrame(()=>requestAnimationFrame(enhanceActionCards));
  },true);

  document.addEventListener("input",event=>{
    const search=event.target.closest("[data-audience-search]"); if(!search)return;
    manager.query=search.value; const caret=search.selectionStart; rerenderManager(); const next=document.querySelector("[data-audience-search]"); if(next){next.focus();next.setSelectionRange(caret,caret);}
  });

  document.addEventListener("keydown",event=>{
    if(event.key!=="Escape")return;
    if(document.querySelector(".directory-subdialog")){document.querySelector(".directory-subdialog")?.remove();return;}
    if(document.querySelector(".audience-manager-overlay")){closeManager(false);}
  },true);

  window.addEventListener("pageshow",()=>requestAnimationFrame(()=>requestAnimationFrame(enhanceActionCards)));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const data=loadCrm();saveCrm(data);enhanceActionCards();}));
})();