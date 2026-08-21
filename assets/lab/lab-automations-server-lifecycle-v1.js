(() => {
  "use strict";

  const API = window.CMXAutomationsLabApi;
  if (!API) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => String(value ?? "").replace(/[&<>'\"]/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '\"': "&quot;"
  }[ch]));

  let queued = false;
  let loading = false;
  let cache = null;

  function currentRoot() {
    return document.querySelector(".server-automation-editor[data-server-editor]");
  }

  function currentId() {
    return currentRoot()?.dataset.serverEditor || null;
  }

  async function resourceContext(details) {
    const actions = details?.draft?.definition?.actions || [];
    const personIds = [...new Set(actions.map((a) => a.recipient_person_id).filter(Boolean))];
    const connectionIds = [...new Set(actions.map((a) => a.connection_id).filter(Boolean))];
    const [people, connections, library] = await Promise.all([
      API.listPeople().catch(() => []),
      API.listConnections().catch(() => []),
      API.listLibrary().catch(() => ({ items: [] })),
    ]);
    const contacts = new Map();
    await Promise.all(personIds.map(async (id) => {
      contacts.set(id, await API.listContacts(id).catch(() => []));
    }));
    const senders = new Map();
    await Promise.all(connectionIds.map(async (id) => {
      senders.set(id, await API.listSenders(id).catch(() => []));
    }));
    return {
      people,
      connections,
      content: (library?.items || []).filter((item) => item.item_type === "content"),
      contacts,
      senders,
    };
  }

  async function load(id) {
    const [details, preflightResult] = await Promise.all([
      API.getAutomation(id),
      API.preflight(id).then(
        (value) => ({ value, error: null }),
        (error) => ({ value: null, error }),
      ),
    ]);
    const resources = await resourceContext(details);
    cache = {
      id,
      details,
      preflight: preflightResult.value,
      preflightError: preflightResult.error,
      resources,
    };
    return cache;
  }

  function lookup(list, id, key = "id") {
    return (list || []).find((item) => item?.[key] === id) || null;
  }

  function contactFor(ctx, action) {
    return (ctx.resources.contacts.get(action.recipient_person_id) || []).find((item) => item.id === action.recipient_contact_method_id) || null;
  }

  function senderFor(ctx, action) {
    return (ctx.resources.senders.get(action.connection_id) || []).find((item) => item.id === action.sender_identity_id) || null;
  }

  function issueMarkup(issue) {
    const debug = [issue.step_id ? `step ${issue.step_id}` : "", issue.resource_type || "", issue.resource_id || ""].filter(Boolean).join(" · ");
    return `<article class="server-preflight-issue"><code>${esc(issue.code)}</code><strong>${esc(issue.description)}</strong>${debug ? `<small>${esc(debug)}</small>` : ""}</article>`;
  }

  function frozenAction(ctx, action) {
    const person = lookup(ctx.resources.people, action.recipient_person_id);
    const contact = contactFor(ctx, action);
    const connection = lookup(ctx.resources.connections, action.connection_id);
    const sender = senderFor(ctx, action);
    const content = lookup(ctx.resources.content, action.content_asset_id, "stable_id");
    return `<article class="server-frozen-action"><header><span>${esc(String(action.type).toUpperCase())} · IMMUTABLE</span><strong>${esc(person?.display_name || "Protected recipient")}</strong><small>Display labels are resolved live. The IDs and exact ContentVersion below are frozen in this AutomationVersion.</small></header><dl><dt>Person</dt><dd>${esc(person?.display_name || "Unavailable")}<code>${esc(action.recipient_person_id || "—")}</code></dd><dt>ContactMethod</dt><dd>${esc(contact?.address || "Unavailable")}<code>${esc(action.recipient_contact_method_id || "—")}</code></dd><dt>Connection</dt><dd>${esc(connection?.display_name || "Unavailable")}<code>${esc(action.connection_id || "—")}</code></dd><dt>SenderIdentity</dt><dd>${esc(sender?.address || "Unavailable")}<code>${esc(action.sender_identity_id || "—")}</code></dd><dt>ContentAsset</dt><dd>${esc(content?.display_name || "Content")}<code>${esc(action.content_asset_id || "—")}</code></dd><dt>ContentVersion</dt><dd>Exact frozen version<code>${esc(action.content_version_id || "—")}</code></dd><dt>Step</dt><dd><code>${esc(action.step_id || "—")}</code></dd></dl></article>`;
  }

  function versionReceipt(ctx, version) {
    if (!version) return "";
    const actions = version.definition?.actions || [];
    return `<section class="server-version-receipt"><header><span>PUBLISHED RECEIPT · READ ONLY</span><h3>AutomationVersion ${esc(version.version_number)}</h3><p>Publication froze the exact protected references. Later Draft changes do not mutate this Version.</p></header><dl class="server-version-meta"><dt>AutomationVersion ID</dt><dd><code>${esc(version.id)}</code></dd><dt>Source Draft revision</dt><dd>${esc(version.source_draft_revision)}</dd><dt>Created</dt><dd>${esc(new Date(version.created_at).toLocaleString())}</dd></dl>${actions.map((action) => frozenAction(ctx, action)).join("")}</section>`;
  }

  function patchHeader(ctx) {
    const root = currentRoot();
    if (!root || root.dataset.serverEditor !== ctx.id) return;
    const lifecycle = ctx.details.automation.lifecycle;
    const stateStrong = root.querySelector(".v10-object-state strong");
    const stateSmall = root.querySelector(".v10-object-state small");
    if (stateStrong) stateStrong.textContent = String(lifecycle).toUpperCase();
    if (stateSmall) {
      const readiness = ctx.preflight
        ? (ctx.preflight.ready ? "ready" : `${ctx.preflight.issues.length} blocker${ctx.preflight.issues.length === 1 ? "" : "s"}`)
        : "preflight unavailable";
      stateSmall.textContent = `Draft revision ${ctx.details.draft.revision} · backend ${readiness}`;
    }
  }

  function testMarkup(ctx) {
    const preflightAvailable = Boolean(ctx.preflight);
    const issues = ctx.preflight?.issues || [];
    const lifecycle = ctx.details.automation.lifecycle;
    const contentIssue = issues.find((issue) => ["content.version_missing", "content.version_stale"].includes(issue.code));
    const preflightMarkup = preflightAvailable
      ? `<section class="server-preflight ${ctx.preflight.ready ? "is-ready" : "has-blockers"}"><header><span>BACKEND PREFLIGHT · AUTHORITATIVE</span><strong>${ctx.preflight.ready ? "Ready" : `${issues.length} blocker${issues.length === 1 ? "" : "s"}`}</strong></header>${ctx.preflight.ready ? `<p>Every currently required protected reference resolves and the backend considers this Draft publishable.</p>` : `<div class="server-preflight-list">${issues.map(issueMarkup).join("")}</div>`}</section>`
      : `<section class="server-preflight has-blockers"><header><span>BACKEND PREFLIGHT · UNAVAILABLE</span><strong>Unavailable</strong></header><p>${esc(ctx.preflightError?.message || "No backend readiness result was received.")} Review and Publish stay disabled until preflight can be read.</p></section>`;
    return `<div class="server-lifecycle-test" data-server-lifecycle-test>${preflightMarkup}<div class="server-test-actions"><button class="server-small-button" type="button" data-lifecycle-preflight>Refresh preflight</button>${contentIssue?.resource_id ? `<button class="server-small-button" type="button" data-lifecycle-save-content="${esc(contentIssue.resource_id)}">Save current ContentVersion</button>` : ""}<button class="v3-footer-primary" type="button" data-lifecycle-review ${!preflightAvailable || !ctx.preflight.ready || lifecycle === "review" ? "disabled" : ""}>${lifecycle === "review" ? "In Review" : "Move to Review"}</button><button class="v3-footer-primary" type="button" data-lifecycle-publish ${!preflightAvailable || lifecycle !== "review" ? "disabled" : ""}>Publish immutable Version</button></div>${versionReceipt(ctx, ctx.details.current_published_version)}</div>`;
  }

  function relatedMarkup(ctx) {
    const actions = ctx.details.draft.definition?.actions || [];
    const rows = [];
    const seen = new Set();
    function add(kind, id, label) {
      if (!id || seen.has(`${kind}:${id}`)) return;
      seen.add(`${kind}:${id}`);
      rows.push({ kind, id, label });
    }
    actions.forEach((action) => {
      const person = lookup(ctx.resources.people, action.recipient_person_id);
      const contact = contactFor(ctx, action);
      const connection = lookup(ctx.resources.connections, action.connection_id);
      const sender = senderFor(ctx, action);
      const content = lookup(ctx.resources.content, action.content_asset_id, "stable_id");
      add("Person", action.recipient_person_id, person?.display_name || "Unavailable Person");
      add("ContactMethod", action.recipient_contact_method_id, contact?.address || "Unavailable email");
      add("Connection", action.connection_id, connection?.display_name || "Unavailable Connection");
      add("SenderIdentity", action.sender_identity_id, sender?.address || "Unavailable sender");
      add("Content", action.content_asset_id, content?.display_name || "Unavailable content");
    });
    return `<header class="v10-panel-head"><div><span>RELATED · SERVER</span><h2>${esc(ctx.details.automation.name)}</h2><p>Direct protected references in the current mutable Draft. No invented dependency graph.</p></div><b>${rows.length} REFERENCES</b></header><div class="v10-related-list">${rows.map((row) => `<article><b>${esc(row.kind.toUpperCase())}</b><span><strong>${esc(row.label)}</strong><small>${esc(row.id)}</small></span></article>`).join("") || `<div class="v10-empty-state"><strong>No protected references yet</strong><span>Add an Email action progressively in Definition.</span></div>`}</div>`;
  }

  function historyMarkup(ctx) {
    const versions = ctx.details.versions || [];
    return `<header class="v10-panel-head"><div><span>HISTORY · SERVER</span><h2>${esc(ctx.details.automation.name)}</h2><p>Mutable Draft revision and immutable published Versions stay distinct.</p></div><b>${versions.length} VERSION${versions.length === 1 ? "" : "S"}</b></header><section class="v10-section"><header><span>MUTABLE DRAFT</span><h3>Current revision ${ctx.details.draft.revision}</h3></header><p>Updated ${esc(new Date(ctx.details.draft.updated_at).toLocaleString())}. A later Draft save never rewrites an old Version.</p></section>${versions.length ? versions.map((version) => versionReceipt(ctx, version)).join("") : `<div class="v10-callout"><strong>No published AutomationVersion yet</strong><span>Publish from TEST when backend preflight is ready.</span></div>`}`;
  }

  function permissionsMarkup(ctx) {
    return `<header class="v10-panel-head"><div><span>PERMISSIONS · CURRENT TRUTH</span><h2>${esc(ctx.details.automation.name)}</h2><p>Presentation does not create authority.</p></div><b>MANUAL OWNER</b></header><div class="v10-grid"><section class="v10-section"><header><span>EXECUTION</span><h3>Manual owner-triggered</h3></header><p>The current Runtime request is an explicit protected owner mutation.</p></section><section class="v10-section"><header><span>AI PARTICIPATION</span><h3>None</h3></header><p>No AI execution path is involved in this Email proof.</p></section><section class="v10-section"><header><span>STANDING AUTHORITY</span><h3>Not implemented</h3></header><p>No AuthorityGrant behavior is invented.</p></section><section class="v10-section"><header><span>PROVIDER</span><h3>Fake-provider UI only</h3></header><p>This PR exposes only the manual fake-provider Runtime controls. Real-provider capability is outside this frontend slice.</p></section></div>`;
  }

  function settingsMarkup(ctx) {
    const archived = ctx.details.automation.lifecycle === "archived";
    return `<header class="v10-panel-head"><div><span>SETTINGS · SERVER</span><h2>${esc(ctx.details.automation.name)}</h2><p>Only protected operations with real endpoints are active.</p></div><b>${esc(String(ctx.details.automation.lifecycle).toUpperCase())}</b></header><section class="v10-section"><article><span><strong>Edit name / description</strong><small>No metadata update endpoint exists in the current protected contract.</small></span><button disabled>Backend gap</button></article><article><span><strong>Duplicate Automation</strong><small>No protected duplicate endpoint exists.</small></span><button disabled>Backend gap</button></article><article><span><strong>Delete Automation</strong><small>No protected delete endpoint exists.</small></span><button disabled>Backend gap</button></article><article><span><strong>Archive Automation</strong><small>Real protected lifecycle mutation.</small></span><button type="button" data-lifecycle-archive ${archived ? "disabled" : ""}>${archived ? "Archived" : "Archive"}</button></article></section>`;
  }

  function overviewMarkup(ctx) {
    const version = ctx.details.current_published_version;
    const preflightLabel = !ctx.preflight ? "Unavailable" : (ctx.preflight.ready ? "Ready" : `${ctx.preflight.issues.length} blockers`);
    const preflightNote = ctx.preflight ? "Backend authoritative" : "No readiness result received";
    return `<header class="v10-panel-head"><div><span>OVERVIEW · SERVER</span><h2>${esc(ctx.details.automation.name)}</h2><p>Protected Automation identity, Draft and publication truth.</p></div><b>${esc(String(ctx.details.automation.lifecycle).toUpperCase())}</b></header><div class="v10-stat-grid"><article class="v10-stat"><span>Automation ID</span><strong>${esc(ctx.id.slice(0, 8))}…</strong><small>Stable backend UUID</small></article><article class="v10-stat"><span>Draft</span><strong>Revision ${ctx.details.draft.revision}</strong><small>Mutable</small></article><article class="v10-stat"><span>Preflight</span><strong>${esc(preflightLabel)}</strong><small>${esc(preflightNote)}</small></article><article class="v10-stat"><span>Published</span><strong>${version ? `v${version.version_number}` : "None"}</strong><small>${version ? "Immutable" : "Draft only"}</small></article></div>${versionReceipt(ctx, version)}<section class="v10-section"><header><span>LOCAL STORAGE BOUNDARY</span><h3>Server object stays server canonical</h3></header><p><code>cmx-lab-automations-v1</code> is still used only by the separate local Lab prototype. This Automation is never mirrored into that store.</p></section>`;
  }

  async function patch() {
    if (loading) return;
    const root = currentRoot();
    const id = currentId();
    if (!root || !id) return;

    const activeSection = root.querySelector("[data-server-section].is-active")?.dataset.serverSection || "definition";
    const testActive = activeSection === "definition" && root.querySelector("[data-server-stage='4'].is-current");
    const panel = root.querySelector(".v10-control-panel");
    const needsPanel = ["overview", "permissions", "related", "history", "settings"].includes(activeSection) && panel && panel.dataset.lifecyclePatched !== activeSection;
    const needsTest = testActive && !root.querySelector("[data-server-lifecycle-test]");
    if (!needsPanel && !needsTest) return;

    loading = true;
    try {
      const ctx = await load(id);
      if (currentId() !== id) return;
      patchHeader(ctx);
      if (needsTest) {
        const stage = currentRoot()?.querySelector(".v3-editor-main .v3-stage-section");
        const copy = stage?.querySelector("header p");
        if (copy) copy.textContent = "The Draft is server-backed. The lifecycle panel below reads authoritative backend preflight before Review or Publish.";
        stage?.insertAdjacentHTML("beforeend", testMarkup(ctx));
      }
      if (needsPanel) {
        const currentPanel = currentRoot()?.querySelector(".v10-control-panel");
        if (!currentPanel) return;
        currentPanel.dataset.lifecyclePatched = activeSection;
        if (activeSection === "overview") currentPanel.innerHTML = overviewMarkup(ctx);
        if (activeSection === "permissions") currentPanel.innerHTML = permissionsMarkup(ctx);
        if (activeSection === "related") currentPanel.innerHTML = relatedMarkup(ctx);
        if (activeSection === "history") currentPanel.innerHTML = historyMarkup(ctx);
        if (activeSection === "settings") currentPanel.innerHTML = settingsMarkup(ctx);
      }
    } finally {
      loading = false;
      if (currentId() && currentId() !== id) schedule();
    }
  }

  async function refreshAndPatch() {
    cache = null;
    const id = currentId();
    if (!id) return;
    await load(id);
    if (currentId() !== id) return;
    document.querySelector("[data-server-lifecycle-test]")?.remove();
    const panel = document.querySelector(".server-automation-editor .v10-control-panel");
    if (panel) delete panel.dataset.lifecyclePatched;
    schedule();
  }

  async function lifecycleAction(type, target) {
    const id = currentId();
    if (!id) return;
    try {
      if (type === "preflight") {
        await refreshAndPatch();
        return;
      }
      if (type === "review") await API.review(id);
      if (type === "publish") await API.publish(id);
      if (type === "archive") {
        await API.archive(id);
        location.reload();
        return;
      }
      if (type === "save-content") await API.saveContentVersion(target);
      if (currentId() !== id) return;
      await refreshAndPatch();
    } catch (error) {
      if (currentId() !== id) return;
      const node = document.querySelector("[data-server-lifecycle-test]") || document.querySelector(".server-automation-editor .v10-control-panel");
      if (node) node.insertAdjacentHTML("afterbegin", `<div class="server-lifecycle-error"><strong>Protected operation failed</strong><span>${esc(error?.message || "Request failed")}</span></div>`);
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      patch();
    });
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-lifecycle-preflight],[data-lifecycle-review],[data-lifecycle-publish],[data-lifecycle-save-content],[data-lifecycle-archive]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    if (button.matches("[data-lifecycle-preflight]")) lifecycleAction("preflight");
    if (button.matches("[data-lifecycle-review]")) lifecycleAction("review");
    if (button.matches("[data-lifecycle-publish]")) lifecycleAction("publish");
    if (button.matches("[data-lifecycle-save-content]")) lifecycleAction("save-content", button.dataset.lifecycleSaveContent);
    if (button.matches("[data-lifecycle-archive]")) lifecycleAction("archive");
  }, true);

  new MutationObserver(schedule).observe(document.getElementById("automationApp"), { childList: true, subtree: true });
  schedule();
})();
