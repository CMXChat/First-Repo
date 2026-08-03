(() => {
  'use strict';

  const select = document.getElementById('profileSelect');
  if (!select || document.getElementById('briefEntryDropdown')) return;

  const field = select.closest('.profile-field');
  if (!field) return;

  const options = [...select.options].filter(option => option.value);
  const wrapper = document.createElement('div');
  wrapper.id = 'briefEntryDropdown';
  wrapper.className = 'brief-entry-dropdown';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'brief-entry-trigger';
  trigger.id = 'briefEntryTrigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'briefEntryList');
  trigger.innerHTML = '<span>Choose the briefing you want to explore</span><i aria-hidden="true"></i>';

  const list = document.createElement('div');
  list.id = 'briefEntryList';
  list.className = 'brief-entry-list';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Briefing type');
  list.hidden = true;

  const labels = {
    individual: ['Personal briefing', 'One private view for priorities, learning and daily intelligence'],
    couple: ['Relationship briefing', 'Two private profiles and one approved shared space'],
    partners: ['Business briefing', 'Partner-private dashboards and an approved operating view'],
    trainer: ['Trainer + student', 'Habits, progression, accountability and coaching notes']
  };

  const buttons = options.map((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'brief-entry-option';
    button.dataset.value = option.value;
    button.id = `briefEntryOption${index}`;
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', 'false');
    button.tabIndex = -1;
    const copy = labels[option.value] || [option.textContent, ''];
    button.innerHTML = `<strong>${copy[0]}</strong><small>${copy[1]}</small>`;
    list.appendChild(button);
    return button;
  });

  wrapper.append(trigger, list);
  select.insertAdjacentElement('afterend', wrapper);
  select.classList.add('brief-native-select-fallback');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');

  let activeIndex = -1;

  const open = (focusIndex = activeIndex >= 0 ? activeIndex : 0) => {
    list.hidden = false;
    wrapper.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    activeIndex = Math.max(0, Math.min(buttons.length - 1, focusIndex));
    buttons[activeIndex]?.focus({ preventScroll: true });
  };

  const close = (returnFocus = false) => {
    list.hidden = true;
    wrapper.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus({ preventScroll: true });
  };

  const choose = button => {
    const value = button?.dataset.value || '';
    const option = options.find(item => item.value === value);
    if (!option) return;

    select.value = value;
    select.dataset.userSelection = value;
    trigger.querySelector('span').textContent = option.textContent;
    trigger.classList.add('has-value');
    buttons.forEach((item, index) => {
      const selected = item === button;
      item.setAttribute('aria-selected', String(selected));
      if (selected) activeIndex = index;
    });

    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    close(true);
  };

  trigger.addEventListener('click', () => {
    if (list.hidden) open();
    else close(true);
  });

  trigger.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      open(event.key === 'ArrowUp' ? buttons.length - 1 : activeIndex);
    }
  });

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => choose(button));
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        activeIndex = (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
        buttons[activeIndex].focus({ preventScroll: true });
      } else if (event.key === 'Home') {
        event.preventDefault();
        activeIndex = 0;
        buttons[0].focus({ preventScroll: true });
      } else if (event.key === 'End') {
        event.preventDefault();
        activeIndex = buttons.length - 1;
        buttons[activeIndex].focus({ preventScroll: true });
      } else if (event.key === 'Escape') {
        event.preventDefault();
        close(true);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        choose(button);
      }
    });
  });

  document.addEventListener('pointerdown', event => {
    if (!wrapper.contains(event.target)) close(false);
  }, { passive: true });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !list.hidden) close(true);
  });

  select.addEventListener('change', () => {
    const option = options.find(item => item.value === select.value);
    if (!option) return;
    trigger.querySelector('span').textContent = option.textContent;
    trigger.classList.add('has-value');
    buttons.forEach((button, index) => {
      const selected = button.dataset.value === select.value;
      button.setAttribute('aria-selected', String(selected));
      if (selected) activeIndex = index;
    });
  });
})();
