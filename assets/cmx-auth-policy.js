'use strict';

/**
 * Root homepage authentication policy.
 *
 * Password verification happens only in the jay-app backend. This public file
 * intentionally contains no password, salt, verifier, hash, or database value.
 */
const HOME_AUTH_API = 'https://sturdy-space-tribble-qwgq456pq6gfxvjr-8000.app.github.dev/api/v1';
const HOME_LOGIN_URL = `${HOME_AUTH_API}/login/homepage-access`;
const HOME_SESSION_URL = `${HOME_AUTH_API}/login/homepage-session`;

authData = function backendCredentialAvailable() {
  return { version: 3, username: ADMIN_USERNAME, provider: 'jay-app' };
};

createVault = async function backendCredentialSetupDisabled() {
  gateMessage('Credential provisioning is managed by the backend.', 'bad');
};

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
  const password = passwordInput.value;
  if (!password) return gateMessage('Enter the admin password.', 'bad');

  gateMessage('Verifying with secure backend...', 'info');
  $('#unlockBtn').disabled = true;

  try {
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

    if (!response.ok) {
      gateMessage(
        response.status === 401 ? 'Access denied.' : 'Authentication service unavailable.',
        'bad'
      );
      return;
    }

    const result = await response.json();
    if (typeof result.access_token !== 'string' || !result.access_token) {
      gateMessage('Authentication service returned an invalid response.', 'bad');
      return;
    }

    writeJson(sessionStorage, KEY.session, {
      username: ADMIN_USERNAME,
      token: result.access_token,
      at: Date.now()
    });
    gateMessage('Access granted.', 'ok');
    setTimeout(() => launch(), 180);
  } catch {
    passwordInput.value = '';
    gateMessage('Authentication service unavailable. Confirm the backend is running.', 'bad');
  } finally {
    $('#unlockBtn').disabled = false;
  }
};
