import re

def fix_html():
    with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # We are looking for something like:
    # class="w-full h-96 object-contain rounded-lg shadow-md cursor-pointer"
    # loading="lazy" width="720" height="384"
    # data-swiper-modal="fachada-swiper" class="modal-trigger" />
    
    pattern = re.compile(r'class="([^"]+)"([^>]+?)data-swiper-modal="([^"]+)"\s*class="modal-trigger"', re.DOTALL)
    
    matches = pattern.findall(content)
    print(f"Found {len(matches)} matches")
    
    new_content, count = pattern.subn(r'class="\1 modal-trigger"\2data-swiper-modal="\3"', content)
    print(f"Replaced {count} instances")
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)

if __name__ == '__main__':
    fix_html()
