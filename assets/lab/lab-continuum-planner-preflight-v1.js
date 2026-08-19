(() => {
  "use strict";

  const decisions = new Map();
  let queued = false;

  const ISSUE_OPERATION_TYPES = Object.freeze({
    "directory.ambiguous_match": ["directory.match_people", "directory.match_organizations", "directory.match_or_create_people"],
    "directory.identity_check_required": ["directory.match_or_create_people", "directory.match_people", "directory.match_organizations"],
    "directory.audience_required": ["automation.reference_audience", "automation.add_action"],
    "runtime.required": ["automation.add_wait"],
    "library.service_required": ["library.create_document", "library.create_folder", "automation.reference_content"],
    "connections.required": ["automation.add_action"],
    "authority.approval_required": ["automation.add_action"],
    "planner.dependency_invalid": ["automation.create_draft", "directory.match_or_create_people"],
    "planner.review_required": ["automation.create_draft"]
  });

  const esc = value => String(value ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));

  function api() {
    return window.CMXContinuumPlannerContractV1 || null;
  }

  function planKey(root) {
    const title = root.querySelector(".v5-planner-result>header strong,.dir2-ai-contract>h3")?.textContent?.trim() || "plan";
    const intent = root.querySelector(".v5-planner-result>header small,.dir2-ai-intent")?.textContent?.trim() || "";
    return `${location.pathname}|${title}|${intent}`;
  }

  function sourceHost(root) {
    const automation = root.querySelector(".v5-planner-blockers");
    if (automation) return automation;
    if (!root.querySelector(".dir2-ai-ops")) return null;
    return root.querySelector(".dir2-ai-gates");
  }

  function sourceMessages(host) {
    if (!host) return [];
    if (host.matches(".v5-planner-blockers")) {
      if (!host.classList.contains("has-blockers")) return [];
      return [...host.querySelectorAll("li")].map(node => node.textContent.trim()).filter(Boolean);
    }

    return [...host.querySelectorAll(":scope > div")]
      .filter(card => /PREFLIGHT|BLOCKED|CONFLICT|REQUIRED/i.test(card.querySelector("b")?.textContent || ""))
      .map(card => card.querySelector("span")?.textContent?.trim() || "")
      .filter(message => message && !/No fixed-example blocker/i.test(message));
  }

  function operationArticles(root) {
    return [...root.querySelectorAll(".v5-planner-ops article,.dir2-ai-ops article")];
  }

  function operationType(article) {
    return article.querySelector(":scope > span > small")?.textContent?.trim() || "";
  }

  function affectedOperation(root, issue) {
    const articles = operationArticles(root);
    const candidates = ISSUE_OPERATION_TYPES[issue.code] || [];
    for (const type of candidates) {
      const match = articles.find(article => operationType(article) === type);
      if (match) return match;
    }
    return null;
  }

  function clearOperationLinks(root) {
    operationArticles(root).forEach(article => {
      delete article.dataset.preflightOpState;
      article.querySelector(":scope > span > .continuum-preflight-operation-link")?.remove();
    });
  }

  function operationStateText(state) {
    if (state.state === "reviewed") return `DECISION · ${state.decision}`;
    return ({ open: "CHECK", deferred: "DEFERRED", blocked: "BLOCKED", approval: "APPROVAL" }[state.state] || "REVIEW");
  }

  function linkOperation(article, issue, state) {
    if (!article) return null;
    const body = article.querySelector(":scope > span");
    if (!body) return null;
    article.dataset.preflightOpState = state.state;
    let chip = body.querySelector(":scope > .continuum-preflight-operation-link");
    if (!chip) {
      chip = document.createElement("span");
      chip.className = "continuum-preflight-operation-link";
      body.append(chip);
    }
    chip.dataset.preflightOpState = state.state;
    chip.innerHTML = `<b>${esc(operationStateText(state))}</b><span>${esc(issue.label)}</span>`;
    return article.querySelector(":scope > b")?.textContent?.trim() || null;
  }

  function issueState(issue, key) {
    const saved = decisions.get(key);
    if (saved) return saved;
    if (issue.severity === "blocked") return { state: "blocked", decision: "" };
    if (issue.severity === "approval") return { state: "approval", decision: "" };
    return { state: "open", decision: "" };
  }

  function stateLabel(state) {
    return ({
      open: "NEEDS REVIEW",
      reviewed: "PREVIEW DECISION",
      deferred: "DEFERRED TO DRAFT",
      blocked: "BLOCKED",
      approval: "APPROVAL REQUIRED"
    }[state] || "REVIEW");
  }

  function resolutionText(issue, state) {
    if (state.state === "reviewed") return `Preview choice recorded: ${state.decision}. No protected identity was changed.`;
    if (state.state === "deferred") return "This remains incomplete and must be configured in the editable Draft.";
    if (issue.resolution === "server") return "Protected server data/services are required before this can be cleared.";
    if (issue.resolution === "locked") return "The required capability is unavailable in the current Lab/Runtime boundary.";
    if (issue.resolution === "approval") return "Planner cannot grant or approve its own authority.";
    if (issue.resolution === "preview-choice") return "Choose how the future review interaction should behave. This records preview state only.";
    if (issue.resolution === "draft") return "The Planner may create the Draft while keeping this requirement visibly unresolved.";
    return "Review is still required.";
  }

  function actionMarkup(issue, state, issueKey) {
    if (state.state === "reviewed") {
      return `<div class="continuum-preflight-actions"><button type="button" data-preflight-reset="${esc(issueKey)}">Change decision</button></div>`;
    }
    if (state.state === "deferred") {
      return `<div class="continuum-preflight-actions"><button type="button" data-preflight-reset="${esc(issueKey)}">Undo defer</button></div>`;
    }
    if (state.state !== "open") return "";
    if (issue.resolution === "preview-choice" && issue.options.length) {
      return `<div class="continuum-preflight-actions">${issue.options.map(option => `<button type="button" data-preflight-choice="${esc(issueKey)}" data-preflight-value="${esc(option.label)}">${esc(option.label)}</button>`).join("")}</div>`;
    }
    if (issue.resolution === "draft") {
      return `<div class="continuum-preflight-actions"><button type="button" data-preflight-defer="${esc(issueKey)}">Handle in Draft</button></div>`;
    }
    return "";
  }

  function issueMarkup(issue, state, issueKey, index, changeNumber) {
    const affects = changeNumber ? ` · AFFECTS CHANGE ${changeNumber}` : " · PLAN-LEVEL";
    return `<article class="continuum-preflight-issue is-${esc(state.state)}" data-preflight-code="${esc(issue.code)}" data-preflight-state="${esc(state.state)}" ${changeNumber ? `data-preflight-change="${esc(changeNumber)}"` : ""}>
      <header><b>${String(index + 1).padStart(2, "0")}</b><span><small>${esc(issue.domain)} · ${esc(issue.code)}${esc(affects)}</small><strong>${esc(issue.label)}</strong></span><em>${esc(stateLabel(state.state))}</em></header>
      <p>${esc(issue.message)}</p>
      <footer><span>${esc(resolutionText(issue, state))}</span>${actionMarkup(issue, state, issueKey)}</footer>
    </article>`;
  }

  function render(root) {
    const contract = api();
    if (!contract) return;
    const host = sourceHost(root);
    if (!host) return;

    const messages = sourceMessages(host);
    const keyBase = planKey(root);
    const issues = messages.map((message, index) => {
      const issue = contract.classifyIssue(message);
      return { ...issue, issueKey: `${keyBase}|${issue.code}|${index}|${message}` };
    });

    let panel = root.querySelector(":scope > .continuum-preflight-panel");
    if (!panel) {
      panel = document.createElement("section");
      panel.className = "continuum-preflight-panel";
      host.before(panel);
    }
    host.hidden = true;

    const states = issues.map(issue => issueState(issue, issue.issueKey));
    clearOperationLinks(root);
    const changeNumbers = issues.map((issue, index) => linkOperation(affectedOperation(root, issue), issue, states[index]));

    const count = state => states.filter(item => item.state === state).length;
    const open = count("open");
    const deferred = count("deferred");
    const reviewed = count("reviewed");
    const blocked = count("blocked");
    const approval = count("approval");
    const linkedIssues = changeNumbers.filter(Boolean).length;
    const status = blocked ? "BLOCKED FOR APPLY" : approval ? "APPROVAL REQUIRED" : open ? "NEEDS REVIEW" : issues.length ? "REVIEWED FOR DRAFT" : "NO LOCAL ISSUES";

    panel.dataset.preflightOpenCount = String(open);
    panel.dataset.preflightDeferredCount = String(deferred);
    panel.dataset.preflightReviewedCount = String(reviewed);
    panel.dataset.preflightBlockedCount = String(blocked);
    panel.dataset.preflightApprovalCount = String(approval);
    panel.dataset.preflightIssueCount = String(issues.length);
    panel.dataset.preflightLinkedIssueCount = String(linkedIssues);
    panel.classList.toggle("has-blocked", blocked > 0);
    panel.classList.toggle("has-open", open > 0);

    panel.innerHTML = `<header>
        <div><span>PREFLIGHT · TYPED REVIEW</span><strong>Resolve what can be reviewed. Keep real blockers visible.</strong></div>
        <b>${status}</b>
      </header>
      <div class="continuum-preflight-metrics">
        <article><small>OPEN</small><strong>${open}</strong><span>needs review</span></article>
        <article><small>DEFERRED</small><strong>${deferred}</strong><span>kept for Draft</span></article>
        <article><small>BLOCKED</small><strong>${blocked}</strong><span>capability/server gap</span></article>
        <article><small>APPROVAL</small><strong>${approval}</strong><span>authority path</span></article>
      </div>
      ${issues.length ? `<div class="continuum-preflight-list">${issues.map((issue, index) => issueMarkup(issue, states[index], issue.issueKey, index, changeNumbers[index])).join("")}</div>` : `<div class="continuum-preflight-clear"><b>✓</b><span><strong>No issue is represented by this local pattern.</strong><small>Production preflight still validates current references, permissions, capabilities, Connections and revisions.</small></span></div>`}
      <footer><b>LAB PREVIEW</b><span>${linkedIssues} issue${linkedIssues === 1 ? "" : "s"} linked to Change Plan rows. Decisions here change this review surface only and never mutate protected domains.</span></footer>`;

    document.documentElement.dataset.labPlannerPreflight = "v1";
    document.dispatchEvent(new CustomEvent("cmx:lab-planner-preflight-updated", { detail: { issues: issues.length, linkedIssues, open, deferred, reviewed, blocked, approval } }));
  }

  function patch() {
    queued = false;
    document.querySelectorAll(".v5-planner-result:not([hidden]),.dir2-ai-contract").forEach(root => {
      if (root.querySelector(".v5-planner-ops,.dir2-ai-ops")) render(root);
    });
    document.documentElement.dataset.labPlannerPreflight = "v1";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", event => {
    const choice = event.target.closest?.("[data-preflight-choice]");
    if (choice) {
      event.preventDefault();
      decisions.set(choice.dataset.preflightChoice, { state: "reviewed", decision: choice.dataset.preflightValue || "Reviewed" });
      patch();
      return;
    }

    const defer = event.target.closest?.("[data-preflight-defer]");
    if (defer) {
      event.preventDefault();
      decisions.set(defer.dataset.preflightDefer, { state: "deferred", decision: "Handle in Draft" });
      patch();
      return;
    }

    const reset = event.target.closest?.("[data-preflight-reset]");
    if (reset) {
      event.preventDefault();
      decisions.delete(reset.dataset.preflightReset);
      patch();
      return;
    }

    schedule();
  }, true);

  document.addEventListener("input", schedule, true);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("cmx:lab-directory-updated", schedule);
  window.addEventListener("cmx:lab-automations-updated", schedule);
  schedule();
})();