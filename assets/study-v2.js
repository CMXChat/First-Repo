(() => {
  const root = document.documentElement;
  const qs = (s, c = document) => c.querySelector(s);
  const qsa = (s, c = document) => [...c.querySelectorAll(s)];
  const safeGet = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch {} };

  // Theme
  const themeToggle = qs('#themeToggle');
  const savedTheme = safeGet('cmx-study-v2-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  const syncTheme = () => {
    const light = root.dataset.theme === 'light';
    themeToggle?.setAttribute('aria-pressed', String(light));
    themeToggle?.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  };
  syncTheme();
  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    safeSet('cmx-study-v2-theme', root.dataset.theme);
    syncTheme();
  });

  // Reading progress + reveal
  const readingBar = qs('.reading-progress span');
  const updateReading = () => {
    if (!readingBar) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    readingBar.style.width = `${max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0}%`;
  };
  addEventListener('scroll', updateReading, { passive: true });
  addEventListener('resize', updateReading);
  updateReading();

  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08 }) : null;
  qsa('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('is-visible'));

  // Active section navigation + tutor context
  const navLinks = qsa('.lesson-nav a');
  const contextCopy = {
    checkpoint: {
      simple: 'You already have the rough frontend → backend → database picture. Right now we’re tightening the frontend part so React stops sounding like wizard shit 😭.',
      why: 'If React makes sense first, the later stuff gets easier because you’ll understand what the browser is actually assembling before we trace requests into Python.',
      example: 'Think Spaces: the screen is made from cards and controls you can already recognize. React helps organize those reusable pieces.'
    },
    stack: {
      simple: 'Four big pieces for now: browser shows it, React organizes the frontend, FastAPI receives backend requests, PostgreSQL stores durable data.',
      why: 'This map is your anchor. Every new word later should attach to one of these areas instead of floating around by itself.',
      example: 'Open Personal Space → React needs data → FastAPI gets asked → PostgreSQL finds records → the answer comes back.'
    },
    react: {
      simple: 'React is still frontend. It helps you build normal web UI out of reusable pieces called components.',
      why: 'Without reusable pieces, complex interfaces get repetitive and annoying to keep in sync. Components let the app reuse the same kind of card with different data.',
      example: 'One WeatherCard component can show New York today, London tomorrow, or a different Space without rebuilding the card from scratch.'
    },
    request: {
      simple: 'A request is basically the frontend sending the backend a message. The response is the backend answering.',
      why: 'The frontend shouldn’t reach straight into the database. The backend is the controlled middle layer where rules and permissions live.',
      example: 'Create Briefing → POST request → FastAPI endpoint → Python logic → PostgreSQL save → response → React updates the screen.'
    },
    backend: {
      simple: 'Python is the language. FastAPI is the framework helping that Python backend expose endpoints the frontend can call.',
      why: 'You could do lower-level networking yourself, but FastAPI handles a ton of plumbing so your code can focus on what the app should actually do.',
      example: 'GET /briefings can be one backend door. FastAPI recognizes that door, then your Python decides how to get Jay’s briefings.'
    },
    database: {
      simple: 'PostgreSQL stores durable structured data. Python decides what to do with it.',
      why: 'Keeping storage separate from app logic means the database can stay organized while the backend controls rules, permissions, and processing.',
      example: 'users.id = 1 can connect to briefings.user_id = 1, which is how a briefing can belong to the right user.'
    },
    auth: {
      simple: 'Authentication proves who you are. After login, a token or session can help the app remember that proof for later requests.',
      why: 'You really do not want to send your password again every time you click something protected.',
      example: 'Jay logs in once, then later asks for a private briefing. The backend checks the continuing login proof before returning it.'
    },
    roadmap: {
      simple: 'There is more stuff in your real environment, but we’re not speedrunning the entire computer-science DLC 😭.',
      why: 'TanStack, OpenAPI clients, Docker, migrations, models and the rest will make way more sense once the basic request flow feels obvious.',
      example: 'Later, when you see frontend/src/client/, you’ll already understand why a generated API client exists instead of memorizing a weird folder name.'
    },
    quiz: {
      simple: 'The quiz is just retrieval practice. If you can explain it without staring at the diagram, it’s actually starting to stick.',
      why: 'Recognizing an answer while it’s on-screen is easier than recalling the idea yourself. We want recall.',
      example: 'If I say “Create Briefing,” you should eventually be able to say click → request → endpoint → Python → database → response → screen.'
    },
    glossary: {
      simple: 'Search any word that starts sounding like developer soup. You do not need to pretend you know vocabulary you haven’t learned yet.',
      why: 'One unknown word can make a whole explanation feel harder than it actually is.',
      example: 'Search “endpoint” and get the tiny version instead of leaving the lesson and falling into a 40-minute docs hole.'
    }
  };
  let tutorContext = 'checkpoint';
  const setTutorContext = id => { if (contextCopy[id]) tutorContext = id; };
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(a => a.classList.remove('is-current'));
      qsa(`.lesson-nav a[href="#${visible.target.id}"]`).forEach(a => a.classList.add('is-current'));
      setTutorContext(visible.target.dataset.tutorContext || visible.target.id);
    }, { rootMargin: '-18% 0px -68% 0px', threshold: [0,.15,.35] });
    qsa('[data-nav-section]').forEach(s => sectionObserver.observe(s));
  }

  // Progress
  const progressKey = 'cmx-study-v2-progress';
  const tasks = ['stack','react','components','request','backend','database','auth','quiz'];
  let done = new Set();
  try {
    const parsed = JSON.parse(safeGet(progressKey) || '[]');
    if (Array.isArray(parsed)) done = new Set(parsed.filter(x => tasks.includes(x)));
  } catch {}
  const syncProgress = () => {
    const count = done.size;
    const pct = count / tasks.length * 100;
    qsa('[data-progress-text]').forEach(el => el.textContent = `${count} / ${tasks.length}`);
    qsa('[data-progress-percent]').forEach(el => el.textContent = `${Math.round(pct)}%`);
    qsa('[data-progress-bar]').forEach(el => el.style.width = `${pct}%`);
    safeSet(progressKey, JSON.stringify([...done]));
  };
  const complete = id => { if (tasks.includes(id)) { done.add(id); syncProgress(); } };
  qs('#resetProgress')?.addEventListener('click', () => { done.clear(); safeSet(progressKey,'[]'); syncProgress(); });
  syncProgress();

  // Hero + stack explainer
  const stackData = {
    browser: ['Browser', 'Where the app is experienced', 'The browser runs the frontend, shows the interface, notices clicks, and sends network requests when the frontend needs the backend.', 'Think: the place where you actually touch the app.'],
    react: ['React frontend', 'Reusable interface pieces', 'React and TypeScript organize the frontend into components, state, and interactions. It still ends up producing the normal interface your browser displays.', 'Think: the crew arranging the UI pieces on the stage.'],
    fastapi: ['FastAPI backend', 'Controlled backend doors', 'FastAPI helps your Python backend expose endpoints, validate requests, run protected logic, and return responses.', 'Think: the kitchen counter taking specific orders.'],
    postgres: ['PostgreSQL', 'Durable structured storage', 'PostgreSQL stores application records such as users, briefings, settings, and relationships so they survive beyond the current browser session.', 'Think: organized long-term storage, not the decision-maker.']
  };
  const explainTitle = qs('#stackExplainTitle');
  const explainRole = qs('#stackExplainRole');
  const explainText = qs('#stackExplainText');
  const explainAnalogy = qs('#stackExplainAnalogy');
  const showStack = key => {
    const data = stackData[key]; if (!data) return;
    qsa('[data-stack-node], [data-hero-node]').forEach(b => b.classList.toggle('is-active', b.dataset.stackNode === key || b.dataset.heroNode === key));
    if (explainTitle) explainTitle.textContent = data[0];
    if (explainRole) explainRole.textContent = data[1];
    if (explainText) explainText.textContent = data[2];
    if (explainAnalogy) explainAnalogy.textContent = data[3];
    complete('stack');
  };
  qsa('[data-stack-node]').forEach(b => b.addEventListener('click', () => showStack(b.dataset.stackNode)));
  qsa('[data-hero-node]').forEach(b => b.addEventListener('click', () => {
    showStack(b.dataset.heroNode);
    qs('#stack')?.scrollIntoView({behavior:'smooth',block:'start'});
  }));

  // React comparison
  const compareData = {
    repeated: {
      title: 'Plain markup can repeat the same shape again and again',
      text: 'That is totally valid for simple pages. The pain shows up when a large app has many similar interactive pieces that need the same behavior and structure.',
      code: '<div class="weather-card">New York · 78°</div>\n<div class="weather-card">London · 64°</div>\n<div class="weather-card">Auckland · 59°</div>'
    },
    component: {
      title: 'React lets you define the idea of a WeatherCard once',
      text: 'Then the app can reuse that component with different data. The component is a reusable frontend piece, not a new language and not a backend feature.',
      code: '<WeatherCard city="New York" temp={78} />\n<WeatherCard city="London" temp={64} />\n<WeatherCard city="Auckland" temp={59} />'
    },
    dynamic: {
      title: 'Spaces can choose components from data',
      text: 'The frontend can already own WeatherCard, AlertCard, ChartCard, and CalendarCard. A briefing response can describe which ones belong in today’s layout and what data each one receives.',
      code: 'briefing = [\n  { type: "weather", data: ... },\n  { type: "alert", data: ... },\n  { type: "chart", data: ... }\n]'
    }
  };
  const compareTitle = qs('#compareTitle'), compareText = qs('#compareText'), compareCode = qs('#compareCode');
  qsa('[data-compare]').forEach(btn => btn.addEventListener('click', () => {
    qsa('[data-compare]').forEach(b => b.classList.remove('is-active')); btn.classList.add('is-active');
    const d = compareData[btn.dataset.compare]; if (!d) return;
    compareTitle.textContent = d.title; compareText.textContent = d.text; compareCode.textContent = d.code; complete('react');
  }));

  // Component builder
  const componentDefs = {
    weather: { label:'WeatherCard', title:'72° · Clear start', detail:'New York · umbrella not needed' },
    alert: { label:'AlertCard', title:'One thing needs attention', detail:'Move the 3:30 meeting before leaving' },
    chart: { label:'ChartCard', title:'Weekly focus is improving', detail:'Five-day trend · +18%' },
    calendar: { label:'CalendarCard', title:'Next: 10:30 AM', detail:'Project review · 45 minutes' },
    text: { label:'TextCard', title:'Morning note', detail:'Finish the backend lesson after lunch' }
  };
  let components = [];
  const briefStack = qs('#briefStack'), componentCode = qs('#componentCode');
  const renderComponents = () => {
    if (!briefStack || !componentCode) return;
    briefStack.innerHTML = '';
    if (!components.length) {
      const empty = document.createElement('div'); empty.className='brief-placeholder'; empty.textContent='Add components from the left. This is your fake Spaces briefing canvas.'; briefStack.appendChild(empty);
      componentCode.textContent = '// Add a component to see the conceptual structure here.';
      return;
    }
    components.forEach((key, index) => {
      const d = componentDefs[key];
      const card = document.createElement('article'); card.className='brief-card'; card.dataset.kind=key;
      card.innerHTML = `<span>${d.label}</span><strong>${d.title}</strong><small>${d.detail}</small>`;
      card.title = 'Tap to remove this component';
      card.addEventListener('click', () => { components.splice(index,1); renderComponents(); });
      briefStack.appendChild(card);
    });
    componentCode.textContent = components.map(key => `<${componentDefs[key].label} />`).join('\n');
    complete('components');
  };
  qsa('[data-add-component]').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.addComponent; if (!componentDefs[key]) return;
    if (components.length >= 5) components.shift();
    components.push(key); renderComponents();
  }));
  qs('#clearComponents')?.addEventListener('click', () => { components=[]; renderComponents(); });
  qs('#buildSample')?.addEventListener('click', () => { components=['weather','alert','calendar','text']; renderComponents(); });
  renderComponents();

  // Request journey
  const flowScenarios = {
    create: [
      ['Click', 'You click Create Briefing in the browser. React catches that interface event first.'],
      ['React', 'The frontend gathers what it needs and calls the backend through an API request.'],
      ['HTTP', 'A POST request carries the message across the network to a backend URL.'],
      ['Endpoint', 'FastAPI matches the request to the endpoint that knows how to handle briefing creation.'],
      ['Python', 'Your backend logic checks rules, gathers permitted information, and decides what should be created.'],
      ['PostgreSQL', 'The backend saves the durable briefing record and related data.'],
      ['Response', 'The backend answers with success plus the new briefing data or identifier.'],
      ['Screen', 'React receives the response and updates the interface so the new briefing appears.']
    ],
    load: [
      ['Open', 'You open Personal Space. The browser already has the frontend running.'],
      ['React', 'React needs the current briefing data, so the frontend starts an API call.'],
      ['HTTP', 'A GET request travels to the backend asking for the allowed briefing data.'],
      ['Endpoint', 'FastAPI routes the request to the matching backend endpoint.'],
      ['Python', 'The backend checks who you are and what you are allowed to see.'],
      ['PostgreSQL', 'The backend reads the matching user, Space, settings, and briefing records.'],
      ['Response', 'FastAPI returns structured data to the frontend.'],
      ['Screen', 'React assembles the right components with that data and shows Personal Space.']
    ],
    setting: [
      ['Toggle', 'You change a briefing setting in the frontend.'],
      ['React', 'React updates the control and prepares the new setting value.'],
      ['HTTP', 'A PATCH request sends the changed value to the backend.'],
      ['Endpoint', 'FastAPI matches the protected settings endpoint.'],
      ['Python', 'The backend validates the new value and checks permission to change it.'],
      ['PostgreSQL', 'The preference is updated in durable storage.'],
      ['Response', 'The backend confirms the saved setting.'],
      ['Screen', 'React keeps the toggle in the confirmed state and can show a saved message.']
    ]
  };
  let flowScenario='create', flowTimer=null;
  const flowNodes=qsa('[data-flow-node]'), flowBadge=qs('#flowBadge'), flowTitle=qs('#flowTitle'), flowText=qs('#flowText');
  const showFlow = index => {
    const d=flowScenarios[flowScenario]?.[index]; if(!d)return;
    flowNodes.forEach((n,i)=>{n.classList.toggle('is-active',i===index);n.classList.toggle('is-complete',i<index)});
    if(flowBadge)flowBadge.textContent=String(index+1).padStart(2,'0'); if(flowTitle)flowTitle.textContent=d[0]; if(flowText)flowText.textContent=d[1];
    if(index===7)complete('request');
  };
  flowNodes.forEach((n,i)=>n.addEventListener('click',()=>showFlow(i)));
  qsa('[data-flow-scenario]').forEach(btn=>btn.addEventListener('click',()=>{
    qsa('[data-flow-scenario]').forEach(b=>b.classList.remove('is-active'));btn.classList.add('is-active');flowScenario=btn.dataset.flowScenario;clearInterval(flowTimer);showFlow(0);
  }));
  qs('#runFlow')?.addEventListener('click',()=>{
    clearInterval(flowTimer);let i=0;showFlow(i);flowTimer=setInterval(()=>{i++;if(i>=8){clearInterval(flowTimer);return;}showFlow(i)},900);
  });
  showFlow(0);

  // Backend concepts
  const backendData={
    api:['API','The controlled way software asks the backend for data or actions.','For your current mental model: the backend exposes an API, and the frontend calls it.','Spaces example: the frontend wants your briefing, so it calls the backend API instead of touching PostgreSQL directly.'],
    endpoint:['Endpoint','One specific backend door/address for a type of request.','A method + path such as GET /briefings can map to code that handles that exact kind of request.','Spaces example: GET /briefings means “give me the briefings I am allowed to see.”'],
    python:['Python','The programming language used to write your backend logic.','Python code can decide how to create a briefing, check permissions, process information, or talk to the database.','Python is not “the backend” by itself. It is the language your backend instructions are written in.'],
    fastapi:['FastAPI','The Python framework that makes building the API and endpoints much easier.','FastAPI handles web/API plumbing such as routing requests, validation, and responses so you do not build all the low-level server behavior yourself.','Python = language. FastAPI = framework helping that Python backend behave like a web API.']
  };
  const backendTitle=qs('#backendTitle'), backendLabel=qs('#backendLabel'), backendText=qs('#backendText'), backendExample=qs('#backendExample');
  qsa('[data-backend]').forEach(btn=>btn.addEventListener('click',()=>{
    qsa('[data-backend]').forEach(b=>b.classList.remove('is-active'));btn.classList.add('is-active');const d=backendData[btn.dataset.backend];if(!d)return;
    backendLabel.textContent=d[1];backendTitle.textContent=d[0];backendText.textContent=d[2];backendExample.textContent=d[3];complete('backend');
  }));

  // HTTP playground
  const reqMethod=qs('#requestMethod'), reqPath=qs('#requestPath'), reqBody=qs('#requestBody');
  const previewMethod=qs('#previewMethod'), previewPath=qs('#previewPath'), previewBody=qs('#previewBody'), responseStatus=qs('#responseStatus'), responseBody=qs('#responseBody');
  const updatePreview=()=>{if(previewMethod)previewMethod.textContent=reqMethod?.value||'GET';if(previewPath)previewPath.textContent=reqPath?.value||'/briefings';if(previewBody)previewBody.textContent=reqBody?.value||'(no body)'};
  [reqMethod,reqPath,reqBody].forEach(el=>el?.addEventListener('input',updatePreview));updatePreview();
  qs('#sendRequest')?.addEventListener('click',()=>{
    const method=reqMethod?.value||'GET',path=reqPath?.value||'/briefings';
    responseStatus.textContent=method==='POST'?'201 Created':'200 OK';
    if(method==='POST')responseBody.textContent='{\n  "id": 42,\n  "title": "Morning Brief",\n  "saved": true\n}';
    else if(path.includes('me'))responseBody.textContent='{\n  "id": 1,\n  "name": "Jay",\n  "authenticated": true\n}';
    else responseBody.textContent='[\n  { "id": 42, "title": "Morning Brief" },\n  { "id": 51, "title": "Project Brief" }\n]';
    complete('backend');
  });

  // Database relationship lab
  const linkResult=qs('#relationshipResult');
  qs('#showRelationship')?.addEventListener('click',()=>{
    qsa('[data-user-row="1"], [data-briefing-user="1"]').forEach(r=>r.classList.add('is-linked'));
    if(linkResult)linkResult.textContent='users.id = 1 ↔ briefings.user_id = 1. That shared ID is the relationship you care about right now.';
    complete('database');
  });
  qs('#addBriefingRow')?.addEventListener('click',()=>{
    const body=qs('#briefingsBody'); if(!body)return;
    if(qs('[data-added-briefing]')){if(linkResult)linkResult.textContent='You already added the example row 😭';return;}
    const row=document.createElement('tr');row.dataset.addedBriefing='true';row.dataset.briefingUser='1';row.innerHTML='<td>77</td><td class="key">1</td><td>Learning Brief</td>';
    body.appendChild(row);if(linkResult)linkResult.textContent='New row saved conceptually: briefing 77 belongs to user 1 because user_id = 1.';complete('database');
  });

  // Auth flow
  const authCopy=[
    ['Login form','You type email + password into the frontend.'],
    ['Backend request','The frontend sends the login request to the backend over a secure connection.'],
    ['User lookup','The backend finds the account record. The database should hold a password hash, not your readable password.'],
    ['Authentication','Python verifies the supplied password against the stored proof and decides whether you really are that user.'],
    ['Continuing proof','A session or token can then help later protected requests prove that the browser is already logged in.']
  ];
  const authTitle=qs('#authTitle'),authText=qs('#authText');
  qsa('[data-auth-step]').forEach((step,i)=>step.addEventListener('click',()=>{
    qsa('[data-auth-step]').forEach(s=>s.classList.remove('is-active'));step.classList.add('is-active');authTitle.textContent=authCopy[i][0];authText.textContent=authCopy[i][1];if(i===4)complete('auth');
  }));
  let authProof=false;
  qs('#simulateLogin')?.addEventListener('click',()=>{authProof=true;qs('#authProof').textContent='Jay already logged in ✅';qs('#protectedResult').textContent='Login proof ready.';complete('auth')});
  qs('#callProtected')?.addEventListener('click',()=>{
    qs('#protectedResult').textContent=authProof?'200 OK · private briefing returned':'401 · backend says “prove who you are first”';
  });

  // Quiz
  const questions=[
    {q:'Why does React exist if HTML, CSS, and JavaScript already exist?',o:['Because browsers cannot run JavaScript without React','To organize interactive frontend UI into reusable components and manage changing interface state','Because React is the backend language'],a:1,e:'Yep. React is still part of the frontend world. It helps organize and reuse interface logic.'},
    {q:'You click Create Briefing. What should happen before PostgreSQL saves anything?',o:['The frontend sends a request and backend logic decides what to do','PostgreSQL writes random frontend HTML','The browser edits the database directly'],a:0,e:'Correct. The database stores. The backend handles the decision/process.'},
    {q:'For your current mental model, what is an endpoint?',o:['A database table','A specific backend door/address for a kind of request','A React component'],a:1,e:'Exactly. Think method + path, such as GET /briefings.'},
    {q:'Which statement is right?',o:['Python is the language; FastAPI is the framework helping expose the backend API','FastAPI is the database and Python is the browser','React and FastAPI both store permanent records'],a:0,e:'Yep. That distinction matters a lot.'},
    {q:'What is PostgreSQL doing in the basic architecture?',o:['Rendering buttons','Storing durable structured application data','Deciding all business logic'],a:1,e:'Right. Backend logic decides; PostgreSQL stores and retrieves.'},
    {q:'Why do tokens/sessions exist after login?',o:['So the user can prove the login on later requests without resending the password every time','To make CSS load faster','To replace the database'],a:0,e:'Exactly. Keep that simple mental model for now.'}
  ];
  let quizIndex=0;const answered=new Set();const quizMap=qsa('[data-quiz-index]'),quizQ=qs('#quizQuestion'),quizTitle=qs('#quizTitle'),quizOptions=qs('#quizOptions'),quizResult=qs('#quizResult');
  const renderQuiz=()=>{
    const item=questions[quizIndex];quizTitle.textContent=`Question ${quizIndex+1} of ${questions.length}`;quizQ.textContent=item.q;quizOptions.innerHTML='';quizResult.textContent='Pick the answer that makes the most sense. You can retry.';quizResult.className='quiz-result';
    item.o.forEach((text,i)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',()=>{const correct=i===item.a;quizResult.textContent=`${correct?'Correct 😌':'Nope 😭'} ${item.e}`;quizResult.className=`quiz-result ${correct?'correct':'wrong'}`;if(correct){answered.add(quizIndex);quizMap[quizIndex]?.classList.add('is-done');if(answered.size===questions.length)complete('quiz')}});quizOptions.appendChild(b)});
    quizMap.forEach((b,i)=>b.classList.toggle('is-active',i===quizIndex));
  };
  quizMap.forEach((b,i)=>b.addEventListener('click',()=>{quizIndex=i;renderQuiz()}));renderQuiz();

  // Glossary
  const glossary=qs('#glossarySearch'),items=qsa('.glossary-item'),empty=qs('#glossaryEmpty');
  glossary?.addEventListener('input',()=>{const q=glossary.value.trim().toLowerCase();let shown=0;items.forEach(item=>{const visible=!q||item.textContent.toLowerCase().includes(q);item.hidden=!visible;if(visible)shown++});if(empty)empty.style.display=shown?'none':'block'});

  // Tutor panel
  const tutorPanel=qs('#tutorPanel'),tutorText=qs('#tutorText');
  const openTutor=()=>tutorPanel?.classList.add('is-open');
  qs('#tutorLauncher')?.addEventListener('click',()=>tutorPanel?.classList.toggle('is-open'));
  qs('#tutorClose')?.addEventListener('click',()=>tutorPanel?.classList.remove('is-open'));
  qsa('[data-tutor-mode]').forEach(btn=>btn.addEventListener('click',()=>{const d=contextCopy[tutorContext]||contextCopy.checkpoint;const mode=btn.dataset.tutorMode||'simple';tutorText.textContent=d[mode]||d.simple;openTutor()}));
  qs('#tutorText').textContent=contextCopy.checkpoint.simple;

  // Start button
  qs('#startCurrentLesson')?.addEventListener('click',()=>qs('#react')?.scrollIntoView({behavior:'smooth',block:'start'}));
})();
