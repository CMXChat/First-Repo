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
      note: 'Crystal permits continued existence subject to improved behavior, snacks, and no speeches beginning with “technically.”',
      condition: 'Alive. Grateful. About to ruin it by explaining his side.'
    },
    harsh: {
      title: 'JAY SURVIVES, BUT IN RESTRICTED MODE',
      note: 'Indoor privileges suspended. Phone monitored by five dogs. The couch has accepted the transfer.',
      condition: 'Alive. On the couch. Typing a paragraph nobody requested.'
    },
    matcha: {
      title: 'MISTRIAL: MATCHA REFUSED THE PAPERWORK',
      note: 'Jay survives because the cat could not be bothered. This is the strongest legal defense he had.',
      condition: 'Alive by feline administrative failure. Deeply humbled, probably temporarily.'
    }
  };

  // RESTORED - full content too long for this channel; see next message for full funny rewrite
  console.log('restored stub - full push incoming');
})();
