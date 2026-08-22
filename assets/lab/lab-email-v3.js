(() => {
  "use strict";

  const api = window.CMXEmailLabApi;
  const operator = window.CMXOperatorApi;
  if (!api || !operator) return;

  const $ = (id) => document.getElementById(id);
  const els = {
    backend: $("backendState"),
    backendBadge: $("backendBadge"),
    unlockPanel: $("backendAccess"),
    unlockForm: $("backendUnlockForm"),
    operatorKey: $("operatorKeyInput"),
    unlockButton: $("backendUnlockSubmit"),
    unlockError: $("backendUnlockError"),
    disconnect: $("backendDisconnect"),
    person: $("personSelect"),
    contact: $("contactSelect"),
    recipientFact: $("recipientFact"),
    connection: $("connectionSelect"),
    sender: $("senderSelect"),
    readiness: $("connectionReadiness"),
    subject: $("subjectInput"),
    body: $("bodyInput"),
    freeze: $("freezeContent"),
    contentState: $("contentState"),
    review: $("reviewSummary"),
    prepare: $("prepareAutomation"),
    publish: $("publishAutomation"),
    automationState: $("automationState"),
    fakeBehavior: $("fakeBehavior"),
    realConfirm: $("realConfirm"),
    requestRun: $("requestRun"),
    processRun: $("processRun"),
    runState: $("runState"),
    receiptEmpty: $("receiptEmpty"),
    receiptView: $("receiptView"),
    toast: $("toast"),
  };

  const state = {
    sessionReady: false,
    people: [],
    contacts: [],
    connections: [],
    senders: [],
    readiness: null,
    content: null,
    contentVersion: null,
    automation: null,
    automationVersion: null,
    run: null,
    stepId: crypto.randomUUID(),
  };

  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[char]);

  function toast(message, error = false) {
    els.toast.textContent = message;
    els.toast.className = `toast show${error ? " error" : ""}`;
    clearTimeout(toast.t);
    toast.t = setTimeout(() => { els.toast.className = "toast"; }, 3200);
  }

  function errorMessage(error) {
    return error?.message || "Request failed";
  }

  function selected(list, id) {
    return list.find((item) => String(item.id) === String(id)) || null;
  }

  function active(item) {
    return !item?.lifecycle || item.lifecycle === "active";
  }

  function setOptions(element, items, label) {
    element.innerHTML = `<option value="">${esc(label)}</option>` + items.map((item) => (
      `<option value="${esc(item.id)}">${esc(item.display_name || item.name || item.address || item.normalized_address || item.id)}</option>`
    )).join("");
  }

  function providerMode() {
    return document.querySelector('input[name="provider"]:checked')?.value || "fake";
  }

  function setBackend(kind, message) {
    els.backend.textContent = message;
    els.backendBadge.textContent = kind.replaceAll("_", " ").toUpperCase();
    els.backendBadge.dataset.state = kind;
  }

  function setWorkflowLocked(locked) {
    els.person.disabled = locked;
    els.connection.disabled = locked;
    if (locked) {
      els.contact.disabled = true;
      els.sender.disabled = true;
      els.freeze.disabled = true;
      els.prepare.disabled = true;
      els.publish.disabled = true;
      els.requestRun.disabled = true;
      els.processRun.disabled = true;
    } else if (!state.contentVersion) {
      els.freeze.disabled = false;
    }
  }

  function showUnlock(message = "Unlock the protected backend to load durable Email data.") {
    state.sessionReady = false;
    setBackend("locked", message);
    els.unlockPanel.hidden = false;
    els.disconnect.hidden = true;
    els.unlockError.textContent = "";
    setWorkflowLocked(true);
    els.recipientFact.textContent = "Protected Directory is locked.";
    els.readiness.className = "readiness";
    els.readiness.textContent = "Protected Connection readiness is locked.";
  }

  function showSessionReady() {
    state.sessionReady = true;
    els.unlockPanel.hidden = true;
    els.disconnect.hidden = false;
    setWorkflowLocked(false);
  }

  function showCapabilityGap() {
    setBackend("not_deployed", "Protected session ready · newer Email APIs are not deployed on this API yet.");
    els.recipientFact.textContent = "Session works, but the Directory Email dependency is not available on the deployed API.";
    els.readiness.className = "readiness is-blocked";
    els.readiness.textContent = "Session works, but Connection/Sender readiness is not available on the deployed API.";
    els.person.disabled = true;
    els.connection.disabled = true;
  }

  function requireSession(error) {
    if (operator.classify(error) === "locked") {
      showUnlock("Protected session expired or is missing. Unlock again to continue.");
      toast("Protected session expired. Unlock again.", true);
      return true;
    }
    return false;
  }

  function renderSummary() {
    const person = selected(state.people, els.person.value);
    const contact = selected(state.contacts, els.contact.value);
    const connection = selected(state.connections, els.connection.value);
    const sender = selected(state.senders, els.sender.value);
    const ready = Boolean(state.sessionReady && person && contact && connection && sender && state.contentVersion);

    els.review.innerHTML = ready
      ? `<div class="receipt-grid"><div class="receipt-card"><span>To</span><b>${esc(person.display_name)} · ${esc(contact.address || contact.normalized_address)}</b></div><div class="receipt-card"><span>From</span><b>${esc(sender.display_name || sender.address || sender.normalized_address)}</b></div><div class="receipt-card"><span>Message</span><b>${esc(state.content?.asset?.title || els.subject.value)} · ContentVersion ${esc(state.contentVersion.id)}</b></div></div>`
      : "Choose recipient, sender and freeze content first.";

    els.prepare.disabled = !ready;
    els.requestRun.disabled = !state.automationVersion;
  }

  async function loadBackendData() {
    showSessionReady();
    setBackend("connected", "Protected session ready · checking Email capabilities…");

    const [peopleResult, connectionsResult] = await Promise.allSettled([
      api.listPeople(),
      api.listConnections(),
    ]);

    const failures = [peopleResult, connectionsResult].filter((result) => result.status === "rejected");
    if (failures.some((result) => requireSession(result.reason))) return;

    const bothMissing = failures.length === 2 && failures.every((result) => result.reason?.status === 404);
    if (bothMissing) {
      showCapabilityGap();
      return;
    }

    if (peopleResult.status === "fulfilled") {
      state.people = (peopleResult.value || []).filter(active);
      setOptions(els.person, state.people, "Choose a Person");
      els.person.disabled = false;
      els.recipientFact.textContent = state.people.length
        ? `${state.people.length} active ${state.people.length === 1 ? "Person" : "People"} available from the protected Directory.`
        : "No active People are currently available in the protected Directory.";
    } else {
      state.people = [];
      setOptions(els.person, [], "Directory unavailable");
      els.person.disabled = true;
      els.recipientFact.textContent = peopleResult.reason?.status === 404
        ? "Directory API is not deployed on this backend yet."
        : `Directory unavailable: ${errorMessage(peopleResult.reason)}`;
    }

    if (connectionsResult.status === "fulfilled") {
      state.connections = (connectionsResult.value || []).filter(active);
      setOptions(els.connection, state.connections, "Choose a Connection");
      els.connection.disabled = false;
      els.readiness.className = "readiness";
      els.readiness.textContent = state.connections.length
        ? `${state.connections.length} active ${state.connections.length === 1 ? "Connection" : "Connections"} available. Choose one for backend readiness.`
        : "No active Connections are currently available.";
    } else {
      state.connections = [];
      setOptions(els.connection, [], "Connections unavailable");
      els.connection.disabled = true;
      els.readiness.className = "readiness is-blocked";
      els.readiness.textContent = connectionsResult.reason?.status === 404
        ? "Connection API is not deployed on this backend yet."
        : `Connection data unavailable: ${errorMessage(connectionsResult.reason)}`;
    }

    if (peopleResult.status === "fulfilled" && connectionsResult.status === "fulfilled") {
      setBackend("connected", `Protected session ready · ${state.people.length} People · ${state.connections.length} Connections`);
    } else {
      setBackend("partial", "Protected session ready · one or more newer Email capabilities are unavailable.");
    }

    renderSummary();
  }

  async function bootstrap() {
    setWorkflowLocked(true);
    try {
      await operator.session({ refresh: true });
      await loadBackendData();
    } catch (error) {
      const kind = operator.classify(error);
      if (kind === "locked") {
        showUnlock();
        return;
      }
      if (kind === "forbidden") {
        setBackend("denied", "Backend rejected this browser Origin or protected access.");
      } else if (kind === "network") {
        setBackend("offline", "Could not reach the protected API from this browser.");
      } else {
        setBackend("unavailable", `Protected backend unavailable: ${errorMessage(error)}`);
      }
      els.unlockPanel.hidden = false;
      els.disconnect.hidden = true;
      setWorkflowLocked(true);
    }
  }

  els.unlockForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const key = els.operatorKey.value;
    if (!key) {
      els.unlockError.textContent = "Enter the operator key.";
      els.operatorKey.focus();
      return;
    }

    els.unlockButton.disabled = true;
    els.unlockError.textContent = "";
    setBackend("unlocking", "Unlocking protected backend…");
    try {
      await operator.unlock(key);
      els.operatorKey.value = "";
      toast("Protected backend unlocked.");
      await loadBackendData();
    } catch (error) {
      els.operatorKey.value = "";
      const kind = operator.classify(error);
      els.unlockError.textContent = kind === "locked"
        ? "Operator key was not accepted."
        : kind === "forbidden"
          ? "This browser Origin is not allowed by the backend."
          : errorMessage(error);
      showUnlock(kind === "forbidden" ? "Backend denied this browser Origin." : "Protected backend remains locked.");
      els.unlockError.textContent = kind === "locked" ? "Operator key was not accepted." : errorMessage(error);
    } finally {
      els.unlockButton.disabled = false;
      els.operatorKey.focus();
    }
  });

  els.disconnect.addEventListener("click", async () => {
    els.disconnect.disabled = true;
    try {
      await operator.logout();
      state.people = [];
      state.contacts = [];
      state.connections = [];
      state.senders = [];
      setOptions(els.person, [], "Choose a Person");
      setOptions(els.contact, [], "Choose an email");
      setOptions(els.connection, [], "Choose a Connection");
      setOptions(els.sender, [], "Choose a sender");
      showUnlock("Protected session ended. Unlock again when you want to continue.");
      toast("Protected backend session ended.");
    } catch (error) {
      if (!requireSession(error)) toast(errorMessage(error), true);
    } finally {
      els.disconnect.disabled = false;
    }
  });

  els.person.addEventListener("change", async () => {
    state.contacts = [];
    els.contact.disabled = true;
    setOptions(els.contact, [], "Choose an email");
    if (!els.person.value) {
      renderSummary();
      return;
    }

    try {
      const rows = await api.listContacts(els.person.value);
      state.contacts = (rows || []).filter((item) => active(item) && item.channel === "email");
      setOptions(els.contact, state.contacts, "Choose an email");
      els.contact.disabled = false;
      els.recipientFact.textContent = state.contacts.length
        ? `${state.contacts.length} active email ContactMethod${state.contacts.length === 1 ? "" : "s"} available.`
        : "This Person has no active email ContactMethod.";
    } catch (error) {
      if (requireSession(error)) return;
      state.contacts = [];
      els.recipientFact.textContent = error?.status === 404
        ? "ContactMethod API/resource is not available on this backend."
        : `ContactMethods unavailable: ${errorMessage(error)}`;
      toast(errorMessage(error), true);
    }
    renderSummary();
  });

  els.contact.addEventListener("change", renderSummary);

  els.connection.addEventListener("change", async () => {
    state.senders = [];
    state.readiness = null;
    els.sender.disabled = true;
    setOptions(els.sender, [], "Choose a sender");
    els.readiness.className = "readiness";
    if (!els.connection.value) {
      renderSummary();
      return;
    }

    try {
      const [senders, facts] = await Promise.all([
        api.listSenders(els.connection.value),
        api.connectionReadiness(els.connection.value),
      ]);
      state.senders = (senders || []).filter(active);
      state.readiness = facts;
      setOptions(els.sender, state.senders, "Choose a sender");
      els.sender.disabled = false;
      const issues = facts?.issue_codes || facts?.issues || [];
      const real = Boolean(facts?.real_smtp_available);
      const fake = Boolean(facts?.fake_provider_available);
      els.readiness.className = `readiness ${issues.length ? "is-blocked" : "is-ready"}`;
      els.readiness.textContent = `Backend facts · safe simulation ${fake ? "available" : "unavailable"} · real SMTP ${real ? "available" : "unavailable"}${issues.length ? ` · ${issues.map((item) => item.code || item).join(", ")}` : ""}`;
    } catch (error) {
      if (requireSession(error)) return;
      els.readiness.className = "readiness is-blocked";
      els.readiness.textContent = error?.status === 404
        ? "Sender/readiness capability is not deployed on this backend yet."
        : `Readiness unavailable: ${errorMessage(error)}`;
      toast(errorMessage(error), true);
    }
    renderSummary();
  });

  els.sender.addEventListener("change", renderSummary);

  els.freeze.addEventListener("click", async () => {
    if (!state.sessionReady) {
      showUnlock();
      return;
    }
    const subject = els.subject.value.trim();
    const body = els.body.value;
    if (!subject || !body.trim()) {
      toast("Subject and body are required.", true);
      return;
    }

    els.freeze.disabled = true;
    els.contentState.textContent = "Creating protected content…";
    try {
      const details = await api.createContent({
        kind: "text",
        title: subject,
        source_text: "",
        visibility: "action_scoped",
      });
      const assetId = details.asset.id;
      const draft = await api.updateContentDraft(assetId, {
        expected_revision: details.draft.revision,
        source_text: body,
      });
      const version = await api.saveContentVersion(assetId);
      state.content = { ...details, draft };
      state.contentVersion = version;
      els.subject.disabled = true;
      els.body.disabled = true;
      els.freeze.textContent = "Message frozen";
      els.contentState.textContent = `ContentVersion ${version.id} · v${version.version_number} · ${version.checksum_sha256.slice(0, 12)}…`;
      toast("Exact message version frozen in the backend.");
      renderSummary();
    } catch (error) {
      if (requireSession(error)) return;
      els.freeze.disabled = false;
      els.contentState.textContent = error?.status === 409
        ? "Freeze conflict: the backend Draft changed. Reload current truth before overwriting."
        : error?.status === 404
          ? "Library content/version API is not deployed on this backend yet."
          : `Freeze failed: ${errorMessage(error)}`;
      toast(els.contentState.textContent, true);
    }
  });

  els.prepare.addEventListener("click", async () => {
    const person = selected(state.people, els.person.value);
    const contact = selected(state.contacts, els.contact.value);
    const connection = selected(state.connections, els.connection.value);
    const sender = selected(state.senders, els.sender.value);
    if (!person || !contact || !connection || !sender || !state.contentVersion) return;

    els.prepare.disabled = true;
    els.automationState.textContent = "Creating Automation Draft…";
    try {
      const details = await api.createAutomation({
        name: `Email · ${state.content.asset.title}`,
        description: "Manual owner Email action. No unattended authority.",
      });
      state.automation = details;
      const definition = {
        schema_version: 1,
        trigger: { type: "manual" },
        conditions: [],
        actions: [{
          type: "email",
          step_id: state.stepId,
          connection_id: connection.id,
          sender_identity_id: sender.id,
          recipient_person_id: person.id,
          recipient_contact_method_id: contact.id,
          content_asset_id: state.content.asset.id,
        }],
        start_policy: { type: "immediate" },
        finish: { type: "finish" },
      };
      const draft = await api.updateAutomationDraft(details.automation.id, {
        expected_revision: details.draft.revision,
        definition,
      });
      state.automation.draft = draft;
      const preflight = await api.preflight(details.automation.id);
      if (!preflight.ready) {
        const issues = (preflight.issues || []).map((item) => item.code || item.description).join(", ") || "not ready";
        els.automationState.textContent = `Backend preflight blocked: ${issues}`;
        els.publish.disabled = true;
        toast("Backend preflight is not ready.", true);
        return;
      }
      els.automationState.textContent = `Preflight ready · Automation ${details.automation.id} · Draft r${draft.revision}`;
      els.publish.disabled = false;
      toast("Backend preflight ready.");
    } catch (error) {
      if (requireSession(error)) return;
      els.prepare.disabled = false;
      els.automationState.textContent = error?.status === 404
        ? "Automation/preflight API is not deployed on this backend yet."
        : `Prepare failed: ${errorMessage(error)}`;
      toast(els.automationState.textContent, true);
    }
  });

  els.publish.addEventListener("click", async () => {
    if (!state.automation) return;
    els.publish.disabled = true;
    els.automationState.textContent = "Reviewing and publishing immutable version…";
    try {
      await api.review(state.automation.automation.id);
      state.automationVersion = await api.publish(state.automation.automation.id);
      els.automationState.textContent = `Published AutomationVersion ${state.automationVersion.id} · v${state.automationVersion.version_number}`;
      els.requestRun.disabled = false;
      els.prepare.disabled = true;
      toast("Automation published.");
    } catch (error) {
      if (requireSession(error)) return;
      els.publish.disabled = false;
      els.automationState.textContent = error?.status === 404
        ? "Review/Publish API is not deployed on this backend yet."
        : `Publish failed: ${errorMessage(error)}`;
      toast(els.automationState.textContent, true);
    }
  });

  document.querySelectorAll('input[name="provider"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const real = providerMode() === "real_smtp";
      els.fakeBehavior.disabled = real;
      els.runState.textContent = real
        ? "Real SMTP is reserved for a separate explicit acceptance pass."
        : "Safe simulation selected. Runtime history is real; no external email is sent.";
    });
  });

  els.requestRun.addEventListener("click", async () => {
    if (!state.automationVersion) return;
    const mode = providerMode();
    if (mode !== "fake") {
      toast("Real SMTP is intentionally disabled during this acceptance pass.", true);
      return;
    }

    els.requestRun.disabled = true;
    els.runState.textContent = "Requesting manual Runtime Run…";
    try {
      state.run = await api.requestRun(state.automation.automation.id, {
        request_idempotency_key: crypto.randomUUID(),
        fake_behavior: els.fakeBehavior.value,
        provider_mode: "fake",
      });
      els.runState.textContent = `Run ${state.run.id} · ${state.run.status} · safe simulation`;
      els.processRun.disabled = false;
      els.receiptEmpty.hidden = true;
      await refreshReceipt();
      toast("Simulation Run requested. No external email was sent.");
    } catch (error) {
      if (requireSession(error)) return;
      els.requestRun.disabled = false;
      els.runState.textContent = error?.status === 404
        ? "Runtime Run API is not deployed on this backend yet."
        : `Run request failed: ${errorMessage(error)}`;
      toast(els.runState.textContent, true);
    }
  });

  els.processRun.addEventListener("click", async () => {
    if (!state.run) return;
    els.processRun.disabled = true;
    els.runState.textContent = "Processing safe simulation through Runtime…";
    try {
      const details = await api.processRun(state.automation.automation.id, state.run.id, {
        worker_id: "email-v3-browser-proof",
      });
      state.run = details;
      els.runState.textContent = `Run ${details.status} · attempts ${details.attempt_count ?? 0}`;
      if (!["succeeded", "failed", "cancelled"].includes(details.status)) {
        els.processRun.disabled = false;
      }
      await refreshReceipt();
      toast(details.status === "succeeded" ? "Simulation Run completed." : `Run is ${details.status}.`);
    } catch (error) {
      if (requireSession(error)) return;
      els.processRun.disabled = false;
      els.runState.textContent = error?.status === 404
        ? "Explicit Process is development-only and is not deployed on this API."
        : `Process failed: ${errorMessage(error)}`;
      toast(els.runState.textContent, true);
    }
  });

  async function refreshReceipt() {
    if (!state.run) return;
    try {
      const receipt = await api.getReceipt(state.automation.automation.id, state.run.id);
      els.receiptView.hidden = false;
      els.receiptEmpty.hidden = true;
      const frozen = receipt.frozen_email_inputs || receipt.frozen_inputs || receipt.email || {};
      const attempts = receipt.attempts || [];
      const why = receipt.why || receipt.events || [];
      const providerOperation = receipt.provider_operation || receipt.reconciliation || {};
      const reconciliationStatus = providerOperation.reconciliation_status || receipt.reconciliation_status || "n/a";

      els.receiptView.innerHTML = `
        <div class="receipt-grid">
          <div class="receipt-card"><span>Run</span><b>${esc(receipt.run_id || state.run.id)} · ${esc(receipt.run_status || receipt.status || state.run.status)}</b></div>
          <div class="receipt-card"><span>Authority</span><b>${esc(receipt.authority_mode || "manual_owner")}</b></div>
          <div class="receipt-card"><span>Provider</span><b>${esc(receipt.provider_mode || "fake")}</b></div>
          <div class="receipt-card"><span>To</span><b>${esc(frozen.person_display_name || "")} · ${esc(frozen.recipient_address || frozen.contact_method_address || "")}</b></div>
          <div class="receipt-card"><span>From</span><b>${esc(frozen.sender_address || frozen.sender_display_name || "")}</b></div>
          <div class="receipt-card"><span>Content</span><b>${esc(frozen.content_subject || state.content?.asset?.title || "")} · ${esc(frozen.content_version_id || state.contentVersion?.id || "")}</b></div>
          <div class="receipt-card"><span>Attempts</span><b>${attempts.length}</b></div>
          <div class="receipt-card"><span>Ambiguous</span><b>${esc(receipt.ambiguous ?? providerOperation.original_state === "ambiguous")}</b></div>
          <div class="receipt-card"><span>Reconciliation</span><b>${esc(reconciliationStatus)}</b></div>
        </div>
        <div class="timeline">
          ${attempts.map((attempt) => `<article><b>Attempt ${esc(attempt.attempt_number)} · ${esc(attempt.outcome)}</b><p>retryable: ${esc(attempt.retryable)}${attempt.failure_message ? ` · ${esc(attempt.failure_message)}` : ""}</p></article>`).join("")}
          ${why.map((event) => `<article><b>${esc(event.event_type || event.type || "WHY")}</b><p>${esc(event.summary || event.message || "")}</p></article>`).join("")}
        </div>`;
    } catch (error) {
      if (requireSession(error)) return;
      els.receiptView.hidden = false;
      els.receiptEmpty.hidden = true;
      els.receiptView.innerHTML = `<div class="empty">${error?.status === 404 ? "Typed Runtime receipt is not deployed on this API yet." : `Receipt unavailable: ${esc(errorMessage(error))}`}</div>`;
    }
  }

  renderSummary();
  bootstrap();
})();
