(() => {
  "use strict";

  const RETURN_TO_LAB = "/lab/#lab=view%3Aactions";
  const HISTORY_KEY = "cmxLabAutomationsNavigation";
  const STORE_KEY = "cmx-lab-automations-v1";

  let restoringHistory = false;
  let captureFrame = 0;
  let currentDepth = 0;
  let automationIntent = null;
  let dialogContext = null;
  const timeline = [];

  function configureReturnNavigation() {
    document.querySelectorAll("a.brand").forEach(link => {
      link.href = RETURN_TO_LAB;
      link.setAttribute("aria-label", "Back to Check In Lab Actions");
      link.title = "Back to Lab · Actions";
    });
  }

  function cleanOneShotQuery() {
    const url = new URL(location.href);
    let changed = false;
    ["automation", "new", "from"].forEach(key => {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    });
    if (changed) history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function openRequestedTarget() {
    const params = new URLSearchParams(location.search);
    const automationId = params.get("automation");
    const wantsNew = params.get("new") === "1";
    let opened = false;

    if (automationId) {
      automationIntent = automationId;
      const target = document.querySelector(`[data-open="${cssEscape(automationId)}"]`);
      if (target) {
        target.click();
        opened = true;
      }
    } else if (wantsNew) {
      automationIntent = "__new__";
      const target = document.querySelector("[data-new]");
      if (target) {
        target.click();
        opened = true;
      }
    }

    if (automationId || wantsNew) cleanOneShotQuery();
    return opened;
  }

  function cssEscape(value) {
    if (window.CSS?.escape) return CSS.escape(String(value));
    return String(value).replace(/["\\]/g, "\\$&");
  }

  function historyBaseState() {
    return history.state && typeof history.state === "object" ? { ...history.state } : {};
  }

  function historyMarker(value = history.state) {
    return value && typeof value === "object" ? value[HISTORY_KEY] || null : null;
  }

  function writeHistory(method, snapshot, depth) {
    const state = historyBaseState();
    state[HISTORY_KEY] = { version: 1, depth, snapshot };
    try {
      history[method](state, "", `${location.pathname}${location.search}${location.hash}`);
    } catch {}
  }

  function activeDialog() {
    const dialogs = [...document.querySelectorAll('[role="dialog"]')].filter(node => !node.hidden && node.getClientRects().length !== 0);
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
    if (dialog.classList.contains("v3-picker")) {
      return dialog.querySelector("[data-choose-target]") ? "picker-target" : "picker-action";
    }
    return "dialog";
  }

  function activeSurface() {
    return document.querySelector("[data-v4-surface].is-active")?.dataset.v4Surface || "automations";
  }

  function activeTab() {
    return document.querySelector("[data-tab].is-active")?.dataset.tab || null;
  }

  function activeStage() {
    const node = document.querySelector(".v3-stage-rail [data-stage].is-current, [data-stage].is-current");
    const value = Number(node?.dataset.stage);
    return Number.isInteger(value) ? value : 0;
  }

  function inferAutomationId() {
    if (automationIntent) return automationIntent;
    const prior = historyMarker()?.snapshot?.automationId;
    if (prior) return prior;
    const title = document.querySelector(".v3-title-button strong")?.textContent?.trim();
    if (!title) return null;
    try {
      const store = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      const matches = (store?.automations || []).filter(item => String(item?.name || "").trim() === title);
      if (matches.length === 1) return matches[0].id || null;
    } catch {}
    return null;
  }

  function readNavigationSnapshot() {
    const editor = document.querySelector(".v3-editor-page");
    const dashboard = document.querySelector(".v3-dashboard");
    const dialog = activeDialog();
    if (!editor && !dashboard && !dialog) return null;
    return {
      view: editor ? "editor" : "dashboard",
      automationId: editor ? inferAutomationId() : null,
      stage: editor ? activeStage() : null,
      surface: editor ? null : activeSurface(),
      tab: editor ? null : activeTab(),
      dialog: dialogKind(dialog),
      dialogContext: dialog ? dialogContext : null,
      flowOpen: editor ? document.querySelector("[data-flow-toggle]")?.getAttribute("aria-expanded") === "true" : false
    };
  }

  function sameSnapshot(left, right) {
    return JSON.stringify(left || null) === JSON.stringify(right || null);
  }

  function initializeHistory() {
    const snapshot = readNavigationSnapshot();
    if (!snapshot) return;
    const existing = historyMarker();
    currentDepth = Number.isInteger(existing?.depth) ? existing.depth : 0;
    timeline[currentDepth] = snapshot;
    writeHistory("replaceState", snapshot, currentDepth);
    document.documentElement.dataset.labAutomationsHistory = "ready";
  }

  function captureNavigationState() {
    captureFrame = 0;
    if (restoringHistory) return;
    const snapshot = readNavigationSnapshot();
    if (!snapshot) return;
    const current = historyMarker()?.snapshot || timeline[currentDepth] || null;
    if (!current) {
      timeline[currentDepth] = snapshot;
      writeHistory("replaceState", snapshot, currentDepth);
      return;
    }
    if (sameSnapshot(current, snapshot)) return;
    timeline.length = currentDepth + 1;
    currentDepth += 1;
    timeline[currentDepth] = snapshot;
    writeHistory("pushState", snapshot, currentDepth);
  }

  function scheduleHistoryCapture() {
    if (restoringHistory || captureFrame) return;
    captureFrame = requestAnimationFrame(() => requestAnimationFrame(captureNavigationState));
  }

  function closeCurrentDialog() {
    const dialog = activeDialog();
    if (!dialog) return false;
    const close = dialog.querySelector([
      "[data-v7-manage-close]",
      "[data-v4-modal-close]",
      "[data-modal-close]",
      "[data-picker-close]",
      '[aria-label*="Close" i]'
    ].join(","));
    if (close) {
      close.click();
      return true;
    }
    const backdrop = dialog.closest("[data-v7-manage-close], [data-v4-modal-close], [data-modal-close], [data-picker-close]");
    if (backdrop) {
      backdrop.click();
      return true;
    }
    return false;
  }

  function openEditorFromSnapshot(snapshot, done) {
    if (document.querySelector(".v3-editor-page")) {
      done();
      return;
    }
    let opener = null;
    if (snapshot.automationId && snapshot.automationId !== "__new__") {
      opener = document.querySelector(`[data-open="${cssEscape(snapshot.automationId)}"]`);
      automationIntent = snapshot.automationId;
    }
    if (opener) {
      opener.click();
      requestAnimationFrame(done);
      return;
    }
    automationIntent = "__new__";
    document.querySelector("[data-new]")?.click();
    requestAnimationFrame(() => {
      const manual = document.querySelector('[data-v4-start="manual"]');
      if (manual) manual.click();
      requestAnimationFrame(done);
    });
  }

  function restoreKnownDialog(snapshot) {
    if (!snapshot.dialog || activeDialog()) return;
    if (snapshot.dialog === "manage") {
      document.querySelector("[data-v7-manage]")?.click();
      return;
    }
    if (snapshot.dialog === "details") {
      document.querySelector("[data-details]")?.click();
      return;
    }
    if (snapshot.dialog === "new") {
      document.querySelector("[data-new]")?.click();
      return;
    }
    if (snapshot.dialog === "catalog") {
      const kind = snapshot.dialogContext?.catalogKind || "all";
      const opener = document.querySelector(`[data-v4-open-catalog="${cssEscape(kind)}"]`) || document.querySelector("[data-v4-open-catalog]");
      opener?.click();
      return;
    }
    if (snapshot.dialog === "picker-target") {
      const actionId = snapshot.dialogContext?.actionId;
      const selector = actionId ? `[data-pick-target="${cssEscape(actionId)}"]` : "[data-pick-target]";
      document.querySelector(selector)?.click();
      return;
    }
    if (snapshot.dialog === "picker-action") {
      const replaceId = snapshot.dialogContext?.replaceId;
      const selector = replaceId ? `[data-pick-action-type="${cssEscape(replaceId)}"]` : "[data-add-action]";
      document.querySelector(selector)?.click();
      return;
    }
    if (snapshot.dialog === "planner") {
      document.querySelector("[data-new]")?.click();
      requestAnimationFrame(() => document.querySelector('[data-v4-start="planner"]')?.click());
    }
  }

  function restoreNavigationSnapshot(snapshot) {
    if (!snapshot) return;
    restoringHistory = true;
    if (snapshot.automationId) automationIntent = snapshot.automationId;
    dialogContext = snapshot.dialogContext || null;

    const currentDialog = dialogKind();
    if (currentDialog && currentDialog !== snapshot.dialog) closeCurrentDialog();

    requestAnimationFrame(() => {
      const editor = document.querySelector(".v3-editor-page");
      if (snapshot.view === "dashboard" && editor) {
        document.querySelector("[data-close], [data-save-close]")?.click();
      }

      const afterView = () => {
        if (snapshot.view === "editor") {
          const stageButton = document.querySelector(`[data-stage="${Number(snapshot.stage) || 0}"]`);
          if (stageButton && !stageButton.classList.contains("is-current")) stageButton.click();
          const flow = document.querySelector("[data-flow-toggle]");
          const open = flow?.getAttribute("aria-expanded") === "true";
          if (flow && open !== Boolean(snapshot.flowOpen)) flow.click();
        } else {
          const surface = document.querySelector(`[data-v4-surface="${cssEscape(snapshot.surface || "automations")}"]`);
          if (surface && !surface.classList.contains("is-active")) surface.click();
          if (snapshot.tab) {
            const tab = document.querySelector(`[data-tab="${cssEscape(snapshot.tab)}"]`);
            if (tab && !tab.classList.contains("is-active")) tab.click();
          }
        }

        requestAnimationFrame(() => {
          if (!snapshot.dialog && activeDialog()) closeCurrentDialog();
          else restoreKnownDialog(snapshot);
          requestAnimationFrame(() => {
            restoringHistory = false;
            timeline[currentDepth] = readNavigationSnapshot() || snapshot;
          });
        });
      };

      if (snapshot.view === "editor" && !document.querySelector(".v3-editor-page")) openEditorFromSnapshot(snapshot, afterView);
      else afterView();
    });
  }

  function previousDashboardDepth() {
    for (let depth = currentDepth - 1; depth >= 0; depth -= 1) {
      if (timeline[depth]?.view === "dashboard" && !timeline[depth]?.dialog) return depth;
    }
    return -1;
  }

  function interceptReverseNavigation(event, target) {
    if (restoringHistory || currentDepth <= 0) return false;
    const current = readNavigationSnapshot();
    if (!current) return false;

    const modalClose = target.matches([
      "[data-v7-manage-close]",
      "[data-v4-modal-close]",
      "[data-modal-close]",
      "[data-picker-close]"
    ].join(","));
    if (modalClose && current.dialog && timeline[currentDepth - 1]) {
      event.preventDefault();
      event.stopImmediatePropagation();
      history.back();
      return true;
    }

    if (target.matches("[data-back]") && current.view === "editor" && timeline[currentDepth - 1]?.view === "editor") {
      event.preventDefault();
      event.stopImmediatePropagation();
      history.back();
      return true;
    }

    if (target.matches("[data-close], [data-save-close]") && current.view === "editor") {
      const depth = previousDashboardDepth();
      if (depth >= 0) {
        event.preventDefault();
        event.stopImmediatePropagation();
        history.go(depth - currentDepth);
        return true;
      }
    }
    return false;
  }

  function rememberInteractionContext(target) {
    if (target.matches("[data-open]")) automationIntent = target.dataset.open || null;
    else if (target.matches("[data-new]")) automationIntent = "__new__";

    if (target.matches("[data-v4-open-catalog]")) dialogContext = { catalogKind: target.dataset.v4OpenCatalog || "all" };
    else if (target.matches("[data-pick-target]")) dialogContext = { actionId: target.dataset.pickTarget || null };
    else if (target.matches("[data-pick-action-type]")) dialogContext = { replaceId: target.dataset.pickActionType || null };
    else if (target.matches("[data-add-action]")) dialogContext = { replaceId: null };
    else if (target.matches("[data-v7-manage]")) dialogContext = { kind: "manage" };
    else if (target.matches('[data-v4-start="planner"]')) dialogContext = { kind: "planner" };
  }

  function refreshIntegration() {
    requestAnimationFrame(configureReturnNavigation);
  }

  function boot() {
    configureReturnNavigation();
    openRequestedTarget();
    refreshIntegration();
    requestAnimationFrame(() => requestAnimationFrame(initializeHistory));
    document.documentElement.dataset.labAutomationsRouteIntegration = "ready";
  }

  document.addEventListener("click", event => {
    const target = event.target.closest?.("button,a,[role='button'],[data-v4-modal-close],[data-v7-manage-close],[data-modal-close],[data-picker-close]");
    if (!target) return;

    const brand = target.closest?.("a.brand");
    if (brand) {
      event.preventDefault();
      location.assign(RETURN_TO_LAB);
      return;
    }

    rememberInteractionContext(target);
    if (interceptReverseNavigation(event, target)) return;
    scheduleHistoryCapture();
    refreshIntegration();
  }, true);

  window.addEventListener("popstate", event => {
    const marker = historyMarker(event.state);
    if (!marker?.snapshot) return;
    currentDepth = Number.isInteger(marker.depth) ? marker.depth : 0;
    timeline[currentDepth] = marker.snapshot;
    restoreNavigationSnapshot(marker.snapshot);
  });

  window.addEventListener("pageshow", () => {
    const marker = historyMarker();
    if (!marker?.snapshot) return;
    currentDepth = Number.isInteger(marker.depth) ? marker.depth : 0;
    timeline[currentDepth] = marker.snapshot;
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(boot), { once: true });
  else requestAnimationFrame(boot);
})();
