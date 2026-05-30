"""
Full extraction: WAVZ Board of Directors
Produces board_data.json + downloads member photos to scraper/photos/
"""
import requests, json, re, os
from lxml import html
from urllib.parse import urljoin
from pathlib import Path

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36',
}
URL   = 'https://wavz.com.eg/board-of-directors/'
PHOTO_DIR = Path('scraper/photos')
PHOTO_DIR.mkdir(parents=True, exist_ok=True)

print(f"Fetching {URL} ...")
r = requests.get(URL, headers=HEADERS, timeout=30)
tree = html.fromstring(r.content)

# ── 1. Extract member names + roles from the overview section ─────────────────
# The section with class et_pb_section_1 lists all members in order
overview_names  = []
overview_roles  = []

section1 = tree.cssselect('.et_pb_section_1')
if section1:
    for h3 in section1[0].cssselect('h3'):
        txt = ' '.join(h3.text_content().split())
        if txt:
            overview_names.append(txt)
    for p in section1[0].cssselect('p'):
        txt = ' '.join(p.text_content().split())
        if txt:
            overview_roles.append(txt)

print("Names found:", overview_names)
print("Roles found:", overview_roles)

# ── 2. Extract all member photos ──────────────────────────────────────────────
photos = {}
for img in tree.cssselect('img'):
    src = img.get('src','') or img.get('data-src','') or img.get('data-lazy-src','')
    alt = (img.get('alt','') or '').strip()
    if not src:
        continue
    # Skip obvious non-member images
    skip_keywords = ['logo','icon','wavz-logo','arrow','footer','header','loading','placeholder','subscribe']
    if any(k in src.lower() for k in skip_keywords):
        continue
    if alt and any(name_part.lower() in alt.lower() for name_part in ['amany','khalid','hassan','ahmed','omar','noha','mohamed','serry','el attar','ibrahim','khattab','adly','ayad','mahfouz']):
        photos[alt] = src
        print(f"  Photo matched: {alt!r} -> {src}")
    elif src and ('member' in src.lower() or 'board' in src.lower() or 'team' in src.lower() or 'person' in src.lower() or 'people' in src.lower()):
        photos[src] = src
        print(f"  Photo (path match): {src}")

# Also get ALL images from sections 2 onwards (member detail popups)
print("\n=== ALL images in page (for reference) ===")
for img in tree.cssselect('img'):
    src = img.get('src','') or img.get('data-src','') or ''
    alt = img.get('alt','') or ''
    if src and 'wavz.com.eg' in src and not any(k in src.lower() for k in ['logo','loading']):
        print(f"  {alt!r:40s} {src}")

# ── 3. Extract full bios per member ──────────────────────────────────────────
# Each popup section has class `et_pb_section_* popup`
print("\n=== POPUP BIOS ===")
member_data = []

for popup in tree.cssselect('section.popup, .et_pb_section.popup'):
    # Get name from h3
    name_els = popup.cssselect('h3')
    role_els = popup.cssselect('p')
    img_els  = popup.cssselect('img')

    name = ' '.join(name_els[0].text_content().split()) if name_els else ''
    # First p is usually the role
    role = ''
    bio_parts = []
    for i, p in enumerate(role_els):
        txt = ' '.join(p.text_content().split())
        if not txt:
            continue
        if i == 0 and len(txt) < 80:
            role = txt
        else:
            bio_parts.append(txt)

    photo_url = ''
    for img in img_els:
        src = img.get('src','') or img.get('data-src','')
        if src and not any(k in src.lower() for k in ['logo','icon','arrow']):
            photo_url = src
            break

    if name:
        entry = {
            'name': name,
            'role': role,
            'bio': ' '.join(bio_parts),
            'photo': photo_url,
        }
        member_data.append(entry)
        print(f"\n  Member: {name}")
        print(f"  Role: {role}")
        print(f"  Photo: {photo_url}")
        print(f"  Bio snippet: {entry['bio'][:150]}...")

# ── 4. Fallback: get members from text blocks if popups empty ─────────────────
if not member_data:
    print("\nNo popups found — trying text block extraction...")
    # Find all distinct bio paragraphs (>100 chars, name in previous sibling)
    KNOWN_NAMES = {
        'Khalid Abdallah': 'Chairman of the Board',
        'Amany Zaki':      'CEO and Managing Director',
        'Hassan Helmy':    'Board Member',
        'Ahmed Ibrahim':   'Board Member',
        'Omar Khattab':    'Board Member',
        'Noha Adly':       'Board Member',
        'Mohamed Ayad':    'Board Member',
        'Mohamed El Attar':'Board Member',
        'Serry':           'Board Member',
        'Mahfouz':         'Board Member',
    }
    bio_texts = {}
    for p in tree.cssselect('p'):
        txt = ' '.join(p.text_content().split())
        if len(txt) < 80:
            continue
        for name_key in KNOWN_NAMES:
            first_word = name_key.split()[-1].lower()
            if first_word in txt.lower():
                bio_texts.setdefault(name_key, []).append(txt)

    for name, bios in bio_texts.items():
        full_bio = ' '.join(dict.fromkeys(bios))  # dedupe
        member_data.append({
            'name': name,
            'role': KNOWN_NAMES[name],
            'bio': full_bio,
            'photo': '',
        })
        print(f"  {name}: {full_bio[:100]}...")

# ── 5. Download photos ────────────────────────────────────────────────────────
for member in member_data:
    if not member['photo']:
        continue
    photo_url = member['photo']
    filename  = re.sub(r'[^a-zA-Z0-9._-]', '_', photo_url.split('/')[-1])
    dest = PHOTO_DIR / filename
    if not dest.exists():
        try:
            img_r = requests.get(photo_url, headers=HEADERS, timeout=15)
            dest.write_bytes(img_r.content)
            print(f"  Downloaded: {filename}")
        except Exception as e:
            print(f"  Failed to download {photo_url}: {e}")
    member['photo_local'] = f'/board-photos/{filename}'

# ── 6. Save JSON ──────────────────────────────────────────────────────────────
out = Path('scraper/board_data.json')
out.write_text(json.dumps(member_data, indent=2, ensure_ascii=False))
print(f"\n✓ Saved {len(member_data)} members to {out}")
print(json.dumps(member_data, indent=2, ensure_ascii=False)[:3000])
