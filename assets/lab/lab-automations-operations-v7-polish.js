(() => {
  "use strict";

  let queued = false;

  function patchChrome() {
    const brand = document.querySelector(".v3-brand");
    if (brand) {
      brand.href = "/lab/";
      brand.setAttribute("aria-label", "Back to Continuum Lab");
      const strong = brand.querySelector(".brand-copy strong");
      const small = brand.querySelector(".brand-copy small");
      if (strong) strong.textContent = "CONTINUUM";
      if (small) small.textContent = "LAB · AUTOMATIONS";
    }

    const boundary = document.querySelector(".v3-lab-pill");
    if (boundary && boundary.dataset.v7Boundary !== "ready") {
      boundary.innerHTML = "<i></i> LAB · EXECUTION OFF";
      boundary.dataset.v7Boundary = "ready";
    }
  }

  function patchStartModal() {
    const modal = document.querySelector(".v4-new-modal");
    if (!modal) return;
    const intro = modal.querySelector("header p");
    if (intro) intro.textContent = "Choose how to create the same editable local Draft.";

    const planner = modal.querySelector("[data-v4-start='planner']");
    if (planner) {
      const label = planner.querySelector("b");
      const title = planner.querySelector("strong");
      const copy = planner.querySelector("small");
      if (label) label.textContent = "PLANNER";
      if (title) title.textContent = "Describe the outcome";
      if (copy) copy.textContent = "Create a local typed proposal before opening the Draft.";
    }
  }

  function patchPlannerModal() {
    const modal = document.querySelector(".v4-planner-modal");
    if (!modal) return;
    const label = modal.querySelector("header span");
    const title = modal.querySelector("header h2");
    const copy = modal.querySelector("header p");
    if (label) label.textContent = "PLANNER · LOCAL PREVIEW";
    if (title) title.textContent = "Describe what you want to happen.";
    if (copy) copy.textContent = "Supported intents become a typed proposal you can inspect and edit. No model call or provider action occurs.";
  }

  function patch() {
    queued = false;
    patchChrome();
    patchStartModal();
    patchPlannerModal();
    document.documentElement.dataset.labAutomationsOperationsPolish = "v7";
  }

  function schedulePatch() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", schedulePatch, false);
  window.addEventListener("pageshow", schedulePatch);
  window.addEventListener("cmx:lab-automations-updated", schedulePatch);
  schedulePatch();
})();