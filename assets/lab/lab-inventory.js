(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /**
   * BACKEND HANDOFF — DOCUMENTS + DIGITAL ASSETS
   * ---------------------------------------------
   * This module is intentionally Lab-only and stores synthetic metadata in localStorage.
   *
   * Production replacement plan:
   * 1) Replace INVENTORY_STORAGE_KEY reads/writes with authenticated FastAPI endpoints.
   * 2) PostgreSQL owns metadata, relationships, status, review dates, tags, and activity.
   * 3) File bytes belong in durable object storage. PostgreSQL stores object key, mime type,
   *    size, checksum, version, retention state, and storage status.
   * 4) Never store passwords, API keys, recovery codes, or other secrets in digital_assets.
   *    Store only a secret_ref that points at the future secrets/vault layer.
   * 5) Relationships should use a generic join table so documents/assets can link to
   *    people, organizations, actions, and future entities without schema duplication.
   * 6) Mutations must append audit events server-side. The client must never be the
   *    authoritative source for created_at, updated_at, actor, checksum, or delivery state.
   *
   * Suggested endpoints:
   * GET    /checkin/operator/inventory?kind=document|asset
   * POST   /checkin/operator/documents
   * PATCH  /checkin/operator/documents/{id}
   * POST   /checkin/operator/documents/{id}/file
   * POST   /checkin/operator/assets
   * PATCH  /checkin/operator/assets/{id}
   * POST   /checkin/operator/inventory/{kind}/{id}/links
   * DELETE /checkin/operator/inventory/{kind}/{id}/links/{link_id}
   * GET    /checkin/operator/inventory/{kind}/{id}/activity
   *
   * See assets/lab/BACKEND-HANDOFF.md for the fuller data-contract notes.
   */

  const INVENTORY_STORAGE_KEY = "cmx-lab-inventory-v1";
  const CRM_STORAGE_KEY = "cmx-lab-crm-v1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? "").replace(/[&<>'"]/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));
  const nowIso = offsetHours => new Date(Date.now() - offsetHours * 3600000).toISOString();

  const TYPE_META = {
    document: { label: "Document", plural: "Documents", icon: "DOC" },
    asset: { label: "Digital asset", plural: "Digital assets", icon: "WEB" }
  };

  const DOCUMENT_CATEGORIES = ["Identity", "Legal", "Financial", "Instructions", "Business", "Emergency", "Archive"];
  const ASSET_TYPES = ["Domain", "Website", "Cloud", "Hosting", "Repository", "Social account", "Device", "Service account"];
  const SENSITIVITIES = ["Standard", "Sensitive", "Restricted", "Critical"];
  const STATUSES = {
    document: ["Active", "Review due", "Archived", "Restricted"],
    asset: ["Active", "Monitor", "Transfer", "Archived"]
  };

  function seedInventory() {
    return {
      version: 1,
      documents: [
        {
          id: "d-emergency-instructions",
          title: "Emergency instructions",
          category: "Instructions",
          fileName: "emergency-instructions.pdf",
          mimeType: "application/pdf",
          size: 184320,
          status: "Active",
          sensitivity: "Critical",
          reviewAt: new Date(Date.now() + 21 * 86400000).toISOString(),
          peopleIds: ["p-maya", "p-sofia"],
          organizationIds: ["o-northstar"],
          tags: ["contingency", "legal", "family"],
          notes: "Synthetic Lab metadata. Represents the primary instructions package.",
          updatedAt: nowIso(3),
          activity: [
            { title: "Review scheduled", detail: "Next review set for the current Lab cycle.", at: nowIso(3) },
            { title: "People linked", detail: "Maya Chen and Sofia Rahman linked in the Lab graph.", at: nowIso(28) }
          ]
        },
        {
          id: "d-trust-summary",
          title: "Trust administration summary",
          category: "Financial",
          fileName: "trust-summary.pdf",
          mimeType: "application/pdf",
          size: 94122,
          status: "Restricted",
          sensitivity: "Restricted",
          reviewAt: new Date(Date.now() + 8 * 86400000).toISOString(),
          peopleIds: ["p-elena"],
          organizationIds: ["o-beacon"],
          tags: ["financial", "trust", "restricted"],
          notes: "Sample restricted financial document metadata. No real file exists.",
          updatedAt: nowIso(15),
          activity: [
            { title: "Sensitivity confirmed", detail: "Marked Restricted for the Lab scenario.", at: nowIso(15) }
          ]
        },
        {
          id: "d-business-continuity",
          title: "Business continuity contacts",
          category: "Business",
          fileName: "continuity-contacts.docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: 57280,
          status: "Active",
          sensitivity: "Sensitive",
          reviewAt: new Date(Date.now() + 42 * 86400000).toISOString(),
          peopleIds: ["p-daniel", "p-noah"],
          organizationIds: ["o-atlas"],
          tags: ["operations", "continuity"],
          notes: "Synthetic working document for operational handoff testing.",
          updatedAt: nowIso(31),
          activity: [
            { title: "Technical contact linked", detail: "Noah Williams added to the document relationship graph.", at: nowIso(31) }
          ]
        },
        {
          id: "d-id-copy",
          title: "Identity verification copy",
          category: "Identity",
          fileName: "identity-copy.pdf",
          mimeType: "application/pdf",
          size: 422104,
          status: "Review due",
          sensitivity: "Critical",
          reviewAt: new Date(Date.now() + 2 * 86400000).toISOString(),
          peopleIds: ["p-sofia"],
          organizationIds: [],
          tags: ["identity", "review"],
          notes: "Synthetic identity record. Used to test review-due presentation.",
          updatedAt: nowIso(48),
          activity: [
            { title: "Review window approaching", detail: "Document flagged for near-term review.", at: nowIso(48) }
          ]
        },
        {
          id: "d-legal-routing",
          title: "Legal notification routing",
          category: "Legal",
          fileName: "legal-routing.md",
          mimeType: "text/markdown",
          size: 8120,
          status: "Active",
          sensitivity: "Sensitive",
          reviewAt: new Date(Date.now() + 60 * 86400000).toISOString(),
          peopleIds: ["p-maya", "p-marcus"],
          organizationIds: ["o-northstar"],
          tags: ["legal", "routing"],
          notes: "Sample routing notes that can later link directly to Action Builder steps.",
          updatedAt: nowIso(72),
          activity: [
            { title: "Routing note updated", detail: "Secondary counsel added to the synthetic route.", at: nowIso(72) }
          ]
        },
        {
          id: "d-archive-index",
          title: "Protected archive index",
          category: "Archive",
          fileName: "archive-index.csv",
          mimeType: "text/csv",
          size: 12980,
          status: "Archived",
          sensitivity: "Standard",
          reviewAt: "",
          peopleIds: [],
          organizationIds: [],
          tags: ["archive", "index"],
          notes: "Synthetic archive inventory used for interface testing.",
          updatedAt: nowIso(120),
          activity: [
            { title: "Archived", detail: "Moved into the Lab archive state.", at: nowIso(120) }
          ]
        }
      ],
      assets: [
        {
          id: "a-primary-domain",
          name: "Primary contingency domain",
          type: "Domain",
          identifier: "contingency.example.test",
          provider: "Registrar mock",
          environment: "Production-like",
          status: "Active",
          sensitivity: "Restricted",
          ownerPersonId: "p-noah",
          organizationId: "o-atlas",
          documentIds: ["d-business-continuity"],
          secretRef: "vault://lab/domain-primary",
          tags: ["domain", "dns", "critical-path"],
          notes: "Secret reference is illustrative only. Credentials are never stored in this record.",
          updatedAt: nowIso(5),
          activity: [
            { title: "Ownership reviewed", detail: "Technical owner linked in Lab.", at: nowIso(5) }
          ]
        },
        {
          id: "a-cloud-console",
          name: "Cloud operations account",
          type: "Cloud",
          identifier: "ops-cloud@example.test",
          provider: "Cloud provider mock",
          environment: "Production-like",
          status: "Monitor",
          sensitivity: "Critical",
          ownerPersonId: "p-daniel",
          organizationId: "o-atlas",
          documentIds: ["d-business-continuity"],
          secretRef: "vault://lab/cloud-ops",
          tags: ["cloud", "operations"],
          notes: "Metadata only. Future backend should resolve secret_ref through a dedicated secrets service.",
          updatedAt: nowIso(12),
          activity: [
            { title: "Monitoring enabled", detail: "Marked Monitor for the current Lab scenario.", at: nowIso(12) }
          ]
        },
        {
          id: "a-repository",
          name: "Contingency automation repository",
          type: "Repository",
          identifier: "example/contingency-ops",
          provider: "Git host mock",
          environment: "Restricted",
          status: "Active",
          sensitivity: "Sensitive",
          ownerPersonId: "p-noah",
          organizationId: "o-atlas",
          documentIds: ["d-legal-routing"],
          secretRef: "",
          tags: ["repository", "automation"],
          notes: "Sample source-control asset. No external request is made from Lab.",
          updatedAt: nowIso(22),
          activity: [
            { title: "Repository linked", detail: "Connected to sample routing documentation.", at: nowIso(22) }
          ]
        },
        {
          id: "a-family-channel",
          name: "Family notification account",
          type: "Social account",
          identifier: "@example-contingency",
          provider: "Social platform mock",
          environment: "Personal",
          status: "Transfer",
          sensitivity: "Sensitive",
          ownerPersonId: "p-sofia",
          organizationId: "",
          documentIds: ["d-emergency-instructions"],
          secretRef: "vault://lab/social-family",
          tags: ["social", "family", "handoff"],
          notes: "Synthetic account intended to demonstrate future notification routing.",
          updatedAt: nowIso(37),
          activity: [
            { title: "Transfer state set", detail: "Asset flagged for future transfer workflow testing.", at: nowIso(37) }
          ]
        },
        {
          id: "a-legal-portal",
          name: "Legal document portal",
          type: "Service account",
          identifier: "portal.northstar.example.test",
          provider: "Portal mock",
          environment: "External",
          status: "Active",
          sensitivity: "Restricted",
          ownerPersonId: "p-maya",
          organizationId: "o-northstar",
          documentIds: ["d-emergency-instructions", "d-legal-routing"],
          secretRef: "vault://lab/legal-portal",
          tags: ["legal", "portal"],
          notes: "Sample external service account. Only reference metadata belongs here.",
          updatedAt: nowIso(56),
          activity: [
            { title: "Documents linked", detail: "Two synthetic documents associated with this asset.", at: nowIso(56) }
          ]
        }
      ]
    };
  }

  function loadInventory() {
    try {
      const stored = JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY));
      if (stored?.version === 1 && Array.isArray(stored.documents) && Array.isArray(stored.assets)) return stored;
    } catch {}
    const seeded = seedInventory();
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  function loadCrm() {
    try {
      const stored = JSON.parse(localStorage.getItem(CRM_STORAGE_KEY));
      if (stored?.version === 1 && Array.isArray(stored.people) && Array.isArray(stored.organizations)) return stored;
    } catch {}
    return { people: [], organizations: [] };
  }

  let data = loadInventory();
  let crm = loadCrm();
  let root;
  let shell;
  let dialog;
  let ui = { section: "directory", mode: "document", selectedId: null, query: "", filter: "all", sort: "updated" };

  function typeData() {
    return ui.mode === "document" ? data.documents : data.assets;
  }

  function recordFor(id = ui.selectedId) {
    return typeData().find(record => record.id === id) || null;
  }

  function personFor(id) { return crm.people.find(person => person.id === id) || null; }
  function orgFor(id) { return crm.organizations.find(org => org.id === id) || null; }
  function documentFor(id) { return data.documents.find(doc => doc.id === id) || null; }

  function saveInventory() {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(data));
    syncCrmDocumentCounts();
    document.dispatchEvent(new CustomEvent("cmx:lab-inventory-updated", {
      detail: { documents: data.documents.length, assets: data.assets.length }
    }));
  }

  function syncCrmDocumentCounts() {
    crm = loadCrm();
    if (!crm.people.length && !crm.organizations.length) return;
    crm.people.forEach(person => {
      person.documents = data.documents.filter(doc => doc.peopleIds?.includes(person.id)).length;
    });
    crm.organizations.forEach(org => {
      org.documents = data.documents.filter(doc => doc.organizationIds?.includes(org.id)).length;
    });
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(crm));
    document.dispatchEvent(new CustomEvent("cmx:lab-crm-updated", {
      detail: { people: crm.people.length, organizations: crm.organizations.length, source: "inventory" }
    }));
  }

  function slugId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function tagsFrom(value) {
    return String(value || "").split(",").map(tag => tag.trim()).filter(Boolean).slice(0, 10);
  }

  function formatBytes(bytes) {
    const value = Number(bytes || 0);
    if (!value) return "Metadata only";
    if (value < 1024) return `${value} B`;
    if (value < 1024 ** 2) return `${Math.round(value / 1024)} KB`;
    return `${(value / 1024 ** 2).toFixed(1)} MB`;
  }

  function shortDate(iso) {
    if (!iso) return "—";
    const date = new Date(iso);
    const diff = Date.now() - date.getTime();
    if (diff < 3600000) return `${Math.max(1, Math.floor(diff / 60000))}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 7 * 86400000) return `${Math.floor(diff / 86400000)}d`;
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
  }

  function longDate(iso) {
    if (!iso) return "Not set";
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
  }

  function dateOnly(iso) {
    if (!iso) return "Not scheduled";
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
  }

  function sensitivityClass(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "-");
  }

  function reviewState(doc) {
    if (!doc.reviewAt) return { label: "No review", className: "" };
    const days = Math.ceil((new Date(doc.reviewAt).getTime() - Date.now()) / 86400000);
    if (days < 0) return { label: "Review overdue", className: "danger" };
    if (days <= 7) return { label: `Review in ${days}d`, className: "warning" };
    return { label: `Review ${dateOnly(doc.reviewAt)}`, className: "" };
  }

  function toast(message) {
    const node = $("#toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("is-visible"), 2800);
  }

  function buildHub() {
    root = $(".lab-crm");
    const panel = $('[data-view-panel="records"]');
    if (!root || !panel || $(".lab-records-hub", panel)) return;

    const heading = $(".view-heading", panel);
    const eyebrow = $(".eyebrow", heading);
    const title = $("h1", heading);
    if (eyebrow) eyebrow.textContent = "PROTECTED RECORDS · LAB";
    if (title) title.textContent = "Records & digital estate";

    const hub = document.createElement("nav");
    hub.className = "lab-records-hub";
    hub.setAttribute("aria-label", "Records workspace");
    hub.innerHTML = `
      <button type="button" class="is-active" data-records-section="directory"><span>Directory</span><small>People · Organizations</small></button>
      <button type="button" data-records-section="documents"><span>Documents</span><small id="recordsDocumentCount">${data.documents.length} records</small></button>
      <button type="button" data-records-section="assets"><span>Digital assets</span><small id="recordsAssetCount">${data.assets.length} records</small></button>`;
    root.before(hub);

    shell = document.createElement("section");
    shell.className = "lab-inventory-shell";
    shell.hidden = true;
    root.after(shell);

    dialog = document.createElement("dialog");
    dialog.className = "inventory-dialog";
    dialog.id = "inventoryDialog";
    document.body.append(dialog);

    hub.addEventListener("click", event => {
      const button = event.target.closest("[data-records-section]");
      if (!button) return;
      setSection(button.dataset.recordsSection);
    });

    shell.addEventListener("click", handleShellClick);
    shell.addEventListener("input", handleShellInput);
    shell.addEventListener("change", handleShellChange);

    dialog.addEventListener("click", event => {
      if (event.target.closest("[data-inventory-close]")) dialog.close();
    });
    dialog.addEventListener("submit", handleDialogSubmit);

    document.addEventListener("cmx:lab-crm-updated", () => {
      crm = loadCrm();
      if (ui.section !== "directory") renderInventory();
    });

    syncCrmDocumentCounts();
    renderCounts();
  }

  function renderCounts() {
    const docs = $("#recordsDocumentCount");
    const assets = $("#recordsAssetCount");
    if (docs) docs.textContent = `${data.documents.length} record${data.documents.length === 1 ? "" : "s"}`;
    if (assets) assets.textContent = `${data.assets.length} record${data.assets.length === 1 ? "" : "s"}`;
  }

  function setSection(section) {
    ui.section = section;
    $$(".lab-records-hub [data-records-section]").forEach(button => button.classList.toggle("is-active", button.dataset.recordsSection === section));
    if (section === "directory") {
      root.hidden = false;
      shell.hidden = true;
      return;
    }
    root.hidden = true;
    shell.hidden = false;
    ui.mode = section === "documents" ? "document" : "asset";
    ui.query = "";
    ui.filter = "all";
    ui.sort = "updated";
    ui.selectedId = typeData()[0]?.id || null;
    shell.dataset.mobileDetail = "false";
    renderInventory();
  }

  function filteredRecords() {
    let records = [...typeData()];
    if (ui.query) {
      records = records.filter(record => {
        const linkedPeople = ui.mode === "document"
          ? (record.peopleIds || []).map(id => personFor(id)?.name || "")
          : [personFor(record.ownerPersonId)?.name || ""];
        const linkedOrgs = ui.mode === "document"
          ? (record.organizationIds || []).map(id => orgFor(id)?.name || "")
          : [orgFor(record.organizationId)?.name || ""];
        const haystack = [
          record.title, record.name, record.category, record.type, record.fileName,
          record.identifier, record.provider, record.environment, record.status,
          record.sensitivity, record.notes, ...(record.tags || []), ...linkedPeople, ...linkedOrgs
        ].join(" ").toLowerCase();
        return haystack.includes(ui.query);
      });
    }
    if (ui.filter !== "all") {
      records = records.filter(record => record.status === ui.filter || record.sensitivity === ui.filter || record.category === ui.filter || record.type === ui.filter);
    }
    records.sort((a, b) => {
      if (ui.sort === "name") return (a.title || a.name || "").localeCompare(b.title || b.name || "");
      if (ui.sort === "sensitivity") return SENSITIVITIES.indexOf(b.sensitivity) - SENSITIVITIES.indexOf(a.sensitivity);
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });
    return records;
  }

  function renderInventory() {
    const meta = TYPE_META[ui.mode];
    const records = filteredRecords();
    if (!ui.selectedId || !typeData().some(record => record.id === ui.selectedId)) ui.selectedId = records[0]?.id || typeData()[0]?.id || null;

    shell.innerHTML = `
      <header class="inventory-topbar">
        <div class="inventory-topbar-main">
          <span class="inventory-topbar-mark" aria-hidden="true">${ui.mode === "document" ? "DOC" : "WEB"}</span>
          <span><strong>${meta.plural}</strong><small>${ui.mode === "document" ? "Protected file metadata and relationships" : "Domains, accounts, infrastructure and digital property"}</small></span>
        </div>
        <div class="inventory-tools">
          <label class="inventory-search"><span class="sr-only">Search ${meta.plural}</span><input type="search" data-inventory-search value="${esc(ui.query)}" placeholder="Search ${meta.plural.toLowerCase()}, tags, owners…" /></label>
          <select data-inventory-filter aria-label="Filter ${meta.plural}">${filterOptions()}</select>
          <select data-inventory-sort aria-label="Sort ${meta.plural}">
            <option value="updated"${ui.sort === "updated" ? " selected" : ""}>Recently updated</option>
            <option value="name"${ui.sort === "name" ? " selected" : ""}>Name A–Z</option>
            <option value="sensitivity"${ui.sort === "sensitivity" ? " selected" : ""}>Sensitivity</option>
          </select>
          <button type="button" class="inventory-button primary" data-inventory-action="new">＋ New ${ui.mode === "document" ? "document" : "asset"}</button>
        </div>
      </header>
      <div class="inventory-layout">
        <aside class="inventory-list-panel">
          <div class="inventory-pane-head"><span>${meta.plural}</span><strong>${records.length}</strong></div>
          <div class="inventory-list">${records.length ? records.map(listItem).join("") : emptyList()}</div>
          <div class="inventory-list-foot"><span>Lab metadata only</span><button type="button" data-inventory-action="reset">Reset sample</button></div>
        </aside>
        <section class="inventory-detail-panel">${renderDetail()}</section>
        <aside class="inventory-context-panel"><div class="inventory-pane-head"><span>Connections</span><strong>LAB</strong></div>${renderContext()}</aside>
      </div>`;
  }

  function filterOptions() {
    const groups = ui.mode === "document"
      ? [...DOCUMENT_CATEGORIES, ...STATUSES.document, ...SENSITIVITIES]
      : [...ASSET_TYPES, ...STATUSES.asset, ...SENSITIVITIES];
    return `<option value="all">All ${ui.mode === "document" ? "documents" : "assets"}</option>${[...new Set(groups)].map(value => `<option value="${esc(value)}"${ui.filter === value ? " selected" : ""}>${esc(value)}</option>`).join("")}`;
  }

  function listItem(record) {
    const isDoc = ui.mode === "document";
    const name = isDoc ? record.title : record.name;
    const secondary = isDoc ? `${record.category} · ${record.fileName || "Metadata"}` : `${record.type} · ${record.provider || record.identifier || "Unassigned"}`;
    const active = record.id === ui.selectedId;
    return `<button type="button" class="inventory-list-item${active ? " is-active" : ""}" data-inventory-id="${esc(record.id)}" aria-current="${active}">
      <span class="inventory-record-icon ${isDoc ? "document" : "asset"}" aria-hidden="true">${isDoc ? fileMark(record) : assetMark(record)}</span>
      <span class="inventory-list-copy"><strong>${esc(name)}</strong><small>${esc(secondary)}</small></span>
      <span class="inventory-list-meta"><span class="inventory-sensitivity ${sensitivityClass(record.sensitivity)}">${esc(record.sensitivity)}</span><span>${esc(shortDate(record.updatedAt))}</span></span>
    </button>`;
  }

  function fileMark(record) {
    const ext = String(record.fileName || "").split(".").pop().slice(0, 4).toUpperCase();
    return ext || "DOC";
  }

  function assetMark(record) {
    const map = { Domain: "DNS", Website: "WEB", Cloud: "CLD", Hosting: "SRV", Repository: "GIT", "Social account": "SOC", Device: "DEV", "Service account": "ACC" };
    return map[record.type] || "WEB";
  }

  function emptyList() {
    return `<div class="inventory-empty"><strong>No matching records</strong><p>Change the search or filter, or create a new Lab record.</p></div>`;
  }

  function renderDetail() {
    const record = recordFor();
    if (!record) return `<div class="inventory-detail empty"><strong>Select a record</strong><p>Choose a record from the list to inspect its protected metadata.</p></div>`;
    return ui.mode === "document" ? documentDetail(record) : assetDetail(record);
  }

  function documentDetail(doc) {
    const review = reviewState(doc);
    const people = (doc.peopleIds || []).map(personFor).filter(Boolean);
    const orgs = (doc.organizationIds || []).map(orgFor).filter(Boolean);
    const linkedAssets = data.assets.filter(asset => (asset.documentIds || []).includes(doc.id));
    return `<div class="inventory-detail">
      <button type="button" class="inventory-mobile-back" data-inventory-action="mobile-back">← ${TYPE_META.document.plural}</button>
      <header class="inventory-profile-head">
        <span class="inventory-large-icon document" aria-hidden="true">${fileMark(doc)}</span>
        <div class="inventory-profile-title">
          <span class="inventory-kicker"><i></i> DOCUMENT · ${esc(doc.status)}</span>
          <h2>${esc(doc.title)}</h2>
          <p>${esc(doc.category)} · ${esc(doc.fileName || "Metadata record")}</p>
          <div class="inventory-tag-row">${(doc.tags || []).map(tag => `<span>${esc(tag)}</span>`).join("")}</div>
        </div>
        <div class="inventory-profile-actions">
          <button type="button" class="inventory-button" data-inventory-action="edit">Edit</button>
          <button type="button" class="inventory-button" data-inventory-action="note">＋ Note</button>
          <button type="button" class="inventory-button primary" data-inventory-action="link">Manage links</button>
        </div>
      </header>
      <div class="inventory-alert-row">
        <div class="inventory-alert ${sensitivityClass(doc.sensitivity)}"><span>Sensitivity</span><strong>${esc(doc.sensitivity)}</strong></div>
        <div class="inventory-alert ${review.className}"><span>Review</span><strong>${esc(review.label)}</strong></div>
        <div class="inventory-alert"><span>Storage</span><strong>LAB METADATA</strong></div>
      </div>
      <div class="inventory-facts">
        <div><span>File</span><strong>${esc(doc.fileName || "No file selected")}</strong></div>
        <div><span>Type</span><strong>${esc(doc.mimeType || "Unknown")}</strong></div>
        <div><span>Size</span><strong>${esc(formatBytes(doc.size))}</strong></div>
        <div><span>Updated</span><strong>${esc(longDate(doc.updatedAt))}</strong></div>
      </div>
      <div class="inventory-detail-grid">
        <section class="inventory-card file-card">
          <div class="inventory-card-head"><strong>File object</strong><small>Backend boundary</small></div>
          <div class="inventory-file-object">
            <span class="inventory-file-seal">${fileMark(doc)}</span>
            <div><strong>${esc(doc.fileName || "Metadata only")}</strong><small>${esc(formatBytes(doc.size))} · ${esc(doc.mimeType || "Unknown")}</small></div>
          </div>
          <div class="inventory-storage-note"><i></i><span><strong>File body is not stored in Lab.</strong><small>Production should upload to private object storage and persist checksum + object key in PostgreSQL.</small></span></div>
        </section>
        <section class="inventory-card">
          <div class="inventory-card-head"><strong>Relationships</strong><small>${people.length + orgs.length + linkedAssets.length} links</small></div>
          ${relationshipList(people, orgs, linkedAssets)}
        </section>
        <section class="inventory-card full">
          <div class="inventory-card-head"><strong>Notes</strong><small>Local mock</small></div>
          <p class="inventory-body-copy">${esc(doc.notes || "No notes yet.")}</p>
        </section>
        <section class="inventory-card full">
          <div class="inventory-card-head"><strong>Activity</strong><small>${(doc.activity || []).length} events</small></div>
          ${timeline(doc.activity)}
        </section>
      </div>
    </div>`;
  }

  function assetDetail(asset) {
    const owner = personFor(asset.ownerPersonId);
    const org = orgFor(asset.organizationId);
    const docs = (asset.documentIds || []).map(documentFor).filter(Boolean);
    return `<div class="inventory-detail">
      <button type="button" class="inventory-mobile-back" data-inventory-action="mobile-back">← ${TYPE_META.asset.plural}</button>
      <header class="inventory-profile-head">
        <span class="inventory-large-icon asset" aria-hidden="true">${assetMark(asset)}</span>
        <div class="inventory-profile-title">
          <span class="inventory-kicker"><i></i> DIGITAL ASSET · ${esc(asset.status)}</span>
          <h2>${esc(asset.name)}</h2>
          <p>${esc(asset.type)} · ${esc(asset.provider || asset.environment || "Provider not set")}</p>
          <div class="inventory-tag-row">${(asset.tags || []).map(tag => `<span>${esc(tag)}</span>`).join("")}</div>
        </div>
        <div class="inventory-profile-actions">
          <button type="button" class="inventory-button" data-inventory-action="edit">Edit</button>
          <button type="button" class="inventory-button" data-inventory-action="note">＋ Note</button>
          <button type="button" class="inventory-button primary" data-inventory-action="link">Manage links</button>
        </div>
      </header>
      <div class="inventory-alert-row">
        <div class="inventory-alert ${sensitivityClass(asset.sensitivity)}"><span>Sensitivity</span><strong>${esc(asset.sensitivity)}</strong></div>
        <div class="inventory-alert"><span>Status</span><strong>${esc(asset.status)}</strong></div>
        <div class="inventory-alert secret"><span>Secrets</span><strong>${asset.secretRef ? "REFERENCE ONLY" : "NONE LINKED"}</strong></div>
      </div>
      <div class="inventory-facts">
        <div><span>Identifier</span><strong>${esc(asset.identifier || "Not set")}</strong></div>
        <div><span>Provider</span><strong>${esc(asset.provider || "Not set")}</strong></div>
        <div><span>Environment</span><strong>${esc(asset.environment || "Not set")}</strong></div>
        <div><span>Updated</span><strong>${esc(longDate(asset.updatedAt))}</strong></div>
      </div>
      <div class="inventory-detail-grid">
        <section class="inventory-card">
          <div class="inventory-card-head"><strong>Ownership</strong><small>Relationship graph</small></div>
          ${owner ? relatedPerson(owner) : `<div class="inventory-link-tile"><span>Owner</span><strong>Unassigned</strong><small>Assign a person when responsibility is known.</small></div>`}
          ${org ? relatedOrg(org) : ""}
        </section>
        <section class="inventory-card">
          <div class="inventory-card-head"><strong>Credential boundary</strong><small>Reference only</small></div>
          <div class="inventory-secret-ref"><span>SECRET REF</span><strong>${esc(asset.secretRef || "Not configured")}</strong><small>Never place passwords, tokens, recovery codes or private keys in this record.</small></div>
        </section>
        <section class="inventory-card">
          <div class="inventory-card-head"><strong>Linked documents</strong><small>${docs.length}</small></div>
          <div class="inventory-related-list">${docs.length ? docs.map(relatedDocument).join("") : `<p class="inventory-body-copy">No documents linked yet.</p>`}</div>
        </section>
        <section class="inventory-card">
          <div class="inventory-card-head"><strong>Future actions</strong><small>Phase 4</small></div>
          <div class="inventory-link-tile"><span>Action Builder</span><strong>Ready for linkage</strong><small>Assets will become selectable targets/inputs when we build action configuration.</small></div>
          <button type="button" class="inventory-context-action" data-inventory-action="open-actions">Open Actions <span>→</span></button>
        </section>
        <section class="inventory-card full">
          <div class="inventory-card-head"><strong>Notes</strong><small>Local mock</small></div>
          <p class="inventory-body-copy">${esc(asset.notes || "No notes yet.")}</p>
        </section>
        <section class="inventory-card full">
          <div class="inventory-card-head"><strong>Activity</strong><small>${(asset.activity || []).length} events</small></div>
          ${timeline(asset.activity)}
        </section>
      </div>
    </div>`;
  }

  function relationshipList(people, orgs, assets) {
    const rows = [
      ...people.map(relatedPerson),
      ...orgs.map(relatedOrg),
      ...assets.map(asset => `<button type="button" class="inventory-related" data-open-asset="${esc(asset.id)}"><span class="inventory-related-icon asset">${assetMark(asset)}</span><span><strong>${esc(asset.name)}</strong><small>${esc(asset.type)}</small></span><em>→</em></button>`)
    ];
    return `<div class="inventory-related-list">${rows.join("") || `<p class="inventory-body-copy">No linked records yet.</p>`}</div>`;
  }

  function relatedPerson(person) {
    const initials = person.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
    return `<button type="button" class="inventory-related" data-open-person="${esc(person.id)}"><span class="inventory-related-avatar">${esc(initials)}</span><span><strong>${esc(person.name)}</strong><small>${esc(person.role || person.relationship || "Person")}</small></span><em>→</em></button>`;
  }

  function relatedOrg(org) {
    const initials = org.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
    return `<button type="button" class="inventory-related" data-open-org="${esc(org.id)}"><span class="inventory-related-avatar org">${esc(initials)}</span><span><strong>${esc(org.name)}</strong><small>${esc(org.type || "Organization")}</small></span><em>→</em></button>`;
  }

  function relatedDocument(doc) {
    return `<button type="button" class="inventory-related" data-open-document="${esc(doc.id)}"><span class="inventory-related-icon document">${fileMark(doc)}</span><span><strong>${esc(doc.title)}</strong><small>${esc(doc.category)}</small></span><em>→</em></button>`;
  }

  function timeline(events = []) {
    if (!events.length) return `<p class="inventory-body-copy">No activity recorded yet.</p>`;
    return `<div class="inventory-timeline">${events.slice(0, 10).map(event => `<div class="inventory-event"><span class="inventory-event-dot"></span><span><strong>${esc(event.title)}</strong><small>${esc(event.detail || "")}</small></span><time>${esc(longDate(event.at))}</time></div>`).join("")}</div>`;
  }

  function renderContext() {
    const record = recordFor();
    if (!record) return "";
    if (ui.mode === "document") {
      const people = (record.peopleIds || []).map(personFor).filter(Boolean);
      const orgs = (record.organizationIds || []).map(orgFor).filter(Boolean);
      const assets = data.assets.filter(asset => (asset.documentIds || []).includes(record.id));
      const review = reviewState(record);
      return `<div class="inventory-context">
        <section><div class="inventory-context-title"><strong>Linked people</strong><span>${people.length}</span></div>${people.map(relatedPerson).join("") || contextEmpty("No people linked")}</section>
        <section><div class="inventory-context-title"><strong>Organizations</strong><span>${orgs.length}</span></div>${orgs.map(relatedOrg).join("") || contextEmpty("No organizations linked")}</section>
        <section><div class="inventory-context-title"><strong>Digital assets</strong><span>${assets.length}</span></div>${assets.map(asset => `<button type="button" class="inventory-related" data-open-asset="${esc(asset.id)}"><span class="inventory-related-icon asset">${assetMark(asset)}</span><span><strong>${esc(asset.name)}</strong><small>${esc(asset.type)}</small></span><em>→</em></button>`).join("") || contextEmpty("No digital assets linked")}</section>
        <section><div class="inventory-context-title"><strong>Review control</strong><span>${review.className ? "ATTN" : "OK"}</span></div><div class="inventory-link-tile"><span>Next review</span><strong>${esc(review.label)}</strong><small>Production review status should be server-derived and auditable.</small></div></section>
      </div>`;
    }
    const owner = personFor(record.ownerPersonId);
    const org = orgFor(record.organizationId);
    const docs = (record.documentIds || []).map(documentFor).filter(Boolean);
    return `<div class="inventory-context">
      <section><div class="inventory-context-title"><strong>Responsible owner</strong><span>${owner ? "01" : "00"}</span></div>${owner ? relatedPerson(owner) : contextEmpty("No owner assigned")}</section>
      <section><div class="inventory-context-title"><strong>Organization</strong><span>${org ? "01" : "00"}</span></div>${org ? relatedOrg(org) : contextEmpty("No organization linked")}</section>
      <section><div class="inventory-context-title"><strong>Documents</strong><span>${docs.length}</span></div>${docs.slice(0, 4).map(relatedDocument).join("") || contextEmpty("No documents linked")}</section>
      <section><div class="inventory-context-title"><strong>Security boundary</strong><span>LAB</span></div><div class="inventory-link-tile danger"><span>Credentials</span><strong>Never stored here</strong><small>${record.secretRef ? "A mock secret reference exists for future vault integration." : "No secret reference configured."}</small></div></section>
    </div>`;
  }

  function contextEmpty(label) {
    return `<div class="inventory-link-tile"><span>Relationship</span><strong>${esc(label)}</strong><small>Use Manage links to connect this record.</small></div>`;
  }

  function handleShellClick(event) {
    const listItem = event.target.closest("[data-inventory-id]");
    if (listItem) {
      ui.selectedId = listItem.dataset.inventoryId;
      if (matchMedia("(max-width:700px)").matches) shell.dataset.mobileDetail = "true";
      renderInventory();
      return;
    }

    const person = event.target.closest("[data-open-person]");
    if (person) return openCrmRecord("people", person.dataset.openPerson);
    const org = event.target.closest("[data-open-org]");
    if (org) return openCrmRecord("organizations", org.dataset.openOrg);
    const doc = event.target.closest("[data-open-document]");
    if (doc) {
      ui.mode = "document";
      ui.section = "documents";
      ui.selectedId = doc.dataset.openDocument;
      updateHubSelection("documents");
      renderInventory();
      return;
    }
    const asset = event.target.closest("[data-open-asset]");
    if (asset) {
      ui.mode = "asset";
      ui.section = "assets";
      ui.selectedId = asset.dataset.openAsset;
      updateHubSelection("assets");
      renderInventory();
      return;
    }

    const action = event.target.closest("[data-inventory-action]")?.dataset.inventoryAction;
    if (!action) return;
    if (action === "new") return openEditor(null);
    if (action === "edit") return openEditor(recordFor());
    if (action === "note") return openNote(recordFor());
    if (action === "link") return openLinks(recordFor());
    if (action === "mobile-back") { shell.dataset.mobileDetail = "false"; return; }
    if (action === "open-actions") {
      document.querySelector('[data-view="actions"]')?.click();
      return;
    }
    if (action === "reset") {
      if (!confirm("Reset Documents and Digital Assets to the original Lab sample?")) return;
      data = seedInventory();
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(data));
      syncCrmDocumentCounts();
      ui.selectedId = typeData()[0]?.id || null;
      renderCounts();
      renderInventory();
      toast("Lab document and asset sample reset.");
    }
  }

  function handleShellInput(event) {
    if (!event.target.matches("[data-inventory-search]")) return;
    ui.query = event.target.value.trim().toLowerCase();
    const previous = ui.selectedId;
    const next = filteredRecords();
    if (!next.some(record => record.id === previous)) ui.selectedId = next[0]?.id || null;
    renderInventory();
    requestAnimationFrame(() => {
      const input = $("[data-inventory-search]", shell);
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    });
  }

  function handleShellChange(event) {
    if (event.target.matches("[data-inventory-filter]")) {
      ui.filter = event.target.value;
      ui.selectedId = filteredRecords()[0]?.id || null;
      renderInventory();
    }
    if (event.target.matches("[data-inventory-sort]")) {
      ui.sort = event.target.value;
      renderInventory();
    }
  }

  function updateHubSelection(section) {
    ui.section = section;
    $$(".lab-records-hub [data-records-section]").forEach(button => button.classList.toggle("is-active", button.dataset.recordsSection === section));
    root.hidden = true;
    shell.hidden = false;
  }

  function openCrmRecord(mode, id) {
    setSection("directory");
    requestAnimationFrame(() => {
      const modeButton = $(`.lab-crm [data-crm-mode="${mode}"]`);
      if (modeButton && !modeButton.classList.contains("is-active")) modeButton.click();
      requestAnimationFrame(() => {
        const recordButton = $(`.lab-crm [data-record-id="${CSS.escape(id)}"]`);
        recordButton?.click();
      });
    });
  }

  function selectOptions(values, selected) {
    return values.map(value => `<option value="${esc(value)}"${value === selected ? " selected" : ""}>${esc(value)}</option>`).join("");
  }

  function peopleOptions(selected = "", multiple = false) {
    if (multiple) return crm.people.map(person => `<label class="inventory-check"><input type="checkbox" name="peopleIds" value="${esc(person.id)}"${selected.includes(person.id) ? " checked" : ""}><span>${esc(person.name)}</span><small>${esc(person.role || person.relationship || "")}</small></label>`).join("");
    return `<option value="">Unassigned</option>${crm.people.map(person => `<option value="${esc(person.id)}"${person.id === selected ? " selected" : ""}>${esc(person.name)}</option>`).join("")}`;
  }

  function orgOptions(selected = "", multiple = false) {
    if (multiple) return crm.organizations.map(org => `<label class="inventory-check"><input type="checkbox" name="organizationIds" value="${esc(org.id)}"${selected.includes(org.id) ? " checked" : ""}><span>${esc(org.name)}</span><small>${esc(org.type || "")}</small></label>`).join("");
    return `<option value="">Unassigned</option>${crm.organizations.map(org => `<option value="${esc(org.id)}"${org.id === selected ? " selected" : ""}>${esc(org.name)}</option>`).join("")}`;
  }

  function openEditor(record) {
    const isDoc = ui.mode === "document";
    const editing = Boolean(record);
    const meta = TYPE_META[ui.mode];
    dialog.innerHTML = `<form method="dialog" class="inventory-dialog-form" data-inventory-form="edit">
      <header><div><p>${editing ? "EDIT" : "CREATE"} · ${meta.label.toUpperCase()}</p><h2>${editing ? esc(isDoc ? record.title : record.name) : `New ${meta.label.toLowerCase()}`}</h2></div><button type="button" data-inventory-close aria-label="Close">×</button></header>
      <input type="hidden" name="id" value="${esc(record?.id || "")}">
      <div class="inventory-form-grid">
        <label class="full"><span>${isDoc ? "Title" : "Asset name"}</span><input name="${isDoc ? "title" : "name"}" required value="${esc(isDoc ? record?.title : record?.name)}" placeholder="${isDoc ? "Emergency instructions" : "Primary domain"}"></label>
        ${isDoc ? `
          <label><span>Category</span><select name="category">${selectOptions(DOCUMENT_CATEGORIES, record?.category || "Instructions")}</select></label>
          <label><span>Status</span><select name="status">${selectOptions(STATUSES.document, record?.status || "Active")}</select></label>
          <label><span>Sensitivity</span><select name="sensitivity">${selectOptions(SENSITIVITIES, record?.sensitivity || "Sensitive")}</select></label>
          <label><span>Review date</span><input type="date" name="reviewAt" value="${esc(record?.reviewAt ? record.reviewAt.slice(0, 10) : "")}"></label>
          <label class="full"><span>Choose local file metadata</span><input type="file" name="file"><small>Lab stores only name, type and size. File bytes are intentionally discarded.</small></label>
          <label><span>Filename</span><input name="fileName" value="${esc(record?.fileName || "")}" placeholder="instructions.pdf"></label>
          <label><span>MIME type</span><input name="mimeType" value="${esc(record?.mimeType || "")}" placeholder="application/pdf"></label>
        ` : `
          <label><span>Type</span><select name="type">${selectOptions(ASSET_TYPES, record?.type || "Domain")}</select></label>
          <label><span>Status</span><select name="status">${selectOptions(STATUSES.asset, record?.status || "Active")}</select></label>
          <label><span>Sensitivity</span><select name="sensitivity">${selectOptions(SENSITIVITIES, record?.sensitivity || "Sensitive")}</select></label>
          <label><span>Environment</span><input name="environment" value="${esc(record?.environment || "")}" placeholder="Production-like"></label>
          <label class="full"><span>Identifier / URL / handle</span><input name="identifier" value="${esc(record?.identifier || "")}" placeholder="example.test or @handle"></label>
          <label><span>Provider</span><input name="provider" value="${esc(record?.provider || "")}" placeholder="Provider"></label>
          <label><span>Secret reference</span><input name="secretRef" value="${esc(record?.secretRef || "")}" placeholder="vault://reference-only"><small>No secrets here. Reference only.</small></label>
          <label><span>Responsible person</span><select name="ownerPersonId">${peopleOptions(record?.ownerPersonId || "")}</select></label>
          <label><span>Organization</span><select name="organizationId">${orgOptions(record?.organizationId || "")}</select></label>
        `}
        <label class="full"><span>Tags</span><input name="tags" value="${esc((record?.tags || []).join(", "))}" placeholder="legal, emergency, priority"></label>
        <label class="full"><span>Notes</span><textarea name="notes" rows="4">${esc(record?.notes || "")}</textarea></label>
      </div>
      <footer><span>LAB · LOCAL MOCK STORAGE</span><div><button type="button" class="inventory-button" data-inventory-close>Cancel</button><button class="inventory-button primary" value="default">Save ${meta.label.toLowerCase()}</button></div></footer>
    </form>`;
    dialog.showModal();

    if (isDoc) {
      const file = $('input[name="file"]', dialog);
      file?.addEventListener("change", () => {
        const selected = file.files?.[0];
        if (!selected) return;
        $('input[name="fileName"]', dialog).value = selected.name;
        $('input[name="mimeType"]', dialog).value = selected.type || "application/octet-stream";
        file.dataset.size = String(selected.size || 0);
      });
    }
  }

  function openNote(record) {
    if (!record) return;
    dialog.innerHTML = `<form method="dialog" class="inventory-dialog-form compact" data-inventory-form="note">
      <header><div><p>ADD NOTE · ${ui.mode.toUpperCase()}</p><h2>${esc(ui.mode === "document" ? record.title : record.name)}</h2></div><button type="button" data-inventory-close aria-label="Close">×</button></header>
      <input type="hidden" name="id" value="${esc(record.id)}">
      <label class="inventory-note-field"><span>Note</span><textarea name="note" rows="6" required placeholder="Add operational context…"></textarea></label>
      <footer><span>Creates a Lab activity event</span><div><button type="button" class="inventory-button" data-inventory-close>Cancel</button><button class="inventory-button primary" value="default">Add note</button></div></footer>
    </form>`;
    dialog.showModal();
  }

  function openLinks(record) {
    if (!record) return;
    const isDoc = ui.mode === "document";
    dialog.innerHTML = `<form method="dialog" class="inventory-dialog-form" data-inventory-form="links">
      <header><div><p>RELATIONSHIPS · ${ui.mode.toUpperCase()}</p><h2>${esc(isDoc ? record.title : record.name)}</h2></div><button type="button" data-inventory-close aria-label="Close">×</button></header>
      <input type="hidden" name="id" value="${esc(record.id)}">
      ${isDoc ? `
        <div class="inventory-link-editor">
          <section><div class="inventory-card-head"><strong>People</strong><small>Select linked people</small></div>${peopleOptions(record.peopleIds || [], true) || `<p>No Lab people available.</p>`}</section>
          <section><div class="inventory-card-head"><strong>Organizations</strong><small>Select linked organizations</small></div>${orgOptions(record.organizationIds || [], true) || `<p>No Lab organizations available.</p>`}</section>
        </div>
      ` : `
        <div class="inventory-form-grid">
          <label><span>Responsible person</span><select name="ownerPersonId">${peopleOptions(record.ownerPersonId || "")}</select></label>
          <label><span>Organization</span><select name="organizationId">${orgOptions(record.organizationId || "")}</select></label>
          <div class="full inventory-check-section"><div class="inventory-card-head"><strong>Documents</strong><small>Select linked documents</small></div>${data.documents.map(doc => `<label class="inventory-check"><input type="checkbox" name="documentIds" value="${esc(doc.id)}"${(record.documentIds || []).includes(doc.id) ? " checked" : ""}><span>${esc(doc.title)}</span><small>${esc(doc.category)}</small></label>`).join("")}</div>
        </div>
      `}
      <footer><span>Relationship changes stay in Lab localStorage</span><div><button type="button" class="inventory-button" data-inventory-close>Cancel</button><button class="inventory-button primary" value="default">Save links</button></div></footer>
    </form>`;
    dialog.showModal();
  }

  function handleDialogSubmit(event) {
    const form = event.target.closest("form[data-inventory-form]");
    if (!form) return;
    event.preventDefault();
    const kind = form.dataset.inventoryForm;
    const fd = new FormData(form);
    const id = fd.get("id");
    const record = typeData().find(item => item.id === id);

    if (kind === "edit") {
      const editing = Boolean(record);
      const target = record || (ui.mode === "document"
        ? { id: slugId("d"), activity: [], peopleIds: [], organizationIds: [] }
        : { id: slugId("a"), activity: [], documentIds: [] });

      if (ui.mode === "document") {
        target.title = String(fd.get("title") || "").trim();
        target.category = String(fd.get("category") || "Instructions");
        target.status = String(fd.get("status") || "Active");
        target.sensitivity = String(fd.get("sensitivity") || "Sensitive");
        target.reviewAt = fd.get("reviewAt") ? new Date(`${fd.get("reviewAt")}T12:00:00`).toISOString() : "";
        target.fileName = String(fd.get("fileName") || "").trim();
        target.mimeType = String(fd.get("mimeType") || "").trim();
        const file = $('input[name="file"]', form);
        if (file?.dataset.size) target.size = Number(file.dataset.size);
      } else {
        target.name = String(fd.get("name") || "").trim();
        target.type = String(fd.get("type") || "Domain");
        target.status = String(fd.get("status") || "Active");
        target.sensitivity = String(fd.get("sensitivity") || "Sensitive");
        target.environment = String(fd.get("environment") || "").trim();
        target.identifier = String(fd.get("identifier") || "").trim();
        target.provider = String(fd.get("provider") || "").trim();
        target.secretRef = String(fd.get("secretRef") || "").trim();
        target.ownerPersonId = String(fd.get("ownerPersonId") || "");
        target.organizationId = String(fd.get("organizationId") || "");
      }
      target.tags = tagsFrom(fd.get("tags"));
      target.notes = String(fd.get("notes") || "").trim();
      target.updatedAt = new Date().toISOString();
      target.activity = target.activity || [];
      target.activity.unshift({
        title: editing ? "Record updated" : "Record created",
        detail: editing ? "Metadata changed in the Lab workspace." : "Created in Lab local mock storage.",
        at: target.updatedAt
      });
      if (!editing) typeData().unshift(target);
      ui.selectedId = target.id;
      saveInventory();
      renderCounts();
      renderInventory();
      dialog.close();
      toast(`${TYPE_META[ui.mode].label} ${editing ? "updated" : "created"} in Lab.`);
      return;
    }

    if (!record) return;

    if (kind === "note") {
      const note = String(fd.get("note") || "").trim();
      if (!note) return;
      record.notes = record.notes ? `${record.notes}\n\n${note}` : note;
      record.updatedAt = new Date().toISOString();
      record.activity = record.activity || [];
      record.activity.unshift({ title: "Note added", detail: note, at: record.updatedAt });
      saveInventory();
      renderInventory();
      dialog.close();
      toast("Note added to Lab record.");
      return;
    }

    if (kind === "links") {
      if (ui.mode === "document") {
        record.peopleIds = fd.getAll("peopleIds").map(String);
        record.organizationIds = fd.getAll("organizationIds").map(String);
      } else {
        record.ownerPersonId = String(fd.get("ownerPersonId") || "");
        record.organizationId = String(fd.get("organizationId") || "");
        record.documentIds = fd.getAll("documentIds").map(String);
      }
      record.updatedAt = new Date().toISOString();
      record.activity = record.activity || [];
      record.activity.unshift({ title: "Relationships updated", detail: "Linked records changed in the Lab graph.", at: record.updatedAt });
      saveInventory();
      renderInventory();
      dialog.close();
      toast("Relationships updated.");
    }
  }

  function ensureRecordView() {
    if ($(".lab-records-hub")) return;
    buildHub();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(ensureRecordView, 0), { once: true });
  } else {
    setTimeout(ensureRecordView, 0);
  }

  new MutationObserver(() => {
    if (!$(".lab-records-hub") && $(".lab-crm")) ensureRecordView();
  }).observe(document.documentElement, { childList: true, subtree: true });
})();