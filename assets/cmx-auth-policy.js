'use strict';

/**
 * Root homepage authentication policy.
 *
 * Security boundary:
 * - Password verification happens only in the jay-app Python backend.
 * - This public file contains no password, salt, verifier, hash, or database value.
 * - The trace below is presentation only; access is granted exclusively from
 *   successful backend responses and a server-validated administrator token.
 * - Private data must be returned by authenticated backend endpoints. Static
 *   GitHub Pages source remains public even when this gate hides the interface.
 */
const HOME_AUTH_API = 'https://sturdy-space-tribble-qwgq456pq6gfxvjr-8000.app.github.dev/api/v1';
const HOME_LOGIN_URL = `${HOME_AUTH_API}/login/homepage-access`;
const HOME_SESSION_URL = `${HOME_AUTH_API}/login/homepage-session`;
const HOME_TRACE_DELAY_MS = 150;

authData = function backendCredentialAvailable() {
  return { version: 4, username: ADMIN_USERNAME, provider: 'jay-app' };
};

createVault = async function backendCredentialSetupDisabled() {
  gateMessage('Credential provisioning is managed by the backend.', 'bad');
};

function waitForGateTrace(delay = HOME_TRACE_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function resetGateTrace() {
  const output = $('#gateOutput');
  output.textContent = '';
  output.className = 'gate-output gate-trace';
  return output;
}

async function addGateTrace(tag, text, type = 'muted', delay = HOME_TRACE_DELAY_MS) {
  const output = $('#gateOutput');
  if (!output.classList.contains('gate-trace')) resetGateTrace();

  const row = document.createElement('div');
  row.className = `gate-trace-line ${type}`;

  const marker = document.createElement('span');
  marker.className = 'gate-trace-marker';
  marker.textContent = tag;

  const copy = document.createElement('span');
  copy.textContent = text;

  row.append(marker, copy);
  output.appendChild(row);
  output.scrollTop = output.scrollHeight;
  await waitForGateTrace(delay);
}

async function validateBackendSession(token) {
  if (!token) return false;

  try {
    const response = await fetch(HOME_SESSION_URL, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      credentials: 'omit',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return response.ok;
  } catch {
    return false;
  }
}

unlock = async function unlockWithBackend() {
  const passwordInput = $('#loginPassword');
  let password = passwordInput.value;
  if (!password) return gateMessage('Enter the admin password.', 'bad');

  const unlockButton = $('#unlockBtn');
  unlockButton.disabled = true;
  passwordInput.disabled = true;
  resetGateTrace();

  try {
    await addGateTrace('[ INIT ]', 'Preparing restricted authentication channel.', 'info');
    await addGateTrace('[ TLS  ]', 'Opening encrypted connection to jay-app.', 'info');
    await addGateTrace('[ API  ]', 'Sending credential directly to Python.', 'info');

    const response = await fetch(HOME_LOGIN_URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-store',
      credentials: 'omit',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });
    passwordInput.value = '';
    password = '';

    if (!response.ok) {
      await addGateTrace(
        response.status === 401 ? '[ DENY ]' : '[ FAIL ]',
        response.status === 401
          ? 'Backend rejected the credential.'
          : 'Authentication service returned an error.',
        'bad',
        0
      );
      return;
    }

    await addGateTrace('[  OK  ]', 'Python verified the stored password hash.', 'ok');
    await addGateTrace('[  OK  ]', 'Active administrator role confirmed.', 'ok');

    const result = await response.json();
    if (typeof result.access_token !== 'string' || !result.access_token) {
      await addGateTrace('[ FAIL ]', 'Backend response did not contain session proof.', 'bad', 0);
      return;
    }

    writeJson(sessionStorage, KEY.session, {
      username: ADMIN_USERNAME,
      token: result.access_token,
      at: Date.now()
    });

    await addGateTrace('[  OK  ]', 'Signed 30-minute tab session received.', 'ok');
    await addGateTrace('[ OPEN ]', 'Access granted. Launching restricted node.', 'success', 260);
    launch();
  } catch {
    passwordInput.value = '';
    password = '';
    await addGateTrace(
      '[ OFFLINE ]',
      'Python backend is unavailable. Confirm the Codespace and port 8000 are running.',
      'bad',
      0
    );
  } finally {
    unlockButton.disabled = false;
    passwordInput.disabled = false;
    passwordInput.focus();
  }
};
