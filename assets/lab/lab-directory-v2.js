(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  const STORE_KEY = "cmx-lab-crm-v1";
  const AUTOMATIONS_KEY = "cmx-lab-automations-v1";
  const DIRECTORY_UI_KEY = "cmx-lab-directory-ui-v2";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));

  const now = () => new Date().toISOString();
  const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const uniq = values => [...new Set((values || []).filter(Boolean))];

  const STARTER_GROUPS = Object.freeze([
    {
      id: "g-family",
      name: "Family",
      description: "Saved audience for close family contacts.",
      selectors: [{ type: "label", ref: "family" }],
      status: "Active"
    },
    {
      id: "g-emergency-tier-1",
      name: "Emergency Tier 1",
      description: "Primary continuity audience assembled from trusted and emergency contacts.",
      selectors: [{ type: "label", ref: "emergency" }, { type: "person", ref: "p-maya" }],
      status: "Active"
    },
    {
      id: "g-business-ops",
      name: "Business Operations",
      description: "Current active people connected to the sample operations organization.",
      selectors: [{ type: "organization", ref: "o-atlas" }],
      status: "Active"
    }
  ]);

  let data;
  let root;
  let dialog;
  const ui = loadUi();

  function readStore() {
    try {
      const value = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      return value && Array.isArray(value.people) && Array.isArray(value.organizations) ? value : null;
    } catch {
      return null;
    }
  }

  function readAutomations() {
    try {
      const value = JSON.parse(localStorage.getItem(AUTOMATIONS_KEY) || "null");
      return Array.isArray(value?.automations) ? value.automations : [];
    } catch {
      return [];
    }
  }

  function loadUi() {
    try {
      const saved = JSON.parse(localStorage.getItem(DIRECTORY_UI_KEY) || "null");
      if (saved && ["people", "organizations", "groups"].includes(saved.mode)) {
        return { mode: saved.mode, query: "", view: saved.view || "all", selectedId: saved.selectedId || null, tab: saved.tab || "overview" };
      }
    } catch {}
    return { mode: "people", query: "", view: "all", selectedId: null, tab: "overview" };
  }

  function saveUi() {
    localStorage.setItem(DIRECTORY_UI_KEY, JSON.stringify({
      mode: ui.mode,
      view: ui.view,
      selectedId: ui.selectedId,
      tab: ui.tab
    }));
  }

  function contactMethods(person) {
    const methods = Array.isArray(person.contactMethods) ? person.contactMethods.filter(item => item?.value) : [];
    if (!methods.length) {
      if (person.email) methods.push({ id: `${person.id}-email`, type: "email", label: "Email", value: person.email, preferred: true, verified: true, active: true });
      if (person.phone) methods.push({ id: `${person.id}-phone`, type: "phone", label: "Mobile", value: person.phone, preferred: !person.email, verified: true, active: true });
    }
    return methods;
  }

  function normalizePerson(person) {
    const labels = uniq([...(person.labels || []), ...(person.tags || [])].map(value => String(value).trim().toLowerCase()));
    const organizationIds = uniq([...(person.organizationIds || []), person.orgId].filter(Boolean));
    const methods = contactMethods({ ...person, contactMethods: person.contactMethods });
    const preferredEmail = methods.find(item => item.type === "email" && item.preferred)?.value || methods.find(item => item.type === "email")?.value || person.email || "";
    const preferredPhone = methods.find(item => item.type === "phone" && item.preferred)?.value || methods.find(item => item.type === "phone")?.value || person.phone || "";
    return {
      ...person,
      organizationIds,
      orgId: person.orgId || organizationIds[0] || "",
      labels,
      tags: uniq([...(person.tags || []), ...labels]),
      contactMethods: methods,
      email: preferredEmail,
      phone: preferredPhone,
      lifecycle: person.lifecycle || person.status || "Active",
      source: person.source || "Lab sample",
      relationshipLinks: Array.isArray(person.relationshipLinks) ? person.relationshipLinks : [],
      customFields: person.customFields || {},
      updatedAt: person.updatedAt || now()
    };
  }

  function normalizeOrganization(org) {
    return {
      ...org,
      labels: uniq([...(org.labels || []), ...(org.tags || [])].map(value => String(value).trim().toLowerCase())),
      lifecycle: org.lifecycle || org.status || "Active",
      source: org.source || "Lab sample",
      customFields: org.customFields || {},
      updatedAt: org.updatedAt || now()
    };
  }

  function ensureModel() {
    const current = readStore();
    if (!current) return false;
    data = {
      ...current,
      version: 1,
      people: current.people.map(normalizePerson),
      organizations: current.organizations.map(normalizeOrganization),
      groups: Array.isArray(current.groups) && current.groups.length ? current.groups : STARTER_GROUPS.map(group => ({ ...group, createdAt: now(), updatedAt: now() }))
    };

    const maya = data.people.find(person => person.id === "p-maya");
    const sofia = data.people.find(person => person.id === "p-sofia");
    const hannah = data.people.find(person => person.id === "p-hannah");
    if (maya && !maya.relationshipLinks.length && sofia) {
      maya.relationshipLinks = [{ personId: sofia.id, type: "Trusted contact" }];
    }
    if (sofia && !sofia.relationshipLinks.length && hannah) {
      sofia.relationshipLinks = [{ personId: hannah.id, type: "Personal network" }];
    }

    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    return true;
  }

  function persist(message = "") {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    saveUi();
    document.dispatchEvent(new CustomEvent("cmx:lab-crm-updated", { detail: directoryStats() }));
    window.dispatchEvent(new CustomEvent("cmx:lab-directory-updated", { detail: directoryStats() }));
    if (message) toast(message);
  }

  function initials(name) {
    return String(name || "?").split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  }

  function person(id) { return data.people.find(item => item.id === id) || null; }
  function org(id) { return data.organizations.find(item => item.id === id) || null; }
  function group(id) { return data.groups.find(item => item.id === id) || null; }

  function organizationsForPerson(item) {
    return uniq(item.organizationIds || []).map(org).filter(Boolean);
  }

  function peopleForOrganization(id) {
    return data.people.filter(item => (item.organizationIds || []).includes(id) || item.orgId === id);
  }

  function peopleForLabel(label) {
    const key = String(label || "").toLowerCase();
    return data.people.filter(item => (item.labels || []).includes(key));
  }

  function resolveGroup(item) {
    if (!item) return [];
    const ids = new Set();
    (item.selectors || []).forEach(selector => {
      if (selector.type === "person" && person(selector.ref)) ids.add(selector.ref);
      if (selector.type === "organization") peopleForOrganization(selector.ref).forEach(record => ids.add(record.id));
      if (selector.type === "label") peopleForLabel(selector.ref).forEach(record => ids.add(record.id));
    });
    return [...ids].map(person).filter(Boolean);
  }

  function groupsForPerson(id) {
    return data.groups.filter(item => resolveGroup(item).some(record => record.id === id));
  }

  function readiness(item) {
    const methods = contactMethods(item).filter(method => method.active !== false);
    const email = methods.some(method => method.type === "email" && method.value);
    const phone = methods.some(method => method.type === "phone" && method.value);
    const verifiedEmail = methods.some(method => method.type === "email" && method.value && method.verified !== false);
    const verifiedPhone = methods.some(method => method.type === "phone" && method.value && method.verified !== false);
    return { email, phone, verifiedEmail, verifiedPhone, methods };
  }

  function automationUsage(kind, id) {
    const automations = readAutomations();
    return automations.filter(item => (item.actions || []).some(action => {
      const ref = action?.targetRef;
      if (!ref) return false;
      if (kind === "person") return ref.kind === "person" && ref.id === id;
      if (kind === "organization") return ref.kind === "organization" && ref.id === id;
      return false;
    }));
  }

  function duplicateCountFor(record) {
    if (!record || !record.email && !record.phone) return 0;
    return data.people.filter(item => item.id !== record.id && (
      record.email && item.email && item.email.toLowerCase() === record.email.toLowerCase() ||
      record.phone && item.phone && item.phone.replace(/\D/g, "") === record.phone.replace(/\D/g, "")
    )).length;
  }

  function directoryStats() {
    const emailReady = data.people.filter(item => readiness(item).email).length;
    const phoneReady = data.people.filter(item => readiness(item).phone).length;
    return {
      people: data.people.length,
      organizations: data.organizations.length,
      groups: data.groups.length,
      emailReady,
      phoneReady
    };
  }

  function relative(iso) {
    const time = new Date(iso || 0).getTime();
    const age = Math.max(0, Date.now() - time);
    if (age < 60000) return "now";
    if (age < 3600000) return `${Math.floor(age / 60000)}m`;
    if (age < 86400000) return `${Math.floor(age / 3600000)}h`;
    if (age < 604800000) return `${Math.floor(age / 86400000)}d`;
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(time));
  }

  function longDate(iso) {
    if (!iso) return "Unknown";
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
  }

  function build() {
    if (!ensureModel()) return;
    const panel = $('[data-view-panel="records"]');
    if (!panel) return;

    const old = $(".lab-crm", panel);
    if (old) old.hidden = true;

    const heading = $(".view-heading", panel);
    if (heading) {
      const eyebrow = $(".eyebrow", heading);
      const title = $("h1", heading);
      if (eyebrow) eyebrow.textContent = "CONTINUUM · DIRECTORY · LAB";
      if (title) title.textContent = "Directory";
    }

    root = document.createElement("section");
    root.className = "lab-directory-v2";
    root.setAttribute("aria-label", "Continuum Lab Directory");
    root.innerHTML = `
      <header class="dir2-command">
        <div class="dir2-command-title">
          <span class="dir2-mark">DIR</span>
          <span><strong>Directory</strong><small id="dir2Stats"></small></span>
        </div>
        <nav class="dir2-types" aria-label="Directory record type">
          ${typeButton("people", "People")}
          ${typeButton("organizations", "Organizations")}
          ${typeButton("groups", "Groups")}
        </nav>
        <label class="dir2-search"><span>⌕</span><input type="search" id="dir2Search" placeholder="Search Directory"></label>
        <button type="button" class="dir2-primary" data-dir2-action="new">＋ New</button>
      </header>
      <div class="dir2-viewbar">
        <span>VIEWS</span>
        <div id="dir2Views"></div>
        <button type="button" class="dir2-quiet" data-dir2-action="show-audience">Audience readiness</button>
      </div>
      <div class="dir2-layout">
        <aside class="dir2-list-pane">
          <header><span id="dir2ListLabel">People</span><b id="dir2Count">0</b></header>
          <div class="dir2-list" id="dir2List"></div>
        </aside>
        <main class="dir2-detail-pane" id="dir2Detail"></main>
        <aside class="dir2-context-pane" id="dir2Context"></aside>
      </div>
    `;
    panel.append(root);

    dialog = document.createElement("dialog");
    dialog.className = "dir2-dialog";
    dialog.id = "dir2Dialog";
    document.body.append(dialog);

    bind();
    if (!ui.selectedId || !currentRecords().some(item => item.id === ui.selectedId)) ui.selectedId = currentRecords()[0]?.id || null;
    render();
    document.documentElement.dataset.labDirectory = "v2";
  }

  function typeButton(mode, label) {
    return `<button type="button" data-dir2-mode="${mode}" class="${ui.mode === mode ? "is-active" : ""}" aria-pressed="${ui.mode === mode}">${label}</button>`;
  }

  function bind() {
    root.addEventListener("click", event => {
      const mode = event.target.closest("[data-dir2-mode]");
      if (mode) {
        ui.mode = mode.dataset.dir2Mode;
        ui.view = "all";
        ui.tab = "overview";
        ui.selectedId = currentRecords()[0]?.id || null;
        render();
        saveUi();
        return;
      }
      const view = event.target.closest("[data-dir2-view]");
      if (view) {
        ui.view = view.dataset.dir2View;
        render();
        saveUi();
        return;
      }
      const record = event.target.closest("[data-dir2-record]");
      if (record) {
        ui.selectedId = record.dataset.dir2Record;
        ui.tab = "overview";
        if (matchMedia("(max-width:760px)").matches) root.dataset.mobileDetail = "true";
        render();
        saveUi();
        return;
      }
      const tab = event.target.closest("[data-dir2-tab]");
      if (tab) {
        ui.tab = tab.dataset.dir2Tab;
        renderDetail();
        saveUi();
        return;
      }
      const action = event.target.closest("[data-dir2-action]");
      if (action) handleAction(action.dataset.dir2Action, action);
      const openPerson = event.target.closest("[data-dir2-open-person]");
      if (openPerson) {
        ui.mode = "people";
        ui.selectedId = openPerson.dataset.dir2OpenPerson;
        ui.tab = "overview";
        render();
      }
      const openOrg = event.target.closest("[data-dir2-open-org]");
      if (openOrg) {
        ui.mode = "organizations";
        ui.selectedId = openOrg.dataset.dir2OpenOrg;
        ui.tab = "overview";
        render();
      }
      const openGroup = event.target.closest("[data-dir2-open-group]");
      if (openGroup) {
        ui.mode = "groups";
        ui.selectedId = openGroup.dataset.dir2OpenGroup;
        ui.tab = "overview";
        render();
      }
    });

    $("#dir2Search", root).addEventListener("input", event => {
      ui.query = event.target.value.trim().toLowerCase();
      renderList();
    });

    window.addEventListener("cmx:lab-automations-updated", () => {
      if (root?.isConnected) {
        renderDetail();
        renderContext();
      }
    });
  }

  function currentRecords() {
    if (ui.mode === "organizations") return data.organizations;
    if (ui.mode === "groups") return data.groups;
    return data.people;
  }

  function views() {
    if (ui.mode === "people") return [
      ["all", "All"],
      ["important", "Important"],
      ["email", "Email ready"],
      ["phone", "Phone ready"],
      ["unlinked", "Unlinked"]
    ];
    if (ui.mode === "organizations") return [["all", "All"], ["active", "Active"], ["watch", "Watch"], ["unlinked", "No people"]];
    return [["all", "All"], ["active", "Active"], ["email", "Email ready"], ["phone", "Phone ready"]];
  }

  function filteredRecords() {
    let records = [...currentRecords()];
    if (ui.query) {
      records = records.filter(record => {
        const extra = ui.mode === "groups"
          ? resolveGroup(record).map(item => item.name).join(" ")
          : ui.mode === "people"
            ? organizationsForPerson(record).map(item => item.name).join(" ")
            : peopleForOrganization(record.id).map(item => item.name).join(" ");
        return [record.name, record.role, record.type, record.email, record.phone, record.location, record.relationship, record.status, record.importance, record.description, extra, ...(record.labels || []), ...(record.tags || [])].join(" ").toLowerCase().includes(ui.query);
      });
    }

    if (ui.mode === "people") {
      if (ui.view === "important") records = records.filter(item => ["Critical", "High"].includes(item.importance));
      if (ui.view === "email") records = records.filter(item => readiness(item).email);
      if (ui.view === "phone") records = records.filter(item => readiness(item).phone);
      if (ui.view === "unlinked") records = records.filter(item => !organizationsForPerson(item).length);
    } else if (ui.mode === "organizations") {
      if (ui.view === "active") records = records.filter(item => (item.status || "Active") === "Active");
      if (ui.view === "watch") records = records.filter(item => item.status === "Watch");
      if (ui.view === "unlinked") records = records.filter(item => !peopleForOrganization(item.id).length);
    } else {
      if (ui.view === "active") records = records.filter(item => (item.status || "Active") === "Active");
      if (ui.view === "email") records = records.filter(item => resolveGroup(item).some(person => readiness(person).email));
      if (ui.view === "phone") records = records.filter(item => resolveGroup(item).some(person => readiness(person).phone));
    }

    return records.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0) || a.name.localeCompare(b.name));
  }

  function render() {
    const stats = directoryStats();
    $("#dir2Stats", root).textContent = `${stats.people} people · ${stats.organizations} orgs · ${stats.groups} groups`;
    $$(".dir2-types button", root).forEach(button => {
      const active = button.dataset.dir2Mode === ui.mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    $("#dir2ListLabel", root).textContent = ui.mode === "people" ? "People" : ui.mode === "organizations" ? "Organizations" : "Groups";
    $("#dir2Views", root).innerHTML = views().map(([id, label]) => `<button type="button" data-dir2-view="${id}" class="${ui.view === id ? "is-active" : ""}">${label}</button>`).join("");
    renderList();
    renderDetail();
    renderContext();
  }

  function renderList() {
    const records = filteredRecords();
    $("#dir2Count", root).textContent = records.length;
    const list = $("#dir2List", root);
    if (!records.length) {
      list.innerHTML = `<div class="dir2-empty"><strong>No matching records</strong><span>Try another view or search.</span></div>`;
      return;
    }
    list.innerHTML = records.map(record => {
      const active = record.id === ui.selectedId;
      if (ui.mode === "groups") {
        const members = resolveGroup(record);
        const emailReady = members.filter(item => readiness(item).email).length;
        return `<button type="button" class="dir2-record ${active ? "is-active" : ""}" data-dir2-record="${esc(record.id)}">
          <span class="dir2-avatar group">GRP</span>
          <span class="dir2-record-copy"><strong>${esc(record.name)}</strong><small>${members.length} people · ${emailReady} email ready</small></span>
          <span class="dir2-record-state">${esc(record.status || "Active")}</span>
        </button>`;
      }
      if (ui.mode === "organizations") {
        const people = peopleForOrganization(record.id);
        return `<button type="button" class="dir2-record ${active ? "is-active" : ""}" data-dir2-record="${esc(record.id)}">
          <span class="dir2-avatar org">${esc(initials(record.name))}</span>
          <span class="dir2-record-copy"><strong>${esc(record.name)}</strong><small>${esc(record.type || "Organization")} · ${people.length} people</small></span>
          <span class="dir2-record-state ${record.status === "Watch" ? "warn" : ""}">${esc(record.status || "Active")}</span>
        </button>`;
      }
      const ready = readiness(record);
      const organizations = organizationsForPerson(record);
      return `<button type="button" class="dir2-record ${active ? "is-active" : ""}" data-dir2-record="${esc(record.id)}">
        <span class="dir2-avatar">${esc(initials(record.name))}</span>
        <span class="dir2-record-copy"><strong>${esc(record.name)}</strong><small>${esc(record.role || record.relationship || "Person")}${organizations.length ? ` · ${esc(organizations[0].name)}` : ""}</small></span>
        <span class="dir2-ready-mini"><i class="${ready.email ? "on" : ""}" title="Email ready">E</i><i class="${ready.phone ? "on" : ""}" title="Phone ready">P</i></span>
      </button>`;
    }).join("");
  }

  function selected() {
    if (ui.mode === "organizations") return org(ui.selectedId);
    if (ui.mode === "groups") return group(ui.selectedId);
    return person(ui.selectedId);
  }

  function renderDetail() {
    const container = $("#dir2Detail", root);
    const record = selected();
    if (!record) {
      container.innerHTML = `<div class="dir2-empty dir2-detail-empty"><strong>Select a record</strong><span>Open a Person, Organization, or Group.</span></div>`;
      return;
    }

    const tabs = [
      ["overview", "Overview"],
      ["activity", "Activity"],
      ["relationships", "Relationships"],
      ["automation", "Automation"]
    ];
    container.innerHTML = `
      <button class="dir2-mobile-back" type="button" data-dir2-action="mobile-back">← Directory</button>
      ${profileHeader(record)}
      <nav class="dir2-profile-tabs">${tabs.map(([id, label]) => `<button type="button" data-dir2-tab="${id}" class="${ui.tab === id ? "is-active" : ""}">${label}</button>`).join("")}</nav>
      <section class="dir2-profile-body">${tabBody(record)}</section>
    `;
  }

  function profileHeader(record) {
    const type = ui.mode === "people" ? "PERSON" : ui.mode === "organizations" ? "ORGANIZATION" : "GROUP";
    const secondary = ui.mode === "people"
      ? [record.role, record.relationship].filter(Boolean).join(" · ")
      : ui.mode === "organizations"
        ? [record.type, record.location].filter(Boolean).join(" · ")
        : record.description || "Saved audience";
    const labels = ui.mode === "groups" ? [] : uniq(record.labels || record.tags || []);
    return `<header class="dir2-profile-head">
      <span class="dir2-profile-avatar ${ui.mode === "organizations" ? "org" : ui.mode === "groups" ? "group" : ""}">${ui.mode === "groups" ? "GRP" : esc(initials(record.name))}</span>
      <div class="dir2-profile-title">
        <span>${type} · ${esc(record.lifecycle || record.status || record.importance || "ACTIVE")}</span>
        <h2>${esc(record.name)}</h2>
        <p>${esc(secondary)}</p>
        ${labels.length ? `<div>${labels.slice(0, 8).map(label => `<b>${esc(label)}</b>`).join("")}</div>` : ""}
      </div>
      <div class="dir2-profile-actions">
        ${ui.mode !== "groups" ? `<button type="button" data-dir2-action="note">＋ Note</button>` : ""}
        <button type="button" data-dir2-action="edit">Edit</button>
      </div>
    </header>`;
  }

  function tabBody(record) {
    if (ui.tab === "activity") return activityTab(record);
    if (ui.tab === "relationships") return relationshipsTab(record);
    if (ui.tab === "automation") return automationTab(record);
    return overviewTab(record);
  }

  function overviewTab(record) {
    if (ui.mode === "groups") {
      const members = resolveGroup(record);
      const emailReady = members.filter(item => readiness(item).email).length;
      const phoneReady = members.filter(item => readiness(item).phone).length;
      return `
        <div class="dir2-metric-grid">
          ${metric("Resolved people", members.length)}
          ${metric("Email ready", emailReady)}
          ${metric("Phone ready", phoneReady)}
          ${metric("Selectors", (record.selectors || []).length)}
        </div>
        <section class="dir2-panel"><header><strong>Resolved audience</strong><small>Live Lab membership</small></header>
          <div class="dir2-people-grid">${members.length ? members.map(personCard).join("") : `<p>No people currently resolve from this group.</p>`}</div>
        </section>
        <section class="dir2-panel"><header><strong>Audience selectors</strong><small>Stable prototype refs</small></header>
          <div class="dir2-selector-list">${(record.selectors || []).map(selector => selectorCard(selector)).join("") || "<p>No selectors configured.</p>"}</div>
        </section>`;
    }

    if (ui.mode === "organizations") {
      const people = peopleForOrganization(record.id);
      return `
        <div class="dir2-facts">
          ${fact("Email", record.email || "Not set")}
          ${fact("Phone", record.phone || "Not set")}
          ${fact("Website", record.website || "Not set")}
          ${fact("Location", record.location || "Not set")}
        </div>
        <div class="dir2-metric-grid">
          ${metric("People", people.length)}
          ${metric("Documents", Number(record.documents || 0))}
          ${metric("Automations", automationUsage("organization", record.id).length)}
          ${metric("Labels", (record.labels || []).length)}
        </div>
        <section class="dir2-panel"><header><strong>People</strong><small>${people.length} linked</small></header>
          <div class="dir2-people-grid">${people.length ? people.map(personCard).join("") : `<p>No people linked yet.</p>`}</div>
        </section>
        <section class="dir2-panel"><header><strong>Organization context</strong><small>${esc(record.source || "Lab")}</small></header><p>${esc(record.summary || "No organization summary yet.")}</p></section>`;
    }

    const ready = readiness(record);
    const organizations = organizationsForPerson(record);
    const groups = groupsForPerson(record.id);
    return `
      <div class="dir2-facts">
        ${contactFact("Preferred email", record.email || "Not set", ready.verifiedEmail)}
        ${contactFact("Preferred phone", record.phone || "Not set", ready.verifiedPhone)}
        ${fact("Location", record.location || "Not set")}
        ${fact("Time zone", record.timezone || "Not set")}
      </div>
      <div class="dir2-metric-grid">
        ${metric("Organizations", organizations.length)}
        ${metric("Groups", groups.length)}
        ${metric("Automations", automationUsage("person", record.id).length)}
        ${metric("Documents", Number(record.documents || 0))}
      </div>
      <section class="dir2-panel"><header><strong>Contact methods</strong><small>${ready.methods.length} methods</small></header>
        <div class="dir2-methods">${ready.methods.map(method => `<div><span class="dir2-method-icon">${method.type === "email" ? "@" : "☎"}</span><span><strong>${esc(method.label || method.type)}</strong><small>${esc(method.value)}</small></span><em class="${method.verified === false ? "warn" : ""}">${method.verified === false ? "UNVERIFIED" : "READY"}</em></div>`).join("") || "<p>No contact methods.</p>"}</div>
      </section>
      <section class="dir2-panel"><header><strong>Notes</strong><small>Private Lab context</small></header><p>${esc(record.notes || "No notes yet.")}</p></section>`;
  }

  function activityTab(record) {
    const events = record.activity || [];
    return `<section class="dir2-panel"><header><strong>Activity timeline</strong><small>${events.length} events</small></header>
      <div class="dir2-timeline">${events.length ? events.map(event => `<div><i></i><span><strong>${esc(event.title)}</strong><small>${esc(event.detail || "")}</small></span><time>${esc(longDate(event.at))}</time></div>`).join("") : "<p>No activity yet.</p>"}</div>
    </section>`;
  }

  function relationshipsTab(record) {
    if (ui.mode === "groups") {
      return `<section class="dir2-panel"><header><strong>Audience definition</strong><small>Group ≠ label</small></header>
        <p>Groups are saved audiences. Their selectors can reference People, Organizations, and Labels, then resolve current unique People.</p>
        <div class="dir2-selector-list">${(record.selectors || []).map(selectorCard).join("")}</div>
      </section>`;
    }
    if (ui.mode === "organizations") {
      const people = peopleForOrganization(record.id);
      return `<section class="dir2-panel"><header><strong>Organization membership</strong><small>Many-to-many prototype</small></header>
        <div class="dir2-people-grid">${people.length ? people.map(personCard).join("") : "<p>No people linked.</p>"}</div>
      </section>
      <section class="dir2-panel"><header><strong>Labels</strong><small>Descriptive only</small></header><div class="dir2-label-cloud">${(record.labels || []).map(label => `<span>${esc(label)}</span>`).join("") || "<p>No labels.</p>"}</div></section>`;
    }
    const organizations = organizationsForPerson(record);
    const groups = groupsForPerson(record.id);
    const related = (record.relationshipLinks || []).map(link => ({ ...link, person: person(link.personId) })).filter(link => link.person);
    return `
      <section class="dir2-panel"><header><strong>Organizations</strong><small>${organizations.length} memberships</small></header>
        <div class="dir2-people-grid">${organizations.length ? organizations.map(item => `<button type="button" class="dir2-related-card" data-dir2-open-org="${esc(item.id)}"><span class="dir2-avatar org">${esc(initials(item.name))}</span><span><strong>${esc(item.name)}</strong><small>${esc(item.type || "Organization")}</small></span><b>→</b></button>`).join("") : "<p>No organizations linked.</p>"}</div>
      </section>
      <section class="dir2-panel"><header><strong>Saved audiences</strong><small>${groups.length} groups</small></header>
        <div class="dir2-people-grid">${groups.length ? groups.map(item => `<button type="button" class="dir2-related-card" data-dir2-open-group="${esc(item.id)}"><span class="dir2-avatar group">GRP</span><span><strong>${esc(item.name)}</strong><small>${resolveGroup(item).length} people resolved</small></span><b>→</b></button>`).join("") : "<p>This person is not in a saved Group.</p>"}</div>
      </section>
      <section class="dir2-panel"><header><strong>Person relationships</strong><small>${related.length} links</small></header>
        <div class="dir2-people-grid">${related.length ? related.map(link => `<button type="button" class="dir2-related-card" data-dir2-open-person="${esc(link.person.id)}"><span class="dir2-avatar">${esc(initials(link.person.name))}</span><span><strong>${esc(link.person.name)}</strong><small>${esc(link.type)}</small></span><b>→</b></button>`).join("") : "<p>No explicit Person relationships yet.</p>"}</div>
      </section>
      <section class="dir2-panel"><header><strong>Labels</strong><small>Metadata, not permission</small></header><div class="dir2-label-cloud">${(record.labels || []).map(label => `<span>${esc(label)}</span>`).join("") || "<p>No labels.</p>"}</div></section>`;
  }

  function automationTab(record) {
    if (ui.mode === "groups") {
      const members = resolveGroup(record);
      return `<section class="dir2-panel dir2-audience-callout"><header><strong>Automation audience</strong><small>Prepared model</small></header>
        <p>This Group resolves ${members.length} unique People now. ${members.filter(item => readiness(item).email).length} are email-ready and ${members.filter(item => readiness(item).phone).length} are phone-ready.</p>
        <div class="dir2-flowline"><span>GROUP</span><i>→</i><span>RESOLVE PEOPLE</span><i>→</i><span>CHECK CHANNEL</span><i>→</i><span>FREEZE RUN</span></div>
        <small>Focused Automations can select People and Organizations today. Typed Group/Label audience selectors are the next integration boundary.</small>
      </section>`;
    }
    const kind = ui.mode === "people" ? "person" : "organization";
    const usage = automationUsage(kind, record.id);
    return `<section class="dir2-panel"><header><strong>Automation usage</strong><small>${usage.length} direct references</small></header>
      ${usage.length ? `<div class="dir2-automation-list">${usage.map(item => `<a href="/lab/automations/?automation=${encodeURIComponent(item.id)}&from=directory"><span><strong>${esc(item.name || "Automation")}</strong><small>${esc(item.status || "Draft")} · direct ${kind} target</small></span><b>Open →</b></a>`).join("")}</div>` : `<p>No focused Automation currently references this ${kind} directly.</p>`}
    </section>
    <section class="dir2-panel dir2-audience-callout"><header><strong>Audience behavior</strong><small>Continuum direction</small></header>
      <p>Published Automations should keep stable Directory selector IDs. Future Runtime resolves current authorized membership, checks readiness, then freezes the exact recipients used for that Run.</p>
    </section>`;
  }

  function renderContext() {
    const context = $("#dir2Context", root);
    const record = selected();
    if (!record) {
      context.innerHTML = "";
      return;
    }
    const stats = directoryStats();
    if (ui.mode === "groups") {
      const members = resolveGroup(record);
      context.innerHTML = contextHeader("AUDIENCE") +
        contextStat("People resolved", members.length, "Unique current members") +
        contextStat("Email ready", members.filter(item => readiness(item).email).length, "Current contact methods") +
        contextStat("Phone ready", members.filter(item => readiness(item).phone).length, "Current contact methods") +
        `<section class="dir2-context-card"><span>RESOLUTION</span><strong>Live membership</strong><small>Run history will later freeze exact recipients.</small></section>`;
      return;
    }
    if (ui.mode === "organizations") {
      const people = peopleForOrganization(record.id);
      context.innerHTML = contextHeader("ORGANIZATION") +
        contextStat("People", people.length, "Current memberships") +
        contextStat("Automations", automationUsage("organization", record.id).length, "Direct references") +
        contextStat("Documents", Number(record.documents || 0), "Lab linked count") +
        `<section class="dir2-context-card"><span>DIRECTORY</span><strong>${stats.people} people total</strong><small>${stats.groups} saved audiences are available.</small></section>`;
      return;
    }
    const ready = readiness(record);
    const duplicates = duplicateCountFor(record);
    context.innerHTML = contextHeader("PERSON") +
      `<section class="dir2-readiness">
        <span>CONTACT READINESS</span>
        <div><i class="${ready.email ? "on" : ""}"></i><strong>Email</strong><small>${ready.email ? "Ready" : "Missing"}</small></div>
        <div><i class="${ready.phone ? "on" : ""}"></i><strong>Phone</strong><small>${ready.phone ? "Ready" : "Missing"}</small></div>
      </section>` +
      contextStat("Groups", groupsForPerson(record.id).length, "Saved audience membership") +
      contextStat("Automations", automationUsage("person", record.id).length, "Direct target references") +
      `<section class="dir2-context-card ${duplicates ? "warn" : ""}"><span>DUPLICATE CHECK</span><strong>${duplicates ? `${duplicates} possible match${duplicates === 1 ? "" : "es"}` : "No exact match"}</strong><small>Lab checks exact email and normalized phone.</small></section>`;
  }

  function contextHeader(label) {
    return `<header class="dir2-context-head"><span>${label}</span><b>LAB</b></header>`;
  }

  function contextStat(label, value, note) {
    return `<section class="dir2-context-stat"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(note)}</small></section>`;
  }

  function fact(label, value) {
    return `<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`;
  }

  function contactFact(label, value, verified) {
    return `<div><span>${esc(label)}</span><strong>${esc(value)}</strong><small class="${verified ? "good" : "warn"}">${verified ? "READY" : "CHECK"}</small></div>`;
  }

  function metric(label, value) {
    return `<div><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`;
  }

  function personCard(item) {
    const ready = readiness(item);
    return `<button type="button" class="dir2-related-card" data-dir2-open-person="${esc(item.id)}">
      <span class="dir2-avatar">${esc(initials(item.name))}</span>
      <span><strong>${esc(item.name)}</strong><small>${esc(item.role || item.relationship || "Person")}</small></span>
      <em><i class="${ready.email ? "on" : ""}">E</i><i class="${ready.phone ? "on" : ""}">P</i></em>
    </button>`;
  }

  function selectorCard(selector) {
    let title = selector.ref;
    let detail = selector.type;
    if (selector.type === "person") title = person(selector.ref)?.name || selector.ref;
    if (selector.type === "organization") title = org(selector.ref)?.name || selector.ref;
    if (selector.type === "label") {
      title = selector.ref;
      detail = `${peopleForLabel(selector.ref).length} matching people`;
    }
    return `<div class="dir2-selector"><span>${esc(selector.type.toUpperCase())}</span><strong>${esc(title)}</strong><small>${esc(detail)}</small></div>`;
  }

  function handleAction(action) {
    if (action === "mobile-back") {
      root.dataset.mobileDetail = "false";
      return;
    }
    if (action === "new") return openEditor(null);
    if (action === "edit") return openEditor(selected());
    if (action === "note") return openNote(selected());
    if (action === "show-audience") {
      ui.mode = "groups";
      ui.view = "all";
      ui.selectedId = data.groups[0]?.id || null;
      ui.tab = "overview";
      render();
      return;
    }
  }

  function openEditor(existing) {
    if (ui.mode === "groups") return openGroupEditor(existing);
    const isPerson = ui.mode === "people";
    const record = existing || {};
    dialog.innerHTML = `
      <form class="dir2-form" id="dir2RecordForm">
        <header><span>${existing ? "EDIT" : "NEW"} ${isPerson ? "PERSON" : "ORGANIZATION"}</span><h3>${existing ? esc(record.name) : `Create ${isPerson ? "person" : "organization"}`}</h3><button type="button" data-dir2-close>×</button></header>
        <input type="hidden" name="id" value="${esc(record.id || "")}">
        <div class="dir2-form-grid">
          <label class="full"><span>Name</span><input name="name" required value="${esc(record.name || "")}"></label>
          ${isPerson ? personForm(record) : organizationForm(record)}
        </div>
        <footer><button type="button" data-dir2-close>Cancel</button><button type="submit" class="primary">Save</button></footer>
      </form>`;
    bindDialogClose();
    $("#dir2RecordForm", dialog).addEventListener("submit", event => saveRecord(event, isPerson));
    dialog.showModal();
  }

  function personForm(record) {
    const orgIds = new Set(record.organizationIds || []);
    return `
      <label><span>Role / title</span><input name="role" value="${esc(record.role || "")}"></label>
      <label><span>Relationship</span><input name="relationship" value="${esc(record.relationship || "")}" placeholder="Family, client, counsel…"></label>
      <label><span>Email</span><input type="email" name="email" value="${esc(record.email || "")}"></label>
      <label><span>Phone</span><input name="phone" value="${esc(record.phone || "")}"></label>
      <label><span>Location</span><input name="location" value="${esc(record.location || "")}"></label>
      <label><span>Time zone</span><input name="timezone" value="${esc(record.timezone || "America/New_York")}"></label>
      <label><span>Priority</span><select name="importance">${["Critical","High","Standard"].map(value => `<option ${value === (record.importance || "Standard") ? "selected" : ""}>${value}</option>`).join("")}</select></label>
      <label><span>Lifecycle</span><select name="lifecycle">${["Active","Inactive","Archived"].map(value => `<option ${value === (record.lifecycle || "Active") ? "selected" : ""}>${value}</option>`).join("")}</select></label>
      <fieldset class="full"><legend>Organizations</legend><div class="dir2-check-grid">${data.organizations.map(item => `<label><input type="checkbox" name="organization_ids" value="${esc(item.id)}" ${orgIds.has(item.id) ? "checked" : ""}><span>${esc(item.name)}</span></label>`).join("")}</div></fieldset>
      <label class="full"><span>Labels</span><input name="labels" value="${esc((record.labels || record.tags || []).join(", "))}" placeholder="family, trusted, client"></label>
      <label class="full"><span>Notes</span><textarea name="notes">${esc(record.notes || "")}</textarea></label>`;
  }

  function organizationForm(record) {
    return `
      <label><span>Type</span><input name="type" value="${esc(record.type || "")}"></label>
      <label><span>Status</span><select name="status">${["Active","Watch","Inactive","Archived"].map(value => `<option ${value === (record.status || "Active") ? "selected" : ""}>${value}</option>`).join("")}</select></label>
      <label><span>Email</span><input type="email" name="email" value="${esc(record.email || "")}"></label>
      <label><span>Phone</span><input name="phone" value="${esc(record.phone || "")}"></label>
      <label><span>Website</span><input name="website" value="${esc(record.website || "")}"></label>
      <label><span>Location</span><input name="location" value="${esc(record.location || "")}"></label>
      <label class="full"><span>Labels</span><input name="labels" value="${esc((record.labels || record.tags || []).join(", "))}"></label>
      <label class="full"><span>Summary</span><textarea name="summary">${esc(record.summary || "")}</textarea></label>`;
  }

  function saveRecord(event, isPerson) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = String(form.get("id") || "") || makeId(isPerson ? "p" : "o");
    const timestamp = now();

    if (isPerson) {
      const existing = person(id);
      const organizationIds = form.getAll("organization_ids").map(String);
      const labels = String(form.get("labels") || "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
      const email = String(form.get("email") || "").trim();
      const phone = String(form.get("phone") || "").trim();
      const next = normalizePerson({
        ...(existing || {}),
        id,
        name: String(form.get("name") || "").trim(),
        role: String(form.get("role") || "").trim(),
        relationship: String(form.get("relationship") || "").trim(),
        email,
        phone,
        location: String(form.get("location") || "").trim(),
        timezone: String(form.get("timezone") || "").trim(),
        importance: String(form.get("importance") || "Standard"),
        lifecycle: String(form.get("lifecycle") || "Active"),
        status: String(form.get("lifecycle") || "Active"),
        organizationIds,
        orgId: organizationIds[0] || "",
        labels,
        tags: labels,
        notes: String(form.get("notes") || "").trim(),
        contactMethods: [
          ...(email ? [{ id: `${id}-email`, type: "email", label: "Email", value: email, preferred: true, verified: true, active: true }] : []),
          ...(phone ? [{ id: `${id}-phone`, type: "phone", label: "Mobile", value: phone, preferred: !email, verified: true, active: true }] : [])
        ],
        updatedAt: timestamp,
        activity: [{ title: existing ? "Profile updated" : "Record created", detail: existing ? "Directory profile fields were updated." : "Person added to the Continuum Lab Directory.", at: timestamp }, ...(existing?.activity || [])]
      });
      const index = data.people.findIndex(item => item.id === id);
      if (index >= 0) data.people[index] = next; else data.people.unshift(next);
      ui.selectedId = id;
    } else {
      const existing = org(id);
      const labels = String(form.get("labels") || "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
      const next = normalizeOrganization({
        ...(existing || {}),
        id,
        name: String(form.get("name") || "").trim(),
        type: String(form.get("type") || "").trim(),
        status: String(form.get("status") || "Active"),
        lifecycle: String(form.get("status") || "Active"),
        email: String(form.get("email") || "").trim(),
        phone: String(form.get("phone") || "").trim(),
        website: String(form.get("website") || "").trim(),
        location: String(form.get("location") || "").trim(),
        labels,
        tags: labels,
        summary: String(form.get("summary") || "").trim(),
        updatedAt: timestamp,
        activity: [{ title: existing ? "Organization updated" : "Record created", detail: existing ? "Organization profile fields were updated." : "Organization added to the Continuum Lab Directory.", at: timestamp }, ...(existing?.activity || [])]
      });
      const index = data.organizations.findIndex(item => item.id === id);
      if (index >= 0) data.organizations[index] = next; else data.organizations.unshift(next);
      ui.selectedId = id;
    }
    persist("Directory record saved.");
    dialog.close();
    render();
  }

  function openGroupEditor(existing) {
    const record = existing || { selectors: [] };
    const selectedPeople = new Set((record.selectors || []).filter(item => item.type === "person").map(item => item.ref));
    const selectedOrgs = new Set((record.selectors || []).filter(item => item.type === "organization").map(item => item.ref));
    const selectedLabels = new Set((record.selectors || []).filter(item => item.type === "label").map(item => item.ref));
    const labels = uniq(data.people.flatMap(item => item.labels || [])).sort();
    dialog.innerHTML = `
      <form class="dir2-form" id="dir2GroupForm">
        <header><span>${existing ? "EDIT" : "NEW"} GROUP</span><h3>${existing ? esc(record.name) : "Create saved audience"}</h3><button type="button" data-dir2-close>×</button></header>
        <input type="hidden" name="id" value="${esc(record.id || "")}">
        <div class="dir2-form-grid">
          <label class="full"><span>Name</span><input required name="name" value="${esc(record.name || "")}"></label>
          <label class="full"><span>Description</span><textarea name="description">${esc(record.description || "")}</textarea></label>
          <fieldset class="full"><legend>Direct People</legend><div class="dir2-check-grid">${data.people.map(item => `<label><input type="checkbox" name="people" value="${esc(item.id)}" ${selectedPeople.has(item.id) ? "checked" : ""}><span>${esc(item.name)}</span></label>`).join("")}</div></fieldset>
          <fieldset class="full"><legend>Organizations</legend><div class="dir2-check-grid">${data.organizations.map(item => `<label><input type="checkbox" name="organizations" value="${esc(item.id)}" ${selectedOrgs.has(item.id) ? "checked" : ""}><span>${esc(item.name)}</span></label>`).join("")}</div></fieldset>
          <fieldset class="full"><legend>Labels</legend><div class="dir2-check-grid">${labels.map(label => `<label><input type="checkbox" name="labels" value="${esc(label)}" ${selectedLabels.has(label) ? "checked" : ""}><span>${esc(label)}</span></label>`).join("")}</div></fieldset>
        </div>
        <footer><button type="button" data-dir2-close>Cancel</button><button type="submit" class="primary">Save group</button></footer>
      </form>`;
    bindDialogClose();
    $("#dir2GroupForm", dialog).addEventListener("submit", saveGroup);
    dialog.showModal();
  }

  function saveGroup(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = String(form.get("id") || "") || makeId("g");
    const existing = group(id);
    const selectors = [
      ...form.getAll("people").map(ref => ({ type: "person", ref: String(ref) })),
      ...form.getAll("organizations").map(ref => ({ type: "organization", ref: String(ref) })),
      ...form.getAll("labels").map(ref => ({ type: "label", ref: String(ref) }))
    ];
    const next = {
      ...(existing || {}),
      id,
      name: String(form.get("name") || "").trim(),
      description: String(form.get("description") || "").trim(),
      status: existing?.status || "Active",
      selectors,
      createdAt: existing?.createdAt || now(),
      updatedAt: now()
    };
    const index = data.groups.findIndex(item => item.id === id);
    if (index >= 0) data.groups[index] = next; else data.groups.unshift(next);
    ui.selectedId = id;
    persist("Saved audience updated.");
    dialog.close();
    render();
  }

  function openNote(record) {
    if (!record || ui.mode === "groups") return;
    dialog.innerHTML = `
      <form class="dir2-form" id="dir2NoteForm">
        <header><span>ADD NOTE</span><h3>${esc(record.name)}</h3><button type="button" data-dir2-close>×</button></header>
        <div class="dir2-form-grid"><label class="full"><span>Note</span><textarea required name="note" autofocus></textarea></label></div>
        <footer><button type="button" data-dir2-close>Cancel</button><button type="submit" class="primary">Add note</button></footer>
      </form>`;
    bindDialogClose();
    $("#dir2NoteForm", dialog).addEventListener("submit", event => {
      event.preventDefault();
      const value = String(new FormData(event.currentTarget).get("note") || "").trim();
      if (!value) return;
      const timestamp = now();
      record.notes = [record.notes, value].filter(Boolean).join("\n\n");
      record.updatedAt = timestamp;
      record.activity = [{ title: "Note added", detail: value.slice(0, 180), at: timestamp }, ...(record.activity || [])];
      persist("Note added.");
      dialog.close();
      render();
    });
    dialog.showModal();
  }

  function bindDialogClose() {
    $$('[data-dir2-close]', dialog).forEach(button => button.addEventListener("click", () => dialog.close()));
  }

  function toast(message) {
    let node = $(".dir2-toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "dir2-toast";
      document.body.append(node);
    }
    node.textContent = message;
    node.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("is-visible"), 1800);
  }

  function boot() {
    const run = () => requestAnimationFrame(() => requestAnimationFrame(build));
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true });
    else run();
  }

  boot();
})();