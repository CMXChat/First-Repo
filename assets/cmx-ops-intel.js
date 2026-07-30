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
  line(`Opening search: ${query}`, 'success');
  window.open(
    `https://www.google.com/search?q=${encodeURIComponent(query)}${type === 'images' ? '&tbm=isch' : ''}`,
    '_blank',
    'noopener,noreferrer'
  );
}

async function monitorCommand(args) {
  const action = (args[0] || 'status').toLowerCase();
  if (!['status', 'tools', 'all'].includes(action)) return line('Usage: monitor <status|tools|all>', 'error');
  return checkAllRoutes();
}
