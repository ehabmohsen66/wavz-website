import re
import os

FILES = [
    '/Users/ihabmohamed/wavz-website/src/components/FinancialServices.jsx',
    '/Users/ihabmohamed/wavz-website/src/components/PaymentServices.jsx',
    '/Users/ihabmohamed/wavz-website/src/components/SapServices.jsx',
    '/Users/ihabmohamed/wavz-website/src/components/DigitalTransformation.jsx',
    '/Users/ihabmohamed/wavz-website/src/components/BlogPage.jsx'
]

def process_file(filepath):
    print(f"Processing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the closing tag of section right before stats row or main body
    # E.g., </section> right after the CTAs
    # In these files, the hero section has:
    # borderBottom: `1px solid ${T.border}`
    # We want to replace that with borderBottom: 'none' or remove it, and append:
    # {/* Gold accent line at the base */}
    # <div style={{
    #   position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
    #   background: `linear-gradient(90deg, transparent 0%, ${T.gold} 30%, ${T.gold} 70%, transparent 100%)`,
    #   zIndex: 10, opacity: 0.55,
    # }} />
    # </section>

    # 1. Remove borderBottom from hero section styling
    content = content.replace("borderBottom: `1px solid ${T.border}`,", "")
    content = content.replace("borderBottom: '1px solid rgba(255,255,255,0.07)',", "")

    # 2. Inject the gold accent line right before the first closing </section> inside the return block
    # Let's locate:
    #       {/* CTAs */}
    #       ...
    #       </a>
    #     </div>
    #   </div>
    # </section>
    
    # We can use a regex to find:
    # </div>\s*</div>\s*</section>
    # and replace it with:
    # </div>\s*</div>\s*
    # {/* Gold accent line at the base */}
    # <div style={{
    #   position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
    #   background: `linear-gradient(90deg, transparent 0%, ${T.gold || '#FFB814'} 30%, ${T.gold || '#FFB814'} 70%, transparent 100%)`,
    #   zIndex: 10, opacity: 0.55,
    # }} />\s*</section>

    pattern = r'(</div>\s*</div>\s*</section>)'
    
    match = re.search(pattern, content)
    if match:
        replacement = """
        {/* Gold accent line at the base */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${T.gold || '#FFB814'} 30%, ${T.gold || '#FFB814'} 70%, transparent 100%)`,
          zIndex: 10, opacity: 0.55,
        }} />
      </section>"""
        
        # Replace only the first occurrence (the hero section end)
        content = content.replace(match.group(1), replacement.strip(), 1)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully updated {filepath}!")
    else:
        print(f"Could not find matching pattern in {filepath}")

for f in FILES:
    process_file(f)
