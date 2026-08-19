(() => {
  "use strict";

  const root = document.documentElement;
  const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  function fitsHorizontally() {
    return Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0) <= window.innerWidth + 1;
  }

  function tap(node, minimum = 44) {
    return Boolean(node) && node.getBoundingClientRect().height >= minimum - 0.5;
  }

  async function settle(ms = 35) {
    await frame();
    await wait(ms);
  }

  (async () => {
    await settle(80);
    root.dataset.qaV6Viewport = String(window.innerWidth);

    const draft = document.querySelector("[data-open]");
    if (!draft) {
      root.dataset.qaV6ActionStack = "missing-draft";
      return;
    }
    draft.click();
    await settle();

    const actionsStage = document.querySelector('[data-stage="2"]');
    if (!actionsStage) {
      root.dataset.qaV6ActionStack = "missing-actions-stage";
      return;
    }
    actionsStage.click();
    await settle(60);

    const first = document.querySelector(".v3-actions-stage [data-action-card]");
    const firstToggle = first?.querySelector("[data-v6-action-toggle]");
    const firstRemove = first?.querySelector("[data-v6-remove-step]");
    root.dataset.qaV6Loaded = document.documentElement.dataset.labAutomationsActionStack === "v6-mobile" ? "true" : "false";
    root.dataset.qaV6InitialOne = document.querySelectorAll(".v3-actions-stage [data-action-card]").length === 1 ? "true" : "false";
    root.dataset.qaV6InitialExpanded = first?.classList.contains("is-v6-expanded") ? "true" : "false";
    root.dataset.qaV6SingleRemoveDisabled = firstRemove?.disabled ? "true" : "false";
    root.dataset.qaV6InitialTapTargets = tap(firstToggle) && tap(firstRemove) ? "true" : "false";

    first?.querySelector("[data-duplicate-action]")?.click();
    await settle(70);

    let cards = [...document.querySelectorAll(".v3-actions-stage [data-action-card]")];
    root.dataset.qaV6Duplicated = cards.length === 2 ? "true" : "false";
    root.dataset.qaV6RemoveEnabled = cards.length === 2 && cards.every(card => !card.querySelector("[data-v6-remove-step]")?.disabled) ? "true" : "false";

    document.querySelector("[data-v6-collapse-all]")?.click();
    await settle();
    cards = [...document.querySelectorAll(".v3-actions-stage [data-action-card]")];
    const collapsed = cards.every(card => !card.classList.contains("is-v6-expanded"));
    const compact = cards.every(card => card.getBoundingClientRect().height < 135);
    const detailsHidden = cards.every(card => {
      const fields = card.querySelector(".v3-action-fields");
      return !fields || getComputedStyle(fields).display === "none";
    });
    root.dataset.qaV6Collapsed = collapsed ? "true" : "false";
    root.dataset.qaV6Compact = compact ? "true" : "false";
    root.dataset.qaV6DetailsHidden = detailsHidden ? "true" : "false";

    cards[1]?.querySelector("[data-v6-action-toggle]")?.click();
    await settle();
    cards = [...document.querySelectorAll(".v3-actions-stage [data-action-card]")];
    root.dataset.qaV6Accordion = cards.filter(card => card.classList.contains("is-v6-expanded")).length === 1 && cards[1]?.classList.contains("is-v6-expanded") ? "true" : "false";
    const secondToggle = cards[1]?.querySelector("[data-v6-action-toggle]");
    const secondRemove = cards[1]?.querySelector("[data-v6-remove-step]");
    root.dataset.qaV6ExpandedTapTargets = tap(secondToggle) && tap(secondRemove) ? "true" : "false";

    secondRemove?.click();
    await settle(80);
    cards = [...document.querySelectorAll(".v3-actions-stage [data-action-card]")];
    root.dataset.qaV6Removed = cards.length === 1 ? "true" : "false";
    root.dataset.qaV6FinalRemoveDisabled = cards[0]?.querySelector("[data-v6-remove-step]")?.disabled ? "true" : "false";
    root.dataset.qaV6HorizontalFit = fitsHorizontally() ? "true" : "false";
    root.dataset.qaV6ActionStack = "complete";
  })();
})();