(() => {
  "use strict";

  const root = document.documentElement;
  const sleepFrame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  function overlaps(a, b) {
    if (!a || !b) return false;
    const x = a.getBoundingClientRect();
    const y = b.getBoundingClientRect();
    return x.left < y.right && x.right > y.left && x.top < y.bottom && x.bottom > y.top;
  }

  function pageFitsHorizontally(node = document.documentElement) {
    const width = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0, node?.scrollWidth || 0);
    return width <= window.innerWidth + 1;
  }

  function rectFitsViewport(node) {
    if (!node) return false;
    const rect = node.getBoundingClientRect();
    return rect.left >= -1
      && rect.right <= window.innerWidth + 1
      && rect.top >= -1
      && rect.bottom <= window.innerHeight + 1
      && rect.width <= window.innerWidth + 1
      && rect.height <= window.innerHeight + 1;
  }

  function tapHeightAtLeast(node, minimum = 44) {
    return Boolean(node) && node.getBoundingClientRect().height >= minimum - 0.5;
  }

  function reviewRendered(rootNode) {
    return Boolean(
      rootNode?.querySelector(".continuum-plan-review-summary")
      && rootNode?.querySelector(".continuum-plan-op-meta [data-plan-meta='effect']")
      && rootNode?.querySelector(".continuum-plan-op-meta [data-plan-meta='domain']")
      && rootNode?.querySelector(".continuum-plan-op-meta [data-plan-meta='review']")
    );
  }

  async function probeDirectory() {
    await sleepFrame();
    const ai = document.querySelector("[data-dir2-ai-setup]");
    const create = document.querySelector('.lab-directory-v2 [data-dir2-action="new"]');
    if (!ai || !create) return false;

    root.dataset.qaDirectoryCommandOverlap = overlaps(ai, create) ? "true" : "false";
    root.dataset.qaDirectoryButtonsFit = rectFitsViewport(ai) && rectFitsViewport(create) ? "true" : "false";
    root.dataset.qaDirectoryTapTargets = tapHeightAtLeast(ai) && tapHeightAtLeast(create) ? "true" : "false";

    ai.click();
    await sleepFrame();
    await wait(30);
    const modal = document.querySelector(".dir2-ai-modal");
    const example = modal?.querySelector("[data-dir2-ai-example]");
    const close = modal?.querySelector("[data-dir2-ai-close]");
    root.dataset.qaDirectoryPlannerFit = modal && rectFitsViewport(modal) && pageFitsHorizontally(modal) ? "true" : "false";
    root.dataset.qaDirectoryPlannerOpen = modal ? "true" : "false";
    root.dataset.qaDirectoryPlannerTapTargets = tapHeightAtLeast(example) && tapHeightAtLeast(close) ? "true" : "false";

    example?.click();
    await sleepFrame();
    await wait(40);
    root.dataset.qaDirectoryPlannerReview = reviewRendered(modal) ? "true" : "false";
    root.dataset.qaDirectoryPlannerFitAfterReview = modal && rectFitsViewport(modal) && pageFitsHorizontally(modal) ? "true" : "false";
    return true;
  }

  async function probeAutomations() {
    await sleepFrame();
    const newButton = document.querySelector("[data-new]");
    if (!newButton) return false;

    newButton.click();
    await sleepFrame();
    const plannerStart = document.querySelector("[data-v4-start='planner']");
    if (!plannerStart) return false;
    plannerStart.click();
    await sleepFrame();
    await wait(30);

    const modal = document.querySelector(".v4-planner-modal");
    root.dataset.qaAutomationsPlannerOpen = modal ? "true" : "false";
    if (!modal) return true;

    const example = modal.querySelector("[data-v5-planner-example='urgent-ai']") || modal.querySelector("[data-v5-planner-example]");
    example?.click();
    await sleepFrame();
    await wait(40);

    const result = modal.querySelector(".v5-planner-result:not([hidden])");
    const useDraft = modal.querySelector("[data-v5-planner-use]");
    const close = modal.querySelector("[data-v4-modal-close]");
    root.dataset.qaAutomationsPlannerResult = result ? "true" : "false";
    root.dataset.qaAutomationsPlannerReview = reviewRendered(result) ? "true" : "false";
    root.dataset.qaAutomationsPlannerFit = rectFitsViewport(modal) && pageFitsHorizontally(modal) ? "true" : "false";
    root.dataset.qaAutomationsPlannerTapTargets = tapHeightAtLeast(example) && tapHeightAtLeast(useDraft) && tapHeightAtLeast(close) ? "true" : "false";
    return true;
  }

  (async () => {
    await sleepFrame();
    await wait(40);
    root.dataset.qaViewportWidth = String(window.innerWidth);
    root.dataset.qaViewportHeight = String(window.innerHeight);
    root.dataset.qaHorizontalOverflow = pageFitsHorizontally() ? "false" : "true";

    const isDirectory = Boolean(document.querySelector(".lab-directory-v2"));
    const isAutomations = Boolean(document.querySelector("#automationApp")) && !isDirectory;

    if (isDirectory) await probeDirectory();
    if (isAutomations) await probeAutomations();

    await sleepFrame();
    root.dataset.qaHorizontalOverflowAfter = pageFitsHorizontally() ? "false" : "true";
    root.dataset.qaLayoutProbe = "complete";
  })();
})();