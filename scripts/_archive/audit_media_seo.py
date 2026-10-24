import os
import re

def audit():
    img_tag_re = re.compile(r'<(?:Image|img)\b([^>]*)/?>', re.IGNORECASE | re.DOTALL)
    alt_attr_re = re.compile(r'\balt=(?:(["\'])(.*?)\1|\{([^}]+)\})', re.DOTALL)
    
    missing_alt = []
    generic_alt = []
    good_alt_count = 0
    total_images = 0

    for root, dirs, files in os.walk('app'):
        for file in files:
            if file.endswith('.js') or file.endswith('.jsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                for match in img_tag_re.finditer(content):
                    total_images += 1
                    attrs = match.group(1)
                    alt_match = alt_attr_re.search(attrs)
                    if not alt_match:
                        missing_alt.append((filepath, attrs.strip()[:80]))
                    else:
                        alt_val = (alt_match.group(2) or alt_match.group(3) or '').strip()
                        if alt_val.lower() in ['', 'image', 'photo', 'icon', 'logo', 'placeholder']:
                            generic_alt.append((filepath, alt_val, attrs.strip()[:80]))
                        else:
                            good_alt_count += 1

    print(f"--- IMAGE SEO AUDIT ---")
    print(f"Total Image Tags: {total_images}")
    print(f"Good/Contextual Alt: {good_alt_count}")
    print(f"Missing Alt: {len(missing_alt)}")
    print(f"Generic Alt: {len(generic_alt)}")
    
    if missing_alt:
        print("\nMissing Alt Tags:")
        for path, snippet in missing_alt:
            print(f"  {path} -> {snippet}")
            
    if generic_alt:
        print("\nGeneric Alt Tags:")
        for path, val, snippet in generic_alt:
            print(f"  {path} (alt='{val}') -> {snippet}")

if __name__ == '__main__':
    audit()
