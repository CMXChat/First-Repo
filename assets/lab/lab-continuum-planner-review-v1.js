(() => {
  "use strict";

  let queued = false;

  function contract() {
    return window.CMXContinuumPlannerContractV1 || null;
  }

  function operationArticles(root = document) {
    return [...root.querySelectorAll(".dir2-ai-ops article,.v5-planner-ops article")];
  }

  function operationType(article) {
    return article.querySelector("small")?.textContent?.trim() || "";
  }

  function listAttr(article, name) {
    return String(article.dataset[name] || "").split(",").map(value => value.trim()).filter(Boolean);
  }

  function refLabel(ref) {
    const parts = String(ref || "").split(":").filter(Boolean);
    if (parts[0] === "temp") parts.shift();
    if (!parts.length) return "temporary result";
    const kind = parts.shift();
    const name = parts.join(" ").replace(/[_-]+/g, " ");
    const labels = {
      people: "People", person: "Person", organizations: "Organizations", organization: "Organization",
      group: "Group", folder: "Folder", content: "Content", automation: "Automation", step: "Step"
    };
    const pretty = name ? name.replace(/\bai\b/gi, "AI").replace(/\b\w/g, char => char.toUpperCase()) : "";
    return `${pretty ? `${pretty} ` : ""}${labels[kind] || kind}`.trim();
  }

  function ensureOperationMeta(article, meta) {
    const body = article.querySelector(":scope > span");
    if (!body) return;

    article.dataset.planDomain = meta.domain.toLowerCase();
    article.dataset.planEffect = meta.effect;
    article.dataset.planReview = meta.review;

    let row = body.querySelector(":scope > .continuum-plan-op-meta");
    if (!row) {
      row = document.createElement("span");
      row.className = "continuum-plan-op-meta";
      body.append(row);
    }

    row.innerHTML = `
      <b data-plan-meta="effect">${meta.effectLabel}</b>
      <b data-plan-meta="domain">${meta.domain}</b>
      <b data-plan-meta="review">${meta.reviewLabel}</b>`;
  }

  function ensureDependencyMeta(article, stepById, producerByRef) {
    const body = article.querySelector(":scope > span");
    if (!body) return;
    const produces = String(article.dataset.planProduces || "").trim();
    const uses = listAttr(article, "planUses");
    const dependsOn = listAttr(article, "planDepends");

    let row = body.querySelector(":scope > .continuum-plan-dependency-meta");
    if (!row) {
      row = document.createElement("span");
      row.className = "continuum-plan-dependency-meta";
      body.append(row);
    }

    const chips = [];
    if (produces) chips.push(`<b data-plan-link="produces">Produces <span>${refLabel(produces)}</span><i>plan-local</i></b>`);

    uses.forEach(ref => {
      const producer = producerByRef.get(ref);
      const step = producer ? stepById.get(producer) : null;
      chips.push(`<b data-plan-link="uses">Uses ${step ? `Step ${step} · ` : ""}<span>${refLabel(ref)}</span></b>`);
    });

    const alreadyShown = new Set(uses.map(ref => producerByRef.get(ref)).filter(Boolean));
    dependsOn.filter(id => !alreadyShown.has(id)).forEach(id => {
      const step = stepById.get(id);
      chips.push(`<b data-plan-link="depends">After ${step ? `Step ${step}` : "earlier operation"}</b>`);
    });

    row.innerHTML = chips.join("");
    row.hidden = chips.length === 0;
    article.dataset.planDependencyCount = String(chips.length);
  }

  function preflightPanel(root) {
    return root.querySelector(":scope > .continuum-preflight-panel");
  }

  function blockerCount(root) {
    const preflight = preflightPanel(root);
    if (preflight) {
      return Number(preflight.dataset.preflightOpenCount || 0)
        + Number(preflight.dataset.preflightBlockedCount || 0)
        + Number(preflight.dataset.preflightApprovalCount || 0);
    }

    const automation = root.querySelector(".v5-planner-blockers");
    if (automation) return automation.classList.contains("has-blockers") ? automation.querySelectorAll("li").length : 0;

    const directory = root.querySelector(".dir2-ai-gates");
    if (!directory) return 0;
    const cards = [...directory.querySelectorAll(":scope > div")];
    if (cards.some(card => /No fixed-example blocker/i.test(card.textContent || ""))) return 0;
    return cards.filter(card => /PREFLIGHT|BLOCKED|CONFLICT|REQUIRED/i.test(card.textContent || "")).length;
  }

  function summaryHost(root) {
    return root.querySelector(".v5-planner-ops") || root.querySelector(".dir2-ai-ops");
  }

  function patchResult(root) {
    const api = contract();
    if (!api) return;

    const articles = operationArticles(root);
    if (!articles.length) return;

    const stepById = new Map();
    const producerByRef = new Map();
    articles.forEach((article, index) => {
      const id = String(article.dataset.planOpId || `op-${index + 1}`);
      stepById.set(id, index + 1);
      const produces = String(article.dataset.planProduces || "").trim();
      if (produces) producerByRef.set(produces, id);
    });

    const descriptions = [];
    articles.forEach(article => {
      const type = operationType(article);
      const meta = api.describe(type);
      ensureOperationMeta(article, meta);
      ensureDependencyMeta(article, stepById, producerByRef);
      descriptions.push(meta);
    });

    const host = summaryHost(root);
    if (!host) return;

    let summary = root.querySelector(":scope > .continuum-plan-review-summary");
    if (!summary) {
      summary = document.createElement("section");
      summary.className = "continuum-plan-review-summary";
      host.before(summary);
    }

    const preflight = preflightPanel(root);
    const blockers = blockerCount(root);
    const preflightApprovals = Number(preflight?.dataset.preflightApprovalCount || 0);
    const approvals = descriptions.filter(item => item.review === "required").length + preflightApprovals;
    const checks = descriptions.filter(item => item.review === "conditional").length;
    const domains = new Set(descriptions.map(item => item.domain)).size;
    const linked = articles.filter(article => Number(article.dataset.planDependencyCount || 0) > 0).length;
    const deferred = Number(preflight?.dataset.preflightDeferredCount || 0);
    const reviewed = Number(preflight?.dataset.preflightReviewedCount || 0);

    summary.classList.toggle("has-blockers", blockers > 0);
    summary.classList.toggle("has-approval", approvals > 0);
    summary.innerHTML = `
      <header><span>CHANGE REVIEW</span><strong>Know exactly what the plan proposes.</strong></header>
      <div>
        <article><small>CHANGES</small><b>${descriptions.length}</b><span>typed operations</span></article>
        <article class="${blockers ? "is-blocked" : ""}"><small>ISSUES</small><b>${blockers}</b><span>${blockers ? "still needs attention" : deferred || reviewed ? `${deferred + reviewed} reviewed/deferred` : "none represented"}</span></article>
        <article class="${approvals ? "is-approval" : ""}"><small>APPROVAL</small><b>${approvals}</b><span>${approvals ? "explicit approval" : checks ? `${checks} operation checks` : "standard review"}</span></article>
        <article><small>LINKED STEPS</small><b>${linked}</b><span>${domains} domain${domains === 1 ? "" : "s"} · plan dependencies</span></article>
      </div>
      <footer><b>CREATE</b><b>UPDATE</b><b>LINK</b><b>RESOLVE</b><span>Temporary temp: results exist only inside this plan. Production preflight/apply resolves them to authoritative stable IDs.</span></footer>`;
  }

  function patch() {
    queued = false;
    document.querySelectorAll(".v5-planner-result:not([hidden]),.dir2-ai-contract").forEach(patchResult);
    document.documentElement.dataset.labPlannerReview = "v1";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(patch));
  }

  document.addEventListener("click", schedule, true);
  document.addEventListener("input", schedule, true);
  document.addEventListener("cmx:lab-planner-preflight-updated", schedule);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("cmx:lab-directory-updated", schedule);
  window.addEventListener("cmx:lab-automations-updated", schedule);
  schedule();
})();