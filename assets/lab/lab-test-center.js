(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /**
   * CHECK IN LAB — TEST CENTER
   * --------------------------
   * Guided simulation UX only. This layer NEVER executes a real side effect and
   * does not become another simulation/decision source of truth.
   *
   * It deliberately drives the existing Sequence + Decision controls so the same
   * Phase 5/6 state machines still own simulated timing, retries, approvals,
   * acknowledgements, routes, audit events, and incident snapshots.
   *
   * OFFICIAL PROJECT HANDOFF:
   * The official application should expose server-backed test scenarios using the
   * same production timing/decision engine with deterministic fake providers.
   * The browser should request a test run and render server-authoritative results.
   * Do not port DOM-click orchestration. See CHECKINLABCLONE.md.
   */

  const POLICY_KEY = "cmx-lab-switch-policy-v1";
  const ACTION_KEY = "cmx-lab-actions-v1";
  const SIM_KEY = "cmx-lab-simulations-v1";
  const RUNTIME_KEY = "cmx-lab-decision-runtime-v1";
  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  let root = null;
  let running = false;
  let queued = false;

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  }

  function policy() {
    const value = load(POLICY_KEY, { intervalHours:72, graceHours:24 });
    return {
      intervalHours: Math.max(1, Number(value.intervalHours || 72)),
      graceHours: Math.max(0, Number(value.graceHours ?? 24))
    };
  }

  function actions() {
    return load(ACTION_KEY, { actions:[] }).actions || [];
  }

  function currentSimulation() {
    return load(SIM_KEY, { current:null }).current;
  }

  function currentRuntime() {
    const sim = currentSimulation();
    const store = load(RUNTIME_KEY, { bySimulation:{} });
    return sim?.id ? store.bySimulation?.[sim.id] || null : null;
  }

  function click(selector, scope = document) {
    const node = $(selector, scope);
    if (!node) return false;
    node.click();
    return true;
  }

  async function waitFor(selector, { scope=document, attempts=30, delay=60 } = {}) {
    for (let i = 0; i < attempts; i += 1) {
      const node = $(selector, scope);
      if (node) return node;
      await sleep(delay);
    }
    return null;
  }

  async function openSequence() {
    const active = $('[data-view-panel="timeline"].is-active');
    if (!active) {
      const nav = $$('[data-view="timeline"]').find(button => !button.hidden) || $('[data-view="timeline"]');
      nav?.click();
      await sleep(100);
    }
    return waitFor(".lab-sequence-root");
  }

  async function newSimulation() {
    await openSequence();
    const reset = await waitFor('[data-sequence-command="reset"]');
    reset?.click();
    await sleep(180);
  }

  async function jumpTo(hour) {
    await openSequence();
    const exact = await waitFor(`[data-sequence-jump="${hour}"]`);
    if (exact) exact.click();
    else {
      const sim = currentSimulation();
      const current = Number(sim?.hour || 0);
      const delta = Math.max(0, Number(hour) - current);
      const plusSix = $('[data-sequence-add="6"]');
      const plusOne = $('[data-sequence-add="1"]');
      let sixes = Math.floor(delta / 6);
      let ones = Math.round(delta % 6);
      while (sixes-- > 0) { plusSix?.click(); await sleep(25); }
      while (ones-- > 0) { plusOne?.click(); await sleep(25); }
    }
    await sleep(180);
  }

  async function runEligible() {
    const button = await waitFor('[data-sequence-command="run-eligible"]');
    button?.click();
    await sleep(180);
  }

  async function failNextEligible() {
    await sleep(100);
    const button = $('[data-decision-run][data-decision-outcome="failure"]') || $('[data-sim-outcome="failure"]');
    button?.click();
    await sleep(180);
  }

  async function markNoResponse(preferredId = "act-continuity-email") {
    await sleep(100);
    const preferred = $(`[data-decision-ack="${CSS.escape(preferredId)}"][data-decision-ack-value="no"]`);
    const fallback = $('[data-decision-ack][data-decision-ack-value="no"]');
    (preferred || fallback)?.click();
    await sleep(180);
  }

  async function acknowledgeNext(preferredId = "act-legal-sms") {
    await sleep(100);
    const preferred = $(`[data-decision-ack="${CSS.escape(preferredId)}"][data-decision-ack-value="yes"]`);
    const fallback = $('[data-decision-ack][data-decision-ack-value="yes"]');
    (preferred || fallback)?.click();
    await sleep(180);
  }

  async function approveFinal(preferredId = "act-account-handoff") {
    await sleep(100);
    const preferred = $(`[data-decision-run="${CSS.escape(preferredId)}"][data-decision-outcome="success"]`);
    const fallback = $('[data-decision-run][data-decision-outcome="success"]');
    (preferred || fallback)?.click();
    await sleep(180);
  }

  function stateSummary() {
    const sim = currentSimulation();
    const rt = currentRuntime();
    const enabled = actions().filter(action => action.status === "Enabled");
    const values = enabled.map(action => rt?.states?.[action.id] || sim?.states?.[action.id] || "WAITING");
    const terminal = values.filter(value => ["SUCCEEDED","ACKNOWLEDGED","FAILED","NO ACKNOWLEDGEMENT","APPROVAL DENIED","CANCELLED"].includes(value)).length;
    const waiting = values.filter(value => ["WAITING","BLOCKED","ELIGIBLE","AWAITING APPROVAL","AWAITING ACKNOWLEDGEMENT","RETRY QUEUED"].includes(value)).length;
    const failed = values.filter(value => ["FAILED","NO ACKNOWLEDGEMENT","APPROVAL DENIED"].includes(value)).length;
    return { enabled:enabled.length, terminal, waiting, failed, hour:Number(sim?.hour || 0), values };
  }

  function renderResult(label = "Ready") {
    if (!root) return;
    const summary = stateSummary();
    const result = $("#labTestResult", root);
    if (!result) return;
    result.innerHTML = `<span><small>LAST TEST STEP</small><strong>${label}</strong></span><div><b>${summary.terminal}</b><small>RESOLVED</small></div><div><b>${summary.waiting}</b><small>OPEN</small></div><div class="${summary.failed ? "warn" : ""}"><b>${summary.failed}</b><small>FAILED</small></div><em>T+${summary.hour}h</em>`;
  }

  function setBusy(isBusy, label = "Running test…") {
    running = isBusy;
    if (!root) return;
    root.classList.toggle("is-running", isBusy);
    $$("[data-test-scenario]", root).forEach(button => button.disabled = isBusy);
    const state = $(".lab-test-state", root);
    if (state) state.textContent = isBusy ? label : "SIMULATION ONLY";
  }

  async function scenario(name) {
    if (running) return;
    setBusy(true);
    const p = policy();
    try {
      if (name === "deadline") {
        await newSimulation();
        await jumpTo(p.intervalHours);
        window.CMX_LAB_DECISIONS?.reconcile?.();
        renderResult("Deadline reached");
      }
      if (name === "final") {
        await newSimulation();
        await jumpTo(p.intervalHours + p.graceHours);
        window.CMX_LAB_DECISIONS?.reconcile?.();
        renderResult("Final boundary reached");
      }
      if (name === "failure") {
        await newSimulation();
        await jumpTo(p.intervalHours);
        window.CMX_LAB_DECISIONS?.reconcile?.();
        await failNextEligible();
        renderResult("Failure path exercised");
      }
      if (name === "no-reply") {
        await newSimulation();
        await jumpTo(p.intervalHours);
        await runEligible();
        await runEligible();
        await markNoResponse();
        window.CMX_LAB_DECISIONS?.reconcile?.();
        renderResult("No-response branch exercised");
      }
      if (name === "full") {
        await newSimulation();
        await jumpTo(p.intervalHours);
        await runEligible();
        await runEligible();
        await markNoResponse();
        await runEligible();
        await acknowledgeNext();
        await jumpTo(p.intervalHours + p.graceHours);
        window.CMX_LAB_DECISIONS?.reconcile?.();
        await approveFinal();
        renderResult("Full chain exercised");
      }
      document.dispatchEvent(new CustomEvent("cmx:lab-test-center-completed", { detail:{ scenario:name, simulationId:currentSimulation()?.id || "" } }));
    } finally {
      setBusy(false);
    }
  }

  function markup() {
    return `<header class="lab-test-head"><div><span>TEST CENTER</span><h2>Run a contingency test</h2><p>Exercise timing and decision paths using synthetic outcomes.</p></div><b class="lab-test-state">SIMULATION ONLY</b></header>
      <div class="lab-test-scenarios">
        <button type="button" data-test-scenario="deadline"><span>01</span><strong>Deadline</strong><small>Reach the check-in boundary</small></button>
        <button type="button" data-test-scenario="no-reply"><span>02</span><strong>No reply</strong><small>Delivery succeeds, acknowledgement does not</small></button>
        <button type="button" data-test-scenario="failure"><span>03</span><strong>Failure</strong><small>Force the next eligible action to fail</small></button>
        <button type="button" data-test-scenario="final"><span>04</span><strong>Final trigger</strong><small>Jump to the end of grace</small></button>
      </div>
      <div class="lab-test-full"><button type="button" data-test-scenario="full"><span>FULL</span><strong>Run guided chain</strong><small>Deadline → delivery → no reply → fallback → final approval</small><em>▶</em></button></div>
      <div class="lab-test-result" id="labTestResult" aria-live="polite"></div>`;
  }

  function ensure() {
    queued = false;
    const sequence = $(".lab-sequence-root");
    if (!sequence) return;
    root = $("#labTestCenter", sequence);
    if (!root) {
      root = document.createElement("section");
      root.id = "labTestCenter";
      root.className = "lab-test-center";
      root.innerHTML = markup();
      const stage = $(".lab-sequence-stage", sequence);
      if (stage) stage.before(root); else sequence.prepend(root);
      root.addEventListener("click", event => {
        const name = event.target.closest("[data-test-scenario]")?.dataset.testScenario;
        if (name) scenario(name);
      });
      renderResult("Ready");
    }
    document.body.dataset.labTestCenter = "ready";
  }

  function queueEnsure() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(ensure);
  }

  async function openCenter() {
    await openSequence();
    queueEnsure();
    await sleep(80);
    root?.scrollIntoView({ behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start" });
  }

  document.addEventListener("click", event => {
    const open = event.target.closest("[data-test-center-open]");
    if (!open) return;
    event.preventDefault();
    event.stopPropagation();
    openCenter();
  }, true);

  const watcher = new MutationObserver(queueEnsure);
  const sequencePanel = $('[data-view-panel="timeline"]');
  if (sequencePanel) watcher.observe(sequencePanel, { childList:true, subtree:true });

  window.CMX_LAB_TEST_CENTER = Object.freeze({
    open: openCenter,
    run: name => scenario(name),
    summary: () => ({ ...stateSummary() })
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", queueEnsure, { once:true });
  else queueEnsure();
})();