(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /*
   * UI EVENT BOUNDARY
   * lab-decisions.js intentionally listens at document level so the Logic controls
   * injected into the Actions workspace survive its re-renders. The graph itself
   * also owns a local delegated listener. Stop handled graph clicks after that
   * local listener runs so the document delegate does not process them twice.
   */
  function bind(attempt = 0) {
    const root = document.querySelector(".lab-decision-workspace");
    if (!root) {
      if (attempt < 30) requestAnimationFrame(() => bind(attempt + 1));
      return;
    }
    if (root.dataset.eventBoundary === "true") return;
    root.dataset.eventBoundary = "true";
    root.addEventListener("click", event => {
      if (event.target.closest("[data-decision-node],[data-decision-edit],[data-decision-run],[data-decision-ack]")) {
        event.stopPropagation();
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => bind(), { once:true });
  else bind();
})();