(() => {
  'use strict';

  /*
   * Explore keeps the normal selected category at the top, then opens every
   * remaining category underneath it. The core controller continues to own
   * tab semantics, URL state, keyboard behavior, and section alignment.
   */

  const data = window.BRIEF_DEMO_DATA;
  if (!data?.scenarios) return;

  const $ = (selector, root = document) => root.querySelector(selector);

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function currentScenario() {
    const id = document.body.dataset.scenario || data.meta.defaultScenario;
    return data.scenarios[id] || data.scenarios[data.meta.defaultScenario];
  }

  function renderFallbackCards(detail) {
    const cards = Array.isArray(detail?.cards) ? detail.cards : [];
    if (!cards.length) {
      return '<p class="workspace-overview-empty">This category has no additional demo records yet.</p>';
    }

    return `<div class="detail-grid">
      ${cards.map(card => `
        <article class="detail-card">
          <div class="detail-card-label-row">
            <span class="detail-card-label">${escapeHtml(card.label || 'Briefing item')}</span>
            ${card.scope ? `<small class="scope-pill">${escapeHtml(card.scope)}</small>` : ''}
          </div>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.detail)}</p>
        </article>
      `).join('')}
    </div>`;
  }

  function renderDetail(detail) {
    const advancedMarkup = window.BRIEF_DEMO_ADVANCED?.renderDetail?.(detail);
    return advancedMarkup || renderFallbackCards(detail);
  }

  function activeTabId(tabs) {
    const selected = $('[data-workspace-tab][aria-selected="true"]');
    if (selected?.dataset.workspaceTab) return selected.dataset.workspaceTab;
    return tabs[0]?.id || '';
  }

  function updateExploreHeading(scenario, count) {
    const panel = $('[data-view-panel="workspace"]');
    const eyebrow = $('.view-heading .eyebrow', panel);
    const title = $('#workspaceTitle');
    const copy = $('.view-heading-tools p', panel);
    if (eyebrow) eyebrow.textContent = 'ALL CATEGORIES, ONE PAGE';
    if (title) title.textContent = `Explore the whole ${scenario.label} briefing`;
    if (copy) copy.textContent = `All ${count} categories are open on this page. Choose one above to bring it to the top.`;
  }

  function updateExploreHint(count) {
    window.requestAnimationFrame(() => {
      const hint = $('#workspaceTabHint');
      if (!hint) return;
      hint.hidden = false;
      hint.textContent = `All ${count} categories are open below. Use the arrows or choose a category to bring it to the top.`;
    });
  }

  function renderExplore() {
    const workspaceView = $('[data-view-panel="workspace"]');
    const selectedPanel = $('#workspacePanel');
    if (!workspaceView || !selectedPanel) return;

    const scenario = currentScenario();
    const tabs = Array.isArray(scenario.tabs) ? scenario.tabs : [];
    const activeId = activeTabId(tabs);
    updateExploreHeading(scenario, tabs.length);

    let host = $('#workspaceExploreOverview');
    if (!host) {
      host = document.createElement('div');
      host.id = 'workspaceExploreOverview';
      host.className = 'workspace-explore-overview';
      selectedPanel.after(host);
    }

    host.innerHTML = tabs
      .filter(tab => tab.id !== activeId)
      .map((tab, index) => {
        const detail = scenario.details?.[tab.id];
        if (!detail) return '';
        const originalIndex = tabs.findIndex(item => item.id === tab.id);
        return `
          <section class="workspace-overview-section" id="workspace-overview-${escapeHtml(tab.id)}" data-workspace-overview-section="${escapeHtml(tab.id)}">
            <header class="workspace-overview-heading">
              <div>
                <p class="eyebrow">${String(originalIndex + 1).padStart(2, '0')} · ${escapeHtml(tab.label)}</p>
                <h2>${escapeHtml(detail.title)}</h2>
                <p>${escapeHtml(detail.summary)}</p>
              </div>
              <button class="section-ai-button" type="button" data-ai-trigger data-ai-kind="workspace" data-ai-title="${escapeHtml(detail.title)}" aria-label="Open a conversation about ${escapeHtml(detail.title)}" aria-haspopup="dialog" title="Use this section as conversation context"><span aria-hidden="true">✦</span></button>
            </header>
            <div class="workspace-overview-body">${renderDetail(detail)}</div>
          </section>`;
      }).join('');

    selectedPanel.hidden = false;
    selectedPanel.removeAttribute('aria-hidden');
    updateExploreHint(tabs.length);
  }

  function install() {
    document.addEventListener('briefdemo:viewchange', event => {
      if (event.detail?.view === 'workspace') renderExplore();
    });

    document.addEventListener('briefdemo:scenariochange', () => {
      if (document.body.dataset.view === 'workspace') renderExplore();
    });

    document.addEventListener('briefdemo:tabchange', () => {
      if (document.body.dataset.view === 'workspace') renderExplore();
    });

    if (document.body.dataset.view === 'workspace') renderExplore();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();