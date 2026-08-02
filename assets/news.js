(() => {
  'use strict';

  const brief = window.CMX_NEWS_BRIEF || {};
  const byId = id => document.getElementById(id);
  const audienceClass = audience => audience === 'jay' ? 'card-jay' : audience === 'crystal' ? 'card-crystal' : 'card-shared';

  function setText(id, value) {
    const node = byId(id);
    if (node && value !== undefined && value !== null) node.textContent = value;
  }

  function sorted(items) {
    return [...(Array.isArray(items) ? items : [])].sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));
  }

  function addDirectLines(parent, lines) {
    (Array.isArray(lines) ? lines : []).forEach(line => {
      const node = document.createElement('p');
      node.className = `direct-line direct-${line.audience || 'shared'}`;
      node.textContent = line.text || '';
      parent.appendChild(node);
    });
  }

  function addLink(parent, item) {
    if (!item.url) return;
    const link = document.createElement('a');
    link.className = 'card-link';
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = item.linkLabel || 'open source';
    parent.appendChild(link);
  }

  function addRichDetails(parent, item) {
    const hasDetails = Boolean(
      item.whyItMatters ||
      item.watchNext ||
      (Array.isArray(item.details) && item.details.length) ||
      (Array.isArray(item.sources) && item.sources.length)
    );
    if (!hasDetails) return;

    const details = document.createElement('details');
    details.className = 'card-details';

    const summary = document.createElement('summary');
    summary.textContent = item.detailsLabel || 'More context';
    details.appendChild(summary);

    const addBlock = (title, value) => {
      if (!value) return;
      const block = document.createElement('div');
      block.className = 'detail-block';
      const heading = document.createElement('strong');
      heading.textContent = title;
      const text = document.createElement('p');
      text.textContent = value;
      block.append(heading, text);
      details.appendChild(block);
    };

    addBlock('Why it matters', item.whyItMatters);
    addBlock('What to watch next', item.watchNext);

    if (Array.isArray(item.details) && item.details.length) {
      const block = document.createElement('div');
      block.className = 'detail-block';
      const heading = document.createElement('strong');
      heading.textContent = 'Details';
      const list = document.createElement('ul');
      item.details.forEach(value => {
        const row = document.createElement('li');
        row.textContent = value;
        list.appendChild(row);
      });
      block.append(heading, list);
      details.appendChild(block);
    }

    if (Array.isArray(item.sources) && item.sources.length) {
      const block = document.createElement('div');
      block.className = 'detail-block';
      const heading = document.createElement('strong');
      heading.textContent = 'Sources';
      const list = document.createElement('div');
      list.className = 'source-list';

      item.sources.forEach(source => {
        if (!source?.url) return;
        const link = document.createElement('a');
        link.href = source.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = [source.label || 'open source', source.published].filter(Boolean).join(' · ');
        list.appendChild(link);
      });

      block.append(heading, list);
      details.appendChild(block);
    }

    parent.appendChild(details);
  }

  function createCard(item, baseClass = 'brief-card') {
    const card = document.createElement('article');
    card.className = `${baseClass} ${audienceClass(item.audience)}`;

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
    addLink(card, item);
    addRichDetails(card, item);
    return card;
  }

  function renderCards(id, items, baseClass = 'brief-card') {
    const root = byId(id);
    const section = root?.closest('.brief-section');
    const values = sorted(items);
    if (!root) return;

    if (!values.length) {
      if (section && section.dataset.keepVisible !== 'true') section.hidden = true;
      return;
    }

    root.replaceChildren(...values.map(item => createCard(item, baseClass)));
  }

  function renderStories(id, items) {
    const root = byId(id);
    const section = root?.closest('.brief-section');
    const values = sorted(items);
    if (!root) return;

    if (!values.length) {
      if (section && section.dataset.keepVisible !== 'true') section.hidden = true;
      return;
    }

    root.replaceChildren(...values.map((item, index) => {
      const story = document.createElement('article');
      story.className = `story-card ${audienceClass(item.audience)}`;

      const number = document.createElement('span');
      number.className = 'story-number';
      number.textContent = String(index + 1).padStart(2, '0');

      const body = document.createElement('div');
      const meta = document.createElement('div');
      meta.className = 'story-topline';

      const label = document.createElement('p');
      label.className = 'story-meta';
      label.textContent = [item.label, item.published].filter(Boolean).join(' · ') || 'news desk';
      meta.appendChild(label);

      if (item.status) {
        const status = document.createElement('span');
        status.className = `content-status status-${String(item.status).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        status.textContent = item.status;
        meta.appendChild(status);
      }

      const title = document.createElement('h3');
      title.textContent = item.title || 'Current development';

      const text = document.createElement('p');
      text.className = 'card-copy';
      text.textContent = item.text || '';

      body.append(meta, title, text);

      if (Array.isArray(item.items) && item.items.length) {
        const list = document.createElement('ul');
        list.className = 'card-list';
        item.items.forEach(value => {
          const row = document.createElement('li');
          row.textContent = value;
          list.appendChild(row);
        });
        body.appendChild(list);
      }

      addDirectLines(body, item.directLines);
      addLink(body, item);
      addRichDetails(body, item);
      story.append(number, body);
      return story;
    }));
  }

  function renderQuote(quote) {
    const section = byId('dailyQuote')?.closest('.brief-section');
    if (!quote?.text) {
      if (section) section.hidden = true;
      return;
    }

    setText('quoteKicker', quote.kicker || 'one thought worth keeping');
    setText('dailyQuote', quote.text);
    setText('quoteSource', quote.source || 'Daily briefing');
    setText('quoteReflection', quote.reflection || '');

    const reflection = byId('quoteReflection');
    if (reflection) reflection.hidden = !quote.reflection;
  }

  function renderQuestions(items) {
    const root = byId('questionList');
    const values = Array.isArray(items) ? items : [];
    if (!root) return;

    if (!values.length) {
      root.hidden = true;
      return;
    }

    root.hidden = false;
    root.replaceChildren(...values.map((value, index) => {
      const item = document.createElement('article');
      item.className = 'question-item card-shared';

      const number = document.createElement('span');
      number.textContent = String(index + 1).padStart(2, '0');

      const text = document.createElement('p');
      text.textContent = value;

      item.append(number, text);
      return item;
    }));
  }

  function renderTimes() {
    const zones = [
      ['brooklynTime', 'brooklynDate', 'America/New_York'],
      ['waikatoTime', 'waikatoDate', 'Pacific/Auckland']
    ];

    const update = () => {
      const now = new Date();

      zones.forEach(([timeId, dateId, timeZone]) => {
        setText(timeId, new Intl.DateTimeFormat('en-US', {
          timeZone,
          hour: 'numeric',
          minute: '2-digit'
        }).format(now));

        setText(dateId, new Intl.DateTimeFormat('en-US', {
          timeZone,
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }).format(now));
      });

      const brooklynHour = Number(new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        hour12: false
      }).format(now));

      const waikatoHour = Number(new Intl.DateTimeFormat('en-US', {
        timeZone: 'Pacific/Auckland',
        hour: 'numeric',
        hour12: false
      }).format(now));

      const daypart = hour => hour < 5 ? 'late night' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 22 ? 'evening' : 'late night';
      setText('greetingLine', `${daypart(brooklynHour)} in Brooklyn · ${daypart(waikatoHour)} in Waikato`);
    };

    update();
    window.setInterval(update, 30000);
  }

  function applySectionOrder(order) {
    const host = byId('briefContent');
    if (!host || !Array.isArray(order)) return;

    const sections = new Map([...host.querySelectorAll('.brief-section')].map(section => [section.dataset.section, section]));
    order.forEach(name => {
      const section = sections.get(name);
      if (section) host.appendChild(section);
    });
  }

  function setupCommands() {
    const form = byId('commandForm');
    const input = byId('commandInput');
    const output = byId('commandOutput');
    if (!form || !input || !output) return;

    const available = () => [...document.querySelectorAll('.brief-section:not([hidden])')].map(section => section.dataset.section);

    form.addEventListener('submit', event => {
      event.preventDefault();

      const command = input.value.trim().toLowerCase();
      input.value = '';

      if (command === 'help') {
        output.textContent = `commands: top, ${available().join(', ')}, clear`;
        return;
      }

      if (command === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        output.textContent = 'opening top of briefing';
        return;
      }

      if (command === 'clear') {
        output.textContent = '';
        return;
      }

      const target = document.querySelector(`[data-section="${CSS.escape(command)}"]`);
      if (target && !target.hidden) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        output.textContent = `opening ${command}`;
        return;
      }

      if (command) output.textContent = `unknown command: ${command}. type help`;
    });
  }

  function render() {
    setText('briefStatus', brief.meta?.status || 'daily edition');
    setText('briefDate', brief.meta?.date || 'Current briefing');
    setText('briefSummary', brief.meta?.summary || 'A shared briefing for Jay and Crystal.');
    setText('generatedLine', brief.meta?.generated || 'Generated for today');

    renderCards('priorityCards', brief.priority, 'priority-card');
    renderCards('openingCards', brief.opening);
    renderCards('activityCards', brief.activity);
    renderCards('crystalCards', brief.crystal);
    renderCards('weatherCards', brief.weather, 'city-card');
    renderCards('styleCards', brief.style);
    renderCards('spotifyCards', brief.spotify);
    renderCards('localNewsCards', brief.localNews, 'city-card');
    renderStories('worldCards', brief.world);
    renderStories('cultureCards', brief.culture);
    renderCards('horoscopeCards', brief.horoscope, 'pair-card');
    renderCards('relationshipCards', brief.relationship);
    renderCards('timelineCards', brief.timeline);
    renderQuote(brief.quote);
    renderQuestions(brief.questions);
    applySectionOrder(brief.meta?.sectionOrder);
    renderTimes();
    setupCommands();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})();
