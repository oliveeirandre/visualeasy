import os
import glob
from PIL import Image

def create_thumbs():
    base_dir = r"d:\VISUAL_EASY\GITHUB\visualeasy\public\assets"
    
    # Process section 02 and 04
    patterns = [
        os.path.join(base_dir, "section_02_carrossel", "*.webp"),
        os.path.join(base_dir, "section_04", "**", "*.webp")
    ]
    
    for pattern in patterns:
        for f in glob.glob(pattern, recursive=True):
            if "-mobile.webp" not in f and "thumb" not in f:
                mobile_path = f.replace(".webp", "-mobile.webp")
                if not os.path.exists(mobile_path):
                    try:
                        with Image.open(f) as img:
                            if img.width > 800:
                                ratio = 800 / img.width
                                new_h = int(img.height * ratio)
                                res = img.resize((800, new_h), Image.Resampling.LANCZOS)
                                res.save(mobile_path, "WEBP", quality=75)
                                print(f"Created {mobile_path}")
                    except Exception as e:
                        print(f"Error processing {f}: {e}")

if __name__ == "__main__":
    create_thumbs()
