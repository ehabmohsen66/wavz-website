import requests
from bs4 import BeautifulSoup

urls = [
    "https://wavz.com.eg/ar/",
    "https://wavz.com.eg/ar/media-center/",
    "https://wavz.com.eg/ar/press-room-news/",
    "https://wavz.com.eg/ar/news/"
]

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

print("--- Crawling Arabic links ---")
for url in urls:
    print(f"Fetching: {url}")
    try:
        res = requests.get(url, headers=headers, timeout=10)
        print(f"  Status: {res.status_code}")
        if res.status_code == 200:
            soup = BeautifulSoup(res.content, "html.parser")
            links = set()
            for a in soup.find_all("a", href=True):
                href = a["href"]
                if "wavz.com.eg" in href and ("/news/" in href or "/ar/" in href) and len(href) > 30:
                    links.add(href)
            print(f"  Found {len(links)} matching links:")
            for l in sorted(links)[:10]:
                print(f"    - {l}")
    except Exception as e:
        print(f"  Error: {e}")
