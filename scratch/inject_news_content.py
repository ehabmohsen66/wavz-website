import json
import re

# Load multi-language news contents
multilang_file = "/Users/ihabmohamed/wavz-website/scratch/news_multilang.json"
with open(multilang_file, "r", encoding="utf-8") as f:
    news_data = json.load(f)

# Read translations.js
translations_path = "/Users/ihabmohamed/wavz-website/src/i18n/translations.js"
with open(translations_path, "r", encoding="utf-8") as f:
    original_code = f.read()

# Split the code into English and Arabic parts to avoid replacing in the wrong section
parts = original_code.split("  ar: {")
if len(parts) != 2:
    print("Error: Could not split translations.js by '  ar: {'")
    exit(1)

en_part, ar_part = parts[0], parts[1]

# Helper to escape backticks and dollar signs inside ES6 template literals
def escape_js_template(text):
    if not text:
        return ""
    # Escape backticks ` as \` and dollar signs $ as \$ to prevent JS template parsing errors
    text = text.replace("`", "\\`").replace("$", "\\$")
    return text

print("--- Injecting content into English news items ---")
for art_id, contents in news_data.items():
    en_content = escape_js_template(contents["en"])
    if not en_content:
        continue
    
    # We search specifically for the ID and inject content right after it
    pattern = f"id: '{art_id}',"
    replacement = f"id: '{art_id}',\n          content: `{en_content}`,"
    
    if pattern in en_part:
        en_part = en_part.replace(pattern, replacement, 1)
        print(f"  Injected English content for: {art_id}")
    else:
        print(f"  Warning: Pattern '{pattern}' not found in English section!")

print("\n--- Injecting content into Arabic news items ---")
for art_id, contents in news_data.items():
    ar_content = escape_js_template(contents["ar"])
    if not ar_content:
        continue
    
    pattern = f"id: '{art_id}',"
    replacement = f"id: '{art_id}',\n          content: `{ar_content}`,"
    
    if pattern in ar_part:
        ar_part = ar_part.replace(pattern, replacement, 1)
        print(f"  Injected Arabic content for: {art_id}")
    else:
        print(f"  Warning: Pattern '{pattern}' not found in Arabic section!")

# Reconstruct the translations.js code
modified_code = en_part + "  ar: {" + ar_part

# Write back to translations.js
with open(translations_path, "w", encoding="utf-8") as f:
    f.write(modified_code)

print("\nInjection complete! successfully updated translations.js.")
