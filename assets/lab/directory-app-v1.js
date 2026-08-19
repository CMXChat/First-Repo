(() => {
  'use strict';

  const STORE_KEY = 'cmx-lab-crm-v1';
  const UI_KEY = 'continuum-directory-ui-v1';
  const THEME_KEY = 'continuum-directory-theme-v1';
  const AUTOMATIONS_KEY = 'cmx-lab-automations-v1';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  const now = () => new Date().toISOString();
  const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const uniq = (values) => [...new Set((values || []).filter(Boolean))];

  function seedData() {
    const ago = (hours) => new Date(Date.now() - hours * 3600000).toISOString();
    return {
      version: 1,
      people: [
        { id:'p-maya', name:'Maya Chen', role:'Primary counsel', orgId:'o-northstar', email:'maya.chen@example.test', phone:'+1 212 555 0142', location:'New York, NY', timezone:'America/New_York', relationship:'Legal', status:'Active', importance:'Critical', tags:['legal','primary','trusted'], notes:'Primary legal contact for high-priority contingency matters. Sample Lab record only.', updatedAt:ago(1.3), documents:3, actions:2, activity:[{title:'Profile reviewed',detail:'Contact details confirmed in Lab sample Directory.',at:ago(1.3)},{title:'Document linked',detail:'Emergency instructions package associated with this sample contact.',at:ago(22)}] },
        { id:'p-daniel', name:'Daniel Brooks', role:'Operations director', orgId:'o-atlas', email:'daniel.brooks@example.test', phone:'+1 646 555 0188', location:'New York, NY', timezone:'America/New_York', relationship:'Business', status:'Active', importance:'High', tags:['operations','business'], notes:'Operational point of contact in the synthetic Lab dataset.', updatedAt:ago(4), documents:1, actions:1, activity:[{title:'Note updated',detail:'Operational role clarified.',at:ago(4)}] },
        { id:'p-sofia', name:'Sofia Rahman', role:'Family contact', orgId:'', email:'sofia.rahman@example.test', phone:'+1 917 555 0115', location:'Queens, NY', timezone:'America/New_York', relationship:'Family', status:'Active', importance:'Critical', tags:['family','emergency'], notes:'High-priority personal contact in this synthetic Lab dataset.', updatedAt:ago(6), documents:2, actions:2, activity:[{title:'Priority changed',detail:'Marked Critical for the Lab scenario.',at:ago(6)}] },
        { id:'p-owen', name:'Owen Price', role:'Account manager', orgId:'o-atlas', email:'owen.price@example.test', phone:'+1 718 555 0191', location:'Brooklyn, NY', timezone:'America/New_York', relationship:'Vendor', status:'Active', importance:'Standard', tags:['vendor','accounts'], notes:'Secondary operational contact.', updatedAt:ago(18), documents:0, actions:0, activity:[{title:'Contact verified',detail:'Sample phone and email confirmed.',at:ago(18)}] },
        { id:'p-elena', name:'Elena Torres', role:'Trust administrator', orgId:'o-beacon', email:'elena.torres@example.test', phone:'+1 212 555 0137', location:'Jersey City, NJ', timezone:'America/New_York', relationship:'Financial', status:'Active', importance:'High', tags:['financial','trust'], notes:'Administrative contact for the synthetic Beacon Family Office record.', updatedAt:ago(26), documents:4, actions:1, activity:[{title:'Document linked',detail:'Sample trust instructions linked.',at:ago(26)}] },
        { id:'p-noah', name:'Noah Williams', role:'Technical contact', orgId:'o-atlas', email:'noah.williams@example.test', phone:'+1 347 555 0109', location:'New York, NY', timezone:'America/New_York', relationship:'Technical', status:'Active', importance:'High', tags:['technical','infrastructure'], notes:'Technical escalation contact used for Lab interface testing.', updatedAt:ago(31), documents:1, actions:1, activity:[{title:'Label added',detail:'Infrastructure label added.',at:ago(31)}] },
        { id:'p-hannah', name:'Hannah Kim', role:'Emergency contact', orgId:'', email:'hannah.kim@example.test', phone:'+1 929 555 0162', location:'Long Island, NY', timezone:'America/New_York', relationship:'Personal', status:'Active', importance:'High', tags:['personal','emergency'], notes:'Synthetic emergency contact.', updatedAt:ago(46), documents:0, actions:1, activity:[{title:'Record reviewed',detail:'No changes required.',at:ago(46)}] },
        { id:'p-marcus', name:'Marcus Reed', role:'Secondary counsel', orgId:'o-northstar', email:'marcus.reed@example.test', phone:'+1 212 555 0177', location:'New York, NY', timezone:'America/New_York', relationship:'Legal', status:'Active', importance:'Standard', tags:['legal','secondary'], notes:'Secondary legal contact in the Lab sample dataset.', updatedAt:ago(60), documents:1, actions:0, activity:[{title:'Organization linked',detail:'Connected to Northstar Legal.',at:ago(60)}] }
      ],
      organizations: [
        { id:'o-northstar', name:'Northstar Legal', type:'Legal counsel', email:'intake@northstar.example.test', phone:'+1 212 555 0100', website:'northstar.example.test', location:'New York, NY', status:'Active', tags:['legal','priority'], summary:'Primary legal organization in the synthetic Lab continuity directory.', updatedAt:ago(2), activity:[{title:'Organization reviewed',detail:'Primary contacts and sample details confirmed.',at:ago(2)}] },
        { id:'o-atlas', name:'Atlas Digital Group', type:'Digital operations', email:'ops@atlas.example.test', phone:'+1 646 555 0100', website:'atlas.example.test', location:'Brooklyn, NY', status:'Active', tags:['operations','technical'], summary:'Synthetic digital operations organization used to test relationships and action linkage.', updatedAt:ago(8), activity:[{title:'Contact added',detail:'Technical contact attached to this organization.',at:ago(8)}] },
        { id:'o-beacon', name:'Beacon Family Office', type:'Financial administration', email:'admin@beacon.example.test', phone:'+1 201 555 0100', website:'beacon.example.test', location:'Jersey City, NJ', status:'Watch', tags:['financial','restricted'], summary:'Synthetic family-office record for higher-sensitivity context testing.', updatedAt:ago(28), activity:[{title:'Status changed',detail:'Marked Watch in the Lab scenario.',at:ago(28)}] }
      ],
      groups: [
        { id:'g-family', name:'Family', description:'Saved audience for close family contacts.', selectors:[{type:'label',ref:'family'}], status:'Active', updatedAt:ago(12) },
        { id:'g-emergency-tier-1', name:'Emergency Tier 1', description:'Primary continuity audience assembled from emergency contacts.', selectors:[{type:'label',ref:'emergency'},{type:'person',ref:'p-maya'}], status:'Active', updatedAt:ago(9) },
        { id:'g-business-ops', name:'Business Operations', description:'Active people connected to Atlas Digital Group.', selectors:[{type:'organization',ref:'o-atlas'}], status:'Active', updatedAt:ago(21) }
      ]
    };
  }

  function loadStore() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (stored && Array.isArray(stored.people) && Array.isArray(stored.organizations)) return normalizeStore(stored);
    } catch (_) {}
    const seeded = normalizeStore(seedData());
    localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  function normalizeStore(store) {
    const starterGroups = seedData().groups;
    return {
      ...store,
      version: 1,
      people: (store.people || []).map((person) => {
        const labels = uniq([...(person.labels || []), ...(person.tags || [])].map((x) => String(x).trim().toLowerCase()));
        const organizationIds = uniq([...(person.organizationIds || []), person.orgId].filter(Boolean));
        const methods = Array.isArray(person.contactMethods) && person.contactMethods.length
          ? person.contactMethods
          : [
              person.email ? { id:`${person.id}-email`, type:'email', label:'Email', value:person.email, preferred:true, verified:true, active:true } : null,
              person.phone ? { id:`${person.id}-phone`, type:'phone', label:'Mobile', value:person.phone, preferred:!person.email, verified:true, active:true } : null
            ].filter(Boolean);
        return { ...person, labels, tags:uniq([...(person.tags || []), ...labels]), organizationIds, contactMethods:methods, lifecycle:person.lifecycle || person.status || 'Active', relationshipLinks:Array.isArray(person.relationshipLinks) ? person.relationshipLinks : [], activity:Array.isArray(person.activity) ? person.activity : [], updatedAt:person.updatedAt || now() };
      }),
      organizations: (store.organizations || []).map((org) => ({ ...org, labels:uniq([...(org.labels || []), ...(org.tags || [])].map((x) => String(x).trim().toLowerCase())), lifecycle:org.lifecycle || org.status || 'Active', activity:Array.isArray(org.activity) ? org.activity : [], updatedAt:org.updatedAt || now() })),
      groups: Array.isArray(store.groups) && store.groups.length ? store.groups : starterGroups
    };
  }

  let data = loadStore();
  const ui = loadUi();

  function loadUi() {
    try {
      const saved = JSON.parse(localStorage.getItem(UI_KEY) || 'null');
      if (saved && ['people','organizations','groups'].includes(saved.mode)) return { mode:saved.mode, selectedId:saved.selectedId || null, view:saved.view || 'all', tab:saved.tab || 'overview', query:'' };
    } catch (_) {}
    return { mode:'people', selectedId:null, view:'all', tab:'overview', query:'' };
  }

  function saveUi() {
    try { localStorage.setItem(UI_KEY, JSON.stringify({ mode:ui.mode, selectedId:ui.selectedId, view:ui.view, tab:ui.tab })); } catch (_) {}
  }

  function persist(message) {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    saveUi();
    if (message) toast(message);
    window.dispatchEvent(new CustomEvent('cmx:lab-directory-updated', { detail:stats() }));
  }

  function person(id) { return data.people.find((x) => x.id === id) || null; }
  function org(id) { return data.organizations.find((x) => x.id === id) || null; }
  function group(id) { return data.groups.find((x) => x.id === id) || null; }
  function initials(name) { return String(name || '?').split(/\s+/).filter(Boolean).slice(0,2).map((x) => x[0]).join('').toUpperCase(); }
  function relative(iso) {
    const age = Math.max(0, Date.now() - new Date(iso || 0).getTime());
    if (age < 60000) return 'now';
    if (age < 3600000) return `${Math.floor(age / 60000)}m`;
    if (age < 86400000) return `${Math.floor(age / 3600000)}h`;
    if (age < 604800000) return `${Math.floor(age / 86400000)}d`;
    return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(new Date(iso));
  }

  function methodsFor(item) {
    if (!item) return [];
    if (Array.isArray(item.contactMethods)) return item.contactMethods.filter((m) => m?.value);
    return [item.email ? {type:'email',label:'Email',value:item.email,verified:true,active:true}:null,item.phone ? {type:'phone',label:'Phone',value:item.phone,verified:true,active:true}:null].filter(Boolean);
  }

  function readiness(item) {
    const methods = methodsFor(item).filter((m) => m.active !== false);
    return {
      email:methods.some((m) => m.type === 'email' && m.value),
      phone:methods.some((m) => m.type === 'phone' && m.value),
      verifiedEmail:methods.some((m) => m.type === 'email' && m.value && m.verified !== false),
      verifiedPhone:methods.some((m) => m.type === 'phone' && m.value && m.verified !== false)
    };
  }

  function peopleForOrg(id) { return data.people.filter((p) => (p.organizationIds || []).includes(id) || p.orgId === id); }
  function peopleForLabel(label) { const key=String(label||'').toLowerCase(); return data.people.filter((p) => (p.labels || []).includes(key)); }
  function resolveGroup(item) {
    const ids = new Set();
    (item?.selectors || []).forEach((selector) => {
      if (selector.type === 'person' && person(selector.ref)) ids.add(selector.ref);
      if (selector.type === 'organization') peopleForOrg(selector.ref).forEach((p) => ids.add(p.id));
      if (selector.type === 'label') peopleForLabel(selector.ref).forEach((p) => ids.add(p.id));
    });
    return [...ids].map(person).filter(Boolean);
  }
  function groupsForPerson(id) { return data.groups.filter((g) => resolveGroup(g).some((p) => p.id === id)); }

  function duplicateCount(record) {
    if (!record || (!record.email && !record.phone)) return 0;
    const email = String(record.email || '').toLowerCase();
    const phoneDigits = String(record.phone || '').replace(/\D/g,'');
    return data.people.filter((p) => p.id !== record.id && ((email && String(p.email||'').toLowerCase() === email) || (phoneDigits && String(p.phone||'').replace(/\D/g,'') === phoneDigits))).length;
  }

  function automations() {
    try { return JSON.parse(localStorage.getItem(AUTOMATIONS_KEY) || '{}').automations || []; } catch (_) { return []; }
  }
  function automationUsage(kind,id) {
    return automations().filter((a) => (a.actions || []).some((action) => {
      const ref = action?.targetRef;
      return ref?.kind === kind && ref?.id === id;
    }));
  }

  function stats() {
    return { people:data.people.length, organizations:data.organizations.length, groups:data.groups.length, emailReady:data.people.filter((p)=>readiness(p).email).length, phoneReady:data.people.filter((p)=>readiness(p).phone).length };
  }

  function currentRecords() { return ui.mode === 'people' ? data.people : ui.mode === 'organizations' ? data.organizations : data.groups; }

  function searchable(record) {
    if (ui.mode === 'people') {
      return [record.name,record.role,record.email,record.phone,record.location,record.relationship,...(record.labels||[]),...(record.organizationIds||[]).map((id)=>org(id)?.name)].filter(Boolean).join(' ').toLowerCase();
    }
    if (ui.mode === 'organizations') return [record.name,record.type,record.email,record.phone,record.website,record.location,...(record.labels||[])].filter(Boolean).join(' ').toLowerCase();
    return [record.name,record.description,...(record.selectors||[]).map((s)=>`${s.type} ${s.ref}`)].filter(Boolean).join(' ').toLowerCase();
  }

  function filteredRecords() {
    const q = ui.query.trim().toLowerCase();
    let rows = currentRecords().filter((r) => !q || searchable(r).includes(q));
    if (ui.mode === 'people') {
      if (ui.view === 'critical') rows = rows.filter((r) => ['Critical','High'].includes(r.importance));
      if (ui.view === 'needs-contact') rows = rows.filter((r) => !readiness(r).email || !readiness(r).phone);
      if (ui.view === 'duplicates') rows = rows.filter((r) => duplicateCount(r) > 0);
      if (ui.view === 'recent') rows = [...rows].sort((a,b) => new Date(b.updatedAt)-new Date(a.updatedAt));
    }
    if (ui.mode === 'organizations') {
      if (ui.view === 'watch') rows = rows.filter((r) => r.status === 'Watch' || r.lifecycle === 'Watch');
      if (ui.view === 'recent') rows = [...rows].sort((a,b) => new Date(b.updatedAt)-new Date(a.updatedAt));
    }
    if (ui.mode === 'groups') {
      if (ui.view === 'email-ready') rows = rows.filter((g) => resolveGroup(g).some((p) => readiness(p).email));
      if (ui.view === 'recent') rows = [...rows].sort((a,b) => new Date(b.updatedAt)-new Date(a.updatedAt));
    }
    return rows;
  }

  const viewsByMode = {
    people:[['all','All'],['critical','Important'],['needs-contact','Needs contact'],['duplicates','Duplicates'],['recent','Recent']],
    organizations:[['all','All'],['watch','Watch'],['recent','Recent']],
    groups:[['all','All'],['email-ready','Email ready'],['recent','Recent']]
  };

  function render() {
    const rows = filteredRecords();
    if (!rows.some((x)=>x.id===ui.selectedId)) ui.selectedId = rows[0]?.id || null;
    renderCounts();
    renderModes();
    renderViews();
    renderList(rows);
    renderDetail();
    renderContext();
    saveUi();
  }

  function renderCounts() {
    $('#peopleCount').textContent = data.people.length;
    $('#orgCount').textContent = data.organizations.length;
    $('#groupCount').textContent = data.groups.length;
    $('#listTitle').textContent = ui.mode === 'people' ? 'People' : ui.mode === 'organizations' ? 'Organizations' : 'Groups';
    $('#visibleCount').textContent = filteredRecords().length;
  }

  function renderModes() {
    $$('[data-mode]').forEach((button) => {
      const active = button.dataset.mode === ui.mode;
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.tabIndex = active ? 0 : -1;
    });
  }

  function renderViews() {
    $('#viewBar').innerHTML = viewsByMode[ui.mode].map(([key,label]) => `<button type="button" data-view="${key}" aria-pressed="${ui.view===key}">${esc(label)}</button>`).join('');
  }

  function renderList(rows) {
    const list = $('#recordList');
    if (!rows.length) {
      list.innerHTML = '<div class="dir-empty-list"><strong>No matching records.</strong><br>Change the search or view filter.</div>';
      return;
    }
    list.innerHTML = rows.map((record) => {
      if (ui.mode === 'people') {
        const ready = readiness(record);
        return `<button class="dir-record" type="button" data-record="${record.id}" aria-current="${record.id===ui.selectedId}"><span class="dir-avatar">${esc(initials(record.name))}</span><span class="dir-record-copy"><strong>${esc(record.name)}</strong><span>${esc(record.role || record.relationship || 'Person')}</span></span><span class="dir-record-meta"><small class="${record.importance==='Critical'?'warn':''}">${esc(record.importance || 'Active')}</small><span class="dir-ready-dots"><i class="${ready.email?'on':''}">E</i><i class="${ready.phone?'on':''}">P</i></span></span></button>`;
      }
      if (ui.mode === 'organizations') {
        const members = peopleForOrg(record.id).length;
        return `<button class="dir-record" type="button" data-record="${record.id}" aria-current="${record.id===ui.selectedId}"><span class="dir-avatar org">${esc(initials(record.name))}</span><span class="dir-record-copy"><strong>${esc(record.name)}</strong><span>${esc(record.type || 'Organization')}</span></span><span class="dir-record-meta"><small class="${record.status==='Watch'?'warn':''}">${members} people</small><span>${esc(relative(record.updatedAt))}</span></span></button>`;
      }
      const members = resolveGroup(record);
      const emailReady = members.filter((p)=>readiness(p).email).length;
      return `<button class="dir-record" type="button" data-record="${record.id}" aria-current="${record.id===ui.selectedId}"><span class="dir-avatar group">GRP</span><span class="dir-record-copy"><strong>${esc(record.name)}</strong><span>${members.length} resolved people</span></span><span class="dir-record-meta"><small>${emailReady} email</small><span>${esc(relative(record.updatedAt))}</span></span></button>`;
    }).join('');
  }

  function profileHeader(record, kind, subtitle, chips) {
    return `<button class="dir-mobile-back" id="mobileBack" type="button">← Back to Directory</button><header class="dir-profile-head"><span class="dir-profile-avatar ${kind==='organization'?'org':kind==='group'?'group':''}">${kind==='group'?'GRP':esc(initials(record.name))}</span><div class="dir-profile-copy"><span>${kind.toUpperCase()} · LAB SAMPLE</span><h3>${esc(record.name)}</h3><p>${esc(subtitle || '')}</p><div class="dir-profile-chips">${chips.map((chip)=>`<span class="dir-chip"${chip.tone?` data-tone="${chip.tone}"`:''}>${esc(chip.label)}</span>`).join('')}</div></div><div class="dir-profile-actions"><button class="dir-icon-action" type="button" id="editRecord">Edit locally</button></div></header>`;
  }

  function tabsFor(kind) {
    const tabs = kind === 'group' ? [['overview','Overview'],['members','Members'],['activity','Activity']] : [['overview','Overview'],['relationships','Relationships'],['activity','Activity'],['automation','Automations']];
    return `<nav class="dir-profile-tabs" role="tablist">${tabs.map(([key,label])=>`<button type="button" data-profile-tab="${key}" role="tab" aria-selected="${ui.tab===key}">${label}</button>`).join('')}</nav>`;
  }

  function renderDetail() {
    const record = currentRecords().find((x)=>x.id===ui.selectedId);
    const pane = $('#detailPane');
    if (!record) { pane.innerHTML='<div class="dir-empty-list">Select a record to inspect it.</div>'; return; }
    if (ui.mode === 'people') renderPerson(record,pane);
    if (ui.mode === 'organizations') renderOrganization(record,pane);
    if (ui.mode === 'groups') renderGroup(record,pane);
  }

  function renderPerson(record,pane) {
    const ready = readiness(record);
    const orgs = (record.organizationIds || []).map(org).filter(Boolean);
    const groups = groupsForPerson(record.id);
    const chips = [{label:record.lifecycle || 'Active',tone:'green'},{label:record.importance || 'Standard',tone:record.importance==='Critical'?'amber':''},...((record.labels||[]).slice(0,2).map((label)=>({label})) )];
    pane.innerHTML = profileHeader(record,'person',record.role || record.relationship,chips) + tabsFor('person') + `<div class="dir-profile-body">${renderPersonTab(record,ready,orgs,groups)}</div>`;
  }

  function renderPersonTab(record,ready,orgs,groups) {
    if (ui.tab === 'overview') {
      return `<div class="dir-facts"><div class="dir-fact"><span>Preferred email</span><strong>${esc(record.email || 'Not set')}</strong></div><div class="dir-fact"><span>Phone</span><strong>${esc(record.phone || 'Not set')}</strong></div><div class="dir-fact"><span>Location</span><strong>${esc(record.location || 'Not set')}</strong></div><div class="dir-fact"><span>Timezone</span><strong>${esc(record.timezone || 'Not set')}</strong></div></div><section class="dir-panel"><header><strong>Contact methods</strong><small>${ready.email?'EMAIL READY':'EMAIL MISSING'} · ${ready.phone?'PHONE READY':'PHONE MISSING'}</small></header><div class="dir-methods">${methodsFor(record).map((method)=>`<div class="dir-method"><span class="dir-method-icon">${method.type==='email'?'@':'TEL'}</span><span class="dir-method-copy"><strong>${esc(method.label || method.type)}</strong><span>${esc(method.value)}</span></span><span class="dir-method-state">${method.verified===false?'UNVERIFIED':'READY'}</span></div>`).join('') || '<p>No contact methods saved.</p>'}</div></section><section class="dir-panel"><header><strong>Labels</strong><small>DESCRIPTIVE ONLY</small></header><div class="dir-label-cloud">${(record.labels||[]).map((label)=>`<span>${esc(label)}</span>`).join('') || '<span>none</span>'}</div></section><section class="dir-panel"><header><strong>Notes</strong><small>LAB SAMPLE</small></header><p>${esc(record.notes || 'No notes yet.')}</p></section>`;
    }
    if (ui.tab === 'relationships') {
      const related = [
        ...orgs.map((o)=>({icon:'ORG',title:o.name,desc:o.type || 'Organization',state:'Membership'})),
        ...groups.map((g)=>({icon:'GRP',title:g.name,desc:g.description || 'Saved audience',state:'Group'})),
        ...(record.relationshipLinks||[]).map((link)=>({icon:'REL',title:person(link.personId)?.name || 'Unknown person',desc:link.type || 'Relationship',state:'Explicit'}))
      ];
      return `<section class="dir-panel"><header><strong>Identity relationships</strong><small>${related.length} linked</small></header><div class="dir-related-list">${related.map((r)=>`<div class="dir-related"><span class="dir-related-icon">${r.icon}</span><span class="dir-related-copy"><strong>${esc(r.title)}</strong><span>${esc(r.desc)}</span></span><span class="dir-related-state">${esc(r.state)}</span></div>`).join('') || '<p>No relationships yet.</p>'}</div></section><section class="dir-panel"><header><strong>Authority boundary</strong><small>IMPORTANT</small></header><p>Family, lawyer, trusted, emergency and other relationship labels describe context. They do not grant permission or continuity authority by themselves.</p></section>`;
    }
    if (ui.tab === 'activity') return activityPanel(record.activity);
    const usage = automationUsage('person',record.id);
    return `<section class="dir-panel"><header><strong>Automation usage</strong><small>${usage.length} references</small></header><div class="dir-usage-list">${usage.map((a)=>`<div class="dir-usage-item"><span class="dir-usage-icon">AUTO</span><span class="dir-usage-copy"><strong>${esc(a.name || 'Automation Draft')}</strong><span>Browser-local Lab definition</span></span><span class="dir-method-state">${esc(a.status || 'Draft')}</span></div>`).join('') || '<p>No current local Automation Draft directly references this Person.</p>'}</div></section>`;
  }

  function renderOrganization(record,pane) {
    const members = peopleForOrg(record.id);
    const chips = [{label:record.lifecycle || record.status || 'Active',tone:record.status==='Watch'?'amber':'green'},...((record.labels||[]).slice(0,2).map((label)=>({label})))];
    pane.innerHTML = profileHeader(record,'organization',record.type || 'Organization',chips) + tabsFor('organization') + `<div class="dir-profile-body">${renderOrgTab(record,members)}</div>`;
  }

  function renderOrgTab(record,members) {
    if (ui.tab === 'overview') return `<div class="dir-facts"><div class="dir-fact"><span>Email</span><strong>${esc(record.email || 'Not set')}</strong></div><div class="dir-fact"><span>Phone</span><strong>${esc(record.phone || 'Not set')}</strong></div><div class="dir-fact"><span>Website</span><strong>${esc(record.website || 'Not set')}</strong></div><div class="dir-fact"><span>Location</span><strong>${esc(record.location || 'Not set')}</strong></div></div><div class="dir-metrics"><div class="dir-metric"><strong>${members.length}</strong><span>People</span></div><div class="dir-metric"><strong>${members.filter((p)=>readiness(p).email).length}</strong><span>Email ready</span></div><div class="dir-metric"><strong>${record.documents || 0}</strong><span>Linked docs</span></div><div class="dir-metric"><strong>${record.actions || 0}</strong><span>References</span></div></div><section class="dir-panel"><header><strong>Summary</strong><small>LAB SAMPLE</small></header><p>${esc(record.summary || 'No summary yet.')}</p></section><section class="dir-panel"><header><strong>Labels</strong><small>DESCRIPTIVE ONLY</small></header><div class="dir-label-cloud">${(record.labels||[]).map((label)=>`<span>${esc(label)}</span>`).join('') || '<span>none</span>'}</div></section>`;
    if (ui.tab === 'relationships') return `<section class="dir-panel"><header><strong>People</strong><small>${members.length} memberships</small></header><div class="dir-related-list">${members.map((p)=>`<button class="dir-related" type="button" data-open-person="${p.id}"><span class="dir-related-icon">${esc(initials(p.name))}</span><span class="dir-related-copy"><strong>${esc(p.name)}</strong><span>${esc(p.role || 'Person')}</span></span><span class="dir-related-state">OPEN</span></button>`).join('') || '<p>No members linked.</p>'}</div></section>`;
    if (ui.tab === 'activity') return activityPanel(record.activity);
    const usage = automationUsage('organization',record.id);
    return `<section class="dir-panel"><header><strong>Automation usage</strong><small>${usage.length} references</small></header><div class="dir-usage-list">${usage.map((a)=>`<div class="dir-usage-item"><span class="dir-usage-icon">AUTO</span><span class="dir-usage-copy"><strong>${esc(a.name || 'Automation Draft')}</strong><span>Browser-local Lab definition</span></span><span class="dir-method-state">${esc(a.status || 'Draft')}</span></div>`).join('') || '<p>No current local Automation Draft directly references this Organization.</p>'}</div></section>`;
  }

  function renderGroup(record,pane) {
    const members = resolveGroup(record);
    const emailReady = members.filter((p)=>readiness(p).email).length;
    const phoneReady = members.filter((p)=>readiness(p).phone).length;
    pane.innerHTML = profileHeader(record,'group',record.description || 'Saved audience',[{label:record.status || 'Active',tone:'green'},{label:`${members.length} people`}]) + tabsFor('group') + `<div class="dir-profile-body">${renderGroupTab(record,members,emailReady,phoneReady)}</div>`;
  }

  function renderGroupTab(record,members,emailReady,phoneReady) {
    if (ui.tab === 'overview') return `<div class="dir-metrics"><div class="dir-metric"><strong>${members.length}</strong><span>Resolved people</span></div><div class="dir-metric"><strong>${emailReady}</strong><span>Email ready</span></div><div class="dir-metric"><strong>${phoneReady}</strong><span>Phone ready</span></div><div class="dir-metric"><strong>${(record.selectors||[]).length}</strong><span>Selectors</span></div></div><section class="dir-panel"><header><strong>Selector definition</strong><small>LIVE MEMBERSHIP PREVIEW</small></header><div class="dir-related-list">${(record.selectors||[]).map((s)=>`<div class="dir-related"><span class="dir-related-icon">${esc(s.type.slice(0,3).toUpperCase())}</span><span class="dir-related-copy"><strong>${esc(selectorLabel(s))}</strong><span>${esc(s.type)} selector</span></span><span class="dir-related-state">RESOLVE</span></div>`).join('') || '<p>No selectors yet.</p>'}</div></section><section class="dir-panel"><header><strong>Audience rule</strong><small>IDENTITY FIRST</small></header><p>Group resolution expands the saved selectors into unique People first. Channel readiness is evaluated after identity resolution. Unready People should remain visible with a reason in production.</p></section>`;
    if (ui.tab === 'members') return `<section class="dir-panel"><header><strong>Resolved people</strong><small>${members.length} unique</small></header><div class="dir-related-list">${members.map((p)=>{const r=readiness(p);return `<button class="dir-related" type="button" data-open-person="${p.id}"><span class="dir-related-icon">${esc(initials(p.name))}</span><span class="dir-related-copy"><strong>${esc(p.name)}</strong><span>${esc(p.role || 'Person')}</span></span><span class="dir-ready-dots"><i class="${r.email?'on':''}">E</i><i class="${r.phone?'on':''}">P</i></span></button>`}).join('') || '<p>No people currently resolve.</p>'}</div></section>`;
    return activityPanel(record.activity || []);
  }

  function selectorLabel(selector) {
    if (selector.type === 'person') return person(selector.ref)?.name || selector.ref;
    if (selector.type === 'organization') return org(selector.ref)?.name || selector.ref;
    if (selector.type === 'label') return `#${selector.ref}`;
    return selector.ref;
  }

  function activityPanel(activity) {
    const rows = activity || [];
    return `<section class="dir-panel"><header><strong>Profile activity</strong><small>USER-FACING TIMELINE</small></header><div class="dir-activity-list">${rows.map((item)=>`<div class="dir-activity-item"><span class="dir-activity-icon">•</span><span class="dir-activity-copy"><strong>${esc(item.title)}</strong><span>${esc(item.detail || '')}</span></span><span class="dir-activity-time">${esc(relative(item.at))}</span></div>`).join('') || '<p>No sample activity yet.</p>'}</div></section><section class="dir-panel"><header><strong>Audit boundary</strong><small>SEPARATE</small></header><p>Profile Activity is a user-facing projection. Production security Audit remains a separate immutable source of truth.</p></section>`;
  }

  function renderContext() {
    const pane = $('#contextPane');
    const record = currentRecords().find((x)=>x.id===ui.selectedId);
    if (!record) { pane.innerHTML=''; return; }
    if (ui.mode === 'people') {
      const r=readiness(record), groups=groupsForPerson(record.id), dupes=duplicateCount(record);
      pane.innerHTML = `<header class="dir-context-head"><span>Context</span><b>PERSON</b></header><div class="dir-context-body"><div class="dir-context-grid"><div class="dir-context-stat"><strong>${r.email?'Yes':'No'}</strong><span>Email ready</span></div><div class="dir-context-stat"><strong>${r.phone?'Yes':'No'}</strong><span>Phone ready</span></div></div><section class="dir-context-card" data-tone="${dupes?'amber':'green'}"><span>Identity quality</span><strong>${dupes?`${dupes} duplicate signal${dupes>1?'s':''}`:'No exact duplicate signal'}</strong><p>Exact normalized email/phone only. Suggestions never auto-merge.</p></section><section class="dir-context-card"><span>Saved audiences</span><strong>${groups.length} groups</strong><p>${esc(groups.map((g)=>g.name).join(' · ') || 'No current group membership')}</p></section><section class="dir-context-card"><span>Authority</span><strong>Relationship ≠ permission</strong><p>Trusted/family/legal labels do not create authority by themselves.</p></section></div>`;
      return;
    }
    if (ui.mode === 'organizations') {
      const members=peopleForOrg(record.id);
      pane.innerHTML=`<header class="dir-context-head"><span>Context</span><b>ORG</b></header><div class="dir-context-body"><div class="dir-context-grid"><div class="dir-context-stat"><strong>${members.length}</strong><span>People</span></div><div class="dir-context-stat"><strong>${members.filter((p)=>readiness(p).email).length}</strong><span>Email ready</span></div></div><section class="dir-context-card"><span>Relationship model</span><strong>Many-to-many</strong><p>Production membership stays separate from mutable Person and Organization records.</p></section><section class="dir-context-card"><span>Audience use</span><strong>${automationUsage('organization',record.id).length} Automation refs</strong><p>Production Runtime should freeze exact resolved recipients when a Run begins.</p></section></div>`;
      return;
    }
    const members=resolveGroup(record), emailReady=members.filter((p)=>readiness(p).email).length;
    pane.innerHTML=`<header class="dir-context-head"><span>Context</span><b>GROUP</b></header><div class="dir-context-body"><div class="dir-context-grid"><div class="dir-context-stat"><strong>${members.length}</strong><span>Unique people</span></div><div class="dir-context-stat"><strong>${emailReady}</strong><span>Email ready</span></div></div><section class="dir-context-card" data-tone="green"><span>Resolution</span><strong>Stable Person IDs</strong><p>Identity deduplication happens before channel readiness.</p></section><section class="dir-context-card"><span>Nested groups</span><strong>Deferred</strong><p>Current Group selectors stay Person, Organization, or Label to avoid unnecessary graph complexity.</p></section></div>`;
  }

  function setMode(mode) {
    if (!['people','organizations','groups'].includes(mode)) return;
    ui.mode=mode; ui.view='all'; ui.tab='overview'; ui.query=''; $('#directorySearch').value=''; ui.selectedId=currentRecords()[0]?.id || null; $('#directoryGrid').dataset.mobileDetail='false'; render();
  }

  function openRecord(id) {
    ui.selectedId=id; ui.tab='overview'; $('#directoryGrid').dataset.mobileDetail='true'; render();
  }

  function bind() {
    $$('[data-mode]').forEach((button)=>button.addEventListener('click',()=>setMode(button.dataset.mode)));
    $('#directorySearch').addEventListener('input',(event)=>{ui.query=event.target.value;render();});
    $('#viewBar').addEventListener('click',(event)=>{const b=event.target.closest('[data-view]');if(!b)return;ui.view=b.dataset.view;render();});
    $('#recordList').addEventListener('click',(event)=>{const b=event.target.closest('[data-record]');if(b)openRecord(b.dataset.record);});
    $('#detailPane').addEventListener('click',(event)=>{
      const tab=event.target.closest('[data-profile-tab]'); if(tab){ui.tab=tab.dataset.profileTab;renderDetail();return;}
      if(event.target.closest('#mobileBack')){$('#directoryGrid').dataset.mobileDetail='false';return;}
      const p=event.target.closest('[data-open-person]'); if(p){ui.mode='people';ui.selectedId=p.dataset.openPerson;ui.tab='overview';render();$('#directoryGrid').dataset.mobileDetail='true';return;}
      if(event.target.closest('#editRecord')) openRecordDialog(true);
    });
    $('#newRecord').addEventListener('click',()=>openRecordDialog(false));
    $$('[data-close-dialog]').forEach((b)=>b.addEventListener('click',()=>$('#recordDialog').close()));
    $('#recordForm').addEventListener('submit',saveRecordForm);
    $('#resetSample').addEventListener('click',()=>{data=normalizeStore(seedData());persist('Sample Directory reset');ui.mode='people';ui.view='all';ui.tab='overview';ui.selectedId=data.people[0]?.id;render();});
    $('#themeToggle').addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
    $('#openPlanner').addEventListener('click',()=>$('#plannerDialog').showModal());
    $('[data-close-planner]').addEventListener('click',()=>$('#plannerDialog').close());
    $('#previewPlan').addEventListener('click',previewPlan);
    $('#filterToggle').addEventListener('click',()=>{const current=$('#filterToggle').getAttribute('aria-expanded')==='true';$('#filterToggle').setAttribute('aria-expanded',current?'false':'true');$('#viewBar').scrollIntoView({block:'nearest',behavior:'smooth'});});
    $('#globalCommand').addEventListener('click',openCommand);
    document.addEventListener('keydown',(event)=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openCommand();}});
  }

  function openRecordDialog(edit) {
    const current = edit ? currentRecords().find((x)=>x.id===ui.selectedId) : null;
    const mode = ui.mode;
    $('#recordDialogTitle').textContent = `${edit?'Edit':'New'} ${mode==='people'?'person':mode==='organizations'?'organization':'group'}`;
    const fields = mode === 'people'
      ? [['name','Name',current?.name||''],['role','Role / title',current?.role||''],['email','Email',current?.email||''],['phone','Phone',current?.phone||''],['location','Location',current?.location||''],['timezone','Timezone',current?.timezone||''],['labels','Labels, comma separated',(current?.labels||[]).join(', ')],['notes','Notes',current?.notes||'','textarea']]
      : mode === 'organizations'
        ? [['name','Name',current?.name||''],['type','Type',current?.type||''],['email','Email',current?.email||''],['phone','Phone',current?.phone||''],['website','Website',current?.website||''],['location','Location',current?.location||''],['labels','Labels, comma separated',(current?.labels||[]).join(', ')],['summary','Summary',current?.summary||'','textarea']]
        : [['name','Group name',current?.name||''],['description','Description',current?.description||'','textarea']];
    $('#recordFormBody').innerHTML = `<input type="hidden" name="recordId" value="${esc(current?.id||'')}"><input type="hidden" name="recordMode" value="${mode}"><div class="dir-form-grid">${fields.map(([key,label,value,type])=>`<div class="dir-field ${type==='textarea'?'full':''}"><label for="field-${key}">${esc(label)}</label>${type==='textarea'?`<textarea id="field-${key}" name="${key}" rows="4">${esc(value)}</textarea>`:`<input id="field-${key}" name="${key}" value="${esc(value)}" ${key==='name'?'required':''}>`}</div>`).join('')}</div>${mode==='groups'?'<p class="dir-plan-note">New groups start with no selectors. Selector editing remains in the richer legacy Lab prototype until this isolated surface gets a dedicated safe editor.</p>':''}`;
    $('#recordDialog').showModal();
    $('#recordFormBody input:not([type="hidden"])')?.focus();
  }

  function saveRecordForm(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const mode = form.get('recordMode');
    const id = form.get('recordId');
    const target = mode==='people'?data.people:mode==='organizations'?data.organizations:data.groups;
    const existing = target.find((x)=>x.id===id);
    const base = existing || { id:makeId(mode==='people'?'p':mode==='organizations'?'o':'g'), status:'Active', updatedAt:now(), activity:[] };
    if (mode==='people') {
      base.name=String(form.get('name')||'').trim(); base.role=String(form.get('role')||'').trim(); base.email=String(form.get('email')||'').trim(); base.phone=String(form.get('phone')||'').trim(); base.location=String(form.get('location')||'').trim(); base.timezone=String(form.get('timezone')||'').trim(); base.labels=String(form.get('labels')||'').split(',').map((x)=>x.trim().toLowerCase()).filter(Boolean); base.tags=[...base.labels]; base.notes=String(form.get('notes')||'').trim(); base.lifecycle=base.lifecycle||'Active'; base.organizationIds=base.organizationIds||[]; base.contactMethods=[base.email?{id:`${base.id}-email`,type:'email',label:'Email',value:base.email,preferred:true,verified:true,active:true}:null,base.phone?{id:`${base.id}-phone`,type:'phone',label:'Mobile',value:base.phone,preferred:!base.email,verified:true,active:true}:null].filter(Boolean);
    } else if(mode==='organizations') {
      base.name=String(form.get('name')||'').trim(); base.type=String(form.get('type')||'').trim(); base.email=String(form.get('email')||'').trim(); base.phone=String(form.get('phone')||'').trim(); base.website=String(form.get('website')||'').trim(); base.location=String(form.get('location')||'').trim(); base.labels=String(form.get('labels')||'').split(',').map((x)=>x.trim().toLowerCase()).filter(Boolean); base.tags=[...base.labels]; base.summary=String(form.get('summary')||'').trim(); base.lifecycle=base.lifecycle||'Active';
    } else {
      base.name=String(form.get('name')||'').trim(); base.description=String(form.get('description')||'').trim(); base.selectors=base.selectors||[];
    }
    base.updatedAt=now();
    if(!existing) target.unshift(base);
    ui.selectedId=base.id;
    persist(existing?'Record updated locally':'Record created locally');
    $('#recordDialog').close(); render();
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme=theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#060708':'#f5f7fa');
    try{localStorage.setItem(THEME_KEY,theme);}catch(_){}
  }

  function previewPlan() {
    const input=$('#plannerInput').value.trim();
    const text=input || 'Organize my important legal and emergency contacts into one continuity-ready group.';
    $('#planPreview').hidden=false;
    $('#planPreview').innerHTML=`<span>Typed change plan · Sample</span><h3>${esc(text)}</h3><div class="dir-plan-step"><b>1</b><span><strong>Search Directory</strong><small>Find matching People and labels through protected Directory search.</small></span><em>Read</em></div><div class="dir-plan-step"><b>2</b><span><strong>Propose Group selectors</strong><small>Create stable Person / Organization / Label references with duplicate preview.</small></span><em>Review</em></div><div class="dir-plan-step"><b>3</b><span><strong>Preview readiness</strong><small>Resolve unique People and show email/phone gaps before apply.</small></span><em>Check</em></div><div class="dir-plan-step"><b>4</b><span><strong>Apply through Directory service</strong><small>Would require normal protected mutation and Audit in production.</small></span><em>Blocked</em></div><p class="dir-plan-note">No model call occurred. No record, Group, authority grant, Automation, or server state was changed.</p>`;
  }

  let commandOverlay=null, commandInput=null, commandItems=[];
  function openCommand() {
    if(commandOverlay){commandOverlay.remove();commandOverlay=null;}
    commandItems=[
      {group:'Directory',title:'People',desc:'Open People',key:'P',action:()=>setMode('people')},
      {group:'Directory',title:'Organizations',desc:'Open Organizations',key:'O',action:()=>setMode('organizations')},
      {group:'Directory',title:'Groups',desc:'Open saved audiences',key:'G',action:()=>setMode('groups')},
      {group:'Directory',title:'Plan changes',desc:'Open AI setup preview',key:'✦',action:()=>$('#plannerDialog').showModal()},
      {group:'Continuum',title:'Control Center',desc:'Open Continuum home',href:'/lab/control/'},
      {group:'Continuum',title:'Check In',desc:'Open LIVE protected Check In',href:'/checkin/'},
      {group:'Continuum',title:'Automations',desc:'Open Automation Lab',href:'/lab/automations/'},
      {group:'Continuum',title:'Spaces',desc:'Open Spaces',href:'/spaces/'},
      {group:'Appearance',title:'Toggle theme',desc:'Switch light / rich-black dark',key:'T',action:()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark')}
    ];
    commandOverlay=document.createElement('div'); commandOverlay.className='dir-command-overlay';
    commandOverlay.innerHTML='<section class="dir-command-palette" role="dialog" aria-modal="true" aria-label="Continuum command palette"><div class="dir-command-input"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg><input type="search" placeholder="Jump or open" aria-label="Search commands"></div><div class="dir-command-results"></div></section>';
    document.body.append(commandOverlay); commandInput=$('input',commandOverlay); let active=0;
    const renderCommands=()=>{const q=commandInput.value.toLowerCase();const filtered=commandItems.filter((x)=>`${x.group} ${x.title} ${x.desc}`.toLowerCase().includes(q));let groupName='';$('.dir-command-results',commandOverlay).innerHTML=filtered.map((item,index)=>{const group=item.group!==groupName?`<div class="dir-command-group">${item.group}</div>`:'';groupName=item.group;return `${group}<button class="dir-command-item" type="button" data-command="${commandItems.indexOf(item)}" data-active="${index===active}"><i>›</i><span><strong>${esc(item.title)}</strong><span>${esc(item.desc)}</span></span><kbd>${esc(item.key||'↗')}</kbd></button>`}).join('') || '<div class="dir-empty-list">No matching command.</div>';$$('[data-command]',commandOverlay).forEach((b)=>b.addEventListener('click',()=>runCommand(Number(b.dataset.command))));};
    const runCommand=(index)=>{const item=commandItems[index];commandOverlay?.remove();commandOverlay=null;if(item?.href)window.location.href=item.href;else item?.action?.();};
    commandInput.addEventListener('input',()=>{active=0;renderCommands();}); commandInput.addEventListener('keydown',(event)=>{const buttons=$$('[data-command]',commandOverlay);if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();active=(active+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;buttons.forEach((b,i)=>b.dataset.active=String(i===active));buttons[active]?.scrollIntoView({block:'nearest'});}if(event.key==='Enter'){event.preventDefault();buttons[active]?.click();}if(event.key==='Escape'){commandOverlay?.remove();commandOverlay=null;$('#globalCommand').focus();}}); commandOverlay.addEventListener('pointerdown',(event)=>{if(event.target===commandOverlay){commandOverlay.remove();commandOverlay=null;$('#globalCommand').focus();}}); renderCommands(); commandInput.focus();
  }

  function toast(message) {
    const node=$('#toast'); node.textContent=message; node.classList.add('is-visible'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>node.classList.remove('is-visible'),2200);
  }

  bind();
  if(!ui.selectedId) ui.selectedId=currentRecords()[0]?.id || null;
  render();
  applyTheme(document.documentElement.dataset.theme==='dark'?'dark':'light');
  document.documentElement.dataset.continuumDirectory='v1';
})();
