import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# remove previous ?v=...
text = re.sub(r'\?v=[0-9]+', '', text)

# add ?v=3 to style.min.css
text = text.replace('public/css/style.min.css', 'public/css/style.min.css?v=3')

# add ?v=3 to all .webp in identidade_visual
text = re.sub(r'(public/assets/identidade_visual/[a-zA-Z0-9_-]+\.webp)', r'\1?v=3', text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Replacement complete.")
