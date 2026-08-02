(() => {
  "use strict";

  const toggle = document.getElementById("showAllRoutes");
  const grid = document.getElementById("routeGrid");
  const explore = document.getElementById("explore");
  if (!toggle || !grid || !explore) return;

  let userOpened = false;

  const wrapper = document.createElement("div");
  wrapper.className = "route-discovery-cta motion-reveal";
  wrapper.innerHTML = `
    <div class="route-cta-copy">
      <span class="route-cta-kicker">THE COMPLETE CMX BUILD</span>
      <h3>You have only seen the front door.</h3>
      <p>Reveal the full project map to see the tools, research pages, operating plans, AI blueprints and experiments that connect into the larger CMX platform.</p>
      <div class="route-cta-meta">
        <span id="routeCtaCount">Loading the map...</span>
        <span>Tools + blueprints</span>
        <span>Opens below</span>
      </div>
    </div>`;

  toggle.parentNode.insertBefore(wrapper, toggle);
  wrapper.appendChild(toggle);
  toggle.textContent = "Reveal the complete project map";
  toggle.setAttribute("aria-controls", "routeGrid");
  toggle.setAttribute("aria-expanded", "false");

  const countLabel = document.getElementById("routeCtaCount");

  function filterPrivateBriefs() {
    grid.querySelectorAll("a.route-card").forEach(card => {
      const path = new URL(card.href, location.href).pathname;
      if (["/news/", "/logan/", "/debbie/"].includes(path)) card.remove();
    });
  }

  function updateCount() {
    filterPrivateBriefs();
    const count = grid.querySelectorAll("a.route-card").length;
    countLabel.textContent = count
      ? `${count} places to explore`
      : "Loading the map...";
  }

  function keepClosedUntilChosen() {
    if (userOpened) return;
    grid.hidden = true;
    grid.classList.remove("visible");
    wrapper.classList.remove("is-open");
    toggle.textContent = "Reveal the complete project map";
    toggle.setAttribute("aria-expanded", "false");
  }

  keepClosedUntilChosen();
  updateCount();

  const observer = new MutationObserver(() => {
    updateCount();
    keepClosedUntilChosen();
  });
  observer.observe(grid, { childList: true, subtree: true });

  toggle.addEventListener("click", event => {
    window.setTimeout(() => {
      if (!event.isTrusted) {
        userOpened = false;
        keepClosedUntilChosen();
        return;
      }

      userOpened = !grid.hidden;
      wrapper.classList.toggle("is-open", userOpened);
      toggle.setAttribute("aria-expanded", String(userOpened));
      toggle.textContent = userOpened
        ? "Close the project map"
        : "Reveal the complete project map";

      if (userOpened) {
        updateCount();
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          wrapper.classList.add("is-visible");
          revealObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });
    revealObserver.observe(wrapper);
  } else {
    wrapper.classList.add("is-visible");
  }
})();
