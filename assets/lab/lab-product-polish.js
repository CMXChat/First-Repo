(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /**
   * CHECK IN LAB — PRODUCT POLISH / MOBILE HIERARCHY
   * ------------------------------------------------
   * Presentation-only integration layer. It may reorder or shorten rendered Lab
   * UI, but it must never own records, actions, policy, audit, incident, decision,
   * simulation, or execution truth.
   *
   * The purpose of this layer is to keep the growing prototype usable on phones:
   * - preserve the live-switch hero as the primary Status surface
   * - move Plan Health below the core switch metrics
   * - shorten secondary copy on overview surfaces
   * - expose the Test Center without duplicating simulation logic
   * - provide stable readiness markers for browser CI
   *
   * OFFICIAL PROJECT HANDOFF:
   * Recreate approved hierarchy natively in the official React/component system.
   * Do not port this DOM adapter. See CHECKINLABCLONE.md.
   */

  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];
  let queued = false;

  function shortHealthCopy(state) {
    if (state === "untested") return "Run a test to establish a current baseline.";
    if (state === "retest") return "The plan changed after its latest test.";
    if (state === "coverage") return "Some action paths still need testing.";
    return "Current definitions match the latest test.";
  }

  function shortenWarning(button) {
    const strong = $("strong", button);
    if (!strong) return;
    const text = strong.textContent.trim();
    let match = text.match(/^(\d+) action(?:s)? below 4\/4 path coverage/i);
    if (match) strong.textContent = `${match[1]} action${match[1] === "1" ? "" : "s"} need coverage`;
    match = text.match(/^(\d+) definition(?:s)? changed/i);
    if (match) strong.textContent = `${match[1]} definition${match[1] === "1" ? "" : "s"} changed`;
  }

  function polishAssurance() {
    const overview = $('[data-view-panel="overview"]');
    const block = $("#labPlanAssurance", overview);
    const metrics = $(".metric-grid", overview);
    if (!block || !metrics) return;

    if (metrics.nextElementSibling !== block) metrics.after(block);
    block.classList.add("lab-assurance-polished");

    const kicker = $(".lab-plan-title small", block);
    const title = $(".lab-plan-title strong", block);
    const detail = $(".lab-plan-title p", block);
    if (kicker) kicker.textContent = "CURRENT PLAN · LAB";
    if (title) title.textContent = "Plan health";
    if (detail) detail.textContent = shortHealthCopy(block.dataset.health);

    const labels = ["WINDOW", "GRACE", "ACTIONS", "LAST TEST"];
    $$(".lab-plan-metrics > div", block).forEach((metric, index) => {
      const label = $("small", metric);
      if (label && labels[index]) label.textContent = labels[index];
    });

    $$(".lab-plan-warnings button", block).forEach(shortenWarning);

    const footerButtons = $$(":scope > footer button", block);
    const health = footerButtons.find(button => button.dataset.phase8Action === "health");
    const search = footerButtons.find(button => button.dataset.phase8Action === "search");
    const simulate = footerButtons.find(button => button.dataset.phase8Action === "simulate");
    if (health) health.textContent = "Plan health";
    if (search) search.textContent = "Search";
    if (simulate) {
      simulate.textContent = "Run test";
      delete simulate.dataset.phase8Action;
      simulate.dataset.testCenterOpen = "true";
    }
  }

  function polishStatusHero() {
    const consoleNode = $("#statusConsole");
    if (!consoleNode) return;
    consoleNode.classList.add("lab-live-status-hero");

    const head = $(".console-head > div", consoleNode);
    if (head && !$(".lab-live-kicker", head)) {
      const live = document.createElement("span");
      live.className = "lab-live-kicker";
      live.innerHTML = '<i aria-hidden="true"></i> LIVE SWITCH';
      head.prepend(live);
    }

    const control = $(".checkin-control", consoleNode);
    const meta = $(".checkin-meta", control);
    if (control && meta && !$(".lab-status-test", control)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lab-status-test";
      button.dataset.testCenterOpen = "true";
      button.innerHTML = '<span>TEST</span><strong>Run contingency test</strong><em>→</em>';
      meta.after(button);
    }
  }

  function labelMajorViews() {
    const mapping = {
      records: "Records",
      actions: "Actions",
      activity: "Activity",
      timeline: "Sequence"
    };
    Object.entries(mapping).forEach(([view, label]) => {
      const panel = $(`[data-view-panel="${view}"]`);
      if (panel) panel.dataset.mobileViewLabel = label;
    });
  }

  function apply() {
    queued = false;
    polishStatusHero();
    polishAssurance();
    labelMajorViews();
    document.body.dataset.labProductPolish = "ready";
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  }

  document.addEventListener("cmx:lab-crm-updated", queue);
  document.addEventListener("cmx:lab-inventory-updated", queue);
  document.addEventListener("cmx:lab-actions-updated", queue);
  document.addEventListener("cmx:lab-switch-policy-updated", queue);
  document.addEventListener("cmx:lab-decisions-updated", queue);
  document.addEventListener("cmx:lab-simulation-updated", queue);

  const overview = $('[data-view-panel="overview"]');
  if (overview) new MutationObserver(queue).observe(overview, { childList:true, subtree:true });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", queue, { once:true });
  else queue();
})();