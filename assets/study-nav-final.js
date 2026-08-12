(()=>{
  if(window.__studyNavFinalLoaded)return;window.__studyNavFinalLoaded=true;
  const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)];
  if(!q('link[href^="/assets/study-navigation-fixes.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/assets/study-navigation-fixes.css?v=20260812-1';document.head.appendChild(l)}
  const syncTheme=()=>{const b=q('#themeToggle');if(!b)return;const light=document.documentElement.dataset.theme==='light';b.setAttribute('aria-pressed',String(light));b.setAttribute('aria-label',light?'Switch to dark mode':'Switch to light mode')};syncTheme();setTimeout(syncTheme,120);
  const raw=location.pathname.replace(/\/+$/,'');const path=(raw||'/')==='/'?'/':`${raw}/`;
  const fallback={
    '/study/':[['/study/python/','🐍 Python Lab','Practice backend code'],['/study/environment/','🛰️ Environment','See the real setup'],['/study/environment/handbook/','📘 Handbook','Deep reference']],
    '/study/python/':[['/study/','🧭 Core App Flow','Reconnect to the main mental model'],['/study/environment/','🛰️ Environment','See where Python lives'],['/study/environment/handbook/','📘 Handbook','Deep reference']],
    '/study/environment/':[['/study/','🧭 Core App Flow','Rebuild the simple picture'],['/study/python/','🐍 Python Lab','Practice backend code'],['/study/environment/handbook/','📘 Handbook','Detailed environment reference']],
    '/study/environment/handbook/':[['/study/environment/','🛰️ Environment','Turn reference into visuals'],['/study/','🧭 Core App Flow','Return to the main quest'],['/study/python/','🐍 Python Lab','Practice backend code']]
  };
  qa('section[id]').forEach(s=>{if(q('.study-related',s))return;const items=fallback[path];if(!items)return;const box=document.createElement('aside');box.className='study-related';box.innerHTML=`<div class="study-related-head"><div><span>Keep exploring</span><h3>This page is connected to the rest of the course</h3></div><p>You never need to hunt for hidden subpages again.</p></div><div class="study-related-links">${items.map(x=>`<a class="study-related-link" href="${x[0]}"><span><strong>${x[1]}</strong><small>${x[2]}</small></span><b>→</b></a>`).join('')}</div>`;s.appendChild(box)});
  const realign=()=>{if(!location.hash)return;try{const el=document.querySelector(location.hash);if(el)el.scrollIntoView({block:'start'})}catch{}};setTimeout(realign,180);
})();