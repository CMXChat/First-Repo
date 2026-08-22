(() => {
  "use strict";

  const api = window.CMXOperatorApi;
  if (!api) return;

  const $ = (id) => document.getElementById(id);
  const els = {
    backendState: $("backendState"),
    backendBadge: $("backendBadge"),
    disconnect: $("backendDisconnect"),
    unlockPanel: $("backendAccess"),
    unlockForm: $("backendUnlockForm"),
    operatorKey: $("operatorKeyInput"),
    unlockSubmit: $("backendUnlockSubmit"),
    unlockError: $("backendUnlockError"),
    input: $("requestInput"),
    parse: $("parseRequest"),
    clear: $("clearRequest"),
    previewEmpty: $("previewEmpty"),
    previewTable: $("previewTable"),
    previewBody: $("previewBody"),
    previewSummary: $("previewSummary"),
    approve: $("approveRequest"),
    writeSummary: $("writeSummary"),
  };

  const state = {
    sessionReady: false,
    directoryReady: false,
    peopleCount: null,
    rows: [],
    writing: false,
  };

  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[char]);

  function setBackend(kind, message) {
    els.backendState.textContent = message;
    els.backendBadge.textContent = kind.replaceAll("_", " ").toUpperCase();
    els.backendBadge.dataset.state = kind;
  }

  function showLocked(message = "Unlock the protected backend before approving writes.") {
    state.sessionReady = false;
    state.directoryReady = false;
    setBackend("locked", message);
    els.unlockPanel.hidden = false;
    els.disconnect.hidden = true;
    els.approve.disabled = true;
  }

  function showSession() {
    state.sessionReady = true;
    els.unlockPanel.hidden = true;
    els.disconnect.hidden = false;
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function parseLine(raw, index) {
    const line = raw.trim();
    if (!line) return null;
    if (/^(name|display[_ ]?name)\s*[,|\t]\s*(email|address)$/i.test(line)) return null;

    let name = "";
    let email = "";
    let match = line.match(/^(.*?)\s*<\s*([^<>\s]+@[^<>\s]+)\s*>$/);
    if (match) {
      name = match[1].trim();
      email = match[2].trim();
    } else {
      const delimiter = line.includes("\t") ? "\t" : line.includes("|") ? "|" : line.includes(",") ? "," : null;
      if (delimiter) {
        const parts = line.split(delimiter).map((part) => part.trim()).filter(Boolean);
        if (parts.length === 2) {
          name = parts[0];
          email = parts[1];
        }
      } else {
        match = line.match(/^(.+?)\s+([^\s<>]+@[^\s<>]+)$/);
        if (match) {
          name = match[1].trim();
          email = match[2].trim();
        }
      }
    }

    const normalized = email.toLowerCase();
    const errors = [];
    if (!name) errors.push("missing name");
    if (!email) errors.push("missing email");
    else if (!validEmail(normalized)) errors.push("invalid email");

    return {
      index,
      raw: line,
      name,
      email,
      normalized,
      errors,
      status: errors.length ? "invalid" : "ready",
      personId: null,
      contactId: null,
      message: errors.join(", "),
    };
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
      <tr>
        <td>${row.index + 1}</td>
        <td><b>${esc(row.name || "—")}</b></td>
        <td><code>${esc(row.email || "—")}</code></td>
        <td><span class="row-state ${esc(row.status)}">${esc(row.status)}</span></td>
        <td>${esc(row.message || (row.personId ? `Person ${row.personId}${row.contactId ? ` · Contact ${row.contactId}` : ""}` : "Ready for review"))}</td>
      </tr>`).join("");

    const readyToApprove = rows.length > 0
      && rows.every((row) => row.status === "ready")
      && state.sessionReady
      && state.directoryReady
      && !state.writing;
    els.approve.disabled = !readyToApprove;
  }

  function parseRequest() {
    const seen = new Set();
    const rows = els.input.value.split(/\r?\n/)
      .map((line, index) => parseLine(line, index))
      .filter(Boolean);

    for (const row of rows) {
      if (!row.normalized) continue;
      if (seen.has(row.normalized)) {
        row.errors.push("duplicate email in this batch");
        row.status = "invalid";
        row.message = row.errors.join(", ");
      } else {
        seen.add(row.normalized);
      }
    }

    state.rows = rows;
    els.writeSummary.textContent = rows.length
      ? "Review every row before approving. No backend mutation has happened yet."
      : "Paste contacts, then preview them before any write.";
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
      if (api.classify(error) === "locked") {
        showLocked("Protected session expired. Unlock again before writing.");
        return;
      }
      state.directoryReady = false;
      if (error?.status === 404) {
        setBackend("not_deployed", "Protected session works · Directory API is not deployed on this backend yet.");
      } else if (api.classify(error) === "forbidden") {
        setBackend("denied", "Backend denied this browser Origin or protected Directory access.");
      } else if (api.classify(error) === "network") {
        setBackend("offline", "Could not reach the protected API from this browser.");
      } else {
        setBackend("partial", `Protected session works · Directory unavailable: ${error.message || "request failed"}`);
      }
    }
    renderPreview();
  }

  async function bootstrap() {
    setBackend("checking", "Checking protected backend…");
    try {
      await api.session({ refresh: true });
      await probeDirectory();
    } catch (error) {
      if (api.classify(error) === "locked") {
        showLocked();
      } else if (api.classify(error) === "forbidden") {
        showLocked("Backend denied this browser Origin.");
        setBackend("denied", "Backend denied this browser Origin.");
      } else if (api.classify(error) === "network") {
        showLocked("Could not reach the protected API.");
        setBackend("offline", "Could not reach the protected API from this browser.");
      } else {
        showLocked("Protected backend is unavailable.");
        setBackend("partial", `Protected backend unavailable: ${error.message || "request failed"}`);
      }
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

    els.unlockSubmit.disabled = true;
    els.unlockError.textContent = "";
    setBackend("checking", "Unlocking protected backend…");
    try {
      await api.unlock(key);
      els.operatorKey.value = "";
      await probeDirectory();
    } catch (error) {
      els.operatorKey.value = "";
      const kind = api.classify(error);
      showLocked(kind === "forbidden" ? "Backend denied this browser Origin." : "Protected backend remains locked.");
      els.unlockError.textContent = kind === "locked"
        ? "Operator key was not accepted."
        : error.message || "Unlock failed.";
    } finally {
      els.unlockSubmit.disabled = false;
    }
  });

  els.disconnect.addEventListener("click", async () => {
    els.disconnect.disabled = true;
    try {
      await api.logout();
      showLocked("Protected session ended. Local preview text has not been written to the backend.");
    } catch (error) {
      if (api.classify(error) === "locked") showLocked("Protected session already ended.");
      else setBackend("partial", `Could not end session cleanly: ${error.message || "request failed"}`);
    } finally {
      els.disconnect.disabled = false;
      renderPreview();
    }
  });

  els.parse.addEventListener("click", parseRequest);
  els.clear.addEventListener("click", () => {
    if (state.writing) return;
    els.input.value = "";
    state.rows = [];
    els.writeSummary.textContent = "Paste contacts, then preview them before any write.";
    renderPreview();
  });

  els.approve.addEventListener("click", async () => {
    if (state.writing || !state.sessionReady || !state.directoryReady) return;
    if (!state.rows.length || !state.rows.every((row) => row.status === "ready")) return;

    state.writing = true;
    els.approve.disabled = true;
    els.parse.disabled = true;
    els.clear.disabled = true;
    els.input.disabled = true;
    els.writeSummary.textContent = "Writing approved rows sequentially through the protected Directory API…";

    let created = 0;
    let partial = 0;
    let failed = 0;

    for (const row of state.rows) {
      row.status = "pending";
      row.message = "Creating Person…";
      renderPreview();

      try {
        const person = await api.createPerson({ display_name: row.name });
        row.personId = person.id;
        row.message = "Person created · creating email ContactMethod…";
        renderPreview();

        try {
          const contact = await api.createContact(person.id, {
            channel: "email",
            address: row.email,
          });
          row.contactId = contact.id;
          row.status = "created";
          row.message = `Created Person ${person.id} and ContactMethod ${contact.id}`;
          created += 1;
        } catch (contactError) {
          if (api.classify(contactError) === "locked") {
            row.status = "partial";
            row.message = `Person ${person.id} was created, then the protected session expired before ContactMethod creation.`;
            partial += 1;
            showLocked("Protected session expired during the batch. No automatic retry was attempted.");
            break;
          }
          row.status = "partial";
          row.message = contactError?.status === 409
            ? `Person ${person.id} was created, but the backend rejected the email ContactMethod as a conflict. The Person remains durable.`
            : `Person ${person.id} was created, but ContactMethod creation failed: ${contactError.message || "request failed"}`;
          partial += 1;
        }
      } catch (personError) {
        if (api.classify(personError) === "locked") {
          row.status = "failed";
          row.message = "Protected session expired before this row was created. No automatic retry was attempted.";
          failed += 1;
          showLocked("Protected session expired during the batch. No automatic retry was attempted.");
          break;
        }
        row.status = "failed";
        row.message = personError?.status === 404
          ? "Directory create API is not deployed on this backend."
          : `Person creation failed: ${personError.message || "request failed"}`;
        failed += 1;
      }
      renderPreview();
    }

    state.writing = false;
    els.parse.disabled = false;
    els.clear.disabled = false;
    els.input.disabled = false;
    els.writeSummary.textContent = `Batch finished · ${created} fully created · ${partial} partial · ${failed} failed. Results are backend truth; nothing was automatically retried.`;
    renderPreview();

    if (state.sessionReady && state.directoryReady) {
      try {
        const people = await api.listPeople();
        state.peopleCount = (people || []).length;
        setBackend("connected", `Protected session ready · Directory available · ${state.peopleCount} existing People`);
      } catch {
        // The row-level results above remain authoritative even if this optional recount fails.
      }
    }
  });

  els.input.addEventListener("input", () => {
    if (state.rows.length && !state.writing) {
      state.rows = [];
      els.writeSummary.textContent = "Input changed. Preview again before any write.";
      renderPreview();
    }
  });

  renderPreview();
  bootstrap();
})();
