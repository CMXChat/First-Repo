(()=>{
  if(window.__studyTeachMoreLoaded)return;window.__studyTeachMoreLoaded=true;
  const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)];
  const raw=location.pathname.replace(/\/+$/,'');const path=(raw||'/')==='/'?'/':`${raw}/`;
  const questions={
    foundation:['Point at browser, frontend, backend and database. Give me one job each.','If the screen disappears, does your database automatically disappear too? Why not?'],
    react:['If WeatherCard changes from New York to London, did we need to build a brand-new component?','What is the difference between information handed into a component and information the screen remembers?'],
    request:['Name the four useful pieces of the request envelope: method, path, headers and body.','Why can the frontend ask the backend for data without knowing how PostgreSQL stores it?'],
    backend:['Say the difference between Python and FastAPI in one sentence.','If React sends POST /search, which part matches the web door and which part contains the app logic?'],
    database:['What is a row? What is an ID? What can a foreign key connect?','Why should private browser code usually ask the backend instead of talking straight to PostgreSQL?'],
    auth:['Authentication asks what question? Authorization asks what question?','Can you be logged in but still forbidden from opening something? Give an example.'],
    variables:['What does a variable let Python remember under a useful name?','If priority = 8, what is the name and what is the value?'],
    decisions:['What kind of question does an if statement ask?','If urgency is 9, which branch should your example take?'],
    functions:['What are input, instructions and return value?','Why would build_report(case_id) be better than rewriting the same steps everywhere?'],
    collections:['When would a list make more sense than a dictionary?','What is the difference between an ordered group and labeled fields?'],
    fastapi:['What does method + path mean?','Why does FastAPI care about request/response shapes?'],
    overview:['What is the app, and what is the workshop around the app?','Which parts are code, which parts are services, and which parts help you ship/recover?'],
    frontend:['Give one job each to React, TypeScript, Router and TanStack Query.','Which one decides the page, and which one helps manage server data?'],
    data:['What is PostgreSQL? What is Aiven?','Which one is the database software and which one is the company/service hosting it for this environment?'],
    project:['Say Model → CRUD → Route → response in plain English.','Which file would you inspect first for an HTTP endpoint? Which one for database operations?'],
    client:['Why is frontend/src/client generated?','After changing a backend route/model, what should happen instead of hand-editing generated client files?'],
    local:['What does localhost mean? What does a port mean?','In this environment, where does PostgreSQL actually live during development?'],
    workflow:['What should happen between changing code and trusting production?','If a release breaks, what evidence would you inspect before randomly editing more code?'],
    guardrails:['Name one thing AI can do routinely and one thing that should pause for review.','Why should secrets and destructive production actions stay outside casual AI autonomy?'],
    tools:['Pick any tool here and answer only one thing: what job does it solve?','Can you explain why Spec Kit and Serena are different tools?'],
    recovery:['If the browser shows a 500, which layer should you investigate first and why?','Why is the first meaningful log error more useful than changing five things at once?'],
    principles:['What makes a development environment understandable and recoverable?','Why does “AI can edit everything” create a learning problem?'],
    anatomy:['Where do request handling, data shape and database operations belong?','Why is predictable file responsibility useful when AI is helping?'],
    learning:['What should you be able to explain before accepting generated code?','What does reading the diff teach you that a success message cannot?'],
    registry:['Why keep old design questions separate from current handbook facts?','How can a page accidentally teach an obsolete decision if history and current state are mixed together?'],
    decisions:['What is the difference between a current fact and an old proposed choice?','Name one decision that the handbook now resolves.'],
    acceptance:['What does “I can operate this” mean beyond “the page loaded”?','Can you build, explain, test, deploy and recover it?']
  };
  const fallback=['Explain this section without repeating its headline word-for-word.','Give one real example from Spaces, OSINT or this environment.'];

  // Replace the old numeric ELI5 badge and remove repetitive route-hopping links inside lesson bodies.
  qa('.study-easy-button').forEach(b=>{b.textContent='🧠';b.title='Explain this with tiny-brain words';b.setAttribute('aria-label','Explain this section very simply')});
  qa('.study-related a[href^="/study/index/"]').forEach(a=>a.remove());
  qa('.study-related-head p').forEach(p=>{if(p.textContent.includes('Cross-world'))p.textContent='Previous and next stay on this page. Use the Study Universe bar only when you deliberately want another world.'});

  // Turn each existing easy explanation into a teach-aloud card so another person can teach from the page.
  qa('section[id]').forEach(section=>{
    if(q('.study-teacher-card',section))return;
    const easy=q('.study-easy-pop',section);if(!easy)return;
    const simple=q('p',easy)?.textContent?.trim();const example=q('.study-easy-example',easy)?.textContent?.replace(/^Example:\s*/,'').trim();
    const qs=questions[section.id]||fallback;
    const card=document.createElement('details');card.className='study-teacher-card';
    card.innerHTML=`<summary>Teach this out loud · no developer voice required</summary><div class="teacher-grid"><div class="teacher-box"><span>Say it like this</span><p>${simple||'Explain the job this section performs in the larger app.'}${example?` <b>Example:</b> ${example}`:''}</p></div><div class="teacher-box"><span>Ask me this</span><p>${qs[0]}</p></div><div class="teacher-box"><span>Then make sure I can answer</span><p>${qs[1]}</p></div></div>`;
    const related=q('.study-related',section);if(related)related.insertAdjacentElement('beforebegin',card);else section.appendChild(card);
  });

  // Correct tiny-brain copy that came from an older generic environment assumption.
  if(path==='/study/environment/'){
    const local=q('#local .study-easy-pop p');if(local)local.textContent='localhost means this computer. Ports are numbered doors to local services. Docker packages a repeatable runtime. In this specific environment PostgreSQL is hosted remotely on Aiven, so Docker is not secretly spinning up your database beside the backend.';
    const localExample=q('#local .study-easy-example');if(localExample)localExample.innerHTML='<b>Example:</b> React runs on port 5173, FastAPI on 8000, and both can use the remote Aiven PostgreSQL service through configured credentials.';
    const reg=q('#registry .study-easy-pop p');if(reg)reg.textContent='This registry is useful history and design context. The current handbook is the authority for choices that have already been resolved, so old “open questions” should not be mistaken for today’s stack.';
  }

  if(path==='/study/'){
    const request=q('#request');if(request&&!q('.fullstack-code-bridge',request)){
      const bridge=document.createElement('div');bridge.className='fullstack-code-bridge';
      bridge.innerHTML=`<div class="code-bridge-head"><div><span class="study-deep-tag">raw web anatomy · before React hides the plumbing</span><h3>How a plain HTML button can end up reading PostgreSQL through Python</h3></div><p>HTML does not magically talk to Python or PostgreSQL. JavaScript in the browser sends an HTTP request. FastAPI receives it, Python runs backend logic, the backend talks to the database, then the response travels back to browser JavaScript.</p></div><div class="code-bridge-track"><button class="code-bridge-node active" data-code-layer="html" type="button"><span>01 · BROWSER</span><strong>HTML</strong><small>give the user a button + output area</small></button><button class="code-bridge-node" data-code-layer="js" type="button"><span>02 · BROWSER</span><strong>JavaScript</strong><small>send the HTTP request</small></button><button class="code-bridge-node" data-code-layer="http" type="button"><span>03 · NETWORK</span><strong>HTTP</strong><small>carry method + path + data</small></button><button class="code-bridge-node" data-code-layer="python" type="button"><span>04 · BACKEND</span><strong>FastAPI + Python</strong><small>match route + run logic</small></button><button class="code-bridge-node" data-code-layer="db" type="button"><span>05 · DATA</span><strong>PostgreSQL</strong><small>find the saved row</small></button><button class="code-bridge-node" data-code-layer="response" type="button"><span>06 · BACK</span><strong>Response</strong><small>JSON returns; screen updates</small></button></div><div class="code-bridge-workspace"><pre class="code-bridge-code" data-code-bridge-code></pre><div class="code-bridge-explain"><article><span data-code-bridge-label>Layer</span><h4 data-code-bridge-title></h4><p data-code-bridge-text></p></article><article><span>What the developer is deciding</span><p data-code-bridge-decision></p></article><div class="code-bridge-result" data-code-bridge-result><b>Important:</b> this uses raw HTML + JavaScript to expose the plumbing. Your real React environment usually calls the generated API client instead of hand-writing this exact fetch.</div><div class="study-deep-actions"><button class="primary" data-code-bridge-run type="button">▶ Run the whole trip</button></div></div></div>`;
      request.appendChild(bridge);
      const layers={
        html:{label:'HTML · frontend structure',title:'HTML gives the browser things the user can interact with',code:`<!-- This is visible structure in the browser. -->\n<button id="loadBrief">Load my briefing</button>\n<div id="output">Nothing loaded yet.</div>`,text:'The button exists, but HTML by itself is mostly structure. Clicking it does not automatically know what FastAPI or PostgreSQL are.',decision:'Choose what controls and content the user needs. Give JavaScript a stable element to listen to and somewhere to display the result.'},
        js:{label:'JavaScript · browser behavior',title:'JavaScript reacts to the click and asks the backend',code:`// Browser-side JavaScript listens for the click.\ndocument.querySelector("#loadBrief")\n  .addEventListener("click", async () => {\n\n    // Send an HTTP GET request to a backend API door.\n    const response = await fetch("/api/v1/briefings/42");\n\n    // Convert the JSON response into a JavaScript object.\n    const briefing = await response.json();\n\n    // Put backend data into the visible HTML.\n    document.querySelector("#output").textContent = briefing.title;\n  });`,text:'This is the bridge from browser UI to backend API. fetch() is one low-level way to send a request.',decision:'Choose when a request should happen, which endpoint to call, what data to send, and what the screen should do with success or failure.'},
        http:{label:'HTTP · message rules',title:'The browser turns the request into a web message',code:`GET /api/v1/briefings/42 HTTP/1.1\nHost: your-app.example\nAuthorization: Bearer <login-proof>\nAccept: application/json\n\n# No request body is needed for this simple GET.`,text:'HTTP is the agreed format for the request and response. The method says the intent. The path identifies the backend door. Headers carry extra information such as accepted format or login proof.',decision:'Choose an API contract that is predictable: sensible method, path, input shape, permission requirements and response shape.'},
        python:{label:'FastAPI + Python · backend',title:'FastAPI matches the door; Python handles the job',code:`# Conceptual FastAPI example, simplified for learning.\n@router.get("/briefings/{briefing_id}")\ndef read_briefing(briefing_id: int, session: SessionDep):\n    # Python receives briefing_id = 42.\n    briefing = session.get(Briefing, briefing_id)\n\n    # Real code also checks ownership / permission.\n    if not briefing:\n        raise HTTPException(status_code=404)\n\n    return briefing`,text:'FastAPI connects the HTTP request to a Python function and helps validate typed input. Python contains the instructions and can use database helpers/services.',decision:'Choose validation, permission rules, business logic, error behavior and what data is safe to return.'},
        db:{label:'PostgreSQL · durable data',title:'The backend asks PostgreSQL for the saved record',code:`-- The ORM/SQLModel may generate SQL similar in spirit to this.\nSELECT id, user_id, title\nFROM briefings\nWHERE id = 42;\n\n-- Example matching row:\n-- 42 | 1 | Morning Brief`,text:'PostgreSQL stores durable structured records. In your actual environment it is hosted on Aiven. The browser does not need the database password and should not be making this private query directly.',decision:'Choose tables, fields, relationships, indexes, safe queries and migrations as the data shape evolves.'},
        response:{label:'Response · backend → browser',title:'The answer comes back as status + structured data',code:`HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "id": 42,\n  "title": "Morning Brief"\n}\n\n// Browser JavaScript receives it and changes #output.\n// The person sees: Morning Brief`,text:'The backend returns only the data the client is allowed to see. Browser JavaScript receives it, then updates the interface. The round trip is complete.',decision:'Choose clear status codes and response data so the frontend does not have to guess what happened.'}
      };
      const code=q('[data-code-bridge-code]',bridge),label=q('[data-code-bridge-label]',bridge),title=q('[data-code-bridge-title]',bridge),text=q('[data-code-bridge-text]',bridge),decision=q('[data-code-bridge-decision]',bridge),nodes=qa('[data-code-layer]',bridge);let current='html',timer;
      const show=k=>{current=k;nodes.forEach(n=>n.classList.toggle('active',n.dataset.codeLayer===k));const d=layers[k];label.textContent=d.label;title.textContent=d.title;text.textContent=d.text;decision.textContent=d.decision;code.textContent=d.code};
      nodes.forEach(n=>n.addEventListener('click',()=>{clearInterval(timer);show(n.dataset.codeLayer)}));q('[data-code-bridge-run]',bridge).addEventListener('click',()=>{clearInterval(timer);let i=0;show(nodes[0].dataset.codeLayer);timer=setInterval(()=>{i++;if(i>=nodes.length){clearInterval(timer);return}show(nodes[i].dataset.codeLayer)},1250)});show('html');
    }
  }
})();