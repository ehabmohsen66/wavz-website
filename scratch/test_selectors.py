import requests
from bs4 import BeautifulSoup

url = "https://wavz.com.eg/news/wavz-and-mbme-group-forge-strategic-partnership-to-drive-digital-transformation-across-the-middle-east-and-africa/"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

res = requests.get(url, headers=headers)
soup = BeautifulSoup(res.content, "html.parser")

print("--- Testing clean post content extraction ---")

# Let's search inside et_pb_post_content
post_content = soup.find(class_='et_pb_post_content')
if post_content:
    print("Found et_pb_post_content container!")
    # Get paragraphs inside it
    paragraphs = []
    for p in post_content.find_all('p'):
        text = p.get_text().strip()
        if text and len(text) > 10:
            paragraphs.append(text)
            
    print(f"Extracted {len(paragraphs)} paragraphs:")
    for idx, p in enumerate(paragraphs[:5]):
        print(f"  {idx+1}: {p[:100]}...")
else:
    print("et_pb_post_content not found!")
