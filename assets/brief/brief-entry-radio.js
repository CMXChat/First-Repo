(() => {
  'use strict';

  const select = document.getElementById('profileSelect');
  const enter = document.getElementById('enterBrief');
  const originalField = select?.closest('.profile-field');
  if (!select || !enter || !originalField || document.getElementById('briefEntryRadio')) return;

  const copy = {
    individual: {
      title: 'Personal briefing',
      text: 'Priorities, learning, daily intelligence and a private command center.'
    },
    couple: {
      title: 'Relationship briefing',
      text: 'Two private profiles, one approved shared space and today’s shared watch.'
    },
    partners: {
      title: 'Business briefing',
      text: 'Partner-private dashboards, operations, projects, markets and finance.'
    },
    trainer: {
      title: 'Trainer + student',
      text: 'Training plans, habits, progression, check-ins and accountability.'
    }
  };

  const group = document.createElement('fieldset');
  group.id = 'briefEntryRadio';
  group.className = 'brief-entry-radio';

  const legend = document.createElement('legend');
  legend.textContent = 'Choose a briefing';
  group.appendChild(legend);

  const grid = document.createElement('div');
  grid.className = 'brief-entry-radio-grid';
  group.appendChild(grid);

  const options = [...select.options].filter(option => option.value && copy[option.value]);
  const items = options.map(option => {
    const label = document.createElement('label');
    label.className = `brief-entry-radio-card is-${option.value}`;

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'briefEntryType';
    input.value = option.value;
    input.autocomplete = 'off';

    const marker = document.createElement('span');
    marker.className = 'brief-entry-radio-marker';
    marker.setAttribute('aria-hidden', 'true');

    const body = document.createElement('span');
    body.className = 'brief-entry-radio-copy';

    const title = document.createElement('strong');
    title.textContent = copy[option.value].title;

    const description = document.createElement('small');
    description.textContent = copy[option.value].text;

    body.append(title, description);
    label.append(input, marker, body);
    grid.appendChild(label);
    return { input, label };
  });

  const radios = items.map(item => item.input);

  originalField.insertAdjacentElement('afterend', group);
  originalField.classList.add('brief-native-entry-field');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');
  document.body.classList.add('has-entry-radio');

  const note = document.getElementById('gateSelectionNote');
  if (note) group.appendChild(note);

  function syncVisual(value) {
    items.forEach(item => item.label.classList.toggle('is-selected', item.input.value === value));
  }

  function selectBriefing(radio) {
    if (!radio?.checked) return;

    select.value = radio.value;
    select.dataset.userSelection = radio.value;
    syncVisual(radio.value);
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));

    const label = copy[radio.value]?.title || 'Briefing';
    if (note) note.textContent = `${label} selected. Choose any entry preferences, then press Open this briefing.`;
  }

  radios.forEach(radio => radio.addEventListener('change', () => selectBriefing(radio)));

  select.addEventListener('change', () => {
    const matching = radios.find(radio => radio.value === select.value);
    if (matching && !matching.checked) matching.checked = true;
    syncVisual(select.value);
  });

  enter.addEventListener('click', () => {
    if (!select.value && note) note.textContent = 'Choose one briefing before continuing.';
  }, true);
})();
