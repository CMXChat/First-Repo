(()=>{
  if(window.__studyFocusNavLoaded)return;window.__studyFocusNavLoaded=true;
  const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)];
  const raw=location.pathname.replace(/\/+$/,'');const path=(raw||'/')==='/'?'/':`${raw}/`;
  if(!q('link[href^="/assets/study-focus-nav.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/assets/study-focus-nav.css?v=20260812-1';document.head.appendChild(l)}
  const worlds=[['/study/','🧭 Core App Flow'],['/study/python/','🐍 Python Lab'],['/study/environment/','🛰️ Environment World'],['/study/environment/handbook/','📘 Handbook Registry'],['/study/index/','⌕ Ultimate Index']];
  const bar=q('.study-universe-bar');if(bar){
    const menu=q('.study-world-menu-button',bar);if(menu&&!q('.study-jump-wrap',bar)){const wrap=document.createElement('div');wrap.className='study-jump-wrap';wrap.innerHTML=`<span class="study-jump-label">Jump to</span><select class="study-jump-select" aria-label="Jump to another Study page">${worlds.map(x=>`<option value="${x[0]}" ${x[0]===path?'selected':''}>${x[1]}</option>`).join('')}</select><a class="study-index-link" href="/study/index/" title="Ultimate Index" aria-label="Open Ultimate Index">⌕</a><button class="study-focus-toggle" type="button" aria-pressed="false" title="Focus mode">Focus</button>`;menu.insertAdjacentElement('beforebegin',wrap);q('.study-jump-select',wrap)?.addEventListener('change',e=>{location.href=e.target.value});const focus=q('.study-focus-toggle',wrap);const note=document.createElement('div');note.className='study-focus-note';note.textContent='Focus mode: one chapter gets the spotlight. The rest can sit quietly and think about what it did.';document.body.appendChild(note);focus?.addEventListener('click',()=>{const on=!document.body.classList.contains('study-focus-mode');document.body.classList.toggle('study-focus-mode',on);focus.setAttribute('aria-pressed',String(on));focus.textContent=on?'Focused':'Focus'})}}

  const chapters={
    '/study/':['foundation','react','request','backend','database','auth','boss','mastery','roadmap','glossary'],
    '/study/python/':['variables','decisions','functions','collections','fastapi','boss','mastery'],
    '/study/environment/':['overview','frontend','backend','data','auth','project','client','local','workflow','guardrails','tools','recovery','boss'],
    '/study/environment/handbook/':['principles','anatomy','learning','registry','decisions','acceptance']
  }[path]||[];
  const sectionTitle=id=>q(`#${CSS.escape(id)} h2,#${CSS.escape(id)} h3`)?.textContent?.trim()||id.replaceAll('-',' ');
  qa('section[id]').forEach(section=>{
    const id=section.id,idx=chapters.indexOf(id);if(idx<0)return;const related=q('.study-related',section);if(!related)return;
    const prev=chapters[idx-1],next=chapters[idx+1];const links=[];
    if(prev)links.push([`#${prev}`,'← Previous in this world',sectionTitle(prev)]);
    if(next)links.push([`#${next}`,'Next in this world →',sectionTitle(next)]);
    links.push(['/study/index/','⌕ Ultimate Index','Find any concept without leaving breadcrumbs in the forest.']);
    related.innerHTML=`<div class="study-related-head"><div><span>Keep your place</span><h3>Stay in this world unless you choose to jump</h3></div><p>Cross-world jumps live in the Study Universe bar now. Less teleporting, more actually knowing where the hell you are.</p></div><div class="study-related-links study-same-world-links">${links.map(x=>`<a class="study-related-link" href="${x[0]}"><span><strong>${x[1]}</strong><small>${x[2]}</small></span><b>→</b></a>`).join('')}</div><div class="study-world-deeper"><button type="button" data-open-worlds><b>↗</b> Related worlds if you actually want them</button></div>`;
    q('[data-open-worlds]',related)?.addEventListener('click',()=>q('.study-world-menu-button')?.click());
  });

  const easy={
    '/study/':{
      foundation:['The whole app in four boxes','Browser is where you touch it. Frontend is the screen. Backend is the private brain. Database is long-term memory.','OSINT example: search box = frontend, Python search logic = backend, saved case = database.'],
      react:['React without the cult meeting','React helps build the screen from reusable pieces. Props are information handed into a piece. State is what the screen remembers right now.','Same WeatherCard + New York props. Change state to Family Space and the screen updates.'],
      request:['A request is just “hey backend, do this”','The frontend sends a structured message. The backend handles it and sends a response. HTTP is the agreed format for those web messages.','Create Briefing → POST request → backend works → response → new card appears.'],
      backend:['Python vs FastAPI','Python is the language doing logic. FastAPI is the web framework connecting HTTP doors to Python functions.','FastAPI catches POST /search. Python decides how to run the OSINT search.'],
      database:['Database = organized long-term memory','PostgreSQL stores rows in tables. IDs help records stay unique and connect to other records.','user 1 can own case 42 because cases.user_id points to users.id.'],
      auth:['Login is two separate ideas hiding in a trench coat','Authentication proves who you are. Authorization checks what that known user may access.','You can be logged in as Jay and still be blocked from somebody else’s private case.'],
      boss:['The whole point','You are rebuilding the app path from memory so the words stop floating around separately.','Click → frontend → request → endpoint → Python → database → response → screen.'],
      roadmap:['Later does not mean irrelevant','This shows what exists ahead without making you study all of it today.','Docker can stay visible now, then get a full visual lesson when you reach environment setup.'],
      glossary:['Developer soup translator','If a word sounds fake, tap it. Start with the dumb-simple meaning, then go deeper only if you care.','CRUD sounds cursed. It means create, read, update, delete. Four boring database jobs.']
    },
    '/study/python/':{
      variables:['Variable = labeled box','A variable gives a value a name so Python can use it later.','priority = 8 means “keep the number 8 under the name priority.”'],
      decisions:['if = fork in the road','Python asks a true/false question and follows one branch.','If urgency >= 7, show an alert. Otherwise keep it normal.'],
      functions:['Function = reusable little machine','Give it input, run the same instructions, get a result back.','make_report(case_id) can build a report for any case ID.'],
      collections:['Lists and dictionaries','A list is an ordered group. A dictionary is labeled information.','cards = [weather, alert]. case = {id: 42, status: open}.'],
      fastapi:['FastAPI gives Python web doors','A method + path like GET /cases/42 can trigger a Python function.','React calls the door. FastAPI routes it. Python does the job.'],
      boss:['Logic before typing','You arrange code pieces so your brain learns order without getting mugged by punctuation.','Define function → do work → return result.']
    },
    '/study/environment/':{
      overview:['The environment = everything around your code','Editor, folders, services, database, Git, Docker, deployment and guardrails all help you build and run a real app safely.','The app is the thing. The environment is the workshop around it.'],
      frontend:['Frontend toolkit','React builds reusable UI. TypeScript adds checks. Router chooses screens. Query helps manage server data. Tailwind/shadcn help build the look and controls.','Spaces screen changes without the backend drawing HTML for every click.'],
      backend:['API + networking live here','HTTP carries requests. FastAPI receives them. Python runs logic. Validation checks data before deeper work.','POST /search can carry an OSINT query to private Python code.'],
      data:['PostgreSQL + migrations','Postgres stores durable records. A migration records a change to database structure.','Add a source_url column through a migration so every environment changes the same way.'],
      auth:['Identity + permission','Login proves identity. Protected endpoints still check whether that identity has permission.','Your account can access your private Space but not somebody else’s.'],
      project:['Folders have jobs','Routes receive HTTP. CRUD/data code talks to records. Models describe structured data. Dependencies help identify users/services.','Changing a route should not require turning the whole repo upside down like a junk drawer.'],
      client:['Generated client = frontend helper built from backend API','FastAPI describes the API with OpenAPI. A generator can create matching TypeScript functions for React.','Backend adds GET /cases. Generated client gets a matching readCases helper.'],
      local:['Localhost + ports + Docker','localhost means this computer. Ports are numbered doors. Docker packages a repeatable runtime. Compose can start several services together.','Frontend on 5173, backend on 8000, database in its own service.'],
      workflow:['Build → test → ship → watch → recover','Good deployment is a repeatable path, not vibes and prayer.','Commit known code, validate it, deploy, check health/logs, know how to roll back.'],
      guardrails:['AI gets boundaries too','AI can help edit code, but dangerous actions, secrets, dependencies and destructive changes should stay reviewable.','“Add a button” is low risk. “Delete production tables” should not be one cheerful autocomplete away.'],
      tools:['Tools should have jobs','Git tracks changes. Docker packages runtime. Spec tools organize intent. Semantic code tools help agents navigate. None of them are magic.','Ask “what job does this tool do?” before memorizing its name.'],
      recovery:['Debugging = follow the evidence','Find which layer failed, inspect logs/state, reproduce, change one thing, verify.','If React gets 500, the problem may be backend logic even though the frontend is where you saw it.'],
      boss:['Own the lifecycle','You should be able to explain where code lives, how it runs, how it ships and how you recover it.','That is the difference between “AI made a page” and “I understand the app I am operating.”']
    },
    '/study/environment/handbook/':{
      principles:['The rules for the workshop','Keep learning visible, folders predictable, experiments isolated, risky changes reviewable, recovery simple and projects portable.','The setup should make mistakes survivable and explanations available.'],
      anatomy:['Where backend things belong','Routes receive requests, services hold behavior, models/schemas describe data, DB code handles storage, tests check behavior.','One giant app.py file is technically a lifestyle choice. A bad one.'],
      learning:['AI should leave you smarter','The loop is understand → plan → change → explain → test → review.','If AI adds an endpoint, you should be able to explain what door it created and what Python runs behind it.'],
      registry:['Questions are allowed to stay questions','The registry tracks decisions that still need answers instead of pretending every tool choice is settled.','Which ORM? Which dependency manager? Which hosting target? Those can be explicit choices.'],
      decisions:['Confirmed vs proposed vs open','Some choices are locked, some are strong candidates, some still need a decision.','Postgres can be a strong default while a specific ORM remains open.'],
      acceptance:['“Done” means you can operate it','The environment is ready when you can build, test, explain, deploy and recover without mystery rituals.','If the only recovery plan is “ask the AI what happened,” we are not done yet 😭.']
    }
  };
  const map=easy[path]||{};
  qa('section[id]').forEach(section=>{const d=map[section.id];if(!d)return;section.style.position=section.style.position||'relative';const tools=document.createElement('div');tools.className='study-section-toolbox';tools.innerHTML='<button class="study-easy-button" type="button" title="Explain this like I am 5" aria-label="Explain this section simply">5</button><button class="study-section-map-button" type="button" title="Open Study Universe" aria-label="Open Study Universe">◎</button>';const pop=document.createElement('div');pop.className='study-easy-pop';pop.innerHTML=`<span>tiny brain mode · zero shame</span><h4>${d[0]}</h4><p>${d[1]}</p><div class="study-easy-example"><b>Example:</b> ${d[2]}</div>`;section.prepend(pop);section.prepend(tools);q('.study-easy-button',tools).addEventListener('click',()=>pop.classList.toggle('open'));q('.study-section-map-button',tools).addEventListener('click',()=>q('.study-world-menu-button')?.click())});

  if('IntersectionObserver'in window&&chapters.length){const io=new IntersectionObserver(es=>{const hit=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!hit)return;qa('section[id]').forEach(s=>s.classList.toggle('study-active-section',s===hit.target))},{rootMargin:'-18% 0px -62% 0px',threshold:[0,.15,.4]});chapters.forEach(id=>{const el=q(`#${CSS.escape(id)}`);if(el)io.observe(el)})}
})();