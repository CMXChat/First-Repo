(() => {
  "use strict";

  /*
   * Compact public presentation for configured contingency trigger actions.
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

  function directiveCard(index, mode, expanded = false) {
    const number = String(index + 1).padStart(2, "0");
    const ref = String(index + 1).padStart(3, "0");
    const family = safePublicFamily(index);
    const detailsId = `officialDirectiveDetails${number}`;

    return `
      <article class="official-directive-card${expanded ? " is-expanded" : ""}" data-directive="${number}">
        <button class="official-directive-toggle" type="button" aria-expanded="${expanded ? "true" : "false"}" aria-controls="${detailsId}">
          <span class="official-alert-mark" aria-hidden="true">!</span>
          <span class="official-directive-summary">
            <small>TRIGGER ACTION ${number} · ACT-${ref}</small>
            <strong>${family}</strong>
            <em>ACTION DETAILS SEALED</em>
          </span>
          <span class="official-directive-status"><i></i>CONFIGURED</span>
          <span class="official-expand-cue" aria-hidden="true">⌄</span>
        </button>

        <div class="official-directive-details" id="${detailsId}" ${expanded ? "" : "hidden"}>
          <div class="official-danger-line">
            <span><b>!</b><strong>TRIGGER-CONTROLLED ACTION</strong></span>
            <small>Protected execution details withheld</small>
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
        </div>
      </article>`;
  }

  function bindInteractions(section) {
    section.onclick = event => {
      const unlock = event.target.closest("#officialActionsUnlock");
      if (unlock) {
        requestAccess();
        return;
      }

      const toggle = event.target.closest(".official-directive-toggle");
      if (!toggle) return;

      const card = toggle.closest(".official-directive-card");
      const details = card?.querySelector(".official-directive-details");
      if (!card || !details) return;

      const opening = toggle.getAttribute("aria-expanded") !== "true";
      $$(".official-directive-card.is-expanded", section).forEach(other => {
        if (other === card) return;
        other.classList.remove("is-expanded");
        const otherToggle = other.querySelector(".official-directive-toggle");
        const otherDetails = other.querySelector(".official-directive-details");
        otherToggle?.setAttribute("aria-expanded", "false");
        if (otherDetails) otherDetails.hidden = true;
      });

      card.classList.toggle("is-expanded", opening);
      toggle.setAttribute("aria-expanded", String(opening));
      details.hidden = !opening;
    };
  }

  function renderOfficialActions() {
    const section = $("#secretActionSequence");
    if (!section) return false;

    const expandedDirectives = new Set(
      $$(".official-directive-card.is-expanded", section).map(card => card.dataset.directive)
    );
    const count = publicCount();
    const mode = linkMode();
    section.classList.add("official-actions-shell");
    section.dataset.link = mode;

    const countLabel = count === 1 ? "01 TRIGGER ACTION" : `${String(count).padStart(2, "0")} TRIGGER ACTIONS`;
    const cards = count
      ? Array.from({ length: count }, (_, index) => {
          const number = String(index + 1).padStart(2, "0");
          return directiveCard(index, mode, expandedDirectives.has(number));
        }).join("")
      : `<div class="official-action-pending"><div><i></i><strong>${mode === "live" ? "NO PUBLIC ACTION SUMMARY" : "READING CONFIGURATION"}</strong><small>${mode === "live" ? "Protected action configuration remains sealed behind private access." : "Waiting for the server status before presenting configuration state."}</small></div></div>`;

    section.innerHTML = `
      <div class="official-sequence-head">
        <div class="official-sequence-title">
          <small>ACTION CONTROL</small>
          <h2>Trigger actions</h2>
          <p>Configured actions. Details stay sealed until unlocked.</p>
        </div>
        <div class="official-sequence-status">
          <span class="official-sequence-count"><b>!</b>${count ? countLabel : "SEQUENCE SEALED"}</span>
          <span class="official-integrity" data-link="${mode}"><i></i>${linkLabel(mode)}</span>
        </div>
      </div>

      <div class="official-alert-strip" aria-label="Trigger action warning">
        <span class="official-alert-symbol">!</span>
        <span><strong>CONTINGENCY ACTIONS STAGED</strong><small>Execution remains locked behind trigger conditions and protected configuration.</small></span>
        <b>${count ? String(count).padStart(2, "0") : "—"}</b>
      </div>

      <div class="official-directive-grid">${cards}</div>

      <div class="official-package-footer">
        <span><i></i><strong>EXECUTION PACKAGE SEALED</strong><small>Recipients, destinations, instructions, schedules, and protected content require private access.</small></span>
        <button type="button" id="officialActionsUnlock">Unlock actions</button>
      </div>`;

    bindInteractions(section);
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
