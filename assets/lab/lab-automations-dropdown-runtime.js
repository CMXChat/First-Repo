(() => {
  "use strict";

  function closeAll(except = null) {
    document.querySelectorAll(".smart-select.is-open").forEach(select => {
      if (select === except) return;
      select.classList.remove("is-open");
      const trigger = select.querySelector("[data-dropdown-trigger]");
      const menu = select.querySelector(".smart-menu");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      if (menu) menu.hidden = true;
    });
  }

  document.addEventListener("click", event => {
    const trigger = event.target.closest("[data-dropdown-trigger]");
    if (trigger) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const select = trigger.closest(".smart-select");
      const menu = select?.querySelector(".smart-menu");
      if (!select || !menu) return;
      const opening = !select.classList.contains("is-open");
      closeAll(select);
      select.classList.toggle("is-open", opening);
      menu.hidden = !opening;
      trigger.setAttribute("aria-expanded", String(opening));
      if (opening) requestAnimationFrame(() => menu.querySelector("[data-dropdown-search]")?.focus());
      return;
    }

    if (!event.target.closest(".smart-select")) closeAll();
  }, true);

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const open = document.querySelector(".smart-select.is-open");
    if (!open) return;
    event.preventDefault();
    closeAll();
    open.querySelector("[data-dropdown-trigger]")?.focus();
  }, true);
})();
