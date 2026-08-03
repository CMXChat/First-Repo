(() => {
  'use strict';

  const brief = window.CMX_NEWS_BRIEF || {};
  const header = document.querySelector('.brief-header');
  const host = document.getElementById('briefContent');
  if (!header || !host || document.getElementById('newsWorkspace')) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const make = (tag, className = '', text = '') => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const first = value => Array.isArray(value) && value.length ? value[0] : null;
  const tabs = ['overview', 'us', 'crystal', 'jay', 'plans'];
  const editionKey = String(brief.meta?.date || new Date().toISOString().slice(0, 10))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  const storagePrefix = `cmx-news:${editionKey}:workspace`;
  let activeTab = readStorage('tab', 'overview');

  function readStorage(key, fallback) {
    try {
      return window.localStorage.getItem(`${storagePrefix}:${key}`) || fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(`${storagePrefix}:${key}`, value);
    } catch {}
  }

  function stylesheet() {
    if ($('link[href^="/assets/news-workspace.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/assets/news-workspace.css?v=${Date.now()}`;
    document.head.appendChild(link);
  }

  function focusSection(section) {
    if (!section) return;
    const hadTabIndex = section.hasAttribute('tabindex');
    if (!hadTabIndex) section.setAttribute('tabindex', '-1');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => {
      section.focus({ preventScroll: true });
      if (!hadTabIndex) section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
    }, 420);
  }

  function openSection(id) {
    setDepth('full');
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => focusSection(document.getElementById(id)));
    });
  }

  function actionRows() {
    return $$('#nextStepsCards .card-list li');
  }

  function actionData() {
    return actionRows().map((row, index) => ({
      index,
      text: row.querySelector('.news-action-toggle')?.dataset.actionText || row.textContent.trim(),
      complete: row.classList.contains('is-complete')
    })).filter(item => item.text);
  }

  function nextAction() {
    return actionData().find(item => !item.complete) || null;
  }

  function heading(path, title, copy) {
    const wrap = make('div', 'news-workspace-heading');
    const left = make('div');
    left.append(make('p', 'path-label', path), make('h3', '', title));
    wrap.append(left, make('p', '', copy));
    return wrap;
  }

  function signal(label, item, tone, target) {
    const button = make('button', `news-workspace-signal tone-${tone}`);
    button.type = 'button';
    button.addEventListener('click', () => openSection(target));
    button.append(
      make('span', '', label),
      make('h4', '', item?.title || item?.text || 'Waiting for an update'),
      make('p', '', item?.text || 'The full edition has the deeper context.')
    );
    return button;
  }

  function signalGrid() {
    const grid = make('div', 'news-workspace-signals');
    const next = nextAction();
    const birthday = (brief.timeline || []).find(item => /birthday|september 14|september 15/i.test(`${item?.title || ''} ${item?.text || ''}`))
      || (brief.sinceYesterday || []).find(item => /birthday/i.test(`${item?.label || ''} ${item?.title || ''}`));
    [
      ['NEXT', { title: next?.text, text: 'First unfinished action on this device.' }, 'jay', 'nextSteps'],
      ['CRYSTAL', first(brief.crystal), 'crystal', 'crystal'],
      ['US', first(brief.relationship), 'shared', 'relationship'],
      ['JAY', first(brief.activity), 'jay', 'activity'],
      ['COMING UP', birthday || { title: 'Three-day birthday window', text: 'September 14 and 15 stretch across New Zealand and New York.' }, 'gold', 'timeline']
    ].forEach(([label, item, tone, target]) => grid.appendChild(signal(label, item, tone, target)));
    return grid;
  }

  function quote() {
    const data = brief.quote || {};
    const card = make('blockquote', 'news-workspace-quote');
    card.append(make('span', '', '“'));
    const body = make('div');
    body.append(
      make('small', '', String(data.kicker || 'ONE LINE TO KEEP').toUpperCase()),
      make('p', '', data.text || 'One honest action can carry the day.'),
      make('footer', '', data.reflection || data.source || 'Today’s reflection')
    );
    card.appendChild(body);
    return card;
  }

  function recommended() {
    const next = nextAction();
    const card = make('article', 'news-workspace-next');
    card.append(
      make('span', '', 'RECOMMENDED NEXT MOVE'),
      make('h4', '', next?.text || 'Choose one useful action'),
      make('p', '', next ? 'Finish the visible step before reorganizing the plan again.' : 'Everything listed is marked complete on this device.')
    );
    const button = make('button', '', 'Open actions');
    button.type = 'button';
    button.addEventListener('click', () => openSection('nextSteps'));
    card.appendChild(button);
    return card;
  }

  function dayline() {
    const section = make('section', 'news-workspace-dayline');
    const intro = make('div');
    intro.append(make('p', 'path-label', '~/today/flow'), make('h4', '', 'A short path through the day.'));
    const list = make('ol');
    actionData().slice(0, 4).forEach((item, index) => {
      const row = make('li', item.complete ? 'is-complete' : '');
      row.append(
        make('span', '', String(index + 1).padStart(2, '0')),
        make('strong', '', item.text),
        make('small', '', item.complete ? 'Done here' : 'Still open')
      );
      list.appendChild(row);
    });
    if (!list.children.length) {
      const row = make('li');
      row.append(make('span', '', '01'), make('strong', '', 'Choose one useful action'), make('small', '', 'No checklist loaded'));
      list.appendChild(row);
    }
    section.append(intro, list);
    return section;
  }

  function compact(items, fallback) {
    const list = make('div', 'news-workspace-list');
    const values = items.filter(Boolean);
    if (!values.length) values.push({ label: 'WAITING', title: fallback, text: '' });
    values.forEach(item => {
      const row = make('article');
      row.append(make('span', '', String(item.label || item.status || 'UPDATE').toUpperCase()));
      const body = make('div');
      body.append(make('strong', '', item.title || 'Briefing note'), make('small', '', item.text || ''));
      row.appendChild(body);
      list.appendChild(row);
    });
    return list;
  }

  function plans() {
    const list = make('div', 'news-workspace-actions');
    actionRows().forEach(row => {
      const source = row.querySelector('.news-action-toggle');
      const done = row.classList.contains('is-complete');
      const button = make('button', done ? 'is-complete' : '');
      button.type = 'button';
      button.setAttribute('aria-pressed', String(done));
      button.append(make('span', '', done ? '✓' : ''), make('strong', '', source?.dataset.actionText || row.textContent.trim()));
      button.addEventListener('click', () => {
        source?.click();
        window.setTimeout(() => {
          render();
          window.dispatchEvent(new CustomEvent('news:actions-changed'));
        }, 0);
      });
      list.appendChild(button);
    });
    if (!list.children.length) list.appendChild(make('p', 'news-workspace-empty', 'No actions are loaded in today’s edition.'));
    return list;
  }

  function render() {
    const panel = $('#newsWorkspacePanel');
    if (!panel) return;
    panel.replaceChildren();
    if (activeTab === 'overview') {
      panel.append(heading('~/quick/overview', 'What matters now', 'The strongest personal, shared, and practical signals from the full edition.'), signalGrid());
      const lower = make('div', 'news-workspace-lower');
      lower.append(recommended(), quote());
      panel.append(lower, dayline());
    } else if (activeTab === 'us') {
      panel.append(heading('~/quick/us', 'Us, without the courtroom', 'Affection, birthdays, plans, and one useful relationship observation.'), compact([...(brief.relationship || []).slice(0, 3), ...(brief.timeline || []).slice(0, 2), first(brief.memory)], 'Waiting for the next shared update.'));
    } else if (activeTab === 'crystal') {
      panel.append(heading('~/quick/crystal', 'A page that should recognize her', 'Her own voice stays more important than researched guesses.'), compact([...(brief.crystal || []).slice(0, 3), ...(brief.style || []).slice(0, 2)], 'Waiting for Crystal’s own paragraphs.'));
    } else if (activeTab === 'jay') {
      panel.append(heading('~/quick/jay', 'Honest context, then action', 'The career block stays visible without making work the entire page.'), compact([...(brief.activity || []).slice(0, 2), ...(brief.progress || []).filter(item => item?.audience === 'jay').slice(0, 3)], 'Waiting for Jay’s next check-in.'));
    } else {
      panel.append(heading('~/quick/plans', 'Small enough to complete', 'Checks stay on this device and do not imply backend storage.'), plans());
    }
    window.dispatchEvent(new CustomEvent('news:workspace-rendered', { detail: { tab: activeTab } }));
  }

  function setTab(id, focus = false) {
    activeTab = tabs.includes(id) ? id : 'overview';
    writeStorage('tab', activeTab);
    $$('[data-workspace-tab]').forEach(button => {
      const active = button.dataset.workspaceTab === activeTab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus();
    });
    render();
  }

  function syncAuxiliaryControls(quick) {
    const personal = $('#newsPersonalView');
    if (personal) {
      personal.hidden = quick;
      personal.setAttribute('aria-hidden', String(quick));
      if (!quick) personal.textContent = document.body.classList.contains('news-personal-view') ? 'Show build notes' : 'Hide build notes';
    }
  }

  function setDepth(depth, save = true) {
    const normalized = depth === 'full' ? 'full' : 'quick';
    const quick = normalized === 'quick';
    document.body.classList.toggle('news-workspace-quick', quick);
    document.body.dataset.newsDepth = normalized;
    $$('[data-workspace-depth]').forEach(button => {
      const active = button.dataset.workspaceDepth === normalized;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    syncAuxiliaryControls(quick);
    if (save) writeStorage('depth', normalized);
    window.dispatchEvent(new CustomEvent('news:depth-change', { detail: { depth: normalized } }));
  }

  function bindExternalNavigation() {
    ['newsJumpNext', 'newsOpenActions'].forEach(id => {
      const button = document.getElementById(id);
      if (!button || button.dataset.workspaceBound === 'true') return;
      button.dataset.workspaceBound = 'true';
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        openSection('nextSteps');
      }, true);
    });
  }

  function bindTabKeyboard(tabbar) {
    tabbar.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const current = Math.max(0, tabs.indexOf(activeTab));
      const index = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      setTab(tabs[index], true);
    });
  }

  function build() {
    const section = make('section', 'news-workspace');
    section.id = 'newsWorkspace';
    section.setAttribute('aria-labelledby', 'newsWorkspaceTitle');

    const top = make('div', 'news-workspace-top');
    const copy = make('div');
    const title = make('h2', '', 'THE DAY, WITHOUT THE WHOLE SCROLL');
    title.id = 'newsWorkspaceTitle';
    copy.append(make('p', 'path-label', '~/brief/private-workspace'), title, make('p', '', 'Five useful signals, one honest move, and the full edition whenever you need the details.'));

    const depth = make('div', 'news-workspace-depth');
    depth.setAttribute('aria-label', 'Briefing depth');
    [['quick', 'Quick'], ['full', 'Full edition']].forEach(([id, label]) => {
      const button = make('button', '', label);
      button.type = 'button';
      button.dataset.workspaceDepth = id;
      button.addEventListener('click', () => setDepth(id));
      depth.appendChild(button);
    });
    top.append(copy, depth);

    const tabbar = make('div', 'news-workspace-tabs');
    tabbar.setAttribute('role', 'tablist');
    tabbar.setAttribute('aria-label', 'Quick briefing views');
    const labels = { overview: 'Overview', us: 'Us', crystal: 'Crystal', jay: 'Jay', plans: 'Plans' };
    tabs.forEach(id => {
      const button = make('button', '', labels[id]);
      button.type = 'button';
      button.dataset.workspaceTab = id;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', 'newsWorkspacePanel');
      button.addEventListener('click', () => setTab(id));
      tabbar.appendChild(button);
    });
    bindTabKeyboard(tabbar);

    const panel = make('div', 'news-workspace-panel');
    panel.id = 'newsWorkspacePanel';
    panel.setAttribute('role', 'tabpanel');
    panel.tabIndex = 0;
    section.append(top, tabbar, panel);

    const anchor = $('.news-knowledge-strip') || $('.live-location-grid');
    if (anchor) anchor.insertAdjacentElement('afterend', section);
    else header.appendChild(section);

    const label = $('.news-experience-label strong');
    if (label) label.textContent = 'Quick context first. Full edition when you want it.';
    const oldNext = $('.news-next-up');
    if (oldNext) oldNext.hidden = true;

    setTab(activeTab);
    setDepth(readStorage('depth', 'quick'), false);
    bindExternalNavigation();

    const observer = new MutationObserver(() => {
      if (activeTab === 'overview' || activeTab === 'plans') render();
    });
    const actionHost = $('#nextStepsCards');
    if (actionHost) observer.observe(actionHost, { subtree: true, attributes: true, attributeFilter: ['class', 'aria-pressed'] });

    window.addEventListener('news:refresh', render);
    window.addEventListener('news:actions-changed', render);
  }

  stylesheet();
  build();
})();
