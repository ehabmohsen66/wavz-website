import requests
from bs4 import BeautifulSoup
import json
import time

SLUGS = [
    "ai-customer-service-ethical-dilemmas",
    "mastering-soc-strategies-in-2025-emerging-trends-to-fortify-your-cyber-resilience",
    "the-future-of-sap-erp-trends-shaping-enterprise-resource-planning-in-2025",
    "top-5-digital-transformation-trends-every-business-must-embrace-in-2025",
    "ai-and-the-future-of-managed-services-a-look-ahead",
    "t24-the-future-of-banking-in-egypt",
    "the-future-of-cloud-computing-trends-and-predictions-for-2024-and-beyond",
    "how-augmented-reality-is-revolutionizing-customer-experience-in-fintech",
    "comprehensive-it-testing-services-for-reliable-business-systems",
    "the-rise-of-managed-services-solutions-in-egypt",
    "ai-in-cybersecurity-protecting-egypts-digital-economy",
    "the-role-of-apis-in-open-banking-driving-innovation"
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def extract_blocks_from_url(url):
    print(f"  Fetching: {url}")
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"    Error: Status code {response.status_code}")
            return None
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Look for the container with the maximum paragraph count
        containers = soup.find_all(class_='et_builder_inner_content')
        content_container = None
        if containers:
            content_container = max(containers, key=lambda c: len(c.find_all('p')))
        
        if not content_container or len(content_container.find_all('p')) < 3:
            content_container = soup.find('div', class_='entry-content') or soup.find('article')
            
        if not content_container:
            print("    Warning: No content container found!")
            return None
            
        # Clean up Divi boilerplate
        for unwanted in content_container.find_all(class_=['et_pb_section_video', 'et_pb_module_header']):
            unwanted.decompose()
            
        # Extract structured content in order
        blocks = []
        elements = content_container.find_all(['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'blockquote'])
        
        for el in elements:
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
                
        print(f"    Extracted {len(blocks)} blocks successfully.")
        return blocks
    except Exception as e:
        print(f"    Failed with exception: {e}")
        return None

multilang_data = {}

for idx, slug in enumerate(SLUGS):
    print(f"[{idx+1}/{len(SLUGS)}] Scraping slug: {slug}...")
    en_url = f"https://wavz.com.eg/{slug}/"
    ar_url = f"https://wavz.com.eg/ar/{slug}/"
    
    en_blocks = extract_blocks_from_url(en_url)
    time.sleep(1)
    
    ar_blocks = extract_blocks_from_url(ar_url)
    time.sleep(1)
    
    multilang_data[slug] = {
        "slug": slug,
        "en_blocks": en_blocks,
        "ar_blocks": ar_blocks
    }

# Save output
output_path = "/Users/ihabmohamed/wavz-website/scraper/blog_contents_multilang.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(multilang_data, f, ensure_ascii=False, indent=2)

print(f"Multilang scrape completed! Saved {len(multilang_data)} posts to {output_path}")
