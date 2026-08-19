(() => {
  "use strict";

  const root = document.documentElement;
  const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function settle(ms = 40) {
    await frame();
    await wait(ms);
  }

  function fitsHorizontally() {
    return Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0) <= window.innerWidth + 1;
  }

  function tap(node, minimum = 44) {
    return Boolean(node) && node.getBoundingClientRect().height >= minimum - 0.5;
  }

  async function directoryProbe() {
    const open = document.querySelector("[data-dir2-ai-setup]");
    if (!open) return false;
    open.click();
    await settle();

    const modal = document.querySelector(".dir2-ai-modal");
    const example = modal?.querySelector("[data-dir2-ai-example='business']");
    example?.click();
    await settle(80);

    let panel = modal?.querySelector(".continuum-preflight-panel");
    root.dataset.qaPreflightDirectoryPanel = panel ? "true" : "false";
    root.dataset.qaPreflightDirectoryCode = panel?.querySelector("[data-preflight-code='directory.ambiguous_match']") ? "true" : "false";
    root.dataset.qaPreflightDirectoryOpenBefore = panel?.dataset.preflightOpenCount || "missing";
    root.dataset.qaPreflightDirectoryBlockedBefore = panel?.dataset.preflightBlockedCount || "missing";

    const choice = panel?.querySelector("[data-preflight-choice][data-preflight-value='Use existing match']");
    root.dataset.qaPreflightDirectoryChoiceTap = tap(choice) ? "true" : "false";
    choice?.click();
    await settle(70);

    panel = modal?.querySelector(".continuum-preflight-panel");
    root.dataset.qaPreflightDirectoryOpenAfter = panel?.dataset.preflightOpenCount || "missing";
    root.dataset.qaPreflightDirectoryReviewedAfter = panel?.dataset.preflightReviewedCount || "missing";
    root.dataset.qaPreflightDirectoryDecision = panel?.textContent?.includes("Preview choice recorded: Use existing match") ? "true" : "false";
    root.dataset.qaPreflightDirectoryReviewSync = modal?.querySelector(".continuum-plan-review-summary")?.textContent?.includes("ISSUES") ? "true" : "false";
    root.dataset.qaPreflightDirectoryFit = fitsHorizontally() ? "true" : "false";
    return true;
  }

  async function automationProbe() {
    const create = document.querySelector("[data-new]");
    if (!create) return false;
    create.click();
    await settle();

    const planner = document.querySelector("[data-v4-start='planner']");
    planner?.click();
    await settle();

    const modal = document.querySelector(".v4-planner-modal");
    const example = modal?.querySelector("[data-v5-planner-example='missed-checkin']");
    example?.click();
    await settle(90);

    let panel = modal?.querySelector(".continuum-preflight-panel");
    root.dataset.qaPreflightAutomationPanel = panel ? "true" : "false";
    root.dataset.qaPreflightAutomationAudience = panel?.querySelector("[data-preflight-code='directory.audience_required']") ? "true" : "false";
    root.dataset.qaPreflightAutomationRuntime = panel?.querySelector("[data-preflight-code='runtime.required'][data-preflight-state='blocked']") ? "true" : "false";
    root.dataset.qaPreflightAutomationOpenBefore = panel?.dataset.preflightOpenCount || "missing";
    root.dataset.qaPreflightAutomationBlockedBefore = panel?.dataset.preflightBlockedCount || "missing";

    const defer = panel?.querySelector("[data-preflight-defer]");
    root.dataset.qaPreflightAutomationDeferTap = tap(defer) ? "true" : "false";
    defer?.click();
    await settle(70);

    panel = modal?.querySelector(".continuum-preflight-panel");
    root.dataset.qaPreflightAutomationOpenAfter = panel?.dataset.preflightOpenCount || "missing";
    root.dataset.qaPreflightAutomationDeferredAfter = panel?.dataset.preflightDeferredCount || "missing";
    root.dataset.qaPreflightAutomationBlockedAfter = panel?.dataset.preflightBlockedCount || "missing";
    root.dataset.qaPreflightAutomationRuntimeStillBlocked = panel?.querySelector("[data-preflight-code='runtime.required'][data-preflight-state='blocked']") ? "true" : "false";
    root.dataset.qaPreflightAutomationStatus = panel?.querySelector(":scope > header > b")?.textContent?.trim() === "BLOCKED FOR APPLY" ? "true" : "false";
    root.dataset.qaPreflightAutomationFit = fitsHorizontally() ? "true" : "false";
    return true;
  }

  (async () => {
    await settle(100);
    root.dataset.qaPreflightViewport = String(window.innerWidth);
    root.dataset.qaPreflightContract = document.documentElement.dataset.labPlannerContract === "v1" ? "true" : "false";
    root.dataset.qaPreflightLayer = document.documentElement.dataset.labPlannerPreflight === "v1" ? "true" : "false";
    root.dataset.qaPreflightReview = document.documentElement.dataset.labPlannerReview === "v1" ? "true" : "false";

    const isDirectory = Boolean(document.querySelector(".lab-directory-v2"));
    const isAutomations = Boolean(document.querySelector("#automationApp")) && !isDirectory;
    if (isDirectory) await directoryProbe();
    if (isAutomations) await automationProbe();

    root.dataset.qaPreflightComplete = "true";
  })();
})();