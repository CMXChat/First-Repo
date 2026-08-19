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

  function blockerCount(root) {
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

    const descriptions = [];
    articles.forEach(article => {
      const type = operationType(article);
      const meta = api.describe(type);
      ensureOperationMeta(article, meta);
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

    const blockers = blockerCount(root);
    const approvals = descriptions.filter(item => item.review === "required").length;
    const checks = descriptions.filter(item => item.review === "conditional").length;
    const domains = new Set(descriptions.map(item => item.domain)).size;

    summary.classList.toggle("has-blockers", blockers > 0);
    summary.classList.toggle("has-approval", approvals > 0);
    summary.innerHTML = `
      <header><span>CHANGE REVIEW</span><strong>Know exactly what the plan proposes.</strong></header>
      <div>
        <article><small>CHANGES</small><b>${descriptions.length}</b><span>typed operations</span></article>
        <article class="${blockers ? "is-blocked" : ""}"><small>BLOCKERS</small><b>${blockers}</b><span>${blockers ? "resolve before apply" : "none represented"}</span></article>
        <article class="${approvals ? "is-approval" : ""}"><small>APPROVAL</small><b>${approvals}</b><span>${approvals ? "explicit approval" : checks ? `${checks} need checking` : "standard review"}</span></article>
        <article><small>DOMAINS</small><b>${domains}</b><span>${[...new Set(descriptions.map(item => item.domain))].join(" · ")}</span></article>
      </div>
      <footer><b>CREATE</b><b>UPDATE</b><b>LINK</b><b>RESOLVE</b><span>Operation badges come from the shared Lab contract. Production preflight remains server-owned.</span></footer>`;
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
  window.addEventListener("pageshow", schedule);
  window.addEventListener("cmx:lab-directory-updated", schedule);
  window.addEventListener("cmx:lab-automations-updated", schedule);
  schedule();
})();