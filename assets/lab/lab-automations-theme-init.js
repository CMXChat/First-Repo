(() => {
  "use strict";

  const LEGACY_THEME_KEY = "cmx-lab-automations-theme-v1";
  const CHOICE_KEY = "cmx-lab-automations-theme-choice-v2";
  let theme = "light";

  try {
    const savedChoice = localStorage.getItem(CHOICE_KEY);
    if (savedChoice === "dark" || savedChoice === "light") theme = savedChoice;
    localStorage.setItem(LEGACY_THEME_KEY, theme);
  } catch {}

  function syncChrome(next) {
    document.documentElement.dataset.theme = next;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === "dark" ? "#05080d" : "#f5f8fb";
  }

  function installThemeControl() {
    if (!document.querySelector('link[data-continuum-theme-toggle]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/continuum-theme-toggle.css?v=20260820-1';
      link.dataset.continuumThemeToggle = 'true';
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-continuum-theme-toggle]')) {
      const script = document.createElement('script');
      script.src = '/assets/continuum-theme-toggle.js?v=20260820-1';
      script.defer = true;
      script.dataset.continuumThemeToggle = 'true';
      document.head.appendChild(script);
    }
  }

  function installSourceTruth() {
    if (document.querySelector('script[data-continuum-source-truth]')) return;
    const script = document.createElement('script');
    script.src = '/assets/continuum-source-truth-v1.js?v=20260822-1';
    script.defer = true;
    script.dataset.continuumSourceTruth = 'loader';
    document.head.appendChild(script);
  }

  syncChrome(theme);

  document.addEventListener("click", event => {
    const toggle = event.target.closest?.("[data-theme-toggle], [data-v3-theme]");
    if (!toggle) return;

    setTimeout(() => {
      const next = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      try {
        localStorage.setItem(CHOICE_KEY, next);
        localStorage.setItem(LEGACY_THEME_KEY, next);
      } catch {}
      syncChrome(next);
    }, 0);
  });

  function ready() {
    installThemeControl();
    installSourceTruth();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
