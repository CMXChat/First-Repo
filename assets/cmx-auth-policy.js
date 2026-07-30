'use strict';

const ACCESS_AUTH_KEY = 'cmx_auth_v6';
const ACCESS_AUTH_VERSION = 6;

/* Retire the previous 16-character policy once without clearing new sessions. */
if (localStorage.getItem('cmx_auth_v5')) {
  localStorage.removeItem('cmx_auth_v5');
  sessionStorage.removeItem(KEY.session);
}

strongPassphrase = function passwordAccepted(password) {
  return typeof password === 'string' && password.length >= 6;
};

authData = function currentAuthData() {
  const auth = readJson(localStorage, ACCESS_AUTH_KEY, null);
  if (!auth || auth.version !== ACCESS_AUTH_VERSION || auth.username !== ADMIN_USERNAME) return null;
  return auth;
};

createVault = async function createAccessibleVault() {
  const password = $('#setupPassword').value;
  const confirmation = $('#setupConfirm').value;
  if (!strongPassphrase(password)) return gateMessage('Use at least 6 characters.', 'bad');
  if (password !== confirmation) return gateMessage('Password confirmation does not match.', 'bad');

  gateMessage('Establishing verifier...', 'info');
  try {
    const salt = crypto.getRandomValues(new Uint8Array(32));
    const hash = await deriveVerifier(password, salt);
    writeJson(localStorage, ACCESS_AUTH_KEY, {
      version: ACCESS_AUTH_VERSION,
      username: ADMIN_USERNAME,
      salt: toBase64(salt),
      hash,
      iterations: ITERATIONS,
      failures: 0,
      lockedUntil: 0,
      createdAt: new Date().toISOString()
    });
    writeJson(sessionStorage, KEY.session, { username: ADMIN_USERNAME, at: Date.now() });
    $('#setupPassword').value = '';
    $('#setupConfirm').value = '';
    gateMessage('Access initialized.', 'ok');
    setTimeout(() => launch(), 240);
  } catch {
    gateMessage('Unable to initialize access.', 'bad');
  }
};

unlock = async function unlockAccessibleVault() {
  const auth = authData();
  if (!auth) return showGate();

  const remaining = Math.ceil((Number(auth.lockedUntil || 0) - Date.now()) / 1000);
  if (remaining > 0) return gateMessage(`Access temporarily suspended. Retry in ${remaining}s.`, 'bad');

  const password = $('#loginPassword').value;
  if (!password) return gateMessage('Enter the admin password.', 'bad');
  gateMessage('Verifying...', 'info');

  try {
    const candidate = await deriveVerifier(password, fromBase64(auth.salt), auth.iterations || ITERATIONS);
    const valid = constantTimeEqual(candidate, auth.hash);
    $('#loginPassword').value = '';

    if (!valid) {
      auth.failures = Number(auth.failures || 0) + 1;
      const lockSeconds = auth.failures >= 10 ? 300 : auth.failures >= 5 ? 30 : 0;
      auth.lockedUntil = lockSeconds ? Date.now() + lockSeconds * 1000 : 0;
      writeJson(localStorage, ACCESS_AUTH_KEY, auth);
      return gateMessage(lockSeconds ? `Access denied. Retry in ${lockSeconds}s.` : 'Access denied.', 'bad');
    }

    auth.failures = 0;
    auth.lockedUntil = 0;
    auth.lastLogin = new Date().toISOString();
    writeJson(localStorage, ACCESS_AUTH_KEY, auth);
    writeJson(sessionStorage, KEY.session, { username: ADMIN_USERNAME, at: Date.now() });
    gateMessage('Access granted.', 'ok');
    setTimeout(() => launch(), 180);
  } catch {
    gateMessage('Authentication failed.', 'bad');
  }
};
