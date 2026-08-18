(() => {
  "use strict";

  document.addEventListener("click", event => {
    if (!event.target.closest("[data-premium-save-library],[data-premium-save-template],[data-premium-save-document]")) return;
    const saveButton = document.querySelector(".content-editor-overlay [data-content-save]");
    if (saveButton) saveButton.click();
  }, true);
})();