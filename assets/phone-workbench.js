(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const PLANS = {
    US: { name: 'United States', calling: '1', min: 10, max: 10, trunk: '' },
    CA: { name: 'Canada', calling: '1', min: 10, max: 10, trunk: '' },
    GB: { name: 'United Kingdom', calling: '44', min: 9, max: 10, trunk: '0' },
    AU: { name: 'Australia', calling: '61', min: 9, max: 9, trunk: '0' },
    NZ: { name: 'New Zealand', calling: '64', min: 8, max: 10, trunk: '0' },
    IN: { name: 'India', calling: '91', min: 10, max: 10, trunk: '0' },
    BD: { name: 'Bangladesh', calling: '880', min: 9, max: 10, trunk: '0' },
    PK: { name: 'Pakistan', calling: '92', min: 10, max: 10, trunk: '0' },
    AE: { name: 'United Arab Emirates', calling: '971', min: 8, max: 9, trunk: '0' },
    DE: { name: 'Germany', calling: '49', min: 7, max: 12, trunk: '0' },
    FR: { name: 'France', calling: '33', min: 9, max: 9, trunk: '0' },
    ES: { name: 'Spain', calling: '34', min: 9, max: 9, trunk: '' },
    IT: { name: 'Italy', calling: '39', min: 6, max: 11, trunk: '' },
    MX: { name: 'Mexico', calling: '52', min: 10, max: 10, trunk: '' },
    BR: { name: 'Brazil', calling: '55', min: 10, max: 11, trunk: '0' },
    ZA: { name: 'South Africa', calling: '27', min: 9, max: 9, trunk: '0' },
    JP: { name: 'Japan', calling: '81', min: 9, max: 10, trunk: '0' },
    CN: { name: 'China', calling: '86', min: 10, max: 11, trunk: '0' }
  };

  const state = { current: null, observations: [], candidates: [] };
  const els = {
    session: $('#sessionId'),
    region: $('#defaultRegion'),
    input: $('#phoneNumber'),
    analyze: $('#analyzePhone'),
    reset: $('#resetPhone'),
    empty: $('#phoneEmpty'),
    result: $('#phoneResult'),
    e164: $('#outE164'),
    international: $('#outInternational'),
    national: $('#outNational'),
    country: $('#outCountry'),
    calling: $('#outCallingCode'),
    length: $('#outLength'),
    type: $('#outType'),
    timezone: $('#outTimezone'),
    badges: $('#phoneBadges'),
    pivots: $('#phonePivots'),
    pivotEmpty: $('#pivotEmpty'),
    blob: $('#phoneBlob'),
    extract: $('#extractPhones'),
    candidates: $('#phoneCandidates'),
    export: $('#exportPhone'),
    copy: $('#copyPhone'),
    clearLog: $('#clearPhoneLog'),
    json: $('#phoneJson'),
    osintTool: $('#osintTool'),
    searchTool: $('#searchTool'),
    resourcesTool: $('#resourcesTool'),
    toast: $('#toast')
  };

  init();

  function init() {
    els.session.textContent = randomId();
    populateRegions();
    els.analyze.addEventListener('click', analyze);
    els.reset.addEventListener('click', reset);
    els.input.addEventListener('keydown', (event) => { if (event.key === 'Enter') analyze(); });
    els.extract.addEventListener('click', extractPhones);
    els.export.addEventListener('click', exportJson);
    els.copy.addEventListener('click', () => copyText(JSON.stringify(payload(), null, 2), 'Phone session JSON copied.'));
    els.clearLog.addEventListener('click', clearLog);

    const requested = (new URLSearchParams(window.location.search).get('n') || '').slice(0, 80);
    if (requested) {
      els.input.value = requested;
      analyze();
    }
    render();
  }

  function populateRegions() {
    Object.entries(PLANS).forEach(([code, plan]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = `${plan.name} (+${plan.calling})`;
      if (code === 'US') option.selected = true;
      els.region.appendChild(option);
    });
  }

  function analyze() {
    const raw = els.input.value.trim();
    if (!raw) return toast('Enter a phone number.');
    const parsed = parseNumber(raw, els.region.value);
    if (!parsed.ok) return toast(parsed.error);
    state.current = parsed.value;
    addObservation('analysis', parsed.value.e164, 'CMX local normalizer', parsed.value.note);
    render();
    toast('Phone number normalized locally.');
  }

  function parseNumber(raw, defaultRegion) {
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) return { ok: false, error: 'Use a number containing 7 to 15 digits.' };

    let region = defaultRegion;
    let plan = PLANS[region];
    let national = digits;
    let calling = plan.calling;
    let source = 'default region';

    if (raw.trim().startsWith('+')) {
      const match = matchCallingCode(digits);
      if (!match) return { ok: false, error: 'The international calling code is not in the current local plan list.' };
      calling = match.calling;
      region = match.region;
      plan = match.plan;
      national = digits.slice(calling.length);
      source = 'international calling code';
    } else {
      if (calling === '1' && national.length === 11 && national.startsWith('1')) national = national.slice(1);
      else if (plan.trunk && national.startsWith(plan.trunk)) national = national.slice(plan.trunk.length);
    }

    if (!national || national.length < plan.min || national.length > plan.max) {
      return { ok: false, error: `The normalized national number has ${national.length} digits. ${plan.name} is expected to use approximately ${plan.min}${plan.min === plan.max ? '' : ` to ${plan.max}`} digits in this local ruleset.` };
    }

    const e164 = `+${calling}${national}`;
    const country = calling === '1' ? 'North American Numbering Plan (+1), country unresolved' : `${plan.name} (+${calling})`;
    const confidence = calling === '1' ? 'Medium' : 'High';
    return {
      ok: true,
      value: {
        input: raw,
        region,
        country,
        callingCode: `+${calling}`,
        nationalNumber: national,
        e164,
        international: formatInternational(calling, national),
        nationalDisplay: formatNational(calling, national),
        digitCount: national.length,
        confidence,
        inferredFrom: source,
        type: 'Not inferred in static mode',
        timezone: 'Not inferred from country code',
        analyzedAt: new Date().toISOString(),
        note: `Formatting is based on a bounded local country-code ruleset and ${source}. It does not confirm assignment, carrier, subscriber, line type, reachability, or precise location.`
      }
    };
  }

  function matchCallingCode(digits) {
    const candidates = Object.entries(PLANS)
      .sort((a, b) => b[1].calling.length - a[1].calling.length)
      .filter(([, plan]) => digits.startsWith(plan.calling));
    if (!candidates.length) return null;
    const [region, plan] = candidates[0];
    return { region, plan, calling: plan.calling };
  }

  function formatInternational(calling, national) {
    if (calling === '1' && national.length === 10) return `+1 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
    return `+${calling} ${groupDigits(national)}`;
  }

  function formatNational(calling, national) {
    if (calling === '1' && national.length === 10) return `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
    return groupDigits(national);
  }

  function groupDigits(value) {
    const groups = [];
    let cursor = 0;
    const remainder = value.length % 3;
    if (remainder) {
      groups.push(value.slice(0, remainder));
      cursor = remainder;
    }
    while (cursor < value.length) {
      groups.push(value.slice(cursor, cursor + 3));
      cursor += 3;
    }
    return groups.join(' ');
  }

  function render() {
    const current = state.current;
    els.empty.classList.toggle('phone-hidden', Boolean(current));
    els.result.classList.toggle('phone-hidden', !current);
    els.pivotEmpty.classList.toggle('phone-hidden', Boolean(current));
    els.pivots.replaceChildren();
    els.badges.replaceChildren();

    if (current) {
      els.e164.textContent = current.e164;
      els.international.textContent = current.international;
      els.national.textContent = current.nationalDisplay;
      els.country.textContent = current.country;
      els.calling.textContent = current.callingCode;
      els.length.textContent = `${current.digitCount} national digits`;
      els.type.textContent = current.type;
      els.timezone.textContent = current.timezone;
      addBadge(current.confidence === 'High' ? 'good' : 'warn', `${current.confidence} formatting confidence`);
      addBadge('warn', 'Assignment not verified');
      addBadge('warn', 'Carrier not inferred');
      renderPivots(buildPivots(current));
    }

    updateLinks();
    els.json.textContent = JSON.stringify(payload(), null, 2);
  }

  function addBadge(tone, text) {
    const badge = document.createElement('span');
    badge.className = `phone-badge ${tone}`;
    badge.textContent = text;
    els.badges.appendChild(badge);
  }

  function buildPivots(current) {
    const exact = `"${current.e164}"`;
    return [
      pivot('Analyze in CMX OSINT', 'CMX', 'Continue as a normalized phone entity.', `/osint?type=phone&entity=${encodeURIComponent(current.e164)}`, false),
      pivot('Search exact number', 'Google', 'Find public exact-string mentions.', `https://www.google.com/search?q=${encodeURIComponent(exact)}`, true),
      pivot('Search exact number', 'Bing', 'Compare another public index.', `https://www.bing.com/search?q=${encodeURIComponent(exact)}`, true),
      pivot('Search exact number', 'DuckDuckGo', 'Compare another public index.', `https://duckduckgo.com/?q=${encodeURIComponent(exact)}`, true),
      pivot('Open WhatsApp chat', 'WhatsApp', 'Check whether the normalized number can be opened in WhatsApp. This may disclose the number to Meta.', `https://wa.me/${current.e164.replace(/\D/g, '')}`, true),
      pivot('Call on this device', 'Device', 'Open the local dialer. No web search is performed.', `tel:${current.e164}`, false),
      pivot('Text on this device', 'Device', 'Open the local messaging app. No web search is performed.', `sms:${current.e164}`, false)
    ];
  }

  function pivot(title, provider, purpose, url, disclosure) {
    return { title, provider, purpose, url, disclosure };
  }

  function renderPivots(items) {
    items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'phone-pivot';
      const title = document.createElement('h3');
      title.textContent = item.title;
      const provider = document.createElement('span');
      provider.className = `phone-badge ${item.disclosure ? 'warn' : 'good'}`;
      provider.textContent = `${item.provider} · ${item.disclosure ? 'discloses number' : 'local or internal'}`;
      const copy = document.createElement('p');
      copy.textContent = item.purpose;
      const actions = document.createElement('div');
      actions.className = 'phone-pivot-actions';
      const open = document.createElement('a');
      open.className = 'cmx-mini-button open';
      open.textContent = 'Open';
      open.href = item.url;
      if (/^https?:/i.test(item.url)) {
        open.target = '_blank';
        open.rel = 'noopener noreferrer';
      }
      const save = miniButton('Save', () => {
        addObservation('pivot', state.current.e164, item.provider, `${item.title}: ${item.purpose} ${new URL(item.url, window.location.href).href}`);
        toast('Pivot saved to the session log.');
      });
      actions.append(open, save);
      card.append(title, provider, copy, actions);
      els.pivots.appendChild(card);
    });
  }

  function extractPhones() {
    const text = els.blob.value.slice(0, 20000);
    if (!text.trim()) return toast('Paste text containing phone numbers.');
    const values = text.match(/\+?\d[\d\s().-]{5,}\d/g) || [];
    const unique = new Map();
    values.forEach((value) => {
      const cleaned = value.trim().replace(/[),.;]+$/, '');
      const digits = cleaned.replace(/\D/g, '');
      if (digits.length >= 7 && digits.length <= 15) unique.set(cleaned, cleaned);
    });
    state.candidates = [...unique.values()].slice(0, 100);
    renderCandidates();
    toast(`${state.candidates.length} candidate number${state.candidates.length === 1 ? '' : 's'} found.`);
  }

  function renderCandidates() {
    els.candidates.replaceChildren();
    if (!state.candidates.length) {
      const empty = document.createElement('div');
      empty.className = 'cmx-empty';
      empty.textContent = 'No candidate numbers found.';
      els.candidates.appendChild(empty);
      return;
    }
    state.candidates.forEach((value) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'phone-candidate';
      button.textContent = value;
      button.addEventListener('click', () => {
        els.input.value = value;
        analyze();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      els.candidates.appendChild(button);
    });
  }

  function addObservation(kind, value, source, note) {
    state.observations.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : randomId(),
      timestamp: new Date().toISOString(),
      kind,
      value,
      source,
      note
    });
    state.observations = state.observations.slice(0, 200);
  }

  function clearLog() {
    if (!state.observations.length) return;
    if (!window.confirm('Clear the phone session observation log?')) return;
    state.observations = [];
    render();
    toast('Phone session log cleared.');
  }

  function payload() {
    return {
      schema: 'cmx-phone-session-v1',
      exportedAt: new Date().toISOString(),
      sessionId: els.session.textContent,
      phone: state.current,
      observations: state.observations
    };
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(payload(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const name = state.current?.e164.replace(/\D/g, '') || 'session';
    link.href = url;
    link.download = `cmx-phone-${name}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast('Phone session JSON exported.');
  }

  function updateLinks() {
    const value = state.current?.e164 || '';
    els.osintTool.href = value ? `/osint?type=phone&entity=${encodeURIComponent(value)}` : '/osint';
    els.searchTool.href = value ? `/search?type=phone&entity=${encodeURIComponent(value)}` : '/search';
    els.resourcesTool.href = '/resources';
  }

  function reset() {
    els.input.value = '';
    els.blob.value = '';
    state.current = null;
    state.candidates = [];
    renderCandidates();
    render();
    els.input.focus();
  }

  function miniButton(label, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cmx-mini-button';
    button.textContent = label;
    button.addEventListener('click', action);
    return button;
  }

  async function copyText(text, success) {
    try {
      await navigator.clipboard.writeText(text);
      toast(success);
    } catch {
      toast('Clipboard access is unavailable.');
    }
  }

  function randomId() {
    return crypto.getRandomValues(new Uint32Array(2)).reduce((value, number) => value + number.toString(36), '').slice(0, 10).toUpperCase();
  }

  let toastTimer;
  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2200);
  }
})();
