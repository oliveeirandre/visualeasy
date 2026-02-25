import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

def make_normal_img(original):
    # remove data:image... and data-src=, replacing with src=
    cleaned = re.sub(r'src="data:image[^"]+"', '', original)
    cleaned = cleaned.replace('data-src="', 'src="')
    cleaned = re.sub(r'\s+', ' ', cleaned)
    cleaned = cleaned.replace('<img ', '<img ') # just normal spaces
    return cleaned

def fix_img(m):
    return make_normal_img(m.group(0))

# We need to fix 06, 07, 08 in the main header swiper, which means replacing them
# This covers both main-swiper and thumbs-swiper since they use 06.webp, 07.webp, 08.webp
text = re.sub(r'<img[^>]+0[5678]\.webp[^>]*>', fix_img, text)

# For the solution swipers, they also loop.
# Fachadas has 3 images. They might be named `fachada_diurna.webp`, etc.
# Actually, since Pingdom is heavily influenced by the MAIN HEADER images (which are huge payload),
# maybe removing lazy loading from ALL 8 slides in the hero is fine? The thumbs are very small.
# The user issue is specifically on the first load, the slide to the left of 01.webp is 08.webp.
# So resolving 08.webp is enough! But we just resolved 05, 06, 07, 08 as well.

text = re.sub(r'\?v=\d+', '?v=13', text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Success')
