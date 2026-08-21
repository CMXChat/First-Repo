(() => {
  "use strict";

  const HISTORY_KEY = "cmxLabAutomationsNavigation";
  const STORE_KEY = "cmx-lab-automations-v1";
  const CAPTURE_DELAY = 80;

  let restoring = false;
  let captureTimer = 0;
  let automationIntent = null;
  let dialogContext = null;

  const cssEscape = value => window.CSS?.escape ? CSS.escape(String(value)) : String(value).replace(/["\\]/g, "\\$&");

  function marker(value = history.state) {
    return value && typeof value === "object" ? value[HISTORY_KEY] || null : null;
  }

  function writeHistory(method, snapshot) {
    const state = history.state && typeof history.state === "object" ? { ...history.state } : {};
    state[HISTORY_KEY] = { version: 1, snapshot };
    try { history[method](state, "", `${location.pathname}${location.search}${location.hash}`); } catch {}
  }

  function activeDialog() {
    const dialogs = [...document.querySelectorAll('[role="dialog"]')].filter(node => !node.hidden);
    return dialogs.at(-1) || null;
  }

  function dialogKind(dialog = activeDialog()) {
    if (!dialog) return null;
    if (dialog.classList.contains("v7-manage-modal")) return "manage";
    if (dialog.classList.contains("v4-new-modal")) return "new";
    if (dialog.classList.contains("v4-planner-modal")) return "planner";
    if (dialog.classList.contains("v4-catalog-modal")) return "catalog";
    if (dialog.classList.contains("v4-info-modal")) return "capability";
    if (dialog.classList.contains("v3-details-modal")) return "details";
    if (dialog.classList.contains("v3-picker")) return dialog.querySelector("[data-choose-target]") ? "picker-target" : "picker-action";
    return "dialog";
  }

  function inferAutomationId() {
    if (automationIntent && automationIntent !== "__new__") return automationIntent;
    const title = document.querySelector(".v3-title-button strong")?.textContent?.trim();
    if (!title) return automationIntent;
    try {
      const store = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      const matches = (store?.automations || []).filter(item => String(item?.name || "").trim() === title);
      if (matches.length === 1) return matches[0].id || automationIntent;
    } catch {}
    return automationIntent;
  }

  function snapshot() {
    const editor = document.querySelector(".v3-editor-page");
    const dashboard = document.querySelector(".v3-dashboard");
    if (!editor && !dashboard) return null;
    const dialog = activeDialog();
    const stageNode = editor?.querySelector(".v3-stage-rail [data-stage].is-current, [data-stage].is-current");
    const stage = Number(stageNode?.dataset.stage);
    return {
      view: editor ? "editor" : "dashboard",
      automationId: editor ? inferAutomationId() : null,
      stage: editor && Number.isInteger(stage) ? stage : 0,
      controlView: editor ? editor.dataset.v10View || "definition" : null,
      surface: dashboard ? document.querySelector("[data-v4-surface].is-active")?.dataset.v4Surface || "automations" : null,
      tab: dashboard ? document.querySelector("[data-tab].is-active")?.dataset.tab || null : null,
      dialog: dialogKind(dialog),
      dialogContext: dialog ? dialogContext : null,
      flowOpen: editor ? document.querySelector("[data-flow-toggle]")?.getAttribute("aria-expanded") === "true" : false
    };
  }

  function sameSnapshot(left, right) {
    return JSON.stringify(left || null) === JSON.stringify(right || null);
  }

  function capture() {
    captureTimer = 0;
    if (restoring) return;
    const next = snapshot();
    if (!next) return;
    const current = marker()?.snapshot || null;
    if (!current) {
      writeHistory("replaceState", next);
      return;
    }
    if (!sameSnapshot(current, next)) writeHistory("pushState", next);
  }

  function scheduleCapture() {
    if (restoring) return;
    clearTimeout(captureTimer);
    captureTimer = window.setTimeout(capture, CAPTURE_DELAY);
  }

  function closeDialog() {
    const dialog = activeDialog();
    if (!dialog) return;
    const close = dialog.querySelector("[data-v7-manage-close], [data-v4-modal-close], [data-modal-close], [data-picker-close], [aria-label*='Close' i]");
    if (close) {
      close.click();
      return;
    }
    dialog.closest("[data-v7-manage-close], [data-v4-modal-close], [data-modal-close], [data-picker-close]")?.click();
  }

  function openEditor(target, done) {
    if (document.querySelector(".v3-editor-page")) {
      done();
      return;
    }
    const id = target.automationId;
    if (id && id !== "__new__") {
      automationIntent = id;
      const opener = document.querySelector(`[data-open="${cssEscape(id)}"]`);
      if (opener) {
        opener.click();
        requestAnimationFrame(done);
        return;
      }
    }
    automationIntent = "__new__";
    document.querySelector("[data-new]")?.click();
    requestAnimationFrame(() => {
      document.querySelector('[data-v4-start="manual"]')?.click();
      requestAnimationFrame(done);
    });
  }

  function restoreDialog(target) {
    const current = dialogKind();
    if (!target.dialog) {
      if (current) closeDialog();
      return;
    }
    if (current === target.dialog) return;
    if (current) closeDialog();

    requestAnimationFrame(() => {
      if (target.dialog === "manage") document.querySelector("[data-v7-manage]")?.click();
      else if (target.dialog === "details") document.querySelector("[data-details]")?.click();
      else if (target.dialog === "new") document.querySelector("[data-new]")?.click();
      else if (target.dialog === "catalog") {
        const kind = target.dialogContext?.catalogKind || "all";
        (document.querySelector(`[data-v4-open-catalog="${cssEscape(kind)}"]`) || document.querySelector("[data-v4-open-catalog]"))?.click();
      } else if (target.dialog === "picker-target") {
        const actionId = target.dialogContext?.actionId;
        document.querySelector(actionId ? `[data-pick-target="${cssEscape(actionId)}"]` : "[data-pick-target]")?.click();
      } else if (target.dialog === "picker-action") {
        const replaceId = target.dialogContext?.replaceId;
        document.querySelector(replaceId ? `[data-pick-action-type="${cssEscape(replaceId)}"]` : "[data-add-action]")?.click();
      } else if (target.dialog === "planner") {
        document.querySelector("[data-new]")?.click();
        requestAnimationFrame(() => document.querySelector('[data-v4-start="planner"]')?.click());
      }
    });
  }

  function restore(target) {
    if (!target) return;
    restoring = true;
    clearTimeout(captureTimer);
    captureTimer = 0;
    dialogContext = target.dialogContext || null;
    if (target.automationId) automationIntent = target.automationId;

    const afterView = () => {
      if (target.view === "editor") {
        const stage = document.querySelector(`[data-stage="${Number(target.stage) || 0}"]`);
        if (stage && !stage.classList.contains("is-current")) stage.click();
        const controlView = target.controlView || "definition";
        const controlTab = document.querySelector(`[data-v10-tab="${cssEscape(controlView)}"]`);
        const editor = document.querySelector(".v3-editor-page");
        if (controlTab && editor?.dataset.v10View !== controlView) controlTab.click();
        const flow = document.querySelector("[data-flow-toggle]");
        const open = flow?.getAttribute("aria-expanded") === "true";
        if (flow && open !== Boolean(target.flowOpen)) flow.click();
      } else {
        const surface = document.querySelector(`[data-v4-surface="${cssEscape(target.surface || "automations")}"]`);
        if (surface && !surface.classList.contains("is-active")) surface.click();
        if (target.tab) {
          const tab = document.querySelector(`[data-tab="${cssEscape(target.tab)}"]`);
          if (tab && !tab.classList.contains("is-active")) tab.click();
        }
      }

      requestAnimationFrame(() => {
        restoreDialog(target);
        requestAnimationFrame(() => {
          restoring = false;
          document.documentElement.dataset.labAutomationsHistory = "ready";
        });
      });
    };

    const editor = document.querySelector(".v3-editor-page");
    if (target.view === "dashboard" && editor) {
      document.querySelector("[data-close], [data-save-close]")?.click();
      requestAnimationFrame(afterView);
    } else if (target.view === "editor" && !editor) openEditor(target, afterView);
    else afterView();
  }

  function rememberContext(target) {
    if (target.matches("[data-open]")) automationIntent = target.dataset.open || null;
    else if (target.matches("[data-new]")) automationIntent = "__new__";
    else if (target.matches("[data-template]")) automationIntent = null;

    if (target.matches("[data-v4-open-catalog]")) dialogContext = { catalogKind: target.dataset.v4OpenCatalog || "all" };
    else if (target.matches("[data-pick-target]")) dialogContext = { actionId: target.dataset.pickTarget || null };
    else if (target.matches("[data-pick-action-type]")) dialogContext = { replaceId: target.dataset.pickActionType || null };
    else if (target.matches("[data-add-action]")) dialogContext = { replaceId: null };
    else if (target.matches("[data-v7-manage]")) dialogContext = { kind: "manage" };
    else if (target.matches('[data-v4-start="planner"]')) dialogContext = { kind: "planner" };
  }

  function boot() {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const initial = snapshot();
      if (!initial) return;
      writeHistory("replaceState", initial);
      document.documentElement.dataset.labAutomationsHistory = "ready";
    }));
  }

  document.addEventListener("click", event => {
    const target = event.target.closest?.("button,a,[role='button']");
    if (!target || target.closest?.("a.brand")) return;
    rememberContext(target);
    scheduleCapture();
  }, true);

  window.addEventListener("popstate", event => {
    const target = marker(event.state)?.snapshot;
    if (target) restore(target);
  });

  window.addEventListener("pageshow", () => {
    const current = marker()?.snapshot;
    if (current) document.documentElement.dataset.labAutomationsHistory = "ready";
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
