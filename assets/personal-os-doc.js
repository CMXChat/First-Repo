'use strict';

(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const printButton = document.getElementById('printDocument');
  const progressBar = document.querySelector('.reading-progress span');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const storageKey = 'spaces_doc_theme_v1';
  const legacyStorageKey = 'personal_os_doc_theme_v3';

  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey);
      return stored === 'light' || stored === 'dark' ? stored : null;
    } catch {
      return null;
    }
  }

  function getRequestedTheme() {
    const queryTheme = new URLSearchParams(window.location.search).get('theme');
    if (queryTheme === 'light' || queryTheme === 'dark') return queryTheme;
    return getStoredTheme() || 'light';
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {}
  }

  function applyTheme(theme, persist = false) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    const darkMode = nextTheme === 'dark';
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;

    if (themeButton) {
      themeButton.setAttribute('aria-label', `Switch to ${darkMode ? 'light' : 'dark'} mode`);
      themeButton.setAttribute('aria-pressed', String(darkMode));
      themeButton.dataset.activeTheme = nextTheme;
    }

    themeMeta?.setAttribute('content', darkMode ? '#060a12' : '#edf3f8');
    if (persist) storeTheme(nextTheme);
  }

  function updateProgress() {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0
      ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
      : 0;
    progressBar.style.width = `${progress}%`;
  }

  function setCurrentSection(id) {
    document.querySelectorAll('.document-toc a').forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function installSectionTracking() {
    const sections = Array.from(document.querySelectorAll('.document-section[id]'));
    if (!sections.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setCurrentSection(visible.target.id);
      }, {
        rootMargin: '-18% 0px -66% 0px',
        threshold: [0.04, 0.15, 0.35]
      });
      sections.forEach((section) => observer.observe(section));
      return;
    }

    const updateFromScroll = () => {
      const target = sections
        .map((section) => ({ id: section.id, top: Math.abs(section.getBoundingClientRect().top - 130) }))
        .sort((a, b) => a.top - b.top)[0];
      if (target?.id) setCurrentSection(target.id);
    };

    window.addEventListener('scroll', updateFromScroll, { passive: true });
    updateFromScroll();
  }

  function installMobileContents() {
    if (document.getElementById('mobileContentsDrawer')) return;

    const sourceToc = document.querySelector('.document-rail .document-toc');
    const toolbar = document.querySelector('.document-toolbar');
    if (!sourceToc || !toolbar) return;

    const trigger = document.createElement('button');
    trigger.id = 'mobileContentsTrigger';
    trigger.className = 'mobile-contents-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-controls', 'mobileContentsDrawer');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('data-mobile-contents-trigger', 'true');
    trigger.innerHTML = `
      <span class="mobile-contents-trigger-mark" aria-hidden="true"></span>
      <span class="mobile-contents-trigger-copy">
        <strong>Contents</strong>
        <small id="mobileContentsTriggerCurrent">What Spaces is</small>
      </span>
      <span class="mobile-contents-trigger-arrow" aria-hidden="true">›</span>
    `;
    toolbar.insertAdjacentElement('afterend', trigger);

    const backdrop = document.createElement('div');
    backdrop.id = 'mobileContentsBackdrop';
    backdrop.className = 'mobile-contents-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('data-mobile-contents-backdrop', 'true');

    const drawer = document.createElement('aside');
    drawer.id = 'mobileContentsDrawer';
    drawer.className = 'mobile-contents-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-labelledby', 'mobileContentsTitle');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('inert', '');
    drawer.setAttribute('data-mobile-contents-drawer', 'true');
    drawer.innerHTML = `
      <header class="mobile-contents-drawer-header">
        <div>
          <p class="mobile-contents-drawer-eyebrow">Reading navigator</p>
          <h2 class="mobile-contents-drawer-title" id="mobileContentsTitle">Contents</h2>
        </div>
        <button class="mobile-contents-close" type="button" aria-label="Close document contents" data-mobile-contents-close="true">×</button>
      </header>
      <div class="mobile-contents-current">
        <span>Current section</span>
        <strong id="mobileContentsCurrent">What Spaces is</strong>
      </div>
      <nav class="document-toc mobile-document-toc" aria-label="Mobile document contents"></nav>
      <div class="mobile-contents-drawer-footer"><i aria-hidden="true"></i><span data-mobile-contents-count></span></div>
    `;

    const mobileToc = drawer.querySelector('.mobile-document-toc');
    sourceToc.querySelectorAll('a').forEach((link) => mobileToc.append(link.cloneNode(true)));
    const count = mobileToc.querySelectorAll('a').length;
    drawer.querySelector('[data-mobile-contents-count]').textContent = `${count} sections · Swipe left or tap outside to close`;

    document.body.append(backdrop, drawer);

    const closeButton = drawer.querySelector('[data-mobile-contents-close]');
    const triggerCurrent = trigger.querySelector('#mobileContentsTriggerCurrent');
    const drawerCurrent = drawer.querySelector('#mobileContentsCurrent');
    const mobileQuery = window.matchMedia('(max-width: 920px)');
    let savedFocus = null;
    let touchStartX = null;
    let touchStartY = null;

    const syncCurrentLabel = () => {
      const active = mobileToc.querySelector('a[aria-current="location"]')
        || sourceToc.querySelector('a[aria-current="location"]')
        || sourceToc.querySelector('a');
      const label = active?.textContent?.trim() || 'What Spaces is';
      if (triggerCurrent) triggerCurrent.textContent = label;
      if (drawerCurrent) drawerCurrent.textContent = label;
    };

    const syncTriggerTop = () => {
      const bottom = Math.max(0, toolbar.getBoundingClientRect().bottom);
      root.style.setProperty('--mobile-contents-top', `${Math.ceil(bottom + 10)}px`);
    };

    const focusableItems = () => Array.from(drawer.querySelectorAll('a[href], button:not([disabled])'))
      .filter((element) => element.getClientRects().length > 0 && !element.hasAttribute('inert'));

    const closeDrawer = ({ restoreFocus = true } = {}) => {
      if (!root.classList.contains('doc-mobile-contents-open')) return;
      root.classList.remove('doc-mobile-contents-open');
      trigger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('inert', '');
      backdrop.setAttribute('aria-hidden', 'true');
      if (restoreFocus && savedFocus?.isConnected) savedFocus.focus({ preventScroll: true });
    };

    const openDrawer = () => {
      if (!mobileQuery.matches || root.classList.contains('doc-mobile-contents-open')) return;
      savedFocus = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
      syncCurrentLabel();
      root.classList.add('doc-mobile-contents-open');
      trigger.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      drawer.removeAttribute('inert');
      backdrop.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => {
        const active = mobileToc.querySelector('a[aria-current="location"]');
        const destination = active || mobileToc.querySelector('a') || closeButton;
        destination?.focus({ preventScroll: true });
        if (active) mobileToc.scrollTop = Math.max(0, active.offsetTop - (mobileToc.clientHeight * 0.42));
      });
    };

    trigger.addEventListener('click', openDrawer);
    closeButton?.addEventListener('click', () => closeDrawer());
    backdrop.addEventListener('click', () => closeDrawer());

    mobileToc.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      closeDrawer({ restoreFocus: false });
    });

    drawer.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDrawer();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusableItems();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    drawer.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    drawer.addEventListener('touchend', (event) => {
      const touch = event.changedTouches[0];
      if (!touch || touchStartX === null || touchStartY === null) return;
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      touchStartX = null;
      touchStartY = null;
      if (deltaX < -64 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) closeDrawer();
    }, { passive: true });

    const currentObserver = new MutationObserver(syncCurrentLabel);
    [...sourceToc.querySelectorAll('a'), ...mobileToc.querySelectorAll('a')].forEach((link) => {
      currentObserver.observe(link, { attributes: true, attributeFilter: ['aria-current'] });
    });

    const handleViewportChange = () => {
      syncTriggerTop();
      if (!mobileQuery.matches) closeDrawer({ restoreFocus: false });
    };

    if (typeof mobileQuery.addEventListener === 'function') mobileQuery.addEventListener('change', handleViewportChange);
    else mobileQuery.addListener(handleViewportChange);
    window.addEventListener('resize', syncTriggerTop, { passive: true });
    window.addEventListener('pageshow', syncTriggerTop);

    syncCurrentLabel();
    syncTriggerTop();
  }

  function installFaqBehavior() {
    const faqItems = Array.from(document.querySelectorAll('.faq-list details'));
    faqItems.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  applyTheme(getRequestedTheme());
  installMobileContents();
  installSectionTracking();
  installFaqBehavior();

  themeButton?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });
  printButton?.addEventListener('click', () => window.print());
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  window.addEventListener('pageshow', updateProgress);

  updateProgress();
})();
