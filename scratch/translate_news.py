import json
import urllib.request
import urllib.parse
import time
import sys

def translate_text(text, source_lang="en", target_lang="ar"):
    if not text.strip():
        return ""
    try:
        # Urlencode the query and hit the public gtx endpoint
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + source_lang + "&tl=" + target_lang + "&dt=t&q=" + urllib.parse.quote(text)
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
            # The GTX response is a nested array: data[0] contains pairs of [translated, original]
            translated_sentences = []
            for item in data[0]:
                if item[0]:
                    translated_sentences.append(item[0])
            return "".join(translated_sentences).strip()
    except Exception as e:
        print(f"    Translation error: {e}", file=sys.stderr)
        return None

# Load the scraped English news data
scraped_file = "/Users/ihabmohamed/wavz-website/scratch/news_clean_scraped.json"
with open(scraped_file, "r", encoding="utf-8") as f:
    news_data = json.load(f)

multilang_news = {}

print("--- Starting Translation to Arabic ---")
for art_id, content in news_data.items():
    if not content:
        print(f"Skipping '{art_id}' (no content)")
        multilang_news[art_id] = {"en": "", "ar": ""}
        continue
        
    print(f"\nTranslating article: {art_id}...")
    paragraphs = content.split("\n\n")
    translated_paragraphs = []
    
    for idx, p in enumerate(paragraphs):
        p_clean = p.strip()
        if not p_clean:
            continue
            
        print(f"  Translating paragraph {idx+1}/{len(paragraphs)} ({len(p_clean)} chars)...")
        translated_p = translate_text(p_clean)
        if translated_p:
            translated_paragraphs.append(translated_p)
        else:
            # Fallback to original if translation failed
            translated_paragraphs.append(p_clean)
        time.sleep(0.5) # Soft throttling to be polite
        
    ar_content = "\n\n".join(translated_paragraphs)
    print(f"  Finished translating '{art_id}'! Extracted {len(translated_paragraphs)} paragraphs.")
    
    multilang_news[art_id] = {
        "en": content,
        "ar": ar_content
    }

# Save multilang results
output_file = "/Users/ihabmohamed/wavz-website/scratch/news_multilang.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(multilang_news, f, ensure_ascii=False, indent=2)

print(f"\nTranslation complete! Saved results to {output_file}")
