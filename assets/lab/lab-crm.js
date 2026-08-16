(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  const STORAGE_KEY = "cmx-lab-crm-v1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const nowIso = offsetHours => new Date(Date.now() - offsetHours * 3600000).toISOString();

  function seedData() {
    return {
      version: 1,
      people: [
        {
          id: "p-maya", name: "Maya Chen", role: "Primary counsel", orgId: "o-northstar", phone: "+1 212 555 0142", email: "maya.chen@example.test", location: "New York, NY", timezone: "America/New_York", relationship: "Legal", status: "Active", importance: "Critical", tags: ["legal", "primary", "trusted"], notes: "Primary legal contact for high-priority contingency matters. Sample Lab record only.", documents: 3, actions: 2, updatedAt: nowIso(1.3), activity: [
            { title: "Profile reviewed", detail: "Contact details confirmed in Lab mock directory.", at: nowIso(1.3) },
            { title: "Document linked", detail: "Emergency instructions package attached to this sample contact.", at: nowIso(22) },
            { title: "Record created", detail: "Imported into the Lab CRM sample dataset.", at: nowIso(96) }
          ]
        },
        {
          id: "p-daniel", name: "Daniel Brooks", role: "Operations director", orgId: "o-atlas", phone: "+1 646 555 0188", email: "daniel.brooks@example.test", location: "New York, NY", timezone: "America/New_York", relationship: "Business", status: "Active", importance: "High", tags: ["operations", "business"], notes: "Operational point of contact. Sample data for directory UX testing.", documents: 1, actions: 1, updatedAt: nowIso(4), activity: [
            { title: "Note updated", detail: "Operational role clarified.", at: nowIso(4) },
            { title: "Organization linked", detail: "Connected to Atlas Digital Group.", at: nowIso(54) }
          ]
        },
        {
          id: "p-sofia", name: "Sofia Rahman", role: "Family contact", orgId: "", phone: "+1 917 555 0115", email: "sofia.rahman@example.test", location: "Queens, NY", timezone: "America/New_York", relationship: "Family", status: "Active", importance: "Critical", tags: ["family", "emergency"], notes: "High-priority personal contact in this synthetic Lab dataset.", documents: 2, actions: 2, updatedAt: nowIso(6), activity: [
            { title: "Priority changed", detail: "Marked Critical for the Lab scenario.", at: nowIso(6) },
            { title: "Record created", detail: "Added to sample directory.", at: nowIso(120) }
          ]
        },
        {
          id: "p-owen", name: "Owen Price", role: "Account manager", orgId: "o-atlas", phone: "+1 718 555 0191", email: "owen.price@example.test", location: "Brooklyn, NY", timezone: "America/New_York", relationship: "Vendor", status: "Active", importance: "Standard", tags: ["vendor", "accounts"], notes: "Secondary operational contact.", documents: 0, actions: 0, updatedAt: nowIso(18), activity: [
            { title: "Contact verified", detail: "Sample phone and email confirmed.", at: nowIso(18) }
          ]
        },
        {
          id: "p-elena", name: "Elena Torres", role: "Trust administrator", orgId: "o-beacon", phone: "+1 212 555 0137", email: "elena.torres@example.test", location: "Jersey City, NJ", timezone: "America/New_York", relationship: "Financial", status: "Active", importance: "High", tags: ["financial", "trust"], notes: "Administrative contact for the synthetic Beacon Family Office record.", documents: 4, actions: 1, updatedAt: nowIso(26), activity: [
            { title: "Document linked", detail: "Sample trust instructions linked.", at: nowIso(26) },
            { title: "Record created", detail: "Added to Lab directory.", at: nowIso(180) }
          ]
        },
        {
          id: "p-noah", name: "Noah Williams", role: "Technical contact", orgId: "o-atlas", phone: "+1 347 555 0109", email: "noah.williams@example.test", location: "New York, NY", timezone: "America/New_York", relationship: "Technical", status: "Active", importance: "High", tags: ["technical", "infrastructure"], notes: "Technical escalation contact used for Lab interface testing.", documents: 1, actions: 1, updatedAt: nowIso(31), activity: [
            { title: "Tag added", detail: "Infrastructure tag added.", at: nowIso(31) }
          ]
        },
        {
          id: "p-hannah", name: "Hannah Kim", role: "Emergency contact", orgId: "", phone: "+1 929 555 0162", email: "hannah.kim@example.test", location: "Long Island, NY", timezone: "America/New_York", relationship: "Personal", status: "Active", importance: "High", tags: ["personal", "emergency"], notes: "Synthetic emergency contact.", documents: 0, actions: 1, updatedAt: nowIso(46), activity: [
            { title: "Record reviewed", detail: "No changes required.", at: nowIso(46) }
          ]
        },
        {
          id: "p-marcus", name: "Marcus Reed", role: "Secondary counsel", orgId: "o-northstar", phone: "+1 212 555 0177", email: "marcus.reed@example.test", location: "New York, NY", timezone: "America/New_York", relationship: "Legal", status: "Active", importance: "Standard", tags: ["legal", "secondary"], notes: "Secondary legal contact in the Lab sample dataset.", documents: 1, actions: 0, updatedAt: nowIso(60), activity: [
            { title: "Organization linked", detail: "Connected to Northstar Legal.", at: nowIso(60) }
          ]
        }
      ],
      organizations: [
        {
          id: "o-northstar", name: "Northstar Legal", type: "Legal counsel", phone: "+1 212 555 0100", email: "intake@northstar.example.test", website: "northstar.example.test", location: "New York, NY", status: "Active", tags: ["legal", "priority"], summary: "Primary legal organization in the synthetic Lab contingency directory.", documents: 5, actions: 2, updatedAt: nowIso(2), activity: [
            { title: "Organization reviewed", detail: "Primary contacts and sample details confirmed.", at: nowIso(2) },
            { title: "Document package linked", detail: "Five synthetic records associated with this organization.", at: nowIso(40) }
          ]
        },
        {
          id: "o-atlas", name: "Atlas Digital Group", type: "Digital operations", phone: "+1 646 555 0100", email: "ops@atlas.example.test", website: "atlas.example.test", location: "Brooklyn, NY", status: "Active", tags: ["operations", "technical"], summary: "Synthetic digital operations organization used to test relationships, people and action linkage.", documents: 3, actions: 2, updatedAt: nowIso(8), activity: [
            { title: "Contact added", detail: "Technical contact attached to this organization.", at: nowIso(8) },
            { title: "Record created", detail: "Added to sample directory.", at: nowIso(150) }
          ]
        },
        {
          id: "o-beacon", name: "Beacon Family Office", type: "Financial administration", phone: "+1 201 555 0100", email: "admin@beacon.example.test", website: "beacon.example.test", location: "Jersey City, NJ", status: "Watch", tags: ["financial", "restricted"], summary: "Synthetic family-office record for testing financial relationships and higher-sensitivity context.", documents: 6, actions: 1, updatedAt: nowIso(28), activity: [
            { title: "Status changed", detail: "Marked Watch in the Lab scenario.", at: nowIso(28) }
          ]
        }
      ]
    };
  }

  function loadData() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored?.version === 1 && Array.isArray(stored.people) && Array.isArray(stored.organizations)) return stored;
    } catch {}
    const seeded = seedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  let data = loadData();
  const ui = { mode: "people", selectedId: data.people[0]?.id || null, query: "", filter: "all", sort: "updated" };
  let root;
  let editDialog;
  let noteDialog;

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    document.dispatchEvent(new CustomEvent("cmx:lab-crm-updated", { detail: { people: data.people.length, organizations: data.organizations.length } }));
  }

  function initials(name) {
    return String(name || "?").split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  }

  function orgFor(id) { return data.organizations.find(org => org.id === id) || null; }
  function personFor(id) { return data.people.find(person => person.id === id) || null; }
  function recordFor(id) { return ui.mode === "people" ? personFor(id) : orgFor(id); }
  function peopleForOrg(id) { return data.people.filter(person => person.orgId === id); }
  function priorityRank(value) { return ({ Critical: 0, High: 1, Standard: 2 }[value] ?? 3); }
  function shortDate(iso) {
    if (!iso) return "Unknown";
    const date = new Date(iso);
    const diff = Date.now() - date.getTime();
    if (diff < 3600000) return `${Math.max(1, Math.floor(diff / 60000))}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 7 * 86400000) return `${Math.floor(diff / 86400000)}d`;
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
  }
  function longDate(iso) {
    if (!iso) return "Unknown";
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
  }
  function slugId(prefix = "r") { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }
  function tagsFrom(value) { return String(value || "").split(",").map(tag => tag.trim()).filter(Boolean).slice(0, 8); }

  function toast(message) {
    const node = $("#toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("is-visible"), 2600);
  }

  function buildShell() {
    const panel = $('[data-view-panel="records"]');
    if (!panel || $(".lab-crm", panel)) return;

    const heading = $(".view-heading", panel);
    if (heading) {
      const eyebrow = $(".eyebrow", heading);
      const title = $("h1", heading);
      if (eyebrow) eyebrow.textContent = "PROTECTED DIRECTORY · LAB";
      if (title) title.textContent = "People & organizations";
      if (!$(".heading-meta", heading)) {
        const meta = document.createElement("div");
        meta.className = "heading-meta";
        meta.innerHTML = '<span>LOCAL MOCK</span><small>Safe Lab records</small>';
        heading.append(meta);
      }
    }

    root = document.createElement("section");
    root.className = "lab-crm";
    root.setAttribute("aria-label", "Lab people and organizations directory");
    root.innerHTML = `
      <header class="crm-topbar">
        <div class="crm-topbar-main">
          <span class="crm-topbar-mark" aria-hidden="true">ID</span>
          <span class="crm-topbar-copy"><strong>Protected directory</strong><small id="crmDirectoryCount">Lab sample records</small></span>
        </div>
        <div class="crm-segmented" role="tablist" aria-label="Directory type">
          <button type="button" class="is-active" data-crm-mode="people" role="tab" aria-selected="true">People</button>
          <button type="button" data-crm-mode="organizations" role="tab" aria-selected="false">Organizations</button>
        </div>
        <div class="crm-tools">
          <label class="crm-search-wrap"><span class="sr-only">Search directory</span><input id="crmSearch" class="crm-search" type="search" autocomplete="off" placeholder="Search people, email, tags…" /></label>
          <select id="crmFilter" class="crm-select" aria-label="Filter records"></select>
          <select id="crmSort" class="crm-select" aria-label="Sort records">
            <option value="updated">Recently updated</option><option value="name">Name A–Z</option><option value="priority">Priority</option>
          </select>
          <button type="button" class="crm-button primary" id="crmNew">＋ <span>New person</span></button>
        </div>
      </header>
      <div class="crm-layout">
        <aside class="crm-list-panel" aria-label="Directory records">
          <div class="crm-pane-head"><span id="crmListLabel">People</span><strong id="crmVisibleCount">0</strong></div>
          <div class="crm-list" id="crmList"></div>
          <div class="crm-list-footer"><span>Stored only in this browser</span><button type="button" class="crm-reset" id="crmReset">Reset sample</button></div>
        </aside>
        <section class="crm-detail-panel" id="crmDetail" aria-live="polite"></section>
        <aside class="crm-context-panel" aria-label="Record context"><div class="crm-pane-head"><span>Context</span><strong>LAB</strong></div><div class="crm-context" id="crmContext"></div></aside>
      </div>`;
    panel.append(root);

    buildDialogs();
    bindEvents();
    populateFilter();
    render();
  }

  function buildDialogs() {
    editDialog = document.createElement("dialog");
    editDialog.className = "crm-dialog";
    editDialog.id = "crmEditDialog";
    document.body.append(editDialog);

    noteDialog = document.createElement("dialog");
    noteDialog.className = "crm-dialog";
    noteDialog.id = "crmNoteDialog";
    document.body.append(noteDialog);
  }

  function bindEvents() {
    root.addEventListener("click", event => {
      const mode = event.target.closest("[data-crm-mode]");
      if (mode) return setMode(mode.dataset.crmMode);

      const item = event.target.closest("[data-record-id]");
      if (item) return selectRecord(item.dataset.recordId, true);

      const relatedOrg = event.target.closest("[data-open-org]");
      if (relatedOrg) { setMode("organizations"); return selectRecord(relatedOrg.dataset.openOrg, true); }

      const relatedPerson = event.target.closest("[data-open-person]");
      if (relatedPerson) { setMode("people"); return selectRecord(relatedPerson.dataset.openPerson, true); }

      const action = event.target.closest("[data-crm-action]");
      if (action) handleAction(action.dataset.crmAction);
    });

    $("#crmSearch", root).addEventListener("input", event => { ui.query = event.target.value.trim().toLowerCase(); renderList(); });
    $("#crmFilter", root).addEventListener("change", event => { ui.filter = event.target.value; renderList(); });
    $("#crmSort", root).addEventListener("change", event => { ui.sort = event.target.value; renderList(); });
    $("#crmNew", root).addEventListener("click", () => openEditor());
    $("#crmReset", root).addEventListener("click", resetSample);

    document.addEventListener("keydown", event => {
      if (event.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "")) {
        const recordsPanel = $('[data-view-panel="records"]');
        if (recordsPanel && !recordsPanel.hidden) { event.preventDefault(); $("#crmSearch", root)?.focus(); }
      }
      if (event.key === "Escape" && matchMedia("(max-width:700px)").matches && root?.dataset.mobileDetail === "true" && !editDialog.open && !noteDialog.open) {
        root.dataset.mobileDetail = "false";
      }
    });
  }

  function populateFilter() {
    const filter = $("#crmFilter", root);
    if (!filter) return;
    filter.innerHTML = ui.mode === "people"
      ? '<option value="all">All priority</option><option value="Critical">Critical</option><option value="High">High</option><option value="Standard">Standard</option>'
      : '<option value="all">All status</option><option value="Active">Active</option><option value="Watch">Watch</option>';
    ui.filter = "all";
    filter.value = "all";
  }

  function setMode(mode) {
    if (!mode || mode === ui.mode) return;
    ui.mode = mode;
    ui.query = "";
    $("#crmSearch", root).value = "";
    ui.selectedId = mode === "people" ? data.people[0]?.id || null : data.organizations[0]?.id || null;
    root.dataset.mobileDetail = "false";
    $$("[data-crm-mode]", root).forEach(button => {
      const active = button.dataset.crmMode === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    $("#crmListLabel", root).textContent = mode === "people" ? "People" : "Organizations";
    $("#crmNew", root).innerHTML = mode === "people" ? '＋ <span>New person</span>' : '＋ <span>New organization</span>';
    $("#crmSearch", root).placeholder = mode === "people" ? "Search people, email, tags…" : "Search organizations, type, tags…";
    populateFilter();
    render();
  }

  function selectRecord(id, openMobile = false) {
    ui.selectedId = id;
    if (openMobile && matchMedia("(max-width:700px)").matches) root.dataset.mobileDetail = "true";
    renderList();
    renderDetail();
    renderContext();
  }

  function filteredRecords() {
    let records = ui.mode === "people" ? [...data.people] : [...data.organizations];
    if (ui.query) {
      records = records.filter(record => {
        const org = ui.mode === "people" ? orgFor(record.orgId)?.name || "" : "";
        const haystack = [record.name, record.role, record.type, record.email, record.phone, record.location, record.relationship, record.status, org, ...(record.tags || [])].join(" ").toLowerCase();
        return haystack.includes(ui.query);
      });
    }
    if (ui.filter !== "all") {
      records = records.filter(record => ui.mode === "people" ? record.importance === ui.filter : record.status === ui.filter);
    }
    records.sort((a, b) => {
      if (ui.sort === "name") return a.name.localeCompare(b.name);
      if (ui.sort === "priority" && ui.mode === "people") return priorityRank(a.importance) - priorityRank(b.importance) || a.name.localeCompare(b.name);
      if (ui.sort === "priority") return (a.status === "Watch" ? -1 : 1) - (b.status === "Watch" ? -1 : 1) || a.name.localeCompare(b.name);
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });
    return records;
  }

  function render() {
    $("#crmDirectoryCount", root).textContent = `${data.people.length} people · ${data.organizations.length} organizations · local mock`;
    renderList();
    renderDetail();
    renderContext();
  }

  function renderList() {
    const list = $("#crmList", root);
    const records = filteredRecords();
    $("#crmVisibleCount", root).textContent = `${records.length}`;
    if (!records.length) {
      list.innerHTML = '<div class="crm-empty"><strong>No matching records</strong><br><br>Change the search or filter to see more Lab data.</div>';
      return;
    }
    list.innerHTML = records.map(record => {
      const active = record.id === ui.selectedId;
      const isPerson = ui.mode === "people";
      const secondary = isPerson ? [record.role, orgFor(record.orgId)?.name].filter(Boolean).join(" · ") : [record.type, `${peopleForOrg(record.id).length} people`].join(" · ");
      const importance = isPerson ? record.importance : record.status;
      const statusClass = importance === "Critical" ? "critical" : importance === "High" || importance === "Watch" ? "high" : "";
      return `<button type="button" class="crm-list-item${active ? " is-active" : ""}" data-record-id="${esc(record.id)}" aria-current="${active ? "true" : "false"}">
        <span class="crm-avatar${isPerson ? "" : " org"}" aria-hidden="true">${esc(initials(record.name))}</span>
        <span class="crm-list-copy"><strong>${esc(record.name)}</strong><small>${esc(secondary)}</small></span>
        <span class="crm-list-meta"><span class="crm-mini-status ${statusClass}">${esc(importance)}</span><span class="crm-mini-count">${esc(shortDate(record.updatedAt))}</span></span>
      </button>`;
    }).join("");
  }

  function renderDetail() {
    const detail = $("#crmDetail", root);
    const record = recordFor(ui.selectedId);
    if (!record) {
      detail.innerHTML = '<div class="crm-detail"><div class="crm-empty">Select a record to open its profile.</div></div>';
      return;
    }
    detail.innerHTML = ui.mode === "people" ? personDetail(record) : organizationDetail(record);
  }

  function personDetail(person) {
    const org = orgFor(person.orgId);
    return `<div class="crm-detail">
      <button type="button" class="crm-mobile-back" data-crm-action="mobile-back">← Directory</button>
      <header class="crm-profile-head">
        <span class="crm-profile-avatar" aria-hidden="true">${esc(initials(person.name))}</span>
        <div class="crm-profile-title">
          <span class="crm-profile-kicker"><i></i> PERSON · ${esc(person.importance)} PRIORITY</span>
          <h2>${esc(person.name)}</h2>
          <p>${esc(person.role || "Contact")}${org ? ` · ${esc(org.name)}` : ""}</p>
          <div class="crm-tag-row">${(person.tags || []).map(tag => `<span class="crm-tag">${esc(tag)}</span>`).join("")}</div>
        </div>
        <div class="crm-profile-actions"><button type="button" class="crm-button" data-crm-action="note">＋ Note</button><button type="button" class="crm-button" data-crm-action="edit">Edit</button><button type="button" class="crm-button primary" data-crm-action="open-actions">Actions →</button></div>
      </header>
      <div class="crm-facts">
        <div class="crm-fact"><span>Email</span><strong><a href="mailto:${esc(person.email)}">${esc(person.email || "Not set")}</a></strong></div>
        <div class="crm-fact"><span>Phone</span><strong>${esc(person.phone || "Not set")}</strong></div>
        <div class="crm-fact"><span>Location</span><strong>${esc(person.location || "Not set")}</strong></div>
        <div class="crm-fact"><span>Time zone</span><strong>${esc(person.timezone || "Not set")}</strong></div>
      </div>
      <div class="crm-detail-grid">
        <section class="crm-card"><div class="crm-card-head"><strong>Relationship</strong><small>${esc(person.relationship || "General")}</small></div>
          ${org ? `<button type="button" class="crm-related" data-open-org="${esc(org.id)}"><span class="crm-avatar org">${esc(initials(org.name))}</span><span class="crm-related-copy"><strong>${esc(org.name)}</strong><small>${esc(org.type)}</small></span><em>→</em></button>` : '<p class="crm-body-copy">No organization linked.</p>'}
        </section>
        <section class="crm-card"><div class="crm-card-head"><strong>Linked records</strong><small>Lab counts</small></div><div class="crm-metric-row"><div class="crm-metric"><strong>${Number(person.documents || 0)}</strong><span>Documents</span></div><div class="crm-metric"><strong>${Number(person.actions || 0)}</strong><span>Actions</span></div><div class="crm-metric"><strong>${(person.tags || []).length}</strong><span>Tags</span></div></div></section>
        <section class="crm-card full"><div class="crm-card-head"><strong>Notes</strong><small>Local mock</small></div><p class="crm-body-copy">${esc(person.notes || "No notes yet.")}</p></section>
        <section class="crm-card full"><div class="crm-card-head"><strong>Activity</strong><small>${(person.activity || []).length} events</small></div>${timeline(person.activity)}</section>
      </div>
    </div>`;
  }

  function organizationDetail(org) {
    const people = peopleForOrg(org.id);
    return `<div class="crm-detail">
      <button type="button" class="crm-mobile-back" data-crm-action="mobile-back">← Directory</button>
      <header class="crm-profile-head">
        <span class="crm-profile-avatar org" aria-hidden="true">${esc(initials(org.name))}</span>
        <div class="crm-profile-title">
          <span class="crm-profile-kicker"><i></i> ORGANIZATION · ${esc(org.status || "Active")}</span>
          <h2>${esc(org.name)}</h2>
          <p>${esc(org.type || "Organization")} · ${esc(org.location || "Location not set")}</p>
          <div class="crm-tag-row">${(org.tags || []).map(tag => `<span class="crm-tag">${esc(tag)}</span>`).join("")}</div>
        </div>
        <div class="crm-profile-actions"><button type="button" class="crm-button" data-crm-action="note">＋ Note</button><button type="button" class="crm-button" data-crm-action="edit">Edit</button><button type="button" class="crm-button primary" data-crm-action="new-person-for-org">＋ Person</button></div>
      </header>
      <div class="crm-facts">
        <div class="crm-fact"><span>Email</span><strong><a href="mailto:${esc(org.email)}">${esc(org.email || "Not set")}</a></strong></div>
        <div class="crm-fact"><span>Phone</span><strong>${esc(org.phone || "Not set")}</strong></div>
        <div class="crm-fact"><span>Website</span><strong>${esc(org.website || "Not set")}</strong></div>
        <div class="crm-fact"><span>Location</span><strong>${esc(org.location || "Not set")}</strong></div>
      </div>
      <div class="crm-detail-grid">
        <section class="crm-card"><div class="crm-card-head"><strong>People</strong><small>${people.length} linked</small></div><div class="crm-related-list">${people.length ? people.map(person => `<button type="button" class="crm-related" data-open-person="${esc(person.id)}"><span class="crm-avatar">${esc(initials(person.name))}</span><span class="crm-related-copy"><strong>${esc(person.name)}</strong><small>${esc(person.role || person.relationship)}</small></span><em>→</em></button>`).join("") : '<p class="crm-body-copy">No people linked yet.</p>'}</div></section>
        <section class="crm-card"><div class="crm-card-head"><strong>Linked records</strong><small>Lab counts</small></div><div class="crm-metric-row"><div class="crm-metric"><strong>${Number(org.documents || 0)}</strong><span>Documents</span></div><div class="crm-metric"><strong>${Number(org.actions || 0)}</strong><span>Actions</span></div><div class="crm-metric"><strong>${people.length}</strong><span>People</span></div></div></section>
        <section class="crm-card full"><div class="crm-card-head"><strong>Organization summary</strong><small>Local mock</small></div><p class="crm-body-copy">${esc(org.summary || "No summary yet.")}</p></section>
        <section class="crm-card full"><div class="crm-card-head"><strong>Activity</strong><small>${(org.activity || []).length} events</small></div>${timeline(org.activity)}</section>
      </div>
    </div>`;
  }

  function timeline(events = []) {
    if (!events.length) return '<p class="crm-body-copy">No activity recorded yet.</p>';
    return `<div class="crm-timeline">${events.slice(0, 8).map(event => `<div class="crm-event"><span class="crm-event-dot"></span><span class="crm-event-copy"><strong>${esc(event.title)}</strong><small>${esc(event.detail || "")}</small></span><time>${esc(longDate(event.at))}</time></div>`).join("")}</div>`;
  }

  function renderContext() {
    const context = $("#crmContext", root);
    const record = recordFor(ui.selectedId);
    if (!record) { context.innerHTML = ""; return; }
    if (ui.mode === "people") {
      const org = orgFor(record.orgId);
      context.innerHTML = `
        <section class="crm-context-block"><div class="crm-context-title"><strong>Relationship</strong><span>01</span></div><div class="crm-context-body">${org ? `<button type="button" class="crm-related" data-open-org="${esc(org.id)}"><span class="crm-avatar org">${esc(initials(org.name))}</span><span class="crm-related-copy"><strong>${esc(org.name)}</strong><small>${esc(org.type)}</small></span><em>→</em></button>` : '<div class="crm-link-tile"><span>Organization</span><strong>Unlinked</strong><small>This person currently stands alone in the Lab directory.</small></div>'}</div></section>
        <section class="crm-context-block"><div class="crm-context-title"><strong>Contingency links</strong><span>${Number(record.actions || 0)}</span></div><div class="crm-context-body"><div class="crm-link-tile"><span>Trigger actions</span><strong>${Number(record.actions || 0)} linked</strong><small>Action details will be expanded in the Action Builder phase.</small></div><button type="button" class="crm-context-action" data-crm-action="open-actions">Open Actions <span>→</span></button></div></section>
        <section class="crm-context-block"><div class="crm-context-title"><strong>Record state</strong><span>LAB</span></div><div class="crm-context-body"><div class="crm-risk-line"><i></i><span>${esc(record.importance)} priority · synthetic data</span></div><div class="crm-link-tile"><span>Last updated</span><strong>${esc(longDate(record.updatedAt))}</strong><small>Saved locally in this browser only.</small></div></div></section>`;
    } else {
      const people = peopleForOrg(record.id);
      context.innerHTML = `
        <section class="crm-context-block"><div class="crm-context-title"><strong>Organization graph</strong><span>${people.length}</span></div><div class="crm-context-body">${people.slice(0, 4).map(person => `<button type="button" class="crm-related" data-open-person="${esc(person.id)}"><span class="crm-avatar">${esc(initials(person.name))}</span><span class="crm-related-copy"><strong>${esc(person.name)}</strong><small>${esc(person.role || person.relationship)}</small></span><em>→</em></button>`).join("") || '<div class="crm-link-tile"><span>People</span><strong>No links</strong><small>Add a person to build this relationship graph.</small></div>'}</div></section>
        <section class="crm-context-block"><div class="crm-context-title"><strong>Contingency links</strong><span>${Number(record.actions || 0)}</span></div><div class="crm-context-body"><div class="crm-link-tile"><span>Trigger actions</span><strong>${Number(record.actions || 0)} linked</strong><small>Organization-level routing will connect here later.</small></div><button type="button" class="crm-context-action" data-crm-action="open-actions">Open Actions <span>→</span></button></div></section>
        <section class="crm-context-block"><div class="crm-context-title"><strong>Record state</strong><span>LAB</span></div><div class="crm-context-body"><div class="crm-risk-line"><i></i><span>${esc(record.status)} · synthetic organization</span></div><div class="crm-link-tile"><span>Last updated</span><strong>${esc(longDate(record.updatedAt))}</strong><small>Saved locally in this browser only.</small></div></div></section>`;
    }
  }

  function handleAction(action) {
    if (action === "mobile-back") { root.dataset.mobileDetail = "false"; return; }
    if (action === "edit") return openEditor(recordFor(ui.selectedId));
    if (action === "note") return openNote(recordFor(ui.selectedId));
    if (action === "new-person-for-org") return openEditor(null, ui.selectedId);
    if (action === "open-actions") {
      document.querySelector('[data-view="actions"]')?.click();
      toast("Opened Lab trigger actions.");
    }
  }

  function openEditor(existing = null, forcedOrgId = "") {
    const type = existing ? ui.mode : forcedOrgId ? "people" : ui.mode;
    const isPerson = type === "people";
    const title = existing ? `Edit ${isPerson ? "person" : "organization"}` : `New ${isPerson ? "person" : "organization"}`;
    const record = existing || {};
    editDialog.innerHTML = `
      <div class="crm-dialog-head"><div><small>LAB DIRECTORY</small><h3>${esc(title)}</h3></div><button type="button" class="crm-dialog-close" data-close-dialog aria-label="Close">×</button></div>
      <form class="crm-form" id="crmRecordForm">
        <div class="crm-form-note"><strong>Lab only.</strong> This record is stored in your browser and cannot reach the production Check In API.</div>
        <input type="hidden" name="record_id" value="${esc(record.id || "")}" /><input type="hidden" name="record_type" value="${esc(type)}" />
        <div class="crm-form-grid">
          <div class="crm-field full"><label>Name</label><input name="name" required value="${esc(record.name || "")}" placeholder="${isPerson ? "Full name" : "Organization name"}" /></div>
          ${isPerson ? personFields(record, forcedOrgId) : organizationFields(record)}
        </div>
        <div class="crm-form-actions"><button type="button" class="crm-button ghost" data-close-dialog>Cancel</button><button type="submit" class="crm-button primary">Save record</button></div>
      </form>`;
    editDialog.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => editDialog.close()));
    $("#crmRecordForm", editDialog).addEventListener("submit", saveEditor);
    editDialog.showModal();
    setTimeout(() => editDialog.querySelector('input[name="name"]')?.focus(), 0);
  }

  function personFields(record, forcedOrgId) {
    const selectedOrg = forcedOrgId || record.orgId || "";
    return `
      <div class="crm-field"><label>Role</label><input name="role" value="${esc(record.role || "")}" placeholder="Role or title" /></div>
      <div class="crm-field"><label>Organization</label><select name="org_id"><option value="">No organization</option>${data.organizations.map(org => `<option value="${esc(org.id)}"${org.id === selectedOrg ? " selected" : ""}>${esc(org.name)}</option>`).join("")}</select></div>
      <div class="crm-field"><label>Email</label><input name="email" type="email" value="${esc(record.email || "")}" placeholder="name@example.com" /></div>
      <div class="crm-field"><label>Phone</label><input name="phone" value="${esc(record.phone || "")}" placeholder="+1 …" /></div>
      <div class="crm-field"><label>Location</label><input name="location" value="${esc(record.location || "")}" placeholder="City, region" /></div>
      <div class="crm-field"><label>Time zone</label><input name="timezone" value="${esc(record.timezone || "America/New_York")}" placeholder="America/New_York" /></div>
      <div class="crm-field"><label>Relationship</label><select name="relationship">${["Personal","Family","Legal","Business","Financial","Technical","Vendor","Other"].map(value => `<option${value === record.relationship ? " selected" : ""}>${value}</option>`).join("")}</select></div>
      <div class="crm-field"><label>Priority</label><select name="importance">${["Critical","High","Standard"].map(value => `<option${value === (record.importance || "Standard") ? " selected" : ""}>${value}</option>`).join("")}</select></div>
      <div class="crm-field full"><label>Tags</label><input name="tags" value="${esc((record.tags || []).join(", "))}" placeholder="legal, emergency, trusted" /></div>
      <div class="crm-field full"><label>Notes</label><textarea name="notes" placeholder="Private Lab notes">${esc(record.notes || "")}</textarea></div>`;
  }

  function organizationFields(record) {
    return `
      <div class="crm-field"><label>Type</label><input name="type" value="${esc(record.type || "")}" placeholder="Legal, financial, business…" /></div>
      <div class="crm-field"><label>Status</label><select name="status">${["Active","Watch"].map(value => `<option${value === (record.status || "Active") ? " selected" : ""}>${value}</option>`).join("")}</select></div>
      <div class="crm-field"><label>Email</label><input name="email" type="email" value="${esc(record.email || "")}" placeholder="team@example.com" /></div>
      <div class="crm-field"><label>Phone</label><input name="phone" value="${esc(record.phone || "")}" placeholder="+1 …" /></div>
      <div class="crm-field"><label>Website</label><input name="website" value="${esc(record.website || "")}" placeholder="example.com" /></div>
      <div class="crm-field"><label>Location</label><input name="location" value="${esc(record.location || "")}" placeholder="City, region" /></div>
      <div class="crm-field full"><label>Tags</label><input name="tags" value="${esc((record.tags || []).join(", "))}" placeholder="legal, priority, restricted" /></div>
      <div class="crm-field full"><label>Summary</label><textarea name="summary" placeholder="Organization context">${esc(record.summary || "")}</textarea></div>`;
  }

  function saveEditor(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const type = form.get("record_type");
    const id = form.get("record_id") || slugId(type === "people" ? "p" : "o");
    const existing = type === "people" ? personFor(id) : orgFor(id);
    const created = !existing;
    const timestamp = new Date().toISOString();

    if (type === "people") {
      const next = {
        ...(existing || {}), id, name: form.get("name").trim(), role: form.get("role").trim(), orgId: form.get("org_id"), email: form.get("email").trim(), phone: form.get("phone").trim(), location: form.get("location").trim(), timezone: form.get("timezone").trim(), relationship: form.get("relationship"), importance: form.get("importance"), status: "Active", tags: tagsFrom(form.get("tags")), notes: form.get("notes").trim(), documents: existing?.documents || 0, actions: existing?.actions || 0, updatedAt: timestamp,
        activity: [{ title: created ? "Record created" : "Profile updated", detail: created ? "Person added to the Lab local directory." : "Profile fields updated in the Lab directory.", at: timestamp }, ...(existing?.activity || [])]
      };
      if (existing) data.people[data.people.findIndex(item => item.id === id)] = next; else data.people.unshift(next);
      ui.mode = "people";
    } else {
      const next = {
        ...(existing || {}), id, name: form.get("name").trim(), type: form.get("type").trim(), status: form.get("status"), email: form.get("email").trim(), phone: form.get("phone").trim(), website: form.get("website").trim(), location: form.get("location").trim(), tags: tagsFrom(form.get("tags")), summary: form.get("summary").trim(), documents: existing?.documents || 0, actions: existing?.actions || 0, updatedAt: timestamp,
        activity: [{ title: created ? "Record created" : "Organization updated", detail: created ? "Organization added to the Lab local directory." : "Organization fields updated in the Lab directory.", at: timestamp }, ...(existing?.activity || [])]
      };
      if (existing) data.organizations[data.organizations.findIndex(item => item.id === id)] = next; else data.organizations.unshift(next);
      ui.mode = "organizations";
    }
    ui.selectedId = id;
    saveData();
    editDialog.close();
    syncModeButtons();
    populateFilter();
    render();
    root.dataset.mobileDetail = matchMedia("(max-width:700px)").matches ? "true" : "false";
    toast(created ? "Lab record created." : "Lab record updated.");
  }

  function openNote(record) {
    if (!record) return;
    noteDialog.innerHTML = `
      <div class="crm-dialog-head"><div><small>ADD NOTE</small><h3>${esc(record.name)}</h3></div><button type="button" class="crm-dialog-close" data-close-dialog aria-label="Close">×</button></div>
      <form class="crm-form" id="crmNoteForm"><div class="crm-field"><label>Note</label><textarea name="note" required placeholder="Add context to this Lab record"></textarea></div><div class="crm-form-note"><strong>Local mock note.</strong> Nothing entered here is sent to production.</div><div class="crm-form-actions"><button type="button" class="crm-button ghost" data-close-dialog>Cancel</button><button type="submit" class="crm-button primary">Add note</button></div></form>`;
    noteDialog.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => noteDialog.close()));
    $("#crmNoteForm", noteDialog).addEventListener("submit", event => {
      event.preventDefault();
      const value = new FormData(event.currentTarget).get("note").trim();
      if (!value) return;
      const timestamp = new Date().toISOString();
      record.notes = [record.notes, value].filter(Boolean).join("\n\n");
      record.updatedAt = timestamp;
      record.activity = [{ title: "Note added", detail: value.length > 120 ? `${value.slice(0, 117)}…` : value, at: timestamp }, ...(record.activity || [])];
      saveData();
      noteDialog.close();
      render();
      toast("Note added to Lab record.");
    });
    noteDialog.showModal();
    setTimeout(() => noteDialog.querySelector("textarea")?.focus(), 0);
  }

  function syncModeButtons() {
    $$("[data-crm-mode]", root).forEach(button => {
      const active = button.dataset.crmMode === ui.mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    $("#crmListLabel", root).textContent = ui.mode === "people" ? "People" : "Organizations";
    $("#crmNew", root).innerHTML = ui.mode === "people" ? '＋ <span>New person</span>' : '＋ <span>New organization</span>';
  }

  function resetSample() {
    if (!confirm("Reset the Lab directory to its original synthetic sample records?")) return;
    data = seedData();
    saveData();
    ui.mode = "people";
    ui.selectedId = data.people[0]?.id || null;
    ui.query = "";
    ui.filter = "all";
    ui.sort = "updated";
    $("#crmSearch", root).value = "";
    $("#crmSort", root).value = "updated";
    root.dataset.mobileDetail = "false";
    syncModeButtons();
    populateFilter();
    render();
    toast("Lab sample directory reset.");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildShell, { once: true });
  else buildShell();
})();
