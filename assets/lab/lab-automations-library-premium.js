(() => {
  "use strict";

  const CONTENT_KEY = "cmx-lab-content-assets-v1";
  const FILE_KEY = "cmx-lab-file-assets-v1";
  const META_KEY = "cmx-lab-library-meta-v1";
  const UI_KEY = "cmx-lab-library-ui-v1";

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"
  }[ch]));
  const now = () => new Date().toISOString();
  const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const slug = value => String(value || "untitled").trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "untitled";

  const load = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  function loadContent() {
    const store = load(CONTENT_KEY, {version:1,assets:[],links:{}});
    if (!Array.isArray(store.assets)) store.assets = [];
    if (!store.links || typeof store.links !== "object") store.links = {};
    return store;
  }
  function loadFiles() {
    const store = load(FILE_KEY, {version:1,assets:[]});
    if (!Array.isArray(store.assets)) store.assets = [];
    return store;
  }
  function loadMeta() {
    const store = load(META_KEY, {version:1,folders:[],placements:{},archived:{}});
    if (!Array.isArray(store.folders)) store.folders = [];
    store.placements = store.placements || {};
    store.archived = store.archived || {};
    return store;
  }
  function loadUi() {
    const state = load(UI_KEY, {version:1,view:"list",sort:"updated",scope:"all",favorites:[],recent:[]});
    if (!["list","grid"].includes(state.view)) state.view = "list";
    if (!["updated","name","type"].includes(state.sort)) state.sort = "updated";
    if (!["all","recent","favorites"].includes(state.scope)) state.scope = "all";
    if (!Array.isArray(state.favorites)) state.favorites = [];
    if (!Array.isArray(state.recent)) state.recent = [];
    return state;
  }
  function saveUi(state) { save(UI_KEY, state); }

  function currentFolderId() {
    const buttons = [...document.querySelectorAll(".library-pro-overlay .pro-breadcrumb [data-pro-folder]")];
    return buttons.length ? (buttons.at(-1).dataset.proFolder || null) : null;
  }

  function refForCard(card) {
    const folder = card.querySelector(".pro-main[data-pro-folder]");
    if (folder) return `folder:${folder.dataset.proFolder}`;
    const content = card.querySelector(".pro-main[data-pro-content-open]");
    if (content) return `content:${content.dataset.proContentOpen}`;
    const file = card.querySelector(".pro-main[data-file-quick-view]");
    if (file) return `file:${file.dataset.fileQuickView}`;
    return "";
  }

  function itemForRef(ref) {
    const [type,id] = String(ref || "").split(":");
    if (!id) return null;
    if (type === "content") {
      const item = loadContent().assets.find(asset => asset.id === id);
      return item ? {type,item} : null;
    }
    if (type === "file") {
      const item = loadFiles().assets.find(asset => asset.id === id);
      return item ? {type,item} : null;
    }
    if (type === "folder") {
      const item = loadMeta().folders.find(folder => folder.id === id);
      return item ? {type,item} : null;
    }
    return null;
  }

  function itemName(ref) {
    const found = itemForRef(ref);
    return found?.item?.title || found?.item?.name || found?.item?.fileName || "Library item";
  }

  function itemType(ref) {
    const found = itemForRef(ref);
    if (!found) return "item";
    if (found.type === "folder") return "folder";
    if (found.type === "file") return found.item.kind || found.item.mime || "file";
    return found.item.kind || "content";
  }

  function itemUpdated(ref) {
    const found = itemForRef(ref);
    if (!found) return 0;
    if (found.type === "file") {
      const file = found.item;
      const version = file.versions?.find(v => v.id === file.currentVersionId) || file.versions?.[0];
      return Date.parse(file.updatedAt || version?.createdAt || file.createdAt || 0) || 0;
    }
    return Date.parse(found.item.updatedAt || found.item.createdAt || 0) || 0;
  }

  function relativeTime(timestamp) {
    if (!timestamp) return "";
    const delta = Math.max(0, Date.now() - timestamp);
    const minute = 60_000, hour = 60 * minute, day = 24 * hour;
    if (delta < minute) return "just now";
    if (delta < hour) return `${Math.floor(delta/minute)}m ago`;
    if (delta < day) return `${Math.floor(delta/hour)}h ago`;
    if (delta < day * 7) return `${Math.floor(delta/day)}d ago`;
    return new Date(timestamp).toLocaleDateString(undefined,{month:"short",day:"numeric"});
  }

  function cleanSnippet(value) {
    const node = document.createElement("div");
    node.innerHTML = String(value || "");
    return (node.innerText || node.textContent || "").replace(/\s+/g," ").trim();
  }

  function snippetFor(ref) {
    const found = itemForRef(ref);
    if (!found) return "";
    const item = found.item;
    if (found.type === "folder") {
      const meta = loadMeta();
      const childFolders = meta.folders.filter(folder => (folder.parentId || null) === item.id && !meta.archived[`folder:${folder.id}`]).length;
      const directContent = loadContent().assets.filter(asset => (meta.placements[`content:${asset.id}`] || null) === item.id && !meta.archived[`content:${asset.id}`] && (asset.libraryVisible === true || ["document","markdown","text","template"].includes(asset.kind))).length;
      const directFiles = loadFiles().assets.filter(file => (meta.placements[`file:${file.id}`] || null) === item.id && !meta.archived[`file:${file.id}`]).length;
      const total = childFolders + directContent + directFiles;
      return `${total} item${total===1?"":"s"}${childFolders ? ` · ${childFolders} folder${childFolders===1?"":"s"}` : ""}`;
    }
    if (found.type === "file") {
      const file = item;
      const version = file.versions?.find(v=>v.id===file.currentVersionId) || file.versions?.[0];
      const size = Number(version?.size || 0);
      const human = size >= 1024**2 ? `${(size/1024**2).toFixed(1)} MB` : size >= 1024 ? `${(size/1024).toFixed(1)} KB` : size ? `${size} B` : "Protected file";
      return `${file.mime || file.kind || "File"} · ${human} · v${version?.number || 1}`;
    }
    if (item.kind === "markdown" || item.kind === "text") return String(item.draft?.sourceText || "").replace(/[#*_>`~\[\]()]/g," ").replace(/\s+/g," ").trim().slice(0,130);
    if (item.kind === "template") {
      const subject = item.draft?.subject ? `${item.draft.subject} · ` : "";
      return `${subject}${cleanSnippet(item.draft?.plainText || item.draft?.html).slice(0,120)}`;
    }
    if (["email","message","instruction"].includes(item.kind)) return cleanSnippet(item.draft?.plainText || item.draft?.html).slice(0,130);
    return cleanSnippet(item.draft?.plainText || item.draft?.html).slice(0,130);
  }

  function visualKind(ref) {
    const found = itemForRef(ref);
    if (!found) return {label:"ITEM",className:"generic"};
    const item = found.item;
    if (found.type === "folder") return {label:"DIR",className:"folder"};
    if (found.type === "content") {
      if (item.kind === "markdown") return {label:"MD",className:"markdown"};
      if (item.kind === "text") return {label:"TXT",className:"text"};
      if (item.kind === "document") return {label:"DOC",className:"document"};
      if (item.kind === "template") return {label:item.templateType === "email" ? "MAIL" : item.templateType === "message" ? "MSG" : "TPL",className:"template"};
      if (item.kind === "email") return {label:"MAIL",className:"email"};
      if (item.kind === "message") return {label:"MSG",className:"message"};
      return {label:"DOC",className:"document"};
    }
    const kind = String(item.kind || item.mime || "").toLowerCase();
    if (kind.includes("pdf")) return {label:"PDF",className:"pdf"};
    if (kind.includes("image")) return {label:"IMG",className:"image"};
    if (kind.includes("video")) return {label:"VID",className:"video"};
    if (kind.includes("audio")) return {label:"AUD",className:"audio"};
    if (kind.includes("sheet") || kind.includes("excel") || kind.includes("spread")) return {label:"XLS",className:"sheet"};
    if (kind.includes("word") || kind.includes("docx")) return {label:"DOCX",className:"office"};
    return {label:"FILE",className:"file"};
  }

  function recordRecent(ref) {
    if (!ref || !itemForRef(ref)) return;
    const ui = loadUi();
    ui.recent = [{ref,at:Date.now()}, ...ui.recent.filter(entry => entry?.ref !== ref)].slice(0,24);
    saveUi(ui);
  }

  function toggleFavorite(ref) {
    if (!ref) return;
    const ui = loadUi();
    const has = ui.favorites.includes(ref);
    ui.favorites = has ? ui.favorites.filter(value => value !== ref) : [ref,...ui.favorites];
    saveUi(ui);
    applyPremium();
    showToast(has ? "Removed from Favorites" : "Added to Favorites");
  }

  function setScope(scope) {
    const ui = loadUi();
    ui.scope = scope;
    saveUi(ui);
    applyPremium();
  }

  function setView(view) {
    const ui = loadUi();
    ui.view = view;
    saveUi(ui);
    applyPremium();
  }

  function setSort(sort) {
    const ui = loadUi();
    ui.sort = sort;
    saveUi(ui);
    document.querySelector(".premium-sort-menu")?.remove();
    applyPremium();
  }

  function quickControlsMarkup(ui) {
    const favoriteCount = ui.favorites.filter(ref => itemForRef(ref)).length;
    const sortLabel = {updated:"Updated",name:"Name",type:"Type"}[ui.sort] || "Updated";
    return `<section class="premium-library-controls" data-premium-library-controls>
      <div class="premium-quick-scopes" aria-label="Quick Library views">
        <button type="button" data-premium-scope="all" class="${ui.scope==="all"?"is-active":""}">All</button>
        <button type="button" data-premium-scope="recent" class="${ui.scope==="recent"?"is-active":""}">Recent</button>
        <button type="button" data-premium-scope="favorites" class="${ui.scope==="favorites"?"is-active":""}">Favorites${favoriteCount?` · ${favoriteCount}`:""}</button>
        <button type="button" data-premium-templates>Templates</button>
      </div>
      <div class="premium-display-controls">
        <div class="premium-view-toggle" aria-label="Library layout">
          <button type="button" data-premium-view="list" class="${ui.view==="list"?"is-active":""}" aria-label="List view">☰</button>
          <button type="button" data-premium-view="grid" class="${ui.view==="grid"?"is-active":""}" aria-label="Grid view">▦</button>
        </div>
        <button type="button" class="premium-sort-trigger" data-premium-sort-trigger>Sort · ${sortLabel}</button>
      </div>
    </section>`;
  }

  function decorateCard(card, ui) {
    const ref = refForCard(card);
    if (!ref) return;
    card.dataset.premiumRef = ref;
    const main = card.querySelector(".pro-main");
    const icon = main?.querySelector(".pro-icon");
    const visual = visualKind(ref);
    if (icon) {
      icon.textContent = visual.label;
      icon.classList.add("premium-kind",`premium-${visual.className}`);
    }

    const copy = main?.querySelector("span:nth-child(2)");
    if (copy && !copy.querySelector(".premium-snippet")) {
      const snippet = document.createElement("span");
      snippet.className = "premium-snippet";
      snippet.textContent = snippetFor(ref) || "Private Library item";
      copy.append(snippet);
      const updated = itemUpdated(ref);
      if (updated) {
        const time = document.createElement("em");
        time.className = "premium-updated";
        time.textContent = `Updated ${relativeTime(updated)}`;
        copy.append(time);
      }
    }

    let controls = card.querySelector(".premium-card-controls");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "premium-card-controls";
      controls.innerHTML = `<button type="button" data-premium-favorite="${esc(ref)}" aria-label="Favorite">☆</button><button type="button" data-premium-more="${esc(ref)}" aria-label="More actions">•••</button>`;
      card.append(controls);
    }
    const favorite = controls.querySelector("[data-premium-favorite]");
    const active = ui.favorites.includes(ref);
    if (favorite) {
      favorite.classList.toggle("is-active",active);
      favorite.textContent = active ? "★" : "☆";
      favorite.setAttribute("aria-label",active ? "Remove from Favorites" : "Add to Favorites");
    }
  }

  function cardSort(a,b,ui) {
    const ra = a.dataset.premiumRef || refForCard(a);
    const rb = b.dataset.premiumRef || refForCard(b);
    if (ui.scope !== "recent") {
      const af = ra.startsWith("folder:"), bf = rb.startsWith("folder:");
      if (af !== bf) return af ? -1 : 1;
    }
    if (ui.sort === "name") return itemName(ra).localeCompare(itemName(rb),undefined,{sensitivity:"base"});
    if (ui.sort === "type") {
      const type = itemType(ra).localeCompare(itemType(rb),undefined,{sensitivity:"base"});
      return type || itemName(ra).localeCompare(itemName(rb),undefined,{sensitivity:"base"});
    }
    return itemUpdated(rb) - itemUpdated(ra) || itemName(ra).localeCompare(itemName(rb),undefined,{sensitivity:"base"});
  }

  function applyScopeAndSort(grid, ui) {
    const cards = [...grid.querySelectorAll(":scope > .pro-card")];
    const recentMap = new Map(ui.recent.map((entry,index) => [entry.ref,{index,at:entry.at}]));
    cards.forEach(card => {
      const ref = card.dataset.premiumRef || refForCard(card);
      let visible = true;
      if (ui.scope === "favorites") visible = ui.favorites.includes(ref);
      if (ui.scope === "recent") visible = recentMap.has(ref);
      card.hidden = !visible;
    });

    const visible = cards.filter(card => !card.hidden);
    if (ui.scope === "recent") visible.sort((a,b)=>(recentMap.get(b.dataset.premiumRef)?.at||0)-(recentMap.get(a.dataset.premiumRef)?.at||0));
    else visible.sort((a,b)=>cardSort(a,b,ui));
    visible.forEach(card => grid.append(card));

    let empty = grid.querySelector(".premium-scope-empty");
    if (!visible.length && cards.length) {
      if (!empty) {
        empty = document.createElement("div");
        empty.className = "premium-scope-empty";
        grid.append(empty);
      }
      empty.innerHTML = ui.scope === "favorites"
        ? `<strong>No Favorites yet</strong><span>Tap ☆ on a folder, document, template or file.</span>`
        : `<strong>No recent items here</strong><span>Open something and it will appear in Recent.</span>`;
    } else empty?.remove();
  }

  function applyPremium() {
    const overlay = document.querySelector(".library-pro-overlay");
    if (!overlay) return;
    const ui = loadUi();
    overlay.classList.add("premium-library");
    const app = overlay.querySelector(".library-pro-app");
    const grid = overlay.querySelector(".pro-grid");
    if (!app || !grid) return;

    const heading = overlay.querySelector(".library-pro-topbar em");
    if (heading) heading.textContent = "Your private documents, templates and files.";
    const search = overlay.querySelector("[data-pro-search]");
    if (search) search.placeholder = currentFolderId() ? "Search this folder" : "Search your Library";
    const boundary = overlay.querySelector(".pro-boundary");
    if (boundary) {
      const label = boundary.querySelector("b"), text = boundary.querySelector("span");
      if (label) label.textContent = "Private by design";
      if (text) text.textContent = "Native text stays inside Check In. Binary files will use private object storage when the server-backed Library is enabled.";
    }

    let controls = overlay.querySelector("[data-premium-library-controls]");
    if (!controls) {
      const breadcrumb = overlay.querySelector(".pro-breadcrumb");
      breadcrumb?.insertAdjacentHTML("afterend",quickControlsMarkup(ui));
    } else controls.outerHTML = quickControlsMarkup(ui);

    grid.classList.toggle("premium-list-view",ui.view === "list");
    grid.classList.toggle("premium-grid-view",ui.view === "grid");
    [...grid.querySelectorAll(":scope > .pro-card")].forEach(card => decorateCard(card,ui));
    applyScopeAndSort(grid,ui);
  }

  function schedulePremium() {
    requestAnimationFrame(() => requestAnimationFrame(applyPremium));
  }

  function closeFloating() {
    document.querySelector(".premium-action-sheet")?.remove();
    document.querySelector(".premium-sort-menu")?.remove();
    document.querySelector(".premium-reuse-modal")?.remove();
  }

  function showToast(message) {
    document.querySelector(".premium-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "premium-toast";
    toast.setAttribute("role","status");
    toast.textContent = message;
    document.body.append(toast);
    requestAnimationFrame(()=>toast.classList.add("is-visible"));
    setTimeout(()=>toast.remove(),1600);
  }

  function proxySelectorFor(button) {
    const selectors = [
      "data-pro-rename","data-pro-move","data-pro-duplicate","data-pro-details","data-pro-archive",
      "data-pro-folder-rename","data-pro-folder-move","data-pro-folder-archive","data-file-details"
    ];
    for (const key of selectors) if (button.hasAttribute(key)) return `[${key}="${CSS.escape(button.getAttribute(key) || "")}"]`;
    return "";
  }

  function openActionSheet(ref) {
    closeFloating();
    const card = [...document.querySelectorAll(".library-pro-overlay .pro-card")].find(node => node.dataset.premiumRef === ref);
    if (!card) return;
    const found = itemForRef(ref);
    const ui = loadUi();
    const actions = [...card.querySelectorAll(".pro-actions button")].map(button => {
      const selector = proxySelectorFor(button);
      return selector ? `<button type="button" data-premium-proxy="${esc(selector)}"><span>${esc(button.textContent.trim())}</span></button>` : "";
    }).join("");
    const extra = found?.type === "content"
      ? `<button type="button" data-premium-export="${esc(ref)}"><span>Export / Save as</span><small>PDF, DOCX, Markdown, HTML, text</small></button>`
      : found?.type === "file"
        ? `<button type="button" data-premium-file-version-info><span>Replace with new version</span><small>Backend pending</small></button>`
        : "";
    const sheet = document.createElement("div");
    sheet.className = "premium-action-sheet";
    sheet.innerHTML = `<div class="premium-sheet-card"><div class="premium-sheet-grab"></div><header><small>LIBRARY ITEM</small><strong>${esc(itemName(ref))}</strong></header><div class="premium-sheet-actions"><button type="button" data-premium-favorite="${esc(ref)}"><span>${ui.favorites.includes(ref)?"Remove from Favorites":"Add to Favorites"}</span></button>${actions}${extra}</div><button type="button" class="premium-sheet-cancel" data-premium-sheet-close>Done</button></div>`;
    document.body.append(sheet);
  }

  function openSortMenu() {
    document.querySelector(".premium-sort-menu")?.remove();
    const ui = loadUi();
    const menu = document.createElement("div");
    menu.className = "premium-sort-menu";
    menu.innerHTML = `<div><small>SORT LIBRARY</small><button type="button" data-premium-sort="updated" class="${ui.sort==="updated"?"is-active":""}">Recently updated</button><button type="button" data-premium-sort="name" class="${ui.sort==="name"?"is-active":""}">Name A–Z</button><button type="button" data-premium-sort="type" class="${ui.sort==="type"?"is-active":""}">Type</button></div>`;
    document.body.append(menu);
  }

  function openExportInfo(ref) {
    closeFloating();
    const modal = document.createElement("div");
    modal.className = "premium-reuse-modal";
    modal.innerHTML = `<div><small>DERIVED EXPORTS · BACKEND PENDING</small><h2>Export ${esc(itemName(ref))}</h2><p>The native Check In content stays editable and canonical. A retained export becomes a derived FileVersion linked back to the exact ContentVersion.</p><div class="premium-export-grid"><button type="button" disabled>PDF</button><button type="button" disabled>Word DOCX</button><button type="button" disabled>Markdown</button><button type="button" disabled>HTML</button><button type="button" disabled>Plain text</button></div><button type="button" data-premium-modal-close>Done</button></div>`;
    document.body.append(modal);
  }

  function currentActionAsset() {
    const overlay = document.querySelector(".content-editor-overlay");
    const stepId = overlay?.dataset.contentEditor;
    if (!stepId) return null;
    const content = loadContent();
    const id = content.links?.[stepId];
    const asset = content.assets.find(item => item.id === id);
    return asset ? {content,asset,stepId} : null;
  }

  function enhanceContentReuse() {
    const main = document.querySelector(".content-editor-overlay .content-editor-main");
    if (!main || main.querySelector("[data-premium-reuse-card]")) return;
    const meta = main.querySelector(".content-meta-card");
    if (!meta) return;
    const card = document.createElement("section");
    card.className = "premium-reuse-card";
    card.dataset.premiumReuseCard = "";
    card.innerHTML = `<div><small>REUSE THIS CONTENT</small><strong>Keep it for later</strong><span>Action content stays private to this Automation until you deliberately make it reusable.</span></div><div class="premium-reuse-actions"><button type="button" data-premium-save-library>Save to Library</button><button type="button" data-premium-save-template>Save as Template</button><button type="button" data-premium-save-document>Save as Document</button></div><em data-premium-reuse-status></em>`;
    meta.after(card);
  }

  function placeAtRoot(meta,ref) {
    delete meta.placements[ref];
    meta.archived[ref] = false;
  }

  function saveActionToLibrary(mode) {
    const current = currentActionAsset();
    if (!current) return;
    const {content,asset} = current;
    const meta = loadMeta();
    const timestamp = now();
    if (mode === "library") {
      asset.libraryVisible = true;
      asset.libraryRole = "saved_action_content";
      asset.updatedAt = timestamp;
      placeAtRoot(meta,`content:${asset.id}`);
      save(CONTENT_KEY,content); save(META_KEY,meta);
      setReuseStatus("Saved to Library");
      showToast("Saved to Library");
      return;
    }

    const id = makeId("content");
    const baseTitle = asset.title || (asset.kind === "email" ? "Email" : "Message");
    const draft = JSON.parse(JSON.stringify(asset.draft || {}));
    draft.revision = 1;
    draft.updatedAt = timestamp;
    let clone;
    if (mode === "template") {
      clone = {
        id,kind:"template",templateType:asset.kind === "email" ? "email" : "message",
        title:`${baseTitle} template`,fileName:`${slug(baseTitle)}.template`,libraryVisible:true,
        createdAt:timestamp,updatedAt:timestamp,draft,versions:[],sourceActionContentId:asset.id
      };
      const templatesFolder = meta.folders.find(folder => String(folder.name).trim().toLowerCase() === "templates" && !folder.parentId && !meta.archived[`folder:${folder.id}`]);
      if (templatesFolder) meta.placements[`content:${id}`] = templatesFolder.id;
      else placeAtRoot(meta,`content:${id}`);
    } else {
      clone = {
        id,kind:"document",title:`${baseTitle} document`,libraryVisible:true,
        createdAt:timestamp,updatedAt:timestamp,draft,versions:[],sourceActionContentId:asset.id
      };
      placeAtRoot(meta,`content:${id}`);
    }
    content.assets.unshift(clone);
    save(CONTENT_KEY,content); save(META_KEY,meta);
    setReuseStatus(mode === "template" ? "Template created" : "Document created");
    showToast(mode === "template" ? "Saved as Template" : "Saved as Document");
  }

  function setReuseStatus(text) {
    const node = document.querySelector("[data-premium-reuse-status]");
    if (!node) return;
    node.textContent = text;
    setTimeout(()=>{ if (node.textContent === text) node.textContent = ""; },1800);
  }

  window.addEventListener("click", event => {
    const target = event.target;
    if (target.closest?.("[data-library-open-global],[data-library-open-context],.library-top-button,[data-pro-folder],[data-pro-filter],[data-pro-create-toggle],[data-pro-folder-save],[data-pro-move-target],[data-pro-archive],[data-pro-restore],[data-pro-rename-save],[data-pro-duplicate],[data-content-open]")) schedulePremium();
    const recentTarget = target.closest?.(".pro-main[data-pro-folder],.pro-main[data-pro-content-open],.pro-main[data-file-quick-view]");
    if (recentTarget) {
      const card = recentTarget.closest(".pro-card");
      const ref = card ? refForCard(card) : recentTarget.matches("[data-pro-folder]") ? `folder:${recentTarget.dataset.proFolder}` : recentTarget.matches("[data-pro-content-open]") ? `content:${recentTarget.dataset.proContentOpen}` : `file:${recentTarget.dataset.fileQuickView}`;
      recordRecent(ref);
    }
    if (target.closest?.("[data-content-open]")) requestAnimationFrame(()=>requestAnimationFrame(enhanceContentReuse));
  }, true);

  window.addEventListener("input", event => {
    if (event.target.closest?.("[data-pro-search]")) schedulePremium();
  }, true);

  document.addEventListener("click", event => {
    const favorite = event.target.closest("[data-premium-favorite]");
    if (favorite) { event.preventDefault(); event.stopPropagation(); toggleFavorite(favorite.dataset.premiumFavorite); return; }
    const more = event.target.closest("[data-premium-more]");
    if (more) { event.preventDefault(); event.stopPropagation(); openActionSheet(more.dataset.premiumMore); return; }
    const scope = event.target.closest("[data-premium-scope]");
    if (scope) { setScope(scope.dataset.premiumScope); return; }
    if (event.target.closest("[data-premium-templates]")) {
      const filter = document.querySelector('.library-pro-overlay [data-pro-filter="templates"]');
      filter?.click();
      const ui = loadUi();ui.scope="all";saveUi(ui);schedulePremium();return;
    }
    const view = event.target.closest("[data-premium-view]");
    if (view) { setView(view.dataset.premiumView); return; }
    if (event.target.closest("[data-premium-sort-trigger]")) { openSortMenu(); return; }
    const sort = event.target.closest("[data-premium-sort]");
    if (sort) { setSort(sort.dataset.premiumSort); return; }
    if (event.target.closest("[data-premium-sheet-close],[data-premium-modal-close]")) { closeFloating(); return; }
    const proxy = event.target.closest("[data-premium-proxy]");
    if (proxy) {
      const selector = proxy.dataset.premiumProxy;
      const sheet = proxy.closest(".premium-action-sheet");
      const ref = sheet?.querySelector("[data-premium-favorite]")?.dataset.premiumFavorite;
      const card = ref ? [...document.querySelectorAll(".library-pro-overlay .pro-card")].find(node=>node.dataset.premiumRef===ref) : null;
      const original = card?.querySelector(selector);
      closeFloating();
      original?.click();
      return;
    }
    const exportButton = event.target.closest("[data-premium-export]");
    if (exportButton) { openExportInfo(exportButton.dataset.premiumExport); return; }
    if (event.target.closest("[data-premium-file-version-info]")) { showToast("Real replacement starts when private object storage is connected"); return; }
    if (event.target.closest("[data-premium-save-library]")) { saveActionToLibrary("library"); return; }
    if (event.target.closest("[data-premium-save-template]")) { saveActionToLibrary("template"); return; }
    if (event.target.closest("[data-premium-save-document]")) { saveActionToLibrary("document"); return; }
    if (!event.target.closest(".premium-sort-menu,.premium-action-sheet,.premium-reuse-modal")) document.querySelector(".premium-sort-menu")?.remove();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && (document.querySelector(".premium-action-sheet") || document.querySelector(".premium-sort-menu") || document.querySelector(".premium-reuse-modal"))) {
      closeFloating();
    }
  });

  window.addEventListener("pageshow",()=>{
    schedulePremium();
    requestAnimationFrame(()=>requestAnimationFrame(enhanceContentReuse));
  });

  schedulePremium();
  requestAnimationFrame(()=>requestAnimationFrame(enhanceContentReuse));
})();