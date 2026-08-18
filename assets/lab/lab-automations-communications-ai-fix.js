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

  // The main communications runtime is loaded first and creates the AI overlay
  // synchronously in its click listener. This later listener can therefore assign
  // the real capability IDs immediately, with no frame/timer race before Save.
  document.addEventListener("click", event => {
    if (event.target.closest("[data-ai-open]")) hydrateAiCapabilityValues();
  });

  window.addEventListener("pageshow", hydrateAiCapabilityValues);
})();