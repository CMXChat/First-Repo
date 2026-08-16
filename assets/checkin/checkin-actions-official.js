(() => {
  "use strict";

  /*
   * Serious public presentation for configured contingency actions.
   *
   * Truth boundary:
   * - Uses only the real public configured action count and server-link state.
   * - Never invents action type, recipient, target, timing, condition, or payload.
   * - A future backend-safe public action family may be shown only when provided
   *   in an explicit data-public-action-kind node and matched against the whitelist.
   */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const PUBLIC_FAMILIES = new Set([
    "OUTBOUND COMMUNICATION",
    "ORGANIZATION NOTICE",
    "AI WORKFLOW",
    "DIGITAL CLEANUP",
    "ACCOUNT ACTION",
    "SCHEDULED TASK",
    "ARCHIVE RELEASE"
  ]);

  function publicCount() {
    const value = Number(("" + ($("#actionPublicCount")?.textContent || "0")).trim());
    return Number.isInteger(value) && value >= 0 ? value : 0;
  }

  function linkMode() {
    const value = ($("#syncState")?.textContent || "CONNECTING").trim().toUpperCase();
    if (value.includes("SYNCHRONIZED")) return "live";
    if (value.includes("PARTIALLY")) return "limited";
    if (value.includes("UNAVAILABLE")) return "offline";
    return "connecting";
  }

  function linkLabel(mode) {
    return {
      live: "SERVER VERIFIED",
      limited: "STATUS LIMITED",
      offline: "STATUS UNVERIFIED",
      connecting: "READING STATUS"
    }[mode];
  }

  function safePublicFamily(index) {
    const nodes = $$('[data-public-action-kind]');
    const value = (nodes[index]?.dataset.publicActionKind || "").trim().toUpperCase();
    return PUBLIC_FAMILIES.has(value) ? value : "PROTECTED ACTION";
  }

  function requestAccess() {
    $("#operatorButton")?.click();
  }

  function directiveCard(index, mode) {
    const number = String(index + 1).padStart(2, "0");
    const ref = String(index + 1).padStart(3, "0");
    const family = safePublicFamily(index);
    return `
      <article class="official-directive-card" data-directive="${number}">
        <div class="official-directive-top">
          <div class="official-directive-id">
            <small>CONTINGENCY DIRECTIVE ${number}</small>
            <strong>ACT-${ref}</strong>
          </div>
          <em class="official-directive-status"><i></i>CONFIGURED</em>
        </div>

        <div class="official-directive-class">
          <span class="official-restricted-mark">RESTRICTED</span>
          <div>
            <small>ACTION CLASS</small>
            <strong>${family}</strong>
          </div>
        </div>

        <div class="official-execution-field">
          <div>
            <small>EXECUTION OFFSET</small>
            <b class="official-redaction long" aria-label="Execution timing sealed"></b>
          </div>
          <span>SEALED</span>
        </div>

        <div class="official-directive-fields">
          <span><small>TARGET</small><b class="official-redaction medium" aria-label="Target sealed"></b></span>
          <span><small>CONDITION</small><b class="official-redaction short" aria-label="Condition sealed"></b></span>
          <span><small>PAYLOAD</small><b class="official-redaction long" aria-label="Payload sealed"></b></span>
          <span><small>TIMING / SCHEDULE</small><b class="official-redaction medium" aria-label="Schedule sealed"></b></span>
        </div>

        <div class="official-directive-foot">
          <span>DETAILS WITHHELD · PRIVATE ACCESS REQUIRED</span>
          <b>${linkLabel(mode)}</b>
        </div>
      </article>`;
  }

  function renderOfficialActions() {
    const section = $("#secretActionSequence");
    if (!section) return false;

    const count = publicCount();
    const mode = linkMode();
    section.classList.add("official-actions-shell");
    section.dataset.link = mode;

    const countLabel = count === 1 ? "01 DIRECTIVE CONFIGURED" : `${String(count).padStart(2, "0")} DIRECTIVES CONFIGURED`;
    const cards = count
      ? Array.from({ length: count }, (_, index) => directiveCard(index, mode)).join("")
      : `<div class="official-action-pending"><div><i></i><strong>${mode === "live" ? "NO PUBLIC DIRECTIVE SUMMARY" : "READING CONFIGURATION"}</strong><small>${mode === "live" ? "Protected action configuration remains sealed behind private access." : "Waiting for the server status before presenting configuration state."}</small></div></div>`;

    section.innerHTML = `
      <div class="official-sequence-head">
        <div class="official-sequence-title">
          <small>CONTINGENCY CONTROL</small>
          <h2>Contingency sequence</h2>
          <p>Configured directives are protected. Action class, targets, conditions, timing, schedules, and payload details remain withheld from the public view.</p>
        </div>
        <div class="official-sequence-status">
          <span class="official-sequence-count">${count ? countLabel : "SEQUENCE SEALED"}</span>
          <span class="official-integrity" data-link="${mode}"><i></i>${linkLabel(mode)}</span>
        </div>
      </div>

      <div class="official-control-strip" aria-label="Contingency package state">
        <span class="control-accent"><small>DIRECTIVES</small><strong>${count ? String(count).padStart(2, "0") : "SEALED"}</strong></span>
        <span><small>EXECUTION</small><strong>LOCKED</strong></span>
        <span><small>TIMING / SCHEDULE</small><strong>SEALED</strong></span>
        <span><small>ACCESS</small><strong>PRIVATE</strong></span>
      </div>

      <div class="official-directive-grid">${cards}</div>

      <div class="official-package-footer">
        <span><i></i><strong>EXECUTION PACKAGE SEALED</strong><small>Recipients, destinations, instructions, schedules, and protected content require private access.</small></span>
        <button type="button" id="officialActionsUnlock">Unlock directives</button>
      </div>`;

    $("#officialActionsUnlock")?.addEventListener("click", requestAccess);
    return true;
  }

  function watch() {
    ["#actionPublicCount", "#syncState"].forEach(selector => {
      const node = $(selector);
      if (!node) return;
      new MutationObserver(() => queueMicrotask(renderOfficialActions)).observe(node, {
        childList: true,
        characterData: true,
        subtree: true
      });
    });

    const body = document.body;
    if (body) {
      new MutationObserver(() => {
        if (!body.classList.contains("operator-unlocked")) queueMicrotask(renderOfficialActions);
      }).observe(body, { attributes: true, attributeFilter: ["class"] });
    }
  }

  function boot(attempt = 0) {
    if (!renderOfficialActions() && attempt < 8) {
      requestAnimationFrame(() => boot(attempt + 1));
      return;
    }
    watch();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => boot(), { once: true });
  else boot();
})();
