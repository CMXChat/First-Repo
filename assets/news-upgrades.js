(() => {
  'use strict';

  const brief = window.CMX_NEWS_BRIEF || {};
  const host = document.getElementById('briefContent');
  if (!host || document.getElementById('sinceYesterday')) return;

  const audienceClass = audience => audience === 'jay'
    ? 'card-jay'
    : audience === 'crystal'
      ? 'card-crystal'
      : 'card-shared';

  const sorted = items => [...(Array.isArray(items) ? items : [])]
    .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));

  function installStylesheet() {
    if (document.querySelector('link[href^="/assets/news-upgrades.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/assets/news-upgrades.css?v=${Date.now()}`;
    document.head.appendChild(link);
  }

  function makeSection({ id, path, title, badge, badgeAudience = 'shared', rootClass = 'card-grid', keepVisible = false }) {
    const section = document.createElement('section');
    section.id = id;
    section.className = `brief-section ${id === 'sinceYesterday' ? 'since-yesterday-section' : ''}`.trim();
    section.dataset.section = id;
    if (keepVisible) section.dataset.keepVisible = 'true';

    const heading = document.createElement('div');
    heading.className = 'section-heading';
    const titleWrap = document.createElement('div');
    const pathLabel = document.createElement('p');
    pathLabel.className = 'path-label';
    pathLabel.textContent = path;
    const headingTitle = document.createElement('h2');
    headingTitle.textContent = title;
    titleWrap.append(pathLabel, headingTitle);
    const audience = document.createElement('span');
    audience.className = `section-audience audience-${badgeAudience}`;
    audience.textContent = badge;
    heading.append(titleWrap, audience);
    section.appendChild(heading);

    const root = document.createElement('div');
    root.id = `${id}Cards`;
    root.className = rootClass;
    section.appendChild(root);
    return section;
  }

  function addDirectLines(parent, lines) {
    (Array.isArray(lines) ? lines : []).forEach(line => {
      const node = document.createElement('p');
      node.className = `direct-line direct-${line.audience || 'shared'}`;
      node.textContent = line.text || '';
      parent.appendChild(node);
    });
  }

  function addDetails(parent, item) {
    const values = [
      ['Why it matters', item.whyItMatters],
      ['What becomes possible next', item.watchNext]
    ].filter(([, value]) => value);
    const detailItems = Array.isArray(item.details) ? item.details : [];
    if (!values.length && !detailItems.length) return;

    const details = document.createElement('details');
    details.className = 'card-details';
    const summary = document.createElement('summary');
    summary.textContent = item.detailsLabel || 'More context';
    details.appendChild(summary);

    values.forEach(([title, value]) => {
      const block = document.createElement('div');
      block.className = 'detail-block';
      const heading = document.createElement('strong');
      heading.textContent = title;
      const text = document.createElement('p');
      text.textContent = value;
      block.append(heading, text);
      details.appendChild(block);
    });

    if (detailItems.length) {
      const block = document.createElement('div');
      block.className = 'detail-block';
      const heading = document.createElement('strong');
      heading.textContent = 'Details';
      const list = document.createElement('ul');
      detailItems.forEach(value => {
        const row = document.createElement('li');
        row.textContent = value;
        list.appendChild(row);
      });
      block.append(heading, list);
      details.appendChild(block);
    }
    parent.appendChild(details);
  }

  function createCard(item, baseClass = 'brief-card') {
    const card = document.createElement('article');
    card.className = `${baseClass} ${audienceClass(item.audience)}`;
    if (item.cardClass) card.classList.add(item.cardClass);
    const top = document.createElement('div');
    top.className = 'card-topline';
    const label = document.createElement('p');
    label.className = 'card-label';
    label.textContent = item.label || 'daily brief';
    top.appendChild(label);
    if (item.status) {
      const status = document.createElement('span');
      status.className = `content-status status-${String(item.status).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      status.textContent = item.status;
      top.appendChild(status);
    }
    const title = document.createElement('h3');
    title.textContent = item.title || 'Briefing note';
    card.append(top, title);
    if (item.text) {
      const text = document.createElement('p');
      text.className = 'card-copy';
      text.textContent = item.text;
      card.appendChild(text);
    }
    if (Array.isArray(item.items) && item.items.length) {
      const list = document.createElement('ul');
      list.className = 'card-list';
      item.items.forEach(value => {
        const row = document.createElement('li');
        row.textContent = value;
        list.appendChild(row);
      });
      card.appendChild(list);
    }
    addDirectLines(card, item.directLines);
    addDetails(card, item);
    return card;
  }

  function renderCards(sectionId, items, baseClass = 'brief-card') {
    const root = document.getElementById(`${sectionId}Cards`);
    const section = document.getElementById(sectionId);
    const values = sorted(items);
    if (!root || !section) return;
    if (!values.length) {
      if (section.dataset.keepVisible !== 'true') section.hidden = true;
      return;
    }
    root.replaceChildren(...values.map(item => createCard(item, baseClass)));
  }

  function productDetails() {
    const details = document.createElement('details');
    details.className = 'card-details';
    const summary = document.createElement('summary');
    summary.textContent = 'See the briefing versions';
    details.appendChild(summary);
    const list = document.createElement('ul');
    list.className = 'card-list';
    [
      'Couple briefing: shared plans, weather, music, memories, goals, and relationship check-ins',
      'Family briefing: schedules, birthdays, school information, reminders, weather, and shared tasks',
      'Founder briefing: priorities, meetings, decisions, risks, deadlines, and useful market context',
      'Business briefing: team priorities, KPIs, client updates, company announcements, and industry news',
      'Personal briefing: goals, routines, learning, fitness, career direction, and selected daily information'
    ].forEach(value => {
      const item = document.createElement('li');
      item.textContent = value;
      list.appendChild(item);
    });
    details.appendChild(list);
    return details;
  }

  function permanentCard({ label, title, text, details = null }) {
    const card = createCard({ audience: 'shared', label, title, text, cardClass: 'permanent-card' });
    if (details) card.appendChild(details);
    return card;
  }

  function renderPermanentSections() {
    document.getElementById('whyExistsCards')?.appendChild(permanentCard({
      label: 'the purpose',
      title: 'One private place that helps the distance feel smaller',
      text: 'We wanted one private place that feels more personal than a news app and more useful than a normal homepage. A place that helps us stay connected, understand what matters, and build something meaningful across the distance.'
    }));

    const visionRoot = document.getElementById('productVisionCards');
    if (visionRoot) {
      const card = permanentCard({
        label: 'working prototype',
        title: 'A personalized daily briefing built around the person opening it',
        text: 'This briefing is also a working prototype. The goal is to bring together the information, music, priorities, memories, and updates that matter without making someone search through five different apps.',
        details: productDetails()
      });
      const types = document.createElement('div');
      types.className = 'vision-types';
      ['Couples', 'Families', 'Founders', 'Businesses', 'Individuals'].forEach(value => {
        const chip = document.createElement('span');
        chip.textContent = value;
        types.appendChild(chip);
      });
      card.insertBefore(types, card.querySelector('.card-details'));
      visionRoot.appendChild(card);
    }

    const comingRoot = document.getElementById('comingSoonCards');
    if (comingRoot) {
      const card = permanentCard({
        label: 'secure backend required',
        title: 'Coming later: a briefing Crystal can shape directly',
        text: 'Once a secure backend is connected, Crystal can suggest ideas, react to sections, vote on songs, save memories, influence future briefings, and request corrections.'
      });
      const features = document.createElement('div');
      features.className = 'future-feature-list';
      ['Reactions', 'Song voting', 'Notes', 'Suggestions', 'Saved memories', 'Search', 'Shared checklists', 'Feedback', 'Private settings'].forEach(value => {
        const chip = document.createElement('span');
        chip.textContent = value;
        features.appendChild(chip);
      });
      const note = document.createElement('p');
      note.className = 'future-note';
      note.textContent = 'These are future directions, not active controls. The page remains a static prototype until server-side authentication and storage exist.';
      card.append(features, note);
      comingRoot.appendChild(card);
    }

    const prototypeRoot = document.getElementById('livingPrototypeCards');
    if (prototypeRoot) {
      const banner = document.createElement('article');
      banner.className = 'prototype-banner';
      const title = document.createElement('h3');
      title.textContent = 'You are watching this evolve in real time';
      const text = document.createElement('p');
      text.textContent = 'Every daily update, design improvement, music choice, and research upgrade is helping shape a future personalized briefing product.';
      banner.append(title, text);
      prototypeRoot.appendChild(banner);
    }
  }

  function updateNavigation() {
    const nav = document.querySelector('.brief-nav');
    if (!nav) return;
    [['#sinceYesterday', 'Since yesterday'], ['#memory', 'Memory'], ['#progress', 'Progress']].forEach(([href, label]) => {
      if (nav.querySelector(`a[href="${href}"]`)) return;
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      nav.appendChild(link);
    });
  }

  function simplifyQuestions() {
    const section = document.getElementById('questions');
    if (!section) return;
    section.querySelector('.daily-question-grid')?.remove();
    const intro = section.querySelector('.section-intro');
    if (intro) intro.textContent = 'One useful question at a time. Answer it in chat and tomorrow’s edition can use the response without collecting a full activity log.';
    const badge = section.querySelector('.section-audience');
    if (badge) badge.textContent = 'one easy answer';
  }

  function applyOrder() {
    const order = Array.isArray(brief.meta?.sectionOrder) ? brief.meta.sectionOrder : [];
    const sections = new Map([...host.querySelectorAll('.brief-section')].map(section => [section.dataset.section, section]));
    order.forEach(name => {
      const section = sections.get(name);
      if (section) host.appendChild(section);
    });
  }

  installStylesheet();
  [
    makeSection({ id: 'sinceYesterday', path: '~/brief/since-yesterday', title: 'SINCE YESTERDAY', badge: 'what changed', rootClass: 'since-grid' }),
    makeSection({ id: 'whatBuilt', path: '~/jay/what-changed', title: 'WHAT JAY BUILT', badge: 'plain language', badgeAudience: 'jay' }),
    makeSection({ id: 'behindBuild', path: '~/product/behind-the-build', title: 'BEHIND THE BUILD', badge: 'the human story', rootClass: 'build-story-grid' }),
    makeSection({ id: 'memory', path: '~/shared/memory', title: 'MEMORY OF THE DAY', badge: 'one moment' }),
    makeSection({ id: 'whyExists', path: '~/brief/purpose', title: 'WHY THIS EXISTS', badge: 'permanent', keepVisible: true }),
    makeSection({ id: 'productVision', path: '~/product/vision', title: 'WHAT THIS COULD BECOME', badge: 'working prototype', keepVisible: true }),
    makeSection({ id: 'progress', path: '~/shared/progress', title: 'PROGRESS TRACKER', badge: 'four areas', rootClass: 'progress-grid' }),
    makeSection({ id: 'nextSteps', path: '~/brief/next', title: 'WHAT’S NEXT', badge: 'keep it practical' }),
    makeSection({ id: 'comingSoon', path: '~/product/coming-soon', title: 'COMING SOON', badge: 'backend later', keepVisible: true }),
    makeSection({ id: 'livingPrototype', path: '~/product/live-prototype', title: 'LIVING PROTOTYPE', badge: 'building privately', keepVisible: true })
  ].forEach(section => host.appendChild(section));

  renderCards('sinceYesterday', brief.sinceYesterday, 'since-card');
  renderCards('whatBuilt', brief.whatJayBuilt);
  renderCards('behindBuild', brief.behindBuild);
  renderCards('memory', brief.memory);
  renderCards('progress', brief.progress, 'progress-card');
  renderCards('nextSteps', brief.nextSteps);
  renderPermanentSections();
  updateNavigation();
  simplifyQuestions();
  applyOrder();
})();
