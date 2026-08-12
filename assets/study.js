(() => {
  const root = document.documentElement;
  const qs = (s, c = document) => c.querySelector(s);
  const qsa = (s, c = document) => [...c.querySelectorAll(s)];

  const safeGet = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const safeSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch {}
  };

  // Theme
  const themeButton = qs('#themeToggle');
  const savedTheme = safeGet('cmx-study-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  const syncTheme = () => {
    if (!themeButton) return;
    const isLight = root.dataset.theme === 'light';
    themeButton.setAttribute('aria-pressed', String(isLight));
    themeButton.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  };
  syncTheme();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    safeSet('cmx-study-theme', root.dataset.theme);
    syncTheme();
  });

  // Reading progress
  const readingBar = qs('.reading-progress span');
  const updateReading = () => {
    if (!readingBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    readingBar.style.width = `${pct}%`;
  };
  updateReading();
  window.addEventListener('scroll', updateReading, { passive: true });
  window.addEventListener('resize', updateReading);

  // Reveal on view
  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 })
    : null;
  qsa('.reveal').forEach((el) => revealObserver ? revealObserver.observe(el) : el.classList.add('is-visible'));

  // Active rail section
  const navLinks = qsa('.lesson-nav a');
  const navMap = new Map(navLinks.map((a) => [a.getAttribute('href')?.slice(1), a]));
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((a) => a.classList.remove('is-current'));
      navMap.get(visible.target.id)?.classList.add('is-current');
    }, { rootMargin: '-20% 0px -66% 0px', threshold: [0, .15, .4] });
    qsa('[data-nav-section]').forEach((section) => sectionObserver.observe(section));
  }

  // Lesson completion
  const completionKey = 'cmx-study-progress-v2';
  let completed = new Set();
  try {
    const parsed = JSON.parse(safeGet(completionKey) || '[]');
    if (Array.isArray(parsed)) completed = new Set(parsed);
  } catch {}

  const totalLessons = 8;
  const syncProgress = () => {
    const count = Math.min(totalLessons, completed.size);
    const pct = (count / totalLessons) * 100;
    qsa('[data-progress-bar]').forEach((el) => { el.style.width = `${pct}%`; });
    qsa('[data-progress-text]').forEach((el) => { el.textContent = `${count} / ${totalLessons}`; });
    qsa('[data-progress-card]').forEach((card) => {
      const id = card.dataset.progressCard;
      const done = completed.has(id);
      card.classList.toggle('is-done', done);
      const state = qs('.path-state', card);
      if (state) state.textContent = done ? 'Explored' : 'Open';
    });
    safeSet(completionKey, JSON.stringify([...completed]));
  };
  const complete = (id) => {
    if (!id) return;
    completed.add(id);
    syncProgress();
  };
  syncProgress();
  qs('#resetProgress')?.addEventListener('click', () => {
    completed.clear();
    safeSet(completionKey, '[]');
    syncProgress();
  });
  qsa('[data-progress-card]').forEach((card) => card.addEventListener('click', () => {
    const target = card.dataset.target;
    if (target) qs(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  // Scripted CR guide
  const tutorText = qs('#tutorText');
  const tutorTitle = qs('#tutorTitle');
  const tutorModes = {
    simple: {
      title: 'CR Guide · simplest version',
      text: 'Think of the app as a restaurant. The browser is where you sit, React builds what you see, the HTTP request is your order, FastAPI is the kitchen receiving it, and PostgreSQL is the organized storage room where saved information lives.'
    },
    technical: {
      title: 'CR Guide · one level deeper',
      text: 'The React frontend runs in the browser. It sends an HTTP request to a FastAPI endpoint. FastAPI checks the request, may verify who the user is, reads or changes data through the backend, and returns a response that React uses to update the screen.'
    },
    why: {
      title: 'CR Guide · why split it up?',
      text: 'Each layer has a job. The browser handles interaction, the backend protects rules and data, and the database stores durable records. Keeping those responsibilities separate makes the app easier to secure, change, test, and grow.'
    }
  };
  qsa('[data-tutor-mode]').forEach((button) => button.addEventListener('click', () => {
    qsa('[data-tutor-mode]').forEach((b) => b.classList.remove('is-active'));
    button.classList.add('is-active');
    const mode = tutorModes[button.dataset.tutorMode];
    if (mode && tutorText && tutorTitle) {
      tutorTitle.textContent = mode.title;
      tutorText.textContent = mode.text;
    }
  }));

  // Request journey simulator
  const flowNodes = qsa('[data-flow-node]');
  const flowTitle = qs('#flowTitle');
  const flowText = qs('#flowText');
  const flowStepLabel = qs('#flowStepLabel');
  const flowRun = qs('#runFlow');
  let flowScenario = 'create';
  let flowTimer = null;
  const flowCopy = {
    create: [
      ['You click “Create item”', 'The browser notices your click. Nothing has reached Python or the database yet. React is handling the interface event first.'],
      ['React prepares the request', 'The frontend gathers the form data and uses the generated API client to prepare an HTTP request for the backend.'],
      ['HTTP carries the message', 'The request travels to a backend URL. It has a method, a path, headers, and possibly a body containing JSON data.'],
      ['FastAPI receives it', 'A matching FastAPI endpoint runs. The backend validates the input and applies the rules for creating the item.'],
      ['PostgreSQL saves it', 'The backend writes a new row to the database. This is the durable copy that can still exist after you close the browser.'],
      ['The response comes back', 'FastAPI returns a response. React receives the result and updates the page so the new item appears without reloading everything.']
    ],
    login: [
      ['You submit the login form', 'The browser collects the email and password you entered and React handles the form submission.'],
      ['React sends login data', 'The frontend calls the backend login endpoint. The password should travel over HTTPS, not be stored casually in frontend code.'],
      ['HTTP delivers the request', 'The request carries the login data to the backend. This is still only a message moving between the frontend and backend.'],
      ['FastAPI checks the account', 'The backend looks up the user, verifies the password safely, and decides whether authentication should succeed.'],
      ['Stored data helps verify you', 'PostgreSQL may contain the user record and password hash. The backend compares safely and never needs to return the password to React.'],
      ['Proof returns to the browser', 'The app receives authentication proof such as a secure session or token. Future protected requests can use that proof.']
    ],
    load: [
      ['You open a page', 'React needs information to fill the page, so it starts a request for the data that belongs in this view.'],
      ['React calls the API client', 'The frontend asks for data through the generated client instead of manually rebuilding every request shape.'],
      ['A GET request travels', 'HTTP carries a GET request to the backend endpoint. GET usually means “give me information.”'],
      ['FastAPI handles the GET', 'The endpoint checks permissions and asks the backend layer for the records this user is allowed to see.'],
      ['PostgreSQL returns records', 'The database finds the matching rows and gives the backend structured data.'],
      ['React renders the result', 'FastAPI serializes a response, the browser receives it, and React turns the returned data into cards, rows, or whatever the interface needs.']
    ]
  };
  const showFlowStep = (index) => {
    flowNodes.forEach((node, i) => {
      node.classList.toggle('is-active', i === index);
      node.classList.toggle('is-complete', i < index);
    });
    const copy = flowCopy[flowScenario]?.[index];
    if (!copy) return;
    if (flowStepLabel) flowStepLabel.textContent = `Step ${index + 1} of 6`;
    if (flowTitle) flowTitle.textContent = copy[0];
    if (flowText) flowText.textContent = copy[1];
    if (index === 5) complete('journey');
  };
  const runFlow = () => {
    clearInterval(flowTimer);
    let index = 0;
    showFlowStep(index);
    if (flowRun) flowRun.disabled = true;
    flowTimer = setInterval(() => {
      index += 1;
      if (index >= 6) {
        clearInterval(flowTimer);
        if (flowRun) flowRun.disabled = false;
        return;
      }
      showFlowStep(index);
    }, 1250);
  };
  flowRun?.addEventListener('click', runFlow);
  flowNodes.forEach((node, index) => node.addEventListener('click', () => showFlowStep(index)));
  qsa('[data-flow-scenario]').forEach((button) => button.addEventListener('click', () => {
    qsa('[data-flow-scenario]').forEach((b) => b.classList.remove('is-active'));
    button.classList.add('is-active');
    flowScenario = button.dataset.flowScenario || 'create';
    showFlowStep(0);
  }));
  showFlowStep(0);

  // Frontend layers
  const layerData = {
    html: ['HTML', 'The structure', 'HTML gives the page its pieces: headings, buttons, forms, links, sections, tables, and other content. Think of it as the labeled frame of the interface.', 'A house analogy: HTML is the rooms, doors, walls, and labels that say what each part is.', '<button>Create item</button>'],
    css: ['CSS', 'The appearance', 'CSS controls how those pieces look and adapt: spacing, colors, layout, typography, mobile behavior, hover states, cards, circles, and the visual polish you see on this page.', 'A house analogy: CSS is the paint, lighting, furniture placement, sizing, and visual style.', '.button { border-radius: 999px; }'],
    js: ['JavaScript', 'The behavior', 'JavaScript makes the page react to actions. It can listen for a click, change what is visible, validate a form, or start an API request.', 'A house analogy: JavaScript is what makes the lights switch on, the doors react, and the controls actually do something.', 'button.addEventListener("click", createItem)'],
    react: ['React', 'A way to build interactive frontend UI', 'React is a JavaScript library that lets the frontend be built from reusable pieces called components. It keeps the screen in sync with changing data and user actions.', 'Instead of manually repainting the whole page, React helps describe what the screen should look like for the current state.', 'function ItemCard({ item }) { return <Card /> }'],
    ts: ['TypeScript', 'JavaScript with stronger guardrails', 'TypeScript adds type information so the editor and build tools can catch many mistakes before the app runs. Your React frontend uses TypeScript.', 'It is still part of the JavaScript world. The extra type information helps the team know what shape data should have.', 'type Item = { id: number; title: string }']
  };
  const layerName = qs('#layerName');
  const layerRole = qs('#layerRole');
  const layerText = qs('#layerText');
  const layerAnalogy = qs('#layerAnalogy');
  const layerCode = qs('#layerCode');
  qsa('[data-layer]').forEach((button) => button.addEventListener('click', () => {
    qsa('[data-layer]').forEach((b) => b.classList.remove('is-active'));
    button.classList.add('is-active');
    const data = layerData[button.dataset.layer];
    if (!data) return;
    if (layerName) layerName.textContent = data[0];
    if (layerRole) layerRole.textContent = data[1];
    if (layerText) layerText.textContent = data[2];
    if (layerAnalogy) layerAnalogy.textContent = data[3];
    if (layerCode) layerCode.textContent = data[4];
    complete('frontend');
  }));

  // HTTP request builder
  const requestMethod = qs('#requestMethod');
  const requestEndpoint = qs('#requestEndpoint');
  const requestBody = qs('#requestBody');
  const requestPreviewMethod = qs('#requestPreviewMethod');
  const requestPreviewPath = qs('#requestPreviewPath');
  const requestPreviewBody = qs('#requestPreviewBody');
  const responseCode = qs('#responseCode');
  const responseJson = qs('#responseJson');
  const sendRequest = qs('#sendRequest');
  const updateRequestPreview = () => {
    if (requestPreviewMethod) requestPreviewMethod.textContent = requestMethod?.value || 'GET';
    if (requestPreviewPath) requestPreviewPath.textContent = requestEndpoint?.value || '/api/items';
    if (requestPreviewBody) requestPreviewBody.textContent = requestBody?.value || '(no body)';
  };
  [requestMethod, requestEndpoint, requestBody].forEach((el) => el?.addEventListener('input', updateRequestPreview));
  updateRequestPreview();
  sendRequest?.addEventListener('click', () => {
    const method = requestMethod?.value || 'GET';
    const path = requestEndpoint?.value || '/api/items';
    if (responseCode) responseCode.textContent = method === 'POST' ? '201 Created' : '200 OK';
    if (responseJson) {
      responseJson.textContent = method === 'POST'
        ? '{\n  "id": 42,\n  "title": "Study HTTP",\n  "saved": true\n}'
        : path.includes('me')
          ? '{\n  "id": 7,\n  "name": "Jay",\n  "authenticated": true\n}'
          : '[\n  { "id": 1, "title": "First item" },\n  { "id": 2, "title": "Second item" }\n]';
    }
    complete('http');
  });

  // Endpoint anatomy
  const anatomyData = {
    decorator: ['The route decorator', '@router.get("/items/{item_id}") tells FastAPI which HTTP method and URL path should cause this Python function to run.'],
    function: ['The endpoint function', 'This async Python function is the backend code FastAPI calls after the matching request reaches the server.'],
    parameter: ['The path parameter', 'item_id comes from the URL. If the browser requests /items/42, FastAPI can give the function item_id = 42.'],
    dependency: ['The dependency', 'current_user represents information FastAPI resolved before the main work, such as the authenticated user. Dependencies can keep repeated checks organized.'],
    database: ['The database call', 'This line asks the backend data layer for one item. The real database work is kept separate so the endpoint stays easier to understand and test.'],
    return: ['The response value', 'Returning the item gives FastAPI data to serialize into the HTTP response that travels back to the frontend.']
  };
  const anatomyTitle = qs('#anatomyTitle');
  const anatomyText = qs('#anatomyText');
  qsa('[data-anatomy]').forEach((button) => button.addEventListener('click', () => {
    qsa('[data-anatomy]').forEach((b) => b.classList.remove('is-active'));
    button.classList.add('is-active');
    const data = anatomyData[button.dataset.anatomy];
    if (data && anatomyTitle && anatomyText) {
      anatomyTitle.textContent = data[0];
      anatomyText.textContent = data[1];
    }
    complete('backend');
  }));

  // Authentication switch
  const authData = {
    token: {
      title: 'Token model',
      summary: 'A token is a piece of proof the client can present with later requests. The server verifies that proof before allowing protected actions. The exact storage and security design matters, so treat “token” as the concept first, not permission to put secrets anywhere in frontend code.',
      steps: [
        ['1 · Login', 'You submit credentials', 'The frontend sends the login request over HTTPS.'],
        ['2 · Verify', 'Backend checks them', 'FastAPI verifies the account using protected backend logic.'],
        ['3 · Issue proof', 'A token is created', 'The app receives proof that represents the authenticated session or identity.'],
        ['4 · Use proof', 'Protected calls include it', 'Later API requests can be accepted only after the backend verifies the proof.']
      ]
    },
    session: {
      title: 'Session model',
      summary: 'A session usually means the server keeps or recognizes session state and the browser carries a secure session identifier, commonly through a protected cookie. The browser does not need to resend your password for every click.',
      steps: [
        ['1 · Login', 'You submit credentials', 'The frontend sends the login request to the backend.'],
        ['2 · Verify', 'Backend checks them', 'The server verifies the account and creates or recognizes a session.'],
        ['3 · Cookie', 'Browser receives an identifier', 'A secure cookie can carry the session identifier automatically.'],
        ['4 · Continue', 'Backend recognizes the session', 'Protected requests can be tied back to the signed-in user.']
      ]
    }
  };
  const authTitle = qs('#authTitle');
  const authSummary = qs('#authSummary');
  const authFlow = qs('#authFlow');
  const renderAuth = (mode) => {
    const data = authData[mode];
    if (!data) return;
    if (authTitle) authTitle.textContent = data.title;
    if (authSummary) authSummary.textContent = data.summary;
    if (authFlow) authFlow.innerHTML = data.steps.map(([label, title, text]) => `<div class="auth-step"><span>${label}</span><strong>${title}</strong><p>${text}</p></div>`).join('');
    complete('auth');
  };
  qsa('[data-auth-mode]').forEach((button) => button.addEventListener('click', () => {
    qsa('[data-auth-mode]').forEach((b) => b.classList.remove('is-active'));
    button.classList.add('is-active');
    renderAuth(button.dataset.authMode);
  }));

  // Database demo
  const dbBody = qs('#dbBody');
  const dbStatus = qs('#dbStatus');
  let dbNext = 4;
  qs('#dbInsert')?.addEventListener('click', () => {
    if (!dbBody) return;
    const tr = document.createElement('tr');
    tr.className = 'is-new';
    tr.innerHTML = `<td>${dbNext}</td><td>Learn database row</td><td>open</td><td>2026-08-12</td>`;
    dbBody.appendChild(tr);
    if (dbStatus) dbStatus.textContent = `Inserted row ${dbNext}. The table now has a new durable record in this simulation.`;
    dbNext += 1;
    complete('database');
  });
  qs('#dbRead')?.addEventListener('click', () => {
    if (dbStatus) dbStatus.textContent = 'SELECT-style read simulated. The backend would ask PostgreSQL for matching rows, then turn the result into data it can return safely.';
    complete('database');
  });

  // Tools module completion
  qsa('.tool-card details').forEach((details) => details.addEventListener('toggle', () => {
    if (details.open) complete('tools');
  }));

  // Inline checkpoints
  qsa('[data-checkpoint]').forEach((checkpoint) => {
    const feedback = qs('.checkpoint-feedback', checkpoint);
    qsa('[data-answer]', checkpoint).forEach((button) => button.addEventListener('click', () => {
      const correct = button.dataset.answer === 'correct';
      qsa('[data-answer]', checkpoint).forEach((b) => b.classList.remove('is-correct', 'is-wrong'));
      button.classList.add(correct ? 'is-correct' : 'is-wrong');
      if (feedback) feedback.textContent = correct
        ? (checkpoint.dataset.correct || 'Yes. That is the idea.')
        : (checkpoint.dataset.wrong || 'Close. Look at which layer actually owns that job, then try again.');
    }));
  });

  // Final quiz
  const quizQuestions = [
    {
      q: 'You click a button and the screen changes before any server request happens. Which layer handled that first?',
      options: ['PostgreSQL', 'React frontend', 'FastAPI', 'Docker'],
      answer: 1,
      explain: 'React runs in the browser and can react to clicks immediately. A backend request only happens if the frontend decides it needs one.'
    },
    {
      q: 'What is an HTTP request in this stack?',
      options: ['A database table', 'A message sent from one side of the web app to another', 'A React component', 'A Python package manager'],
      answer: 1,
      explain: 'HTTP is the communication format used when the frontend asks the backend for something or sends it data.'
    },
    {
      q: 'Where does a FastAPI endpoint live?',
      options: ['In the Python backend', 'Inside PostgreSQL', 'Inside CSS', 'In the browser address bar'],
      answer: 0,
      explain: 'FastAPI is the Python web framework in the backend. An endpoint is backend code connected to an HTTP method and path.'
    },
    {
      q: 'Why does the app use PostgreSQL?',
      options: ['To style cards', 'To store durable structured data', 'To compile TypeScript', 'To draw the browser UI'],
      answer: 1,
      explain: 'PostgreSQL is the database. It stores records the application needs to keep beyond one browser session.'
    },
    {
      q: 'Why have a generated API client in frontend/src/client?',
      options: ['So the frontend has its own backend', 'So frontend code can call backend endpoints through generated typed helpers', 'So PostgreSQL can run in React', 'So CSS can authenticate users'],
      answer: 1,
      explain: 'The generated client gives frontend code a convenient, typed way to call the backend API. The backend remains the place where the API endpoints live.'
    },
    {
      q: 'A migration is best described as…',
      options: ['A controlled change to database structure', 'Moving a button across the page', 'A login token', 'An HTTP response'],
      answer: 0,
      explain: 'Migrations keep database schema changes explicit and repeatable, such as adding a column or creating a table.'
    }
  ];
  let quizIndex = 0;
  const quizTitle = qs('#quizTitle');
  const quizQuestion = qs('#quizQuestion');
  const quizOptions = qs('#quizOptions');
  const quizResult = qs('#quizResult');
  const quizMapButtons = qsa('[data-quiz-index]');
  const quizAnswered = new Set();
  const renderQuiz = () => {
    const item = quizQuestions[quizIndex];
    if (!item) return;
    if (quizTitle) quizTitle.textContent = `Question ${quizIndex + 1} of ${quizQuestions.length}`;
    if (quizQuestion) quizQuestion.textContent = item.q;
    if (quizResult) { quizResult.textContent = 'Choose the answer that makes the most sense. You can retry without penalty.'; quizResult.className = 'quiz-result'; }
    if (quizOptions) {
      quizOptions.innerHTML = '';
      item.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = option;
        button.addEventListener('click', () => {
          const correct = index === item.answer;
          if (quizResult) {
            quizResult.textContent = `${correct ? 'Correct. ' : 'Not quite. '}${item.explain}`;
            quizResult.className = `quiz-result ${correct ? 'correct' : 'wrong'}`;
          }
          if (correct) {
            quizAnswered.add(quizIndex);
            quizMapButtons[quizIndex]?.classList.add('is-done');
            if (quizAnswered.size === quizQuestions.length) complete('quiz');
          }
        });
        quizOptions.appendChild(button);
      });
    }
    quizMapButtons.forEach((b, i) => b.classList.toggle('is-active', i === quizIndex));
  };
  quizMapButtons.forEach((button) => button.addEventListener('click', () => {
    quizIndex = Number(button.dataset.quizIndex) || 0;
    renderQuiz();
  }));
  renderQuiz();

  // Glossary search
  const glossarySearch = qs('#glossarySearch');
  const glossaryItems = qsa('.glossary-item');
  const glossaryEmpty = qs('#glossaryEmpty');
  glossarySearch?.addEventListener('input', () => {
    const query = glossarySearch.value.trim().toLowerCase();
    let shown = 0;
    glossaryItems.forEach((item) => {
      const visible = !query || item.textContent.toLowerCase().includes(query);
      item.hidden = !visible;
      if (visible) shown += 1;
    });
    if (glossaryEmpty) glossaryEmpty.style.display = shown ? 'none' : 'block';
  });

  // Mark final overview when the final card enters view after enough exploration.
  if ('IntersectionObserver' in window) {
    const final = qs('#mastery');
    if (final) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting) && completed.size >= 5) {
          complete('tools');
          observer.disconnect();
        }
      }, { threshold: .2 });
      observer.observe(final);
    }
  }
})();
