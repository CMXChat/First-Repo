(() => {
  "use strict";

  const API_BASE = location.hostname === "db.cmxchat.com"
    ? "https://api.cmxchat.com/api/v1"
    : "http://localhost:8000/api/v1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  let publicStatus = null;
  let policy = null;
  let busy = false;

  const isUnlocked = () => document.body.classList.contains("operator-unlocked");
  const hourLabel = value => `${value} hour${Number(value) === 1 ? "" : "s"}`;
  const formatDateTime = value => {
    const timestamp = Date.parse(value || "");
    if (!Number.isFinite(timestamp)) return "None";
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date(timestamp));
  };

  function showMessage(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 3600);
  }

  async function readJson(response) {
    if (response.status === 204) return null;
    try { return await response.json(); }
    catch { return null; }
  }

  async function request(path, options = {}) {
    const headers = { Accept: "application/json", ...(options.headers || {}) };
    if (options.mutation) {
      const sessionResponse = await fetch(`${API_BASE}/checkin/operator/session`, {
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!sessionResponse.ok) {
        const error = new Error("Private access required");
        error.status = sessionResponse.status;
        throw error;
      }
      const session = await sessionResponse.json();
      if (!session.csrf_token) throw new Error("Private session is missing its CSRF token");
      headers["X-CSRF-Token"] = session.csrf_token;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      cache: "no-store",
      ...options,
      headers,
    });
    if (!response.ok) {
      const body = await readJson(response);
      const error = new Error(body?.detail || `Request failed with ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return readJson(response);
  }

  function settingsMarkup() {
    return `
      <div class="dialog-head">
        <div><small>CHECK IN CONTROL</small><h2>Switch settings</h2></div>
        <button value="cancel" class="dialog-close" aria-label="Close">×</button>
      </div>

      <section class="phase1-current" aria-label="Current switch policy">
        <div>
          <small>LIVE POLICY</small>
          <strong id="phase1CurrentSchedule">Reading server policy…</strong>
          <span id="phase1CurrentDeadline">Next deadline pending</span>
        </div>
        <b id="phase1PolicyState" data-state="locked">LOCKED</b>
      </section>

      <div class="phase1-locked" id="phase1LockedControls">
        <div class="setting-note">
          <strong>Private controls</strong>
          <p>Unlock your private session to change timing, pause the switch, resume it, or set a one time deadline.</p>
        </div>
        <button class="primary-small" id="phase1Unlock" type="button">Unlock controls</button>
      </div>

      <div class="phase1-private" id="phase1PrivateControls" hidden>
        <section class="phase1-section">
          <div class="phase1-section-head">
            <div><small>TIMING POLICY</small><strong>Check in window</strong></div>
            <span id="phase1PolicyVersion">Version —</span>
          </div>
          <div class="phase1-grid">
            <div class="field-group">
              <label for="phase1Interval">Check in interval</label>
              <div class="phase1-input-unit"><input id="phase1Interval" inputmode="numeric" type="number" min="1" max="8784" step="1" /><span>hours</span></div>
            </div>
            <div class="field-group">
              <label for="phase1Grace">Grace period</label>
              <div class="phase1-input-unit"><input id="phase1Grace" inputmode="numeric" type="number" min="0" max="720" step="1" /><span>hours</span></div>
            </div>
          </div>
          <div class="field-group">
            <label for="phase1WindowBehavior">Apply new policy</label>
            <select id="phase1WindowBehavior">
              <option value="next_checkin">Starting with my next check in</option>
              <option value="recalculate">Recalculate the current deadline</option>
              <option value="explicit_deadline">Use a specific next deadline</option>
            </select>
            <small class="phase1-help" id="phase1WindowHelp">Keeps the current window unchanged. The new timing starts after your next successful check in.</small>
          </div>
          <div class="field-group" id="phase1PolicyDeadlineField" hidden>
            <label for="phase1PolicyDeadline">Specific next deadline</label>
            <input id="phase1PolicyDeadline" type="datetime-local" />
          </div>
          <div class="field-group">
            <label for="phase1PolicyReason">Reason <span>optional</span></label>
            <input id="phase1PolicyReason" maxlength="500" placeholder="Why this timing is changing" />
          </div>
          <div class="phase1-actions">
            <button class="primary-small" id="phase1SavePolicy" type="button">Publish timing change</button>
          </div>
        </section>

        <section class="phase1-section">
          <div class="phase1-section-head">
            <div><small>SWITCH CONTROL</small><strong id="phase1PauseTitle">Pause or resume</strong></div>
            <span id="phase1PauseMeta">Reading state</span>
          </div>
          <div id="phase1PauseControls">
            <div class="field-group">
              <label for="phase1PauseReason">Pause reason <span>optional</span></label>
              <input id="phase1PauseReason" maxlength="500" placeholder="Why the countdown should stop" />
            </div>
            <button class="secondary-small phase1-warning" id="phase1Pause" type="button">Pause switch</button>
          </div>
          <div id="phase1ResumeControls" hidden>
            <div class="field-group">
              <label for="phase1ResumeBehavior">Resume behavior</label>
              <select id="phase1ResumeBehavior">
                <option value="fresh">Start a fresh full window</option>
                <option value="remaining">Continue with remaining time</option>
                <option value="explicit_deadline">Resume to a specific deadline</option>
              </select>
            </div>
            <div class="field-group" id="phase1ResumeDeadlineField" hidden>
              <label for="phase1ResumeDeadline">Resume deadline</label>
              <input id="phase1ResumeDeadline" type="datetime-local" />
            </div>
            <button class="primary-small" id="phase1Resume" type="button">Resume switch</button>
          </div>
        </section>

        <section class="phase1-section">
          <div class="phase1-section-head">
            <div><small>ONE TIME CONTROL</small><strong>Next deadline override</strong></div>
            <span id="phase1OverrideMeta">No override</span>
          </div>
          <p class="phase1-section-copy">Sets the authoritative deadline for the current window without recording a check in.</p>
          <div class="field-group">
            <label for="phase1DeadlineOverride">Next deadline</label>
            <input id="phase1DeadlineOverride" type="datetime-local" />
          </div>
          <div class="phase1-actions">
            <button class="secondary-small" id="phase1SetOverride" type="button">Set one time deadline</button>
            <button class="secondary-small" id="phase1RefreshPolicy" type="button">Refresh policy</button>
          </div>
        </section>
      </div>

      <p class="phase1-error" id="phase1Error" role="alert" aria-live="polite"></p>
      <menu><button value="default" class="secondary-small">Close</button></menu>`;
  }

  function installSettings() {
    const form = $("#settingsForm");
    if (!form || form.dataset.phase1Ready === "true") return;
    form.dataset.phase1Ready = "true";
    form.classList.add("phase1-settings-form");
    form.innerHTML = settingsMarkup();

    $("#phase1Unlock")?.addEventListener("click", () => {
      $("#settingsDialog")?.close();
      $("#operatorButton")?.click();
    });
    $("#phase1WindowBehavior")?.addEventListener("change", updatePolicyBehavior);
    $("#phase1ResumeBehavior")?.addEventListener("change", updateResumeBehavior);
    $("#phase1SavePolicy")?.addEventListener("click", savePolicy);
    $("#phase1Pause")?.addEventListener("click", pauseSwitch);
    $("#phase1Resume")?.addEventListener("click", resumeSwitch);
    $("#phase1SetOverride")?.addEventListener("click", setDeadlineOverride);
    $("#phase1RefreshPolicy")?.addEventListener("click", loadPolicy);
  }

  function setError(message = "") {
    const node = $("#phase1Error");
    if (node) node.textContent = message;
  }

  function setBusy(next) {
    busy = next;
    $$("#phase1PrivateControls button, #phase1PrivateControls input, #phase1PrivateControls select").forEach(control => {
      control.disabled = next;
    });
  }

  function updatePolicyBehavior() {
    const behavior = $("#phase1WindowBehavior")?.value;
    const field = $("#phase1PolicyDeadlineField");
    if (field) field.hidden = behavior !== "explicit_deadline";
    const copy = {
      next_checkin: "Keeps the current window unchanged. The new timing starts after your next successful check in.",
      recalculate: "Recalculates the current deadline from your latest check in using the new interval.",
      explicit_deadline: "Publishes the new policy and sets the current window to the specific deadline you choose.",
    };
    const help = $("#phase1WindowHelp");
    if (help) help.textContent = copy[behavior] || "";
  }

  function updateResumeBehavior() {
    const field = $("#phase1ResumeDeadlineField");
    if (field) field.hidden = $("#phase1ResumeBehavior")?.value !== "explicit_deadline";
  }

  function toIso(localValue) {
    if (!localValue) return null;
    const date = new Date(localValue);
    return Number.isFinite(date.getTime()) ? date.toISOString() : null;
  }

  function renderPublicTiming() {
    if (!publicStatus) return;
    const interval = Number(publicStatus.interval_hours);
    const grace = Number(publicStatus.grace_hours);
    if (!Number.isFinite(interval) || !Number.isFinite(grace)) return;

    const current = $("#phase1CurrentSchedule");
    const deadline = $("#phase1CurrentDeadline");
    if (current) current.textContent = `${hourLabel(interval)} rolling · ${hourLabel(grace)} grace`;
    if (deadline) deadline.textContent = `Next deadline ${formatDateTime(publicStatus.next_due_at)}`;

    const modeStrong = $(".mode-strip strong");
    const modeCopy = $(".mode-strip p");
    if (modeStrong) modeStrong.textContent = `Primary ${hourLabel(interval)} switch`;
    if (modeCopy) modeCopy.textContent = `Verified proof of life opens a ${hourLabel(interval)} operating window. A ${hourLabel(grace)} grace period follows the deadline.`;

    const safeTrack = $('[data-track-stage="safe"] small');
    const graceTrack = $('[data-track-stage="grace"] small');
    if (safeTrack) safeTrack.textContent = `${hourLabel(interval)} window`;
    if (graceTrack) graceTrack.textContent = `${hourLabel(grace)} grace`;

    const statusCopy = $("#statusCopy");
    if (statusCopy?.textContent.includes("primary 72 hour switch")) {
      statusCopy.textContent = `The primary ${hourLabel(interval)} switch is not active.`;
    }

    const pressure = $("#pressureCopy");
    const state = $("#statusConsole")?.dataset.state;
    if (pressure && state === "soon") pressure.textContent = `A verified check in resets the ${hourLabel(interval)} window.`;
    if (pressure && state === "grace") pressure.textContent = `The ${hourLabel(grace)} grace window is active.`;
  }

  function renderAccessState() {
    const unlocked = isUnlocked();
    const locked = $("#phase1LockedControls");
    const privateControls = $("#phase1PrivateControls");
    const stateBadge = $("#phase1PolicyState");
    if (locked) locked.hidden = unlocked;
    if (privateControls) privateControls.hidden = !unlocked;
    if (stateBadge && !unlocked) {
      stateBadge.dataset.state = "locked";
      stateBadge.textContent = "LOCKED";
    }
    if (unlocked) loadPolicy();
  }

  function renderPolicy() {
    if (!policy) return;
    const intervalHours = policy.interval_seconds / 3600;
    const graceHours = policy.grace_seconds / 3600;
    const paused = Boolean(policy.paused_at);

    $("#phase1Interval").value = String(intervalHours);
    $("#phase1Grace").value = String(graceHours);
    $("#phase1PolicyVersion").textContent = `Version ${policy.version_number}`;
    $("#phase1PauseMeta").textContent = paused ? `Paused ${formatDateTime(policy.paused_at)}` : "Countdown active";
    $("#phase1OverrideMeta").textContent = policy.deadline_override_at ? `Override ${formatDateTime(policy.deadline_override_at)}` : "No override";
    $("#phase1PauseControls").hidden = paused;
    $("#phase1ResumeControls").hidden = !paused;

    const badge = $("#phase1PolicyState");
    if (badge) {
      badge.dataset.state = paused ? "paused" : "active";
      badge.textContent = paused ? "PAUSED" : "ACTIVE";
    }
    const current = $("#phase1CurrentSchedule");
    const deadline = $("#phase1CurrentDeadline");
    if (current) current.textContent = `${hourLabel(intervalHours)} rolling · ${hourLabel(graceHours)} grace · UTC`;
    if (deadline) deadline.textContent = `Next deadline ${formatDateTime(policy.next_due_at)}`;
    updatePolicyBehavior();
    updateResumeBehavior();
  }

  async function loadPublicStatus() {
    try {
      publicStatus = await request("/checkin/public/status");
      renderPublicTiming();
    } catch {
      // Core checkin.js owns the primary public-link error state.
    }
  }

  async function loadPolicy() {
    if (!isUnlocked() || busy) return;
    setError();
    try {
      policy = await request("/checkin/operator/switch/policy");
      renderPolicy();
    } catch (error) {
      if (error.status === 401) renderAccessState();
      else setError(error.message || "Policy could not be loaded.");
    }
  }

  async function mutate(path, method, payload, successMessage) {
    if (busy || !isUnlocked()) return;
    setBusy(true);
    setError();
    try {
      policy = await request(path, {
        method,
        mutation: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      renderPolicy();
      await loadPublicStatus();
      showMessage(successMessage);
      window.setTimeout(() => location.reload(), 650);
    } catch (error) {
      setError(error.message || "The server rejected this change.");
      showMessage("No switch change was applied.");
    } finally {
      setBusy(false);
    }
  }

  async function savePolicy() {
    const interval = Number($("#phase1Interval")?.value);
    const grace = Number($("#phase1Grace")?.value);
    const behavior = $("#phase1WindowBehavior")?.value || "next_checkin";
    const deadline = behavior === "explicit_deadline" ? toIso($("#phase1PolicyDeadline")?.value) : null;
    const reason = $("#phase1PolicyReason")?.value.trim() || null;

    if (!Number.isInteger(interval) || interval < 1 || interval > 8784) return setError("Interval must be a whole number from 1 to 8784 hours.");
    if (!Number.isInteger(grace) || grace < 0 || grace > 720) return setError("Grace must be a whole number from 0 to 720 hours.");
    if (behavior === "explicit_deadline" && !deadline) return setError("Choose a valid specific deadline.");

    const effect = behavior === "next_checkin"
      ? "The current deadline will stay unchanged until your next check in."
      : behavior === "recalculate"
        ? "The current deadline will be recalculated immediately from your latest check in."
        : `The current deadline will become ${formatDateTime(deadline)}.`;
    if (!confirm(`Publish ${hourLabel(interval)} + ${hourLabel(grace)} grace as a new immutable policy version?\n\n${effect}`)) return;

    await mutate("/checkin/operator/switch/policy", "PUT", {
      interval_seconds: interval * 3600,
      grace_seconds: grace * 3600,
      timezone: "UTC",
      default_resume_behavior: policy?.default_resume_behavior || "fresh",
      current_window_behavior: behavior,
      explicit_deadline_at: deadline,
      reason,
    }, "Timing policy published.");
  }

  async function pauseSwitch() {
    const reason = $("#phase1PauseReason")?.value.trim() || null;
    if (!confirm("Pause switch progression now? The current countdown and Incident progression will freeze until you resume it.")) return;
    await mutate("/checkin/operator/switch/pause", "POST", { reason }, "Switch paused.");
  }

  async function resumeSwitch() {
    const behavior = $("#phase1ResumeBehavior")?.value || "fresh";
    const deadline = behavior === "explicit_deadline" ? toIso($("#phase1ResumeDeadline")?.value) : null;
    if (behavior === "explicit_deadline" && !deadline) return setError("Choose a valid resume deadline.");
    const descriptions = {
      fresh: "start a fresh full policy window",
      remaining: "continue with the remaining time from when it was paused",
      explicit_deadline: `resume to ${formatDateTime(deadline)}`,
    };
    if (!confirm(`Resume the switch and ${descriptions[behavior]}?`)) return;
    await mutate("/checkin/operator/switch/resume", "POST", {
      behavior,
      explicit_deadline_at: deadline,
    }, "Switch resumed.");
  }

  async function setDeadlineOverride() {
    const deadline = toIso($("#phase1DeadlineOverride")?.value);
    if (!deadline) return setError("Choose a valid next deadline.");
    if (!confirm(`Set the authoritative next deadline to ${formatDateTime(deadline)}? This does not record a check in.`)) return;
    await mutate("/checkin/operator/switch/deadline-override", "PUT", { deadline_at: deadline }, "One time deadline set.");
  }

  function observeCoreState() {
    const intervalNode = $("#intervalValue");
    const graceNode = $("#graceValue");
    const statusNode = $("#statusConsole");
    [intervalNode, graceNode].filter(Boolean).forEach(node => {
      new MutationObserver(() => loadPublicStatus()).observe(node, { childList: true, characterData: true, subtree: true });
    });
    if (statusNode) {
      new MutationObserver(() => renderPublicTiming()).observe(statusNode, { attributes: true, attributeFilter: ["data-state"] });
    }

    let lastUnlocked = isUnlocked();
    new MutationObserver(() => {
      const next = isUnlocked();
      if (next === lastUnlocked) return;
      lastUnlocked = next;
      renderAccessState();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }

  function boot() {
    installSettings();
    loadPublicStatus();
    renderAccessState();
    observeCoreState();
    ["#openSettings", "#quickSettings", "#mobileSettings", "#mobileNavSettings"].forEach(selector => {
      $(selector)?.addEventListener("click", () => {
        loadPublicStatus();
        if (isUnlocked()) loadPolicy();
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
