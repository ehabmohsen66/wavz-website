import requests
from bs4 import BeautifulSoup
import json
import time

URLS = [
    "https://wavz.com.eg/ai-customer-service-ethical-dilemmas/",
    "https://wavz.com.eg/mastering-soc-strategies-in-2025-emerging-trends-to-fortify-your-cyber-resilience/",
    "https://wavz.com.eg/the-future-of-sap-erp-trends-shaping-enterprise-resource-planning-in-2025/",
    "https://wavz.com.eg/top-5-digital-transformation-trends-every-business-must-embrace-in-2025/",
    "https://wavz.com.eg/ai-and-the-future-of-managed-services-a-look-ahead/",
    "https://wavz.com.eg/t24-the-future-of-banking-in-egypt/",
    "https://wavz.com.eg/the-future-of-cloud-computing-trends-and-predictions-for-2024-and-beyond/",
    "https://wavz.com.eg/how-augmented-reality-is-revolutionizing-customer-experience-in-fintech/",
    "https://wavz.com.eg/comprehensive-it-testing-services-for-reliable-business-systems/",
    "https://wavz.com.eg/the-rise-of-managed-services-solutions-in-egypt/",
    "https://wavz.com.eg/ai-in-cybersecurity-protecting-egypts-digital-economy/",
    "https://wavz.com.eg/the-role-of-apis-in-open-banking-driving-innovation/"
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

scraped_data = {}

for idx, url in enumerate(URLS):
    print(f"[{idx+1}/{len(URLS)}] Fetching {url}...")
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"  Error: Status code {response.status_code}")
            continue
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Look for the container with the maximum paragraph count
        containers = soup.find_all(class_='et_builder_inner_content')
        content_container = None
        if containers:
            content_container = max(containers, key=lambda c: len(c.find_all('p')))
        
        if not content_container or len(content_container.find_all('p')) < 3:
            # Fallbacks
            content_container = soup.find('div', class_='entry-content') or soup.find('article')
            
        if not content_container:
            print("  Warning: No content container found!")
            continue
            
        # Clean up specific Divi builder metadata / navigation / ads if present
        for unwanted in content_container.find_all(class_=['et_pb_section_video', 'et_pb_module_header']):
            unwanted.decompose()
            
        # Extract structured content in order
        blocks = []
        elements = content_container.find_all(['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'blockquote'])
        
        for el in elements:
            # Check if this element is inside another element we are already processing
            # (e.g. p inside blockquote or li inside ul) to prevent duplication
            parent_names = [p.name for p in el.parents]
            if 'blockquote' in parent_names or 'ul' in parent_names or 'ol' in parent_names:
                continue
                
            text = el.get_text().strip()
            if not text:
                continue
                
            if el.name.startswith('h'):
                blocks.append({
                    "type": "heading",
                    "level": int(el.name[1]),
                    "text": text
                })
            elif el.name == 'blockquote':
                blocks.append({
                    "type": "quote",
                    "text": text
                })
            elif el.name in ['ul', 'ol']:
                items = [li.get_text().strip() for li in el.find_all('li') if li.get_text().strip()]
                if items:
                    blocks.append({
                        "type": "list",
                        "ordered": el.name == 'ol',
                        "items": items
                    })
            else:
                blocks.append({
                    "type": "paragraph",
                    "text": text
                })
                
        print(f"  Successfully extracted {len(blocks)} blocks.")
        scraped_data[url] = {
            "title": soup.title.string.replace(" | WAVZ", "").replace(" - WAVZ", "").strip() if soup.title else "",
            "blocks": blocks
        }
        
        # Polite delay
        time.sleep(1)
        
    except Exception as e:
        print(f"  Failed with exception: {e}")

# Save output
output_path = "/Users/ihabmohamed/wavz-website/scraper/blog_contents.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(scraped_data, f, ensure_ascii=False, indent=2)

print(f"Scrape completed! Saved {len(scraped_data)} posts to {output_path}")
