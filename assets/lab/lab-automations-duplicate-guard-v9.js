(() => {
  "use strict";

  const INLINE = Object.freeze({
    notify: { label: "Notify a person", short: "Notify" },
    email: { label: "Send email", short: "Email" },
    ai_task: { label: "AI task", short: "AI task" },
    manual_review: { label: "Manual review", short: "Manual review" }
  });

  let queued = false;
  let pendingChoice = null;
  let returnFocus = null;

  const normalize = value => String(value || "").trim().replace(/\s+/g, " ").toLowerCase();

  function kindFromLabel(label) {
    const value = normalize(label);
    return Object.entries(INLINE).find(([, meta]) => normalize(meta.label) === value || normalize(meta.short) === value)?.[0] || "";
  }

  function isPlaceholder(kind, target = "", instruction = "", index = -1) {
    return index === 0 && kind === "notify" && !normalize(target) && !normalize(instruction);
  }

  function actionCards() {
    return Array.from(document.querySelectorAll(".v3-action-card[data-action-card]"));
  }

  function baseKind(card) {
    if (card.dataset.v9ActionKind) return card.dataset.v9ActionKind;
    const typeButton = card.querySelector(".v3-action-type");
    if (!typeButton || normalize(typeButton.querySelector("small")?.textContent) === "saved action") return "";
    const kind = kindFromLabel(typeButton.querySelector("strong")?.textContent);
    if (kind) card.dataset.v9ActionKind = kind;
    return kind;
  }

  function targetText(card) {
    const value = card.querySelector("[data-pick-target] strong")?.textContent?.trim() || "";
    return /choose protected target/i.test(value) ? "" : value;
  }

  function instructionText(card) {
    return card.querySelector("textarea[data-action-content]")?.value?.trim() || "";
  }

  function descriptiveLabel(card) {
    const kind = baseKind(card);
    const target = targetText(card);
    if (kind === "email" && target) return `Email ${target}`;
    if (kind === "notify" && target) return `Notify ${target}`;
    return INLINE[kind]?.label || card.querySelector(".v3-action-type strong")?.textContent?.trim() || "Action";
  }

  function decorateCards() {
    const cards = actionCards();
    cards.forEach(card => {
      const kind = baseKind(card);
      if (!kind) return;
      const strong = card.querySelector(".v3-action-type strong");
      if (strong) {
        const label = descriptiveLabel(card);
        strong.textContent = label;
        strong.title = INLINE[kind]?.label || label;
      }
    });

    const labels = cards.map(card => descriptiveLabel(card));
    document.querySelectorAll(".v3-live-panel .v3-flow,.v3-mobile-flow .v3-flow").forEach(flow => {
      const nodes = Array.from(flow.querySelectorAll(".v3-flow-node.tone-do"));
      nodes.forEach((node, index) => {
        const strong = node.querySelector("strong");
        if (strong && labels[index]) strong.textContent = labels[index];
      });
    });

    document.querySelectorAll(".v5-ordered-flow .v5-sequence-node.is-action").forEach((node, index) => {
      const strong = node.querySelector("strong");
      if (strong && labels[index]) strong.textContent = labels[index];
    });
  }

  function countKind(kind) {
    return actionCards().filter((card, index) => {
      const cardKind = baseKind(card);
      if (cardKind !== kind) return false;
      return !isPlaceholder(cardKind, targetText(card), instructionText(card), index);
    }).length;
  }

  function annotatePicker() {
    const picker = document.querySelector(".v3-picker [data-picker-results]");
    if (!picker) return;
    const replacing = /replace action/i.test(document.querySelector(".v3-picker header h2")?.textContent || "");
    picker.querySelectorAll("[data-choose-inline]").forEach(button => {
      button.querySelector(".v9-existing-count")?.remove();
      delete button.dataset.v9ExistingCount;
      if (replacing) return;
      const kind = button.dataset.chooseInline;
      const count = countKind(kind);
      if (!count) return;
      const note = document.createElement("em");
      note.className = "v9-existing-count";
      note.textContent = `${count} already in flow`;
      button.querySelector("span")?.append(note);
      button.dataset.v9ExistingCount = String(count);
    });
  }

  function duplicateKey(card) {
    const kind = baseKind(card);
    if (!kind) return "";
    const target = normalize(targetText(card));
    const instruction = normalize(instructionText(card));
    if (!target && !instruction) return "";
    return `${kind}|${target}|${instruction}`;
  }

  function markExactDuplicates() {
    const seen = new Map();
    actionCards().forEach((card, index) => {
      card.querySelector(".v9-exact-duplicate")?.remove();
      card.dataset.v9ExactDuplicate = "false";
      const key = duplicateKey(card);
      if (!key) return;
      if (!seen.has(key)) {
        seen.set(key, index);
        return;
      }
      const first = seen.get(key);
      card.dataset.v9ExactDuplicate = "true";
      const warning = document.createElement("div");
      warning.className = "v9-exact-duplicate";
      warning.innerHTML = `<b>Possible duplicate</b><span>This matches DO ${String(first + 1).padStart(2, "0")} exactly. Keep it only if you mean to repeat the same step.</span>`;
      card.querySelector(".v3-action-body")?.append(warning);
    });
  }

  function setPickerHidden(hidden) {
    const picker = document.querySelector(".v3-picker");
    if (!picker) return;
    if (hidden) {
      picker.dataset.v9DuplicateHidden = "true";
      picker.setAttribute("aria-hidden", "true");
    } else if (picker.dataset.v9DuplicateHidden === "true") {
      delete picker.dataset.v9DuplicateHidden;
      picker.removeAttribute("aria-hidden");
    }
  }

  function closeWarning({ restore = true } = {}) {
    document.querySelector(".v9-duplicate-backdrop")?.remove();
    setPickerHidden(false);
    pendingChoice = null;
    if (restore) {
      const target = returnFocus;
      requestAnimationFrame(() => target?.isConnected && target.focus?.({ preventScroll: true }));
    }
    returnFocus = null;
  }

  function openWarning(button, count) {
    closeWarning({ restore: false });
    pendingChoice = button;
    returnFocus = button;
    const kind = button.dataset.chooseInline;
    const meta = INLINE[kind] || { label: button.querySelector("strong")?.textContent || "this action" };
    const backdrop = document.createElement("div");
    backdrop.className = "v9-duplicate-backdrop";
    backdrop.dataset.v9DuplicateBackdrop = "";
    backdrop.innerHTML = `
      <section class="v9-duplicate-dialog" role="dialog" aria-modal="true" aria-labelledby="v9DuplicateTitle" tabindex="-1">
        <span>CHECK THE FLOW</span>
        <h2 id="v9DuplicateTitle">Add another ${meta.label}?</h2>
        <p>You already have ${count} ${meta.label} action${count === 1 ? "" : "s"} in this Automation. Repeating the same capability is fine when it serves a different person, stage or instruction.</p>
        <div class="v9-duplicate-actions">
          <button type="button" data-v9-duplicate-cancel>Cancel</button>
          <button type="button" data-v9-duplicate-confirm>Add another</button>
        </div>
      </section>`;
    document.body.append(backdrop);
    const dialog = backdrop.querySelector(".v9-duplicate-dialog");
    dialog?.focus({ preventScroll: true });
    setPickerHidden(true);
  }

  function confirmWarning() {
    const button = pendingChoice;
    if (!button?.isConnected) return closeWarning({ restore: false });
    button.dataset.v9DuplicateBypass = "1";
    closeWarning({ restore: false });
    button.click();
    delete button.dataset.v9DuplicateBypass;
  }

  function patch() {
    queued = false;
    decorateCards();
    annotatePicker();
    markExactDuplicates();
    document.documentElement.dataset.labAutomationsDuplicateGuard = "v9";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    // v5 rebuilds its ordered sequence three animation frames after editor changes.
    // Run one frame later so descriptive labels and duplicate cues survive that redraw.
    requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(patch))));
  }

  document.addEventListener("click", event => {
    const choice = event.target.closest?.("[data-choose-inline]");
    if (choice && !choice.dataset.v9DuplicateBypass) {
      const replacing = /replace action/i.test(document.querySelector(".v3-picker header h2")?.textContent || "");
      const count = replacing ? 0 : countKind(choice.dataset.chooseInline);
      if (count > 0) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openWarning(choice, count);
        return;
      }
    }

    if (event.target.closest?.("[data-v9-duplicate-confirm]")) {
      event.preventDefault();
      confirmWarning();
      return;
    }
    if (event.target.closest?.("[data-v9-duplicate-cancel]") || event.target.matches?.("[data-v9-duplicate-backdrop]")) {
      event.preventDefault();
      closeWarning();
      return;
    }
    schedule();
  }, true);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.querySelector(".v9-duplicate-backdrop")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeWarning();
    }
  }, true);

  document.addEventListener("input", schedule, true);
  document.addEventListener("change", schedule, true);
  document.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("cmx:lab-automations-updated", schedule);
  window.addEventListener("pageshow", schedule);

  window.CMXAutomationDuplicateGuardV9 = Object.freeze({
    normalize,
    kindFromLabel,
    isPlaceholder,
    describe(kind, target = "") {
      if (kind === "email" && target) return `Email ${target}`;
      if (kind === "notify" && target) return `Notify ${target}`;
      return INLINE[kind]?.label || kind || "Action";
    }
  });

  schedule();
})();