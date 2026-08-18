(() => {
  "use strict";

  const NAV_SELECTOR = "[data-step], [data-back], [data-continue], [data-open], [data-new]";
  let keyboardWasActive = false;
  let settleToken = 0;
  let timers = [];

  function clearTimers() {
    timers.forEach(timer => window.clearTimeout(timer));
    timers = [];
  }

  function isEditor() {
    return Boolean(document.querySelector(".editor-page"));
  }

  function hardResetTop() {
    if (!isEditor()) return;
    const root = document.documentElement;
    const priorInlineBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    root.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    if (priorInlineBehavior) root.style.scrollBehavior = priorInlineBehavior;
    else root.style.removeProperty("scroll-behavior");
  }

  function centerCurrentStep() {
    const wrap = document.querySelector(".step-rail-wrap");
    const current = wrap?.querySelector(".step-chip.is-current");
    if (!wrap || !current) return;
    const left = current.offsetLeft - (wrap.clientWidth - current.offsetWidth) / 2;
    wrap.scrollLeft = Math.max(0, left);
  }

  function settleNavigation() {
    const token = ++settleToken;
    clearTimers();

    const settle = () => {
      if (token !== settleToken || !isEditor()) return;
      hardResetTop();
      centerCurrentStep();
    };

    requestAnimationFrame(() => requestAnimationFrame(settle));
    timers.push(window.setTimeout(settle, 60));
    if (keyboardWasActive) {
      timers.push(window.setTimeout(settle, 180));
      timers.push(window.setTimeout(settle, 320));
    }
    keyboardWasActive = false;
  }

  function prepareNavigation(target) {
    if (!target?.closest?.(NAV_SELECTOR)) return false;
    const active = document.activeElement;
    keyboardWasActive = Boolean(
      active &&
      (active.matches?.("input, textarea, [contenteditable='true']") || active.isContentEditable)
    );
    if (keyboardWasActive && active instanceof HTMLElement) active.blur();
    hardResetTop();
    return true;
  }

  document.addEventListener("pointerdown", event => {
    prepareNavigation(event.target);
  }, true);

  document.addEventListener("click", event => {
    if (!event.target?.closest?.(NAV_SELECTOR)) return;
    settleNavigation();
  }, true);

  window.addEventListener("pageshow", () => {
    if (!isEditor()) return;
    hardResetTop();
    requestAnimationFrame(centerCurrentStep);
  });
})();
