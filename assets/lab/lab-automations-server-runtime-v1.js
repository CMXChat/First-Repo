(() => {
  "use strict";

  const API = window.CMXAutomationsLabApi;
  if (!API) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => String(value ?? "").replace(/[&<>'\"]/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '\"': "&quot;"
  }[ch]));
  const pretty = (value) => String(value || "").replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const state = {
    automationId: null,
    details: null,
    runs: [],
    selectedRunId: null,
    selectedRun: null,
    loading: false,
    error: "",
    behavior: "accepted",
  };

  let queued = false;

  function root() {
    return document.querySelector(".server-automation-editor[data-server-editor]");
  }

  function activeRunsPanel() {
    const node = root();
    if (!node) return null;
    const active = node.querySelector("[data-server-section].is-active")?.dataset.serverSection;
    if (active !== "runs") return null;
    return node.querySelector(".v10-control-panel");
  }

  function statusTone(status) {
    if (status === "succeeded") return "green";
    if (status === "failed" || status === "cancelled") return "amber";
    return "blue";
  }

  function formatTime(value) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleString() : String(value);
  }

  function runCard(run) {
    return `<button class="server-run-row ${run.id === state.selectedRunId ? "is-selected" : ""}" type="button" data-runtime-open="${esc(run.id)}"><span class="server-run-state" data-tone="${statusTone(run.status)}">${esc(String(run.status).toUpperCase())}</span><span><strong>${esc(run.id.slice(0, 8))}…</strong><small>Version ${esc(run.automation_version_id.slice(0, 8))}… · ${esc(formatTime(run.created_at))}</small></span><em>${run.failure_class ? esc(run.failure_class) : run.result_summary ? "Receipt" : "Pending"}</em></button>`;
  }

  function attemptMarkup(attempt) {
    return `<article class="server-attempt"><header><span>ATTEMPT ${esc(attempt.attempt_number)}</span><strong>${esc(pretty(attempt.outcome))}</strong><small>${esc(attempt.retryable ? "Retryable" : "Not retryable")}</small></header><dl><dt>Worker</dt><dd>${esc(attempt.worker_id || "—")}</dd><dt>Started</dt><dd>${esc(formatTime(attempt.started_at))}</dd><dt>Finished</dt><dd>${esc(formatTime(attempt.finished_at))}</dd>${attempt.failure_class ? `<dt>Failure</dt><dd>${esc(attempt.failure_class)}${attempt.failure_message ? ` · ${esc(attempt.failure_message)}` : ""}</dd>` : ""}${attempt.provider_delivery_id ? `<dt>Fake delivery</dt><dd><code>${esc(attempt.provider_delivery_id)}</code></dd>` : ""}</dl></article>`;
  }

  function eventMarkup(event) {
    return `<article class="server-why-event"><span>${esc(formatTime(event.created_at))}</span><div><strong>${esc(event.event_type)}</strong><p>${esc(event.summary)}</p></div></article>`;
  }

  function snapshotMarkup(run) {
    const snap = run.execution_snapshot || {};
    return `<section class="server-run-snapshot"><header><span>FROZEN EXECUTION SNAPSHOT</span><strong>${esc(snap.person_display_name || "Recipient")}</strong></header><dl><dt>Recipient</dt><dd>${esc(snap.person_display_name || "—")}<small>${esc(snap.recipient_address || "—")}</small><code>${esc(snap.person_id || "—")}</code></dd><dt>ContactMethod</dt><dd><code>${esc(snap.contact_method_id || "—")}</code></dd><dt>Sender</dt><dd>${esc(snap.sender_display_name || snap.sender_address || "—")}<small>${esc(snap.sender_address || "")}</small><code>${esc(snap.sender_identity_id || "—")}</code></dd><dt>Connection</dt><dd>${esc(snap.connection_display_name || "—")}<code>${esc(snap.connection_id || "—")}</code></dd><dt>ContentVersion</dt><dd><code>${esc(snap.content_version_id || "—")}</code></dd><dt>Provider</dt><dd>${esc(snap.provider || "fake_email")}<small>${snap.external_side_effect === false ? "No external side effect" : ""}</small></dd></dl></section>`;
  }

  function detailMarkup(run) {
    if (!run) return `<div class="v10-empty-state"><strong>Select a Run</strong><span>Inspect attempts, frozen references and Why events.</span></div>`;
    const canProcess = run.status === "pending";
    const canCancel = run.status === "pending";
    return `<section class="server-run-detail"><header class="server-run-detail-head"><div><span>RUN · ${esc(String(run.status).toUpperCase())}</span><h3>${esc(run.id)}</h3><p>AutomationVersion <code>${esc(run.automation_version_id)}</code></p></div><div class="server-run-actions"><button class="server-small-button" type="button" data-runtime-process ${canProcess ? "" : "disabled"}>Process fake work</button><button class="server-small-button" type="button" data-runtime-cancel ${canCancel ? "" : "disabled"}>Cancel pending Run</button></div></header><div class="server-run-summary"><article><span>Action status</span><strong>${esc(pretty(run.action_status))}</strong></article><article><span>Attempts</span><strong>${esc(run.attempt_count)}</strong></article><article><span>Lease owner</span><strong>${esc(run.lease_owner || "None")}</strong></article><article><span>Fake provider</span><strong>${run.fake_provider ? "Yes" : "No"}</strong></article></div>${snapshotMarkup(run)}<section class="server-runtime-section"><header><span>ATTEMPTS</span><strong>${run.attempts?.length || 0}</strong></header><div class="server-attempt-list">${(run.attempts || []).map(attemptMarkup).join("") || `<p>No execution attempt yet.</p>`}</div></section><section class="server-runtime-section"><header><span>WHY · RUNTIME EVENTS</span><strong>${run.events?.length || 0}</strong></header><div class="server-why-list">${(run.events || []).map(eventMarkup).join("") || `<p>No Runtime events yet.</p>`}</div></section>${run.failure_message ? `<div class="server-runtime-failure"><strong>${esc(run.failure_class || "Run failed")}</strong><span>${esc(run.failure_message)}</span></div>` : ""}<details class="server-developer-details"><summary>Developer details</summary><pre>${esc(JSON.stringify(run, null, 2))}</pre></details></section>`;
  }

  function panelMarkup() {
    const published = state.details?.current_published_version;
    const selected = state.selectedRun;
    return `<header class="v10-panel-head"><div><span>RUNS · REAL RUNTIME</span><h2>${esc(state.details?.automation?.name || "Server Automation")}</h2><p>Manual owner-triggered fake Email Runtime. Attempts and Why come from durable backend records.</p></div><b>${state.runs.length} RUN${state.runs.length === 1 ? "" : "S"}</b></header>${state.error ? `<div class="server-runtime-failure"><strong>Runtime request failed</strong><span>${esc(state.error)}</span></div>` : ""}<section class="server-runtime-request"><div><span>NEW MANUAL RUN</span><strong>${published ? `Published v${published.version_number}` : "Publish first"}</strong><small>Current Runtime contract executes exactly one published Email action.</small></div><label><span>Fake behavior</span><select data-runtime-behavior><option value="accepted" ${state.behavior === "accepted" ? "selected" : ""}>SUCCESS · accepted</option><option value="transient_once" ${state.behavior === "transient_once" ? "selected" : ""}>FAIL ONCE · transient then success</option><option value="permanent_failure" ${state.behavior === "permanent_failure" ? "selected" : ""}>PERMANENT FAILURE</option></select></label><button class="v3-footer-primary" type="button" data-runtime-request ${published ? "" : "disabled"}>Request manual Run</button></section><div class="server-runtime-layout"><section class="server-run-list"><header><span>RUN HISTORY</span><button class="server-link-button" type="button" data-runtime-refresh>Refresh</button></header>${state.runs.map(runCard).join("") || `<div class="v10-empty-state"><strong>No authoritative Runs yet</strong><span>Local simulations are not promoted into Runtime history.</span></div>`}</section>${detailMarkup(selected)}</div><section class="server-disabled-runtime-controls"><button disabled>Pause · no endpoint</button><button disabled>Resume · no endpoint</button><button disabled>Retry failed step · no endpoint</button><span>Truthful disabled controls stay disabled until matching protected operations exist.</span></section>`;
  }

  async function loadAll({ keepSelection = true } = {}) {
    const panel = activeRunsPanel();
    const id = root()?.dataset.serverEditor;
    if (!panel || !id || state.loading) return;

    state.loading = true;
    state.error = "";
    try {
      const [details, runs] = await Promise.all([
        API.getAutomation(id),
        API.listRuns(id),
      ]);
      state.automationId = id;
      state.details = details;
      state.runs = Array.isArray(runs) ? runs : [];
      if (!keepSelection || !state.runs.some((run) => run.id === state.selectedRunId)) {
        state.selectedRunId = state.runs[0]?.id || null;
      }
      state.selectedRun = state.selectedRunId ? await API.getRun(id, state.selectedRunId) : null;
      renderPanel();
    } catch (error) {
      state.error = error?.message || "Runtime unavailable";
      renderPanel();
    } finally {
      state.loading = false;
    }
  }

  async function selectRun(runId) {
    if (!state.automationId) return;
    state.selectedRunId = runId;
    try {
      state.selectedRun = await API.getRun(state.automationId, runId);
      state.error = "";
    } catch (error) {
      state.error = error?.message || "Run unavailable";
    }
    renderPanel();
  }

  async function requestRun() {
    if (!state.automationId) return;
    try {
      const run = await API.requestRun(state.automationId, { fake_behavior: state.behavior });
      state.selectedRunId = run.id;
      await loadAll({ keepSelection: true });
    } catch (error) {
      state.error = error?.message || "Run request failed";
      renderPanel();
    }
  }

  async function processRun() {
    if (!state.automationId || !state.selectedRunId) return;
    try {
      state.selectedRun = await API.processRun(state.automationId, state.selectedRunId, { worker_id: "continuum-lab-browser" });
      await loadAll({ keepSelection: true });
    } catch (error) {
      state.error = error?.message || "Run processing failed";
      renderPanel();
    }
  }

  async function cancelRun() {
    if (!state.automationId || !state.selectedRunId) return;
    try {
      state.selectedRun = await API.cancelRun(state.automationId, state.selectedRunId);
      await loadAll({ keepSelection: true });
    } catch (error) {
      state.error = error?.message || "Run cancellation failed";
      renderPanel();
    }
  }

  function renderPanel() {
    const panel = activeRunsPanel();
    if (!panel) return;
    panel.dataset.runtimePatched = state.automationId || "loading";
    panel.innerHTML = panelMarkup();
  }

  function sync() {
    const panel = activeRunsPanel();
    if (!panel) return;
    const id = root()?.dataset.serverEditor;
    if (!id) return;
    if (panel.dataset.runtimePatched === id) return;
    panel.dataset.runtimePatched = id;
    panel.innerHTML = `<header class="v10-panel-head"><div><span>RUNS · REAL RUNTIME</span><h2>Loading durable Runtime…</h2><p>No local simulation fallback.</p></div><b>SERVER</b></header>`;
    loadAll({ keepSelection: state.automationId === id });
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      sync();
    });
  }

  document.addEventListener("change", (event) => {
    const select = event.target.closest?.("[data-runtime-behavior]");
    if (!select) return;
    state.behavior = select.value;
  }, true);

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-runtime-open],[data-runtime-refresh],[data-runtime-request],[data-runtime-process],[data-runtime-cancel]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    if (button.matches("[data-runtime-open]")) selectRun(button.dataset.runtimeOpen);
    if (button.matches("[data-runtime-refresh]")) loadAll({ keepSelection: true });
    if (button.matches("[data-runtime-request]")) requestRun();
    if (button.matches("[data-runtime-process]")) processRun();
    if (button.matches("[data-runtime-cancel]")) cancelRun();
  }, true);

  new MutationObserver(schedule).observe(document.getElementById("automationApp"), { childList: true, subtree: true });
  schedule();
})();