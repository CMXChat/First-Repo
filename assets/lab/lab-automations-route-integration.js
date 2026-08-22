(() => {
  "use strict";

  const RETURN_TO_CONTROL = "/control/";
  let targetObserver = null;

  function configureReturnNavigation() {
    document.querySelectorAll("a.brand").forEach(link => {
      link.href = RETURN_TO_CONTROL;
      link.setAttribute("aria-label", "Back to Continuum Control Center");
      link.title = "Back to Control Center";
    });
  }

  function cleanOneShotQuery() {
    const url = new URL(location.href);
    let changed = false;
    ["automation", "new", "from"].forEach(key => {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    });
    if (changed) history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function requestedTarget() {
    const params = new URLSearchParams(location.search);
    return {
      automationId: params.get("automation"),
      wantsNew: params.get("new") === "1",
    };
  }

  function openRequestedTarget() {
    const { automationId, wantsNew } = requestedTarget();
    let target = null;

    if (automationId) {
      target = document.querySelector(`[data-open="${CSS.escape(automationId)}"]`);
    } else if (wantsNew) {
      target = document.querySelector("[data-new]");
    } else {
      return true;
    }

    if (!target) return false;
    target.click();
    cleanOneShotQuery();
    return true;
  }

  function watchRequestedTarget() {
    const { automationId, wantsNew } = requestedTarget();
    if (!automationId && !wantsNew) return;
    if (openRequestedTarget()) return;

    const root = document.getElementById("automationApp") || document.body;
    if (!root || targetObserver) return;

    targetObserver = new MutationObserver(() => {
      if (!openRequestedTarget()) return;
      targetObserver?.disconnect();
      targetObserver = null;
      refreshIntegration();
    });
    targetObserver.observe(root, { childList: true, subtree: true });
  }

  function refreshIntegration() {
    requestAnimationFrame(configureReturnNavigation);
  }

  function boot() {
    configureReturnNavigation();
    watchRequestedTarget();
    refreshIntegration();
    document.documentElement.dataset.labAutomationsRouteIntegration = "ready";
  }

  document.addEventListener("click", event => {
    const brand = event.target.closest?.("a.brand");
    if (brand) {
      event.preventDefault();
      location.assign(RETURN_TO_CONTROL);
      return;
    }
    refreshIntegration();
  }, true);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(boot), { once: true });
  else requestAnimationFrame(boot);
})();
