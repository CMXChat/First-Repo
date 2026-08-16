(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /**
   * PHASE 8 — GLOBAL SEARCH / COMMAND / NAVIGATION INTEGRATION
   * ---------------------------------------------------------
   * Lab-only integration layer. It intentionally reads the browser-local mock
   * stores already owned by the earlier Lab modules and drives their existing UI
   * controls. It does not become a second source of truth for records/actions.
   *
   * OFFICIAL PROJECT HANDOFF:
   * - Replace this local index with authenticated server/API search results.
   * - Replace hash navigation with the official React/TanStack Router routes.
   * - Quick-create should invoke native route/modal components and generated API
   *   client mutations, not click DOM selectors.
   * - Assurance metrics must come from server-calculated audit/version/test data.
   * - Search authorization must be enforced server-side so restricted entities
   *   cannot leak through suggestions, counts, snippets, or timing side channels.
   * - Recent navigation may stay client-side, but never cache protected payloads.
   *
   * See CHECKINLABCLONE.md before porting this behavior to the official project.
   */

  const KEYS = Object.freeze({
    crm: "cmx-lab-crm-v1",
    inventory: "cmx-lab-inventory-v1",
    actions: "cmx-lab-actions-v1",
    policy: "cmx-lab-switch-policy-v1",
    incidents: "cmx-lab-incidents-v1",
    versions: "cmx-lab-versions-v1",
    audit: "cmx-lab-audit-v1",
    navigation: "cmx-lab-navigation-v1"
  });

  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];
  const esc = value => String(value ?? "").replace(/[&<>'\"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[char]));
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
  const shortcutLabel = isMac ? "⌘K" : "Ctrl K";

  let palette;
  let paletteInput;
  let paletteResults;
  let createMenu;
  let searchButton;
  let createButton;
  let activeIndex = 0;
  let visibleResults = [];
  let navigationStore = load(KEYS.navigation, { version:1, recent:[] });

  function load(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? structuredCloneSafe(fallback);
    } catch {
      return structuredCloneSafe(fallback);
    }
  }

  function structuredCloneSafe(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch { return value; }
  }

  function saveNavigation() {
    navigationStore.recent = (navigationStore.recent || []).slice(0, 14);
    localStorage.setItem(KEYS.navigation, JSON.stringify(navigationStore));
  }

  function normalized(value) {
    return String(value ?? "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9@._:+\-/ ]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function dateTime(iso) {
    if (!iso) return "Not recorded";
    const date = new Date(iso);
    if (!Number.isFinite(date.getTime())) return "Not recorded";
    return new Intl.DateTimeFormat(undefined, { month:"short", day:"numeric", hour:"numeric", minute:"2-digit" }).format(date);
  }

  function duration(hours) {
    const n = Number(hours || 0);
    if (n && n % 24 === 0) {
      const days = n / 24;
      return `${days} day${days === 1 ? "" : "s"}`;
    }
    return `${n} hour${n === 1 ? "" : "s"}`;
  }

  function route(type, id = "") {
    return { type, id:String(id || "") };
  }

  function routeString(value) {
    if (!value?.type) return "";
    return value.id ? `${value.type}:${value.id}` : value.type;
  }

  function routeFromString(value) {
    const text = String(value || "");
    const index = text.indexOf(":");
    return index < 0 ? route(text) : route(text.slice(0,index), text.slice(index + 1));
  }

  function writeRoute(value, replace = false) {
    const encoded = encodeURIComponent(routeString(value));
    const next = `${location.pathname}${location.search}#lab=${encoded}`;
    if (replace) history.replaceState({ labRoute:routeString(value) }, "", next);
    else history.pushState({ labRoute:routeString(value) }, "", next);
  }

  function readRouteFromLocation() {
    if (!location.hash.startsWith("#lab=")) return null;
    try { return routeFromString(decodeURIComponent(location.hash.slice(5))); } catch { return null; }
  }

  function remember(item) {
    if (!item?.route || item.group === "Commands" || item.group === "Saved views") return;
    const key = routeString(item.route);
    const entry = { key, route:item.route, label:item.label, meta:item.meta || item.group || "", mark:item.mark || "→", at:new Date().toISOString() };
    navigationStore.recent = [entry, ...(navigationStore.recent || []).filter(existing => existing.key !== key)].slice(0, 14);
    saveNavigation();
  }

  function waitFor(selector, callback, { root=document, attempts=24, delay=35 } = {}) {
    const node = $(selector, root);
    if (node) { callback(node); return; }
    if (attempts <= 0) return;
    setTimeout(() => waitFor(selector, callback, { root, attempts:attempts - 1, delay }), delay);
  }

  function clickView(name) {
    const buttons = $$(`[data-view="${CSS.escape(name)}"]`).filter(button => !button.hidden);
    (buttons.find(button => button.closest(".side-nav")) || buttons[0])?.click();
  }

  function openCrm(mode, id) {
    clickView("records");
    waitFor('.lab-records-hub [data-records-section="directory"]', button => {
      button.click();
      waitFor(`.lab-crm [data-crm-mode="${mode}"]`, modeButton => {
        if (!modeButton.classList.contains("is-active")) modeButton.click();
        waitFor(`.lab-crm [data-record-id="${CSS.escape(id)}"]`, recordButton => recordButton.click());
      });
    });
  }

  function openInventory(section, id) {
    clickView("records");
    waitFor(`.lab-records-hub [data-records-section="${section}"]`, button => {
      button.click();
      waitFor(`.lab-inventory-shell [data-inventory-id="${CSS.escape(id)}"]`, recordButton => recordButton.click());
    });
  }

  function openAction(id) {
    clickView("actions");
    waitFor(`.lab-actions [data-action-id="${CSS.escape(id)}"]`, button => button.click());
  }

  function openActivity(tab, selector = "") {
    clickView("activity");
    waitFor(`.lab-audit-topbar [data-audit-tab="${tab}"]`, button => {
      button.click();
      if (selector) waitFor(selector, node => node.click());
    });
  }

  function navigate(value, { updateHistory=true } = {}) {
    if (!value?.type) return;
    if (updateHistory) writeRoute(value);

    switch (value.type) {
      case "view": clickView(value.id || "overview"); break;
      case "person": openCrm("people", value.id); break;
      case "organization": openCrm("organizations", value.id); break;
      case "document": openInventory("documents", value.id); break;
      case "asset": openInventory("assets", value.id); break;
      case "action": openAction(value.id); break;
      case "incident": openActivity("incidents", `[data-incident-id="${CSS.escape(value.id)}"]`); break;
      case "audit": openActivity("audit", `[data-audit-event="${CSS.escape(value.id)}"]`); break;
      case "version": openActivity("versions", `[data-version-object="${CSS.escape(value.id)}"]`); break;
      case "health": openActivity("health"); break;
      case "policy":
        clickView("timeline");
        waitFor('[data-sequence-command="policy"]', button => button.click());
        break;
      case "new-simulation":
        clickView("timeline");
        waitFor('[data-sequence-command="reset"]', button => button.click());
        break;
      default: break;
    }
  }

  function staticCommands() {
    return [
      { id:"cmd-status", group:"Commands", mark:"◉", label:"Go to Status", meta:"Current switch state and plan assurance", route:route("view","overview"), keywords:"home dashboard status overview" },
      { id:"cmd-records", group:"Commands", mark:"◇", label:"Open Records", meta:"People, organizations, documents and assets", route:route("view","records"), keywords:"records directory crm inventory" },
      { id:"cmd-actions", group:"Commands", mark:"⇢", label:"Open Actions", meta:"Contingency Action Builder", route:route("view","actions"), keywords:"actions builder automation" },
      { id:"cmd-sequence", group:"Commands", mark:"⌁", label:"Open Sequence", meta:"Timeline and simulation engine", route:route("view","timeline"), keywords:"timeline sequence simulation trigger grace" },
      { id:"cmd-audit", group:"Commands", mark:"AUD", label:"Open Audit", meta:"Structured change history", route:route("view","activity"), command:"audit-tab", commandValue:"audit", keywords:"activity audit log events" },
      { id:"cmd-incidents", group:"Commands", mark:"INC", label:"Open Incidents", meta:"Snapshots and replay", route:route("view","activity"), command:"audit-tab", commandValue:"incidents", keywords:"incident simulation replay snapshot" },
      { id:"cmd-versions", group:"Commands", mark:"VER", label:"Open Versions", meta:"Definition history and comparison", route:route("view","activity"), command:"audit-tab", commandValue:"versions", keywords:"versions revisions compare restore" },
      { id:"cmd-health", group:"Commands", mark:"✓", label:"Open Plan Health", meta:"Retest warnings and path coverage", route:route("health"), keywords:"health assurance retest testing coverage" },
      { id:"cmd-policy", group:"Commands", mark:"SW", label:"Edit switch policy", meta:"Window, grace and repeat mode", route:route("policy"), keywords:"settings schedule interval grace rolling one shot" },
      { id:"cmd-simulation", group:"Commands", mark:"SIM", label:"Start a new Lab simulation", meta:"Archives the current mock run and starts a clean one", route:route("new-simulation"), keywords:"new start reset simulation test incident" },
      { id:"create-person", group:"Commands", mark:"＋", label:"Create person", meta:"Open the People editor", command:"create", commandValue:"person", keywords:"new add contact person" },
      { id:"create-org", group:"Commands", mark:"＋", label:"Create organization", meta:"Open the Organization editor", command:"create", commandValue:"organization", keywords:"new add company organization" },
      { id:"create-doc", group:"Commands", mark:"＋", label:"Create document record", meta:"Metadata only in Lab", command:"create", commandValue:"document", keywords:"new add document file" },
      { id:"create-asset", group:"Commands", mark:"＋", label:"Create digital asset", meta:"Domain, account, infrastructure or property", command:"create", commandValue:"asset", keywords:"new add asset domain account website" },
      { id:"create-action", group:"Commands", mark:"＋", label:"Create action", meta:"Open the guided Action Builder", command:"create", commandValue:"action", keywords:"new add action automation" }
    ];
  }

  function savedViews() {
    return [
      { id:"view-critical-actions", group:"Saved views", mark:"!", label:"Critical actions", meta:"Actions filtered to Critical risk", command:"saved-view", commandValue:"critical-actions", keywords:"critical dangerous high risk actions" },
      { id:"view-review-docs", group:"Saved views", mark:"DOC", label:"Documents needing review", meta:"Open Review due document records", command:"saved-view", commandValue:"review-docs", keywords:"review due expiring documents" },
      { id:"view-untested", group:"Saved views", mark:"TEST", label:"Untested action paths", meta:"Open Plan Health coverage", route:route("health"), keywords:"untested test coverage actions assurance" },
      { id:"view-changed", group:"Saved views", mark:"Δ", label:"Changed since simulation", meta:"Open Plan Health retest status", route:route("health"), keywords:"changed since simulation retest definitions" }
    ];
  }

  function buildSearchIndex() {
    const crm = load(KEYS.crm, { people:[], organizations:[] });
    const inventory = load(KEYS.inventory, { documents:[], assets:[] });
    const actionStore = load(KEYS.actions, { actions:[] });
    const incidents = load(KEYS.incidents, { incidents:{}, order:[] });
    const versions = load(KEYS.versions, { objects:{} });
    const audit = load(KEYS.audit, { events:[] });
    const orgMap = new Map((crm.organizations || []).map(item => [item.id,item]));
    const items = [];

    (crm.people || []).forEach(person => {
      const org = orgMap.get(person.orgId);
      items.push({ id:`person-${person.id}`, group:"People", mark:"ID", label:person.name, meta:[person.role,org?.name,person.location].filter(Boolean).join(" · "), route:route("person",person.id), keywords:[person.email,person.phone,person.relationship,person.importance,...(person.tags||[])].join(" ") });
    });
    (crm.organizations || []).forEach(org => items.push({ id:`org-${org.id}`, group:"Organizations", mark:"ORG", label:org.name, meta:[org.type,org.status,org.location].filter(Boolean).join(" · "), route:route("organization",org.id), keywords:[org.email,org.phone,org.website,...(org.tags||[])].join(" ") }));
    (inventory.documents || []).forEach(doc => items.push({ id:`doc-${doc.id}`, group:"Documents", mark:"DOC", label:doc.title, meta:[doc.category,doc.status,doc.sensitivity].filter(Boolean).join(" · "), route:route("document",doc.id), keywords:[doc.fileName,...(doc.tags||[])].join(" ") }));
    (inventory.assets || []).forEach(asset => items.push({ id:`asset-${asset.id}`, group:"Digital assets", mark:"WEB", label:asset.name, meta:[asset.type,asset.provider,asset.status].filter(Boolean).join(" · "), route:route("asset",asset.id), keywords:[asset.identifier,asset.environment,asset.sensitivity,...(asset.tags||[])].join(" ") }));
    (actionStore.actions || []).forEach(action => items.push({ id:`action-${action.id}`, group:"Actions", mark:({sms:"SMS",email:"EML",ai:"AI",digital_account:"ACC",social:"SOC",webhook:"API",publish:"PUB",organization_notice:"ORG",scheduled:"CAL",custom:"CUS"}[action.type] || "ACT"), label:action.name, meta:[action.risk,action.status,String(action.trigger?.mode||"").replaceAll("_"," ")].filter(Boolean).join(" · "), route:route("action",action.id), keywords:[action.type,JSON.stringify(action.config||{}),...(action.targets||[]).map(target=>`${target.kind} ${target.id}`)].join(" ") }));

    (incidents.order || Object.keys(incidents.incidents || {})).forEach(id => {
      const incident = incidents.incidents?.[id];
      if (!incident) return;
      items.push({ id:`incident-${id}`, group:"Incidents", mark:"INC", label:id.toUpperCase(), meta:`${incident.legacy ? "Legacy provenance" : "Versioned snapshot"} · ${dateTime(incident.openedAt || incident.capturedAt)}`, route:route("incident",id), keywords:[incident.status,incident.legacy?"legacy":"snapshot",JSON.stringify(incident.policySnapshot||{})].join(" ") });
    });

    Object.entries(versions.objects || {}).forEach(([key,revisions]) => {
      const latest = Array.isArray(revisions) ? revisions.at(-1) : null;
      if (!latest) return;
      items.push({ id:`version-${key}`, group:"Versions", mark:"VER", label:latest.label || key, meta:`${latest.objectType || "definition"} · v${latest.number || revisions.length}`, route:route("version",key), keywords:[key,latest.reason,latest.fingerprint,latest.objectType].join(" ") });
    });

    (audit.events || []).slice(0,120).forEach(event => items.push({ id:`audit-${event.id}`, group:"Audit events", mark:"AUD", label:event.title || event.type || "Audit event", meta:[event.category,event.severity,dateTime(event.at)].filter(Boolean).join(" · "), route:route("audit",event.id), keywords:[event.type,event.detail,event.objectLabel,event.objectType,event.incidentId].join(" ") }));

    return [...staticCommands(), ...savedViews(), ...items].map(item => ({ ...item, haystack:normalized([item.label,item.meta,item.keywords,item.group].join(" ")) }));
  }

  function searchScore(item, query) {
    if (!query) return 0;
    const q = normalized(query);
    const label = normalized(item.label);
    if (label === q) return 1000;
    if (label.startsWith(q)) return 700 - Math.min(100,label.length - q.length);
    if (label.includes(q)) return 500;
    const tokens = q.split(" ").filter(Boolean);
    if (!tokens.length) return 0;
    const hits = tokens.filter(token => item.haystack.includes(token)).length;
    if (hits !== tokens.length) return 0;
    return 250 + hits * 20 + (item.group === "Commands" ? 20 : 0);
  }

  function recentItems(index) {
    const map = new Map(index.filter(item => item.route).map(item => [routeString(item.route),item]));
    return (navigationStore.recent || []).map(entry => map.get(entry.key) || { id:`recent-${entry.key}`, group:"Recently viewed", mark:entry.mark || "→", label:entry.label, meta:entry.meta, route:entry.route, haystack:normalized(`${entry.label} ${entry.meta}`) }).filter(Boolean).slice(0,8).map(item => ({ ...item, group:"Recently viewed" }));
  }

  function defaultPaletteItems(index) {
    const recent = recentItems(index);
    const featured = index.filter(item => ["cmd-status","cmd-health","cmd-sequence","create-person","create-action","view-critical-actions","view-review-docs"].includes(item.id));
    return [...recent,...featured.filter(item => !recent.some(r => r.id === item.id))];
  }

  function filteredPaletteItems(query) {
    const index = buildSearchIndex();
    if (!normalized(query)) return defaultPaletteItems(index);
    return index.map(item => ({ item, score:searchScore(item,query) })).filter(result => result.score > 0).sort((a,b) => b.score - a.score || a.item.label.localeCompare(b.item.label)).slice(0,48).map(result => result.item);
  }

  function renderPalette() {
    if (!paletteResults || !paletteInput) return;
    visibleResults = filteredPaletteItems(paletteInput.value);
    activeIndex = clamp(activeIndex,0,Math.max(0,visibleResults.length-1));
    const groups = [];
    visibleResults.forEach((item,index) => {
      let group = groups.find(entry => entry.name === item.group);
      if (!group) { group = { name:item.group, items:[] }; groups.push(group); }
      group.items.push({ item,index });
    });

    paletteResults.innerHTML = visibleResults.length ? groups.map(group => `
      <section class="lab-command-group" aria-label="${esc(group.name)}">
        <header><span>${esc(group.name)}</span><b>${group.items.length}</b></header>
        ${group.items.map(({item,index}) => `<button type="button" class="lab-command-result${index===activeIndex?" is-active":""}" data-command-index="${index}" role="option" aria-selected="${index===activeIndex}">
          <span class="lab-command-mark">${esc(item.mark || "→")}</span>
          <span class="lab-command-copy"><strong>${esc(item.label)}</strong><small>${esc(item.meta || item.group)}</small></span>
          <span class="lab-command-kind">${esc(item.group)}</span><em>↵</em>
        </button>`).join("")}
      </section>`).join("") : `<div class="lab-command-empty"><span>⌕</span><strong>No Lab result</strong><p>Try a person, action, document, incident, command, or status term.</p></div>`;
    const count = $("#labCommandCount", palette);
    if (count) count.textContent = `${visibleResults.length} result${visibleResults.length===1?"":"s"}`;
    const active = $(`[data-command-index="${activeIndex}"]`,paletteResults);
    active?.scrollIntoView({block:"nearest"});
  }

  function openPalette(initialQuery = "") {
    closeCreateMenu();
    if (!palette) return;
    palette.hidden = false;
    document.body.classList.add("lab-command-open");
    paletteInput.value = initialQuery;
    activeIndex = 0;
    renderPalette();
    requestAnimationFrame(() => paletteInput.focus());
  }

  function closePalette() {
    if (!palette || palette.hidden) return;
    palette.hidden = true;
    document.body.classList.remove("lab-command-open");
    searchButton?.focus({preventScroll:true});
  }

  function runAuditTab(tab) {
    clickView("activity");
    waitFor(`.lab-audit-topbar [data-audit-tab="${tab}"]`, button => button.click());
  }

  function createRecord(kind) {
    closePalette(); closeCreateMenu();
    if (kind === "person" || kind === "organization") {
      clickView("records");
      waitFor('.lab-records-hub [data-records-section="directory"]', directory => {
        directory.click();
        const mode = kind === "person" ? "people" : "organizations";
        waitFor(`.lab-crm [data-crm-mode="${mode}"]`, modeButton => {
          if (!modeButton.classList.contains("is-active")) modeButton.click();
          waitFor("#crmNew", button => button.click());
        });
      });
      return;
    }
    if (kind === "document" || kind === "asset") {
      clickView("records");
      const section = kind === "document" ? "documents" : "assets";
      waitFor(`.lab-records-hub [data-records-section="${section}"]`, sectionButton => {
        sectionButton.click();
        waitFor('.lab-inventory-shell [data-inventory-action="new"]', button => button.click());
      });
      return;
    }
    if (kind === "action") {
      clickView("actions");
      waitFor('.lab-actions [data-action-command="new"]', button => button.click());
    }
  }

  function openSavedView(name) {
    closePalette();
    if (name === "critical-actions") {
      clickView("actions");
      waitFor('.lab-actions [data-action-filter]', select => {
        select.value = "Critical";
        select.dispatchEvent(new Event("change",{bubbles:true}));
      });
      return;
    }
    if (name === "review-docs") {
      clickView("records");
      waitFor('.lab-records-hub [data-records-section="documents"]', button => {
        button.click();
        waitFor('.lab-inventory-shell [data-inventory-filter]', select => {
          if ([...select.options].some(option => option.value === "Review due")) {
            select.value = "Review due";
            select.dispatchEvent(new Event("change",{bubbles:true}));
          }
        });
      });
    }
  }

  function executeItem(item) {
    if (!item) return;
    if (item.command === "create") { createRecord(item.commandValue); return; }
    if (item.command === "saved-view") { openSavedView(item.commandValue); return; }
    if (item.command === "audit-tab") { closePalette(); runAuditTab(item.commandValue); return; }
    if (item.route) {
      remember(item);
      closePalette();
      navigate(item.route);
    }
  }

  function moveActive(delta) {
    if (!visibleResults.length) return;
    activeIndex = (activeIndex + delta + visibleResults.length) % visibleResults.length;
    renderPalette();
  }

  function buildPalette() {
    palette = document.createElement("div");
    palette.className = "lab-command-overlay";
    palette.id = "labCommandPalette";
    palette.hidden = true;
    palette.innerHTML = `
      <section class="lab-command-dialog" role="dialog" aria-modal="true" aria-labelledby="labCommandTitle">
        <header class="lab-command-searchbar">
          <span class="lab-command-search-icon" aria-hidden="true">⌕</span>
          <label><span class="sr-only" id="labCommandTitle">Search Check In Lab</span><input id="labCommandInput" type="search" autocomplete="off" spellcheck="false" placeholder="Search people, actions, documents, incidents or commands…" /></label>
          <kbd>ESC</kbd>
        </header>
        <div class="lab-command-meta"><span id="labCommandCount">0 results</span><span><kbd>↑</kbd><kbd>↓</kbd> move <kbd>↵</kbd> open</span></div>
        <div class="lab-command-results" id="labCommandResults" role="listbox"></div>
        <footer><span><i></i> LAB INDEX · LOCAL MOCK DATA</span><strong>Search does not call production</strong></footer>
      </section>`;
    document.body.append(palette);
    paletteInput = $("#labCommandInput",palette);
    paletteResults = $("#labCommandResults",palette);

    paletteInput.addEventListener("input", () => { activeIndex=0; renderPalette(); });
    paletteInput.addEventListener("keydown", event => {
      if (event.key === "ArrowDown") { event.preventDefault(); moveActive(1); }
      else if (event.key === "ArrowUp") { event.preventDefault(); moveActive(-1); }
      else if (event.key === "Enter") { event.preventDefault(); executeItem(visibleResults[activeIndex]); }
      else if (event.key === "Escape") { event.preventDefault(); closePalette(); }
    });
    paletteResults.addEventListener("mousemove", event => {
      const button = event.target.closest("[data-command-index]");
      if (!button) return;
      const index = Number(button.dataset.commandIndex);
      if (Number.isFinite(index) && index !== activeIndex) { activeIndex=index; $$(".lab-command-result",paletteResults).forEach((node,i)=>node.classList.toggle("is-active",i===activeIndex)); }
    });
    paletteResults.addEventListener("click", event => {
      const button = event.target.closest("[data-command-index]");
      if (!button) return;
      executeItem(visibleResults[Number(button.dataset.commandIndex)]);
    });
    palette.addEventListener("mousedown", event => { if (event.target === palette) closePalette(); });
  }

  function buildCreateMenu() {
    createMenu = document.createElement("div");
    createMenu.className = "lab-create-menu";
    createMenu.id = "labCreateMenu";
    createMenu.hidden = true;
    createMenu.innerHTML = `
      <div class="lab-create-menu-head"><span>QUICK CREATE</span><small>Local Lab records</small></div>
      <button type="button" data-create-kind="person"><span>ID</span><div><strong>Person</strong><small>Contact or trusted individual</small></div><em>→</em></button>
      <button type="button" data-create-kind="organization"><span>ORG</span><div><strong>Organization</strong><small>Company, counsel or institution</small></div><em>→</em></button>
      <button type="button" data-create-kind="document"><span>DOC</span><div><strong>Document</strong><small>Protected metadata record</small></div><em>→</em></button>
      <button type="button" data-create-kind="asset"><span>WEB</span><div><strong>Digital asset</strong><small>Domain, account or infrastructure</small></div><em>→</em></button>
      <button type="button" data-create-kind="action"><span>ACT</span><div><strong>Action</strong><small>Contingency directive</small></div><em>→</em></button>
      <button type="button" data-create-kind="note"><span>＋</span><div><strong>Note current record</strong><small>Available when a record supports notes</small></div><em>→</em></button>`;
    document.body.append(createMenu);
    createMenu.addEventListener("click", event => {
      const kind = event.target.closest("[data-create-kind]")?.dataset.createKind;
      if (!kind) return;
      if (kind === "note") {
        const noteButton = $('.view.is-active [data-crm-action="note"], .view.is-active [data-inventory-action="note"]');
        if (noteButton) { closeCreateMenu(); noteButton.click(); }
        else openPalette("note");
        return;
      }
      createRecord(kind);
    });
  }

  function toggleCreateMenu() {
    if (!createMenu) return;
    const next = createMenu.hidden;
    closePalette();
    createMenu.hidden = !next;
    createButton?.setAttribute("aria-expanded",String(next));
  }

  function closeCreateMenu() {
    if (!createMenu) return;
    createMenu.hidden = true;
    createButton?.setAttribute("aria-expanded","false");
  }

  function buildGlobalControls() {
    const topActions = $(".top-actions");
    if (!topActions || $("#labGlobalSearch")) return;

    searchButton = document.createElement("button");
    searchButton.type = "button";
    searchButton.id = "labGlobalSearch";
    searchButton.className = "compact-action lab-global-search";
    searchButton.setAttribute("aria-keyshortcuts", isMac ? "Meta+K" : "Control+K");
    searchButton.innerHTML = `<span aria-hidden="true">⌕</span><strong>Search</strong><kbd>${esc(shortcutLabel)}</kbd>`;

    createButton = document.createElement("button");
    createButton.type = "button";
    createButton.id = "labGlobalCreate";
    createButton.className = "compact-action lab-global-create";
    createButton.setAttribute("aria-haspopup","menu");
    createButton.setAttribute("aria-expanded","false");
    createButton.innerHTML = '<span aria-hidden="true">＋</span><strong>New</strong>';

    const operator = $("#operatorButton",topActions);
    topActions.insertBefore(searchButton,operator || topActions.firstChild);
    topActions.insertBefore(createButton,operator || topActions.firstChild);
    searchButton.addEventListener("click",()=>openPalette());
    createButton.addEventListener("click",event=>{event.stopPropagation();toggleCreateMenu();});
  }

  function latestNonLegacyIncident() {
    const store = load(KEYS.incidents,{incidents:{},order:[]});
    const ids = store.order || Object.keys(store.incidents || {});
    for (const id of ids) {
      const incident = store.incidents?.[id];
      if (incident && !incident.legacy) return incident;
    }
    return null;
  }

  function currentPlanKeys() {
    const actions = load(KEYS.actions,{actions:[]}).actions || [];
    const inventory = load(KEYS.inventory,{documents:[],assets:[]});
    const decisions = load("cmx-lab-decisions-v1",{policies:{}}).policies || {};
    const keys = new Set(["switch-policy:primary"]);
    actions.filter(action=>action.status==="Enabled").forEach(action=>{
      keys.add(`action:${action.id}`);
      if (decisions[action.id]) keys.add(`decision:${action.id}`);
      (action.targets||[]).forEach(target=>{
        if (target.kind==="document" && inventory.documents?.some(item=>item.id===target.id)) keys.add(`document:${target.id}`);
        if (target.kind==="asset" && inventory.assets?.some(item=>item.id===target.id)) keys.add(`asset:${target.id}`);
      });
    });
    return [...keys];
  }

  function changedSinceIncident(incident) {
    if (!incident || incident.legacy) return [];
    const versions = load(KEYS.versions,{objects:{}}).objects || {};
    return currentPlanKeys().filter(key=>{
      const revisions = versions[key] || [];
      const current = revisions.at(-1);
      const snapshot = incident.versionRefs?.[key];
      if (!current) return false;
      return !snapshot || snapshot.revisionId !== current.id;
    });
  }

  function actionCoverage() {
    const actions = load(KEYS.actions,{actions:[]}).actions || [];
    const incidentStore = load(KEYS.incidents,{incidents:{}});
    const incidents = Object.values(incidentStore.incidents || {});
    return actions.filter(action=>action.status==="Enabled").map(action=>{
      const events = incidents.flatMap(incident=>incident.events||[]).filter(event=>event.actionId===action.id || event.targetActionId===action.id || String(event.detail||"").includes(action.name));
      const success = events.some(event=>["SIMULATED_SUCCESS","ACKNOWLEDGED","DELIVERED_AWAITING_ACK"].includes(event.code));
      const failure = events.some(event=>["SIMULATED_FAILURE","FINAL_FAILURE","RETRY_QUEUED","NO_ACKNOWLEDGEMENT","ACK_TIMEOUT"].includes(event.code));
      const acknowledgement = events.some(event=>["ACKNOWLEDGED","NO_ACKNOWLEDGEMENT","ACK_TIMEOUT","DELIVERED_AWAITING_ACK"].includes(event.code));
      const fallback = events.some(event=>["ROUTE_ACTIVATED","ROUTE_SIGNAL"].includes(event.code) && (event.targetActionId===action.id || String(event.detail||"").includes(`→ ${action.name}`)));
      return { action, tested:[success,failure,acknowledgement,fallback].filter(Boolean).length };
    });
  }

  function reviewDueDocuments() {
    const docs = load(KEYS.inventory,{documents:[]}).documents || [];
    const horizon = Date.now() + 14*86400000;
    return docs.filter(doc=>doc.status!=="Archived" && (doc.status==="Review due" || (doc.reviewAt && new Date(doc.reviewAt).getTime() <= horizon)));
  }

  function planHealth() {
    const policy = load(KEYS.policy,{intervalHours:72,graceHours:24,repeat:true});
    const actions = load(KEYS.actions,{actions:[]}).actions || [];
    const enabled = actions.filter(action=>action.status==="Enabled");
    const incident = latestNonLegacyIncident();
    const changed = changedSinceIncident(incident);
    const coverage = actionCoverage();
    const underTested = coverage.filter(item=>item.tested < 4);
    const reviewDue = reviewDueDocuments();
    let state="current", label="PLAN CURRENT", detail="Current definitions match the latest versioned Lab simulation snapshot.";
    if (!incident) { state="untested"; label="TEST REQUIRED"; detail="No versioned Lab simulation snapshot exists yet."; }
    else if (changed.length) { state="retest"; label="RETEST REQUIRED"; detail=`${changed.length} current definition${changed.length===1?" has":"s have"} changed since the latest test snapshot.`; }
    else if (underTested.length) { state="coverage"; label="COVERAGE INCOMPLETE"; detail=`${underTested.length} enabled action${underTested.length===1?" still needs":"s still need"} additional simulated path coverage.`; }
    return { policy,enabled,incident,changed,coverage,underTested,reviewDue,state,label,detail };
  }

  function renderAssurance() {
    const overview = $('[data-view-panel="overview"]');
    const anchor = $(".metric-grid",overview);
    if (!overview || !anchor) return;
    let block = $("#labPlanAssurance",overview);
    if (!block) {
      block = document.createElement("section");
      block.id = "labPlanAssurance";
      block.className = "lab-plan-assurance";
      anchor.before(block);
    }
    const h = planHealth();
    const policyMode = h.policy.repeat === false ? "One-shot" : "Rolling repeat";
    const last = h.incident ? dateTime(h.incident.capturedAt || h.incident.openedAt) : "No versioned test";
    const warnings = [];
    if (h.changed.length) warnings.push(`<button type="button" data-phase8-action="health"><span>Δ</span><div><strong>${h.changed.length} definition${h.changed.length===1?"":"s"} changed</strong><small>Retest the current plan before treating the latest simulation as current.</small></div><em>Review →</em></button>`);
    if (h.underTested.length) warnings.push(`<button type="button" data-phase8-action="health"><span>TEST</span><div><strong>${h.underTested.length} action${h.underTested.length===1?"":"s"} below 4/4 path coverage</strong><small>Success, failure, acknowledgement and fallback paths are tracked separately.</small></div><em>Coverage →</em></button>`);
    if (h.reviewDue.length) warnings.push(`<button type="button" data-phase8-action="review-docs"><span>DOC</span><div><strong>${h.reviewDue.length} document${h.reviewDue.length===1?"":"s"} need review</strong><small>Review-due and near-term metadata checks are surfaced here.</small></div><em>Open →</em></button>`);

    block.dataset.health = h.state;
    block.innerHTML = `<header><div class="lab-plan-title"><span class="lab-plan-mark">PLAN</span><div><small>CURRENT CONFIGURATION · LAB</small><strong>Contingency assurance</strong><p>${esc(h.detail)}</p></div></div><span class="lab-plan-state"><i></i>${esc(h.label)}</span></header>
      <div class="lab-plan-metrics">
        <div><small>PROOF OF LIFE</small><strong>${esc(duration(h.policy.intervalHours))}</strong><span>${esc(policyMode)}</span></div>
        <div><small>GRACE</small><strong>${esc(duration(h.policy.graceHours))}</strong><span>Final boundary T+${Number(h.policy.intervalHours||0)+Number(h.policy.graceHours||0)}h</span></div>
        <div><small>ENABLED ACTIONS</small><strong>${h.enabled.length}</strong><span>${h.changed.length ? `${h.changed.length} changed since test` : "Definition set tracked"}</span></div>
        <div><small>LATEST TEST SNAPSHOT</small><strong>${h.incident ? "CAPTURED" : "NONE"}</strong><span>${esc(last)}</span></div>
      </div>
      ${warnings.length ? `<div class="lab-plan-warnings">${warnings.join("")}</div>` : `<div class="lab-plan-clear"><span>✓</span><div><strong>No current assurance warning</strong><small>The current version set matches the latest Lab test snapshot and tracked action-path coverage.</small></div></div>`}
      <footer><button type="button" data-phase8-action="health">View plan health</button><button type="button" data-phase8-action="search">Search plan</button><button class="primary" type="button" data-phase8-action="simulate">New simulation</button></footer>`;
  }

  function handleAssuranceClick(event) {
    const action = event.target.closest("[data-phase8-action]")?.dataset.phase8Action;
    if (!action) return;
    if (action === "health") navigate(route("health"));
    else if (action === "search") openPalette();
    else if (action === "simulate") navigate(route("new-simulation"));
    else if (action === "review-docs") openSavedView("review-docs");
  }

  function syncHashFromNativeClick(event) {
    const view = event.target.closest("[data-view]");
    if (view && !event.target.closest("#labCommandPalette,#labCreateMenu")) {
      setTimeout(()=>writeRoute(route("view",view.dataset.view),true),0);
      return;
    }
    const crm = event.target.closest("[data-record-id]");
    if (crm) {
      const mode = $('.lab-crm [data-crm-mode].is-active')?.dataset.crmMode;
      setTimeout(()=>writeRoute(route(mode==="organizations"?"organization":"person",crm.dataset.recordId),true),0);
      return;
    }
    const inventory = event.target.closest("[data-inventory-id]");
    if (inventory) {
      const section = $('.lab-records-hub [data-records-section].is-active')?.dataset.recordsSection;
      setTimeout(()=>writeRoute(route(section==="assets"?"asset":"document",inventory.dataset.inventoryId),true),0);
      return;
    }
    const action = event.target.closest("[data-action-id]");
    if (action) { setTimeout(()=>writeRoute(route("action",action.dataset.actionId),true),0); return; }
    const incident = event.target.closest("[data-incident-id]");
    if (incident) { setTimeout(()=>writeRoute(route("incident",incident.dataset.incidentId),true),0); return; }
    const audit = event.target.closest("[data-audit-event]");
    if (audit) { setTimeout(()=>writeRoute(route("audit",audit.dataset.auditEvent),true),0); return; }
    const version = event.target.closest("[data-version-object]");
    if (version) { setTimeout(()=>writeRoute(route("version",version.dataset.versionObject),true),0); }
  }

  function installKeyboardNavigation() {
    document.addEventListener("keydown", event => {
      const target = event.target;
      const editing = target?.matches?.("input,textarea,select,[contenteditable=true]");
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        palette?.hidden ? openPalette() : closePalette();
        return;
      }
      if (event.key === "/" && !editing && palette?.hidden) {
        event.preventDefault();
        openPalette();
        return;
      }
      if (event.key === "Escape") {
        if (!palette?.hidden) { event.preventDefault(); closePalette(); }
        else if (!createMenu?.hidden) { event.preventDefault(); closeCreateMenu(); }
      }
    });
  }

  function bindIntegrationEvents() {
    document.addEventListener("click",event=>{
      if (!event.target.closest("#labCreateMenu,#labGlobalCreate")) closeCreateMenu();
      handleAssuranceClick(event);
      syncHashFromNativeClick(event);
    },true);
    ["cmx:lab-crm-updated","cmx:lab-inventory-updated","cmx:lab-actions-updated","cmx:lab-switch-policy-updated","cmx:lab-decisions-updated","cmx:lab-simulation-updated"].forEach(name=>document.addEventListener(name,()=>setTimeout(renderAssurance,30)));
    window.addEventListener("popstate",()=>{
      const next = readRouteFromLocation();
      if (next) navigate(next,{updateHistory:false});
    });
  }

  function improveAccessibility() {
    $$(".nav-item").forEach(button=>button.setAttribute("aria-label",button.textContent.trim().replace(/\s+/g," ")));
    const main = $("#main");
    if (main && !main.hasAttribute("tabindex")) main.setAttribute("tabindex","-1");
    const mobileSettings = $("#mobileSettings");
    mobileSettings?.setAttribute("title","Switch settings");
  }

  function init() {
    buildPalette();
    buildCreateMenu();
    buildGlobalControls();
    renderAssurance();
    installKeyboardNavigation();
    bindIntegrationEvents();
    improveAccessibility();
    const initial = readRouteFromLocation();
    if (initial) setTimeout(()=>navigate(initial,{updateHistory:false}),120);
    else writeRoute(route("view","overview"),true);
  }

  init();
})();