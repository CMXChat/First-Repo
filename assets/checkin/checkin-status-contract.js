(function exposeCheckInStatusContract(root, factory) {
  const contract = factory();
  if (typeof module === "object" && module.exports) module.exports = contract;
  else root.CheckInStatusContract = contract;
})(globalThis, () => {
  "use strict";

  const COUNT_FIELDS = ["document_count", "contact_count", "organization_count", "update_revision_count", "trigger_action_count"];

  function isCount(value) {
    const number = Number(value);
    return Number.isFinite(number) && Number.isInteger(number) && number >= 0;
  }

  function count(value) {
    return isCount(value) ? Number(value) : 0;
  }

  function normalize(data = {}) {
    const interval = Number(data.interval_hours);
    const grace = Number(data.grace_hours);
    return {
      schemaCompatible: interval === 72 && COUNT_FIELDS.every(field => isCount(data[field])),
      intervalHours: 72,
      graceHours: Number.isFinite(grace) && grace >= 0 ? grace : 24,
      documentCount: count(data.document_count),
      contactCount: count(data.contact_count),
      organizationCount: count(data.organization_count),
      updateRevisionCount: count(data.update_revision_count),
      actionCount: count(data.trigger_action_count),
    };
  }

  return { normalize };
});

if (typeof document !== "undefined") {
  (() => {
    "use strict";

    const VIEWS = new Set(["overview", "timeline", "records", "updates", "actions", "activity"]);
    let restoringHistory = false;

    const statusCopyStyle = document.createElement("style");
    statusCopyStyle.textContent = '.status-console[data-state="safe"] #statusCopy{display:none!important}';
    document.head.append(statusCopyStyle);

    function activeView() {
      return document.querySelector(".view.is-active")?.dataset.viewPanel || "overview";
    }

    function viewFromLocation() {
      const hash = location.hash.replace(/^#/, "");
      return VIEWS.has(hash) ? hash : "overview";
    }

    function viewUrl(view) {
      const url = new URL(location.href);
      url.hash = view === "overview" ? "" : view;
      return `${url.pathname}${url.search}${url.hash}`;
    }

    function stateFor(view) {
      return { ...(history.state || {}), checkinView: view };
    }

    function openView(view) {
      const target = VIEWS.has(view) ? view : "overview";
      document.querySelector(`[data-view="${target}"]`)?.click();
    }

    const initialView = viewFromLocation();
    history.replaceState(stateFor(initialView), "", viewUrl(initialView));

    const observer = new MutationObserver(() => {
      if (restoringHistory) return;
      const view = activeView();
      if (history.state?.checkinView === view) return;
      history.pushState(stateFor(view), "", viewUrl(view));
    });

    document.querySelectorAll(".view").forEach(panel => {
      observer.observe(panel, { attributes: true, attributeFilter: ["class", "hidden"] });
    });

    window.addEventListener("popstate", event => {
      const requested = VIEWS.has(event.state?.checkinView) ? event.state.checkinView : viewFromLocation();
      restoringHistory = true;
      openView(requested);
      setTimeout(() => {
        const actual = activeView();
        if (actual !== requested) history.pushState(stateFor(actual), "", viewUrl(actual));
        else history.replaceState(stateFor(actual), "", viewUrl(actual));
        restoringHistory = false;
      }, 0);
    });

    setTimeout(() => {
      if (initialView === activeView()) return;
      restoringHistory = true;
      openView(initialView);
      setTimeout(() => { restoringHistory = false; }, 0);
    }, 0);

    /*
     * The legacy checkin-presentation.js enhancer intentionally is not loaded here.
     * It watched the full document tree and repeatedly rescanned visible text while
     * the countdown changed. On mobile browsers that could create observer churn
     * and an unresponsive-page warning. checkin-refine.js now owns the small set of
     * presentation-only enhancements with targeted observers instead.
     */
  })();
}