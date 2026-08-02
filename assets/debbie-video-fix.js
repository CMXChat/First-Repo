(() => {
  "use strict";

  const VIDEO_ID = "vjmjZWHXKFY";
  const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
  const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&playsinline=1&origin=${encodeURIComponent(location.origin)}`;

  function applyVideoFix() {
    const watch = document.getElementById("watch");
    if (!watch) return false;

    const frame = watch.querySelector(".video-frame-shell iframe");
    const intro = watch.querySelector(".watch-intro > p");
    const label = watch.querySelector(".video-copy span");
    const title = watch.querySelector(".video-copy h3");
    const copy = watch.querySelector(".video-copy p");
    const frameShell = watch.querySelector(".video-frame-shell");

    if (!frame || !frameShell) return false;

    frame.src = EMBED_URL;
    frame.title = "BimBam video: What is Shabbat?";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.loading = "eager";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.setAttribute("allowfullscreen", "");

    if (intro) {
      intro.textContent = "A short Jewish-life video from BimBam, followed by current New York and Israel stories worth watching.";
    }
    if (label) label.textContent = "YOUTUBE · BIMBAM · JEWISH LIFE EXPLAINER";
    if (title) title.textContent = "What is Shabbat?";
    if (copy) {
      copy.textContent = "A clear introduction to the weekly Jewish day of rest, why it matters and how it creates room to pause, reconnect and recharge.";
    }

    let fallback = frameShell.querySelector(".video-direct-fallback");
    if (!fallback) {
      fallback = document.createElement("a");
      fallback.className = "video-direct-fallback";
      fallback.href = WATCH_URL;
      fallback.target = "_blank";
      fallback.rel = "noopener noreferrer";
      fallback.textContent = "Open this video directly on YouTube";
      fallback.style.cssText = "position:absolute;right:12px;bottom:12px;z-index:4;padding:9px 12px;border:1px solid rgba(142,213,255,.35);border-radius:999px;background:rgba(5,12,22,.86);color:#dff3ff;font:700 10px ui-monospace,SFMono-Regular,Menlo,monospace;text-decoration:none;backdrop-filter:blur(12px)";
      frameShell.appendChild(fallback);
    }

    return true;
  }

  if (applyVideoFix()) return;

  const observer = new MutationObserver(() => {
    if (applyVideoFix()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.setTimeout(() => observer.disconnect(), 15000);
})();