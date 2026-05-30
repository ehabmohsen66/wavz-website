import os
import base64
from PIL import Image

def analyze_and_crop():
    logo_path = 'public/Logo.png'
    icon_path = 'public/WavzIcon.png'
    
    # Let's inspect WavzIcon.png first as it's the square/circle icon usually
    img = Image.open(icon_path).convert('RGBA')
    width, height = img.size
    print(f"Icon loaded: {width}x{height}")
    
    # Find bounding box of non-transparent pixels
    bbox = img.getbbox()
    print("Non-transparent bounding box:", bbox)
    
    # We want "the blue circle only"
    # Let's find the blue region in WavzIcon.png or Logo.png
    # Let's write the cropped non-transparent region first to see if it is already the blue circle!
    cropped = img.crop(bbox)
    
    # Let's check colors in the cropped image to see if there is any text or background.
    # The blue circle is a circle of blue color. Let's see if there is any white background or text around it.
    # We can crop the circular region.
    # Let's find the circle:
    # A circle usually has a circular mask. Let's find all pixels with blue hue or simply crop a circle.
    # Let's save a cropped square image that tightly fits the circle.
    # Typically, the icon is a circle. Let's look at WavzIcon.png.
    # If the icon is already a circle but has some padding or white BG, we can make it transparent outside the circle.
    
    # Let's do a scan of WavzIcon.png.
    # Let's find the center of mass or center of the non-transparent pixels.
    left, top, right, bottom = bbox
    w = right - left
    h = bottom - top
    print(f"Cropped dimensions: {w}x{h}")
    
    # Create a perfectly square crop centered on the bounding box
    size = min(w, h)
    center_x = left + w // 2
    center_y = top + h // 2
    
    square_bbox = (
        center_x - size // 2,
        center_y - size // 2,
        center_x + size // 2,
        center_y + size // 2
    )
    
    square_cropped = img.crop(square_bbox)
    
    # Create a circular mask to ensure ONLY the blue circle is kept, making everything outside transparent
    final_size = 512
    square_cropped = square_cropped.resize((final_size, final_size), Image.Resampling.LANCZOS)
    
    # Make a transparent image
    output_img = Image.new('RGBA', (final_size, final_size), (0, 0, 0, 0))
    
    # Copy pixels inside the circle
    for x in range(final_size):
        for y in range(final_size):
            # Calculate distance from center
            dx = x - final_size / 2
            dy = y - final_size / 2
            dist = (dx*dx + dy*dy)**0.5
            
            # If inside the circle (with a tiny margin for antialiasing), keep the pixel from the square_cropped
            if dist < final_size / 2 - 2:
                r, g, b, a = square_cropped.getpixel((x, y))
                output_img.putpixel((x, y), (r, g, b, a))
            elif dist < final_size / 2:
                # Anti-alias the edge
                alpha_factor = (final_size / 2 - dist) / 2.0
                r, g, b, a = square_cropped.getpixel((x, y))
                output_img.putpixel((x, y), (r, g, b, int(a * alpha_factor)))
                
    # Save as PNG
    output_png_path = 'public/favicon-circle.png'
    output_img.save(output_png_path, 'PNG')
    print(f"Saved cropped circle to {output_png_path}")
    
    # Let's also save as ICO
    output_ico_path = 'public/favicon.ico'
    output_img.save(output_ico_path, format='ICO', sizes=[(16,16), (32,32), (48,48), (64,64), (128,128), (256,256)])
    print(f"Saved favicon.ico to {output_ico_path}")
    
    # Now let's create a beautiful, standard compliant SVG favicon that wraps this PNG in base64!
    with open(output_png_path, 'rb') as f:
        png_data = f.read()
        base64_png = base64.b64encode(png_data).decode('utf-8')
        
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,{base64_png}" x="0" y="0" width="512" height="512" />
</svg>'''
    
    output_svg_path = 'public/favicon.svg'
    with open(output_svg_path, 'w') as f_svg:
        f_svg.write(svg_content)
    print(f"Saved favicon.svg to {output_svg_path}")

if __name__ == '__main__':
    analyze_and_crop()
