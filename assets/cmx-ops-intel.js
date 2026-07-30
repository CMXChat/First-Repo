'use strict';

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
  if (type === 'site') {
    extra = [args[1]];
    value = args.slice(2).join(' ');
  } else {
    value = args.slice(1).join(' ');
  }
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
    domain: ['search domain TARGET', 'query crt TARGET', 'query wayback TARGET', 'runbook domain'],
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
