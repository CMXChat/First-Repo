'use strict';

(() => {
  const mapSection = document.querySelector('.clarity-product-map-section');
  const presence = mapSection?.querySelector('.continuum-presence');
  if (!mapSection || !presence || mapSection.querySelector('.continuum-origin-note')) return;

  const origin = document.createElement('section');
  origin.className = 'continuum-origin-note';
  origin.setAttribute('aria-labelledby', 'continuumOriginTitle');
  origin.innerHTML = `
    <div class="continuum-origin-copy">
      <p class="continuum-origin-kicker">WHERE CONTINUUM CAME FROM</p>
      <h2 id="continuumOriginTitle">The idea started with the Dead Man Switch</h2>
      <p>Afterlife began with a practical problem: if you stop responding, the people, information and instructions you prepared still need somewhere reliable to live. The Check In timer gives that problem a trigger.</p>
      <p>That led to a broader idea. The same foundation matters before an emergency. You can be asleep, traveling, working, waiting on someone or simply away from the screen. Continuum keeps the context and rules you chose available so approved work can continue over time.</p>
      <p>That is the line running through the product. Spaces and AI help while you are here. Automations define work that can continue. Runtime can later keep that work moving on the server. Afterlife uses the same foundation when you cannot respond.</p>
    </div>`;

  presence.before(origin);
  document.documentElement.dataset.continuumOrigin = 'ready';
})();
