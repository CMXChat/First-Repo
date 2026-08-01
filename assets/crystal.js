(() => {
  'use strict';

  const gameScreen = document.getElementById('gameScreen');
  const reveal = document.getElementById('reveal');
  const terminalLog = document.getElementById('terminalLog');
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const quickActions = document.getElementById('quickActions');
  const levelMeter = document.getElementById('levelMeter');
  const inventoryMeter = document.getElementById('inventoryMeter');
  const soundToggle = document.getElementById('soundToggle');

  const saveKey = 'crystal-jay-hearing-v2';
  const defaultState = {
    scene: 0,
    question: 0,
    started: false,
    complete: false,
    sound: false,
    mercy: 0,
    harsh: 0,
    matcha: 0,
    verdictKey: 'pending',
    verdict: 'PENDING',
    verdictNote: 'Jay is alive. The hearing has not started.'
  };

  const verdicts = {
    soft: {
      title: 'JAY SURVIVES ON A TECHNICALITY',
      note: 'Crystal allows continued breathing. Conditions: better snacks, fewer monologues, and zero use of the word “technically.”',
      condition: 'Alive. Grateful. Already drafting the paragraph that will get him back in trouble.'
    },
    harsh: {
      title: 'JAY SURVIVES, BUT IN RESTRICTED MODE',
      note: 'Indoor privileges revoked. Five dogs now have admin access to his location. The couch filed the paperwork itself.',
      condition: 'Alive. On the couch. Writing a defense nobody asked for and everyone will ignore.'
    },
    matcha: {
      title: 'MISTRIAL: MATCHA REFUSED THE PAPERWORK',
      note: 'Jay lives because the cat looked at the stack of evidence, yawned, and left. Strongest defense he has ever had.',
      condition: 'Alive by pure feline negligence. Humbled for approximately forty minutes.'
    }
  };

  const scenes = {
    intro: {
      actions: ['start', 'about'],
      lines: [
        ['system', 'Opening CASE 00-JAY...'],
        ['system', 'Judge: Crystal. Defendant: Jay. State witness who does not care: Matcha.'],
        ['story', 'CHARGE: being Jay at the wrong emotional volume for several consecutive days.'],
        ['story', 'Three questions. Answer wrong and the rest of the page stays locked. Answer right and you still get roasted.'],
        ['system', 'Fictional tribunal. Jay has water. He also has a keyboard and that is the real problem.'],
        ['story', 'Type START. Or stall. Stalling is noted.']
      ]
    },
    one: {
      actions: ['hear him out', 'leave on read', 'ask matcha'],
      lines: [
        ['system', 'QUESTION 01/03 // THE 11:47 PM TEXT'],
        ['story', 'Jay has been weird all day. At 11:47 he sends “Can we talk?”'],
        ['story', 'The typing indicator appears, disappears, appears again. This is somehow more damning than the message.'],
        ['story', 'Options: HEAR HIM OUT, LEAVE ON READ, or ASK MATCHA.']
      ]
    },
    two: {
      actions: ['accept apology', 'cross examine', 'order food'],
      lines: [
        ['system', 'QUESTION 02/03 // THE APOLOGY THAT CONTAINS JAY'],
        ['story', 'Jay submits an apology. It includes the phrase “I’m sorry you feel that way” and then, for some reason, a paragraph about Jay.'],
        ['story', 'The court requests calm. Nobody is calm. The request was aspirational.'],
        ['story', 'Pick one: ACCEPT APOLOGY, CROSS EXAMINE, or ORDER FOOD.']
      ]
    },
    three: {
      actions: ['spare jay', 'delete jay', 'let matcha decide'],
      lines: [
        ['system', 'QUESTION 03/03 // SENTENCING'],
        ['story', 'Jay somehow made it this far. The evidence is confused.'],
        ['story', 'Does he walk out as boyfriend, couch resident, or a contact that suddenly stops existing?'],
        ['story', 'SPARE JAY, DELETE JAY, or LET MATCHA DECIDE. The court has dinner plans.']
      ]
    }
  };

  let state = loadState();
  let audioContext = null;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(saveKey));
      return saved ? { ...defaultState, ...saved } : { ...defaultState };
    } catch (_) {
      return { ...defaultState };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(saveKey, JSON.stringify(state));
    } catch (_) {
      // Storage is optional. Poor decisions remain available in memory.
    }
  }

  function normalize(value) {
    return value.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  function line(type, text, delay = 0) {
    window.setTimeout(() => {
      const p = document.createElement('p');
      p.className = `log-line ${type}`;
      p.textContent = text;
      terminalLog.appendChild(p);
      terminalLog.parentElement.scrollTop = terminalLog.parentElement.scrollHeight;
    }, delay);
  }

  function printLines(lines, startDelay = 0) {
    lines.forEach(([type, text], index) => line(type, text, startDelay + index * 95));
  }

  function clearLog() {
    terminalLog.textContent = '';
  }

  function setActions(actions) {
    quickActions.textContent = '';
    actions.forEach(action => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quick-action';
      button.textContent = action;
      if (action === 'delete jay') button.dataset.danger = 'true';
      button.addEventListener('click', () => runCommand(action));
      quickActions.appendChild(button);
    });
  }

  function updateHud() {
    levelMeter.textContent = `${String(state.question).padStart(2, '0')}/03`;
    inventoryMeter.textContent = state.complete ? state.verdictKey : state.started ? 'deliberating' : 'pending';
    soundToggle.textContent = state.sound ? 'SOUND: ON' : 'SOUND: OFF';
    soundToggle.setAttribute('aria-pressed', String(state.sound));
  }

  function setScene(sceneName, shouldClear = true) {
    const scene = scenes[sceneName];
    if (!scene) return;
    if (shouldClear) clearLog();
    printLines(scene.lines);
    setActions(scene.actions);
    updateHud();
    saveState();
    window.setTimeout(() => terminalInput.focus({ preventScroll: true }), 50);
  }

  function commandEcho(command) {
    line('command', command);
    beep(430, 0.04);
  }

  function jolt() {
    gameScreen.classList.remove('terminal-jolt');
    void gameScreen.offsetWidth;
    gameScreen.classList.add('terminal-jolt');
    window.setTimeout(() => gameScreen.classList.remove('terminal-jolt'), 380);
  }

  function advance(sceneName) {
    saveState();
    window.setTimeout(() => setScene(sceneName), 720);
  }

  function runCommand(rawCommand) {
    const command = normalize(rawCommand);
    if (!command) return;
    commandEcho(command);
    terminalInput.value = '';

    if (['help', '?'].includes(command)) {
      line('system', 'Use the buttons or type an exact choice. Other commands: STATUS, JAY, MATCHA, LOVE, SCREENSHOTS, RESET.');
      return;
    }
    if (command === 'clear') {
      clearLog();
      return;
    }
    if (command === 'reset') {
      resetGame();
      return;
    }
    if (command === 'status') {
      line('reward', `QUESTION ${state.question}/3 // JAY: alive // CRYSTAL: considering options // MATCHA: refusing discovery requests`);
      return;
    }
    if (command === 'about') {
      line('story', 'Crystal wrote one paragraph about herself. Jay somehow became the defendant. This was always going to happen.');
      return;
    }
    if (['murder', 'kill jay', 'plan murder', 'murders'].includes(command)) {
      line('error', 'Wrong terminal. This one is for relationship admin, not actual crimes. Try DELETE JAY when the court is feeling dramatic.');
      jolt();
      beep(130, 0.1);
      return;
    }
    if (command === 'jay') {
      const reports = [
        'JAY STATUS: alive, slightly confused, currently typing and deleting the same sentence.',
        'JAY STATUS: building a defense that starts with “Okay but listen” and goes nowhere useful.',
        'JAY STATUS: refreshed the page twice to see if the verdict got nicer. It did not.'
      ];
      line('story', reports[Math.floor(Math.random() * reports.length)]);
      return;
    }
    if (command === 'matcha') {
      line('story', 'MATCHA: “I read the screenshots. Both of you need a handler. I am not volunteering.”');
      return;
    }
    if (command === 'love') {
      line('error', 'LOVE DETECTED. Extremely inconvenient. Prosecution just got harder and everyone is annoyed about it.');
      return;
    }
    if (command === 'screenshots') {
      line('story', '47 attachments located. The court has cancelled lunch and is reconsidering one friendship.');
      return;
    }
    if (command === 'sorry') {
      line('story', 'The word “sorry” was received. Evidence of actual change is still loading. Please wait.');
      return;
    }
    if (command === 'lawyer') {
      line('story', 'COUNSEL ASSIGNED: Matcha. Retainer is one tuna pouch. Attorney-client privilege does not exist in this house.');
      return;
    }

    if (!state.started || state.scene === 0) {
      if (command === 'start') {
        state.started = true;
        state.scene = 1;
        state.question = 1;
        setScene('one');
      } else {
        line('error', 'Hearing has not started. Type START. Jay would like the delay entered into the record. Denied.');
      }
      return;
    }

    if (state.scene === 1) {
      const responses = {
        'hear him out': 'Against every good instinct, Jay is allowed to speak. He starts with “Basically...” and then uses 600 words to dodge a single concrete noun.',
        'leave on read': 'The message sits on delivered so long it starts paying rent.',
        'ask matcha': 'Matcha looks at one screenshot, knocks the phone off the table, and invoices Crystal for “emotional labor.”'
      };
      if (responses[command]) {
        line('success', responses[command]);
        if (command === 'hear him out') state.mercy += 1;
        if (command === 'leave on read') state.harsh += 1;
        if (command === 'ask matcha') state.matcha += 1;
        state.scene = 2;
        state.question = 2;
        advance('two');
      } else {
        line('error', 'The court is staring. Pick HEAR HIM OUT, LEAVE ON READ, or ASK MATCHA. There is no fourth option that makes this less awkward.');
      }
      return;
    }

    if (state.scene === 2) {
      const responses = {
        'accept apology': 'Suspiciously mature. The court briefly checks whether Crystal has been replaced by a well-mannered impostor.',
        'cross examine': 'First question: how is Jay incapable of a normal text but can locate any specific reel in under four seconds?',
        'order food': 'Court is recessed. Nobody makes good rulings on an empty stomach. Especially not Crystal.'
      };
      if (responses[command]) {
        line('success', responses[command]);
        if (command === 'accept apology') state.mercy += 1;
        if (command === 'cross examine') state.harsh += 1;
        if (command === 'order food') state.matcha += 1;
        state.scene = 3;
        state.question = 3;
        advance('three');
      } else {
        line('error', 'Objection sustained. Choose ACCEPT APOLOGY, CROSS EXAMINE, or ORDER FOOD. The court is hungry and losing patience.');
      }
      return;
    }

    if (state.scene === 3) {
      const responses = {
        'spare jay': 'Jay is spared. This is not forgiveness. This is mercy that still has conditions and a memory.',
        'delete jay': 'DELETE accepted by the interface. Immediately rejected by reality, the dogs, and every adult in a three-mile radius. Sentence: couch.',
        'let matcha decide': 'Matcha looks at Jay. Looks at Crystal. Leaves the room. Mistrial by pure indifference. Nobody feels better.'
      };
      if (responses[command]) {
        line('success', responses[command]);
        if (command === 'spare jay') state.mercy += 3;
        if (command === 'delete jay') {
          state.harsh += 3;
          jolt();
        }
        if (command === 'let matcha decide') state.matcha += 3;
        finishHearing();
      } else {
        line('error', 'Last chance: SPARE JAY, DELETE JAY, or LET MATCHA DECIDE. The court has actual plans after this.');
      }
    }
  }

  function finishHearing() {
    const maxScore = Math.max(state.mercy, state.harsh, state.matcha);
    state.verdictKey = state.matcha === maxScore ? 'matcha' : state.harsh === maxScore ? 'harsh' : 'soft';
    const verdict = verdicts[state.verdictKey];
    state.verdict = verdict.title;
    state.verdictNote = verdict.note;
    state.scene = 4;
    state.question = 3;
    state.complete = true;
    saveState();
    updateHud();
    setActions([]);
    line('system', 'Calculating sentence...', 520);
    line('reward', verdict.title, 900);
    line('story', verdict.note, 1140);
    line('system', 'Opening the Crystal file before Jay appeals...', 1450);
    beep(820, 0.15);
    window.setTimeout(showReveal, 2200);
  }

  function resetGame() {
    try {
      localStorage.removeItem(saveKey);
    } catch (_) {
      // Continue with an in-memory reset.
    }
    state = { ...defaultState };
    clearLog();
    setScene('intro', false);
  }

  function restoreScene() {
    updateHud();
    if (state.complete) {
      window.setTimeout(showReveal, 80);
      return;
    }
    if (!state.started || state.scene === 0) setScene('intro');
    else if (state.scene === 1) setScene('one');
    else if (state.scene === 2) setScene('two');
    else setScene('three');
  }

  function applyVerdict() {
    const verdict = verdicts[state.verdictKey] || verdicts.soft;
    document.getElementById('caseVerdict').textContent = verdict.title;
    document.getElementById('caseVerdictNote').textContent = verdict.note;
    document.getElementById('jayCondition').textContent = verdict.condition;
    reveal.classList.remove('verdict-soft', 'verdict-harsh', 'verdict-matcha');
    reveal.classList.add(`verdict-${state.verdictKey === 'pending' ? 'soft' : state.verdictKey}`);
  }

  function showReveal() {
    applyVerdict();
    gameScreen.hidden = true;
    reveal.hidden = false;
    document.body.classList.add('reveal-active');
    window.scrollTo(0, 0);
    observeSections();
    burstConfetti(state.verdictKey === 'harsh' ? 34 : 48);
  }

  function showGame(reset = false) {
    if (reset) resetGame();
    reveal.hidden = true;
    gameScreen.hidden = false;
    document.body.classList.remove('reveal-active');
    window.scrollTo(0, 0);
    if (!reset) restoreScene();
    window.setTimeout(() => terminalInput.focus(), 80);
  }

  function beep(frequency = 440, duration = 0.05) {
    if (!state.sound) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.025, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (_) {
      state.sound = false;
      updateHud();
    }
  }

  terminalForm.addEventListener('submit', event => {
    event.preventDefault();
    runCommand(terminalInput.value);
  });

  soundToggle.addEventListener('click', () => {
    state.sound = !state.sound;
    saveState();
    updateHud();
    beep(620, 0.08);
  });

  document.getElementById('resetGame').addEventListener('click', resetGame);
  document.getElementById('replayGame').addEventListener('click', () => showGame(true));
  document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  let toastTimer = null;
  function toast(message) {
    const toastEl = document.getElementById('toast');
    toastEl.textContent = message;
    toastEl.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  const animalReports = {
    'Dog One': 'WITNESS 01: Jay approached the door. I barked. Case closed. I am very good at this.',
    'Dog Two': 'WITNESS 02: I will change any testimony for cheese. This is not corruption. This is negotiation.',
    'Dog Three': 'WITNESS 03: Crystal was upset. I sat next to her. Jay tried to speak. I made eye contact that said “do not.”',
    'Matcha': 'MATCHA: I reviewed the messages. Both of you need supervision. I am not applying for the job.',
    'Dog Four': 'WITNESS 04: The hair is still elite. Jay’s explanation is not.',
    'Dog Five': 'WITNESS 05: I know exactly where Jay sleeps. This is not a threat. It is just information I happen to have.'
  };

  document.querySelectorAll('.animal-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.animal;
      document.getElementById('animalMessage').textContent = animalReports[name];
      card.animate([
        { transform: 'translateY(0) rotate(0)' },
        { transform: 'translateY(-12px) rotate(-2deg)' },
        { transform: 'translateY(0) rotate(0)' }
      ], { duration: 420, easing: 'ease-out' });
    });
  });

  const garden = document.getElementById('flowerGarden');
  let flowerColor = 'pink';
  const colorMap = { pink: '#ff5ca8', gold: '#e6bd63', black: '#33222f' };

  document.querySelectorAll('.garden-color').forEach(button => {
    button.addEventListener('click', () => {
      flowerColor = button.dataset.color;
      document.querySelectorAll('.garden-color').forEach(item => item.classList.toggle('active', item === button));
    });
  });

  function plantFlower(x, y) {
    const rect = garden.getBoundingClientRect();
    const localX = Math.min(Math.max(x - rect.left, 38), rect.width - 38);
    const localY = Math.min(Math.max(y - rect.top, 150), rect.height - 8);
    const flower = document.createElement('div');
    flower.className = 'planted-flower';
    flower.style.left = `${localX}px`;
    flower.style.top = `${localY}px`;
    flower.style.setProperty('--flower-color', colorMap[flowerColor]);
    flower.style.zIndex = String(Math.round(localY));
    flower.innerHTML = '<span class="stem"></span><span class="leaf"></span><span class="leaf right"></span><span class="bloom"><i class="petal"></i><i class="petal"></i><i class="petal"></i><i class="petal"></i><i class="petal"></i><b class="center"></b></span>';
    garden.appendChild(flower);
    const instruction = garden.querySelector('.garden-instruction');
    if (instruction) instruction.hidden = true;
    beep(520 + Math.random() * 180, 0.06);
  }

  garden.addEventListener('pointerdown', event => plantFlower(event.clientX, event.clientY));
  garden.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const rect = garden.getBoundingClientRect();
      plantFlower(rect.left + rect.width * (.25 + Math.random() * .5), rect.top + rect.height * (.55 + Math.random() * .35));
    }
  });

  document.getElementById('clearGarden').addEventListener('click', event => {
    event.stopPropagation();
    garden.querySelectorAll('.planted-flower').forEach(flower => flower.remove());
    const instruction = garden.querySelector('.garden-instruction');
    if (instruction) instruction.hidden = false;
    toast('Evidence erased. The flowers still know. They just can’t prove it anymore.');
  });

  const necklace = document.getElementById('necklace');
  const selected = { metal: 'gold', stone: 'pink', mood: 'regal' };
  document.querySelectorAll('.jewel-controls input').forEach(input => {
    input.addEventListener('change', () => {
      selected[input.name] = input.value;
      necklace.className = `necklace metal-${selected.metal} stone-${selected.stone} mood-${selected.mood}`;
      beep(720, 0.05);
    });
  });

  const pieceNames = {
    regal: ['Probable Cause', 'Too Expensive to Forgive', 'The Last Nerve'],
    soft: ['I Said I’m Fine', 'Soft Menace', 'Apology Still Buffering'],
    chaos: ['Exhibit A', 'Do Not Put That in Writing', 'Matcha Already Saw It']
  };

  document.getElementById('namePiece').addEventListener('click', () => {
    const names = pieceNames[selected.mood];
    const name = names[Math.floor(Math.random() * names.length)];
    document.getElementById('pieceName').textContent = name;
    toast(`Evidence labeled: ${name}`);
    burstConfetti(14);
  });

  const dreamModal = document.getElementById('dreamModal');
  const dreamText = document.getElementById('dreamText');
  const closeDream = document.getElementById('closeDream');
  let lastDreamTrigger = null;

  document.querySelectorAll('.dream-card').forEach(card => {
    card.addEventListener('click', () => {
      lastDreamTrigger = card;
      dreamText.textContent = card.dataset.dream;
      dreamModal.hidden = false;
      closeDream.focus();
    });
  });

  function closeDreamModal() {
    dreamModal.hidden = true;
    if (lastDreamTrigger) lastDreamTrigger.focus();
  }

  closeDream.addEventListener('click', closeDreamModal);
  dreamModal.addEventListener('click', event => {
    if (event.target === dreamModal) closeDreamModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !dreamModal.hidden) closeDreamModal();
  });

  function burstConfetti(count = 40) {
    const layer = document.getElementById('confettiLayer');
    const colors = ['#ff5ca8', '#e6bd63', '#fff0f7', '#1c1119'];
    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement('i');
      piece.className = 'confetti';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty('--drift', `${-120 + Math.random() * 240}px`);
      piece.style.animationDelay = `${Math.random() * .45}s`;
      piece.style.animationDuration = `${2.4 + Math.random() * 1.8}s`;
      layer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 4800);
    }
  }

  function controlledChaos() {
    reveal.classList.add('chaos-flash');
    burstConfetti(48);
    toast('Jay has started apologizing for things that have not happened yet.');
    window.setTimeout(() => reveal.classList.remove('chaos-flash'), 1000);
  }

  document.getElementById('chaosButton').addEventListener('click', controlledChaos);
  document.getElementById('finalChaos').addEventListener('click', () => {
    controlledChaos();
    document.querySelectorAll('.animal-card').forEach((card, index) => {
      window.setTimeout(() => card.animate([
        { transform: 'translateY(0) rotate(0)' },
        { transform: `translateY(-${18 + Math.random() * 25}px) rotate(${-6 + Math.random() * 12}deg)` },
        { transform: 'translateY(0) rotate(0)' }
      ], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' }), index * 55);
    });
  });

  function observeSections() {
    const sections = document.querySelectorAll('.section-observe');
    if (!('IntersectionObserver' in window)) {
      sections.forEach(section => section.classList.add('in-view'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    sections.forEach(section => observer.observe(section));
  }

  restoreScene();
})();
