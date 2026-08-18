(() => {
  "use strict";

  function hydrateAiCapabilityValues() {
    document.querySelectorAll(".ai-task-overlay [data-ai-context]").forEach(input => {
      input.value = input.dataset.aiContext || "";
    });
    document.querySelectorAll(".ai-task-overlay [data-ai-tool]").forEach(input => {
      input.value = input.dataset.aiTool || "";
    });
  }

  function openEmailComposerWhenReady(stepId) {
    const open = () => document.querySelector(`[data-content-open="${CSS.escape(stepId)}"]`);
    const launch = () => {
      const button = open();
      if (!button) return false;
      button.click();
      return true;
    };

    if (launch()) return;
    requestAnimationFrame(() => requestAnimationFrame(launch));
  }

  // Capture the dedicated composer affordance before the older enhancement layer's
  // bubble handler so one user tap maps to one deterministic content-editor launch.
  document.addEventListener("click", event => {
    const compose = event.target.closest("[data-email-compose]");
    if (!compose) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openEmailComposerWhenReady(compose.dataset.emailCompose);
  }, true);

  // AI overlay is created by the main communications layer first; hydrate actual
  // capability IDs immediately afterward so checked values never persist as "on".
  document.addEventListener("click", event => {
    if (event.target.closest("[data-ai-open]")) {
      requestAnimationFrame(() => requestAnimationFrame(hydrateAiCapabilityValues));
    }
  });

  window.addEventListener("pageshow", hydrateAiCapabilityValues);
})();