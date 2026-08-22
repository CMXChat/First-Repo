(() => {
  "use strict";

  const api = window.CMXOperatorApi;
  if (!api) return;

  const MAX_AUTOMATIONS = 50;
  const MAX_RUNS = 24;
  const state = {
    automations: [],
    runs: [],
    receipt: null,
    connected: false,
  };

  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[char]);

  const asArray = (value) => Array.isArray(value)
    ? value
    : Array.isArray(value?.items)
      ? value.items
      : Array.isArray(value?.runs)
        ? value.runs
        : Array.isArray(value?.automations)
          ? value.automations
          : [];

  const shortId = (value) => {
    const text = String(value || "");
    return text.length > 16 ? `${text.slice(0, 8)}…${text.slice(-6)}` : text || "—";
  };

  const when = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const statusTone = (status) => {
    if (status === "succeeded") return "good";
    if (status === "failed") return "bad";
    if (status === "cancelled") return "quiet";
    if (status === "running") return "active";
    return "waiting";
  };

  function ensureSurface() {
    if (document.getElementById("controlRuntimeProof")) return;
    const history = document.querySelector('[data-cc-view="history"] .cc-full-view');
    if (!history) return;

    const section = document.createElement("section");
    section.className = "cc-runtime-proof";
    section.id = "controlRuntimeProof";
    section.setAttribute("aria-labelledby", "controlRuntimeHeading");
    section.innerHTML = `
      <header class="cc-runtime-head">
        <div>
          <span class="cc-runtime-kicker">Protected backend · read only</span>
          <h3 id="controlRuntimeHeading">Runtime history & receipts</h3>
          <p>See what actually ran, which immutable versions were used, and why the backend recorded the result. This surface never starts, processes, cancels, retries, reconciles, or resends work.</p>
        </div>
        <div class="cc-runtime-head-actions">
          <span class="cc-runtime-badge" id="controlRuntimeBadge" data-state="checking">CHECKING</span>
          <button class="cc-runtime-button" id="controlRuntimeRefresh" type="button">Refresh</button>
          <button class="cc-runtime-button" id="controlRuntimeLogout" type="button" hidden>End session</button>
        </div>
      </header>

      <div class="cc-runtime-state" id="controlRuntimeState" role="status" aria-live="polite">Checking protected session…</div>

      <form class="cc-runtime-unlock" id="controlRuntimeUnlock" hidden>
        <label for="controlRuntimeKey">Operator key</label>
        <div class="cc-runtime-unlock-row">
          <input id="controlRuntimeKey" type="password" autocomplete="off" spellcheck="false" />
          <button class="cc-runtime-primary" id="controlRuntimeUnlockSubmit" type="submit">Unlock protected session</button>
        </div>
        <p id="controlRuntimeUnlockError" class="cc-runtime-error" aria-live="polite"></p>
      </form>

      <div class="cc-runtime-grid">
        <section class="cc-runtime-list-panel" aria-labelledby="controlRuntimeRunsHeading">
          <div class="cc-runtime-panel-head">
            <div><small>Canonical Runtime</small><strong id="controlRuntimeRunsHeading">Recent runs</strong></div>
            <span id="controlRuntimeCount">0</span>
          </div>
          <div id="controlRuntimeRuns" class="cc-runtime-runs">
            <p class="cc-runtime-empty">Unlock to inspect durable Runtime history.</p>
          </div>
        </section>

        <section class="cc-runtime-receipt" aria-labelledby="controlRuntimeReceiptHeading">
          <div class="cc-runtime-panel-head">
            <div><small>Frozen execution proof</small><strong id="controlRuntimeReceiptHeading">Receipt / Why</strong></div>
          </div>
          <div id="controlRuntimeReceipt">
            <p class="cc-runtime-empty">Choose a Run to inspect its immutable execution references and Why timeline.</p>
          </div>
        </section>
      </div>

      <p class="cc-runtime-boundary"><b>Deployment truth:</b> the protected operator session foundation is live, while the newer Automation/Runtime/receipt routes remain stacked source until deliberately deployed. If those routes return 404 here, Control reports <b>NOT DEPLOYED</b> instead of inventing browser history.</p>`;

    history.prepend(section);

    const sampleList = history.querySelector(".cc-list-card:not(.cc-runtime-list-panel)");
    if (sampleList) {
      sampleList.classList.add("cc-sample-history");
      const kicker = sampleList.querySelector(".cc-panel-kicker");
      if (kicker) kicker.textContent = "Sample history preview";
    }
  }

  function el(id) {
    return document.getElementById(id);
  }

  function setBackend(kind, message) {
    const badge = el("controlRuntimeBadge");
    const status = el("controlRuntimeState");
    if (badge) {
      badge.dataset.state = kind;
      badge.textContent = kind.replaceAll("_", " ").toUpperCase();
    }
    if (status) status.textContent = message;
  }

  function showUnlock(message = "Protected Runtime history is locked. Unlock the operator session to continue.") {
    state.connected = false;
    setBackend("locked", message);
    el("controlRuntimeUnlock").hidden = false;
    el("controlRuntimeLogout").hidden = true;
    el("controlRuntimeRuns").innerHTML = '<p class="cc-runtime-empty">Unlock to inspect durable Runtime history.</p>';
    el("controlRuntimeReceipt").innerHTML = '<p class="cc-runtime-empty">Choose a Run after the protected session is unlocked.</p>';
    el("controlRuntimeCount").textContent = "0";
  }

  function showConnected(message) {
    state.connected = true;
    setBackend("connected", message);
    el("controlRuntimeUnlock").hidden = true;
    el("controlRuntimeLogout").hidden = false;
    el("controlRuntimeUnlockError").textContent = "";
  }

  function automationName(automationId) {
    const automation = state.automations.find((item) => String(item.id) === String(automationId));
    return automation?.name || automation?.display_name || "Automation";
  }

  function renderRuns() {
    const root = el("controlRuntimeRuns");
    el("controlRuntimeCount").textContent = String(state.runs.length);
    if (!state.runs.length) {
      root.innerHTML = '<p class="cc-runtime-empty">No Runtime Runs exist for the protected Automations returned by this backend.</p>';
      return;
    }

    root.innerHTML = state.runs.map((run) => `
      <button class="cc-runtime-run" type="button" data-automation-id="${esc(run.automation_id)}" data-run-id="${esc(run.id)}">
        <span class="cc-runtime-run-top">
          <strong>${esc(automationName(run.automation_id))}</strong>
          <span class="cc-runtime-status" data-tone="${statusTone(run.status)}">${esc(run.status || "unknown")}</span>
        </span>
        <span class="cc-runtime-run-summary">${esc(run.result_summary || run.failure_message || "Open the frozen receipt and Why timeline.")}</span>
        <span class="cc-runtime-run-meta"><code>${esc(shortId(run.id))}</code><time>${esc(when(run.completed_at || run.created_at))}</time></span>
      </button>`).join("");

    root.querySelectorAll(".cc-runtime-run").forEach((button) => {
      button.addEventListener("click", () => loadReceipt(button.dataset.automationId, button.dataset.runId));
    });
  }

  function idFact(label, value, href, linkLabel) {
    if (!value) return "";
    return `<div class="cc-runtime-fact"><span>${esc(label)}</span><code title="${esc(value)}">${esc(value)}</code>${href ? `<a href="${esc(href)}">${esc(linkLabel || "Open")}</a>` : ""}</div>`;
  }

  function renderReceipt(receipt) {
    state.receipt = receipt;
    const root = el("controlRuntimeReceipt");
    const frozen = receipt.frozen_email || receipt.frozen_email_inputs || receipt.frozen_inputs || {};
    const attempts = asArray(receipt.attempts);
    const events = asArray(receipt.events || receipt.why);
    const operation = receipt.provider_operation || null;
    const reconciliation = receipt.reconciliation_status || operation?.reconciliation_status || "n/a";

    root.innerHTML = `
      <div class="cc-runtime-receipt-summary">
        <div><span>Result</span><strong>${esc(receipt.run_status || "unknown")}</strong></div>
        <div><span>Provider</span><strong>${esc(receipt.provider_mode || "unknown")}</strong></div>
        <div><span>Authority</span><strong>${esc(receipt.authority_mode || "unknown")}</strong></div>
        <div><span>Reconciliation</span><strong>${esc(reconciliation)}</strong></div>
      </div>

      <div class="cc-runtime-section">
        <h4>Exact execution references</h4>
        <div class="cc-runtime-facts">
          ${idFact("Run", receipt.run_id)}
          ${idFact("Automation", receipt.automation_id, "/automations/", "Open Automations")}
          ${idFact("AutomationVersion", receipt.automation_version_id)}
          ${idFact("Person", frozen.person_id, `/directory/?person_id=${encodeURIComponent(frozen.person_id || "")}`, "Open Directory")}
          ${idFact("ContactMethod", frozen.contact_method_id)}
          ${idFact("Connection", frozen.connection_id)}
          ${idFact("SenderIdentity", frozen.sender_identity_id)}
          ${idFact("ContentAsset", frozen.content_asset_id, `/library/?content_id=${encodeURIComponent(frozen.content_asset_id || "")}`, "Open Library")}
          ${idFact("ContentVersion", frozen.content_version_id)}
          ${idFact("Content checksum", frozen.content_checksum_sha256)}
          ${idFact("AuthorityGrant", receipt.authority_grant_id)}
          ${idFact("AuthorityGrantVersion", receipt.authority_grant_version_id)}
          ${idFact("Check In Incident", receipt.checkin_incident_id)}
          ${idFact("TriggerOccurrence", receipt.trigger_occurrence_id)}
        </div>
      </div>

      <div class="cc-runtime-section">
        <h4>Frozen Email inputs</h4>
        <div class="cc-runtime-readable">
          <p><span>To</span><strong>${esc(frozen.person_display_name || "—")} · ${esc(frozen.recipient_address || "—")}</strong></p>
          <p><span>From</span><strong>${esc(frozen.sender_display_name || frozen.sender_address || "—")} · ${esc(frozen.connection_display_name || "—")}</strong></p>
          <p><span>Content</span><strong>${esc(frozen.content_subject || "—")}</strong></p>
          <p><span>Initiated by</span><strong>${esc(receipt.initiation_type || "—")} · ${esc(receipt.requested_by || "—")}</strong></p>
        </div>
      </div>

      <div class="cc-runtime-section">
        <h4>Attempts</h4>
        <div class="cc-runtime-timeline">
          ${attempts.length ? attempts.map((attempt) => `<article><b>Attempt ${esc(attempt.attempt_number)} · ${esc(attempt.outcome)}</b><p>${esc(attempt.failure_message || (attempt.retryable === true ? "Retryable outcome recorded." : "Canonical Runtime attempt recorded."))}</p><small>${esc(when(attempt.finished_at || attempt.started_at))}</small></article>`).join("") : '<p class="cc-runtime-empty">No Attempts are present in this receipt.</p>'}
        </div>
      </div>

      <div class="cc-runtime-section">
        <h4>Why / execution timeline</h4>
        <div class="cc-runtime-timeline">
          ${events.length ? events.map((event) => `<article><b>${esc(event.event_type || event.type || "Runtime event")}</b><p>${esc(event.summary || event.message || "")}</p><small>${esc(when(event.created_at))}</small></article>`).join("") : '<p class="cc-runtime-empty">No Runtime events are present in this receipt.</p>'}
        </div>
      </div>

      ${operation ? `<div class="cc-runtime-section"><h4>Provider operation evidence</h4><div class="cc-runtime-readable"><p><span>Operation</span><strong>${esc(operation.id || "—")}</strong></p><p><span>Original state</span><strong>${esc(operation.original_state || "—")}</strong></p><p><span>Reconciliation</span><strong>${esc(operation.reconciliation_status || reconciliation)}</strong></p><p><span>May consider new manual action</span><strong>${esc(operation.may_consider_new_manual_action)}</strong></p></div><p class="cc-runtime-warning">Reconciliation records evidence only. This read-only Control surface never retries or resends the provider operation.</p></div>` : ""}
    `;
  }

  async function loadReceipt(automationId, runId) {
    if (!automationId || !runId) return;
    el("controlRuntimeReceipt").innerHTML = '<p class="cc-runtime-empty">Loading frozen receipt…</p>';
    document.querySelectorAll(".cc-runtime-run").forEach((button) => {
      button.dataset.selected = String(button.dataset.runId) === String(runId) ? "true" : "false";
    });
    try {
      const receipt = await api.getReceipt(automationId, runId);
      renderReceipt(receipt);
      const url = new URL(location.href);
      url.searchParams.set("automation_id", automationId);
      url.searchParams.set("run_id", runId);
      history.replaceState(null, "", url);
    } catch (error) {
      const kind = api.classify(error);
      if (kind === "locked") return showUnlock("Protected session expired. Unlock again to inspect the receipt.");
      el("controlRuntimeReceipt").innerHTML = `<p class="cc-runtime-empty">${esc(kind === "not_deployed_or_missing" ? "Receipt route is not deployed here, or this Run no longer resolves through the requested Automation." : `Receipt unavailable: ${error?.message || "request failed"}`)}</p>`;
    }
  }

  async function loadHistory() {
    setBackend("loading", "Loading protected Automations and Runtime Runs…");
    try {
      const automationsRaw = await api.listAutomations();
      state.automations = asArray(automationsRaw).slice(0, MAX_AUTOMATIONS);
      const results = await Promise.allSettled(state.automations.map(async (automation) => {
        const runs = asArray(await api.listRuns(automation.id));
        return runs.map((run) => ({ ...run, automation_id: run.automation_id || automation.id }));
      }));

      const locked = results.find((result) => result.status === "rejected" && api.classify(result.reason) === "locked");
      if (locked) return showUnlock("Protected session expired while loading Runtime history. Unlock again.");

      state.runs = results
        .filter((result) => result.status === "fulfilled")
        .flatMap((result) => result.value)
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, MAX_RUNS);

      const unavailableCount = results.filter((result) => result.status === "rejected").length;
      showConnected(unavailableCount
        ? `Protected session ready · ${state.runs.length} recent Runs loaded · ${unavailableCount} Automation Run list${unavailableCount === 1 ? "" : "s"} unavailable.`
        : `Protected session ready · ${state.automations.length} Automation${state.automations.length === 1 ? "" : "s"} · ${state.runs.length} recent Run${state.runs.length === 1 ? "" : "s"}.`);
      renderRuns();

      const params = new URLSearchParams(location.search);
      const automationId = params.get("automation_id");
      const runId = params.get("run_id");
      if (automationId && runId) await loadReceipt(automationId, runId);
    } catch (error) {
      const kind = api.classify(error);
      if (kind === "locked") return showUnlock();
      if (kind === "not_deployed_or_missing") {
        setBackend("not_deployed", "Protected session ready · Automation/Runtime history routes are not deployed on this API yet.");
        el("controlRuntimeUnlock").hidden = true;
        el("controlRuntimeLogout").hidden = false;
        el("controlRuntimeRuns").innerHTML = '<p class="cc-runtime-empty">The frontend is ready, but this deployed API does not expose the stacked Runtime history contract yet.</p>';
        return;
      }
      if (kind === "forbidden") setBackend("denied", "The backend rejected this browser Origin or protected access.");
      else if (kind === "network") setBackend("offline", "The browser could not reach the protected API.");
      else setBackend("unavailable", `Protected Runtime history unavailable: ${error?.message || "request failed"}`);
      el("controlRuntimeRuns").innerHTML = '<p class="cc-runtime-empty">No browser-local Runtime substitute was created.</p>';
    }
  }

  async function bootstrap() {
    ensureSurface();
    if (!el("controlRuntimeProof")) return;
    try {
      await api.session({ refresh: true });
      await loadHistory();
    } catch (error) {
      const kind = api.classify(error);
      if (kind === "locked") return showUnlock();
      if (kind === "forbidden") setBackend("denied", "The backend rejected this browser Origin or protected access.");
      else if (kind === "network") setBackend("offline", "The browser could not reach the protected API.");
      else setBackend("unavailable", `Protected session unavailable: ${error?.message || "request failed"}`);
      el("controlRuntimeUnlock").hidden = false;
    }
  }

  document.addEventListener("submit", async (event) => {
    if (event.target?.id !== "controlRuntimeUnlock") return;
    event.preventDefault();
    const input = el("controlRuntimeKey");
    const button = el("controlRuntimeUnlockSubmit");
    const errorNode = el("controlRuntimeUnlockError");
    const key = input.value;
    input.value = "";
    if (!key) {
      errorNode.textContent = "Enter the operator key.";
      input.focus();
      return;
    }
    button.disabled = true;
    errorNode.textContent = "";
    setBackend("unlocking", "Unlocking protected session…");
    try {
      await api.unlock(key);
      await loadHistory();
    } catch (error) {
      const kind = api.classify(error);
      errorNode.textContent = kind === "locked" ? "Operator key was not accepted." : (error?.message || "Unlock failed");
      showUnlock(kind === "forbidden" ? "The backend rejected this browser Origin." : "Protected session remains locked.");
      errorNode.textContent = kind === "locked" ? "Operator key was not accepted." : (error?.message || "Unlock failed");
    } finally {
      button.disabled = false;
      input.focus();
    }
  });

  document.addEventListener("click", async (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.id === "controlRuntimeRefresh") {
      target.disabled = true;
      try { await loadHistory(); } finally { target.disabled = false; }
    }
    if (target.id === "controlRuntimeLogout") {
      target.disabled = true;
      try {
        await api.logout();
        state.automations = [];
        state.runs = [];
        state.receipt = null;
        showUnlock("Protected session ended. Unlock again when you want to inspect Runtime history.");
      } catch (error) {
        if (api.classify(error) === "locked") showUnlock("Protected session has already expired. Unlock again when needed.");
        else setBackend("unavailable", `Could not end protected session: ${error?.message || "request failed"}`);
      } finally {
        target.disabled = false;
      }
    }
  });

  bootstrap();
})();
