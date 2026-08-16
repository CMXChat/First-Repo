(() => {
  "use strict";

  /*
   * Stable presentation bridge.
   *
   * The core API, security, countdown, editor, records and history logic stay in
   * checkin.js and checkin-status-contract.js. This file only restores the
   * proven pre-redesign navigation/presentation layer and then loads the earlier
   * presentation enhancer. It intentionally has no MutationObserver of its own.
   */

  function restoreNavigation() {
    const desktop = document.querySelector(".side-nav");
    const mobile = document.querySelector(".mobile-nav");
    const order = ["overview", "timeline", "records", "updates", "actions", "activity"];

    document.querySelectorAll(".legacy-nav-target, .legacy-mobile-target").forEach(button => {
      button.hidden = false;
      button.classList.remove("legacy-nav-target", "legacy-mobile-target");
    });

    order.forEach(view => {
      const button = desktop?.querySelector(`[data-view="${view}"]`);
      if (button) desktop.append(button);
    });

    order.forEach(view => {
      const button = mobile?.querySelector(`[data-view="${view}"]`);
      if (button) mobile.append(button);
    });

    const settings = document.querySelector("#mobileNavSettings");
    if (settings) {
      settings.hidden = false;
      mobile?.append(settings);
    }
  }

  function normalizeStaticCopy() {
    const access = document.querySelector("#operatorButton");
    if (access && !document.body.classList.contains("operator-unlocked")) access.textContent = "Access";

    const sessionLabel = document.querySelector("#operatorSessionStrip strong");
    if (sessionLabel) sessionLabel.textContent = "PRIVATE ACCESS ACTIVE";

    const hint = document.querySelector("#checkinButtonHint");
    if (hint && /operator|authorization/i.test(hint.textContent || "")) hint.textContent = "Private access required";
  }

  function loadStablePresentation() {
    if (document.querySelector('script[data-checkin-stable-presentation="true"]')) return;
    const script = document.createElement("script");
    script.src = "/assets/checkin/checkin-presentation.js?v=20260816-stable-1";
    script.async = true;
    script.dataset.checkinStablePresentation = "true";
    document.head.append(script);
  }

  function boot() {
    restoreNavigation();
    normalizeStaticCopy();
    loadStablePresentation();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
