(() => {
  "use strict";

  const STORAGE_KEY = "cmx-lab-automations-flow-preview-collapsed-v1";

  function readCollapsed() {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  }

  function writeCollapsed(value) {
    try { localStorage.setItem(STORAGE_KEY, value ? "1" : "0"); } catch {}
  }

  function apply() {
    const page = document.querySelector(".v3-editor-page");
    if (!page) return;

    if (window.innerWidth < 980) {
      delete page.dataset.flowPreviewCollapsed;
      return;
    }

    const panel = page.querySelector(".v3-live-panel");
    const head = panel?.querySelector(".v3-live-head");
    if (!panel || !head) return;

    let button = head.querySelector("[data-v8-flow-toggle]");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "v8-flow-toggle";
      button.dataset.v8FlowToggle = "1";
      head.append(button);
    }

    const collapsed = readCollapsed();
    page.dataset.flowPreviewCollapsed = collapsed ? "true" : "false";
    button.textContent = collapsed ? "›" : "‹";
    button.setAttribute("aria-expanded", collapsed ? "false" : "true");
    button.setAttribute("aria-label", collapsed ? "Expand Flow Preview" : "Collapse Flow Preview");
    button.title = collapsed ? "Expand Flow Preview" : "Collapse Flow Preview";
  }

  function queueApply() {
    requestAnimationFrame(() => requestAnimationFrame(apply));
  }

  document.addEventListener("click", event => {
    const toggle = event.target.closest?.("[data-v8-flow-toggle]");
    if (toggle) {
      const page = document.querySelector(".v3-editor-page");
      const collapsed = page?.dataset.flowPreviewCollapsed === "true";
      writeCollapsed(!collapsed);
      apply();
      return;
    }
    queueApply();
  });

  window.addEventListener("resize", queueApply);
  window.addEventListener("pageshow", queueApply);
  queueApply();
})();
