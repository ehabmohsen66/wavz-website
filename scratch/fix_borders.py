import os

FILES = [
    '/Users/ihabmohamed/wavz-website/src/components/FinancialServices.jsx',
    '/Users/ihabmohamed/wavz-website/src/components/PaymentServices.jsx',
    '/Users/ihabmohamed/wavz-website/src/components/SapServices.jsx',
    '/Users/ihabmohamed/wavz-website/src/components/DigitalTransformation.jsx',
    '/Users/ihabmohamed/wavz-website/src/components/BlogPage.jsx'
]

target_incorrect = """          {/* Gold accent line at the base */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${T.gold || '#FFB814'} 30%, ${T.gold || '#FFB814'} 70%, transparent 100%)`,
          zIndex: 10, opacity: 0.55,
        }} />
      </section>"""

target_correct = """          </div>
        </div>

        {/* Gold accent line at the base */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${T.gold} 30%, ${T.gold} 70%, transparent 100%)`,
          zIndex: 10, opacity: 0.55,
        }} />
      </section>"""

def fix_file(filepath):
    print(f"Fixing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We will do a generic replacement for the incorrect block. Since spacing might vary slightly, let's normalize or search exactly.
    # In python, we can search for the distinct substring:
    # "position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,"
    # and the trailing "</section>"
    
    # Let's see if we can do re.sub or simple string replacement.
    # Spacing from the python execution is:
    #           {/* Gold accent line at the base */}
    #         <div style={{
    #           position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
    #           background: `linear-gradient(90deg, transparent 0%, ${T.gold || '#FFB814'} 30%, ${T.gold || '#FFB814'} 70%, transparent 100%)`,
    #           zIndex: 10, opacity: 0.55,
    #         }} />
    #       </section>

    # Let's construct the exact block that python wrote.
    # In unify_borders.py we had:
    #         replacement = \"\"\"
    #         {/* Gold accent line at the base */}
    #         <div style={{
    #           position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
    #           background: `linear-gradient(90deg, transparent 0%, ${T.gold || '#FFB814'} 30%, ${T.gold || '#FFB814'} 70%, transparent 100%)`,
    #           zIndex: 10, opacity: 0.55,
    #         }} />
    #       </section>\"\"\"
    # which got stripped and replaced match.group(1).
    
    # Let's inspect the files or simply search for:
    # {/* Gold accent line at the base */}
    # and replace from there to the end of section.

    if "Gold accent line at the base" in content:
        # Let's find index of "Gold accent line at the base"
        idx = content.find("Gold accent line at the base")
        # Let's find the closing </section> right after it
        end_idx = content.find("</section>", idx) + len("</section>")
        
        # The block to replace:
        block_to_replace = content[idx - 16 : end_idx] # subtract some spaces before it
        print("Found block to replace:")
        print(repr(block_to_replace))
        
        # Let's replace the whole thing cleanly:
        new_content = content[:idx - 16] + """
          </div>
        </div>

        {/* Gold accent line at the base */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${T.gold} 30%, ${T.gold} 70%, transparent 100%)`,
          zIndex: 10, opacity: 0.55,
        }} />
      </section>""" + content[end_idx:]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Successfully fixed {filepath}!")
    else:
        print(f"Could not find marker in {filepath}")

for f in FILES:
    fix_file(f)
