(() => {
  "use strict";

  const root = document.documentElement;
  const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function settle(ms = 50) {
    await frame();
    await wait(ms);
  }

  async function waitFor(selector, timeout = 2500) {
    const started = performance.now();
    while (performance.now() - started < timeout) {
      const node = document.querySelector(selector);
      if (node) return node;
      await settle(40);
    }
    return null;
  }

  function fitsHorizontally() {
    return Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0) <= window.innerWidth + 1;
  }

  function op(rootNode, type) {
    return [...(rootNode?.querySelectorAll(".dir2-ai-ops article") || [])]
      .find(article => article.querySelector("small")?.textContent?.trim() === type) || null;
  }

  (async () => {
    await settle(120);
    root.dataset.qaSignalsViewport = String(window.innerWidth);

    const directory = await waitFor(".lab-directory-v2");
    const command = await waitFor(".lab-directory-v2 .dir2-command");
    const open = await waitFor("[data-dir2-ai-setup]");
    root.dataset.qaSignalsDirectory = directory ? "true" : "false";
    root.dataset.qaSignalsCommand = command ? "true" : "false";
    root.dataset.qaSignalsLauncher = open ? "true" : "false";

    open?.click();
    const modal = await waitFor(".dir2-ai-modal", 1200);
    root.dataset.qaSignalsModal = modal ? "true" : "false";
    const example = modal?.querySelector("[data-dir2-ai-example='signals']");
    root.dataset.qaSignalsExampleAvailable = example ? "true" : "false";
    example?.click();
    await settle(180);

    const result = modal?.querySelector(".dir2-ai-contract");
    const createWatch = op(result, "signals.create_watch");
    const attachSource = op(result, "signals.attach_source");
    const setFilter = op(result, "signals.set_filter");
    const setInterpretation = op(result, "signals.set_interpretation");
    const referenceSignal = op(result, "automation.reference_signal");

    root.dataset.qaSignalsPlanRendered = result?.textContent?.includes("Online signals") ? "true" : "false";
    root.dataset.qaSignalsCreateWatch = createWatch ? "true" : "false";
    root.dataset.qaSignalsAttachSource = attachSource ? "true" : "false";
    root.dataset.qaSignalsFilter = setFilter ? "true" : "false";
    root.dataset.qaSignalsInterpretation = setInterpretation ? "true" : "false";
    root.dataset.qaSignalsAutomationReference = referenceSignal ? "true" : "false";

    const panel = result?.querySelector(".continuum-preflight-panel");
    root.dataset.qaSignalsPreflight = panel ? "true" : "false";
    root.dataset.qaSignalsServiceBlocked = panel?.querySelector("[data-preflight-code='signals.service_required'][data-preflight-state='blocked']") ? "true" : "false";
    root.dataset.qaSignalsConnectionBlocked = panel?.querySelector("[data-preflight-code='connections.required'][data-preflight-state='blocked']") ? "true" : "false";
    root.dataset.qaSignalsBlockedCount = panel?.dataset.preflightBlockedCount || "missing";
    root.dataset.qaSignalsLinkedCount = panel?.dataset.preflightLinkedIssueCount || "missing";

    root.dataset.qaSignalsWatchRowBlocked = createWatch?.dataset.preflightOpState === "blocked" ? "true" : "false";
    root.dataset.qaSignalsSourceRowBlocked = attachSource?.dataset.preflightOpState === "blocked" ? "true" : "false";
    root.dataset.qaSignalsNoObservationLabel = modal?.textContent?.includes("NO ONLINE OBSERVATION") ? "true" : "false";
    root.dataset.qaSignalsFit = fitsHorizontally() ? "true" : "false";
    root.dataset.qaSignalsComplete = "true";
  })();
})();