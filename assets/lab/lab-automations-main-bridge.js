(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  const STORAGE_KEY = "cmx-lab-automations-v1";
  const FOCUSED_PATH = "/automations/";
  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const esc = value => String(value ?? "").replace(/[&<>'\"]/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"
  }[char]));

  function loadAutomations() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (parsed?.version === 1 && Array.isArray(parsed.automations)) return parsed.automations;
    } catch {}
    return [];
  }

  function actionCount(item) {
    if (!Array.isArray(item?.actions) || !item.actions.length) return 1;
    return item.actions.filter(action => action?.enabled !== false).length;
  }

  function timingSummary(item) {
    if (item?.timing?.mode === "exact") return "Exact timing";
    if (item?.timing?.mode === "delay") return "Includes delay";
    if (item?.wait && item.wait !== "none") return "Includes delay";
    return "Immediate actions";
  }

  function draftCard(item) {
    const count = actionCount(item);
    return `<button class="lab-auto-card" type="button" data-focused-automation="${esc(item.id)}">
      <span class="lab-auto-card-top">
        <span><small>AUTOMATION DRAFT</small><strong>${esc(item.name || "Untitled automation")}</strong></span>
        <em>${esc(String(item.status || "Draft").toUpperCase())}</em>
      </span>
      <p>${esc(item.description || "Open this draft in the focused Automation workspace.")}</p>
      <div class="lab-auto-intro" style="margin:0">
        <span class="lab-auto-intro-mark" aria-hidden="true">⌁</span>
        <div><strong>${count} enabled action${count === 1 ? "" : "s"} · ${esc(timingSummary(item))}</strong><p>The focused builder owns trigger rules, action order, timing, reusable Action references and safe simulation.</p></div>
      </div>
      <span class="lab-auto-card-foot"><b>SHARED LAB DRAFT</b><small>Open in Automations →</small></span>
    </button>`;
  }

  function renderBridge() {
    const workspace = $("#labAutomationWorkspace");
    if (!workspace) return false;

    const automations = loadAutomations();
    const drafts = automations.filter(item => (item.status || "Draft") === "Draft");
    workspace.dataset.focusedBridge = "true";
    workspace.dataset.legacyAutomationContract = "Build a workflow";
    workspace.innerHTML = `
      <header class="lab-auto-head">
        <div>
          <small>AUTOMATIONS</small>
          <h2>Automation workspace</h2>
          <p>This archived prototype can still show its local drafts, while the canonical Automation workspace now lives outside the retired Lab namespace.</p>
        </div>
        <button class="lab-auto-new" type="button" data-open-focused-automations><span>⌁</span> Open Automations</button>
      </header>

      <div class="lab-auto-state-row" aria-label="Automation integration status">
        <span><small>DRAFTS</small><strong>${drafts.length}</strong></span>
        <span><small>WORKSPACE</small><strong>CONNECTED</strong></span>
        <span class="is-safe"><small>EXECUTION</small><strong>OFF IN ARCHIVE</strong></span>
      </div>

      <div class="lab-auto-intro">
        <span class="lab-auto-intro-mark" aria-hidden="true">↔</span>
        <div><strong>One Automation editor</strong><p>The historical integrated prototype is archived. <b>/automations/</b> is the canonical Automation workspace and remains the single focused editor.</p></div>
      </div>

      <div class="lab-auto-list-head"><strong>Automation drafts</strong><small>Open in /automations/</small></div>
      <div class="lab-auto-grid">
        ${drafts.length ? drafts.map(draftCard).join("") : `<div class="lab-auto-empty"><strong>No automation drafts yet</strong><p>Create the first one in the focused Automation workspace.</p><button class="lab-auto-new" type="button" data-new-focused-automation><span>＋</span> New automation</button></div>`}
      </div>

      <footer class="lab-auto-library-link">
        <div><small>REUSABLE ACTION DEFINITIONS</small><strong>Action library</strong><p>Saved prototype Actions can still be selected as explicit reusable references. Their original Action type, risk and status stay intact instead of being silently remapped.</p></div>
        <button type="button" data-main-action-library>Open action library ↓</button>
      </footer>`;

    const oldDialog = $("#labAutomationDialog");
    if (oldDialog?.open) oldDialog.close();
    oldDialog?.remove();
    document.body.dataset.labAutomationsIntegrated = "ready";
    return true;
  }

  function focusedUrl(params = {}) {
    const url = new URL(FOCUSED_PATH, location.origin);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    return `${url.pathname}${url.search}`;
  }

  function handleClick(event) {
    const card = event.target.closest?.("[data-focused-automation]");
    if (card) {
      event.preventDefault();
      location.assign(focusedUrl({ automation: card.dataset.focusedAutomation, from: "archive" }));
      return;
    }

    if (event.target.closest?.("[data-open-focused-automations]")) {
      event.preventDefault();
      location.assign(focusedUrl({ from: "archive" }));
      return;
    }

    if (event.target.closest?.("[data-new-focused-automation]")) {
      event.preventDefault();
      location.assign(focusedUrl({ new: "1", from: "archive" }));
      return;
    }

    if (event.target.closest?.("[data-main-action-library]")) {
      event.preventDefault();
      $(".lab-actions")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function boot(attempts = 12) {
    if (renderBridge()) return;
    if (attempts > 0) setTimeout(() => boot(attempts - 1), 60);
  }

  document.addEventListener("click", handleClick, true);
  document.addEventListener("cmx:lab-automations-updated", () => requestAnimationFrame(renderBridge));
  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY) requestAnimationFrame(renderBridge);
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => boot(), { once: true });
  else boot();
})();