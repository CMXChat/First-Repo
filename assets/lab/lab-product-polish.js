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
   * - keep the glowing live switch at the very top of Status
   * - move Plan Health below the core switch metrics
   * - shorten secondary copy on overview surfaces
   * - connect Status and Actions to the Test Center without duplicating simulation
   * - provide stable readiness markers for browser CI
   *
   * OFFICIAL PROJECT HANDOFF:
   * Recreate approved hierarchy natively in the official React/component system.
   * Do not port this DOM adapter. See CHECKINLABCLONE.md.
   */

  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];
  let queued = false;

  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }

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
    if (match) setText(strong, `${match[1]} action${match[1] === "1" ? "" : "s"} need coverage`);
    match = text.match(/^(\d+) definition(?:s)? changed/i);
    if (match) setText(strong, `${match[1]} definition${match[1] === "1" ? "" : "s"} changed`);
  }

  function polishAssurance() {
    const overview = $('[data-view-panel="overview"]');
    const block = $("#labPlanAssurance", overview);
    const metrics = $(".metric-grid", overview);
    if (!block || !metrics) return;

    if (metrics.nextElementSibling !== block) metrics.after(block);
    block.classList.add("lab-assurance-polished");

    setText($(".lab-plan-title small", block), "CURRENT PLAN · LAB");
    setText($(".lab-plan-title strong", block), "Plan health");
    setText($(".lab-plan-title p", block), shortHealthCopy(block.dataset.health));

    const labels = ["WINDOW", "GRACE", "ACTIONS", "LAST TEST"];
    $$(".lab-plan-metrics > div", block).forEach((metric, index) => {
      if (labels[index]) setText($("small", metric), labels[index]);
    });

    $$(".lab-plan-warnings button", block).forEach(shortenWarning);

    const footerButtons = $$(":scope > footer button", block);
    const health = footerButtons.find(button => button.dataset.phase8Action === "health");
    const search = footerButtons.find(button => button.dataset.phase8Action === "search");
    const simulate = footerButtons.find(button => button.dataset.phase8Action === "simulate");
    setText(health, "Plan health");
    setText(search, "Search");
    if (simulate) {
      setText(simulate, "Run test");
      delete simulate.dataset.phase8Action;
      simulate.dataset.testCenterOpen = "true";
    }
  }

  function polishStatusHero() {
    const overview = $('[data-view-panel="overview"]');
    const consoleNode = $("#statusConsole", overview);
    const dashboard = $(".dashboard-grid", overview);
    const heading = $(".view-heading", overview);
    if (!overview || !consoleNode || !dashboard) return;

    // Status opens with the glowing live-switch console. Keep the dashboard intact
    // so its original desktop/mobile layout remains stable, but move the whole
    // console group ahead of headings, inventory summaries, Plan Health, and logs.
    if (overview.firstElementChild !== dashboard) overview.prepend(dashboard);
    dashboard.classList.add("lab-status-first");
    consoleNode.classList.add("lab-live-status-hero");
    if (heading) heading.classList.add("lab-status-heading-secondary");

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

  function polishActions() {
    const actions = $(".lab-actions");
    if (!actions) return;
    const profileActions = $(".lab-action-profile-actions", actions);
    if (profileActions && !$(".lab-action-test-plan", profileActions)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lab-action-button lab-action-test-plan";
      button.dataset.testCenterOpen = "true";
      button.textContent = "Test plan";
      profileActions.prepend(button);
    }
  }

  function labelMajorViews() {
    const mapping = { records:"Records", actions:"Actions", activity:"Activity", timeline:"Sequence" };
    Object.entries(mapping).forEach(([view, label]) => {
      const panel = $(`[data-view-panel="${view}"]`);
      if (panel && panel.dataset.mobileViewLabel !== label) panel.dataset.mobileViewLabel = label;
    });
  }

  function apply() {
    queued = false;
    polishStatusHero();
    polishAssurance();
    polishActions();
    labelMajorViews();
    document.body.dataset.labProductPolish = "ready";
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  }

  ["cmx:lab-crm-updated","cmx:lab-inventory-updated","cmx:lab-actions-updated","cmx:lab-switch-policy-updated","cmx:lab-decisions-updated","cmx:lab-simulation-updated"].forEach(name => document.addEventListener(name, queue));

  const overview = $('[data-view-panel="overview"]');
  if (overview) new MutationObserver(queue).observe(overview, { childList:true, subtree:true });
  const actionPanel = $('[data-view-panel="actions"]');
  if (actionPanel) new MutationObserver(queue).observe(actionPanel, { childList:true, subtree:true });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", queue, { once:true });
  else queue();
})();