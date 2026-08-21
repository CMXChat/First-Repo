(() => {
  "use strict";

  const SECTIONS = ["overview", "definition", "runs", "permissions", "related", "history", "settings"];
  let queued = false;
  let dashboardNudgeSent = false;

  function lifecycleLabel() {
    return document.querySelector(".v3-editor-page .v3-title-button")?.closest(".v3-editor-title-row")?.querySelector(".v3-draft-badge")?.textContent?.trim() || "Draft";
  }

  function patchEditorChrome() {
    queued = false;
    const page = document.querySelector(".v3-editor-page");
    const head = page?.querySelector(".v3-editor-head");
    if (!page || !head) {
      if (!dashboardNudgeSent && document.querySelector(".v3-dashboard")) {
        dashboardNudgeSent = true;
        document.dispatchEvent(new CustomEvent("cmx:lab-automations-updated", { detail: { reason: "control-v10-late-dashboard" } }));
      }
      return false;
    }

    const view = page.dataset.v10View || "definition";
    page.dataset.controlV10 = "ready";
    page.dataset.v10View = view;

    let bar = head.querySelector(".v10-object-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "v10-object-bar";
      bar.innerHTML = `<button class="v10-exit" type="button" data-v10-exit><span>←</span><strong>Automations</strong></button>
        <div class="v10-object-state"><span>AUTOMATION CONTROL</span><strong>${lifecycleLabel()}</strong><small>Definition control</small></div>
        <button class="v10-object-menu" type="button" data-v10-editor-menu="" aria-label="Automation actions">•••</button>
        <button class="v10-object-close" type="button" data-v10-exit aria-label="Close Automation">×</button>`;
      head.insertAdjacentElement("afterbegin", bar);
    }

    let nav = head.querySelector(".v10-control-nav");
    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "v10-control-nav";
      nav.setAttribute("aria-label", "Automation sections");
      nav.innerHTML = SECTIONS.map(section => `<button type="button" data-v10-tab="${section}" class="${view === section ? "is-active" : ""}" aria-selected="${view === section}">${section[0].toUpperCase()}${section.slice(1)}</button>`).join("");
      const rail = head.querySelector(".v3-stage-rail");
      if (rail) rail.insertAdjacentElement("beforebegin", nav);
      else head.append(nav);
    }

    document.documentElement.dataset.labAutomationsControl = "v10";
    document.dispatchEvent(new CustomEvent("cmx:v10-editor-bootstrap", { detail: { view } }));
    return true;
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(patchEditorChrome)));
  }

  document.addEventListener("click", schedule, true);
  document.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("popstate", schedule);
  schedule();
})();
