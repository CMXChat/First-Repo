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

  function viewportFits(node = document.documentElement) {
    const width = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0, node?.scrollWidth || 0);
    return width <= window.innerWidth + 1;
  }

  function rectFits(node) {
    if (!node) return false;
    const rect = node.getBoundingClientRect();
    return rect.left >= -1 && rect.right <= window.innerWidth + 1 && rect.width <= window.innerWidth + 1;
  }

  async function probeDirectory() {
    await sleepFrame();
    const ai = document.querySelector("[data-dir2-ai-setup]");
    const create = document.querySelector('.lab-directory-v2 [data-dir2-action="new"]');
    if (!ai || !create) return false;

    root.dataset.qaDirectoryCommandOverlap = overlaps(ai, create) ? "true" : "false";
    root.dataset.qaDirectoryButtonsFit = rectFits(ai) && rectFits(create) ? "true" : "false";

    ai.click();
    await sleepFrame();
    await wait(30);
    const modal = document.querySelector(".dir2-ai-modal");
    root.dataset.qaDirectoryPlannerFit = modal && rectFits(modal) && viewportFits(modal) ? "true" : "false";
    root.dataset.qaDirectoryPlannerOpen = modal ? "true" : "false";
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
    await wait(30);

    const result = modal.querySelector(".v5-planner-result:not([hidden])");
    root.dataset.qaAutomationsPlannerResult = result ? "true" : "false";
    root.dataset.qaAutomationsPlannerFit = rectFits(modal) && viewportFits(modal) ? "true" : "false";
    return true;
  }

  (async () => {
    await sleepFrame();
    await wait(40);
    root.dataset.qaViewportWidth = String(window.innerWidth);
    root.dataset.qaHorizontalOverflow = viewportFits() ? "false" : "true";

    const isDirectory = Boolean(document.querySelector(".lab-directory-v2"));
    const isAutomations = Boolean(document.querySelector("#automationApp"));

    if (isDirectory) await probeDirectory();
    if (isAutomations) await probeAutomations();

    await sleepFrame();
    root.dataset.qaHorizontalOverflowAfter = viewportFits() ? "false" : "true";
    root.dataset.qaLayoutProbe = "complete";
  })();
})();