(() => {
  "use strict";

  const HUMAN_STEPS = [
    ["BASICS", "Name"],
    ["TRIGGER", "Starts"],
    ["RULES", "Optional"],
    ["ACTIONS", "What happens"],
    ["TIMING", "When"],
    ["FINISH", "After"],
    ["REVIEW", "Confirm"],
  ];

  function setChoiceCopy(button, title, note) {
    if (!button) return;
    const strong = button.querySelector(".choice-copy strong");
    const small = button.querySelector(".choice-copy small");
    if (strong) strong.textContent = title;
    if (small) small.textContent = note;
  }

  function enhanceStepRail() {
    document.querySelectorAll(".step-chip").forEach((chip, index) => {
      const labels = HUMAN_STEPS[index];
      if (!labels) return;
      const small = chip.querySelector("small");
      const em = chip.querySelector("em");
      if (small) small.textContent = labels[0];
      if (em) em.textContent = labels[1];
    });
  }

  function enhanceTrigger() {
    const list = document.querySelector('.choice-list .choice[data-field="trigger"]')?.closest(".choice-list");
    if (!list || list.dataset.friendlyTrigger === "1") return;
    list.dataset.friendlyTrigger = "1";

    const section = list.closest(".step-section");
    const heading = section?.querySelector(".step-heading");
    if (heading) {
      heading.querySelector("small").textContent = "TRIGGER";
      heading.querySelector("h2").textContent = "What should start this automation?";
      heading.querySelector("p").textContent = "Choose the event that wakes the workflow up. Nothing acts before this happens.";
    }

    setChoiceCopy(list.querySelector('[data-value="grace_start"]'), "When grace begins", "Start when a missed check-in becomes overdue and the grace window opens.");
    setChoiceCopy(list.querySelector('[data-value="grace_expiry"]'), "When grace ends", "Start only if the grace window expires and the switch reaches its final trigger.");
    setChoiceCopy(list.querySelector('[data-value="manual"]'), "Only when I start it", "Nothing happens automatically. An authorized person starts the workflow.");
    setChoiceCopy(list.querySelector('[data-value="calendar"]'), "At a scheduled time", "Use a calendar-based trigger when the schedule itself should start the workflow.");

    const explainer = document.createElement("details");
    explainer.className = "concept-card grace-explainer";
    explainer.innerHTML = `
      <summary><span><b>What is the grace period?</b><small>Tap for the simple version</small></span><i>+</i></summary>
      <div class="concept-body">
        <p><strong>Grace</strong> is the extra window after a check-in becomes overdue and before the final trigger. Its length comes from the active switch policy, so Automations must never hardcode it.</p>
        <div class="grace-timeline" aria-label="Check In grace timeline">
          <span><b>1</b><strong>Check-in due</strong><small>The normal window ends</small></span>
          <span><b>2</b><strong>Grace window</strong><small>Extra time to check in</small></span>
          <span><b>3</b><strong>Final trigger</strong><small>Grace expires</small></span>
        </div>
        <p class="concept-foot">Example: if the active policy gives 24 hours of grace, “When grace begins” starts at the overdue deadline; “When grace ends” waits those 24 hours and only starts if the final trigger is reached.</p>
      </div>`;
    list.before(explainer);
  }

  function enhanceRules() {
    const list = document.querySelector('.choice-list .choice[data-field="condition"]')?.closest(".choice-list");
    if (!list || list.dataset.friendlyRules === "1") return;
    list.dataset.friendlyRules = "1";
    const heading = list.closest(".step-section")?.querySelector(".step-heading");
    if (!heading) return;
    heading.querySelector("small").textContent = "RULES · OPTIONAL";
    heading.querySelector("h2").textContent = "Should anything else have to be true?";
    heading.querySelector("p").textContent = "Most workflows can leave this as “No extra rule.” Add a rule only when the trigger alone is not enough.";
  }

  function enhanceActions() {
    const section = document.querySelector(".do-list")?.closest(".step-section");
    if (!section || section.dataset.friendlyActions === "1") return;
    section.dataset.friendlyActions = "1";
    const heading = section.querySelector(".step-heading");
    if (!heading) return;
    heading.querySelector("small").textContent = "ACTIONS";
    heading.querySelector("h2").textContent = "What should this automation do?";
    heading.querySelector("p").textContent = "Add the actions you want. Each action has a type, a protected target, and the instruction or content it needs.";
  }

  function setTimingModeCopy(section, mode, title, note) {
    const button = section.querySelector(`[data-timing-mode="${mode}"]`);
    if (!button) return;
    const strong = button.querySelector("strong");
    const small = button.querySelector("small");
    if (strong) strong.textContent = title;
    if (small) small.textContent = note;
  }

  function enhanceTiming() {
    const grid = document.querySelector(".timing-mode-grid");
    if (!grid || grid.dataset.friendlyTiming === "1") return;
    grid.dataset.friendlyTiming = "1";
    const section = grid.closest(".step-section");
    if (!section) return;

    const heading = section.querySelector(".step-heading");
    if (heading) {
      heading.querySelector("small").textContent = "TIMING";
      heading.querySelector("h2").textContent = "When should the actions begin?";
      heading.querySelector("p").textContent = "The trigger wakes the automation up. Timing decides when its first action is allowed to start.";
    }

    const explainer = document.createElement("div");
    explainer.className = "concept-card timing-explainer is-open";
    explainer.innerHTML = `
      <div class="concept-body">
        <div class="trigger-vs-start">
          <span><small>1 · TRIGGER</small><strong>Something happens</strong><em>Example: grace begins</em></span>
          <b>→</b>
          <span><small>2 · START TIME</small><strong>You decide when to act</strong><em>Immediately, later, or at a date/time</em></span>
        </div>
        <p class="concept-foot">An exact date/time never bypasses the trigger. If the trigger happens later than the chosen time, the action waits for the trigger and can start as soon as it becomes eligible.</p>
      </div>`;
    grid.before(explainer);

    setTimingModeCopy(section, "none", "Immediately", "Start as soon as the trigger and rules are satisfied.");
    setTimingModeCopy(section, "delay", "After a delay", "Start a precise amount of time after the trigger.");
    setTimingModeCopy(section, "exact", "At a date & time", "Do not start before a specific local date and minute.");

    const delaySelected = section.querySelector('[data-timing-mode="delay"]')?.classList.contains("is-selected");
    const exactSelected = section.querySelector('[data-timing-mode="exact"]')?.classList.contains("is-selected");
    const precisionTitle = section.querySelector(".precision-card .timing-title h3");
    const precisionCopy = section.querySelector(".precision-card .timing-title small");
    if (delaySelected && precisionTitle) precisionTitle.textContent = "Start after";
    if (delaySelected && precisionCopy) precisionCopy.textContent = "Elapsed time counted from the trigger becoming eligible.";
    if (exactSelected && precisionTitle) precisionTitle.textContent = "Start at a date & time";
    if (exactSelected && precisionCopy) precisionCopy.textContent = "A not-before time. The trigger still has to happen first.";
    const exactPreviewLabel = section.querySelector(".time-preview small");
    if (exactPreviewLabel) exactPreviewLabel.textContent = "START NOT BEFORE";

    const repeatTitle = section.querySelector(".repeat-block .timing-title h3");
    const repeatCopy = section.querySelector(".repeat-block .timing-title small");
    if (repeatTitle) repeatTitle.textContent = "Should it repeat?";
    if (repeatCopy) repeatCopy.textContent = "Optional. Choose whether this action sequence should happen again on a cadence.";

    const backendNote = section.querySelector(".backend-note");
    if (backendNote) backendNote.innerHTML = "<strong>Backend handoff:</strong> this prototype timing is the action-sequence start policy. Production will store immediate / trigger-relative delay / exact not-before time separately from later WAIT steps between individual actions, recurrence, and retries.";
  }

  function enhanceFinish() {
    const list = document.querySelector('.choice-list .choice[data-field="outcome"]')?.closest(".choice-list");
    if (!list || list.dataset.friendlyFinish === "1") return;
    list.dataset.friendlyFinish = "1";
    const section = list.closest(".step-section");
    const heading = section?.querySelector(".step-heading");
    if (heading) {
      heading.querySelector("small").textContent = "FINISH";
      heading.querySelector("h2").textContent = "What should happen when the actions are done?";
      heading.querySelector("p").textContent = "Most workflows can simply finish. Open the extra options only when you need another path, escalation, or a human decision.";
    }

    const end = list.querySelector('[data-value="end"]');
    const success = list.querySelector('[data-value="success"]');
    const noAck = list.querySelector('[data-value="no_ack"]');
    const review = list.querySelector('[data-value="review"]');

    setChoiceCopy(end, "Finish here", "End the workflow after the configured actions complete.");
    setChoiceCopy(success, "Continue to another path", "Use this later when you choose a real downstream action or branch.");
    setChoiceCopy(noAck, "Escalate if nobody acknowledges", "Use an acknowledgement route to continue only when nobody responds.");
    setChoiceCopy(review, "Pause for human review", "Stop and require an authorized person to review before continuing.");

    const simple = document.createElement("div");
    simple.className = "finish-simple";
    if (end) simple.append(end);

    const advanced = document.createElement("details");
    advanced.className = "finish-advanced";
    const advancedSelected = [success, noAck, review].some(button => button?.classList.contains("is-selected"));
    if (advancedSelected) advanced.open = true;
    advanced.innerHTML = `<summary><span><b>More options</b><small>Branch, escalate, or ask for review</small></span><i>+</i></summary><div class="advanced-copy">These only become real when the backend has a valid typed route and destination.</div><div class="advanced-choices"></div>`;
    const advancedChoices = advanced.querySelector(".advanced-choices");
    [success, noAck, review].forEach(button => { if (button) advancedChoices.append(button); });

    list.replaceChildren(simple, advanced);
  }

  function enhanceReview() {
    const review = document.querySelector(".review-card");
    if (!review || review.dataset.friendlyReview === "1") return;
    review.dataset.friendlyReview = "1";
    const section = review.closest(".step-section");
    const heading = section?.querySelector(".step-heading");
    if (heading) {
      heading.querySelector("small").textContent = "REVIEW";
      heading.querySelector("h2").textContent = "Does this say what you mean?";
      heading.querySelector("p").textContent = "Read the workflow in plain English before it can ever be published to the real backend.";
    }

    review.querySelectorAll(".review-row").forEach(row => {
      const label = row.querySelector("small");
      const value = row.querySelector("span");
      if (!label || !value) return;
      if (label.textContent.trim() === "WAIT") {
        label.textContent = "START TIME";
        if (value.textContent.trim() === "No wait") value.textContent = "Immediately after the trigger";
        else if (value.textContent.trim().startsWith("Wait ")) value.textContent = `${value.textContent.trim().slice(5)} after the trigger`;
      }
      if (label.textContent.trim() === "THEN") label.textContent = "FINISH";
    });
  }

  function enhanceDashboard() {
    document.querySelectorAll(".flow-node.tone-wait").forEach(node => {
      const small = node.querySelector("small");
      const strong = node.querySelector("strong");
      if (small) small.textContent = "START";
      if (!strong) return;
      const text = strong.textContent.trim();
      if (text === "No wait") strong.textContent = "Immediately";
      else if (text.startsWith("Wait ")) strong.textContent = `${text.slice(5)} after trigger`;
    });
  }

  function enhance() {
    enhanceStepRail();
    enhanceDashboard();
    enhanceTrigger();
    enhanceRules();
    enhanceActions();
    enhanceTiming();
    enhanceFinish();
    enhanceReview();
  }

  function resetEditorScroll(target) {
    if (!target?.closest?.("[data-step], [data-back], [data-continue], [data-open], [data-new]")) return;
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      requestAnimationFrame(enhance);
    });
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  document.addEventListener("click", event => {
    resetEditorScroll(event.target);
    requestAnimationFrame(() => requestAnimationFrame(enhance));
  });
  window.addEventListener("pageshow", () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    requestAnimationFrame(enhance);
  });

  requestAnimationFrame(() => requestAnimationFrame(enhance));
})();
