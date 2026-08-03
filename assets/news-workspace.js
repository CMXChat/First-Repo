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
  let activeTab = 'overview';

  function stylesheet() {
    if ($('link[href^="/assets/news-workspace.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/assets/news-workspace.css?v=${Date.now()}`;
    document.head.appendChild(link);
  }

  function openSection(id) {
    setDepth('full');
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
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
      row.append(make('span', '', String(index + 1).padStart(2, '0')), make('strong', '', item.text), make('small', '', item.complete ? 'Done here' : 'Still open'));
      list.appendChild(row);
    });
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
      const button = make('button', row.classList.contains('is-complete') ? 'is-complete' : '');
      button.type = 'button';
      button.append(make('span', '', row.classList.contains('is-complete') ? '✓' : ''), make('strong', '', source?.dataset.actionText || row.textContent.trim()));
      button.addEventListener('click', () => {
        source?.click();
        window.setTimeout(render, 0);
      });
      list.appendChild(button);
    });
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
  }

  function setTab(id) {
    activeTab = tabs.includes(id) ? id : 'overview';
    $$('[data-workspace-tab]').forEach(button => {
      const active = button.dataset.workspaceTab === activeTab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    render();
  }

  function setDepth(depth) {
    const quick = depth === 'quick';
    document.body.classList.toggle('news-workspace-quick', quick);
    $$('[data-workspace-depth]').forEach(button => {
      const active = button.dataset.workspaceDepth === depth;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function build() {
    const section = make('section', 'news-workspace');
    section.id = 'newsWorkspace';
    const top = make('div', 'news-workspace-top');
    const copy = make('div');
    copy.append(make('p', 'path-label', '~/brief/private-workspace'), make('h2', '', 'THE DAY, WITHOUT THE WHOLE SCROLL'), make('p', '', 'Five useful signals, one honest move, and the full edition whenever you need the details.'));
    const depth = make('div', 'news-workspace-depth');
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
    const labels = { overview: 'Overview', us: 'Us', crystal: 'Crystal', jay: 'Jay', plans: 'Plans' };
    tabs.forEach(id => {
      const button = make('button', '', labels[id]);
      button.type = 'button';
      button.dataset.workspaceTab = id;
      button.setAttribute('role', 'tab');
      button.addEventListener('click', () => setTab(id));
      tabbar.appendChild(button);
    });

    const panel = make('div', 'news-workspace-panel');
    panel.id = 'newsWorkspacePanel';
    panel.setAttribute('role', 'tabpanel');
    section.append(top, tabbar, panel);

    const anchor = $('.news-knowledge-strip') || $('.live-location-grid');
    if (anchor) anchor.insertAdjacentElement('afterend', section);
    else header.appendChild(section);

    const label = $('.news-experience-label strong');
    if (label) label.textContent = 'Quick context first. Full edition when you want it.';
    const oldNext = $('.news-next-up');
    if (oldNext) oldNext.hidden = true;

    setTab('overview');
    setDepth('full');

    const observer = new MutationObserver(() => {
      if (activeTab === 'overview' || activeTab === 'plans') render();
    });
    const actionHost = $('#nextStepsCards');
    if (actionHost) observer.observe(actionHost, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  stylesheet();
  build();
})();
