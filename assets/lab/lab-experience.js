(() => {
  "use strict";

  if (document.body?.dataset.labMode !== "true") return;

  /**
   * CHECK IN LAB — USER EXPERIENCE LAYER
   * ------------------------------------
   * Presentation only. This module shortens product language, marks secondary
   * detail for mobile progressive disclosure, and keeps the newer Lab modules
   * understandable without becoming another data or execution authority.
   *
   * Official project: recreate approved copy/hierarchy in native components.
   * Do not port this DOM-rewrite adapter. See CHECKINLABCLONE.md.
   */

  const $ = (selector, root = document) => root?.querySelector(selector) || null;
  const $$ = (selector, root = document) => root ? [...root.querySelectorAll(selector)] : [];
  let queued = false;

  function setText(node, value) {
    if (node && node.textContent.trim() !== value) node.textContent = value;
  }

  function hidePhaseBadges(root = document) {
    $$("small,b,em", root).forEach(node => {
      if (/^PHASE\s+\d+$/i.test(node.textContent.trim())) node.hidden = true;
    });
  }

  function polishActions() {
    const panel = $('[data-view-panel="actions"]');
    const root = $(".lab-actions", panel);
    if (!panel || !root) return;

    setText($(".view-heading .eyebrow", panel), "AUTOMATION");
    setText($(".view-heading h1", panel), "Actions");
    setText($(".lab-action-topbar-main strong", root), "Actions");

    const topSmall = $(".lab-action-topbar-main small", root);
    if (topSmall) {
      const configured = (topSmall.textContent.match(/\d+/) || ["0"])[0];
      setText(topSmall, `${configured} configured`);
    }

    setText($(".lab-action-warning strong", root), "SIMULATION");
    setText($(".lab-action-warning small", root), "Safe to test here. Nothing is sent or published.");

    const paneHeads = $$(".lab-action-pane-head span", root);
    if (paneHeads[0]) setText(paneHeads[0], "Plan");
    if (paneHeads[1]) setText(paneHeads[1], "Context");

    const detail = $(".lab-action-detail", root);
    if (detail) {
      const map = {
        "Action configuration": "What it does",
        "Guardrails": "Safety",
        "Linked targets & context": "People & records",
        "Execution summary": "Summary",
        "Definition activity": "History",
        "Decision policy": "Logic"
      };
      $$(".lab-card-head strong", detail).forEach(node => {
        const next = map[node.textContent.trim()];
        if (next) setText(node, next);
      });

      $$(".lab-action-card", detail).forEach(card => {
        const title = $(".lab-card-head strong", card)?.textContent.trim();
        if (["Summary", "History"].includes(title)) card.dataset.mobileSecondary = "true";
      });

      const grid = $(".lab-action-detail-grid", detail);
      if (grid && !$(".lab-mobile-more", detail)) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "lab-mobile-more";
        button.innerHTML = '<span>More details</span><b>＋</b>';
        button.addEventListener("click", () => {
          const expanded = detail.dataset.mobileExpanded === "true";
          detail.dataset.mobileExpanded = String(!expanded);
          button.innerHTML = expanded ? '<span>More details</span><b>＋</b>' : '<span>Less detail</span><b>−</b>';
        });
        grid.after(button);
      }
    }

    const decisionCard = $(".lab-action-decision-card", root);
    if (decisionCard) {
      setText($(".lab-card-head strong", decisionCard), "Logic");
      const button = $("[data-decision-edit]", decisionCard);
      if (button) setText(button, "Edit logic");
    }
  }

  function polishActionBuilder() {
    const builder = $(".lab-action-builder");
    if (!builder) return;

    const titleMap = {
      "What should happen?": ["ACTION", "Choose what happens"],
      "Define the action": ["DETAILS", "What happens"],
      "Choose targets & context": ["PEOPLE & RECORDS", "Who or what is involved"],
      "When can this action run?": ["TIMING", "When it can start"],
      "Set guardrails": ["SAFETY", "Safety"],
      "Review the directive": ["REVIEW", "Review"]
    };

    $$(".lab-builder-title", builder).forEach(block => {
      const heading = $("h3", block);
      const current = heading?.textContent.trim();
      const mapped = titleMap[current];
      if (mapped) {
        setText($("small", block), mapped[0]);
        setText(heading, mapped[1]);
      }
      const paragraph = $("p", block);
      if (paragraph) paragraph.hidden = true;
    });

    $$(".lab-builder-readonly small,.lab-type-config small,.lab-trigger-field small,.lab-review-warning small", builder).forEach(node => {
      if (/backend|server-side|lab never|secret|stable id|production/i.test(node.textContent)) node.hidden = true;
    });

    const library = $(".lab-action-library", builder);
    if (library) library.setAttribute("aria-label", "Action type");
  }

  function polishSequence() {
    const panel = $('[data-view-panel="timeline"]');
    if (!panel) return;
    setText($(".view-heading .eyebrow", panel), "TIMELINE");
    setText($(".view-heading h1", panel), "Sequence");
    const headingCopy = $(".view-heading>p", panel);
    if (headingCopy) setText(headingCopy, "See when Actions happen and test how the plan unfolds.");

    const root = $(".lab-sequence-root", panel);
    if (!root) return;
    setText($(".lab-sequence-brand strong", root), "Sequence");
    setText($(".lab-sequence-brand small", root), "Plan and test what happens over time");

    const labels = $$(".lab-policy-summary small", root);
    ["CHECK-IN WINDOW", "GRACE", "CYCLE", "CURRENT STATE"].forEach((value, index) => {
      if (labels[index]) setText(labels[index], value);
    });

    setText($(".lab-sequence-panel.queue .lab-sequence-panel-head strong", root), "Actions");
    setText($(".lab-sequence-panel.next .lab-sequence-panel-head strong", root), "Up next");
    setText($(".lab-sequence-panel.trace .lab-sequence-panel-head strong", root), "Test history");
    setText($(".lab-sequence-panel.history .lab-sequence-panel-head strong", root), "Recent tests");
  }

  function polishPolicyDialog() {
    const dialog = $(".lab-policy-dialog");
    if (!dialog?.open) return;
    setText($("header small", dialog), "CHECK-IN SCHEDULE");
    const heading = $("header h2", dialog);
    if (heading && /policy|settings/i.test(heading.textContent)) setText(heading, "Switch timing");
    const paragraph = $("header p", dialog);
    if (paragraph) paragraph.hidden = true;
  }

  function polishDecision() {
    const root = $(".lab-decision-workspace");
    if (!root) return;
    setText($(".lab-decision-kicker", root), "LOGIC");
    setText($(".lab-decision-head h2", root), "Action logic");
    const headCopy = $(".lab-decision-head p", root);
    if (headCopy) setText(headCopy, "Rules and what happens next.");

    const configure = $(".lab-decision-head [data-decision-edit]", root);
    if (configure) setText(configure, "Edit selected");

    $$(".lab-decision-section-title strong", root).forEach(node => {
      if (node.textContent.trim() === "Outcome routing") setText(node, "Then");
      if (node.textContent.trim() === "Decision trace") setText(node, "Logic history");
    });

    const inspector = $(".lab-decision-inspector", root);
    if (inspector) {
      const state = $("header em", inspector)?.textContent.trim() || "";
      const resolved = ["SUCCEEDED","ACKNOWLEDGED","FAILED","NO ACKNOWLEDGEMENT","CANCELLED"].includes(state);
      const label = $("header small", inspector);
      if (label) setText(label, resolved ? "WHY IT ENDED" : "WHY IT IS WAITING");
      const edit = $("header [data-decision-edit]", inspector);
      if (edit) setText(edit, "Edit");
      const why = $(".lab-decision-why .lab-decision-section-title strong", inspector);
      if (why) setText(why, resolved ? "What happened" : "Waiting on");
    }
  }

  function polishDecisionDialog() {
    const dialog = $(".lab-decision-modal");
    if (!dialog?.open) return;
    setText($("header small", dialog), "ACTION LOGIC");
    const headerCopy = $("header p", dialog);
    if (headerCopy) headerCopy.hidden = true;
    $$(".lab-decision-modal-title strong", dialog).forEach(node => {
      const text = node.textContent.trim();
      if (text === "Conditions") setText(node, "Rules");
      if (text === "Acknowledgement") setText(node, "Confirmation");
      if (text === "Outcome routing") setText(node, "Then");
      if (text === "Safety preview") setText(node, "Safety");
    });
  }

  function polishActivity() {
    const panel = $('[data-view-panel="activity"]');
    if (!panel) return;
    setText($(".view-heading .eyebrow", panel), "HISTORY");
    setText($(".view-heading h1", panel), "Activity");

    const top = $(".lab-audit-topbar", panel);
    if (top) {
      const primary = $(":scope>div:first-child strong", top);
      if (primary) setText(primary, "History");
      $$("nav button", top).forEach(button => {
        const text = button.textContent.trim();
        if (text === "Audit") setText(button, "Activity");
        if (text === "Incidents") setText(button, "Tests");
      });
    }
  }

  function polishTestCenter() {
    const root = $("#labTestCenter");
    if (!root) return;
    setText($(".lab-test-head span", root), "TEST");
    setText($(".lab-test-head h2", root), "Test the plan");
    setText($(".lab-test-head p", root), "Try common outcomes without waiting in real time.");
    const state = $(".lab-test-state", root);
    if (state && state.textContent.trim() === "SIMULATION ONLY") setText(state, "SAFE TEST");

    const resultLabels = $$("#labTestResult small", root);
    resultLabels.forEach(node => {
      const text = node.textContent.trim();
      if (text === "LAST TEST STEP") setText(node, "RESULT");
      if (text === "RESOLVED") setText(node, "DONE");
      if (text === "FAILED") setText(node, "ATTENTION");
    });
  }

  function polishPlanHealth() {
    const block = $("#labPlanAssurance");
    if (!block) return;
    const detail = $(".lab-plan-title p", block);
    if (detail) {
      const map = {
        "Run a test to establish a current baseline.": "Run a test to set a baseline.",
        "The plan changed after its latest test.": "The plan changed since its last test.",
        "Some action paths still need testing.": "Some paths still need testing.",
        "Current definitions match the latest test.": "Plan matches the latest test."
      };
      const next = map[detail.textContent.trim()];
      if (next) setText(detail, next);
    }
  }

  function apply() {
    queued = false;
    polishActions();
    polishActionBuilder();
    polishSequence();
    polishPolicyDialog();
    polishDecision();
    polishDecisionDialog();
    polishActivity();
    polishTestCenter();
    polishPlanHealth();
    hidePhaseBadges();
    document.body.dataset.labExperience = "ready";
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  }

  [
    "cmx:lab-crm-updated","cmx:lab-inventory-updated","cmx:lab-actions-updated",
    "cmx:lab-switch-policy-updated","cmx:lab-decisions-updated","cmx:lab-simulation-updated",
    "cmx:lab-test-center-completed"
  ].forEach(name => document.addEventListener(name, queue));

  new MutationObserver(queue).observe(document.body, { childList:true, subtree:true });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", queue, { once:true });
  else queue();
})();