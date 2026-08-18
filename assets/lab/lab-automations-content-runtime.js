(() => {
  "use strict";

  const STORE_KEY = "cmx-lab-content-assets-v1";
  const app = document.getElementById("automationApp");
  if (!app) return;

  const allowedTags = new Set([
    "P","BR","STRONG","B","EM","I","U","S","STRIKE","H1","H2","H3",
    "UL","OL","LI","BLOCKQUOTE","A","HR","PRE","CODE","DIV"
  ]);
  const blockedTags = new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","SVG","MATH","FORM","INPUT","BUTTON"]);
  const safeAlign = new Set(["left","center","right"]);

  let active = null;
  let saveTimer = null;
  let savedRange = null;

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"
  }[ch]));

  function makeId(prefix = "content") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function now() { return new Date().toISOString(); }

  function loadStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
      if (parsed?.version === 1 && Array.isArray(parsed.assets) && parsed.links && typeof parsed.links === "object") {
        return parsed;
      }
    } catch {}
    return {version: 1, assets: [], links: {}};
  }

  function persistStore(store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }

  function kindForCard(card) {
    const label = card?.querySelector(".do-card-head strong")?.textContent?.trim().toLowerCase() || "";
    if (label.includes("email")) return "email";
    if (label.includes("notify")) return "message";
    return "instruction";
  }

  function isContentCapable(card) {
    const kind = kindForCard(card);
    return kind === "email" || kind === "message";
  }

  function findAsset(stepId) {
    const store = loadStore();
    const assetId = store.links[stepId];
    return assetId ? store.assets.find(item => item.id === assetId) || null : null;
  }

  function safeHref(value) {
    const href = String(value || "").trim();
    if (!href) return "";
    if (href.startsWith("#") || href.startsWith("/")) return href;
    try {
      const url = new URL(href);
      return ["https:", "http:", "mailto:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function sanitizeHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = String(html || "");

    const cleanNode = node => {
      [...node.children].forEach(child => {
        const tag = child.tagName;
        if (blockedTags.has(tag)) {
          child.remove();
          return;
        }
        if (!allowedTags.has(tag)) {
          child.replaceWith(...child.childNodes);
          return;
        }

        [...child.attributes].forEach(attr => child.removeAttribute(attr.name));

        if (tag === "A") {
          const rawHref = child.getAttribute("href") || "";
          const href = safeHref(rawHref);
          if (href) {
            child.setAttribute("href", href);
            child.setAttribute("rel", "noopener noreferrer");
          }
        }

        const rawStyle = child.style?.textAlign || "";
        if (rawStyle && safeAlign.has(rawStyle)) child.style.textAlign = rawStyle;

        cleanNode(child);
      });
    };

    cleanNode(template.content);
    return template.innerHTML;
  }

  function plainTextFromHtml(html) {
    const node = document.createElement("div");
    node.innerHTML = sanitizeHtml(html);
    return (node.innerText || node.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
  }

  function defaultName(kind) {
    if (kind === "email") return "Private email content";
    if (kind === "message") return "Private message content";
    return "Private content";
  }

  function ensureAsset(stepId, kind, seedText = "") {
    const store = loadStore();
    const existingId = store.links[stepId];
    let asset = existingId ? store.assets.find(item => item.id === existingId) : null;

    if (!asset) {
      const seed = seedText.trim();
      asset = {
        id: makeId("content"),
        kind,
        title: defaultName(kind),
        createdAt: now(),
        updatedAt: now(),
        draft: {
          revision: 1,
          labFormat: "sanitized_html_v1",
          subject: "",
          html: seed ? `<p>${esc(seed)}</p>` : "<p><br></p>",
          plainText: seed,
          updatedAt: now()
        },
        versions: []
      };
      store.assets.unshift(asset);
      store.links[stepId] = asset.id;
      persistStore(store);
    }

    return asset;
  }

  function updateContentCard(stepId) {
    const card = document.querySelector(`[data-content-card="${CSS.escape(stepId)}"]`);
    if (!card) return;
    const asset = findAsset(stepId);
    const title = card.querySelector("[data-content-card-title]");
    const meta = card.querySelector("[data-content-card-meta]");
    const button = card.querySelector("[data-content-open]");
    if (title) title.textContent = asset?.title || "No private content yet";
    if (meta) meta.textContent = asset
      ? `Draft revision ${asset.draft?.revision || 1} · saved privately in Lab`
      : "Create a private content asset for this action.";
    if (button) button.textContent = asset ? "Open editor" : "Create content";
  }

  function enhanceActionCards() {
    document.querySelectorAll("[data-action-content]").forEach(textarea => {
      const stepId = textarea.dataset.actionContent;
      const field = textarea.closest(".field");
      const card = textarea.closest(".do-card");
      if (!stepId || !field || !card || !isContentCapable(card)) return;

      field.hidden = true;
      field.classList.add("content-legacy-field");

      let control = card.querySelector(`[data-content-card="${CSS.escape(stepId)}"]`);
      if (!control) {
        control = document.createElement("section");
        control.className = "content-asset-card";
        control.dataset.contentCard = stepId;
        control.innerHTML = `
          <div class="content-asset-icon" aria-hidden="true">✦</div>
          <div class="content-asset-copy">
            <small>PRIVATE CONTENT</small>
            <strong data-content-card-title>No private content yet</strong>
            <span data-content-card-meta>Create a private content asset for this action.</span>
          </div>
          <button type="button" class="content-open-btn" data-content-open="${esc(stepId)}">Create content</button>`;
        field.before(control);
      }
      updateContentCard(stepId);
    });
  }

  function contentTypeLabel(kind) {
    if (kind === "email") return "EMAIL CONTENT";
    if (kind === "message") return "MESSAGE CONTENT";
    return "PRIVATE CONTENT";
  }

  function renderOverlay(asset, stepId) {
    document.querySelector(".content-editor-overlay")?.remove();
    const overlay = document.createElement("div");
    overlay.className = "content-editor-overlay";
    overlay.dataset.contentEditor = stepId;
    overlay.innerHTML = `
      <div class="content-editor-app" role="dialog" aria-modal="true" aria-label="Private content editor">
        <header class="content-editor-topbar">
          <div class="content-editor-heading">
            <button type="button" class="content-icon-btn" data-content-close aria-label="Close content editor">←</button>
            <div>
              <small>${contentTypeLabel(asset.kind)} · LAB DRAFT</small>
              <strong>Private content editor</strong>
              <span id="contentSaveState">Saved locally</span>
            </div>
          </div>
          <div class="content-editor-actions">
            <button type="button" class="content-secondary-btn" data-content-save>Save content</button>
            <button type="button" class="content-primary-btn" data-content-done>Done</button>
          </div>
        </header>

        <main class="content-editor-main">
          <section class="content-meta-card">
            <label>
              <span>Internal content name</span>
              <input type="text" maxlength="100" data-content-title value="${esc(asset.title)}" placeholder="Emergency continuity email" />
            </label>
            ${asset.kind === "email" ? `<label>
              <span>Email subject</span>
              <input type="text" maxlength="180" data-content-subject value="${esc(asset.draft?.subject || "")}" placeholder="Important information" />
            </label>` : ""}
            <div class="content-version-note">
              <b>Draft content</b>
              <span>Autosaves here in Lab. Production Publish will freeze an immutable ContentVersion so later edits cannot silently change a published Automation.</span>
            </div>
          </section>

          <nav class="content-mode-tabs" aria-label="Content mode">
            <button type="button" class="is-active" data-content-mode="write">Write</button>
            <button type="button" data-content-mode="preview">Preview</button>
          </nav>

          <section class="content-write-view" data-content-write-view>
            <div class="content-toolbar" role="toolbar" aria-label="Rich text formatting">
              <div class="content-tool-group">
                <button type="button" data-rich-command="undo" title="Undo" aria-label="Undo">↶</button>
                <button type="button" data-rich-command="redo" title="Redo" aria-label="Redo">↷</button>
              </div>
              <div class="content-tool-group content-tool-headings">
                <button type="button" data-rich-command="formatBlock" data-rich-value="P" title="Paragraph">P</button>
                <button type="button" data-rich-command="formatBlock" data-rich-value="H1" title="Heading 1">H1</button>
                <button type="button" data-rich-command="formatBlock" data-rich-value="H2" title="Heading 2">H2</button>
                <button type="button" data-rich-command="formatBlock" data-rich-value="H3" title="Heading 3">H3</button>
              </div>
              <div class="content-tool-group">
                <button type="button" data-rich-command="bold" title="Bold" aria-label="Bold"><b>B</b></button>
                <button type="button" data-rich-command="italic" title="Italic" aria-label="Italic"><i>I</i></button>
                <button type="button" data-rich-command="underline" title="Underline" aria-label="Underline"><u>U</u></button>
                <button type="button" data-rich-command="strikeThrough" title="Strikethrough" aria-label="Strikethrough"><s>S</s></button>
              </div>
              <div class="content-tool-group">
                <button type="button" data-rich-command="insertUnorderedList" title="Bulleted list" aria-label="Bulleted list">•≡</button>
                <button type="button" data-rich-command="insertOrderedList" title="Numbered list" aria-label="Numbered list">1≡</button>
                <button type="button" data-rich-command="formatBlock" data-rich-value="BLOCKQUOTE" title="Quote" aria-label="Quote">❞</button>
                <button type="button" data-rich-command="formatBlock" data-rich-value="PRE" title="Code block" aria-label="Code block">&lt;/&gt;</button>
              </div>
              <div class="content-tool-group">
                <button type="button" data-rich-command="justifyLeft" title="Align left" aria-label="Align left">≡</button>
                <button type="button" data-rich-command="justifyCenter" title="Align center" aria-label="Align center">≣</button>
                <button type="button" data-rich-command="justifyRight" title="Align right" aria-label="Align right">≡›</button>
              </div>
              <div class="content-tool-group">
                <button type="button" data-rich-link title="Insert link" aria-label="Insert link">🔗</button>
                <button type="button" data-rich-command="insertHorizontalRule" title="Divider" aria-label="Insert divider">—</button>
                <button type="button" data-rich-command="removeFormat" title="Clear formatting" aria-label="Clear formatting">Tx</button>
              </div>
            </div>

            <div class="content-link-panel" data-content-link-panel hidden>
              <label><span>Link URL</span><input type="url" inputmode="url" placeholder="https://example.com" data-content-link-url /></label>
              <button type="button" data-content-link-apply>Apply link</button>
              <button type="button" data-content-link-remove>Remove link</button>
              <button type="button" data-content-link-cancel>Cancel</button>
            </div>

            <article class="content-paper">
              <div class="content-page-kicker">PRIVATE DRAFT · NOT SENT</div>
              <div class="content-rich-body" contenteditable="true" spellcheck="true" data-content-body>${sanitizeHtml(asset.draft?.html || "<p><br></p>")}</div>
            </article>
          </section>

          <section class="content-preview-view" data-content-preview-view hidden>
            <article class="content-paper content-preview-paper">
              <div class="content-page-kicker">PREVIEW · NO PROVIDER DELIVERY</div>
              ${asset.kind === "email" ? `<div class="content-preview-subject"><small>SUBJECT</small><strong data-content-preview-subject>${esc(asset.draft?.subject || "No subject")}</strong></div>` : ""}
              <div class="content-preview-body" data-content-preview-body>${sanitizeHtml(asset.draft?.html || "<p><br></p>")}</div>
            </article>
          </section>

          <section class="content-attachments-card">
            <div>
              <small>PROTECTED ATTACHMENTS</small>
              <strong>Images, video, PDFs, Word files and other documents</strong>
              <p>These will use Check In private object storage with protected references. Lab uploads stay disabled so browser storage is never mistaken for durable file storage.</p>
            </div>
            <button type="button" disabled>Attach file · backend pending</button>
          </section>

          <section class="content-security-note">
            <b>Private-content boundary</b>
            <span>This Lab draft stays in this browser and is not placed in Gmail, Discord, or another provider account. Production will move it to the protected Check In content backend.</span>
          </section>
        </main>
      </div>`;

    document.body.append(overlay);
    document.body.classList.add("content-editor-open");
    active = {stepId, assetId: asset.id, overlay};
    overlay.querySelector("[data-content-body]")?.focus();
  }

  function currentAsset() {
    if (!active) return null;
    const store = loadStore();
    return store.assets.find(item => item.id === active.assetId) || null;
  }

  function setSaveState(text, state = "") {
    const node = document.getElementById("contentSaveState");
    if (!node) return;
    node.textContent = text;
    node.dataset.state = state;
  }

  function syncLegacyPlainText(stepId, text) {
    const textarea = document.querySelector(`[data-action-content="${CSS.escape(stepId)}"]`);
    if (!textarea) return;
    textarea.value = text;
    textarea.dispatchEvent(new Event("input", {bubbles: true}));
  }

  function saveActive({announce = false} = {}) {
    if (!active) return;
    const store = loadStore();
    const asset = store.assets.find(item => item.id === active.assetId);
    if (!asset) return;

    const overlay = active.overlay;
    const body = overlay.querySelector("[data-content-body]");
    const title = overlay.querySelector("[data-content-title]")?.value.trim() || defaultName(asset.kind);
    const subject = overlay.querySelector("[data-content-subject]")?.value.trim() || "";
    const html = sanitizeHtml(body?.innerHTML || "<p><br></p>");
    const plainText = plainTextFromHtml(html);

    asset.title = title;
    asset.updatedAt = now();
    asset.draft = {
      ...(asset.draft || {}),
      revision: Math.max(1, Number(asset.draft?.revision) || 1) + 1,
      labFormat: "sanitized_html_v1",
      subject,
      html,
      plainText,
      updatedAt: now()
    };

    store.links[active.stepId] = asset.id;
    persistStore(store);
    syncLegacyPlainText(active.stepId, plainText);
    setSaveState(announce ? "Saved content" : "Saved just now", "saved");
    updateContentCard(active.stepId);
  }

  function scheduleSave() {
    if (!active) return;
    setSaveState("Unsaved changes", "dirty");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveActive(), 600);
  }

  function closeEditor() {
    if (!active) return;
    clearTimeout(saveTimer);
    saveActive();
    const stepId = active.stepId;
    active.overlay.remove();
    active = null;
    savedRange = null;
    document.body.classList.remove("content-editor-open");
    updateContentCard(stepId);
  }

  function rememberRange() {
    if (!active) return;
    const body = active.overlay.querySelector("[data-content-body]");
    const selection = window.getSelection();
    if (!body || !selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (body.contains(range.commonAncestorContainer)) savedRange = range.cloneRange();
  }

  function restoreRange() {
    if (!savedRange) return;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedRange);
  }

  function runCommand(command, value = null) {
    if (!active) return;
    const body = active.overlay.querySelector("[data-content-body]");
    body?.focus();
    restoreRange();
    try { document.execCommand(command, false, value); } catch {}
    rememberRange();
    scheduleSave();
  }

  function openLinkPanel() {
    if (!active) return;
    rememberRange();
    const panel = active.overlay.querySelector("[data-content-link-panel]");
    if (!panel) return;
    panel.hidden = false;
    const input = panel.querySelector("[data-content-link-url]");
    if (input) {
      input.value = "";
      input.focus();
    }
  }

  function closeLinkPanel() {
    if (!active) return;
    const panel = active.overlay.querySelector("[data-content-link-panel]");
    if (panel) panel.hidden = true;
  }

  function applyLink() {
    if (!active) return;
    const input = active.overlay.querySelector("[data-content-link-url]");
    const href = safeHref(input?.value || "");
    if (!href) {
      setSaveState("Enter a safe http(s) or mailto link", "dirty");
      return;
    }
    restoreRange();
    runCommand("createLink", href);
    closeLinkPanel();
  }

  function setMode(mode) {
    if (!active) return;
    const overlay = active.overlay;
    const write = overlay.querySelector("[data-content-write-view]");
    const preview = overlay.querySelector("[data-content-preview-view]");
    overlay.querySelectorAll("[data-content-mode]").forEach(button => button.classList.toggle("is-active", button.dataset.contentMode === mode));

    if (mode === "preview") {
      saveActive();
      const asset = currentAsset();
      const previewBody = overlay.querySelector("[data-content-preview-body]");
      const previewSubject = overlay.querySelector("[data-content-preview-subject]");
      if (previewBody) previewBody.innerHTML = sanitizeHtml(asset?.draft?.html || "<p><br></p>");
      if (previewSubject) previewSubject.textContent = asset?.draft?.subject || "No subject";
      if (write) write.hidden = true;
      if (preview) preview.hidden = false;
    } else {
      if (preview) preview.hidden = true;
      if (write) write.hidden = false;
      overlay.querySelector("[data-content-body]")?.focus();
    }
  }

  function openForStep(stepId) {
    const textarea = document.querySelector(`[data-action-content="${CSS.escape(stepId)}"]`);
    const card = textarea?.closest(".do-card");
    if (!textarea || !card) return;
    const asset = ensureAsset(stepId, kindForCard(card), textarea.value || "");
    renderOverlay(asset, stepId);
  }

  document.addEventListener("mousedown", event => {
    if (event.target.closest("[data-rich-command], [data-rich-link]")) {
      rememberRange();
      event.preventDefault();
    }
  });

  document.addEventListener("click", event => {
    const open = event.target.closest("[data-content-open]");
    if (open) {
      event.preventDefault();
      event.stopPropagation();
      openForStep(open.dataset.contentOpen);
      return;
    }

    if (!active) {
      requestAnimationFrame(enhanceActionCards);
      return;
    }

    const command = event.target.closest("[data-rich-command]");
    if (command) {
      runCommand(command.dataset.richCommand, command.dataset.richValue || null);
      return;
    }

    if (event.target.closest("[data-rich-link]")) { openLinkPanel(); return; }
    if (event.target.closest("[data-content-link-apply]")) { applyLink(); return; }
    if (event.target.closest("[data-content-link-remove]")) { restoreRange(); runCommand("unlink"); closeLinkPanel(); return; }
    if (event.target.closest("[data-content-link-cancel]")) { closeLinkPanel(); return; }

    const mode = event.target.closest("[data-content-mode]");
    if (mode) { setMode(mode.dataset.contentMode); return; }

    if (event.target.closest("[data-content-save]")) { clearTimeout(saveTimer); saveActive({announce: true}); return; }
    if (event.target.closest("[data-content-done], [data-content-close]")) { closeEditor(); return; }

    requestAnimationFrame(enhanceActionCards);
  });

  document.addEventListener("input", event => {
    if (!active) return;
    if (event.target.closest("[data-content-title], [data-content-subject], [data-content-body]")) scheduleSave();
  });

  document.addEventListener("keyup", event => {
    if (!active) return;
    if (event.target.closest("[data-content-body]")) rememberRange();
  });

  document.addEventListener("keydown", event => {
    if (!active) return;
    if (event.key === "Escape") {
      const linkPanel = active.overlay.querySelector("[data-content-link-panel]");
      if (linkPanel && !linkPanel.hidden) closeLinkPanel();
      else closeEditor();
    }
  });

  window.addEventListener("beforeunload", () => {
    if (active) saveActive();
  });

  window.addEventListener("pageshow", () => requestAnimationFrame(enhanceActionCards));
  requestAnimationFrame(() => requestAnimationFrame(enhanceActionCards));
})();
