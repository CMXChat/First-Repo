(() => {
  "use strict";

  const RETURN_TO_LAB = "/lab/#lab=view%3Aactions";

  function configureReturnNavigation() {
    document.querySelectorAll("a.brand").forEach(link => {
      link.href = RETURN_TO_LAB;
      link.setAttribute("aria-label", "Back to Check In Lab Actions");
      link.title = "Back to Lab · Actions";
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

  function openRequestedTarget() {
    const params = new URLSearchParams(location.search);
    const automationId = params.get("automation");
    const wantsNew = params.get("new") === "1";
    let opened = false;

    if (automationId) {
      const target = document.querySelector(`[data-open="${CSS.escape(automationId)}"]`);
      if (target) {
        target.click();
        opened = true;
      }
    } else if (wantsNew) {
      const target = document.querySelector("[data-new]");
      if (target) {
        target.click();
        opened = true;
      }
    }

    if (automationId || wantsNew) cleanOneShotQuery();
    return opened;
  }

  function boot() {
    configureReturnNavigation();
    openRequestedTarget();
    document.documentElement.dataset.labAutomationsRouteIntegration = "ready";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(boot), { once: true });
  else requestAnimationFrame(boot);
})();
