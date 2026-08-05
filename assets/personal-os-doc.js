'use strict';

(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const printButton = document.getElementById('printDocument');
  const progressBar = document.querySelector('.reading-progress span');
  const tocLinks = Array.from(document.querySelectorAll('.document-toc a'));
  const sections = Array.from(document.querySelectorAll('.document-section[id]'));
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const storageKey = 'personal_os_doc_theme_v2';

  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored === 'light' || stored === 'dark' ? stored : null;
    } catch {
      return null;
    }
  }

  function getRequestedTheme() {
    const queryTheme = new URLSearchParams(window.location.search).get('theme');
    if (queryTheme === 'light' || queryTheme === 'dark') return queryTheme;
    return getStoredTheme() || 'dark';
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      return;
    }
  }

  function applyTheme(theme, persist = false) {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    const darkMode = nextTheme === 'dark';

    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;

    if (themeButton) {
      themeButton.setAttribute('aria-label', `Switch to ${darkMode ? 'light' : 'dark'} mode`);
      themeButton.setAttribute('aria-pressed', String(darkMode));
      themeButton.dataset.activeTheme = nextTheme;
    }

    if (themeMeta) {
      themeMeta.setAttribute('content', darkMode ? '#060a12' : '#edf3f8');
    }

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
    tocLinks.forEach((link) => {
      const current = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function installSectionTracking() {
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

  themeButton?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  printButton?.addEventListener('click', () => window.print());

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  window.addEventListener('pageshow', updateProgress);

  updateProgress();
  installSectionTracking();
  installFaqBehavior();
})();
