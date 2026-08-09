(() => {
  'use strict';

  /*
   * Explore is intentionally a complete, scrollable view of every category in
   * the selected Space. The core controller still owns scenario/view state;
   * this module listens to its public briefdemo:* events and presents that
   * state without hiding content behind repeated category cards.
   */

  const data = window.BRIEF_DEMO_DATA;
  if (!data?.scenarios) return;

  const initialUrl = new URL(window.location.href);
  const navigationEntry = window.performance?.getEntriesByType?.('navigation')?.[0];
  const isReload = navigationEntry?.type === 'reload' || window.performance?.navigation?.type === 1;
  const preserveExplicitDeepLink = !isReload && initialUrl.searchParams.has('scenario');
  const neutralizeEntryOnLoad = !preserveExplicitDeepLink;

  if (isReload) {
    try {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('scenario');
      cleanUrl.searchParams.delete('view');
      cleanUrl.searchParams.delete('tab');
      cleanUrl.hash = '';
      window.history.replaceState(null, '', cleanUrl);
    } catch {}
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function currentScenario() {
    const id = document.body.dataset.scenario || data.meta.defaultScenario;
    return data.scenarios[id] || data.scenarios[data.meta.defaultScenario];
  }

  function neutralizeEntry() {
    if (document.body.dataset.entered === 'true') return;

    document.body.dataset.entryChoiceMade = 'false';
    $$('[data-entry-scenario]').forEach(button => button.setAttribute('aria-pressed', 'false'));
    $$('.entry-open').forEach(button => {
      button.disabled = true;
      button.classList.remove('is-selection-ready');
    });

    const desktopHint = $('.entry-choice-hint-desktop');
    const mobileHint = $('#entryMobileChoiceHint');
    const primaryLabel = $('#openDemoLabel');
    const stickyLabel = $('#openDemoStickyLabel');
    if (desktopHint) desktopHint.textContent = 'Choose one to continue';
    if (mobileHint) mobileHint.textContent = 'Tap one to continue';
    if (primaryLabel) primaryLabel.textContent = 'Choose a Briefing';
    if (stickyLabel) stickyLabel.textContent = 'Choose a Briefing';
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
    const urlTab = new URL(window.location.href).searchParams.get('tab');
    if (tabs.some(tab => tab.id === urlTab)) return urlTab;
    return tabs[0]?.id || '';
  }

  function updateExploreHeading(scenario, count) {
    const panel = $('[data-view-panel="workspace"]');
    const eyebrow = $('.view-heading .eyebrow', panel);
    const title = $('#workspaceTitle');
    const copy = $('.view-heading-tools p', panel);
    if (eyebrow) eyebrow.textContent = 'ALL CATEGORIES, ONE PAGE';
    if (title) title.textContent = `Explore the whole ${scenario.label} briefing`;
    if (copy) copy.textContent = `All ${count} categories are open below. Use the category rail to jump directly to one.`;
  }

  function updateExploreTabs(activeId) {
    const host = $('#workspaceTabs');
    if (!host) return;
    host.removeAttribute('role');
    host.setAttribute('aria-label', 'Jump to briefing category');

    $$('[data-workspace-tab]', host).forEach(button => {
      const id = button.dataset.workspaceTab;
      const active = id === activeId;
      button.removeAttribute('role');
      button.removeAttribute('aria-selected');
      button.removeAttribute('tabindex');
      button.setAttribute('aria-controls', `workspace-overview-${id}`);
      button.toggleAttribute('aria-current', active);
      button.classList.toggle('is-explore-current', active);
    });

    window.requestAnimationFrame(() => {
      const hint = $('#workspaceTabHint');
      if (!hint) return;
      hint.hidden = false;
      hint.textContent = 'Every category is already open below. Use these buttons or the arrows to jump between them.';
    });
  }

  function renderExplore() {
    const workspaceView = $('[data-view-panel="workspace"]');
    const oldPanel = $('#workspacePanel');
    if (!workspaceView || !oldPanel) return;

    const scenario = currentScenario();
    const tabs = Array.isArray(scenario.tabs) ? scenario.tabs : [];
    const activeId = activeTabId(tabs);
    updateExploreHeading(scenario, tabs.length);

    let host = $('#workspaceExploreOverview');
    if (!host) {
      host = document.createElement('div');
      host.id = 'workspaceExploreOverview';
      host.className = 'workspace-explore-overview';
      oldPanel.before(host);
    }

    host.innerHTML = tabs.map((tab, index) => {
      const detail = scenario.details?.[tab.id];
      if (!detail) return '';
      const active = tab.id === activeId;
      return `
        <section class="workspace-overview-section${active ? ' is-current' : ''}" id="workspace-overview-${escapeHtml(tab.id)}" data-workspace-overview-section="${escapeHtml(tab.id)}" tabindex="-1">
          <header class="workspace-overview-heading">
            <div>
              <p class="eyebrow">${String(index + 1).padStart(2, '0')} · ${escapeHtml(tab.label)}</p>
              <h2>${escapeHtml(detail.title)}</h2>
              <p>${escapeHtml(detail.summary)}</p>
            </div>
            <button class="section-ai-button" type="button" data-ai-trigger data-ai-kind="workspace" data-ai-title="${escapeHtml(detail.title)}" aria-label="Open a conversation about ${escapeHtml(detail.title)}" aria-haspopup="dialog" title="Use this section as conversation context"><span aria-hidden="true">✦</span></button>
          </header>
          <div class="workspace-overview-body">${renderDetail(detail)}</div>
        </section>`;
    }).join('');

    oldPanel.hidden = true;
    oldPanel.setAttribute('aria-hidden', 'true');
    oldPanel.replaceChildren();
    updateExploreTabs(activeId);
  }

  function scrollToExploreSection(tab, focus = true) {
    const target = document.getElementById(`workspace-overview-${tab}`);
    if (!target) return;
    const topbarBottom = Math.max(0, $('.topbar')?.getBoundingClientRect().bottom || 0);
    const tabsBottom = Math.max(0, $('#workspaceTabNavigation')?.getBoundingClientRect().bottom || 0);
    const offset = Math.max(topbarBottom, tabsBottom) + 14;
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
    window.scrollTo({
      top,
      left: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
    if (focus) window.requestAnimationFrame(() => target.focus({ preventScroll: true }));
  }

  function syncExplore(options = {}) {
    if (document.body.dataset.view !== 'workspace') return;
    renderExplore();
    if (options.tab) window.requestAnimationFrame(() => scrollToExploreSection(options.tab, options.focus !== false));
  }

  function install() {
    if (neutralizeEntryOnLoad) neutralizeEntry();

    $('#resetDemo')?.addEventListener('click', () => window.queueMicrotask(neutralizeEntry));

    document.addEventListener('briefdemo:viewchange', event => {
      if (event.detail?.view === 'workspace') syncExplore({ focus: false });
    });

    document.addEventListener('briefdemo:scenariochange', () => {
      if (document.body.dataset.view === 'workspace') syncExplore({ focus: false });
    });

    document.addEventListener('briefdemo:tabchange', event => {
      if (document.body.dataset.view !== 'workspace') return;
      syncExplore({ tab: event.detail?.tab, focus: true });
    });

    if (document.body.dataset.view === 'workspace') syncExplore({ focus: false });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();