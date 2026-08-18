(() => {
  "use strict";

  const CONTENT_KEY = "cmx-lab-content-assets-v1";
  const FILE_KEY = "cmx-lab-file-assets-v1";
  const META_KEY = "cmx-lab-library-meta-v1";
  const INTERNAL_FOLDER = "__automation_internal__";
  const LIBRARY_KINDS = new Set(["document", "markdown", "text", "template"]);
  const INTERNAL_KINDS = new Set(["email", "message", "instruction"]);

  const load = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const norm = value => String(value || "").trim().toLocaleLowerCase();

  function dedupeContent(content) {
    if (!Array.isArray(content.assets)) content.assets = [];
    const seen = new Map();
    const clean = [];
    for (const asset of content.assets) {
      if (!asset?.id) continue;
      const existing = seen.get(asset.id);
      if (!existing) {
        seen.set(asset.id, asset);
        clean.push(asset);
        continue;
      }
      const versions = [...(existing.versions || []), ...(asset.versions || [])];
      const versionMap = new Map();
      versions.forEach(version => version?.id && !versionMap.has(version.id) && versionMap.set(version.id, version));
      existing.versions = [...versionMap.values()];
      if (!existing.draft && asset.draft) existing.draft = asset.draft;
    }
    content.assets = clean;
    return content;
  }

  function dedupeFiles(files, content, meta) {
    if (!Array.isArray(files.assets)) files.assets = [];
    const byId = new Map();
    const byVersion = new Map();
    const clean = [];
    const remap = new Map();

    for (const file of files.assets) {
      if (!file?.id) continue;
      const signature = file.currentVersionId ? `v:${file.currentVersionId}` : "";
      let canonical = byId.get(file.id) || (signature ? byVersion.get(signature) : null);
      if (!canonical) {
        canonical = file;
        byId.set(file.id, canonical);
        if (signature) byVersion.set(signature, canonical);
        clean.push(canonical);
        continue;
      }
      if (canonical.id !== file.id) remap.set(file.id, canonical.id);
      const versions = [...(canonical.versions || []), ...(file.versions || [])];
      const versionMap = new Map();
      versions.forEach(version => version?.id && !versionMap.has(version.id) && versionMap.set(version.id, version));
      canonical.versions = [...versionMap.values()];
    }

    if (remap.size) {
      for (const asset of content.assets || []) {
        const refs = Array.isArray(asset?.draft?.attachments) ? asset.draft.attachments : [];
        const seenRefs = new Set();
        asset.draft = asset.draft || {};
        asset.draft.attachments = refs.map(ref => ({
          ...ref,
          fileAssetId: remap.get(ref.fileAssetId) || ref.fileAssetId
        })).filter(ref => {
          const key = `${ref.fileAssetId}:${ref.fileVersionId || ""}`;
          if (seenRefs.has(key)) return false;
          seenRefs.add(key);
          return true;
        });
      }
      meta.placements = meta.placements || {};
      meta.archived = meta.archived || {};
      for (const [oldId, newId] of remap) {
        const oldRef = `file:${oldId}`;
        const newRef = `file:${newId}`;
        if (!(newRef in meta.placements) && oldRef in meta.placements) meta.placements[newRef] = meta.placements[oldRef];
        if (!(newRef in meta.archived) && oldRef in meta.archived) meta.archived[newRef] = meta.archived[oldRef];
        delete meta.placements[oldRef];
        delete meta.archived[oldRef];
      }
    }

    files.assets = clean;
    return files;
  }

  function dedupeFolders(meta) {
    if (!Array.isArray(meta.folders)) meta.folders = [];
    meta.placements = meta.placements || {};
    meta.archived = meta.archived || {};
    const canonicalByKey = new Map();
    const remap = new Map();
    const clean = [];

    for (const folder of meta.folders) {
      if (!folder?.id) continue;
      const key = `${folder.parentId || "root"}:${norm(folder.name)}`;
      const existing = canonicalByKey.get(key);
      if (!existing) {
        canonicalByKey.set(key, folder);
        clean.push(folder);
      } else {
        remap.set(folder.id, existing.id);
      }
    }

    if (remap.size) {
      const resolve = id => {
        let current = id;
        const guard = new Set();
        while (remap.has(current) && !guard.has(current)) { guard.add(current); current = remap.get(current); }
        return current;
      };
      clean.forEach(folder => { if (folder.parentId && remap.has(folder.parentId)) folder.parentId = resolve(folder.parentId); });
      Object.keys(meta.placements).forEach(ref => {
        const folderId = meta.placements[ref];
        if (folderId && remap.has(folderId)) meta.placements[ref] = resolve(folderId);
      });
      for (const [oldId] of remap) delete meta.archived[`folder:${oldId}`];
    }

    meta.folders = clean;
    return meta;
  }

  function hideActionScopedContent(content, meta) {
    meta.placements = meta.placements || {};
    for (const asset of content.assets || []) {
      if (INTERNAL_KINDS.has(asset.kind) && asset.libraryVisible !== true) {
        meta.placements[`content:${asset.id}`] = INTERNAL_FOLDER;
      }
    }
  }

  function normalizeStores() {
    const content = dedupeContent(load(CONTENT_KEY, {version:1, assets:[], links:{}}));
    const meta = dedupeFolders(load(META_KEY, {version:1, folders:[], placements:{}, archived:{}}));
    const files = dedupeFiles(load(FILE_KEY, {version:1, assets:[]}), content, meta);
    hideActionScopedContent(content, meta);
    save(CONTENT_KEY, content);
    save(FILE_KEY, files);
    save(META_KEY, meta);
  }

  function currentFolderId() {
    const buttons = [...document.querySelectorAll(".library-pro-overlay .pro-breadcrumb [data-pro-folder]")];
    return buttons.length ? (buttons.at(-1).dataset.proFolder || null) : null;
  }

  function showFolderError(message) {
    const field = document.querySelector(".pro-modal [data-pro-folder-name]")?.closest(".pro-field");
    if (!field) return;
    field.querySelector(".pro-field-error")?.remove();
    const node = document.createElement("span");
    node.className = "pro-field-error";
    node.textContent = message;
    field.append(node);
  }

  function duplicateFolderName(name, parentId) {
    const meta = load(META_KEY, {folders:[]});
    return (meta.folders || []).some(folder =>
      !meta.archived?.[`folder:${folder.id}`] &&
      (folder.parentId || null) === (parentId || null) &&
      norm(folder.name) === norm(name)
    );
  }

  function updatePresentation() {
    const overlay = document.querySelector(".library-pro-overlay");
    if (!overlay) return;

    const content = load(CONTENT_KEY, {assets:[]});
    const files = load(FILE_KEY, {assets:[]});
    const meta = load(META_KEY, {folders:[], archived:{}});
    const visibleNative = (content.assets || []).filter(asset => ["document","markdown","text"].includes(asset.kind) && !meta.archived?.[`content:${asset.id}`]).length;
    const activeFiles = (files.assets || []).filter(file => !meta.archived?.[`file:${file.id}`]).length;
    const templates = (content.assets || []).filter(asset => asset.kind === "template" && !meta.archived?.[`content:${asset.id}`]).length;
    const activeFolders = (meta.folders || []).filter(folder => !meta.archived?.[`folder:${folder.id}`]).length;
    const stats = [...overlay.querySelectorAll(".pro-stats > div")];
    const values = [[visibleNative,"Documents"],[activeFiles,"Files"],[templates,"Templates"],[activeFolders,"Folders"]];
    stats.forEach((box,index) => {
      if (!values[index]) return;
      const strong = box.querySelector("strong");
      const label = box.querySelector("span");
      if (strong) strong.textContent = String(values[index][0]);
      if (label) label.textContent = values[index][1];
    });

    const nested = Boolean(currentFolderId());
    overlay.classList.toggle("is-nested", nested);

    overlay.querySelectorAll("[data-pro-content-open]").forEach(button => {
      const asset = (content.assets || []).find(item => item.id === button.dataset.proContentOpen);
      if (asset && !LIBRARY_KINDS.has(asset.kind) && asset.libraryVisible !== true) button.closest(".pro-card")?.remove();
    });

    const create = overlay.querySelector(".pro-create-menu");
    if (create && !create.querySelector("[data-pro-create-close]")) {
      const close = document.createElement("button");
      close.type = "button";
      close.className = "pro-create-close";
      close.dataset.proCreateClose = "";
      close.textContent = "Done";
      create.prepend(close);
    }
  }

  function schedulePresentation() {
    requestAnimationFrame(() => requestAnimationFrame(updatePresentation));
  }

  document.addEventListener("click", event => {
    const saveFolder = event.target.closest("[data-pro-folder-save]");
    if (saveFolder) {
      const input = document.querySelector(".pro-modal [data-pro-folder-name]");
      const name = input?.value.trim() || "";
      if (name && duplicateFolderName(name, currentFolderId())) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showFolderError("A folder with this name already exists here.");
        input?.focus();
        return;
      }
    }

    const createClose = event.target.closest("[data-pro-create-close]");
    if (createClose) {
      event.preventDefault();
      event.stopImmediatePropagation();
      document.querySelector("[data-pro-create-toggle]")?.click();
      return;
    }

    if (event.target.closest("[data-library-open-global],[data-library-open-context],[data-pro-create-toggle],[data-pro-folder],[data-pro-filter],[data-pro-folder-save],[data-pro-move-target],[data-pro-archive],[data-pro-restore]")) {
      normalizeStores();
      schedulePresentation();
    }
  }, true);

  window.addEventListener("pageshow", () => {
    normalizeStores();
    schedulePresentation();
  });

  normalizeStores();
  schedulePresentation();
})();