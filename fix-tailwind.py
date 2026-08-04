from pathlib import Path
import re

root = Path.cwd() / 'src'

patterns = [
    ('rounded-[32px]', 'rounded-4xl'),
    ('rounded-[24px]', 'rounded-3xl'),
    ('rounded-[28px]', 'rounded-3xl'),
    ('bg-gradient-to-r', 'bg-linear-to-r'),
    ('bg-gradient-to-br', 'bg-linear-to-br'),
    ('bg-gradient-to-t', 'bg-linear-to-t'),
    ('bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),linear-gradient(135deg,_#050816_0%,_#111827_100%)]', 'bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),linear-gradient(135deg,#050816_0%,#111827_100%)]'),
    ('bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_30%),linear-gradient(135deg,_#06070b_0%,_#0f1424_100%)]', 'bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%),linear-gradient(135deg,#06070b_0%,#0f1424_100%)]'),
]

for path in root.rglob('*'):
    if path.is_file() and path.suffix in {'.ts', '.tsx', '.js', '.jsx'}:
        text = path.read_text(encoding='utf-8')
        updated = text
        for old, new in patterns:
            updated = updated.replace(old, new)
        if updated != text:
            path.write_text(updated, encoding='utf-8')
