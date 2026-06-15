import json
import re
import os

# Paths
js_path = '/Users/ihabmohamed/wavz-website/src/i18n/translations.js'
json_path = '/Users/ihabmohamed/wavz-website/api/translations.json'

if not os.path.exists(js_path):
    print(f"Error: {js_path} does not exist")
    exit(1)

with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Since it is a JS object, let's use a quick javascript runner or regex/JSON parsing to extract it.
# The cleanest way is to execute a tiny node one-liner to dump it as JSON!
node_cmd = f"node -e \"import('{js_path}').then(m => console.log(JSON.stringify(m.translations)))\""

print("Extracting translations using Node...")
# We will run this via shell and capture the output
