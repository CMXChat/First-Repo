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
    if (open()) {
      open().click();
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      open()?.click();
    }));
  }

  document.addEventListener("click", event => {
    const compose = event.target.closest("[data-email-compose]");
    if (compose) openEmailComposerWhenReady(compose.dataset.emailCompose);

    if (event.target.closest("[data-ai-open]")) {
      requestAnimationFrame(() => requestAnimationFrame(hydrateAiCapabilityValues));
    }
  });

  window.addEventListener("pageshow", hydrateAiCapabilityValues);
})();