(function exposeCheckInStatusContract(root, factory) {
  const contract = factory();
  if (typeof module === "object" && module.exports) module.exports = contract;
  else root.CheckInStatusContract = contract;
})(globalThis, () => {
  "use strict";

  const COUNT_FIELDS = ["document_count", "contact_count", "organization_count", "update_revision_count", "trigger_action_count"];

  function isCount(value) {
    const number = Number(value);
    return Number.isFinite(number) && Number.isInteger(number) && number >= 0;
  }

  function count(value) {
    return isCount(value) ? Number(value) : 0;
  }

  function normalize(data = {}) {
    const interval = Number(data.interval_hours);
    const grace = Number(data.grace_hours);
    return {
      schemaCompatible: interval === 72 && COUNT_FIELDS.every(field => isCount(data[field])),
      intervalHours: 72,
      graceHours: Number.isFinite(grace) && grace >= 0 ? grace : 24,
      documentCount: count(data.document_count),
      contactCount: count(data.contact_count),
      organizationCount: count(data.organization_count),
      updateRevisionCount: count(data.update_revision_count),
      actionCount: count(data.trigger_action_count),
    };
  }

  return { normalize };
});

/*
 * Presentation layer for the public and private Check In experience.
 * The API contract and protected endpoint behavior remain owned by checkin.js.
 * This layer only refines human facing copy and presentation.
 */
if (typeof document !== "undefined") {
  (() => {
    "use strict";

    const textRules = [
      [/OPERATOR AUTHORIZED/g, "PRIVATE ACCESS ACTIVE"],
      [/OPERATOR · AUTHORIZED/g, "ACCESS · GRANTED"],
      [/OPERATOR · LOCKED/g, "ACCESS · LOCKED"],
      [/OPERATOR SESSION/g, "PRIVATE ACCESS"],
      [/Operator authorization required/g, "Authorization required"],
      [/Operator unlock required/g, "Authorization required"],
      [/Operator unlock/g, "Unlock"],
      [/Operator authorized/g, "Private access"],
      [/Operator session expired/g, "Private access expired"],
      [/Operator session locked/g, "Private access locked"],
      [/Operator key was not accepted/g, "Access key was not accepted"],
      [/Operator key/g, "Access key"],
      [/Operator session/g, "Access session"],
      [/Protected operator access/g, "Protected access"],
      [/An authorized operator can record proof of life/g, "Authorized access can record proof of life"],
      [/15-minute/g, "15 minute"],
      [/72-hour/g, "72 hour"],
      [/24-hour/g, "24 hour"],
      [/proof-of-life/gi, "proof of life"],
      [/check-in/gi, "check in"],
      [/server-backed/gi, "server connected"],
      [/read-only/gi, "read only"],
      [/\boperator\b/gi, match => match === match.toUpperCase() ? "ACCESS" : match[0] === match[0].toUpperCase() ? "Access" : "access"],
    ];

    const categoryMeta = {
      documentsList: {
        key: "documents",
        kicker: "DOCUMENT ARCHIVE",
        description: "Titles, files and document details stay private until access is granted.",
        countLabel: "records indexed",
      },
      contactsList: {
        key: "contacts",
        kicker: "CONTACT NETWORK",
        description: "Names, routes and contact details stay private until access is granted.",
        countLabel: "records indexed",
      },
      organizationsList: {
        key: "organizations",
        kicker: "ORGANIZATION REGISTRY",
        description: "Organization names and private notes remain sealed until access is granted.",
        countLabel: "records indexed",
      },
      revisionList: {
        key: "updates",
        kicker: "PRIVATE NOTEBOOK",
        description: "Saved revisions and notebook content remain sealed until access is granted.",
        countLabel: "revisions indexed",
      },
      actionsList: {
        key: "actions",
        kicker: "CONTINGENCY SEQUENCE",
        description: "Action names, order and configuration remain sealed until access is granted.",
        countLabel: "steps configured",
      },
    };

    const cleanText = value => textRules.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);

    function cleanVisibleCopy(root = document.body) {
      if (!root) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || ["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        const next = cleanText(node.nodeValue || "");
        if (next !== node.nodeValue) node.nodeValue = next;
      });
    }

    function countFromCard(card) {
      const match = card.querySelector("em")?.textContent?.match(/\d+/);
      return match ? Number(match[0]) : 0;
    }

    function unlockFromPublicCard() {
      const unlock = document.querySelector("#operatorButton");
      if (unlock) unlock.click();
    }

    function makeVisual(key) {
      const visual = document.createElement("span");
      visual.className = `sealed-visual sealed-visual-${key}`;
      visual.setAttribute("aria-hidden", "true");
      for (let index = 0; index < 5; index += 1) visual.append(document.createElement("i"));
      return visual;
    }

    function enhanceLockedCard(card) {
      if (card.dataset.experienceReady === "true") return;
      const list = card.closest(".record-list, .action-list");
      const meta = list && categoryMeta[list.id];
      if (!meta) return;
      const count = countFromCard(card);
      const configured = meta.key === "actions";

      card.dataset.experienceReady = "true";
      card.dataset.category = meta.key;
      if (configured && document.querySelector("#publicActionSequence")) card.hidden = true;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `${meta.kicker}. ${count} ${meta.countLabel}. Authorization required.`);
      card.replaceChildren();

      const visual = makeVisual(meta.key);
      const copy = document.createElement("span");
      copy.className = "sealed-copy";
      const kicker = document.createElement("span");
      kicker.className = "sealed-kicker";
      kicker.textContent = meta.kicker;
      const title = document.createElement("strong");
      title.textContent = meta.key === "actions" ? "Protected actions" : meta.key[0].toUpperCase() + meta.key.slice(1);
      const description = document.createElement("small");
      description.textContent = meta.description;
      copy.append(kicker, title, description);

      const total = document.createElement("span");
      total.className = "sealed-count";
      const number = document.createElement("b");
      number.textContent = String(count);
      const label = document.createElement("span");
      label.textContent = meta.countLabel;
      total.append(number, label);

      const footer = document.createElement("span");
      footer.className = "sealed-footer";
      const state = document.createElement("em");
      state.textContent = configured ? "CONFIGURED · LOCKED" : "LOCKED";
      const access = document.createElement("span");
      access.textContent = "Authorization required";
      footer.append(state, access);

      card.append(visual, copy, total, footer);
      card.addEventListener("click", unlockFromPublicCard);
      card.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        unlockFromPublicCard();
      });
    }

    function readCount(id) {
      const value = Number(document.querySelector(id)?.textContent);
      return Number.isInteger(value) && value >= 0 ? value : 0;
    }

    function ensurePackageOverview() {
      const recordsView = document.querySelector('[data-view-panel="records"]');
      const columns = recordsView?.querySelector(".record-columns");
      if (!recordsView || !columns) return;
      let overview = recordsView.querySelector("#protectedPackageOverview");
      if (overview) return overview;

      overview = document.createElement("section");
      overview.id = "protectedPackageOverview";
      overview.className = "protected-package";
      overview.innerHTML = `
        <div class="package-copy">
          <span class="package-eyebrow">SEALED PACKAGE</span>
          <h2>Private archive</h2>
          <p>The public view shows structure and totals only. Names, content, notes and instructions stay sealed.</p>
          <div class="package-signals">
            <span><i></i>72 hour control active</span>
            <span id="packageServerSignal"><i></i>Server status pending</span>
            <span id="packageAccessSignal"><i></i>Access locked</span>
          </div>
        </div>
        <div class="package-stats" aria-label="Protected package totals">
          <span><small>Records indexed</small><strong data-package-count="records">0</strong></span>
          <span><small>Notebook revisions</small><strong data-package-count="updates">0</strong></span>
          <span><small>Contingency steps</small><strong data-package-count="actions">0</strong></span>
          <span><small>Private categories</small><strong>5</strong></span>
        </div>`;
      columns.before(overview);
      return overview;
    }

    function updatePackageOverview() {
      const overview = ensurePackageOverview();
      if (!overview) return;
      const documents = readCount("#documentPublicCount");
      const contacts = readCount("#contactPublicCount");
      const organizations = readCount("#organizationPublicCount");
      const updates = readCount("#updatePublicCount");
      const actions = readCount("#actionPublicCount");
      const setText = (element, value) => { if (element && element.textContent !== value) element.textContent = value; };
      setText(overview.querySelector('[data-package-count="records"]'), String(documents + contacts + organizations));
      setText(overview.querySelector('[data-package-count="updates"]'), String(updates));
      setText(overview.querySelector('[data-package-count="actions"]'), String(actions));
      const access = overview.querySelector("#packageAccessSignal");
      const accessText = document.body.classList.contains("operator-unlocked") ? " Private access active" : " Access locked";
      if (access?.lastChild?.nodeValue !== accessText) access.lastChild.nodeValue = accessText;
      const server = overview.querySelector("#packageServerSignal");
      const syncText = document.querySelector("#syncState")?.textContent || "";
      const serverText = syncText.includes("SYNCHRONIZED") ? " Server synchronized" : syncText.includes("UNAVAILABLE") ? " Server link unavailable" : " Server status pending";
      if (server?.lastChild?.nodeValue !== serverText) server.lastChild.nodeValue = serverText;
    }

    function gatewayMarkup(type, count) {
      const data = type === "updates"
        ? {
            eyebrow: "PRIVATE NOTEBOOK",
            title: "Notebook sealed",
            copy: `${count} saved revision${count === 1 ? " is" : "s are"} indexed. Writing, history and revision content stay private.`,
            button: "Unlock notebook",
          }
        : {
            eyebrow: "PRIVATE AUDIT",
            title: "Audit trail sealed",
            copy: "Check in events and private changes are recorded behind the access boundary.",
            button: "Unlock activity",
          };
      return `
        <span class="gateway-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <div>
          <span class="package-eyebrow">${data.eyebrow}</span>
          <h2>${data.title}</h2>
          <p>${data.copy}</p>
          <div class="gateway-meta"><span>PRIVATE CONTENT</span><span>ACCESS LOCKED</span></div>
        </div>
        <button type="button">${data.button}</button>`;
    }

    function ensureGateway(type) {
      const panel = document.querySelector(`[data-view-panel="${type}"]`);
      if (!panel) return;
      let gateway = panel.querySelector(`.access-gateway[data-gateway="${type}"]`);
      const count = type === "updates" ? readCount("#updatePublicCount") : 0;
      if (!gateway) {
        gateway = document.createElement("section");
        gateway.className = "access-gateway";
        gateway.dataset.gateway = type;
        const anchor = type === "updates" ? panel.querySelector(".notebook") : panel.querySelector(".activity-table-head");
        anchor?.before(gateway);
      }
      const signature = `${type}:${count}`;
      if (gateway.dataset.signature === signature) return;
      gateway.dataset.signature = signature;
      gateway.innerHTML = gatewayMarkup(type, count);
      gateway.querySelector("button")?.addEventListener("click", unlockFromPublicCard);
    }

    let scheduled = false;
    function enhanceExperience() {
      scheduled = false;
      cleanVisibleCopy();
      document.querySelectorAll(".locked-card").forEach(enhanceLockedCard);
      ensurePackageOverview();
      updatePackageOverview();
      ensureGateway("updates");
      ensureGateway("activity");
      cleanVisibleCopy();
    }

    function scheduleEnhance() {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(enhanceExperience);
    }

    function boot() {
      enhanceExperience();
      const observer = new MutationObserver(scheduleEnhance);
      observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["class", "hidden"] });
      document.addEventListener("click", event => {
        if (event.target.closest("#operatorButton, #authDialog, .locked-card, .access-gateway")) scheduleEnhance();
      });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
    else boot();
  })();
}

/* Public draft notebook and final access polish. Saving remains protected by checkin.js. */
if (typeof document !== "undefined") {
  (() => {
    "use strict";

    const style = document.createElement("style");
    style.id = "checkin-public-draft-polish";
    style.textContent = `
      body:not(.operator-unlocked) [data-view-panel="updates"] .editor-heading-actions.operator-only{display:flex!important}
      body:not(.operator-unlocked) [data-view-panel="updates"] .notebook.operator-only{display:grid!important}
      body:not(.operator-unlocked) [data-view-panel="updates"] .access-gateway[data-gateway="updates"]{display:none!important}
      body:not(.operator-unlocked) [data-view-panel="updates"] .revision-panel{display:block!important;opacity:.92}
      body:not(.operator-unlocked) [data-view-panel="updates"] .revision-panel .panel-title button{display:none}
      body:not(.operator-unlocked) [data-view-panel="updates"] .editor-pane{position:relative}
      .public-draft-note{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:10px 15px;border-bottom:1px solid var(--line);background:linear-gradient(90deg,color-mix(in srgb,var(--accent) 7%,var(--panel2)),color-mix(in srgb,var(--panel2) 92%,transparent));color:var(--muted);font-size:9px;line-height:1.45}
      .public-draft-note strong{color:var(--accent);font-size:8px;font-weight:900;letter-spacing:.12em;white-space:nowrap}
      .public-draft-note span{min-width:0}
      .operator-unlocked .public-draft-note{border-color:color-mix(in srgb,var(--safe) 22%,var(--line));background:linear-gradient(90deg,color-mix(in srgb,var(--safe) 7%,var(--panel2)),color-mix(in srgb,var(--panel2) 92%,transparent))}
      .operator-unlocked .public-draft-note strong{color:var(--safe)}
      body:not(.operator-unlocked) #saveUpdate{border-color:color-mix(in srgb,var(--accent) 36%,var(--line));background:color-mix(in srgb,var(--accent) 8%,var(--panel));color:var(--text)}
      body:not(.operator-unlocked) #saveUpdate::before{content:"⌁";margin-right:6px;color:var(--accent)}
      .operator-session-strip{z-index:60!important;overflow:hidden;isolation:isolate;box-shadow:0 7px 0 var(--bg),0 22px 44px rgba(0,0,0,.16)!important}
      .operator-session-strip + .main{position:relative;z-index:1}
      html[data-theme="dark"] .status-console{background:radial-gradient(circle 185px at 29% 42%,rgba(var(--ring-glow-rgb),.035) 0%,rgba(var(--ring-glow-rgb),.045) 35%,rgba(var(--ring-glow-rgb),.115) 52%,rgba(var(--ring-glow-rgb),.075) 63%,rgba(var(--ring-glow-rgb),.032) 76%,rgba(var(--ring-glow-rgb),0) 100%),linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.012) 38%,transparent 67%),rgba(12,16,21,.72)!important}
      .countdown-ring{transform:translateY(-6px)}
      @media(max-width:900px){html[data-theme="dark"] .status-console{background:radial-gradient(circle 170px at 50% 34%,rgba(var(--ring-glow-rgb),.035) 0%,rgba(var(--ring-glow-rgb),.045) 34%,rgba(var(--ring-glow-rgb),.12) 52%,rgba(var(--ring-glow-rgb),.075) 64%,rgba(var(--ring-glow-rgb),.03) 78%,rgba(var(--ring-glow-rgb),0) 100%),linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.012) 38%,transparent 67%),rgba(12,16,21,.72)!important}.countdown-ring{transform:translateY(-4px)}}
      @media(max-width:700px){.public-draft-note{align-items:flex-start;flex-direction:column;gap:4px;padding:9px 10px}.public-draft-note strong{white-space:normal}.operator-session-strip{box-shadow:0 5px 0 var(--bg),0 18px 34px rgba(0,0,0,.14)!important}html[data-theme="dark"] .status-console{background:radial-gradient(circle 158px at 50% 32%,rgba(var(--ring-glow-rgb),.03) 0%,rgba(var(--ring-glow-rgb),.04) 33%,rgba(var(--ring-glow-rgb),.12) 51%,rgba(var(--ring-glow-rgb),.072) 64%,rgba(var(--ring-glow-rgb),.026) 79%,rgba(var(--ring-glow-rgb),0) 100%),linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.012) 38%,transparent 67%),rgba(12,16,21,.72)!important}}
    `;
    document.head.append(style);

    let lockedDraftHtml = "";
    let wasUnlocked = document.body.classList.contains("operator-unlocked");
    let restoreQueued = false;

    function isUnlocked() {
      return document.body.classList.contains("operator-unlocked");
    }

    function ensureDraftNote() {
      const pane = document.querySelector('[data-view-panel="updates"] .editor-pane');
      const statusbar = pane?.querySelector(".editor-statusbar");
      if (!pane || !statusbar) return null;
      let note = pane.querySelector(".public-draft-note");
      if (!note) {
        note = document.createElement("div");
        note.className = "public-draft-note";
        note.setAttribute("role", "status");
        statusbar.before(note);
      }
      const unlocked = isUnlocked();
      note.innerHTML = unlocked
        ? '<strong>PRIVATE ACCESS ACTIVE</strong><span>You can save this page as a private revision. Saved history remains protected.</span>'
        : '<strong>LOCAL DRAFT</strong><span>Write freely here. This draft stays in this browser tab until you unlock access and save a private revision.</span>';
      return note;
    }

    function updateSaveButton() {
      const save = document.querySelector("#saveUpdate");
      if (!save) return;
      save.textContent = isUnlocked() ? "Save revision" : "Unlock to save";
      save.title = isUnlocked() ? "Save this private revision" : "Authorization is required before this draft can be saved";
    }

    function preserveLockedDraft() {
      if (isUnlocked()) return;
      const editor = document.querySelector("#richEditor");
      if (!editor) return;
      lockedDraftHtml = editor.innerHTML;
    }

    function restoreLockedDraftIfNeeded() {
      if (restoreQueued || isUnlocked() || !lockedDraftHtml) return;
      const editor = document.querySelector("#richEditor");
      if (!editor || editor.innerHTML.trim()) return;
      restoreQueued = true;
      queueMicrotask(() => {
        restoreQueued = false;
        if (isUnlocked() || !lockedDraftHtml || editor.innerHTML.trim()) return;
        editor.innerHTML = lockedDraftHtml;
        editor.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }

    function syncPublicNotebook() {
      const unlocked = isUnlocked();
      ensureDraftNote();
      updateSaveButton();
      if (unlocked && !wasUnlocked) lockedDraftHtml = "";
      if (!unlocked) restoreLockedDraftIfNeeded();
      wasUnlocked = unlocked;
    }

    function bootPublicNotebook() {
      const editor = document.querySelector("#richEditor");
      if (!editor) return;
      editor.addEventListener("input", preserveLockedDraft);
      document.querySelector("#saveUpdate")?.addEventListener("click", () => {
        if (!isUnlocked()) preserveLockedDraft();
      }, true);
      const observer = new MutationObserver(syncPublicNotebook);
      observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "hidden"] });
      syncPublicNotebook();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootPublicNotebook, { once: true });
    else bootPublicNotebook();
  })();
}
