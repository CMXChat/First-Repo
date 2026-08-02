from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def unlink_static_targets(text: str) -> str:
    replacements = {
        'href="/"': 'data-cmx-unlinked="/"',
        "href='/'": "data-cmx-unlinked='/'",
        'href="/directory"': 'data-cmx-unlinked="/directory"',
        "href='/directory'": "data-cmx-unlinked='/directory'",
        'href="/directory/"': 'data-cmx-unlinked="/directory/"',
        "href='/directory/'": "data-cmx-unlinked='/directory/'",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def clean_html(path: Path, text: str) -> str:
    relative = path.relative_to(ROOT).as_posix()

    if relative == "assets/cmx-architecture-center.html":
        text = re.sub(
            r'<p><a href="/build/">/build/</a>\s*&nbsp;\s*<a href="/directory/">/directory/</a>\s*&nbsp;\s*<a href="/">/</a></p>',
            '<p><a href="/build/">/build/</a></p>',
            text,
            flags=re.IGNORECASE,
        )

    if relative == "assets/cmx-updates.html":
        text = re.sub(r'\s*<a href="/directory/">\[directory\]</a>', "", text, flags=re.IGNORECASE)
        text = re.sub(r'\s*<a href="/">exit</a>', "", text, flags=re.IGNORECASE)

    if relative == "404.html":
        text = re.sub(
            r'\s*<div class="gate-actions single">\s*<a\b[^>]*href="/"[^>]*>.*?</a>\s*</div>',
            "",
            text,
            flags=re.IGNORECASE | re.DOTALL,
        )

    return unlink_static_targets(text)


def clean_standard_js(text: str) -> str:
    if "const blockedNavigationDestinations" not in text:
        text = text.replace(
            "  const sensitiveRoutes = new Set(['/build', '/callmax', '/project']);",
            "  const sensitiveRoutes = new Set(['/build', '/callmax', '/project']);\n"
            "  const blockedNavigationDestinations = new Set(['/', '/directory']);",
        )

    old_loop = """  document.querySelectorAll('a[href]').forEach((anchor) => {
    const destination = sameOriginPath(anchor.getAttribute('href'));

    if (anchor.target === '_blank') {
      const rel = new Set((anchor.getAttribute('rel') || '').split(/\\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      anchor.setAttribute('rel', Array.from(rel).join(' '));
    }

    if (!destination) return;
    if (removedRoutes.has(destination) || sensitiveRoutes.has(destination)) {
      // Neutralize first so any page-local JavaScript retaining this element cannot open the old URL.
      anchor.setAttribute('href', destination === '/manual' ? '/resources/' : '/');
      anchor.remove();
    }
  });

  if (currentPath === '/architecture') {
    const architectureFooterExclusions = new Set(['/', '/directory']);
    document.querySelectorAll('.links a[href]').forEach((anchor) => {
      const destination = sameOriginPath(anchor.getAttribute('href'));
      if (destination && architectureFooterExclusions.has(destination)) anchor.remove();
    });
  }
"""

    new_loop = """  function unlinkAnchor(anchor) {
    const destination = anchor.getAttribute('href') || '';
    anchor.removeAttribute('href');
    anchor.removeAttribute('target');
    anchor.removeAttribute('rel');
    anchor.removeAttribute('aria-label');
    anchor.dataset.cmxUnlinked = destination;
  }

  function enforceNavigationPolicy(scope = document) {
    const anchors = [];
    if (scope.matches?.('a[href]')) anchors.push(scope);
    if (scope.querySelectorAll) anchors.push(...scope.querySelectorAll('a[href]'));

    anchors.forEach((anchor) => {
      const destination = sameOriginPath(anchor.getAttribute('href'));

      if (anchor.target === '_blank') {
        const rel = new Set((anchor.getAttribute('rel') || '').split(/\\s+/).filter(Boolean));
        rel.add('noopener');
        rel.add('noreferrer');
        anchor.setAttribute('rel', Array.from(rel).join(' '));
      }

      if (!destination) return;
      if (blockedNavigationDestinations.has(destination)) {
        if (anchor.closest('.links, .gate-actions')) anchor.remove();
        else unlinkAnchor(anchor);
        return;
      }
      if (removedRoutes.has(destination) || sensitiveRoutes.has(destination)) anchor.remove();
    });
  }

  enforceNavigationPolicy();
  new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) enforceNavigationPolicy(node);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
"""

    if old_loop in text:
        text = text.replace(old_loop, new_loop)

    text = text.replace(
        "    '<a href=\"/\" title=\"Restricted node\">CMX</a>',",
        "    '<span class=\"cmx-standard-home\">CMX</span>',",
    )
    text = text.replace(
        "    '<span class=\"cmx-standard-sep\">|</span>',\n"
        "    '<a href=\"/directory/\">Directory</a>',\n",
        "",
    )
    return text


def clean_apply_standards(text: str) -> str:
    text = text.replace(
        '<div class="gate-actions single"><a class="btn primary" href="/">Return to restricted node</a></div>\n',
        '',
    )

    helper = '''\n\ndef unlink_root_directory_anchors(text: str) -> str:\n    replacements = {\n        'href="/"': 'data-cmx-unlinked="/"',\n        "href='/\'": "data-cmx-unlinked='/\'",\n        'href="/directory"': 'data-cmx-unlinked="/directory"',\n        "href='/directory'": "data-cmx-unlinked='/directory'",\n        'href="/directory/"': 'data-cmx-unlinked="/directory/"',\n        "href='/directory/'": "data-cmx-unlinked='/directory/'",\n    }\n    for old, new in replacements.items():\n        text = text.replace(old, new)\n    return text\n'''

    if "def unlink_root_directory_anchors" not in text:
        text = text.replace("\ndef improve_404(text: str) -> str:\n", helper + "\ndef improve_404(text: str) -> str:\n")

    text = text.replace(
        "    text = normalize_links(text)\n    text = add_html_data(text, title, category, status, standard_ui)",
        "    text = normalize_links(text)\n"
        "    text = unlink_root_directory_anchors(text)\n"
        "    text = add_html_data(text, title, category, status, standard_ui)",
    )
    return text


def clean_build_js(text: str) -> str:
    return re.sub(
        r'const BUILD_EXCLUDED_ROUTES = new Set\(\[[^\]]*\]\);',
        'const BUILD_EXCLUDED_ROUTES = new Set(["/callmax/", "/", "/directory/"]);',
        text,
        count=1,
    )


def clean_updates_js(text: str) -> str:
    expected = "data.pages.filter(page => !['/', '/directory/', '/directory'].includes(page.route)).map(page =>"
    if expected not in text:
        text = text.replace(
            "container.innerHTML = data.pages.map(page => `",
            "container.innerHTML = data.pages.filter(page => !['/', '/directory/', '/directory'].includes(page.route)).map(page => `",
        )
    return text


def update(path: Path, transform) -> bool:
    original = path.read_text(encoding="utf-8")
    changed = transform(original)
    if changed == original:
        return False
    path.write_text(changed, encoding="utf-8")
    print(f"updated: {path.relative_to(ROOT)}")
    return True


def validate() -> None:
    failures: list[str] = []
    forbidden = re.compile(r"<a\b[^>]*\bhref\s*=\s*([\"'])(?:/|/directory/?)\1", re.IGNORECASE)

    for path in ROOT.rglob("*.html"):
        if ".git" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if forbidden.search(text):
            failures.append(f"{path.relative_to(ROOT)}: blocked root or directory anchor remains")

    standard = (ROOT / "assets/cmx-page-standard.js").read_text(encoding="utf-8", errors="ignore")
    if re.search(r"<a href=[\"']/(?:directory/?)?[\"']", standard, re.IGNORECASE):
        failures.append("assets/cmx-page-standard.js: generated blocked anchor remains")

    if failures:
        raise SystemExit("\n".join(failures))


def main() -> None:
    changed = 0

    for path in ROOT.rglob("*.html"):
        if ".git" in path.parts:
            continue
        changed += int(update(path, lambda text, path=path: clean_html(path, text)))

    changed += int(update(ROOT / "assets/cmx-page-standard.js", clean_standard_js))
    changed += int(update(ROOT / "assets/cmx-build-lab.js", clean_build_js))
    changed += int(update(ROOT / "assets/updates.js", clean_updates_js))
    changed += int(update(ROOT / "scripts/apply_site_standards.py", clean_apply_standards))

    validate()
    print(f"files changed: {changed}")


if __name__ == "__main__":
    main()
