'use strict';

async function hashCommand(args) {
  const algorithmInput = (args[0] || 'sha256').toLowerCase().replace('-', '');
  const algorithms = { sha1: 'SHA-1', sha256: 'SHA-256', sha384: 'SHA-384', sha512: 'SHA-512' };
  const algorithm = algorithms[algorithmInput];
  const text = args.slice(1).join(' ');
  if (!algorithm || !text) return line('Usage: hash <sha1|sha256|sha384|sha512> <text>', 'error');
  const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(text));
  line(`${algorithm}: ${[...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`, 'success');
}

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function base64ToUtf8(value) {
  return new TextDecoder().decode(Uint8Array.from(atob(value), (char) => char.charCodeAt(0)));
}

function base64Command(args) {
  const action = (args[0] || '').toLowerCase();
  const value = args.slice(1).join(' ');
  if (!value || !['encode', 'decode'].includes(action)) return line('Usage: base64 <encode|decode> <text>', 'error');
  try { line(action === 'encode' ? utf8ToBase64(value) : base64ToUtf8(value), 'success'); }
  catch { line('Invalid Base64 input.', 'error'); }
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
  } catch { line('Invalid JSON.', 'error'); }
}

function urlCommand(args) {
  const action = (args[0] || 'inspect').toLowerCase();
  const value = args.slice(1).join(' ');
  if (!value) return line('Usage: url <inspect|encode|decode> <value>', 'error');
  if (action === 'encode') return line(encodeURIComponent(value), 'success');
  if (action === 'decode') {
    try { return line(decodeURIComponent(value), 'success'); }
    catch { return line('Invalid URL-encoded value.', 'error'); }
  }
  if (action !== 'inspect') return line('Usage: url <inspect|encode|decode> <value>', 'error');
  try {
    const parsed = new URL(value.includes('://') ? value : `https://${value}`);
    const params = [...parsed.searchParams.entries()];
    printRows([
      ['Protocol', parsed.protocol.replace(':', '')],
      ['Host', parsed.host],
      ['Path', parsed.pathname || '/'],
      ['Query', parsed.search || '(none)'],
      ['Fragment', parsed.hash || '(none)'],
      ['Parameters', String(params.length)]
    ], ['FIELD', 'VALUE']);
    if (params.length) printRows(params, ['PARAMETER', 'VALUE']);
  } catch { line('Invalid URL.', 'error'); }
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
    const date = /^\d{10,13}$/.test(raw) ? new Date(Number(raw) * (raw.length === 10 ? 1000 : 1)) : new Date(args.slice(1).join(' '));
    if (Number.isNaN(date.getTime())) return line('Invalid timestamp.', 'error');
    return printRows([['ISO', date.toISOString()], ['Unix seconds', String(Math.floor(date.getTime() / 1000))], ['Local', date.toString()]], ['FORMAT', 'VALUE']);
  }
  return line('Usage: timestamp <now|convert> [value]', 'error');
}

function uuidCommand() { line(crypto.randomUUID(), 'success'); }

function randomCommand(args) {
  const requested = Number(args[0] || 32);
  const length = Math.min(256, Math.max(4, Number.isFinite(requested) ? Math.floor(requested) : 32));
  const bytes = crypto.getRandomValues(new Uint8Array(Math.ceil(length * 0.75) + 4));
  line(toBase64(bytes).replace(/[+/=]/g, '').slice(0, length), 'success');
}

function diffCommand(args) {
  const separator = args.indexOf('--');
  if (separator === -1) return line('Usage: diff <first text> -- <second text>', 'error');
  const left = args.slice(0, separator).join(' ');
  const right = args.slice(separator + 1).join(' ');
  if (left === right) return line('No difference.', 'success');
  const leftWords = left.split(/\s+/);
  const rightWords = right.split(/\s+/);
  const rows = [];
  for (let index = 0; index < Math.max(leftWords.length, rightWords.length); index += 1) {
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
  return quoted;
}

function searchCommand(args) {
  const type = (args[0] || '').toLowerCase();
  if (!type) return line('Usage: search <exact|site|username|email|domain|documents|images|mentions> <target>', 'error');
  let value;
  let extra = [];
  if (type === 'site') { extra = [args[1]]; value = args.slice(2).join(' '); }
  else value = args.slice(1).join(' ');
  if (!value) return line('Search target is required.', 'error');
  const query = buildSearchQuery(type, value, extra);
  line(`Query: ${query}`, 'success');
  window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}${type === 'images' ? '&tbm=isch' : ''}`, '_blank', 'noopener,noreferrer');
}

function queryCommand(args) {
  const platform = (args[0] || '').toLowerCase();
  const target = args.slice(1).join(' ');
  if (!platform || !target) return line('Usage: query <google|github|reddit|linkedin|wayback|crt> <target>', 'error');
  const generators = {
    google: [`"${target}"`, `"${target}" filetype:pdf`, `site:github.com "${target}"`, `site:reddit.com "${target}"`],
    github: [`"${target}"`, `path:README "${target}"`, `path:docs "${target}"`],
    reddit: [`site:reddit.com "${target}"`, `site:reddit.com/user "${target}"`],
    linkedin: [`site:linkedin.com/in "${target}"`, `site:linkedin.com/company "${target}"`],
    wayback: [`https://web.archive.org/web/*/${target}`],
    crt: [`https://crt.sh/?q=${encodeURIComponent(target)}`]
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
    website: ['search exact TARGET', 'query wayback TARGET', 'runbook website-audit'],
    phone: ['open phone', 'search exact TARGET', 'runbook phone'],
    email: ['search email TARGET', 'query github TARGET', 'Inspect the public domain separately.'],
    username: ['search username TARGET', 'query github TARGET', 'query reddit TARGET', 'runbook username'],
    image: ['open metadata', 'open search', 'runbook evidence-handling'],
    file: ['open metadata', 'runbook evidence-handling']
  };
  const plan = plans[type];
  if (!plan) return line('Supported types: domain, website, phone, email, username, image, file', 'error');
  line(`INTELLIGENCE WORKFLOW // ${type.toUpperCase()}`, 'success');
  line(`Target: ${target}`, 'info');
  plan.forEach((step, index) => line(`${index + 1}. ${step.replaceAll('TARGET', target)}`));
}

async function monitorCommand(args) {
  const action = (args[0] || 'status').toLowerCase();
  if (!['status', 'tools', 'all'].includes(action)) return line('Usage: monitor <status|tools|all>', 'error');
  return checkAllRoutes();
}
