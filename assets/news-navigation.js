(() => {
  'use strict';

  const brief = window.CMX_NEWS_BRIEF || {};
  const shell = document.querySelector('.brief-shell');
  const header = document.querySelector('.brief-header');
  const workspace = document.getElementById('newsWorkspace');
  const content = document.getElementById('briefContent');
  if (!shell || !header || !workspace || !content || document.getElementById('newsSectionMap')) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  const validTabs = new Set(['overview', 'us', 'crystal', 'jay', 'plans']);
  let applyingUrl = false;
  let activeSection = '';
  let returnFocus = null;

  const sections = [
    { id: 'priority', label: 'Today', group: 'Start', tab: 'overview' },
    { id: 'opening', label: 'Quick read', group: 'Start', tab: 'overview' },
    { id: 'weather', label: 'Weather', group: 'Start', tab: 'overview' },
    { id: 'activity', label: 'Jay', group: 'People', tab: 'jay' },
    { id: 'crystal', label: 'Crystal', group: 'People', tab: 'crystal' },
    { id: 'style', label: 'Style and joys', group: 'People', tab: 'crystal' },
    { id: 'relationship', label: 'Us', group: 'Together', tab: 'us' },
    { id: 'timeline', label: 'Shared plans', group: 'Together', tab: 'us' },
    { id: 'horoscope', label: 'Double Virgo', group: 'Together', tab: 'us' },
    { id: 'spotify', label: 'Play and watch', group: 'Media', tab: 'overview' },
    { id: 'local', label: 'Local news', group: 'World', tab: 'overview' },
    { id: 'world', label: 'World', group: 'World', tab: 'overview' },
    { id: 'culture', label: 'Culture', group: 'World', tab: 'crystal' },
    { id: 'quote', label: 'One line', group: 'Reflect', tab: 'us' },
    { id: 'nextSteps', label: 'Actions', group: 'Plans', tab: 'plans' },
    { id: 'questions', label: 'Shape tomorrow', group: 'Plans', tab: 'plans' }
  ];

  const mainLinks = [
    ['priority', 'Start'],
    ['activity', 'Jay'],
    ['crystal', 'Crystal'],
    ['relationship', 'Us'],
    ['spotify', 'Play'],
    ['local', 'World'],
    ['nextSteps', 'Plans']
  ];

  const related = {
    priority: ['opening', 'nextSteps'],
    opening: ['activity', 'crystal'],
    activity: ['nextSteps', 'relationship'],
    crystal: ['style', 'relationship'],
    weather: ['local', 'spotify'],
    style: ['crystal', 'spotify'],
    spotify: ['relationship', 'quote'],
    local: ['world', 'culture'],
    world: ['local', 'culture'],
    culture: ['crystal', 'spotify'],
    horoscope: ['relationship', 'timeline'],
    relationship: ['timeline', 'quote', 'nextSteps'],
    timeline: ['relationship', 'nextSteps'],
    quote: ['questions', 'relationship'],
    nextSteps: ['questions', 'priority'],
    questions: ['priority', 'opening']
  };

  function installStylesheet() {
    if ($('link[href^="/assets/news-navigation.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/assets/news-navigation.css?v=${Date.now()}`;
    document.head.appendChild(link);
  }

  function make(tag, className = '', text = '') {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function descriptor(id) {
    return sections.find(item => item.id === id) || null;
  }

  function sectionLabel(id) {
    return descriptor(id)?.label || id;
  }

  function existingSections() {
    return sections.filter(item => document.getElementById(item.id));
  }

  function currentTab() {
    return $('[data-workspace-tab][aria-selected="true"]')?.dataset.workspaceTab || 'overview';
  }

  function currentDepth() {
    return document.body.dataset.newsDepth || (document.body.classList.contains('news-workspace-quick') ? 'quick' : 'full');
  }

  function focusTarget(target) {
    if (!target) return;
    const previousTabIndex = target.getAttribute('tabindex');
    target.setAttribute('tabindex', '-1');
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => {
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => {
        if (previousTabIndex === null) target.removeAttribute('tabindex');
        else target.setAttribute('tabindex', previousTabIndex);
      }, { once: true });
    }, reducedMotion ? 0 : 360);
  }

  function urlForSection(id) {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'full');
    url.searchParams.delete('tab');
    url.hash = id;
    return url;
  }

  function urlForTab(tab) {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'quick');
    url.searchParams.set('tab', validTabs.has(tab) ? tab : 'overview');
    url.hash = 'newsWorkspace';
    return url;
  }

  function updateUrl(url, replace = false) {
    if (applyingUrl) return;
    window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
  }

  function setFullView() {
    const button = $('[data-workspace-depth="full"]');
    if (button && button.getAttribute('aria-pressed') !== 'true') button.click();
  }

  function setQuickView(tab = 'overview') {
    const quick = $('[data-workspace-depth="quick"]');
    if (quick && quick.getAttribute('aria-pressed') !== 'true') quick.click();
    const targetTab = $(`[data-workspace-tab="${validTabs.has(tab) ? tab : 'overview'}"]`);
    if (targetTab && targetTab.getAttribute('aria-selected') !== 'true') targetTab.click();
  }

  function navigateSection(id, options = {}) {
    const target = document.getElementById(id);
    if (!target) return;
    setFullView();
    closeDrawer(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        focusTarget(target);
        setCurrent(id);
      });
    });
    if (options.updateUrl !== false) updateUrl(urlForSection(id), options.replace === true);
  }

  function navigateTab(tab, options = {}) {
    const normalized = validTabs.has(tab) ? tab : 'overview';
    setQuickView(normalized);
    closeDrawer(false);
    window.requestAnimationFrame(() => focusTarget(workspace));
    if (options.updateUrl !== false) updateUrl(urlForTab(normalized), options.replace === true);
    setCurrent(`quick:${normalized}`);
  }

  function setCurrent(value) {
    activeSection = value;
    const indicator = $('#newsMapCurrent');
    const quick = String(value).startsWith('quick:');
    const tab = quick ? String(value).split(':')[1] : '';
    const label = quick ? `Quick · ${tab.charAt(0).toUpperCase()}${tab.slice(1)}` : sectionLabel(value);
    if (indicator) indicator.textContent = label || 'Quick overview';

    $$('[data-news-map-target]').forEach(link => {
      const active = !quick && link.dataset.newsMapTarget === value;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    $$('[data-news-drawer-target]').forEach(link => {
      const active = !quick && link.dataset.newsDrawerTarget === value;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

    $$('[data-news-quick-tab]').forEach(link => {
      const active = quick && link.dataset.newsQuickTab === tab;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function buildMap() {
    $('.brief-nav')?.setAttribute('hidden', '');
    const nav = make('nav', 'news-section-map');
    nav.id = 'newsSectionMap';
    nav.setAttribute('aria-label', 'Briefing map');

    const location = make('div', 'news-map-location');
    location.append(make('span', '', 'YOU ARE HERE'), make('strong', '', 'Quick overview'));
    location.querySelector('strong').id = 'newsMapCurrent';

    const links = make('div', 'news-map-links');
    mainLinks.forEach(([id, label]) => {
      if (!document.getElementById(id)) return;
      const button = make('button', 'news-map-link', label);
      button.type = 'button';
      button.dataset.newsMapTarget = id;
      button.addEventListener('click', () => navigateSection(id));
      links.appendChild(button);
    });

    const actions = make('div', 'news-map-actions');
    const quick = make('button', 'news-map-action', 'Quick');
    quick.type = 'button';
    quick.addEventListener('click', () => navigateTab(currentTab()));
    const all = make('button', 'news-map-action is-primary', 'All sections');
    all.type = 'button';
    all.id = 'newsOpenSectionDrawer';
    all.setAttribute('aria-haspopup', 'dialog');
    all.setAttribute('aria-controls', 'newsSectionDrawer');
    all.setAttribute('aria-expanded', 'false');
    all.addEventListener('click', openDrawer);
    actions.append(quick, all);

    nav.append(location, links, actions);
    header.insertAdjacentElement('afterend', nav);
  }

  function groupedSections() {
    const groups = new Map();
    existingSections().forEach(item => {
      if (!groups.has(item.group)) groups.set(item.group, []);
      groups.get(item.group).push(item);
    });
    return groups;
  }

  function buildDrawer() {
    $('#newsSectionDrawer')?.remove();
    const layer = make('div', 'news-section-drawer');
    layer.id = 'newsSectionDrawer';
    layer.hidden = true;
    layer.innerHTML = `
      <button class="news-drawer-backdrop" type="button" data-news-drawer-close aria-label="Close section navigator"></button>
      <aside class="news-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="newsDrawerTitle">
        <header class="news-drawer-head">
          <div><span>BRIEFING MAP</span><h2 id="newsDrawerTitle">Go straight to what you need.</h2></div>
          <button type="button" class="news-drawer-close" data-news-drawer-close aria-label="Close section navigator">×</button>
        </header>
        <p class="news-drawer-intro">Use a Quick lens, open a full section, or return to the exact place later through the URL.</p>
        <section class="news-drawer-quick" aria-labelledby="newsDrawerQuickTitle">
          <h3 id="newsDrawerQuickTitle">Quick views</h3>
          <div></div>
        </section>
        <div class="news-drawer-groups"></div>
        <footer><span>Escape closes this map.</span><button type="button" data-news-drawer-close>Done</button></footer>
      </aside>`;

    const quickHost = $('.news-drawer-quick > div', layer);
    const quickLabels = { overview: 'Overview', us: 'Us', crystal: 'Crystal', jay: 'Jay', plans: 'Plans' };
    Object.entries(quickLabels).forEach(([tab, label]) => {
      const button = make('button', 'news-drawer-quick-link', label);
      button.type = 'button';
      button.dataset.newsQuickTab = tab;
      button.addEventListener('click', () => navigateTab(tab));
      quickHost.appendChild(button);
    });

    const groupHost = $('.news-drawer-groups', layer);
    const all = existingSections();
    groupedSections().forEach((items, group) => {
      const section = make('section', 'news-drawer-group');
      section.appendChild(make('h3', '', group));
      const grid = make('div');
      items.forEach(item => {
        const button = make('button', 'news-drawer-section-link');
        button.type = 'button';
        button.dataset.newsDrawerTarget = item.id;
        const number = String(all.findIndex(entry => entry.id === item.id) + 1).padStart(2, '0');
        button.append(
          make('span', '', number),
          make('strong', '', item.label),
          make('small', '', item.tab === 'plans' ? 'Action and input' : `Full ${item.group.toLowerCase()} section`)
        );
        button.addEventListener('click', () => navigateSection(item.id));
        grid.appendChild(button);
      });
      section.appendChild(grid);
      groupHost.appendChild(section);
    });

    $$('[data-news-drawer-close]', layer).forEach(button => button.addEventListener('click', () => closeDrawer()));
    layer.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDrawer();
      }
      trapFocus(event, $('.news-drawer-panel', layer));
    });
    document.body.appendChild(layer);
  }

  function focusable(root) {
    return $$('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])', root)
      .filter(node => node.offsetParent !== null && !node.hidden);
  }

  function trapFocus(event, root) {
    if (event.key !== 'Tab' || !root) return;
    const items = focusable(root);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function setPageInert(enabled) {
    if ('inert' in shell) shell.inert = enabled;
    else if (enabled) shell.setAttribute('aria-hidden', 'true');
    else shell.removeAttribute('aria-hidden');
  }

  function openDrawer() {
    const layer = $('#newsSectionDrawer');
    const button = $('#newsOpenSectionDrawer');
    if (!layer || !button || !layer.hidden) return;
    returnFocus = document.activeElement;
    layer.hidden = false;
    document.body.classList.add('news-navigation-open');
    setPageInert(true);
    button.setAttribute('aria-expanded', 'true');
    window.requestAnimationFrame(() => layer.classList.add('is-open'));
    window.setTimeout(() => $('.news-drawer-close', layer)?.focus(), reducedMotion ? 0 : 130);
  }

  function closeDrawer(restore = true) {
    const layer = $('#newsSectionDrawer');
    const button = $('#newsOpenSectionDrawer');
    if (!layer || layer.hidden) return;
    layer.classList.remove('is-open');
    setPageInert(false);
    const finish = () => {
      layer.hidden = true;
      document.body.classList.remove('news-navigation-open');
      button?.setAttribute('aria-expanded', 'false');
      if (restore) (returnFocus || button)?.focus?.();
    };
    window.setTimeout(finish, reducedMotion ? 0 : 150);
  }

  function firstText(items, predicate = () => true) {
    const value = (Array.isArray(items) ? items : []).find(item => predicate(item));
    return value?.title || value?.text || value?.label || '';
  }

  function nextActionText() {
    const row = $$('#nextStepsCards .card-list li').find(item => !item.classList.contains('is-complete'));
    const sourceItems = Array.isArray(brief.nextSteps?.[0]?.items)
      ? brief.nextSteps[0].items.map(text => ({ text }))
      : [];
    return row?.querySelector('.news-action-toggle')?.dataset.actionText
      || row?.textContent?.trim()
      || firstText(sourceItems)
      || 'Choose one useful action';
  }

  function sharedPathData() {
    const timeline = Array.isArray(brief.timeline) ? brief.timeline : [];
    const relationship = Array.isArray(brief.relationship) ? brief.relationship : [];
    const progress = Array.isArray(brief.progress) ? brief.progress : [];
    const birthday = firstText(timeline, item => /birthday|september 14|september 15/i.test(`${item?.title || ''} ${item?.text || ''}`))
      || 'September 14 and 15 across two time zones';
    const meeting = firstText([...timeline, ...relationship], item => /meet|visit|flight|save|saving|in person/i.test(`${item?.title || ''} ${item?.text || ''}`))
      || 'Keep the longer-term meeting plan visible';
    const week = firstText(progress, item => /job|resume|call|workout|week|apply|outreach/i.test(`${item?.title || ''} ${item?.text || ''}`))
      || firstText(timeline, item => !/birthday|meet|visit/i.test(`${item?.title || ''} ${item?.text || ''}`))
      || 'Carry one useful action into the week';
    return [
      { label: 'TODAY', title: nextActionText(), target: 'nextSteps', tone: 'jay' },
      { label: 'THIS WEEK', title: week, target: 'activity', tone: 'shared' },
      { label: 'BIRTHDAYS', title: birthday, target: 'timeline', tone: 'gold' },
      { label: 'MEETING GOAL', title: meeting, target: 'relationship', tone: 'crystal' }
    ];
  }

  function buildSharedPath() {
    $('#newsSharedPath')?.remove();
    const section = make('section', 'news-shared-path');
    section.id = 'newsSharedPath';
    section.setAttribute('aria-labelledby', 'newsSharedPathTitle');
    const head = make('div', 'news-shared-path-head');
    const copy = make('div');
    copy.append(make('p', 'path-label', '~/shared/path'), make('h3', '', 'FROM TODAY TO TOGETHER'));
    copy.querySelector('h3').id = 'newsSharedPathTitle';
    head.append(copy, make('p', '', 'A compact route through what is immediate, upcoming, and worth keeping visible.'));
    const rail = make('div', 'news-shared-path-rail');
    sharedPathData().forEach((item, index) => {
      const button = make('button', `news-path-step tone-${item.tone}`);
      button.type = 'button';
      button.dataset.newsPathTarget = item.target;
      button.append(
        make('span', '', `${String(index + 1).padStart(2, '0')} · ${item.label}`),
        make('strong', '', item.title),
        make('small', '', `Open ${sectionLabel(item.target)}`)
      );
      button.addEventListener('click', () => navigateSection(item.target));
      rail.appendChild(button);
    });
    section.append(head, rail);
    const tabs = $('.news-workspace-tabs');
    if (tabs) tabs.insertAdjacentElement('beforebegin', section);
    else workspace.appendChild(section);
  }

  function quickLinksFor(tab) {
    const map = {
      overview: [['priority', 'Start here'], ['spotify', 'Open play and watch'], ['local', 'See the world section']],
      us: [['relationship', 'Open the relationship checkpoint'], ['timeline', 'Open shared plans'], ['quote', 'Open today’s reflection']],
      crystal: [['crystal', 'Open Crystal’s Corner'], ['style', 'Open style and small joys'], ['culture', 'Open culture']],
      jay: [['activity', 'Open Jay’s check-in'], ['nextSteps', 'Open actions'], ['priority', 'Open today’s priorities']],
      plans: [['nextSteps', 'Open the checklist'], ['timeline', 'Open shared plans'], ['questions', 'Shape tomorrow']]
    };
    return map[tab] || map.overview;
  }

  function decorateQuickPanel() {
    const panel = $('#newsWorkspacePanel');
    if (!panel) return;
    panel.querySelector('.news-quick-deeper')?.remove();
    const section = make('nav', 'news-quick-deeper');
    section.setAttribute('aria-label', 'Go deeper from this quick view');
    section.appendChild(make('span', '', 'GO DEEPER'));
    quickLinksFor(currentTab()).forEach(([id, label]) => {
      if (!document.getElementById(id)) return;
      const button = make('button', '', label);
      button.type = 'button';
      button.addEventListener('click', () => navigateSection(id));
      section.appendChild(button);
    });
    panel.appendChild(section);
  }

  function addCopyLink(section, id) {
    const heading = $('.section-heading', section);
    if (!heading || heading.querySelector('.news-copy-section')) return;
    const button = make('button', 'news-copy-section', 'Copy link');
    button.type = 'button';
    button.setAttribute('aria-label', `Copy direct link to ${sectionLabel(id)}`);
    button.addEventListener('click', async () => {
      const url = urlForSection(id).toString();
      try {
        await navigator.clipboard.writeText(url);
        button.textContent = 'Copied';
      } catch {
        window.history.replaceState({}, '', url);
        button.textContent = 'Link ready';
      }
      window.setTimeout(() => { button.textContent = 'Copy link'; }, 1400);
    });
    heading.appendChild(button);
  }

  function addContextLinks(section, id) {
    section.querySelector('.news-section-context')?.remove();
    const nav = make('nav', 'news-section-context');
    nav.setAttribute('aria-label', `Related sections after ${sectionLabel(id)}`);
    nav.appendChild(make('span', '', 'RELATED'));
    (related[id] || []).forEach(target => {
      if (!document.getElementById(target)) return;
      const button = make('button', '', sectionLabel(target));
      button.type = 'button';
      button.addEventListener('click', () => navigateSection(target));
      nav.appendChild(button);
    });
    section.appendChild(nav);
  }

  function visibleSectionList() {
    return existingSections().filter(item => {
      const node = document.getElementById(item.id);
      return node && !node.hidden && node.getAttribute('aria-hidden') !== 'true';
    });
  }

  function addGuidedControls(section, id) {
    section.querySelector('.news-section-guide')?.remove();
    const controls = make('nav', 'news-section-guide');
    controls.setAttribute('aria-label', `Continue from ${sectionLabel(id)}`);
    const previous = make('button', 'news-guide-direction');
    const next = make('button', 'news-guide-direction is-next');
    previous.type = 'button';
    next.type = 'button';

    const list = visibleSectionList();
    const index = list.findIndex(item => item.id === id);
    const prevItem = index > 0 ? list[index - 1] : null;
    const nextItem = index >= 0 && index < list.length - 1 ? list[index + 1] : null;
    previous.disabled = !prevItem;
    previous.textContent = prevItem ? `← ${prevItem.label}` : '← Start';
    next.disabled = !nextItem;
    next.textContent = nextItem ? `${nextItem.label} →` : 'End of edition';
    if (prevItem) previous.addEventListener('click', () => navigateSection(prevItem.id));
    if (nextItem) next.addEventListener('click', () => navigateSection(nextItem.id));

    const quick = make('button', 'news-guide-quick', 'Back to Quick overview');
    quick.type = 'button';
    quick.addEventListener('click', () => navigateTab('overview'));
    controls.append(previous, quick, next);
    section.appendChild(controls);
  }

  function enhanceSections() {
    existingSections().forEach(item => {
      const section = document.getElementById(item.id);
      addCopyLink(section, item.id);
      addContextLinks(section, item.id);
      addGuidedControls(section, item.id);
    });
  }

  function bindMapObserver() {
    if (!('IntersectionObserver' in window)) return;
    const nodes = existingSections().map(item => document.getElementById(item.id)).filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      if (currentDepth() === 'quick') return;
      const current = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setCurrent(current.target.id);
    }, { rootMargin: '-18% 0px -66% 0px', threshold: [0.02, 0.2, 0.5] });
    nodes.forEach(node => observer.observe(node));
  }

  function bindWorkspaceUrls() {
    $$('[data-workspace-tab]').forEach(button => {
      button.addEventListener('click', () => {
        if (applyingUrl) return;
        window.setTimeout(() => {
          const tab = button.dataset.workspaceTab || 'overview';
          updateUrl(urlForTab(tab), true);
          setCurrent(`quick:${tab}`);
          decorateQuickPanel();
        }, 0);
      });
    });

    $$('[data-workspace-depth]').forEach(button => {
      button.addEventListener('click', () => {
        if (applyingUrl) return;
        window.setTimeout(() => {
          const depth = button.dataset.workspaceDepth;
          if (depth === 'quick') {
            updateUrl(urlForTab(currentTab()), true);
            setCurrent(`quick:${currentTab()}`);
          } else {
            const url = new URL(window.location.href);
            url.searchParams.set('view', 'full');
            url.hash = activeSection && !String(activeSection).startsWith('quick:') ? activeSection : 'priority';
            updateUrl(url, true);
          }
        }, 0);
      });
    });

    window.addEventListener('news:workspace-rendered', event => {
      decorateQuickPanel();
      if (currentDepth() === 'quick') setCurrent(`quick:${event.detail?.tab || currentTab()}`);
    });
  }

  function applyUrlState() {
    applyingUrl = true;
    const url = new URL(window.location.href);
    const tab = validTabs.has(url.searchParams.get('tab')) ? url.searchParams.get('tab') : 'overview';
    const hash = url.hash.replace(/^#/, '');
    if (hash && hash !== 'newsWorkspace' && document.getElementById(hash)) {
      setFullView();
      window.setTimeout(() => navigateSection(hash, { updateUrl: false }), 80);
    } else if (url.searchParams.get('view') === 'quick' || url.searchParams.has('tab') || hash === 'newsWorkspace') {
      setQuickView(tab);
      window.setTimeout(() => {
        focusTarget(workspace);
        setCurrent(`quick:${tab}`);
      }, 60);
    } else if (currentDepth() === 'quick') {
      setCurrent(`quick:${currentTab()}`);
    } else {
      setCurrent('priority');
    }
    window.setTimeout(() => { applyingUrl = false; }, 120);
  }

  function bindHistory() {
    window.addEventListener('popstate', applyUrlState);
    window.addEventListener('hashchange', () => {
      if (!applyingUrl) applyUrlState();
    });
  }

  function rebuildDynamicParts() {
    buildDrawer();
    buildSharedPath();
    enhanceSections();
    decorateQuickPanel();
  }

  installStylesheet();
  buildMap();
  buildDrawer();
  buildSharedPath();
  enhanceSections();
  decorateQuickPanel();
  bindMapObserver();
  bindWorkspaceUrls();
  bindHistory();
  applyUrlState();

  const observer = new MutationObserver(() => {
    if (!document.getElementById('nextSteps')) return;
    observer.disconnect();
    rebuildDynamicParts();
  });
  if (!document.getElementById('nextSteps')) observer.observe(content, { childList: true, subtree: true });

  window.addEventListener('news:refresh', rebuildDynamicParts);
  window.addEventListener('news:actions-changed', buildSharedPath);
})();