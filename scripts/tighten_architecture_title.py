from pathlib import Path

path = Path('assets/cmx-architecture-center.html')
text = path.read_text(encoding='utf-8')
text = text.replace('data-cmx-version="1.1"', 'data-cmx-version="1.2"')
text = text.replace('CMX platform architecture, from interface to infrastructure.', 'Architecture for the db.cmxchat.com platform.')
text = text.replace('font:850 clamp(30px,4.8vw,52px)/1.04 var(--mono)', 'font:850 clamp(26px,3.7vw,42px)/1.08 var(--mono)')
text = text.replace('.hero h2{font-size:32px}', '.hero h2{font-size:28px}')
path.write_text(text, encoding='utf-8')
