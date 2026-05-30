import requests
from bs4 import BeautifulSoup
import json
import time

ARTICLES = [
    {
        "id": "mbme-partnership",
        "url": "https://wavz.com.eg/news/wavz-and-mbme-group-forge-strategic-partnership-to-drive-digital-transformation-across-the-middle-east-and-africa/"
    },
    {
        "id": "baheya-foundation",
        "url": "https://wavz.com.eg/news/wavz-for-digital-transformation-signs-a-cooperation-protocol-with-baheya-foundation-to-provide-sap-support-and-development-services/"
    },
    {
        "id": "teradata-agreement",
        "url": "https://wavz.com.eg/news/wavz-and-teradata-announce-strategic-agreement-to-empower-egyptian-enterprises-with-data-analytics-and-ai/"
    },
    {
        "id": "westport-datacenter",
        "url": "https://wavz.com.eg/news/wavz-is-successfully-managing-the-data-center-of-west-port-said-free-zone-as-part-of-the-fz-digital-infrastructure-development-project/"
    },
    {
        "id": "tietoevry-2030",
        "url": "https://wavz.com.eg/news/wavz-and-tietoevry-share-their-payment-systems-2030-vision-with-egyptian-banking-leaders/"
    },
    {
        "id": "leap-saudi",
        "url": "https://wavz.com.eg/news/leap-in-saudi-arabia/"
    },
    {
        "id": "revenue-2023",
        "url": "https://wavz.com.eg/news/wavz-for-digital-transformation-doubles-revenue-in-2023-expanding-footprint-in-middle-east-and-africa/"
    },
    {
        "id": "prosecure-sap",
        "url": "https://wavz.com.eg/news/prosecure-security-and-guarding-company-partners-with-wavz-to-implement-cutting-edge-sap-erp-solutions/"
    },
    {
        "id": "transecure-sap",
        "url": "https://wavz.com.eg/news/trans-secure-for-money-transfer-partners-with-wavz-to-implement-sap-erp-in-a-managed-services-business-model/"
    },
    {
        "id": "nevis-cyber",
        "url": "https://wavz.com.eg/news/wavz-and-nevis-announce-partnership-to-combat-cyber-risks-in-the-banking-sector/"
    },
    {
        "id": "tietoevry-openbanking",
        "url": "https://wavz.com.eg/news/tietoevry-open-banking-systems-set-to-disrupt-the-banking-sector/"
    },
    {
        "id": "sczone-digital",
        "url": "https://wavz.com.eg/news/embarking-on-the-sc-zone-digital-transformation-project-in-collaboration-with-wavz/"
    },
    {
        "id": "openbanking-future",
        "url": "https://wavz.com.eg/news/wavz-open-banking-solutions-leading-the-financial-future/"
    },
    {
        "id": "ahliyya-university",
        "url": "https://wavz.com.eg/news/al-ahliyya-amman-university-enrollemtn-services-and-tuition-payments/"
    },
    {
        "id": "egypt-trust-callcenter",
        "url": "https://wavz.com.eg/news/egypt-trust-call-center-operations-upgrades/"
    }
]

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def clean_text(t):
    return " ".join(t.strip().split())

def scrape_clean_article(url):
    print(f"Fetching: {url}")
    try:
        res = requests.get(url, headers=headers, timeout=15)
        if res.status_code != 200:
            print(f"  Error: {res.status_code}")
            return None
        
        soup = BeautifulSoup(res.content, "html.parser")
        
        # Try specific Divi post content container first
        post_content = soup.find(class_='et_pb_post_content')
        if not post_content:
            post_content = soup.find('article') or soup.find(class_='entry-content')
            
        if not post_content:
            print("  Warning: No post container found!")
            return None
            
        paragraphs = []
        # Find paragraphs, blockquotes, and ordered/unordered lists to make it comprehensive
        for child in post_content.find_all(['p', 'blockquote', 'li']):
            txt = clean_text(child.get_text())
            if len(txt) > 20 and not txt.startswith("©") and "all rights reserved" not in txt.lower():
                # Avoid duplicates
                if txt not in paragraphs:
                    paragraphs.append(txt)
                    
        if not paragraphs:
            print("  Warning: No paragraphs found!")
            return None
            
        # Join paragraphs with \n\n
        content_str = "\n\n".join(paragraphs)
        print(f"  Success: Extracted {len(paragraphs)} blocks ({len(content_str)} chars).")
        return content_str
    except Exception as e:
        print(f"  Error: {e}")
        return None

results = {}
for art in ARTICLES:
    art_id = art["id"]
    print(f"\nScraping '{art_id}'...")
    content = scrape_clean_article(art["url"])
    results[art_id] = content
    time.sleep(1)

# Write to file
output_file = "/Users/ihabmohamed/wavz-website/scratch/news_clean_scraped.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\nCompleted! Clean data saved to {output_file}")
