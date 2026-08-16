(() => {
  "use strict";

  /*
   * Public sealed views for Records, Activity, and configured Actions.
   *
   * Truth boundary:
   * - Never invent records, recipients, action types, delays, or delivery results.
   * - Action slots are created only from the real public configured action count.
   * - Public Activity uses only already-public switch facts from the live status UI.
   * - Protected collections remain inaccessible until the existing private session opens.
   *
   * Backend follow-up is documented in:
   * specs/003-server-checkin/PUBLIC-PROJECTION-NEXT.md
   */

  const $ = (selector, root = document) => root.querySelector(selector);
  const isUnlocked = () => document.body.classList.contains("operator-unlocked");

  function text(selector, fallback = "Pending") {
    const value = ($(selector)?.textContent || "").trim();
    return value || fallback;
  }

  function actionCount() {
    const value = Number(text("#actionPublicCount", "0"));
    return Number.isInteger(value) && value >= 0 ? value : 0;
  }

  function syncMode() {
    const value = text("#syncState", "CONNECTING").toUpperCase();
    if (value.includes("SYNCHRONIZED")) return "live";
    if (value.includes("UNAVAILABLE")) return "offline";
    if (value.includes("PARTIALLY")) return "limited";
    return "connecting";
  }

  function requestAccess() {
    $("#operatorButton")?.click();
  }

  function ensureRecordsVault() {
    const panel = $('[data-view-panel="records"]');
    if (!panel || $("#recordsVaultPublic")) return;

    const section = document.createElement("section");
    section.id = "recordsVaultPublic";
    section.className = "records-vault-public vault-panel";
    section.innerHTML = `
      <div class="vault-panel-head">
        <div>
          <small>CONTINGENCY ARCHIVE</small>
          <h2>Protected records</h2>
        </div>
        <span class="vault-seal"><i></i>SEALED</span>
      </div>

      <div class="archive-visual" aria-hidden="true">
        <span class="archive-orbit archive-orbit-a"></span>
        <span class="archive-orbit archive-orbit-b"></span>
        <span class="archive-core"><i></i><i></i><i></i></span>
        <b>RESTRICTED</b>
      </div>

      <div class="archive-categories">
        <button type="button" class="archive-category archive-blue">
          <span class="archive-category-icon">▱</span>
          <span><strong>Documents</strong><small>SEALED</small></span>
          <em>↗</em>
        </button>
        <button type="button" class="archive-category archive-violet">
          <span class="archive-category-icon">◎</span>
          <span><strong>People</strong><small>RESTRICTED</small></span>
          <em>↗</em>
        </button>
        <button type="button" class="archive-category archive-pink">
          <span class="archive-category-icon">▦</span>
          <span><strong>Organizations</strong><small>SEALED</small></span>
          <em>↗</em>
        </button>
      </div>

      <div class="archive-foot">
        <span><i></i><strong>PRIVATE CONTENT HIDDEN</strong></span>
        <button type="button" id="recordsVaultUnlock">Unlock archive</button>
      </div>`;

    section.querySelectorAll(".archive-category").forEach(button => button.addEventListener("click", requestAccess));
    section.querySelector("#recordsVaultUnlock")?.addEventListener("click", requestAccess);

    const heading = panel.querySelector(".view-heading");
    heading?.insertAdjacentElement("afterend", section);
  }

  function ensureActivityTrace() {
    const panel = $('[data-view-panel="activity"]');
    if (!panel || $("#activityPublicTrace")) return;

    const section = document.createElement("section");
    section.id = "activityPublicTrace";
    section.className = "activity-public-trace vault-panel";
    section.innerHTML = `
      <div class="vault-panel-head activity-trace-head">
        <div>
          <small>SYSTEM TRACE</small>
          <h2>Protected activity</h2>
        </div>
        <span class="trace-link" id="traceLink" data-link="connecting"><i></i><strong>CONNECTING</strong></span>
      </div>

      <div class="trace-rail" id="traceRail">
        <article class="trace-event trace-mint">
          <span class="trace-node"></span>
          <div><small>PROOF OF LIFE</small><strong>Latest check in accepted</strong></div>
          <time id="traceLastCheckin">Pending</time>
        </article>
        <article class="trace-event trace-blue">
          <span class="trace-node"></span>
          <div><small>DEADLINE</small><strong>Next check in scheduled</strong></div>
          <time id="traceNextDue">Pending</time>
        </article>
        <article class="trace-event trace-violet" id="traceActionEvent" hidden>
          <span class="trace-node"></span>
          <div><small>CONTINGENCY PLAN</small><strong>Protected action sequence configured</strong></div>
          <time>SEALED</time>
        </article>
        <article class="trace-event trace-pink">
          <span class="trace-node"></span>
          <div><small>PRIVATE AUDIT</small><strong>Detailed event history restricted</strong></div>
          <time>LOCKED</time>
        </article>
      </div>

      <div class="trace-foot">
        <span>PUBLIC TRACE ONLY</span>
        <button type="button" id="activityTraceUnlock">Unlock audit</button>
      </div>`;

    section.querySelector("#activityTraceUnlock")?.addEventListener("click", requestAccess);
    panel.querySelector(".view-heading")?.insertAdjacentElement("afterend", section);
  }

  function ensureSecretActions() {
    const panel = $('[data-view-panel="actions"]');
    const anchor = $("#configuredSequenceHead") || $("#publicActionSequence");
    if (!panel || !anchor || $("#secretActionSequence")) return;

    const section = document.createElement("section");
    section.id = "secretActionSequence";
    section.className = "secret-action-sequence vault-panel";
    section.innerHTML = `
      <div class="vault-panel-head secret-sequence-head">
        <div>
          <small>CONFIGURED SEQUENCE</small>
          <h2>Protected actions</h2>
        </div>
        <span class="sequence-chip" id="secretSequenceChip"><i></i>READING</span>
      </div>
      <div class="secret-action-grid" id="secretActionGrid"></div>
      <div class="secret-sequence-foot">
        <span>TYPE · TARGET · TIMING · CONTENT</span>
        <strong>SEALED</strong>
      </div>`;

    anchor.insertAdjacentElement("beforebegin", section);
  }

  function renderSecretActions() {
    const grid = $("#secretActionGrid");
    const chip = $("#secretSequenceChip");
    if (!grid || !chip) return;

    const count = actionCount();
    const mode = syncMode();
    grid.replaceChildren();

    if (count === 0) {
      chip.innerHTML = mode === "live" ? "<i></i>SEALED" : "<i></i>READING";
      const pending = document.createElement("div");
      pending.className = "secret-action-pending";
      pending.innerHTML = mode === "live"
        ? '<span></span><strong>NO PUBLIC ACTION SUMMARY</strong><small>Private configuration remains sealed.</small>'
        : '<span></span><strong>READING CONFIGURATION</strong><small>Waiting for the server status.</small>';
      grid.append(pending);
      return;
    }

    chip.innerHTML = `<i></i>${count > 1 ? "MULTIPLE CONFIGURED" : "CONFIGURED"}`;
    const tones = ["blue", "violet", "cyan", "pink", "mint", "coral"];

    for (let index = 0; index < count; index += 1) {
      const number = String(index + 1).padStart(2, "0");
      const card = document.createElement("article");
      card.className = `secret-action-card secret-${tones[index % tones.length]}`;
      card.innerHTML = `
        <div class="secret-action-top">
          <span class="secret-action-number">${number}</span>
          <strong>PROTECTED ACTION</strong>
          <em><i></i>CONFIGURED</em>
        </div>
        <div class="secret-action-clock"><b>T+••:••</b><small>TIMING SEALED</small></div>
        <div class="secret-action-fields">
          <span><small>TYPE</small><strong>SEALED</strong></span>
          <span><small>TARGET</small><strong>SEALED</strong></span>
          <span><small>CONTENT</small><strong>SEALED</strong></span>
        </div>`;
      grid.append(card);
    }
  }

  function refreshPublicTrace() {
    const trace = $("#activityPublicTrace");
    if (!trace) return;

    $("#traceLastCheckin").textContent = text("#lastCheckin");
    $("#traceNextDue").textContent = text("#nextDue");

    const actionEvent = $("#traceActionEvent");
    if (actionEvent) actionEvent.hidden = actionCount() < 1;

    const mode = syncMode();
    const link = $("#traceLink");
    if (link) {
      link.dataset.link = mode;
      const labels = { live: "LIVE", limited: "LIMITED", offline: "UNVERIFIED", connecting: "CONNECTING" };
      link.innerHTML = `<i></i><strong>${labels[mode]}</strong>`;
    }
  }

  function refreshAccessState() {
    document.body.classList.toggle("vault-private-open", isUnlocked());
  }

  function observePublicFacts() {
    ["#lastCheckin", "#nextDue", "#syncState", "#actionPublicCount"].forEach(selector => {
      const node = $(selector);
      if (!node) return;
      new MutationObserver(() => {
        refreshPublicTrace();
        if (selector === "#actionPublicCount" || selector === "#syncState") renderSecretActions();
      }).observe(node, { childList: true, characterData: true, subtree: true });
    });

    let lastUnlocked = isUnlocked();
    new MutationObserver(() => {
      const next = isUnlocked();
      if (next === lastUnlocked) return;
      lastUnlocked = next;
      refreshAccessState();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }

  function boot() {
    ensureRecordsVault();
    ensureActivityTrace();
    ensureSecretActions();
    refreshPublicTrace();
    renderSecretActions();
    refreshAccessState();
    observePublicFacts();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();