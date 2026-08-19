(() => {
  "use strict";

  const root = document.documentElement;
  const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function settle(ms = 50) {
    await frame();
    await wait(ms);
  }

  function fitsHorizontally() {
    return Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0) <= window.innerWidth + 1;
  }

  function tap(node, minimum = 44) {
    return Boolean(node) && node.getBoundingClientRect().height >= minimum - 0.5;
  }

  function operationExists(result, type) {
    return [...(result?.querySelectorAll(".v5-planner-ops article small") || [])]
      .some(node => node.textContent.trim() === type);
  }

  (async () => {
    await settle(120);
    root.dataset.qaPlannerEditViewport = String(window.innerWidth);

    const create = document.querySelector("[data-new]");
    create?.click();
    await settle(60);

    const planner = document.querySelector("[data-v4-start='planner']");
    planner?.click();
    await settle(80);

    const modal = document.querySelector(".v4-planner-modal");
    const example = modal?.querySelector("[data-v5-planner-example='missed-checkin']");
    example?.click();
    await settle(140);

    let result = modal?.querySelector(".v5-planner-result:not([hidden])");
    root.dataset.qaPlannerEditResult = result ? "true" : "false";
    root.dataset.qaPlannerEditActionsBefore = String(result?.querySelectorAll("[data-v5-plan-action]").length || 0);
    root.dataset.qaPlannerEditWaitBefore = String(result?.querySelectorAll("[data-v5-plan-row='wait']").length || 0);
    root.dataset.qaPlannerEditWaitOperationBefore = operationExists(result, "automation.add_wait") ? "true" : "false";
    root.dataset.qaPlannerEditRuntimeBefore = result?.querySelector("[data-preflight-code='runtime.required'][data-preflight-state='blocked']") ? "true" : "false";

    const removeBackup = result?.querySelector("[data-v5-planner-remove-action='backup']");
    root.dataset.qaPlannerEditRemoveTap = tap(removeBackup) ? "true" : "false";
    removeBackup?.click();
    await settle(160);

    result = modal?.querySelector(".v5-planner-result:not([hidden])");
    root.dataset.qaPlannerEditActionsAfter = String(result?.querySelectorAll("[data-v5-plan-action]").length || 0);
    root.dataset.qaPlannerEditWaitAfter = String(result?.querySelectorAll("[data-v5-plan-row='wait']").length || 0);
    root.dataset.qaPlannerEditWaitOperationAfter = operationExists(result, "automation.add_wait") ? "true" : "false";
    root.dataset.qaPlannerEditRuntimeAfter = result?.querySelector("[data-preflight-code='runtime.required']") ? "true" : "false";
    root.dataset.qaPlannerEditAudienceAfter = result?.querySelector("[data-preflight-code='directory.audience_required']") ? "true" : "false";
    root.dataset.qaPlannerEditCount = result?.querySelector(".v5-planner-edit-note>b")?.textContent?.includes("1 edit") ? "true" : "false";

    const onlyAction = result?.querySelector("[data-v5-planner-remove-action]");
    root.dataset.qaPlannerEditOnlyActionDisabled = onlyAction?.disabled ? "true" : "false";
    root.dataset.qaPlannerEditOnlyActionLabel = onlyAction?.textContent?.trim() === "Only action" ? "true" : "false";
    root.dataset.qaPlannerEditFit = fitsHorizontally() ? "true" : "false";
    root.dataset.qaPlannerEditComplete = "true";
  })();
})();