"""
Use raw Playwright (already installed) to get JS-rendered board photos.
Downloads photos to public/board-photos/ and updates board_data.json.
"""
import json, re, requests, asyncio
from pathlib import Path
from playwright.async_api import async_playwright

HEADERS = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36'}
PHOTO_DIR = Path('public/board-photos')
PHOTO_DIR.mkdir(parents=True, exist_ok=True)

NAME_KEYWORDS = {
    'Khalid Abdallah':  ['khalid','khaled','nasr'],
    'Mohamed El Attar': ['elattar','el-attar','attar','elatatr'],
    'Serry':            ['serry','magdy'],
    'Hassan Helmy':     ['helmy','hassan'],
    'Ahmed Ibrahim':    ['ibrahim','ahmed-ibrahim'],
    'Mahfouz':          ['mahfouz'],
    'Omar Khattab':     ['khattab','omar'],
    'Noha Adly':        ['adly','noha'],
    'Amany Zaki':       ['amany','zaki'],
    'Mohamed Ayad':     ['ayad'],
}

async def scrape():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page()
        print("Navigating to board page...")
        await page.goto('https://wavz.com.eg/board-of-directors/', timeout=60000)
        # Wait for images to lazy-load
        await page.wait_for_timeout(4000)
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(3000)

        # Collect all img srcs
        imgs = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('img')).map(img => ({
                src: img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || '',
                alt: img.alt || '',
                width: img.naturalWidth,
            }));
        }""")

        print(f"\n=== ALL IMAGES ({len(imgs)} total) ===")
        real_imgs = []
        for img in imgs:
            src = img['src']
            alt = img['alt']
            if (src and 'wavz.com.eg/wp-content/uploads' in src
                    and not any(k in src.lower() for k in ['logo','icon','wavz-logo'])
                    and not src.startswith('data:')):
                print(f"  {alt!r:40s} {src.split('/')[-1]}")
                real_imgs.append({'src': src, 'alt': alt})

        await browser.close()
        return real_imgs

imgs = asyncio.run(scrape())

# Load board data
board_data = json.loads(Path('scraper/board_data.json').read_text())

def match_photo(member_name, imgs_list):
    keywords = NAME_KEYWORDS.get(member_name, [member_name.lower().split()[-1]])
    for img in imgs_list:
        combined = (img['alt'] + ' ' + img['src']).lower()
        if any(k in combined for k in keywords):
            return img['src']
    return ''

print("\n=== MATCHING & DOWNLOADING ===")
for member in board_data:
    photo_url = match_photo(member['name'], imgs)
    member['photo'] = photo_url
    if photo_url:
        filename = photo_url.split('/')[-1].split('?')[0]
        dest = PHOTO_DIR / filename
        if not dest.exists():
            try:
                r = requests.get(photo_url, headers=HEADERS, timeout=15)
                dest.write_bytes(r.content)
                print(f"  ✓ {member['name']:25s} -> {filename}")
            except Exception as e:
                print(f"  ✗ {member['name']}: {e}")
        else:
            print(f"  ✓ {member['name']:25s} -> {filename} (cached)")
        member['photo_local'] = f'/board-photos/{filename}'
    else:
        print(f"  ✗ {member['name']:25s} -> NO MATCH")

Path('scraper/board_data.json').write_text(json.dumps(board_data, indent=2, ensure_ascii=False))
print(f"\n✓ Saved updated board_data.json")
print(json.dumps(board_data, indent=2, ensure_ascii=False))
