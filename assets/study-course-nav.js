(()=>{
  if(window.__studyCourseNavLoaded)return;window.__studyCourseNavLoaded=true;
  const rawPath=location.pathname.replace(/\/+$/,'');
  const path=(rawPath||'/')==='/'?'/':`${rawPath}/`;
  const configs={
    '/study/':{world:'Core app flow',map:'#missions',chapters:['#foundation','#react','#request','#backend','#database','#auth','#boss','#mastery','#roadmap','#glossary']},
    '/study/python/':{world:'Python Lab',map:'#variables',chapters:['#variables','#decisions','#functions','#collections','#fastapi','#boss','#mastery']},
    '/study/environment/':{world:'Environment World',map:'#overview',chapters:['#overview','#frontend','#backend','#data','#auth','#project','#client','#local','#workflow','#guardrails','#tools','#recovery','#boss']},
    '/study/environment/handbook/':{world:'Handbook Registry',map:'#principles',chapters:['#principles','#anatomy','#learning','#registry','#decisions','#acceptance']}
  };
  const cfg=configs[path]; if(!cfg)return;
  const themeKeys={'/study/':'study-v3-theme','/study/python/':'study-python-theme','/study/environment/':'study-env-theme','/study/environment/handbook/':'study-handbook-theme'};
  try{const k=themeKeys[path];if(k&&!localStorage.getItem(k)){localStorage.setItem(k,'light');document.documentElement.dataset.theme='light'}}catch{}
  const ensureCss=(href)=>{if(!document.querySelector(`link[href^="${href}"]`)){const l=document.createElement('link');l.rel='stylesheet';l.href=`${href}?v=20260812-12`;document.head.appendChild(l)}};
  ensureCss('/assets/study-course-nav.css');ensureCss('/assets/study-enhancements.css');ensureCss('/assets/study-layout-fixes.css');ensureCss('/assets/study-universe.css');ensureCss('/assets/study-tutor-v2.css');ensureCss('/assets/study-navigation-fixes.css');ensureCss('/assets/study-concept-machines.css');ensureCss('/assets/study-focus-nav.css');ensureCss('/assets/study-deep-labs.css');ensureCss('/assets/study-docker-v2.css');ensureCss('/assets/study-self-check.css');ensureCss('/assets/study-handbook-sync.css');ensureCss('/assets/study-handbook-current.css');ensureCss('/assets/study-rich-v4.css');
  const chapters=cfg.chapters.map(sel=>document.querySelector(sel)).filter(Boolean);
  const titleFor=el=>el?.querySelector('h2,h3')?.textContent?.trim()||el?.id||cfg.world;
  let previousLocation='';try{previousLocation=localStorage.getItem('study-course-last')||''}catch{}
  let index=chapters.findIndex(el=>location.hash&&`#${el.id}`===location.hash);if(index<0)index=0;
  const dock=document.createElement('nav');dock.className='course-dock';dock.setAttribute('aria-label','Ordered course navigation');
  dock.innerHTML='<button class="course-dismiss" type="button" aria-label="Hide course tracker" title="Hide course tracker">⌄</button><button class="course-back" type="button" aria-label="Previous chapter">← <span>Previous</span></button><div class="course-center"><button class="course-map-button" type="button" aria-label="Open Study Universe">◎</button><div class="course-current"><small></small><strong></strong><div class="course-progress-track"><i></i></div></div><span class="course-count"></span></div><button class="course-next" type="button" aria-label="Next chapter"><span>Next</span> →</button>';
  document.body.appendChild(dock);
  const peek=document.createElement('button');peek.className='course-dock-peek';peek.type='button';peek.setAttribute('aria-label','Show course tracker');peek.innerHTML='<i></i><span>Course</span>';document.body.appendChild(peek);
  const back=dock.querySelector('.course-back'),next=dock.querySelector('.course-next'),map=dock.querySelector('.course-map-button'),dismiss=dock.querySelector('.course-dismiss'),world=dock.querySelector('.course-current small'),current=dock.querySelector('.course-current strong'),bar=dock.querySelector('.course-progress-track i'),count=dock.querySelector('.course-count');
  world.textContent=cfg.world;
  const save=()=>{try{localStorage.setItem('study-course-last',location.pathname+(chapters[index]?.id?'#'+chapters[index].id:''))}catch{}};
  const sync=(persist=true)=>{current.textContent=titleFor(chapters[index]);count.textContent=`${index+1} / ${chapters.length}`;bar.style.width=`${((index+1)/Math.max(1,chapters.length))*100}%`;back.disabled=index<=0;next.disabled=index>=chapters.length-1;back.title=back.disabled?'Start of this Study world':'Previous chapter';next.title=next.disabled?'End of this Study world · choose another world from the Universe bar':'Next chapter';if(persist)save()};
  const move=dir=>{const ni=index+dir;if(ni<0||ni>=chapters.length){dock.animate?.([{transform:'translateX(-50%)'},{transform:'translateX(calc(-50% + 5px))'},{transform:'translateX(-50%)'}],{duration:180});return}index=ni;chapters[index].scrollIntoView({behavior:'smooth',block:'start'});sync()};
  back.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));map.addEventListener('click',()=>{const menu=document.querySelector('.study-world-menu-button');if(menu)menu.click();else document.querySelector(cfg.map)?.scrollIntoView({behavior:'smooth',block:'start'})});
  const hideDock=()=>{dock.classList.add('course-dock-hiding');setTimeout(()=>{dock.hidden=true;peek.classList.add('show')},210);try{sessionStorage.setItem('study-course-dock-hidden','1')}catch{}};
  const showDock=()=>{dock.hidden=false;dock.classList.remove('course-dock-hiding');peek.classList.remove('show');try{sessionStorage.removeItem('study-course-dock-hidden')}catch{}};
  dismiss.addEventListener('click',hideDock);peek.addEventListener('click',showDock);
  try{if(sessionStorage.getItem('study-course-dock-hidden')==='1'){dock.hidden=true;peek.classList.add('show')}}catch{}
  let pointerY=null;dock.addEventListener('pointerdown',e=>{pointerY=e.clientY});dock.addEventListener('pointerup',e=>{if(pointerY!==null&&e.clientY-pointerY>38)hideDock();pointerY=null});dock.addEventListener('pointercancel',()=>pointerY=null);
  if('IntersectionObserver'in window&&chapters.length){const io=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;const i=chapters.indexOf(visible.target);if(i>=0){index=i;sync()}},{rootMargin:'-22% 0px -58% 0px',threshold:[0,.12,.35,.6]});chapters.forEach(el=>io.observe(el))}
  sync(false);
  if(path==='/study/'){
    const host=document.querySelector('#missions .mission-status')||document.querySelector('#missions');
    if(host&&!document.querySelector('.course-world-gate')){
      const safeResume=previousLocation.startsWith('/study/')?previousLocation:'/study/#react';
      const gate=document.createElement('div');gate.className='course-world-gate';
      gate.innerHTML=`<div><strong>Four worlds, one course 🧠</strong><p>Core is the main quest. Python teaches backend code. Environment shows the real setup. Handbook keeps the deep reference stuff. The Universe bar is the deliberate place to change worlds so lesson buttons do not teleport you by surprise.</p></div><div class="course-world-actions"><a class="primary" href="${safeResume}">Resume →</a><button type="button" data-open-study-worlds>Choose a world</button><a href="/study/index/">⌕ Index</a></div>`;
      host.insertAdjacentElement('afterend',gate);gate.querySelector('[data-open-study-worlds]')?.addEventListener('click',()=>document.querySelector('.study-world-menu-button')?.click())
    }
  }
  const ensureScript=(src)=>{if(!document.querySelector(`script[src^="${src}"]`)){const s=document.createElement('script');s.src=`${src}?v=20260812-12`;s.async=false;document.head.appendChild(s)}};
  ensureScript('/assets/study-enhancements.js');ensureScript('/assets/study-universe.js');ensureScript('/assets/study-tutor-v2.js');ensureScript('/assets/study-nav-final.js');ensureScript('/assets/study-concept-machines.js');ensureScript('/assets/study-focus-nav.js');ensureScript('/assets/study-deep-labs.js');ensureScript('/assets/study-docker-v2.js');ensureScript('/assets/study-handbook-sync.js');ensureScript('/assets/study-handbook-config.js');ensureScript('/assets/study-handbook-corrections.js');ensureScript('/assets/study-handbook-current.js');ensureScript('/assets/study-teach-more.js');ensureScript('/assets/study-self-check.js');
})();