(() => {
  'use strict';
  const data = window.CMX_BRIEF_CONCEPT;
  if (!data) return;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escapeHtml = value => { const node = document.createElement('div'); node.textContent = String(value ?? ''); return node.innerHTML; };

  function renderStatus() {
    const container = $('#statusGrid');
    if (!container) return;
    container.innerHTML = data.status.map(item => `<article class="status-card"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></article>`).join('');
  }

  function renderSections() {
    const main = $('#briefSections');
    const nav = $('#briefNav');
    if (!main || !nav) return;
    nav.innerHTML = data.sections.map(section => `<a href="#${escapeHtml(section.id)}">${escapeHtml(section.title)}</a>`).join('');
    main.innerHTML = data.sections.map(section => `<section class="section" id="${escapeHtml(section.id)}"><div class="section-head"><div><p class="eyebrow">${escapeHtml(section.eyebrow)}</p><h2>${escapeHtml(section.title)}</h2></div><p class="section-intro">${escapeHtml(section.intro)}</p></div><div class="grid">${section.cards.map(card => `<article class="card"><span class="card-tag">${escapeHtml(card.tag)}</span><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.text)}</p></article>`).join('')}</div></section>`).join('');
  }

  function setupTheme() {
    const button = $('#themeToggle');
    if (!button) return;
    const saved = localStorage.getItem('briefConceptTheme');
    if (saved === 'light') document.body.classList.add('light');
    const update = () => {
      const light = document.body.classList.contains('light');
      button.textContent = light ? 'Dark mode' : 'Ocean light mode';
      button.setAttribute('aria-pressed', String(light));
    };
    button.addEventListener('click', () => {
      document.body.classList.toggle('light');
      localStorage.setItem('briefConceptTheme', document.body.classList.contains('light') ? 'light' : 'dark');
      update();
    });
    update();
  }

  function setupViewMode() {
    const button = $('#viewToggle');
    const note = $('#modeNote');
    if (!button || !note) return;
    let shared = false;
    button.addEventListener('click', () => {
      shared = !shared;
      button.setAttribute('aria-pressed', String(shared));
      button.textContent = shared ? 'Show private profile' : 'Show shared space';
      note.textContent = shared
        ? 'Shared-space preview: only information explicitly approved for collaboration would appear here.'
        : 'Private-profile preview: personal context stays separate unless the person chooses to share it.';
    });
  }

  function setupActiveNav() {
    const links = $$('#briefNav a');
    const sections = $$('.section');
    if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;
    const map = new Map(links.map(link => [link.getAttribute('href').slice(1), link]));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.classList.remove('active'));
        map.get(entry.target.id)?.classList.add('active');
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }

  function init() {
    $('#conceptLabel').textContent = data.meta.label;
    $('#conceptTitle').textContent = data.meta.title;
    $('#conceptDescription').textContent = data.meta.description;
    $('#conceptUpdated').textContent = data.meta.updated;
    renderStatus();
    renderSections();
    setupTheme();
    setupViewMode();
    setupActiveNav();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();