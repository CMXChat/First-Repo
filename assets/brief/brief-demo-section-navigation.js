(() => {
  'use strict';

  const data = window.BRIEF_DEMO_DATA;
  const main = document.getElementById('demoMain');
  if (!data?.navigation?.length || !main) return;

  const views = data.navigation
    .map(item => ({ id: item.id, label: item.label }))
    .filter(item => document.querySelector(`[data-view-panel="${CSS.escape(item.id)}"]`));

  const EDGE_GUARD_PX = 32;
  const MAX_SWIPE_DURATION_MS = 900;
  const SWIPE_DIRECTION_RATIO = 1.45;
  const blockedTargetSelector = [
    'button',
    'a',
    'input',
    'select',
    'textarea',
    'label',
    'iframe',
    'audio',
    'video',
    '[contenteditable="true"]',
    '[role="slider"]',
    '[role="tablist"]',
    '[data-swipe-lock]'
  ].join(',');

  let gestureState = null;

  function installStyles() {
    if (document.querySelector('link[data-brief-section-navigation]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/brief/brief-demo-section-navigation.css?v=20260805-1';
    link.dataset.briefSectionNavigation = 'true';
    document.head.append(link);
  }

  function currentViewIndex() {
    const id = document.body.dataset.view || 'today';
    return views.findIndex(item => item.id === id);
  }

  function visibleViewButton(view) {
    const buttons = [...document.querySelectorAll(`[data-primary-view="${CSS.escape(view)}"]`)];
    return buttons.find(button => button.getClientRects().length > 0) || buttons[0] || null;
  }

  function prepareTransition(direction) {
    if (!['next', 'previous'].includes(direction)) return;
    main.dataset.sectionDirection = direction;

    const clearDirection = event => {
      if (!(event.target instanceof Element) || !event.target.matches('[data-view-panel].is-active')) return;
      delete main.dataset.sectionDirection;
      main.removeEventListener('animationend', clearDirection, true);
    };

    main.addEventListener('animationend', clearDirection, true);
    window.setTimeout(() => {
      delete main.dataset.sectionDirection;
      main.removeEventListener('animationend', clearDirection, true);
    }, 450);
  }

  function openView(view, direction = 'next') {
    if (!views.some(item => item.id === view) || document.body.dataset.view === view) return false;
    const button = visibleViewButton(view);
    if (!button) return false;
    prepareTransition(direction);
    button.click();
    return true;
  }

  function pagerButton(item, type) {
    const previous = type === 'previous';
    const restart = type === 'restart';
    const direction = previous || restart ? 'previous' : 'next';
    const kicker = restart ? 'Start again' : previous ? 'Previous section' : 'Next section';
    const arrow = previous || restart ? '←' : '→';
    const classes = ['section-pager-button', `is-${type}`].join(' ');

    return `
      <button class="${classes}" type="button" data-section-view="${item.id}" data-section-direction="${direction}" aria-label="${kicker}: ${item.label}">
        ${previous || restart ? `<span class="section-pager-arrow" aria-hidden="true">${arrow}</span>` : ''}
        <span class="section-pager-copy">
          <small>${kicker}</small>
          <strong>${item.label}</strong>
        </span>
        ${previous || restart ? '' : `<span class="section-pager-arrow" aria-hidden="true">${arrow}</span>`}
      </button>`;
  }

  function renderPagers() {
    document.querySelectorAll('.section-pager').forEach(node => node.remove());

    views.forEach((item, index) => {
      const panel = document.querySelector(`[data-view-panel="${CSS.escape(item.id)}"]`);
      if (!panel) return;

      const previous = views[index - 1] || null;
      const next = views[index + 1] || null;
      const pager = document.createElement('nav');
      pager.className = `section-pager${previous ? '' : ' is-first'}${next ? '' : ' is-last'}`;
      pager.setAttribute('aria-label', `Move from ${item.label} to another briefing section`);

      const controls = [];
      if (previous) controls.push(pagerButton(previous, 'previous'));
      if (next) controls.push(pagerButton(next, 'next'));
      else controls.push(pagerButton(views[0], 'restart'));

      pager.innerHTML = `${controls.join('')}<p class="section-swipe-hint">Swipe left or right between sections</p>`;
      panel.append(pager);
    });
  }

  function elementCanScrollHorizontally(target) {
    let node = target instanceof Element ? target : target?.parentElement;
    while (node && node !== main) {
      const style = window.getComputedStyle(node);
      const scrollable = /(auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth + 4;
      if (scrollable) return true;
      node = node.parentElement;
    }
    return false;
  }

  function shouldIgnoreSwipe(target) {
    const element = target instanceof Element ? target : target?.parentElement;
    if (!element) return true;
    if (element.closest(blockedTargetSelector)) return true;
    return elementCanScrollHorizontally(element);
  }

  function minimumSwipeDistance() {
    return Math.max(64, Math.min(104, window.innerWidth * 0.18));
  }

  function beginGesture({ x, y, target, pointerId = null }) {
    if (document.body.dataset.entered !== 'true') return;
    if (document.getElementById('mediaDrawer')?.classList.contains('is-open')) return;
    if (shouldIgnoreSwipe(target)) return;
    if (x <= EDGE_GUARD_PX || x >= window.innerWidth - EDGE_GUARD_PX) return;

    gestureState = {
      x,
      y,
      pointerId,
      startedAt: performance.now(),
      view: document.body.dataset.view,
      cancelled: false
    };
  }

  function moveGesture({ x, y, pointerId = null }) {
    if (!gestureState) return;
    if (gestureState.pointerId !== null && pointerId !== gestureState.pointerId) return;
    const horizontal = Math.abs(x - gestureState.x);
    const vertical = Math.abs(y - gestureState.y);
    if (vertical > 18 && vertical > horizontal * 1.1) gestureState.cancelled = true;
  }

  function endGesture({ x, y, pointerId = null }) {
    const start = gestureState;
    gestureState = null;
    if (!start || start.cancelled) return;
    if (start.pointerId !== null && pointerId !== start.pointerId) return;
    if (start.view !== document.body.dataset.view) return;

    const deltaX = x - start.x;
    const deltaY = y - start.y;
    const horizontal = Math.abs(deltaX);
    const vertical = Math.abs(deltaY);
    const duration = performance.now() - start.startedAt;

    if (duration > MAX_SWIPE_DURATION_MS) return;
    if (horizontal < minimumSwipeDistance()) return;
    if (horizontal <= vertical * SWIPE_DIRECTION_RATIO) return;

    const index = currentViewIndex();
    if (index < 0) return;

    if (deltaX < 0 && views[index + 1]) openView(views[index + 1].id, 'next');
    if (deltaX > 0 && views[index - 1]) openView(views[index - 1].id, 'previous');
  }

  function handlePointerDown(event) {
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    beginGesture({
      x: event.clientX,
      y: event.clientY,
      target: event.target,
      pointerId: event.pointerId
    });
  }

  function handlePointerMove(event) {
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    moveGesture({ x: event.clientX, y: event.clientY, pointerId: event.pointerId });
  }

  function handlePointerUp(event) {
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    endGesture({ x: event.clientX, y: event.clientY, pointerId: event.pointerId });
  }

  function handleTouchStart(event) {
    if (event.touches.length !== 1) return;
    const point = event.touches[0];
    beginGesture({ x: point.clientX, y: point.clientY, target: event.target });
  }

  function handleTouchMove(event) {
    if (event.touches.length !== 1) return;
    const point = event.touches[0];
    moveGesture({ x: point.clientX, y: point.clientY });
  }

  function handleTouchEnd(event) {
    if (event.changedTouches.length !== 1) {
      gestureState = null;
      return;
    }
    const point = event.changedTouches[0];
    endGesture({ x: point.clientX, y: point.clientY });
  }

  function installEvents() {
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-section-view]');
      if (!button) return;
      openView(button.dataset.sectionView, button.dataset.sectionDirection || 'next');
    });

    if ('PointerEvent' in window) {
      main.addEventListener('pointerdown', handlePointerDown, { passive: true });
      main.addEventListener('pointermove', handlePointerMove, { passive: true });
      main.addEventListener('pointerup', handlePointerUp, { passive: true });
      main.addEventListener('pointercancel', () => { gestureState = null; }, { passive: true });
      return;
    }

    main.addEventListener('touchstart', handleTouchStart, { passive: true });
    main.addEventListener('touchmove', handleTouchMove, { passive: true });
    main.addEventListener('touchend', handleTouchEnd, { passive: true });
    main.addEventListener('touchcancel', () => { gestureState = null; }, { passive: true });
  }

  installStyles();
  renderPagers();
  installEvents();
})();
