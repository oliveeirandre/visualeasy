import re

with open(r"d:\VISUAL_EASY\GITHUB\visualeasy\index.html", "r", encoding="utf-8") as f:
    html = f.read()

def replace_img(m):
    original_tag = m.group(0)
    if 'srcset="' in original_tag or 'data-srcset="' in original_tag:
        return original_tag
    
    is_data_src = False
    src_match = re.search(r'data-src="([^"]+\.webp)"', original_tag)
    if src_match:
        is_data_src = True
    else:
        src_match = re.search(r'src="([^"]+\.webp)"', original_tag)
        
    if not src_match:
        return original_tag
            
    img_path = src_match.group(1)
    if "section_02_carrossel" not in img_path and "section_04" not in img_path:
        return original_tag
        
    mobile_path = img_path.replace('.webp', '-mobile.webp')
    srcset = f"{mobile_path} 800w, {img_path} 1920w"
    
    if "section_02" in img_path:
        sizes = "(max-width: 768px) 100vw, 100vw"
    else:
        sizes = "(max-width: 768px) 100vw, 800px"
        
    if is_data_src:
        insertion = f' data-srcset="{srcset}" sizes="{sizes}"'
        return original_tag.replace(f'data-src="{img_path}"', f'data-src="{img_path}"{insertion}')
    else:
        insertion = f' srcset="{srcset}" sizes="{sizes}"'
        if ' alt="' in original_tag:
            return original_tag.replace(' alt="', insertion + ' alt="')
        return original_tag.replace(f'"{img_path}"', f'"{img_path}"{insertion}')

new_html = re.sub(r'<img[^>]+>', replace_img, html)

# Fix Swiper CSS render blocking
new_html = new_html.replace(
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11.2.3/swiper-bundle.min.css"\n        integrity="sha384-zbY5EMKmn4yBZTowVWvlH3B+0PyH7ls7rIXkRnKGl96VLxGHP1M0f4ODs62u4DKQ" crossorigin="anonymous" />',
    '<link rel="preload" href="https://cdn.jsdelivr.net/npm/swiper@11.2.3/swiper-bundle.min.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">\n    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11.2.3/swiper-bundle.min.css"></noscript>'
)

with open(r"d:\VISUAL_EASY\GITHUB\visualeasy\index.html", "w", encoding="utf-8") as f:
    f.write(new_html)

print("HTML updated successfully!")
