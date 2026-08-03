(() => {
  'use strict';

  const brief = window.CMX_NEWS_BRIEF || {};
  const header = document.querySelector('.brief-header');
  const host = document.getElementById('briefContent');
  if (!header || !host || document.getElementById('newsExperienceBar')) return;

  const editionKey = String(brief.meta?.date || new Date().toISOString().slice(0, 10))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  const storagePrefix = `cmx-news:${editionKey}`;
  const productSections = ['whatBuilt', 'behindBuild', 'whyExists', 'productVision', 'comingSoon', 'livingPrototype'];
  let narrationActive = false;
  let narrationRestoreVolume = null;

  function installStylesheet() {
    if (document.querySelector('link[href^="/assets/news-experience.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/assets/news-experience.css?v=${Date.now()}`;
    document.head.appendChild(link);
  }

  function readStorage(key, fallback = null) {
    try {
      const value = window.localStorage.getItem(`${storagePrefix}:${key}`);
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(`${storagePrefix}:${key}`, value);
    } catch {}
  }

  function actionId(text, index) {
    let hash = 2166136261;
    const input = `${index}:${text}`;
    for (let i = 0; i < input.length; i += 1) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return `action-${(hash >>> 0).toString(36)}`;
  }

  function completedActions() {
    try {
      return new Set(JSON.parse(readStorage('completed-actions', '[]')));
    } catch {
      return new Set();
    }
  }

  function saveCompleted(values) {
    writeStorage('completed-actions', JSON.stringify([...values]));
  }

  function showToast(message) {
    let toast = document.getElementById('newsExperienceToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'newsExperienceToast';
      toast.className = 'news-experience-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function nextStepItems() {
    const source = Array.isArray(brief.nextSteps) ? brief.nextSteps[0] : null;
    return Array.isArray(source?.items) ? source.items.filter(Boolean) : [];
  }

  function buildExperienceBar() {
    const bar = document.createElement('div');
    bar.id = 'newsExperienceBar';
    bar.className = 'news-experience-bar';
    bar.innerHTML = `
      <div class="news-experience-label">
        <span>BRIEF CONTROLS</span>
        <strong>Choose how much of today you want</strong>
      </div>
      <div class="news-experience-actions">
        <button id="newsPersonalView" class="news-experience-button" type="button" aria-pressed="false">Personal view</button>
        <button id="newsReadBrief" class="news-experience-button" type="button" aria-pressed="false">Read quick brief</button>
        <button id="newsJumpNext" class="news-experience-button is-primary" type="button">Next move</button>
      </div>
    `;

    const key = header.querySelector('.audience-key');
    if (key) key.insertAdjacentElement('afterend', bar);
    else header.prepend(bar);
    return bar;
  }

  function buildNextUp() {
    const actions = nextStepItems();
    const panel = document.createElement('aside');
    panel.id = 'newsNextUp';
    panel.className = 'news-next-up';
    panel.setAttribute('aria-labelledby', 'newsNextUpTitle');
    panel.innerHTML = `
      <div class="news-next-up-copy">
        <div class="news-next-up-topline"><span>NEXT UP</span><small>saved on this device</small></div>
        <h2 id="newsNextUpTitle">${actions[0] || 'Choose one honest action'}</h2>
        <p id="newsNextUpNote">The briefing can organize the day. The next useful move still has to leave the screen.</p>
      </div>
      <div class="news-next-up-side">
        <div id="newsNextUpPrep" class="news-next-up-prep"></div>
        <button id="newsOpenActions" class="news-next-up-link" type="button">Open today’s actions →</button>
      </div>
    `;

    const locations = header.querySelector('.live-location-grid');
    if (locations) locations.insertAdjacentElement('afterend', panel);
    else header.appendChild(panel);
    return panel;
  }

  function buildKnowledgeStrip() {
    const strip = document.createElement('section');
    strip.className = 'news-knowledge-strip';
    strip.setAttribute('aria-label', 'What this briefing knows');
    strip.innerHTML = `
      <article class="news-knowledge-item card-jay">
        <span>SELF-REPORTED</span>
        <strong>Jay’s check-in</strong>
        <p>Personal updates come from what Jay directly shared today.</p>
      </article>
      <article class="news-knowledge-item card-shared">
        <span>RESEARCHED</span>
        <strong>Weather and public stories</strong>
        <p>Current information keeps its sources and legal stage where relevant.</p>
      </article>
      <article class="news-knowledge-item card-crystal">
        <span>WAITING ON</span>
        <strong>Crystal’s own words</strong>
        <p>Her paragraphs can correct assumptions and shape future editions.</p>
      </article>
    `;

    const panel = document.getElementById('newsNextUp');
    if (panel) panel.insertAdjacentElement('afterend', strip);
    else header.appendChild(strip);
    return strip;
  }

  function setPersonalView(enabled) {
    document.body.classList.toggle('news-personal-view', enabled);
    const button = document.getElementById('newsPersonalView');
    if (button) {
      button.setAttribute('aria-pressed', String(enabled));
      button.textContent = enabled ? 'Show build notes' : 'Personal view';
      button.classList.toggle('is-active', enabled);
    }
    productSections.forEach(id => {
      const section = document.getElementById(id);
      if (section) section.setAttribute('aria-hidden', String(enabled));
    });
    writeStorage('personal-view', String(enabled));
  }

  function narrationText() {
    const pieces = [];
    if (brief.meta?.summary) pieces.push(brief.meta.summary);
    const priority = Array.isArray(brief.priority) ? brief.priority[0] : null;
    if (priority?.title) pieces.push(priority.title);
    if (priority?.text) pieces.push(priority.text);
    const activity = Array.isArray(brief.activity) ? brief.activity[0] : null;
    if (activity?.title) pieces.push(activity.title);
    if (activity?.text) pieces.push(activity.text);
    const relationship = Array.isArray(brief.relationship) ? brief.relationship[0] : null;
    if (relationship?.title) pieces.push(relationship.title);
    if (relationship?.text) pieces.push(relationship.text);
    const next = nextStepItems()[0];
    if (next) pieces.push(`Next move: ${next}.`);
    return pieces.join(' ').slice(0, 1100);
  }

  function finishNarration() {
    narrationActive = false;
    const button = document.getElementById('newsReadBrief');
    if (button) {
      button.textContent = 'Read quick brief';
      button.setAttribute('aria-pressed', 'false');
      button.classList.remove('is-active');
    }
    const audio = document.getElementById('newsDailyAudio');
    if (audio && narrationRestoreVolume !== null) {
      audio.volume = narrationRestoreVolume;
      narrationRestoreVolume = null;
    }
  }

  function toggleNarration() {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance !== 'function') {
      showToast('Read aloud is not supported by this browser.');
      return;
    }

    if (narrationActive) {
      window.speechSynthesis.cancel();
      finishNarration();
      return;
    }

    const text = narrationText();
    if (!text) {
      showToast('There is no quick brief available to read yet.');
      return;
    }

    const audio = document.getElementById('newsDailyAudio');
    if (audio) {
      narrationRestoreVolume = audio.volume;
      audio.volume = Math.min(audio.volume, 0.07);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.94;
    utterance.pitch = 1;
    utterance.onend = finishNarration;
    utterance.onerror = finishNarration;
    narrationActive = true;

    const button = document.getElementById('newsReadBrief');
    if (button) {
      button.textContent = 'Stop reading';
      button.setAttribute('aria-pressed', 'true');
      button.classList.add('is-active');
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function actionRows() {
    return [...document.querySelectorAll('#nextStepsCards .card-list li')];
  }

  function updateActionUi() {
    const completed = completedActions();
    const rows = actionRows();
    rows.forEach((row, index) => {
      const button = row.querySelector('.news-action-toggle');
      if (!button) return;
      const id = button.dataset.actionId || actionId(button.dataset.actionText || '', index);
      const done = completed.has(id);
      row.classList.toggle('is-complete', done);
      button.setAttribute('aria-pressed', String(done));
      const check = button.querySelector('.news-action-check');
      if (check) check.textContent = done ? '✓' : '';
    });

    const badge = document.querySelector('#nextSteps .section-audience');
    if (badge && rows.length) badge.textContent = `${completed.size}/${rows.length} done`;
    updateNextUp();
  }

  function updateNextUp() {
    const rows = actionRows();
    const completed = completedActions();
    const actions = rows.map((row, index) => {
      const button = row.querySelector('.news-action-toggle');
      return {
        id: button?.dataset.actionId || actionId(button?.dataset.actionText || row.textContent || '', index),
        text: button?.dataset.actionText || row.textContent?.trim() || ''
      };
    }).filter(item => item.text);

    const next = actions.find(item => !completed.has(item.id));
    const title = document.getElementById('newsNextUpTitle');
    const note = document.getElementById('newsNextUpNote');
    if (title) title.textContent = next?.text || (actions.length ? 'Today’s listed actions are complete' : 'Choose one honest action');
    if (note) note.textContent = next
      ? 'One visible completion is enough to change the shape of the day.'
      : actions.length
        ? 'The page saved the completed state on this device.'
        : 'The briefing can organize the day. The next useful move still has to leave the screen.';

    const prep = document.getElementById('newsNextUpPrep');
    if (prep) {
      prep.replaceChildren(...actions.slice(0, 3).map(item => {
        const chip = document.createElement('span');
        chip.className = completed.has(item.id) ? 'is-complete' : '';
        chip.textContent = item.text;
        return chip;
      }));
    }
  }

  function enhanceActions() {
    const rows = actionRows();
    if (!rows.length) return;
    rows.forEach((row, index) => {
      if (row.querySelector('.news-action-toggle')) return;
      const text = row.textContent.trim();
      const id = actionId(text, index);
      row.textContent = '';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'news-action-toggle';
      button.dataset.actionId = id;
      button.dataset.actionText = text;
      button.setAttribute('aria-pressed', 'false');
      const check = document.createElement('span');
      check.className = 'news-action-check';
      check.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.textContent = text;
      button.append(check, label);
      row.appendChild(button);
      button.addEventListener('click', () => {
        const completed = completedActions();
        if (completed.has(id)) completed.delete(id);
        else completed.add(id);
        saveCompleted(completed);
        updateActionUi();
        showToast(completed.has(id) ? 'Marked complete on this device.' : 'Moved back to active.');
      });
    });
    updateActionUi();
  }

  function bindControls() {
    document.getElementById('newsPersonalView')?.addEventListener('click', () => {
      const enabled = !document.body.classList.contains('news-personal-view');
      setPersonalView(enabled);
      showToast(enabled ? 'Build and product notes are hidden.' : 'The full briefing is visible.');
    });
    document.getElementById('newsReadBrief')?.addEventListener('click', toggleNarration);
    const openActions = () => document.getElementById('nextSteps')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('newsJumpNext')?.addEventListener('click', openActions);
    document.getElementById('newsOpenActions')?.addEventListener('click', openActions);
    window.addEventListener('beforeunload', () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    });
  }

  installStylesheet();
  buildExperienceBar();
  buildNextUp();
  buildKnowledgeStrip();
  enhanceActions();
  bindControls();
  setPersonalView(readStorage('personal-view', 'false') === 'true');
  updateNextUp();
})();
