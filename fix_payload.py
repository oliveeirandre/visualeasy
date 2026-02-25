import sys, re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

def swap_img(m):
    original = m.group(0)
    if '01.webp' in original: return original
    if 'data-src=' in original: return original
    # ONLY apply to section_02_carrossel and section_04, leaving others intact
    if 'section_02_carrossel' in original or 'section_04' in original:
        return original.replace('src="', 'src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="')
    return original

text = re.sub(r'<img[^>]+src=\"[^\"]*\"[^>]*>', swap_img, text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("done")
