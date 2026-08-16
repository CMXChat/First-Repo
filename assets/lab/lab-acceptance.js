(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /**
   * PHASE 8 ACCEPTANCE / STABILIZATION LAYER
   * ----------------------------------------
   * This file patches cross-module UX edges discovered during the full Lab
   * acceptance pass. It does not own records, actions, policy, incidents, audit,
   * execution state, or search truth.
   *
   * Keep this layer narrow:
   * - make the configurable policy editor safer on unit changes
   * - prevent dead-end global quick-create interactions
   * - add command/create-menu keyboard and ARIA hardening
   * - surface stale deep links instead of silently failing
   * - expose a browser-smoke readiness marker for CI
   *
   * OFFICIAL PROJECT HANDOFF:
   * Reproduce the approved behavior natively in React/router/components. Do not
   * port this DOM-patching layer into the official project. See CHECKINLABCLONE.md.
   */

  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];
  const NAV_KEY = "cmx-lab-navigation-v1";
  let lastPolicyUnit = "";
  let routeWarningKey = "";

  function safeJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  }

  function toast(message) {
    const node = $("#toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("is-visible"), 3200);
  }

  function visible(node) {
    return Boolean(node && !node.hidden && node.getClientRects().length);
  }

  function patchPolicyDialog() {
    const dialog = $("#labPolicyDialog");
    const input = $("#labIntervalValue", dialog);
    const unit = $("#labIntervalUnit", dialog);
    if (!dialog || !input || !unit) return;

    if (!dialog.dataset.acceptancePatched) {
      dialog.dataset.acceptancePatched = "true";
      lastPolicyUnit = unit.value === "days" ? "days" : "hours";
      dialog.addEventListener("change", event => {
        if (event.target !== unit) return;
        const nextUnit = unit.value === "days" ? "days" : "hours";
        const previousUnit = lastPolicyUnit || nextUnit;
        let value = Math.max(1, Number(input.value || 1));

        if (previousUnit !== nextUnit) {
          if (previousUnit === "hours" && nextUnit === "days") {
            const exactDays = value / 24;
            const roundedDays = Math.max(1, Math.min(30, Number.isInteger(exactDays) ? exactDays : Math.ceil(exactDays)));
            input.value = String(roundedDays);
            if (!Number.isInteger(exactDays)) toast("Converted to whole days. Review the window before saving.");
          } else if (previousUnit === "days" && nextUnit === "hours") {
            input.value = String(Math.max(1, Math.min(720, value * 24)));
          }
        }
        lastPolicyUnit = nextUnit;
        syncPolicyLimits(dialog);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }

    syncPolicyLimits(dialog);
  }

  function syncPolicyLimits(dialog = $("#labPolicyDialog")) {
    const input = $("#labIntervalValue", dialog);
    const unit = $("#labIntervalUnit", dialog);
    if (!input || !unit) return;
    const days = unit.value === "days";
    input.min = "1";
    input.max = days ? "30" : "720";
    input.step = "1";
    const value = Math.max(1, Math.min(Number(input.max), Number(input.value || 1)));
    if (Number(input.value) !== value) input.value = String(value);
    const help = input.closest("label")?.querySelector(":scope > small");
    if (help) help.textContent = days ? "1 to 30 days." : "1 to 720 hours (30 days).";
    lastPolicyUnit = days ? "days" : "hours";
  }

  function patchCreateMenu() {
    const menu = $("#labCreateMenu");
    const trigger = $("#labGlobalCreate");
    if (!menu) return;
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "Create Lab record or action");
    $$("[data-create-kind]", menu).forEach(button => {
      button.setAttribute("role", "menuitem");
      button.setAttribute("tabindex", "-1");
    });
    trigger?.setAttribute("aria-controls", "labCreateMenu");
    trigger?.setAttribute("aria-label", "Create a Lab record or action");
  }

  function patchGlobalControls() {
    const search = $("#labGlobalSearch");
    const create = $("#labGlobalCreate");
    if (search) {
      search.setAttribute("aria-label", "Search Check In Lab");
      search.setAttribute("title", "Search Check In Lab");
    }
    if (create) create.setAttribute("title", "Create new Lab item");
  }

  function focusCreateMenuFirstItem() {
    setTimeout(() => {
      const menu = $("#labCreateMenu");
      if (!menu || menu.hidden) return;
      const first = $("[data-create-kind]", menu);
      first?.focus({ preventScroll: true });
    }, 0);
  }

  function handleCreateMenuKeydown(event) {
    const menu = $("#labCreateMenu");
    if (!menu || menu.hidden || !menu.contains(event.target)) return;
    const items = $$("[data-create-kind]", menu).filter(item => !item.disabled);
    if (!items.length) return;
    const index = Math.max(0, items.indexOf(document.activeElement));
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      items[(index + delta + items.length) % items.length].focus();
    } else if (event.key === "Home") {
      event.preventDefault(); items[0].focus();
    } else if (event.key === "End") {
      event.preventDefault(); items.at(-1).focus();
    }
  }

  function trapPaletteFocus(event) {
    if (event.key !== "Tab") return;
    const palette = $("#labCommandPalette");
    if (!palette || palette.hidden) return;
    const focusables = $$("input,button,[href],[tabindex]:not([tabindex='-1'])", palette)
      .filter(node => !node.disabled && visible(node));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }

  function preventDeadEndNote(event) {
    const note = event.target.closest("#labCreateMenu [data-create-kind='note']");
    if (!note) return;
    const available = $('.view.is-active [data-crm-action="note"], .view.is-active [data-inventory-action="note"]');
    if (available) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    $("#labCreateMenu")?.setAttribute("hidden", "");
    $("#labGlobalCreate")?.setAttribute("aria-expanded", "false");
    toast("Open a person, organization, document, or digital asset before adding a note.");
  }

  function decodeLabRoute() {
    if (!location.hash.startsWith("#lab=")) return null;
    try {
      const text = decodeURIComponent(location.hash.slice(5));
      const split = text.indexOf(":");
      return split < 0 ? { type: text, id: "" } : { type: text.slice(0, split), id: text.slice(split + 1) };
    } catch { return null; }
  }

  function exactRouteExists(route) {
    if (!route?.id) return true;
    if (route.type === "person") return (safeJson("cmx-lab-crm-v1", { people: [] }).people || []).some(item => item.id === route.id);
    if (route.type === "organization") return (safeJson("cmx-lab-crm-v1", { organizations: [] }).organizations || []).some(item => item.id === route.id);
    if (route.type === "document") return (safeJson("cmx-lab-inventory-v1", { documents: [] }).documents || []).some(item => item.id === route.id);
    if (route.type === "asset") return (safeJson("cmx-lab-inventory-v1", { assets: [] }).assets || []).some(item => item.id === route.id);
    if (route.type === "action") return (safeJson("cmx-lab-actions-v1", { actions: [] }).actions || []).some(item => item.id === route.id);
    if (route.type === "incident") return Boolean(safeJson("cmx-lab-incidents-v1", { incidents: {} }).incidents?.[route.id]);
    if (route.type === "audit") return (safeJson("cmx-lab-audit-v1", { events: [] }).events || []).some(item => item.id === route.id);
    if (route.type === "version") return Boolean(safeJson("cmx-lab-versions-v1", { objects: {} }).objects?.[route.id]);
    return true;
  }

  function fallbackView(type) {
    if (["person", "organization", "document", "asset"].includes(type)) return "records";
    if (type === "action") return "actions";
    if (["incident", "audit", "version", "health"].includes(type)) return "activity";
    return "overview";
  }

  function validateDeepRoute() {
    const route = decodeLabRoute();
    if (!route || exactRouteExists(route)) return;
    const key = `${route.type}:${route.id}`;
    if (routeWarningKey === key) return;
    routeWarningKey = key;
    const view = fallbackView(route.type);
    $$(`[data-view="${view}"]`).find(button => !button.hidden)?.click();
    const encoded = encodeURIComponent(`view:${view}`);
    history.replaceState({ ...(history.state || {}), labRoute: `view:${view}` }, "", `${location.pathname}${location.search}#lab=${encoded}`);
    toast("That Lab item no longer exists. Opened its workspace instead.");
  }

  function markAcceptanceReady(attempt = 0) {
    const required = [
      ".lab-crm",
      ".lab-actions",
      ".lab-sequence-root",
      ".lab-audit-topbar",
      "#labCommandPalette",
      "#labPlanAssurance"
    ];
    const ready = document.body?.dataset.labMode === "true" && required.every(selector => $(selector));
    if (ready) {
      document.body.dataset.labAcceptance = "ready";
      document.documentElement.dataset.labAcceptance = "ready";
      window.CMX_LAB_ACCEPTANCE = Object.freeze({ ready: true, checkedAt: new Date().toISOString() });
      return;
    }
    if (attempt < 40) setTimeout(() => markAcceptanceReady(attempt + 1), 50);
    else {
      document.body.dataset.labAcceptance = "incomplete";
      console.warn("[LAB ACCEPTANCE] One or more integration surfaces did not initialize.");
    }
  }

  function patchSurfaces() {
    patchPolicyDialog();
    patchCreateMenu();
    patchGlobalControls();
  }

  document.addEventListener("click", event => {
    preventDeadEndNote(event);
    if (event.target.closest("#labGlobalCreate")) focusCreateMenuFirstItem();
  }, true);
  document.addEventListener("keydown", event => {
    trapPaletteFocus(event);
    handleCreateMenuKeydown(event);
  }, true);

  const observer = new MutationObserver(() => patchSurfaces());
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open", "hidden"] });

  window.addEventListener("popstate", () => setTimeout(validateDeepRoute, 220));
  window.addEventListener("hashchange", () => setTimeout(validateDeepRoute, 220));

  patchSurfaces();
  setTimeout(validateDeepRoute, 650);
  markAcceptanceReady();
})();
