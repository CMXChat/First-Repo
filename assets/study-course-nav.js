(()=>{
  const path=location.pathname.replace(/\/+$/,'/')||'/';
  const configs={
    '/study/':{world:'Core app flow',map:'#missions',prev:null,next:'/study/python/',chapters:['#foundation','#react','#request','#backend','#database','#auth','#boss','#mastery','#roadmap','#glossary']},
    '/study/python/':{world:'Python Lab',map:'/study/#missions',prev:'/study/#boss',next:'/study/environment/',chapters:['#variables','#decisions','#functions','#collections','#fastapi','#boss','#mastery']},
    '/study/environment/':{world:'Environment World',map:'/study/#missions',prev:'/study/python/#boss',next:null,chapters:['#overview','#frontend','#backend','#data','#auth','#project','#client','#local','#workflow','#guardrails','#tools','#recovery','#boss']}
  };
  const cfg=configs[path]; if(!cfg)return;
  if(!document.querySelector('link[href^="/assets/study-course-nav.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/assets/study-course-nav.css?v=20260812-1';document.head.appendChild(l)}
  const chapters=cfg.chapters.map(sel=>document.querySelector(sel)).filter(Boolean);
  const titleFor=el=>el?.querySelector('h2,h3')?.textContent?.trim()||el?.id||cfg.world;
  let previousLocation='';try{previousLocation=localStorage.getItem('study-course-last')||''}catch{}
  let index=Math.max(0,chapters.findIndex(el=>location.hash&&`#${el.id}`===location.hash));
  if(index<0)index=0;
  const dock=document.createElement('nav');dock.className='course-dock';dock.setAttribute('aria-label','Ordered course navigation');
  dock.innerHTML='<button class="course-back" type="button" aria-label="Previous chapter">← <span>Previous</span></button><div class="course-center"><button class="course-map-button" type="button" aria-label="Open course map">◎</button><div class="course-current"><small></small><strong></strong><div class="course-progress-track"><i></i></div></div><span class="course-count"></span></div><button class="course-next" type="button" aria-label="Next chapter"><span>Next</span> →</button>';
  document.body.appendChild(dock);
  const back=dock.querySelector('.course-back'),next=dock.querySelector('.course-next'),map=dock.querySelector('.course-map-button'),world=dock.querySelector('.course-current small'),current=dock.querySelector('.course-current strong'),bar=dock.querySelector('.course-progress-track i'),count=dock.querySelector('.course-count');
  world.textContent=cfg.world;
  const save=()=>{try{localStorage.setItem('study-course-last',location.pathname+(chapters[index]?.id?'#'+chapters[index].id:''))}catch{}};
  const sync=(persist=true)=>{current.textContent=titleFor(chapters[index]);count.textContent=`${index+1} / ${chapters.length}`;bar.style.width=`${((index+1)/Math.max(1,chapters.length))*100}%`;if(persist)save()};
  const move=dir=>{const ni=index+dir;if(ni>=0&&ni<chapters.length){index=ni;chapters[index].scrollIntoView({behavior:'smooth',block:'start'});sync();return}const route=dir<0?cfg.prev:cfg.next;if(route)location.href=route};
  back.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));map.addEventListener('click',()=>{if(cfg.map.startsWith('#'))document.querySelector(cfg.map)?.scrollIntoView({behavior:'smooth',block:'start'});else location.href=cfg.map});
  if('IntersectionObserver'in window&&chapters.length){const io=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;const i=chapters.indexOf(visible.target);if(i>=0){index=i;sync()}},{rootMargin:'-22% 0px -58% 0px',threshold:[0,.12,.35,.6]});chapters.forEach(el=>io.observe(el))}
  sync(false);
  if(path==='/study/'){
    const host=document.querySelector('#missions .mission-status')||document.querySelector('#missions');
    if(host&&!document.querySelector('.course-world-gate')){
      const safeResume=previousLocation.startsWith('/study/')?previousLocation:'/study/#react';
      const gate=document.createElement('div');gate.className='course-world-gate';
      gate.innerHTML=`<div><strong>The full course now has worlds</strong><p>Core App Flow stays the main quest. Python Lab deepens backend logic. Environment World contains the complete setup, tools, project anatomy, workflow, guardrails and later concepts.</p></div><div class="course-world-actions"><a class="primary" href="${safeResume}">Resume where I left off →</a><a href="/study/python/">Python Lab</a><a href="/study/environment/">Environment World</a></div>`;
      host.insertAdjacentElement('afterend',gate)
    }
  }
})();