"""
Use Scrapling with PlayWrightFetcher (JS rendered) to get lazy-loaded member photos.
Merges with bios from the static scrape.
"""
import json, re, requests
from pathlib import Path
from scrapling import DynamicFetcher

HEADERS = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36'}
PHOTO_DIR = Path('public/board-photos')
PHOTO_DIR.mkdir(parents=True, exist_ok=True)

print("Launching headless browser to get JS-rendered photos...")
fetcher = DynamicFetcher(auto_match=False)
page = fetcher.get('https://wavz.com.eg/board-of-directors/', timeout=60, wait_selector='img[src*="uploads"]')

print("Page fetched. Extracting images...")

# All real images (non-base64, non-svg, non-logo)
photos = {}
for img in page.css('img'):
    src = img.attrib.get('src','') or img.attrib.get('data-src','')
    alt = (img.attrib.get('alt','') or '').strip()
    if not src or src.startswith('data:') or 'logo' in src.lower():
        continue
    if 'wavz.com.eg/wp-content/uploads' in src:
        print(f"  Found: {alt!r:40s} -> {src.split('/')[-1]}")
        if alt:
            photos[alt] = src
        else:
            photos[src] = src

print(f"\nTotal real upload images: {len(photos)}")

# Load bios from previous static scrape
board_data = json.loads(Path('scraper/board_data.json').read_text())

# Attempt to match photos to board members by name similarity
NAME_MAP = {
    'Khalid Abdallah':  ['khalid','nasr','hussein','khaled'],
    'Mohamed El Attar': ['el attar','elattar','attar'],
    'Serry':            ['serry','magdy'],
    'Hassan Helmy':     ['helmy','hassan helmy'],
    'Ahmed Ibrahim':    ['ahmed ibrahim','ibrahim'],
    'Mahfouz':          ['mahfouz','mahfoud'],
    'Omar Khattab':     ['khattab','omar'],
    'Noha Adly':        ['adly','noha'],
    'Amany Zaki':       ['amany','zaki'],
    'Mohamed Ayad':     ['ayad','mohamedayad'],
}

def match_photo(name, photos_dict):
    keywords = NAME_MAP.get(name, [name.lower().split()[-1]])
    for alt, src in photos_dict.items():
        alt_lower = alt.lower()
        src_lower = src.lower()
        if any(k in alt_lower or k in src_lower for k in keywords):
            return src
    return ''

print("\n=== MATCHING PHOTOS TO MEMBERS ===")
for member in board_data:
    photo = match_photo(member['name'], photos)
    member['photo'] = photo
    print(f"  {member['name']:25s} -> {photo.split('/')[-1] if photo else 'NO PHOTO'}")

# Download matched photos
print("\n=== DOWNLOADING PHOTOS ===")
for member in board_data:
    if not member['photo']:
        continue
    url = member['photo']
    filename = url.split('/')[-1].split('?')[0]
    dest = PHOTO_DIR / filename
    if not dest.exists():
        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            dest.write_bytes(r.content)
            print(f"  ✓ Downloaded {filename}")
        except Exception as e:
            print(f"  ✗ Failed: {e}")
    else:
        print(f"  ✓ Already exists: {filename}")
    member['photo_local'] = f'/board-photos/{filename}'

# Save updated JSON
Path('scraper/board_data.json').write_text(json.dumps(board_data, indent=2, ensure_ascii=False))
print(f"\n✓ Done! Updated board_data.json with photos")
print(json.dumps(board_data, indent=2, ensure_ascii=False))
