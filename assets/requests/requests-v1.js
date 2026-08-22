(() => {
  "use strict";

  const api = window.CMXOperatorApi;
  if (!api) return;

  const $ = (id) => document.getElementById(id);
  const els = {
    backendState: $("backendState"), backendBadge: $("backendBadge"), disconnect: $("backendDisconnect"),
    unlockPanel: $("backendAccess"), unlockForm: $("backendUnlockForm"), operatorKey: $("operatorKeyInput"),
    unlockSubmit: $("backendUnlockSubmit"), unlockError: $("backendUnlockError"),
    modeContacts: $("modeContacts"), modeEmail: $("modeEmail"), contactsMode: $("contactsMode"), emailMode: $("emailMode"),
    input: $("requestInput"), parse: $("parseRequest"), clear: $("clearRequest"), previewEmpty: $("previewEmpty"),
    previewTable: $("previewTable"), previewBody: $("previewBody"), previewSummary: $("previewSummary"),
    approve: $("approveRequest"), writeSummary: $("writeSummary"),
    emailFrom: $("emailFrom"), emailTo: $("emailTo"), emailSubject: $("emailSubject"), emailBody: $("emailBody"),
    emailBehavior: $("emailBehavior"), emailPreview: $("previewEmailRequest"), emailClear: $("clearEmailRequest"),
    emailApprove: $("approveEmailRequest"), emailPlan: $("emailPlan"), emailPlanSummary: $("emailPlanSummary"),
    emailResult: $("emailResult"), emailReceipt: $("emailReceipt"),
  };

  const state = {
    sessionReady: false,
    directoryReady: false,
    peopleCount: null,
    rows: [],
    writing: false,
    mode: "contacts",
    emailPlan: null,
    emailWriting: false,
  };

  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[char]);
  const active = (item) => !item?.lifecycle || item.lifecycle === "active";
  const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
  const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  function setBackend(kind, message) {
    els.backendState.textContent = message;
    els.backendBadge.textContent = kind.replaceAll("_", " ").toUpperCase();
    els.backendBadge.dataset.state = kind;
  }

  function showLocked(message = "Unlock the protected backend before approving writes or Runs.") {
    state.sessionReady = false;
    state.directoryReady = false;
    setBackend("locked", message);
    els.unlockPanel.hidden = false;
    els.disconnect.hidden = true;
    els.approve.disabled = true;
    els.emailApprove.disabled = true;
  }

  function showSession() {
    state.sessionReady = true;
    els.unlockPanel.hidden = true;
    els.disconnect.hidden = false;
  }

  function setMode(mode) {
    state.mode = mode;
    const contacts = mode === "contacts";
    els.contactsMode.hidden = !contacts;
    els.emailMode.hidden = contacts;
    els.modeContacts.setAttribute("aria-pressed", String(contacts));
    els.modeEmail.setAttribute("aria-pressed", String(!contacts));
  }

  function parseLine(raw, index) {
    const line = raw.trim();
    if (!line) return null;
    if (/^(name|display[_ ]?name)\s*[,|\t]\s*(email|address)$/i.test(line)) return null;
    let name = "";
    let email = "";
    let match = line.match(/^(.*?)\s*<\s*([^<>\s]+@[^<>\s]+)\s*>$/);
    if (match) {
      name = match[1].trim(); email = match[2].trim();
    } else {
      const delimiter = line.includes("\t") ? "\t" : line.includes("|") ? "|" : line.includes(",") ? "," : null;
      if (delimiter) {
        const parts = line.split(delimiter).map((part) => part.trim()).filter(Boolean);
        if (parts.length === 2) [name, email] = parts;
      } else {
        match = line.match(/^(.+?)\s+([^\s<>]+@[^\s<>]+)$/);
        if (match) { name = match[1].trim(); email = match[2].trim(); }
      }
    }
    const normalized = normalizeEmail(email);
    const errors = [];
    if (!name) errors.push("missing name");
    if (!email) errors.push("missing email");
    else if (!validEmail(normalized)) errors.push("invalid email");
    return { index, raw: line, name, email, normalized, errors, status: errors.length ? "invalid" : "ready", personId: null, contactId: null, message: errors.join(", ") };
  }

  function renderPreview() {
    const rows = state.rows;
    els.previewEmpty.hidden = rows.length > 0;
    els.previewTable.hidden = rows.length === 0;
    const valid = rows.filter((row) => row.status === "ready").length;
    const invalid = rows.filter((row) => row.status === "invalid").length;
    const created = rows.filter((row) => row.status === "created").length;
    const partial = rows.filter((row) => row.status === "partial").length;
    const failed = rows.filter((row) => row.status === "failed").length;
    els.previewSummary.textContent = rows.length
      ? `${rows.length} rows · ${valid} ready · ${invalid} invalid · ${created} created${partial ? ` · ${partial} partial` : ""}${failed ? ` · ${failed} failed` : ""}`
      : "Nothing parsed yet.";
    els.previewBody.innerHTML = rows.map((row) => `
      <tr><td>${row.index + 1}</td><td><b>${esc(row.name || "—")}</b></td><td><code>${esc(row.email || "—")}</code></td>
      <td><span class="row-state ${esc(row.status)}">${esc(row.status)}</span></td>
      <td>${esc(row.message || (row.personId ? `Person ${row.personId}${row.contactId ? ` · Contact ${row.contactId}` : ""}` : "Ready for review"))}</td></tr>`).join("");
    els.approve.disabled = !(rows.length && rows.every((row) => row.status === "ready") && state.sessionReady && state.directoryReady && !state.writing);
  }

  function parseRequest() {
    const seen = new Set();
    const rows = els.input.value.split(/\r?\n/).map((line, index) => parseLine(line, index)).filter(Boolean);
    for (const row of rows) {
      if (!row.normalized) continue;
      if (seen.has(row.normalized)) {
        row.errors.push("duplicate email in this batch"); row.status = "invalid"; row.message = row.errors.join(", ");
      } else seen.add(row.normalized);
    }
    state.rows = rows;
    els.writeSummary.textContent = rows.length ? "Review every row before approving. No backend mutation has happened yet." : "Paste contacts, then preview them before any write.";
    renderPreview();
  }

  async function probeDirectory() {
    showSession();
    setBackend("checking", "Protected session ready · checking Directory create capability…");
    try {
      const people = await api.listPeople();
      state.directoryReady = true;
      state.peopleCount = (people || []).length;
      setBackend("connected", `Protected session ready · Directory available · ${state.peopleCount} existing People`);
    } catch (error) {
      if (api.classify(error) === "locked") { showLocked("Protected session expired. Unlock again before writing."); return; }
      state.directoryReady = false;
      if (error?.status === 404) setBackend("not_deployed", "Protected session works · Directory API is not deployed on this backend yet.");
      else if (api.classify(error) === "forbidden") setBackend("denied", "Backend denied this browser Origin or protected Directory access.");
      else if (api.classify(error) === "network") setBackend("offline", "Could not reach the protected API from this browser.");
      else setBackend("partial", `Protected session works · Directory unavailable: ${error.message || "request failed"}`);
    }
    renderPreview();
  }

  async function bootstrap() {
    setBackend("checking", "Checking protected backend…");
    try { await api.session({ refresh: true }); await probeDirectory(); }
    catch (error) {
      if (api.classify(error) === "locked") showLocked();
      else if (api.classify(error) === "forbidden") { showLocked("Backend denied this browser Origin."); setBackend("denied", "Backend denied this browser Origin."); }
      else if (api.classify(error) === "network") { showLocked("Could not reach the protected API."); setBackend("offline", "Could not reach the protected API from this browser."); }
      else { showLocked("Protected backend is unavailable."); setBackend("partial", `Protected backend unavailable: ${error.message || "request failed"}`); }
    }
  }

  async function findRecipient(targetEmail) {
    const people = (await api.listPeople() || []).filter(active);
    const lookups = await Promise.allSettled(people.map(async (person) => ({ person, contacts: await api.listContacts(person.id) })));
    const matches = [];
    for (const result of lookups) {
      if (result.status !== "fulfilled") continue;
      for (const contact of (result.value.contacts || [])) {
        if (active(contact) && contact.channel === "email" && normalizeEmail(contact.normalized_address || contact.address) === targetEmail) {
          matches.push({ person: result.value.person, contact });
        }
      }
    }
    return matches;
  }

  async function findSender(targetEmail) {
    const connections = (await api.listConnections() || []).filter(active);
    const lookups = await Promise.allSettled(connections.map(async (connection) => {
      const [senders, readiness] = await Promise.all([api.listSenders(connection.id), api.connectionReadiness(connection.id)]);
      return { connection, senders: (senders || []).filter(active), readiness };
    }));
    const matches = [];
    for (const result of lookups) {
      if (result.status !== "fulfilled") continue;
      for (const sender of result.value.senders) {
        if (normalizeEmail(sender.normalized_address || sender.address) !== targetEmail) continue;
        const senderFacts = (result.value.readiness?.sender_identities || []).find((item) => String(item.sender_identity_id) === String(sender.id)) || null;
        matches.push({ connection: result.value.connection, sender, readiness: result.value.readiness, senderFacts });
      }
    }
    return matches;
  }

  function invalidateEmailPlan(message = "Input changed. Preview again before any Email write or Run.") {
    if (state.emailWriting) return;
    state.emailPlan = null;
    els.emailApprove.disabled = true;
    els.emailPlan.className = "email-plan empty";
    els.emailPlan.textContent = "Nothing resolved yet.";
    els.emailPlanSummary.textContent = message;
  }

  function renderEmailPlan(plan) {
    const senderIssues = plan.sender.senderFacts?.issue_codes || [];
    const readinessIssues = plan.sender.readiness?.issue_codes || [];
    const issues = [...new Set([...readinessIssues, ...senderIssues].map((item) => item?.code || item).filter(Boolean))];
    els.emailPlan.className = `email-plan${plan.ready ? " is-ready" : " is-blocked"}`;
    els.emailPlan.innerHTML = `
      <div class="plan-card"><span>FROM · SENDER IDENTITY</span><b>${esc(plan.sender.sender.address || plan.sender.sender.normalized_address)}</b><code>${esc(plan.sender.sender.id)}</code><small>${esc(plan.sender.connection.display_name || plan.sender.connection.id)}</small></div>
      <div class="plan-card"><span>TO · DIRECTORY</span><b>${esc(plan.recipient.person.display_name)} · ${esc(plan.recipient.contact.address || plan.recipient.contact.normalized_address)}</b><code>${esc(plan.recipient.person.id)} · ${esc(plan.recipient.contact.id)}</code></div>
      <div class="plan-card full"><span>MESSAGE</span><b>${esc(plan.subject)}</b><p>${esc(plan.body)}</p></div>
      <div class="plan-card"><span>PROVIDER MODE</span><b>Safe simulation · ${esc(plan.behavior)}</b><small>No external email.</small></div>
      <div class="plan-card"><span>SERVER READINESS</span><b>${plan.ready ? "Ready for approved simulation" : "Blocked"}</b><small>${issues.length ? esc(issues.join(", ")) : "No readiness issue reported for this simulated path."}</small></div>`;
    els.emailApprove.disabled = !plan.ready || !state.sessionReady || state.emailWriting;
    els.emailPlanSummary.textContent = plan.ready
      ? "Exact backend identities resolved. Preview performed protected reads only; no Email mutation has happened yet."
      : "The backend resolved the request but did not report a ready safe-simulation path.";
  }

  async function previewEmail() {
    if (!state.sessionReady) { showLocked(); return; }
    const from = normalizeEmail(els.emailFrom.value);
    const to = normalizeEmail(els.emailTo.value);
    const subject = els.emailSubject.value.trim();
    const body = els.emailBody.value.trim();
    const behavior = els.emailBehavior.value;
    if (!validEmail(from) || !validEmail(to) || !subject || !body) {
      invalidateEmailPlan("Enter a valid From email, To email, subject and message before previewing.");
      els.emailPlan.className = "email-plan is-blocked";
      els.emailPlan.textContent = "Email request is incomplete or invalid.";
      return;
    }

    state.emailPlan = null;
    els.emailApprove.disabled = true;
    els.emailPreview.disabled = true;
    els.emailPlan.className = "email-plan";
    els.emailPlan.textContent = "Resolving protected Directory and SenderIdentity records…";
    els.emailPlanSummary.textContent = "Preview is read-only. No backend mutation is being sent.";

    try {
      const [recipientMatches, senderMatches] = await Promise.all([findRecipient(to), findSender(from)]);
      if (recipientMatches.length !== 1) throw Object.assign(new Error(recipientMatches.length ? "Recipient email resolves to more than one active backend contact." : "Recipient email does not resolve to one active Directory ContactMethod."), { previewOnly: true });
      if (senderMatches.length !== 1) throw Object.assign(new Error(senderMatches.length ? "Sender email resolves to more than one active SenderIdentity." : "Sender email does not resolve to one active SenderIdentity on a Connection."), { previewOnly: true });
      const sender = senderMatches[0];
      const senderIssues = sender.senderFacts?.issue_codes || [];
      const senderCompatible = sender.senderFacts?.compatible_with_connection !== false;
      const fakeAvailable = Boolean(sender.readiness?.fake_provider_available);
      const ready = fakeAvailable && senderCompatible && senderIssues.length === 0;
      const plan = { from, to, subject, body, behavior, recipient: recipientMatches[0], sender, ready };
      state.emailPlan = plan;
      renderEmailPlan(plan);
    } catch (error) {
      if (api.classify(error) === "locked") { showLocked("Protected session expired while resolving the Email request. No mutation was attempted."); return; }
      state.emailPlan = null;
      els.emailPlan.className = "email-plan is-blocked";
      els.emailPlan.textContent = error?.status === 404
        ? "A required Directory / Connection / Sender readiness API is not deployed on this backend."
        : error.message || "Email preview failed.";
      els.emailPlanSummary.textContent = error?.previewOnly ? "Resolve the identity mismatch, then preview again." : "Preview stopped without any Email write or Run.";
    } finally {
      els.emailPreview.disabled = false;
    }
  }

  function setEmailInputsDisabled(disabled) {
    [els.emailFrom, els.emailTo, els.emailSubject, els.emailBody, els.emailBehavior, els.emailPreview, els.emailClear].forEach((el) => { el.disabled = disabled; });
  }

  function renderReceipt(receipt) {
    if (!receipt) return;
    const attempts = receipt.attempts || [];
    const why = receipt.why || receipt.why_events || [];
    els.emailReceipt.hidden = false;
    els.emailReceipt.innerHTML = `
      <div class="receipt-card"><span>RUN</span><b>${esc(receipt.run_id || receipt.id || "—")}</b><small>${esc(receipt.run_status || receipt.status || "—")}</small></div>
      <div class="receipt-card"><span>FROM</span><b>${esc(receipt.sender_identity_address || receipt.sender_address || state.emailPlan?.from || "—")}</b></div>
      <div class="receipt-card"><span>TO</span><b>${esc(receipt.recipient_contact_method_address || receipt.recipient_address || state.emailPlan?.to || "—")}</b></div>
      <div class="receipt-card"><span>CONTENT</span><b>${esc(receipt.subject || state.emailPlan?.subject || "—")}</b><small>${esc(receipt.content_version_id || "frozen version recorded by backend")}</small></div>
      <div class="receipt-card"><span>PROVIDER</span><b>${esc(receipt.provider_mode || "fake")}</b><small>${esc(receipt.provider_operation?.outcome || receipt.provider_outcome || "simulated")}</small></div>
      <div class="receipt-card"><span>ATTEMPTS / WHY</span><b>${attempts.length} attempt${attempts.length === 1 ? "" : "s"}</b><small>${why.length} Why event${why.length === 1 ? "" : "s"}</small></div>`;
  }

  async function executeEmail() {
    const plan = state.emailPlan;
    if (!plan?.ready || !state.sessionReady || state.emailWriting) return;
    state.emailWriting = true;
    setEmailInputsDisabled(true);
    els.emailApprove.disabled = true;
    els.emailReceipt.hidden = true;
    els.emailReceipt.innerHTML = "";
    const progress = (message) => { els.emailResult.textContent = message; };

    try {
      progress("Creating protected ContentAsset and Draft…");
      const content = await api.createContent({ kind: "text", title: plan.subject, source_text: "", visibility: "action_scoped" });
      const contentId = content.asset.id;
      await api.updateContentDraft(contentId, { expected_revision: content.draft.revision, source_text: plan.body });
      const contentVersion = await api.saveContentVersion(contentId);

      progress(`ContentVersion ${contentVersion.id} frozen · creating manual Email Automation…`);
      const automation = await api.createAutomation({
        name: `Email · ${plan.subject}`,
        description: "Manual owner Email action created from Requests v2 safe simulation. No unattended authority.",
      });
      const automationId = automation.automation.id;
      const definition = {
        schema_version: 1,
        trigger: { type: "manual" },
        conditions: [],
        actions: [{
          type: "email",
          step_id: crypto.randomUUID(),
          connection_id: plan.sender.connection.id,
          sender_identity_id: plan.sender.sender.id,
          recipient_person_id: plan.recipient.person.id,
          recipient_contact_method_id: plan.recipient.contact.id,
          content_asset_id: contentId,
        }],
        start_policy: { type: "immediate" },
        finish: { type: "finish" },
      };
      await api.updateAutomationDraft(automationId, { expected_revision: automation.draft.revision, definition });
      const preflight = await api.preflight(automationId);
      if (!preflight.ready) {
        const issues = (preflight.issues || []).map((item) => item.code || item.description || String(item)).join(", ");
        progress(`Stopped at authoritative preflight. Durable Content and Automation Draft exist; blockers: ${issues || "backend reported not ready"}. No Run was requested.`);
        return;
      }

      progress("Preflight ready · reviewing and publishing immutable AutomationVersion…");
      await api.review(automationId);
      const automationVersion = await api.publish(automationId);

      progress(`AutomationVersion ${automationVersion.id} published · requesting safe Runtime Run…`);
      const run = await api.requestRun(automationId, {
        request_idempotency_key: crypto.randomUUID(),
        fake_behavior: plan.behavior,
        provider_mode: "fake",
      });

      progress(`Run ${run.id} requested · attempting explicit development processing…`);
      try {
        await api.processRun(automationId, run.id, { worker_id: "requests-v2" });
      } catch (processError) {
        if (processError?.status === 404) {
          progress(`Run ${run.id} is real backend state, but the development process endpoint is not deployed here. No external email was sent and no automatic retry was attempted.`);
          return;
        }
        throw processError;
      }

      const receipt = await api.getReceipt(automationId, run.id);
      progress(`Safe simulation completed through canonical Runtime. Run ${run.id}. No external email was sent.`);
      renderReceipt(receipt);
    } catch (error) {
      if (api.classify(error) === "locked") {
        showLocked("Protected session expired during the approved Email operation. No automatic retry was attempted.");
        progress("Protected session expired. Earlier durable records may exist; Requests did not retry the operation.");
      } else if (error?.status === 404) {
        progress("Stopped because a required Email backend capability is not deployed on this API. Any earlier successful writes remain durable; no fake browser success was created.");
      } else {
        progress(`Email operation stopped: ${error.message || "request failed"}. Earlier successful backend writes may remain durable. No automatic retry was attempted.`);
      }
    } finally {
      state.emailWriting = false;
      setEmailInputsDisabled(false);
      if (state.emailPlan?.ready && state.sessionReady) els.emailApprove.disabled = false;
    }
  }

  els.unlockForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const key = els.operatorKey.value;
    if (!key) { els.unlockError.textContent = "Enter the operator key."; els.operatorKey.focus(); return; }
    els.unlockSubmit.disabled = true; els.unlockError.textContent = ""; setBackend("checking", "Unlocking protected backend…");
    try { await api.unlock(key); els.operatorKey.value = ""; await probeDirectory(); }
    catch (error) {
      els.operatorKey.value = "";
      const kind = api.classify(error);
      showLocked(kind === "forbidden" ? "Backend denied this browser Origin." : "Protected backend remains locked.");
      els.unlockError.textContent = kind === "locked" ? "Operator key was not accepted." : error.message || "Unlock failed.";
    } finally { els.unlockSubmit.disabled = false; }
  });

  els.disconnect.addEventListener("click", async () => {
    els.disconnect.disabled = true;
    try { await api.logout(); showLocked("Protected session ended. Local preview text has not been written to the backend."); }
    catch (error) { if (api.classify(error) === "locked") showLocked("Protected session already ended."); else setBackend("partial", `Could not end session cleanly: ${error.message || "request failed"}`); }
    finally { els.disconnect.disabled = false; renderPreview(); invalidateEmailPlan("Protected session ended. Preview again after unlocking."); }
  });

  els.modeContacts.addEventListener("click", () => setMode("contacts"));
  els.modeEmail.addEventListener("click", () => setMode("email"));
  els.parse.addEventListener("click", parseRequest);
  els.clear.addEventListener("click", () => { if (state.writing) return; els.input.value = ""; state.rows = []; els.writeSummary.textContent = "Paste contacts, then preview them before any write."; renderPreview(); });

  els.approve.addEventListener("click", async () => {
    if (state.writing || !state.sessionReady || !state.directoryReady) return;
    if (!state.rows.length || !state.rows.every((row) => row.status === "ready")) return;
    state.writing = true; els.approve.disabled = true; els.parse.disabled = true; els.clear.disabled = true; els.input.disabled = true;
    els.writeSummary.textContent = "Writing approved rows sequentially through the protected Directory API…";
    let created = 0, partial = 0, failed = 0;
    for (const row of state.rows) {
      row.status = "pending"; row.message = "Creating Person…"; renderPreview();
      try {
        const person = await api.createPerson({ display_name: row.name });
        row.personId = person.id; row.message = "Person created · creating email ContactMethod…"; renderPreview();
        try {
          const contact = await api.createContact(person.id, { channel: "email", address: row.email });
          row.contactId = contact.id; row.status = "created"; row.message = `Created Person ${person.id} and ContactMethod ${contact.id}`; created += 1;
        } catch (contactError) {
          if (api.classify(contactError) === "locked") { row.status = "partial"; row.message = `Person ${person.id} was created, then the protected session expired before ContactMethod creation.`; partial += 1; showLocked("Protected session expired during the batch. No automatic retry was attempted."); break; }
          row.status = "partial";
          row.message = contactError?.status === 409 ? `Person ${person.id} was created, but the backend rejected the email ContactMethod as a conflict. The Person remains durable.` : `Person ${person.id} was created, but ContactMethod creation failed: ${contactError.message || "request failed"}`;
          partial += 1;
        }
      } catch (personError) {
        if (api.classify(personError) === "locked") { row.status = "failed"; row.message = "Protected session expired before this row was created. No automatic retry was attempted."; failed += 1; showLocked("Protected session expired during the batch. No automatic retry was attempted."); break; }
        row.status = "failed"; row.message = personError?.status === 404 ? "Directory create API is not deployed on this backend." : `Person creation failed: ${personError.message || "request failed"}`; failed += 1;
      }
      renderPreview();
    }
    state.writing = false; els.parse.disabled = false; els.clear.disabled = false; els.input.disabled = false;
    els.writeSummary.textContent = `Batch finished · ${created} fully created · ${partial} partial · ${failed} failed. Results are backend truth; nothing was automatically retried.`;
    renderPreview();
    if (state.sessionReady && state.directoryReady) {
      try { const people = await api.listPeople(); state.peopleCount = (people || []).length; setBackend("connected", `Protected session ready · Directory available · ${state.peopleCount} existing People`); } catch { /* row results remain authoritative */ }
    }
  });

  els.input.addEventListener("input", () => { if (state.rows.length && !state.writing) { state.rows = []; els.writeSummary.textContent = "Input changed. Preview again before any write."; renderPreview(); } });
  [els.emailFrom, els.emailTo, els.emailSubject, els.emailBody, els.emailBehavior].forEach((el) => el.addEventListener("input", () => invalidateEmailPlan()));
  els.emailBehavior.addEventListener("change", () => invalidateEmailPlan());
  els.emailPreview.addEventListener("click", previewEmail);
  els.emailApprove.addEventListener("click", executeEmail);
  els.emailClear.addEventListener("click", () => {
    if (state.emailWriting) return;
    [els.emailFrom, els.emailTo, els.emailSubject, els.emailBody].forEach((el) => { el.value = ""; });
    els.emailBehavior.value = "accepted";
    invalidateEmailPlan("Email form cleared. Preview before any write or Run.");
    els.emailResult.textContent = "No safe simulation has been requested.";
    els.emailReceipt.hidden = true; els.emailReceipt.innerHTML = "";
  });

  setMode("contacts");
  renderPreview();
  bootstrap();
})();
