import requests
from bs4 import BeautifulSoup

url = "https://wavz.com.eg/ai-customer-service-ethical-dilemmas/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

response = requests.get(url, headers=headers, timeout=10)
soup = BeautifulSoup(response.content, 'html.parser')

containers = soup.find_all(class_='et_builder_inner_content')
print(f"Found {len(containers)} containers with class='et_builder_inner_content'")

for idx, container in enumerate(containers):
    p_count = len(container.find_all('p'))
    h2_count = len(container.find_all('h2'))
    print(f"Container {idx}: classes={container.get('class', [])}, paragraphs={p_count}, h2s={h2_count}")
    if p_count > 0:
        print("  First few paragraphs:")
        for p in container.find_all('p')[:3]:
            print("    -", p.get_text()[:60])
