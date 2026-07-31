from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SENSITIVE = {
    "build/index.html": "https://db.cmxchat.com/build/",
    "callmax/index.html": "https://db.cmxchat.com/callmax/",
    "project/index.html": "https://db.cmxchat.com/project/",
}

VISIBILITY = {
    "index.html": "Directory-visible",
    "directory/index.html": "Directory-visible",
    "osint/index.html": "Directory-visible",
    "phone/index.html": "Directory-visible",
    "metadata/index.html": "Directory-visible",
    "search/index.html": "Directory-visible",
    "missing/index.html": "Directory-visible",
    "resources/index.html": "Directory-visible",
    "build/index.html": "Direct-link-only",
    "callmax/index.html": "Build-only",
    "project/index.html": "Build-only",
    "internal/index.html": "Direct-link-only",
    "ovaro/index.html": "Direct-link-only",
    "collab1/index.html": "Direct-link-only",
    "collab2/index.html": "Direct-link-only",
    "collab3/index.html": "Direct-link-only",
    "services/index.html": "Direct-link-only",
    "seo/index.html": "Direct-link-only",
    "entry/index.html": "Legacy",
    "404.html": "System",
}

ROUTES = [
    ("/", "Restricted Node", "Operational", "Active", "Directory-visible"),
    ("/build", "Build Lab", "Operational", "Active", "Direct-link-only"),
    ("/directory", "Operations Directory", "Operational", "Active", "Directory-visible"),
    ("/osint", "OSINT Console", "Operational", "Active", "Directory-visible"),
    ("/phone", "Phone Intelligence", "Operational", "Active", "Directory-visible"),
    ("/metadata", "Metadata Extractor", "Operational", "Active", "Directory-visible"),
    ("/search", "Advanced Search", "Operational", "Active", "Directory-visible"),
    ("/missing", "Missing Person Workflow", "Operational", "Active", "Directory-visible"),
    ("/resources", "Resource Library", "Operational", "Active", "Directory-visible"),
    ("/internal", "CMX + Ovaro Vision Map", "Internal", "Active", "Direct-link-only"),
    ("/project", "Callmax SEO Master Plan", "Client", "Active", "Build-only"),
    ("/callmax", "Callmax Page", "Client", "Needs Review", "Build-only"),
    ("/ovaro", "Ovaro Page", "Internal", "Needs Review", "Direct-link-only"),
    ("/collab1", "CMX Agency Concept 1", "Experimental", "Experimental", "Direct-link-only"),
    ("/collab2", "CMX Agency Concept 2", "Experimental", "Experimental", "Direct-link-only"),
    ("/collab3", "CMX Agency Concept 3", "Experimental", "Experimental", "Direct-link-only"),
    ("/services", "CMX Services Hub", "Business", "Needs Review", "Direct-link-only"),
    ("/seo", "CMX Pricing Calculator", "Experimental", "Needs Review", "Direct-link-only"),
    ("/entry", "Legacy Workspace", "Legacy", "Legacy", "Legacy"),
    ("/404.html", "Custom 404 Page", "System", "Active", "System"),
]

PRIVACY_HINTS = """  <!-- CMX PRIVACY HINTS: START -->
  <meta name=\"referrer\" content=\"no-referrer\" />
  <meta http-equiv=\"Cache-Control\" content=\"no-store, no-cache, must-revalidate, max-age=0\" />
  <meta http-equiv=\"Pragma\" content=\"no-cache\" />
  <meta http-equiv=\"Expires\" content=\"0\" />
  <!-- CMX PRIVACY HINTS: END -->
"""

GATE_ASSETS = """  <!-- CMX SENSITIVE GATE: START -->
  <link rel=\"stylesheet\" href=\"/assets/cmx-sensitive-gate.css?v=20260731-1\" />
  <script>document.documentElement.classList.add('cmx-gate-pending');</script>
  <script src=\"/assets/cmx-sensitive-gate.js?v=20260731-1\" defer></script>
  <!-- CMX SENSITIVE GATE: END -->
"""

VISIBILITY_CSS = """
    /* CMX privacy visibility labels */
    .badge.visibility-directory-visible { color: var(--green); border-color: rgba(53,230,109,.3); background: var(--green-soft); }
    .badge.visibility-direct-link-only { color: var(--cyan); border-color: rgba(85,217,198,.3); background: rgba(85,217,198,.08); }
    .badge.visibility-build-only { color: var(--red); border-color: rgba(255,119,119,.35); background: rgba(255,119,119,.08); }
    .badge.visibility-legacy, .badge.visibility-system { color: var(--muted); }
"""


def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def set_html_attribute(text: str, name: str, value: str) -> str:
    pattern = re.compile(r"<html\b([^>]*)>", re.I)
    match = pattern.search(text)
    if not match:
        return text
    attrs = match.group(1)
    attr_pattern = re.compile(rf"\s{name}=([\"']).*?\1", re.I)
    if attr_pattern.search(attrs):
        attrs = attr_pattern.sub(f' {name}=\"{value}\"', attrs)
    else:
        attrs += f' {name}=\"{value}\"'
    return text[: match.start()] + f"<html{attrs}>" + text[match.end() :]


def replace_marker(text: str, start: str, end: str, replacement: str) -> str:
    pattern = re.compile(re.escape(start) + r".*?" + re.escape(end) + r"\s*", re.S | re.I)
    text = pattern.sub("", text)
    return text.replace("</head>", replacement + "</head>", 1)


def harden_target_blank_links(text: str) -> str:
    anchor_pattern = re.compile(r"<a\b[^>]*\btarget\s*=\s*([\"'])_blank\1[^>]*>", re.I)

    def amend(match: re.Match[str]) -> str:
        tag = match.group(0)
        rel_match = re.search(r"\brel\s*=\s*([\"'])(.*?)\1", tag, re.I | re.S)
        required = ["noopener", "noreferrer"]
        if rel_match:
            tokens = rel_match.group(2).split()
            for token in required:
                if token not in tokens:
                    tokens.append(token)
            replacement = f'rel={rel_match.group(1)}{" ".join(tokens)}{rel_match.group(1)}'
            return tag[: rel_match.start()] + replacement + tag[rel_match.end() :]
        return tag[:-1] + ' rel="noopener noreferrer">'

    return anchor_pattern.sub(amend, text)


def remove_forbidden_anchor_links(text: str, current: str) -> str:
    forbidden = []
    if current != "build/index.html":
        forbidden.extend(["build", "callmax", "project"])
    forbidden.extend(["manual", "menu", "workspace", "collab6", "collab7", "pythontest", "test.html", "report"])
    for route in forbidden:
        route_pattern = re.escape(route)
        pattern = re.compile(
            rf"\s*<a\b(?=[^>]*\bhref\s*=\s*([\"'])(?:https?://db\.cmxchat\.com)?/{route_pattern}/?\1)[^>]*>.*?</a>\s*",
            re.I | re.S,
        )
        text = pattern.sub("\n", text)
    return text


def generic_sensitive_metadata(url: str) -> str:
    return f"""  <!-- CMX SITE STANDARD: START -->
  <title>CMX Restricted Resource</title>
  <meta name=\"description\" content=\"Authorization required to access this private CMX resource.\" />
  <meta name=\"robots\" content=\"noindex, nofollow, noarchive, nosnippet, noimageindex\" />
  <meta name=\"googlebot\" content=\"noindex, nofollow, noarchive, nosnippet, noimageindex\" />
  <link rel=\"canonical\" href=\"{url}\" />
  <meta property=\"og:title\" content=\"CMX Restricted Resource\" />
  <meta property=\"og:description\" content=\"Authorization required.\" />
  <meta property=\"og:type\" content=\"website\" />
  <meta property=\"og:site_name\" content=\"CMX Restricted Node\" />
  <meta property=\"og:url\" content=\"{url}\" />
  <meta property=\"og:image\" content=\"https://db.cmxchat.com/assets/cmx-restricted-node-social.png\" />
  <meta property=\"og:image:secure_url\" content=\"https://db.cmxchat.com/assets/cmx-restricted-node-social.png\" />
  <meta property=\"og:image:type\" content=\"image/png\" />
  <meta property=\"og:image:width\" content=\"1200\" />
  <meta property=\"og:image:height\" content=\"630\" />
  <meta property=\"og:image:alt\" content=\"CMX restricted resource\" />
  <meta name=\"twitter:card\" content=\"summary_large_image\" />
  <meta name=\"twitter:title\" content=\"CMX Restricted Resource\" />
  <meta name=\"twitter:description\" content=\"Authorization required.\" />
  <meta name=\"twitter:image\" content=\"https://db.cmxchat.com/assets/cmx-restricted-node-social.png\" />
  <meta name=\"twitter:image:alt\" content=\"CMX restricted resource\" />
  <!-- CMX SITE STANDARD: END -->
"""


def patch_directory(text: str) -> str:
    text = re.sub(
        r"\s*<!--\s*4\.\s*Manual\s*-->\s*<a\b[^>]*id=([\"'])card-manual\1.*?</a>\s*",
        "\n",
        text,
        flags=re.I | re.S,
    )
    text = re.sub(r"^\s*document\.getElementById\('card-manual'\),.*$", "", text, flags=re.M)
    keyboard = """window.addEventListener('keydown',e=>{
  if(e.key==='1'){ setActive(0); }
  else if(e.key==='2'){ setActive(1); }
  else if(e.key==='3'){ setActive(2); }
  else if(e.key==='4'){ setActive(3); }
  else if(e.key==='5'){ setActive(4); }
  else if(e.key==='6'){ setActive(5); }
  else if(e.key==='ArrowRight' || e.key==='ArrowDown'){ setActive(idx+1); }
  else if(e.key==='ArrowLeft' || e.key==='ArrowUp'){ setActive(idx-1); }
  else if(e.key==='Enter'){ window.location.href = cards[idx].href; }
});"""
    text = re.sub(
        r"window\.addEventListener\('keydown',e=>\{.*?\n\}\);",
        keyboard,
        text,
        count=1,
        flags=re.S,
    )
    return text


def patch_build(text: str) -> str:
    route_lines = ["    const ROUTES = ["]
    for path, name, category, status, visibility in ROUTES:
        safe_name = name.replace("'", "\\'")
        route_lines.append(
            f"      {{ path: '{path}', name: '{safe_name}', category: '{category}', status: '{status}', visibility: '{visibility}' }},"
        )
    route_lines.append("    ];")
    route_block = "\n".join(route_lines)
    text = re.sub(r"    const ROUTES = \[.*?\n    \];", route_block, text, count=1, flags=re.S)

    if "<th>Visibility</th>" not in text:
        text = text.replace("                    <th>Project status</th>", "                    <th>Project status</th>\n                    <th>Visibility</th>", 1)
    if "visibility-${slug(route.visibility)}" not in text:
        text = text.replace(
            "            <td><span class=\"badge ${projectStatusClass(route.status)}\">${route.status}</span></td>",
            "            <td><span class=\"badge ${projectStatusClass(route.status)}\">${route.status}</span></td>\n            <td><span class=\"badge visibility-${slug(route.visibility)}\">${route.visibility}</span></td>",
            1,
        )
    if "CMX privacy visibility labels" not in text:
        text = text.replace("  </style>", VISIBILITY_CSS + "  </style>", 1)
    return text


def patch_html(path: Path) -> bool:
    rel = relative(path)
    original = path.read_text(encoding="utf-8", errors="ignore")
    text = original

    visibility = VISIBILITY.get(rel, "Direct-link-only")
    text = set_html_attribute(text, "data-cmx-visibility", visibility)

    if rel in SENSITIVE:
        text = set_html_attribute(text, "data-cmx-gated", "true")
        text = replace_marker(
            text,
            "<!-- CMX SITE STANDARD: START -->",
            "<!-- CMX SITE STANDARD: END -->",
            generic_sensitive_metadata(SENSITIVE[rel]),
        )
        text = replace_marker(
            text,
            "<!-- CMX SENSITIVE GATE: START -->",
            "<!-- CMX SENSITIVE GATE: END -->",
            GATE_ASSETS,
        )

    text = replace_marker(
        text,
        "<!-- CMX PRIVACY HINTS: START -->",
        "<!-- CMX PRIVACY HINTS: END -->",
        PRIVACY_HINTS,
    )
    text = harden_target_blank_links(text)
    text = remove_forbidden_anchor_links(text, rel)

    if rel == "directory/index.html":
        text = patch_directory(text)
    if rel == "build/index.html":
        text = patch_build(text)

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = []
    for path in ROOT.glob("**/*.html"):
        if ".git" in path.parts:
            continue
        if patch_html(path):
            changed.append(relative(path))
    print(f"Privacy hardening updated {len(changed)} HTML files.")
    for item in changed:
        print(f" - {item}")


if __name__ == "__main__":
    main()
