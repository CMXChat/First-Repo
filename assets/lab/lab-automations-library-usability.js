(() => {
  "use strict";

  const META_KEY = "cmx-lab-library-meta-v1";

  const loadMeta = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(META_KEY));
      if (parsed && Array.isArray(parsed.folders)) return parsed;
    } catch {}
    return {folders: []};
  };

  function currentFolderId() {
    const crumbs = [...document.querySelectorAll(".library-pro-overlay .pro-breadcrumb [data-pro-folder]")];
    return crumbs.length ? (crumbs.at(-1)?.dataset.proFolder || null) : null;
  }

  function folderById(id) {
    return id ? loadMeta().folders.find(folder => folder.id === id) || null : null;
  }

  function parentInfo() {
    const currentId = currentFolderId();
    if (!currentId) return null;
    const current = folderById(currentId);
    const parentId = current?.parentId || null;
    const parent = folderById(parentId);
    return {
      currentId,
      currentName: current?.name || "Folder",
      parentId,
      parentName: parent?.name || "Library"
    };
  }

  function clickFolderTarget(folderId) {
    const overlay = document.querySelector(".library-pro-overlay");
    if (!overlay) return;
    const selector = `[data-pro-folder="${CSS.escape(folderId || "")}"]`;
    const target = overlay.querySelector(`.pro-breadcrumb ${selector}`) || overlay.querySelector(selector);
    target?.click();
  }

  function goUpOneFolder() {
    const info = parentInfo();
    if (!info) return false;
    clickFolderTarget(info.parentId);
    return true;
  }

  function filterLabel() {
    const active = document.querySelector(".library-pro-overlay .pro-toolbar nav [data-pro-filter].is-active");
    if (!active) return "All types";
    const value = active.dataset.proFilter || "all";
    return value === "all" ? "All types" : value[0].toUpperCase() + value.slice(1);
  }

  function enhanceNavigation() {
    const overlay = document.querySelector(".library-pro-overlay");
    if (!overlay) return;
    const info = parentInfo();
    const close = overlay.querySelector("[data-pro-close]");
    if (close) {
      close.setAttribute("aria-label", info ? `Back to ${info.parentName}` : "Back to Automations");
      close.setAttribute("title", info ? `Back to ${info.parentName}` : "Back to Automations");
      close.classList.toggle("is-folder-back", Boolean(info));
    }

    overlay.querySelector("[data-library-up]")?.remove();
    if (info) {
      const breadcrumb = overlay.querySelector(".pro-breadcrumb");
      if (breadcrumb) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "premium-folder-up";
        button.dataset.libraryUp = "";
        button.innerHTML = `<span aria-hidden="true">←</span><b>Back to ${escapeHtml(info.parentName)}</b><small>${escapeHtml(info.currentName)}</small>`;
        breadcrumb.insertAdjacentElement("afterend", button);
      }
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, ch => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"
    }[ch]));
  }

  function enhanceControls() {
    const overlay = document.querySelector(".library-pro-overlay");
    if (!overlay) return;

    const stats = [...overlay.querySelectorAll(".pro-stats > div")];
    const statLabels = ["Documents", "Files", "Templates", "Folders"];
    stats.forEach((box, index) => {
      const label = box.querySelector("span");
      if (label && statLabels[index]) label.textContent = statLabels[index];
    });

    const display = overlay.querySelector(".premium-display-controls");
    if (display && !display.querySelector("[data-library-filter-trigger]")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "premium-filter-trigger";
      button.dataset.libraryFilterTrigger = "";
      button.textContent = `Filter · ${filterLabel()}`;
      const sort = display.querySelector("[data-premium-sort-trigger]");
      if (sort) display.insertBefore(button, sort);
      else display.append(button);
    } else if (display) {
      const button = display.querySelector("[data-library-filter-trigger]");
      if (button) button.textContent = `Filter · ${filterLabel()}`;
    }
  }

  function openFilterSheet() {
    document.querySelector(".library-filter-sheet")?.remove();
    const activeValue = document.querySelector(".library-pro-overlay .pro-toolbar nav [data-pro-filter].is-active")?.dataset.proFilter || "all";
    const options = [
      ["all", "All types"],
      ["documents", "Documents"],
      ["files", "Files"],
      ["templates", "Templates"],
      ["archived", "Archived"]
    ];
    const sheet = document.createElement("div");
    sheet.className = "library-filter-sheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-label", "Filter Library");
    sheet.innerHTML = `<div><div class="library-filter-grab"></div><header><small>FILTER LIBRARY</small><strong>Show</strong></header><section>${options.map(([value,label]) => `<button type="button" data-library-filter="${value}" class="${value === activeValue ? "is-active" : ""}"><span>${label}</span>${value === activeValue ? "<b>✓</b>" : ""}</button>`).join("")}</section><button type="button" data-library-filter-close>Done</button></div>`;
    document.body.append(sheet);
  }

  function applyUsability() {
    enhanceNavigation();
    enhanceControls();
  }

  function scheduleUsability() {
    requestAnimationFrame(() => requestAnimationFrame(applyUsability));
  }

  window.addEventListener("click", event => {
    const close = event.target.closest?.(".library-pro-overlay [data-pro-close]");
    if (close && parentInfo()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      goUpOneFolder();
      scheduleUsability();
      return;
    }

    if (event.target.closest?.("[data-library-up]")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      goUpOneFolder();
      scheduleUsability();
      return;
    }

    if (event.target.closest?.("[data-library-filter-trigger]")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openFilterSheet();
      return;
    }

    const option = event.target.closest?.("[data-library-filter]");
    if (option) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const original = document.querySelector(`.library-pro-overlay [data-pro-filter="${CSS.escape(option.dataset.libraryFilter)}"]`);
      document.querySelector(".library-filter-sheet")?.remove();
      original?.click();
      scheduleUsability();
      return;
    }

    if (event.target.closest?.("[data-library-filter-close]")) {
      document.querySelector(".library-filter-sheet")?.remove();
      return;
    }

    if (event.target.classList?.contains("library-filter-sheet")) {
      document.querySelector(".library-filter-sheet")?.remove();
      return;
    }

    if (event.target.closest?.("[data-library-open-global],[data-library-open-context],.library-top-button,[data-pro-folder],[data-pro-filter],[data-premium-scope],[data-premium-templates],[data-premium-view],[data-premium-sort],[data-pro-create-toggle],[data-pro-folder-save],[data-pro-move-target]")) {
      scheduleUsability();
    }
  }, true);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.querySelector(".library-filter-sheet")) {
      document.querySelector(".library-filter-sheet")?.remove();
    }
  });

  window.addEventListener("pageshow", scheduleUsability);
  scheduleUsability();
})();