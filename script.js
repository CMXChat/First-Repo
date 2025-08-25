const output = document.getElementById('output');
const loginContainer = document.getElementById('login-container');
const briefing = document.getElementById('briefing');
const countdownEl = document.getElementById('countdown');
const terminal = document.getElementById('terminal');

function authenticate() {
  const id = document.getElementById('agent').value.trim().toLowerCase();
  const pass = document.getElementById('pass').value.trim();

  if (id === 'agent47' && pass === 'classified') {
    output.textContent = 'Access Granted. Welcome, Agent 47.';
    setTimeout(() => {
      loginContainer.style.display = 'none';
      briefing.style.display = 'block';
      countdownEl.style.display = 'block';
      startCountdown();
    }, 1000);
  } else {
    output.textContent = 'Access Denied. Check credentials.';
  }
}

function startCountdown() {
  let timeLeft = 10;
  countdownEl.textContent = `THIS MESSAGE WILL SELF-DESTRUCT IN ${timeLeft} SECONDS.`;

  const interval = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      countdownEl.textContent = `THIS MESSAGE WILL SELF-DESTRUCT IN ${timeLeft} SECONDS.`;
    } else {
      clearInterval(interval);
      briefing.style.display = 'none';
      countdownEl.textContent = 'MESSAGE ERASED.';
      setTimeout(() => {
        countdownEl.style.display = 'none';
        terminal.style.display = 'block';
        startTerminalFeed();
      }, 1000);
    }
  }, 1000);
}

const logs = [
  '[CMX AI] Scanning global SEO signals...',
  '[CMX AI] Syncing with Discord command logs...',
  '[CMX AI] Merging OSINT records...',
  '[CMX AI] Updating threat matrix (level 3)...',
  '[CMX AI] Deploying shadow indexing layer...',
  '[CMX AI] Monitoring CMX dashboard feeds...',
  '[CMX AI] Injecting conversion beacon...',
  '[CMX AI] Deep learning audit patterns...',
  '[CMX AI] Cross-referencing global agent nodes...',
  '[CMX AI] System status: UPDATED. Awaiting further instructions...'
];

function startTerminalFeed() {
  let index = 0;
  const interval = setInterval(() => {
    const line = logs[index];
    terminal.textContent += `\n${line}`;
    terminal.scrollTop = terminal.scrollHeight;
    index++;
    if (index === logs.length) clearInterval(interval);
  }, 1500);
}
