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

  syncChrome(theme);

  document.addEventListener("click", event => {
    const toggle = event.target.closest?.("[data-theme-toggle]");
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
})();
