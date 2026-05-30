"""
Full re-scrape with longer scroll + wait to capture ALL member photos.
"""
import json, requests, asyncio
from pathlib import Path
from playwright.async_api import async_playwright

HEADERS = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36'}
PHOTO_DIR = Path('public/board-photos')
PHOTO_DIR.mkdir(parents=True, exist_ok=True)

async def scrape():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 900})
        print("Navigating...")
        await page.goto('https://wavz.com.eg/board-of-directors/', timeout=60000)

        # Scroll slowly through the whole page to trigger all lazy loading
        for i in range(10):
            await page.evaluate(f"window.scrollTo(0, {i * 600})")
            await page.wait_for_timeout(800)

        # Scroll back up and wait more
        await page.evaluate("window.scrollTo(0, 0)")
        await page.wait_for_timeout(2000)
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(3000)

        # Get ALL images
        imgs = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('img')).map(img => ({
                src: img.src || img.currentSrc || img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || '',
                alt: img.alt || '',
                width: img.naturalWidth,
                height: img.naturalHeight,
                class: img.className,
            }));
        }""")

        # Also dump page text to re-confirm member order
        sections = await page.evaluate("""() => {
            const results = [];
            document.querySelectorAll('h3, h4').forEach(h => {
                const txt = h.innerText.trim();
                const next = h.nextElementSibling;
                const role = next ? next.innerText.trim() : '';
                if (txt) results.push({name: txt, role: role});
            });
            return results;
        }""")

        await browser.close()
        return imgs, sections

imgs, sections = asyncio.run(scrape())

print(f"\n=== MEMBER ORDER FROM PAGE ===")
for s in sections:
    if s['name'] and len(s['name']) < 60:
        print(f"  {s['name']:35s} -> {s['role'][:40]}")

print(f"\n=== ALL IMAGES ({len(imgs)} total) ===")
real_imgs = []
for img in imgs:
    src = img['src']
    if (src and 'wavz.com.eg/wp-content/uploads' in src
            and not src.startswith('data:')
            and not any(k in src.lower() for k in ['logo','icon','wavz-logo','loading','subscribe'])):
        print(f"  w={img['width']:4d} h={img['height']:4d}  alt={img['alt']!r:40s}  {src.split('/')[-1]}")
        real_imgs.append(img)

# Download ALL real member photos
print("\n=== DOWNLOADING ALL PHOTOS ===")
downloaded = {}
for img in real_imgs:
    src = img['src']
    alt = img['alt']
    filename = src.split('/')[-1].split('?')[0]
    dest = PHOTO_DIR / filename
    if not dest.exists():
        try:
            r = requests.get(src, headers=HEADERS, timeout=15)
            if len(r.content) > 5000:
                dest.write_bytes(r.content)
                print(f"  ✓ {filename} (alt={alt!r})")
                downloaded[filename] = alt
            else:
                print(f"  ✗ Too small: {filename}")
        except Exception as e:
            print(f"  ✗ Failed {filename}: {e}")
    else:
        print(f"  ✓ Cached: {filename} (alt={alt!r})")
        downloaded[filename] = alt

print(f"\n✓ {len(downloaded)} photos in public/board-photos/")
print(json.dumps(downloaded, indent=2, ensure_ascii=False))
