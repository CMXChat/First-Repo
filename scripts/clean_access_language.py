from pathlib import Path

ROOT = Path('.')
WORD = 'oper' + 'ator'
TITLE = WORD.title()
UPPER = WORD.upper()

SKIP = {
    Path('scripts/clean_access_language.py'),
    Path('.github/workflows/clean-access-language.yml'),
    Path('.access-language-trigger'),
}

TEXT_EXTENSIONS = {
    '.html', '.css', '.js', '.json', '.md', '.py', '.yml', '.yaml',
    '.txt', '.xml', '.toml', '.ini', '.cfg', '.sh'
}

phrase_replacements = [
    (WORD + ' authorization', 'authorization'),
    (TITLE + ' authorization', 'Authorization'),
    ('authorized ' + WORD, 'authorized user'),
    ('Authorized ' + WORD, 'Authorized user'),
    (WORD + ' access', 'private access'),
    (TITLE + ' access', 'Private access'),
    (WORD + ' tools', 'private tools'),
    (TITLE + ' tools', 'Private tools'),
    (WORD + ' review', 'review'),
    (TITLE + ' review', 'Review'),
    (WORD + ' notes', 'internal notes'),
    (TITLE + ' notes', 'Internal notes'),
    (WORD + ' identity', 'user identity'),
    (TITLE + ' identity', 'User identity'),
    (WORD + ' account', 'user account'),
    (TITLE + ' account', 'User account'),
    (WORD + ' session', 'session'),
    (TITLE + ' session', 'Session'),
    (WORD + ' prompt', 'command prompt'),
    (TITLE + ' prompt', 'Command prompt'),
]

changed = []
for path in ROOT.rglob('*'):
    if not path.is_file() or path in SKIP or '.git' in path.parts:
        continue
    if path.suffix.lower() not in TEXT_EXTENSIONS:
        continue
    try:
        original = path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        continue

    updated = original
    for old, new in phrase_replacements:
        updated = updated.replace(old, new)

    updated = updated.replace(UPPER, 'USER')
    updated = updated.replace(TITLE, 'User')
    updated = updated.replace(WORD, 'user')

    if updated != original:
        path.write_text(updated, encoding='utf-8')
        changed.append(str(path))

print(f'Updated {len(changed)} files')
for item in changed:
    print(item)
