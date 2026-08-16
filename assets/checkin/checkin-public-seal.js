(() => {
  "use strict";

  // Cosmetic public masking only. Source counts stay in the hidden status nodes
  // for the existing frontend logic and are never replaced as backend truth.
  const $ = (selector, root = document) => root.querySelector(selector);

  function realActionCount() {
    const value = Number(("" + ($("#actionPublicCount")?.textContent || "0")).trim());
    return Number.isInteger(value) && value >= 0 ? value : 0;
  }

  function sealPackage() {
    const packageRoot = $("#protectedPackage");
    if (!packageRoot) return;

    const heading = packageRoot.querySelector(".refine-head h2");
    if (heading) heading.textContent = "Contingency package";

    const cards = packageRoot.querySelectorAll(".package-card");
    const labels = ["SEALED", "RESTRICTED", "SEALED", realActionCount() > 0 ? "CONFIGURED" : "SEALED"];
    cards.forEach((card, index) => {
      const small = card.querySelector("small");
      if (small && labels[index]) small.textContent = labels[index];
    });
  }

  function boot() {
    sealPackage();
    const actionCount = $("#actionPublicCount");
    if (actionCount) new MutationObserver(sealPackage).observe(actionCount, { childList: true, characterData: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();