'use strict';

async function hashCommand(args) {
  const algorithmInput = (args[0] || 'sha256').toLowerCase().replace('-', '');
  const algorithms = { sha1: 'SHA-1', sha256: 'SHA-256', sha384: 'SHA-384', sha512: 'SHA-512' };
  const algorithm = algorithms[algorithmInput];
  const text = args.slice(1).join(' ');
  if (!algorithm || !text) return line('Usage: hash <sha1|sha256|sha384|sha512> <text>', 'error');
  const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(text));
  const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  line(`${algorithm}: ${hex}`, 'success');
}

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function base64ToUtf8(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function base64Command(args) {
  const action = (args[0] || '').toLowerCase();
  const value = args.slice(1).join(' ');
  if (!value || !['encode', 'decode'].includes(action)) return line('Usage: base64 <encode|decode> <text>', 'error');
  try {
    line(action === 'encode' ? utf8ToBase64(value) : base64ToUtf8(value), 'success');
  } catch {
    line('Invalid Base64 input.', 'error');
  }
}

function jsonCommand(args) {
  const action = (args[0] || 'format').toLowerCase();
  const value = args.slice(1).join(' ');
  if (!value) return line('Usage: json <format|validate|minify> <json>', 'error');
  try {
    const parsed = JSON.parse(value);
    if (action === 'validate') return line('Valid JSON.', 'success');
    if (action === 'minify') return line(JSON.stringify(parsed), 'success');
    if (action === 'format') return JSON.stringify(parsed, null, 2).split('\n').forEach((item) => line(item));
    return line('Usage: json <format|validate|minify> <json>', 'error');
  } catch (error) {
    line(`Invalid JSON: ${error.message}`, 'error');
  }
}

function urlCommand(args) {
  const action = (args[0] || 'inspect').toLowerCase();
  const value = args.slice(1).join(' ');
  if (!value) return line('Usage: url <inspect|encode|decode> <value>', 'error');
  if (action === 'encode') return line(encodeURIComponent(value), 'success');
  if (action === 'decode') {
    try { return line(decodeURIComponent(value), 'success'); } catch { return line('Invalid URL-encoded value.', 'error'); }
  }
  if (action !== 'inspect') return line('Usage: url <inspect|encode|decode> <value>', 'error');
  try {
    const parsed = new URL(value.includes('://') ? value : `https://${value}`);
    const params = [...parsed.searchParams.entries()];
    printRows([
      ['Protocol', parsed.protocol.replace(':', '')],
      ['Host', parsed.host],
      ['Hostname', parsed.hostname],
      ['Port', parsed.port || '(default)'],
      ['Path', parsed.pathname || '/'],
      ['Query', parsed.search || '(none)'],
      ['Fragment', parsed.hash || '(none)'],
      ['Username', parsed.username || '(none)'],
      ['Parameters', String(params.length)]
    ], ['FIELD', 'VALUE']);
    if (params.length) printRows(params, ['PARAMETER', 'VALUE']);
  } catch {
    line('Invalid URL.', 'error');
  }
}

function timestampCommand(args) {
  const action = (args[0] || 'now').toLowerCase();
  if (action === 'now') {
    const now = new Date();
    return printRows([
      ['ISO', now.toISOString()],
      ['Unix seconds', String(Math.floor(now.getTime() / 1000))],
      ['Unix milliseconds', String(now.getTime())],
      ['Local', now.toString()]
    ], ['FORMAT', 'VALUE']);
  }
  if (action === 'convert') {
    const raw = args[1];
    if (!raw) return line('Usage: timestamp convert <unix|ISO date>', 'error');
    let date;
    if (/^\d{10,13}$/.test(raw)) date = new Date(Number(raw) * (raw.length === 10 ? 1000 : 1));
    else date = new Date(args.slice(1).join(' '));
    if (Number.isNaN(date.getTime())) return line('Invalid timestamp.', 'error');
    return printRows([
      ['ISO', date.toISOString()],
      ['Unix seconds', String(Math.floor(date.getTime() / 1000))],
      ['Local', date.toString()]
    ], ['FORMAT', 'VALUE']);
  }
  return line('Usage: timestamp <now|convert> [value]', 'error');
}

function uuidCommand() {
  line(crypto.randomUUID(), 'success');
}

function randomCommand(args) {
  const requested = Number(args[0] || 32);
  const length = Math.min(256, Math.max(4, Number.isFinite(requested) ? Math.floor(requested) : 32));
  const bytes = crypto.getRandomValues(new Uint8Array(Math.ceil(length * 0.75) + 4));
  const value = toBase64(bytes).replace(/[+/=]/g, '').slice(0, length);
  line(value, 'success');
}

function diffCommand(args) {
  const separator = args.indexOf('--');
  if (separator === -1) return line('Usage: diff <first text> -- <second text>', 'error');
  const left = args.slice(0, separator).join(' ');
  const right = args.slice(separator + 1).join(' ');
  if (left === right) return line('No difference.', 'success');
  const leftWords = left.split(/\s+/);
  const rightWords = right.split(/\s+/);
  const max = Math.max(leftWords.length, rightWords.length);
  const rows = [];
  for (let index = 0; index < max; index += 1) {
    if (leftWords[index] !== rightWords[index]) rows.push([String(index + 1), leftWords[index] || '(missing)', rightWords[index] || '(missing)']);
  }
  printRows(rows, ['POSITION', 'FIRST', 'SECOND']);
}

function buildSearchQuery(type, value, extra = []) {
  const quoted = `"${value}"`;
  if (type === 'exact') return quoted;
  if (type === 'site') return `site:${extra[0] || ''} ${quoted}`.trim();
  if (type === 'username') return `${quoted} OR "@${value}"`;
  if (type === 'email') return quoted;
  if (type === 'domain') return `site:${value} OR "${value}"`;
  if (type === 'documents') return `site:${value} (filetype:pdf OR filetype:docx OR filetype:xlsx)`;
  if (type === 'images') return quoted;
  if (type === 'mentions') return quoted;
  return [type, value, ...extra].filter(Boolean).join(' ');
}

function searchCommand(args) {
  const type = (args[0] || '').toLowerCase();
  if (!type) return line('Usage: search <exact|site|username|email|domain|documents|images|mentions> <target>', 'error');
  let value;
  let extra = [];
  if (type === 'site') {
    extra = [args[1]];
    value = args.slice(2).join(' ');
  } else {
    value = args.slice(1).join(' ');
  }
  if (!value) return line('Search target is required.', 'error');
  const query = buildSearchQuery(type, value, extra);
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}${type === 'images' ? '&tbm=isch' : ''}`;
  line(`Query: ${query}`, 'success');
  line('Opening search in a new tab.', 'info');
  window.open(url, '_blank', 'noopener,noreferrer');
}

function queryCommand(args) {
  const platform = (args[0] || '').toLowerCase();
  const target = args.slice(1).join(' ');
  if (!platform || !target) return line('Usage: query <google|github|reddit|linkedin|wayback|crt|shodan|censys> <target>', 'error');
  const generators = {
    google: [`"${target}"`, `"${target}" filetype:pdf`, `site:github.com "${target}"`, `site:reddit.com "${target}"`],
    github: [`"${target}"`, `"@${target}"`, `filename:.env "${target}"`, `filename:config "${target}"`],
    reddit: [`site:reddit.com "${target}"`, `site:reddit.com/user "${target}"`],
    linkedin: [`site:linkedin.com/in "${target}"`, `site:linkedin.com/company "${target}"`],
    wayback: [`https://web.archive.org/web/*/${target}`],
    crt: [`https://crt.sh/?q=${encodeURIComponent(target)}`],
    shodan: [`hostname:${target}`, `ssl:${target}`],
    censys: [`services.tls.certificates.leaf_data.names: ${target}`]
  };
  const values = generators[platform];
  if (!values) return line('Unknown query platform.', 'error');
  line(`${platform.toUpperCase()} QUERY SET`, 'success');
  values.forEach((value) => line(value));
}

function intelCommand(args) {
  const type = (args[0] || '').toLowerCase();
  const target = args.slice(1).join(' ').trim();
  if (!type || !target) return line('Usage: intel <domain|website|phone|email|username|image|file> <target>', 'error');
  const plans = {
    domain: ['url inspect TARGET', 'search domain TARGET', 'query crt TARGET', 'query wayback TARGET', 'runbook domain'],
    website: ['site inspect TARGET (same-origin only)', 'search exact TARGET', 'query wayback TARGET', 'runbook website-audit'],
    phone: ['open phone', 'search exact TARGET', 'runbook phone', 'Carrier lookup requires the protected backend.'],
    email: ['search email TARGET', 'query github TARGET', 'Inspect the email domain separately.', 'Mailbox ownership is not inferred.'],
    username: ['search username TARGET', 'query github TARGET', 'query reddit TARGET', 'runbook username'],
    image: ['open metadata', 'open search', 'runbook evidence-handling'],
    file: ['open metadata', 'hash sha256 <file text is unsupported>', 'runbook evidence-handling']
  };
  const plan = plans[type];
  if (!plan) return line('Supported types: domain, website, phone, email, username, image, file', 'error');
  line(`INTELLIGENCE LAUNCHER // ${type.toUpperCase()}`, 'success');
  line(`Target: ${target}`, 'info');
  plan.forEach((step, index) => line(`${index + 1}. ${step.replaceAll('TARGET', target)}`));
}

async function repoCommand(args) {
  const action = (args[0] || 'status').toLowerCase();
  if (!['status', 'latest'].includes(action)) return line('Usage: repo <status|latest>', 'error');
  startRequest('GitHub repository status');
  try {
    const [repoResponse, commitResponse] = await Promise.all([
      fetchWithTimeout('https://api.github.com/repos/CMXChat/First-Repo'),
      fetchWithTimeout('https://api.github.com/repos/CMXChat/First-Repo/commits?per_page=1')
    ]);
    if (!repoResponse.ok || !commitResponse.ok) throw new Error(`GitHub API returned ${repoResponse.status}/${commitResponse.status}`);
    const repo = await repoResponse.json();
    const commits = await commitResponse.json();
    const latest = commits[0];
    printRows([
      ['Repository', repo.full_name],
      ['Default branch', repo.default_branch],
      ['Visibility', repo.private ? 'private' : 'public'],
      ['Updated', repo.updated_at],
      ['Latest commit', latest?.sha?.slice(0, 12) || '(unknown)'],
      ['Commit date', latest?.commit?.committer?.date || '(unknown)'],
      ['Message', latest?.commit?.message?.split('\n')[0] || '(unknown)']
    ], ['FIELD', 'VALUE']);
  } catch (error) {
    line(`Repository status failed: ${error.message}`, 'error');
  } finally {
    endRequest();
  }
}

async function monitorCommand(args) {
  const action = (args[0] || 'status').toLowerCase();
  if (!['status', 'tools', 'all'].includes(action)) return line('Usage: monitor <status|tools|all>', 'error');
  return checkAllRoutes();
}

function termuxCommand(args) {
  const action = (args[0] || 'status').toLowerCase();
  if (action === 'status') {
    return printRows([
      ['State', 'DISCONNECTED'],
      ['Agent', 'not paired'],
      ['Transport', 'private HTTPS/WSS relay planned'],
      ['Remote shell', 'disabled'],
      ['Allowed execution', 'approved actions only']
    ], ['FIELD', 'VALUE']);
  }
  if (action === 'capabilities') {
    return [
      'Planned allowlisted capabilities:',
      'system info · disk usage · network checks · DNS lookup',
      'file hashing · Git status/pull · controlled deployment checks',
      'approved scripts with fixed arguments · no arbitrary shell execution'
    ].forEach((item, index) => line(item, index === 0 ? 'success' : ''));
  }
  if (action === 'architecture' || action === 'plan') {
    line('TERMUX BRIDGE ARCHITECTURE', 'success');
    line('1. Termux agent creates an outbound authenticated connection.');
    line('2. A private CMX relay validates operator and action permissions.');
    line('3. The web terminal submits only allowlisted jobs.');
    line('4. The agent returns structured results and execution logs.');
    line('5. Tokens remain in environment variables, never browser JavaScript.');
    return;
  }
  return line('Usage: termux <status|capabilities|architecture>', 'error');
}
