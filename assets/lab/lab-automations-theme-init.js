(() => {
  "use strict";

  const THEME_KEY = "cmx-lab-automations-theme-v1";
  let theme = "light";

  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") theme = saved;
    else localStorage.setItem(THEME_KEY, theme);
  } catch {}

  document.documentElement.dataset.theme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#05080d" : "#f5f8fb";
})();
