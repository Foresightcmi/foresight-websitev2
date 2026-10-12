import os
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]|[\u2600-\u26ff]|[\u2700-\u27bf]')

# Purely typographic symbols that are standard text glyphs, not cartoon/pictorial emojis:
ALLOWED_GLYPHS = {'✓', '✕', '✗', '★', '☆', '•', '·', '—', '–', '→', '←', '↑', '↓'}

def scan_file(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as fp:
        lines = fp.readlines()
    hits = []
    for idx, line in enumerate(lines, 1):
        found = emoji_pattern.findall(line)
        emojis = [c for c in found if c not in ALLOWED_GLYPHS]
        if emojis:
            hits.append((idx, ''.join(emojis), line.strip()))
    return hits

def main():
    if len(sys.argv) > 1 and os.path.isfile(sys.argv[1]):
        hits = scan_file(sys.argv[1])
        print(f"=== {sys.argv[1]} ({len(hits)} emoji hits) ===")
        for idx, ems, text in hits:
            print(f"L{idx}: {ems} -> {text[:100]}")
        return

    target_dir = sys.argv[1] if len(sys.argv) > 1 else 'app'
    summary = []
    for root, dirs, files in os.walk(target_dir):
        for f in files:
            if f.endswith(('.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt')):
                p = os.path.join(root, f)
                hits = scan_file(p)
                if hits:
                    summary.append((p, len(hits)))
    
    summary.sort(key=lambda x: x[1], reverse=True)
    print(f"Total files with emojis: {len(summary)}")
    for p, cnt in summary:
        print(f"{p}: {cnt}")

if __name__ == '__main__':
    main()
