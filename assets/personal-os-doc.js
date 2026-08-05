'use strict';

(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');
  const themeIcon = document.getElementById('themeIcon');
  const printButton = document.getElementById('printDocument');
  const progressBar = document.querySelector('.reading-progress span');
  const tocLinks = Array.from(document.querySelectorAll('.document-toc a'));
  const sections = Array.from(document.querySelectorAll('.document-section[id]'));
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const documentFooter = document.querySelector('.document-footer');
  const STORAGE_KEY = 'personal_os_doc_theme_v1';

  function readTheme() {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
    } catch {
      return 'dark';
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme still works when browser storage is unavailable.
    }
  }

  function applyTheme(theme, persist = false) {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;

    if (themeLabel) themeLabel.textContent = nextTheme === 'dark' ? 'Light mode' : 'Dark mode';
    if (themeIcon) themeIcon.textContent = nextTheme === 'dark' ? '☀' : '◐';
    if (themeButton) {
      themeButton.setAttribute('aria-label', `Switch to ${nextTheme === 'dark' ? 'light' : 'dark'} mode`);
      themeButton.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    }
    if (themeMeta) themeMeta.setAttribute('content', nextTheme === 'dark' ? '#07101d' : '#edf3f8');
    if (documentFooter) {
      documentFooter.innerHTML = '<strong>Personal OS</strong> · Private product overview · Dark mode is the default. Light mode and print controls are available at the top of the document.';
    }
    if (persist) saveTheme(nextTheme);
  }

  function updateProgress() {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
    progressBar.style.width = `${progress}%`;
  }

  function setCurrentSection(id) {
    tocLinks.forEach((link) => {
      const current = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function installDemoCallout() {
    if (document.getElementById('personalOsDocDemo')) return;

    if (!document.getElementById('personalOsDocDemoStyle')) {
      const style = document.createElement('link');
      style.id = 'personalOsDocDemoStyle';
      style.rel = 'stylesheet';
      style.href = '/assets/personal-os-doc-demo.css?v=20260804-1';
      document.head.appendChild(style);
    }

    const footer = document.querySelector('.document-footer');
    if (!footer) return;

    const callout = document.createElement('section');
    callout.id = 'personalOsDocDemo';
    callout.className = 'document-demo-callout';
    callout.setAttribute('aria-labelledby', 'personalOsDocDemoTitle');
    callout.innerHTML = `
      <div class="document-demo-copy">
        <span class="document-demo-status">Active development preview</span>
        <h2 id="personalOsDocDemoTitle">See the current demo</h2>
        <p>The demo is still in active development. Its interface, structure, data connections, and daily operating flow will continue changing substantially as the Personal OS is built. The final experience will look and behave very differently from this early preview.</p>
      </div>
      <div class="document-demo-action">
        <a class="document-demo-button" href="/brief/">
          <span>See demo</span>
          <span aria-hidden="true">→</span>
        </a>
        <span class="document-demo-note">Uses fictional demonstration data. Features and presentation are still in progress.</span>
      </div>`;

    footer.insertAdjacentElement('beforebegin', callout);
  }

  applyTheme(readTheme());
  installDemoCallout();

  themeButton?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  printButton?.addEventListener('click', () => window.print());

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setCurrentSection(visible.target.id);
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: [0.05, 0.2, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
  }
})();
