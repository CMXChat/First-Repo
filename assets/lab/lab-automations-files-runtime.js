(() => {
  "use strict";

  const FILE_STORE_KEY = "cmx-lab-file-assets-v1";
  const CONTENT_STORE_KEY = "cmx-lab-content-assets-v1";

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"
  }[ch]));

  const now = () => new Date().toISOString();
  let managerState = {contentAssetId:null, stepId:null, tab:"attached", query:"", detailId:null, viewerId:null};

  function seedStore() {
    return {
      version: 1,
      assets: [
        {
          id: "file-emergency-instructions",
          name: "Emergency Instructions.pdf",
          kind: "pdf",
          mime: "application/pdf",
          status: "ready",
          currentVersionId: "fv-emergency-v2",
          createdAt: "2026-08-10T15:20:00Z",
          versions: [
            {id:"fv-emergency-v2",number:2,size:2480192,createdAt:"2026-08-16T20:11:00Z",checksum:"sha256:7c91…b230",note:"Updated phone tree and access steps"},
            {id:"fv-emergency-v1",number:1,size:2217344,createdAt:"2026-08-10T15:20:00Z",checksum:"sha256:144a…90de",note:"Initial protected upload"}
          ]
        },
        {
          id: "file-family-photo",
          name: "Family Photo.jpg",
          kind: "image",
          mime: "image/jpeg",
          status: "ready",
          currentVersionId: "fv-photo-v1",
          createdAt: "2026-08-12T18:05:00Z",
          versions: [{id:"fv-photo-v1",number:1,size:1834401,createdAt:"2026-08-12T18:05:00Z",checksum:"sha256:91bb…0a12",note:"Original protected image"}]
        },
        {
          id: "file-continuity-video",
          name: "Continuity Message.mp4",
          kind: "video",
          mime: "video/mp4",
          status: "ready",
          currentVersionId: "fv-video-v1",
          createdAt: "2026-08-13T22:32:00Z",
          versions: [{id:"fv-video-v1",number:1,size:28501760,createdAt:"2026-08-13T22:32:00Z",checksum:"sha256:faae…8871",note:"Private continuity video"}]
        },
        {
          id: "file-account-list",
          name: "Account Inventory.xlsx",
          kind: "spreadsheet",
          mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          status: "ready",
          currentVersionId: "fv-sheet-v3",
          createdAt: "2026-08-08T12:00:00Z",
          versions: [
            {id:"fv-sheet-v3",number:3,size:184921,createdAt:"2026-08-17T12:45:00Z",checksum:"sha256:029e…9911",note:"Added recovery ownership columns"},
            {id:"fv-sheet-v2",number:2,size:169500,createdAt:"2026-08-14T09:20:00Z",checksum:"sha256:fe21…03a8",note:"Updated providers"},
            {id:"fv-sheet-v1",number:1,size:152112,createdAt:"2026-08-08T12:00:00Z",checksum:"sha256:2a8c…72ba",note:"Initial inventory"}
          ]
        },
        {
          id: "file-voice-note",
          name: "Voice Note.m4a",
          kind: "audio",
          mime: "audio/mp4",
          status: "ready",
          currentVersionId: "fv-audio-v1",
          createdAt: "2026-08-14T07:12:00Z",
          versions: [{id:"fv-audio-v1",number:1,size:3928440,createdAt:"2026-08-14T07:12:00Z",checksum:"sha256:bb17…ad23",note:"Private audio message"}]
        },
        {
          id: "file-continuity-notes",
          name: "Continuity Notes.md",
          kind: "text",
          mime: "text/markdown",
          status: "ready",
          currentVersionId: "fv-notes-v2",
          createdAt: "2026-08-09T16:40:00Z",
          versions: [
            {id:"fv-notes-v2",number:2,size:19320,createdAt:"2026-08-17T15:33:00Z",checksum:"sha256:4410…c19d",note:"Expanded recovery notes"},
            {id:"fv-notes-v1",number:1,size:14880,createdAt:"2026-08-09T16:40:00Z",checksum:"sha256:9ca0…12d1",note:"Initial notes"}
          ]
        }
      ]
    };
  }

  function loadFiles() {
    try {
      const parsed = JSON.parse(localStorage.getItem(FILE_STORE_KEY));
      if (parsed?.version === 1 && Array.isArray(parsed.assets)) return parsed;
    } catch {}
    const seeded = seedStore();
    localStorage.setItem(FILE_STORE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  function loadContent() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CONTENT_STORE_KEY));
      if (parsed?.version === 1 && Array.isArray(parsed.assets)) return parsed;
    } catch {}
    return {version:1,assets:[],links:{}};
  }

  function saveContent(store) {
    localStorage.setItem(CONTENT_STORE_KEY, JSON.stringify(store));
  }

  function formatSize(bytes) {
    const size = Number(bytes) || 0;
    if (size < 1024) return `${size} B`;
    if (size < 1024 ** 2) return `${(size/1024).toFixed(1)} KB`;
    if (size < 1024 ** 3) return `${(size/1024**2).toFixed(1)} MB`;
    return `${(size/1024**3).toFixed(1)} GB`;
  }

  function iconFor(kind) {
    return {pdf:"PDF",image:"IMG",video:"VID",audio:"AUD",spreadsheet:"XLS",text:"TXT"}[kind] || "FILE";
  }

  function currentVersion(asset) {
    return asset?.versions?.find(version => version.id === asset.currentVersionId) || asset?.versions?.[0] || null;
  }

  function contentAsset() {
    const store = loadContent();
    return store.assets.find(asset => asset.id === managerState.contentAssetId) || null;
  }

  function attachmentRefs(asset) {
    return Array.isArray(asset?.draft?.attachments) ? asset.draft.attachments : [];
  }

  function usageFor(fileAssetId, fileVersionId = null) {
    const content = loadContent();
    const uses = [];
    content.assets.forEach(asset => {
      attachmentRefs(asset).forEach(ref => {
        if (ref.fileAssetId !== fileAssetId) return;
        if (fileVersionId && ref.fileVersionId !== fileVersionId) return;
        uses.push({contentId:asset.id,title:asset.title || "Private content",kind:asset.kind || "content",fileVersionId:ref.fileVersionId});
      });
    });
    return uses;
  }

  function attachVersion(fileAssetId, fileVersionId) {
    const store = loadContent();
    const asset = store.assets.find(item => item.id === managerState.contentAssetId);
    if (!asset) return;
    asset.draft = {...(asset.draft || {})};
    const refs = attachmentRefs(asset).filter(ref => ref.fileAssetId !== fileAssetId);
    refs.push({fileAssetId,fileVersionId,attachedAt:now()});
    asset.draft.attachments = refs;
    asset.draft.updatedAt = now();
    asset.updatedAt = now();
    saveContent(store);
  }

  function detach(fileAssetId) {
    const store = loadContent();
    const asset = store.assets.find(item => item.id === managerState.contentAssetId);
    if (!asset) return;
    asset.draft = {...(asset.draft || {})};
    asset.draft.attachments = attachmentRefs(asset).filter(ref => ref.fileAssetId !== fileAssetId);
    asset.draft.updatedAt = now();
    asset.updatedAt = now();
    saveContent(store);
  }

  function attachedMap() {
    return new Map(attachmentRefs(contentAsset()).map(ref => [ref.fileAssetId, ref]));
  }

  function enhanceAttachmentCard() {
    const card = document.querySelector(".content-editor-overlay .content-attachments-card");
    if (!card) return;
    const stepId = document.querySelector(".content-editor-overlay")?.dataset.contentEditor;
    if (!stepId) return;
    const content = loadContent();
    const contentAssetId = content.links?.[stepId];
    if (!contentAssetId) return;

    const button = card.querySelector("button");
    if (button) {
      button.disabled = false;
      button.textContent = "Manage files";
      button.dataset.fileManagerOpen = "";
    }

    let list = card.querySelector("[data-attached-file-summary]");
    if (!list) {
      list = document.createElement("div");
      list.className = "attached-file-summary";
      list.dataset.attachedFileSummary = "";
      card.append(list);
    }

    const asset = content.assets.find(item => item.id === contentAssetId);
    const files = loadFiles();
    const refs = attachmentRefs(asset);
    list.innerHTML = refs.length ? refs.map(ref => {
      const file = files.assets.find(item => item.id === ref.fileAssetId);
      const version = file?.versions?.find(item => item.id === ref.fileVersionId);
      if (!file || !version) return "";
      return `<button type="button" class="attached-mini" data-file-quick-view="${esc(file.id)}">
        <span class="file-kind">${iconFor(file.kind)}</span>
        <span><strong>${esc(file.name)}</strong><small>v${version.number} · ${formatSize(version.size)}</small></span>
        <b>View</b>
      </button>`;
    }).join("") : `<div class="attached-empty"><strong>No files attached yet</strong><span>Files you attach will be pinned to an exact version.</span></div>`;
  }

  function fileCard(file, ref) {
    const version = currentVersion(file);
    const pinned = ref ? file.versions.find(item => item.id === ref.fileVersionId) : null;
    const isOld = Boolean(ref && pinned && pinned.id !== file.currentVersionId);
    return `<article class="file-library-card">
      <button type="button" class="file-card-main" data-file-view="${esc(file.id)}">
        <span class="file-kind file-kind-${esc(file.kind)}">${iconFor(file.kind)}</span>
        <span class="file-card-copy"><strong>${esc(file.name)}</strong><small>${esc(file.mime)} · ${formatSize(version?.size)}</small></span>
        <span class="file-version-chip">v${version?.number || 1}</span>
      </button>
      <div class="file-card-actions">
        ${ref ? `<span class="attached-state">Attached v${pinned?.number || "?"}${isOld ? " · newer version available" : ""}</span>` : `<span class="available-state">Available</span>`}
        <button type="button" data-file-details="${esc(file.id)}">Details</button>
        ${ref ? `<button type="button" data-file-detach="${esc(file.id)}">Remove</button>${isOld ? `<button type="button" class="accent" data-file-update="${esc(file.id)}">Update to v${version.number}</button>` : ""}` : `<button type="button" class="accent" data-file-attach="${esc(file.id)}">Attach v${version?.number || 1}</button>`}
      </div>
    </article>`;
  }

  function managerMarkup() {
    const files = loadFiles();
    const refs = attachedMap();
    const query = managerState.query.trim().toLowerCase();
    let visible = managerState.tab === "attached" ? files.assets.filter(file => refs.has(file.id)) : files.assets;
    if (query) visible = visible.filter(file => `${file.name} ${file.mime} ${file.kind}`.toLowerCase().includes(query));

    return `<div class="file-manager-overlay" role="dialog" aria-modal="true" aria-label="Protected file manager">
      <div class="file-manager-app">
        <header class="file-manager-topbar">
          <div>
            <button type="button" class="file-back" data-file-manager-close aria-label="Close file manager">←</button>
            <span><small>PROTECTED FILES · LAB</small><strong>Files & attachments</strong><em>Exact file versions are pinned to this content draft.</em></span>
          </div>
          <button type="button" class="file-upload" data-file-upload-info>＋ Upload new</button>
        </header>
        <main class="file-manager-main">
          <section class="file-manager-intro">
            <div><strong>Private library</strong><p>Choose an existing protected file or inspect versions before attaching it.</p></div>
            <div class="file-security-pill">NO PROVIDER DRAFTS</div>
          </section>
          <div class="file-manager-controls">
            <nav class="file-tabs">
              <button type="button" data-file-tab="attached" class="${managerState.tab === "attached" ? "is-active" : ""}">Attached · ${refs.size}</button>
              <button type="button" data-file-tab="library" class="${managerState.tab === "library" ? "is-active" : ""}">File library · ${files.assets.length}</button>
            </nav>
            <label class="file-search"><span>⌕</span><input type="search" value="${esc(managerState.query)}" placeholder="Search protected files" data-file-search /></label>
          </div>
          <section class="file-list">
            ${visible.length ? visible.map(file => fileCard(file, refs.get(file.id))).join("") : `<div class="file-empty"><strong>${managerState.tab === "attached" ? "No files attached" : "No matching files"}</strong><span>${managerState.tab === "attached" ? "Open File library to attach an exact version." : "Try another search."}</span></div>`}
          </section>
          <section class="file-lab-warning">
            <b>Lab boundary</b>
            <span>This prototype stores file metadata and attachment references only. It does not upload or persist the actual file bytes. Production will use private object storage.</span>
          </section>
        </main>
      </div>
    </div>`;
  }

  function openManager() {
    const overlay = document.querySelector(".content-editor-overlay");
    const stepId = overlay?.dataset.contentEditor;
    if (!stepId) return;
    const content = loadContent();
    const contentAssetId = content.links?.[stepId];
    if (!contentAssetId) return;
    managerState = {contentAssetId,stepId,tab:"attached",query:"",detailId:null,viewerId:null};
    document.querySelector(".file-manager-overlay")?.remove();
    document.body.insertAdjacentHTML("beforeend", managerMarkup());
    document.body.classList.add("file-manager-open");
  }

  function rerenderManager() {
    const old = document.querySelector(".file-manager-overlay");
    if (!old) return;
    old.outerHTML = managerMarkup();
  }

  function closeManager() {
    document.querySelector(".file-manager-overlay")?.remove();
    document.querySelector(".file-viewer-overlay")?.remove();
    document.querySelector(".file-details-overlay")?.remove();
    document.body.classList.remove("file-manager-open");
    enhanceAttachmentCard();
  }

  function previewBody(file) {
    if (file.kind === "image") return `<div class="viewer-image-mock"><span>PRIVATE IMAGE PREVIEW</span><strong>${esc(file.name)}</strong><small>Actual image bytes are not stored in Lab.</small></div>`;
    if (file.kind === "video") return `<div class="viewer-video-mock"><div class="mock-play">▶</div><strong>${esc(file.name)}</strong><div class="mock-track"><i></i></div><small>00:00 / 02:14 · preview shell</small></div>`;
    if (file.kind === "audio") return `<div class="viewer-audio-mock"><strong>${esc(file.name)}</strong><div class="mock-wave">${Array.from({length:32},(_,i)=>`<i style="height:${18 + (i%7)*7}px"></i>`).join("")}</div><button type="button" disabled>▶ Audio preview · backend pending</button></div>`;
    if (file.kind === "pdf") return `<div class="viewer-pdf-mock"><aside><span>1</span><span>2</span><span>3</span></aside><article><small>PROTECTED PDF · PREVIEW SHELL</small><h2>Emergency Instructions</h2><p>This is where the private PDF viewer will render server-authorized file bytes.</p><hr><p>Production access will be short-lived, authenticated and version-specific.</p></article></div>`;
    if (file.kind === "spreadsheet") return `<div class="viewer-sheet-mock"><div class="sheet-row head"><span>Account</span><span>Owner</span><span>Status</span></div><div class="sheet-row"><span>Primary</span><span>Protected</span><span>Ready</span></div><div class="sheet-row"><span>Recovery</span><span>Protected</span><span>Review</span></div><small>Derived safe preview only. Macros/formulas are never executed in the viewer.</small></div>`;
    return `<div class="viewer-text-mock"><small>PROTECTED TEXT PREVIEW</small><h2>${esc(file.name)}</h2><p># Continuity notes</p><p>Private file content will be rendered here through an authorized version-specific viewer.</p><p>Viewer access never requires making the object public.</p></div>`;
  }

  function openViewer(fileId) {
    const file = loadFiles().assets.find(item => item.id === fileId);
    if (!file) return;
    const version = currentVersion(file);
    document.querySelector(".file-viewer-overlay")?.remove();
    document.body.insertAdjacentHTML("beforeend", `<div class="file-viewer-overlay" role="dialog" aria-modal="true" aria-label="Protected file viewer">
      <div class="file-viewer-app">
        <header><button type="button" data-file-viewer-close>←</button><span><small>VIEWER · LAB PREVIEW</small><strong>${esc(file.name)}</strong><em>v${version?.number || 1} · ${formatSize(version?.size)}</em></span><button type="button" data-file-details="${esc(file.id)}">Details</button></header>
        <main>${previewBody(file)}</main>
        <footer><span>Production viewer: authenticated · version-specific · short-lived access</span><button type="button" disabled>Download · backend pending</button></footer>
      </div>
    </div>`);
  }

  function openDetails(fileId) {
    const file = loadFiles().assets.find(item => item.id === fileId);
    if (!file) return;
    const version = currentVersion(file);
    const uses = usageFor(file.id);
    document.querySelector(".file-details-overlay")?.remove();
    document.body.insertAdjacentHTML("beforeend", `<div class="file-details-overlay" role="dialog" aria-modal="true" aria-label="File details">
      <div class="file-details-app">
        <header><button type="button" data-file-details-close>←</button><span><small>FILE ASSET</small><strong>${esc(file.name)}</strong><em>${esc(file.mime)}</em></span><button type="button" data-file-view="${esc(file.id)}">Preview</button></header>
        <main>
          <section class="file-detail-grid">
            <div><small>CURRENT VERSION</small><strong>v${version?.number || 1}</strong></div>
            <div><small>SIZE</small><strong>${formatSize(version?.size)}</strong></div>
            <div><small>STATUS</small><strong>${esc(file.status.toUpperCase())}</strong></div>
            <div><small>USED BY</small><strong>${uses.length} content draft${uses.length === 1 ? "" : "s"}</strong></div>
          </section>
          <section class="used-by-panel"><small>USED BY</small>${uses.length ? uses.map(use => `<div><strong>${esc(use.title)}</strong><span>${esc(use.kind)} · pinned ${esc(use.fileVersionId)}</span></div>`).join("") : `<p>No current Lab content draft references this file.</p>`}</section>
          <section class="versions-panel"><div class="versions-title"><span><small>VERSION HISTORY</small><strong>${file.versions.length} immutable version${file.versions.length===1?"":"s"}</strong></span><button type="button" disabled>Replace / new version · backend pending</button></div>${file.versions.map(item => `<article class="version-row ${item.id===file.currentVersionId?"is-current":""}"><b>v${item.number}</b><span><strong>${formatSize(item.size)}</strong><small>${esc(item.note || "Protected version")}</small></span><em>${item.id===file.currentVersionId?"CURRENT":"IMMUTABLE"}</em></article>`).join("")}</section>
          <section class="file-detail-note"><b>Deletion rule</b><span>Production will archive file assets first. A FileVersion referenced by published Automations or historical Runs cannot simply disappear.</span></section>
        </main>
      </div>
    </div>`);
  }

  function showUploadInfo() {
    document.querySelector(".file-upload-info")?.remove();
    document.body.insertAdjacentHTML("beforeend", `<div class="file-upload-info" role="dialog" aria-modal="true"><div><small>UPLOAD NEW FILE</small><h2>Backend storage comes next</h2><p>The production flow will upload directly to private object storage through a short-lived server-authorized upload intent, then finalize metadata/checksum/scan state in PostgreSQL.</p><ol><li>Choose file</li><li>Private upload</li><li>Validate type + size + checksum</li><li>Malware scan / quarantine check</li><li>Create immutable FileVersion</li><li>Make it available to protected viewers and Actions</li></ol><p class="warning">Lab deliberately does not pretend browser localStorage is durable file storage.</p><button type="button" data-file-upload-close>Got it</button></div></div>`);
  }

  document.addEventListener("click", event => {
    if (event.target.closest("[data-content-open]")) requestAnimationFrame(() => requestAnimationFrame(enhanceAttachmentCard));

    if (event.target.closest("[data-file-manager-open]")) { event.preventDefault(); openManager(); return; }
    if (event.target.closest("[data-file-manager-close]")) { closeManager(); return; }
    if (event.target.closest("[data-file-upload-info]")) { showUploadInfo(); return; }
    if (event.target.closest("[data-file-upload-close]")) { document.querySelector(".file-upload-info")?.remove(); return; }

    const tab = event.target.closest("[data-file-tab]");
    if (tab) { managerState.tab = tab.dataset.fileTab; managerState.query = ""; rerenderManager(); return; }

    const attach = event.target.closest("[data-file-attach]");
    if (attach) { const file = loadFiles().assets.find(item => item.id === attach.dataset.fileAttach); const version = currentVersion(file); if (file && version) attachVersion(file.id, version.id); rerenderManager(); return; }

    const update = event.target.closest("[data-file-update]");
    if (update) { const file = loadFiles().assets.find(item => item.id === update.dataset.fileUpdate); const version = currentVersion(file); if (file && version) attachVersion(file.id, version.id); rerenderManager(); return; }

    const detachButton = event.target.closest("[data-file-detach]");
    if (detachButton) { detach(detachButton.dataset.fileDetach); rerenderManager(); return; }

    const view = event.target.closest("[data-file-view], [data-file-quick-view]");
    if (view) { openViewer(view.dataset.fileView || view.dataset.fileQuickView); return; }

    const details = event.target.closest("[data-file-details]");
    if (details) { openDetails(details.dataset.fileDetails); return; }
    if (event.target.closest("[data-file-viewer-close]")) { document.querySelector(".file-viewer-overlay")?.remove(); return; }
    if (event.target.closest("[data-file-details-close]")) { document.querySelector(".file-details-overlay")?.remove(); return; }
  }, true);

  document.addEventListener("input", event => {
    const search = event.target.closest("[data-file-search]");
    if (!search) return;
    managerState.query = search.value;
    const caret = search.selectionStart;
    rerenderManager();
    const next = document.querySelector("[data-file-search]");
    if (next) { next.focus(); next.setSelectionRange(caret, caret); }
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (document.querySelector(".file-upload-info")) { document.querySelector(".file-upload-info")?.remove(); return; }
    if (document.querySelector(".file-details-overlay")) { document.querySelector(".file-details-overlay")?.remove(); return; }
    if (document.querySelector(".file-viewer-overlay")) { document.querySelector(".file-viewer-overlay")?.remove(); return; }
    if (document.querySelector(".file-manager-overlay")) closeManager();
  }, true);

  window.addEventListener("pageshow", () => requestAnimationFrame(enhanceAttachmentCard));
})();