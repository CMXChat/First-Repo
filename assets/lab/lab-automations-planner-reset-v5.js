(() => {
  "use strict";

  let queued = false;

  function patch() {
    queued = false;
    const result = document.querySelector(".v4-planner-modal .v5-planner-result:not([hidden])");
    if (!result) return;

    const note = result.querySelector(".v5-planner-edit-note");
    const edits = note?.querySelector(":scope > b");
    if (!note || !edits) {
      result.querySelector("[data-v5-planner-reset-proposal]")?.remove();
      return;
    }

    let reset = note.querySelector("[data-v5-planner-reset-proposal]");
    if (!reset) {
      reset = document.createElement("button");
      reset.type = "button";
      reset.className = "v5-planner-reset-proposal";
      reset.dataset.v5PlannerResetProposal = "true";
      reset.textContent = "Reset proposal";
      note.append(reset);
    }

    document.documentElement.dataset.labAutomationsPlannerReset = "v5";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", event => {
    const reset = event.target.closest?.("[data-v5-planner-reset-proposal]");
    if (reset) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const preview = document.querySelector(".v4-planner-modal [data-v5-planner-preview]");
      preview?.click();
      schedule();
      return;
    }
    schedule();
  }, true);

  document.addEventListener("input", schedule, true);
  window.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("pageshow", schedule);
  schedule();
})();