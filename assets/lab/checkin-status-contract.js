(function exposeCheckInStatusContract(root, factory) {
  const contract = factory();
  if (typeof module === "object" && module.exports) module.exports = contract;
  else root.CheckInStatusContract = contract;
})(globalThis, () => {
  "use strict";

  /*
   * LAB STATUS CONTRACT
   * -------------------
   * Production historically used a fixed 72-hour interval. /lab now supports a
   * configurable 1-hour to 30-day proof-of-life window and a 0-24 hour grace.
   * Keep this Lab copy flexible. Do not change the production status contract as
   * part of Lab experimentation.
   */

  const COUNT_FIELDS = ["document_count", "contact_count", "organization_count", "update_revision_count", "trigger_action_count"];
  const MIN_INTERVAL_HOURS = 1;
  const MAX_INTERVAL_HOURS = 720;
  const MIN_GRACE_HOURS = 0;
  const MAX_GRACE_HOURS = 24;

  function isCount(value) {
    const number = Number(value);
    return Number.isFinite(number) && Number.isInteger(number) && number >= 0;
  }

  function count(value) {
    return isCount(value) ? Number(value) : 0;
  }

  function validInterval(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= MIN_INTERVAL_HOURS && number <= MAX_INTERVAL_HOURS;
  }

  function validGrace(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= MIN_GRACE_HOURS && number <= MAX_GRACE_HOURS;
  }

  function normalize(data = {}) {
    const interval = Number(data.interval_hours);
    const grace = Number(data.grace_hours);
    const schemaCompatible = validInterval(interval) && validGrace(grace) && COUNT_FIELDS.every(field => isCount(data[field]));

    return {
      schemaCompatible,
      intervalHours: validInterval(interval) ? interval : 72,
      graceHours: validGrace(grace) ? grace : 24,
      repeatEnabled: data.repeat_enabled !== false,
      documentCount: count(data.document_count),
      contactCount: count(data.contact_count),
      organizationCount: count(data.organization_count),
      updateRevisionCount: count(data.update_revision_count),
      actionCount: count(data.trigger_action_count),
    };
  }

  return { normalize, MIN_INTERVAL_HOURS, MAX_INTERVAL_HOURS, MIN_GRACE_HOURS, MAX_GRACE_HOURS };
});

if (typeof document !== "undefined") {
  (() => {
    "use strict";

    /*
     * Phase 8 owns deep navigation inside /lab with #lab=... routes. The copied
     * legacy Check In view-history enhancer used #records/#actions/etc. and would
     * overwrite exact Lab routes during load/view changes. Keep that enhancer for
     * the copied production-style page behavior only; skip it in Lab mode.
     */
    if (document.body?.dataset.labMode === "true") return;

    const VIEWS = new Set(["overview", "timeline", "records", "updates", "actions", "activity"]);
    let restoringHistory = false;

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
     * and an unresponsive-page warning. checkin-refine.js owns the targeted
     * presentation-only enhancements instead.
     */
  })();
}
