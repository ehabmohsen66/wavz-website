import os
import re

files_to_fix = [
    "src/components/Partners.jsx",
    "src/components/ContactPage.jsx",
    "src/components/DigitalTransformation.jsx",
    "src/components/FinancialServices.jsx",
    "src/components/ManagedServices.jsx",
    "src/components/PaymentServices.jsx",
    "src/components/SapServices.jsx"
]

for file_path in files_to_fix:
    full_path = os.path.join("/Users/ihabmohamed/wavz-website", file_path)
    with open(full_path, "r") as f:
        content = f.read()

    pattern = re.compile(r'<h1\s+style=\{\{.*?\}\}>', re.DOTALL)
    
    def replacer(match):
        style_content = match.group(0)
        font_match = re.search(r'fontFamily:\s*([^,}]+)', style_content)
        font_family_str = ""
        if font_match:
            font_family_str = font_match.group(1).strip()
            return f'<h1 className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white" style={{{{ fontFamily: {font_family_str} }}}}>'
        else:
            return '<h1 className="text-4xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-8 text-white">'
        
    new_content = pattern.sub(replacer, content)

    if new_content != content:
        with open(full_path, "w") as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    else:
        print(f"No match found in {file_path}")
