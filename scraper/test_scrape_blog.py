import requests
from bs4 import BeautifulSoup

url = "https://wavz.com.eg/ai-customer-service-ethical-dilemmas/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

response = requests.get(url, headers=headers, timeout=10)
soup = BeautifulSoup(response.content, 'html.parser')

print("Title:", soup.title.string if soup.title else "No Title")

# Search for elements with class containing 'content' or typical WP classes
for div in soup.find_all('div'):
    classes = div.get('class', [])
    if any('content' in cls for cls in classes) or any('post' in cls for cls in classes):
        p_count = len(div.find_all('p'))
        if p_count > 5:
            print(f"Found div with class={classes} containing {p_count} paragraphs!")
            for p in div.find_all('p')[:5]:
                print("  Paragraph:", p.get_text()[:80])
            break
else:
    # Just inspect all paragraphs
    all_p = soup.find_all('p')
    print(f"Total paragraphs found in whole document: {len(all_p)}")
    for i, p in enumerate(all_p[:10]):
        print(f"  P {i}:", p.get_text()[:100])
