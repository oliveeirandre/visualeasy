import os
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Biblioteca Pillow não encontrada. Tentando instalar...")
    os.system(f"{sys.executable} -m pip install Pillow")
    from PIL import Image, ImageOps

def compress_images(directory, max_width=1920, quality=75):
    total_saved = 0
    count = 0
    processed = 0
    
    print(f"Buscando imagens na pasta: {directory}...")
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_lower = file.lower()
            if file_lower.endswith(('.webp', '.jpg', '.jpeg', '.png')):
                filepath = os.path.join(root, file)
                try:
                    original_size = os.path.getsize(filepath)
                    processed += 1
                    
                    with Image.open(filepath) as img:
                        # Corrige rotação caso exista EXIF
                        img = ImageOps.exif_transpose(img)
                        
                        width, height = img.size
                        new_width, new_height = width, height
                        
                        # Limita a largura máxima
                        if width > max_width:
                            ratio = max_width / width
                            new_width = max_width
                            new_height = int(height * ratio)
                            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                        
                        # Remove canal alfa se necessário para salvar como JPEG ou WEBP otimizado
                        if img.mode in ('RGBA', 'P', 'LA'):
                            background = Image.new('RGB', img.size, (255, 255, 255))
                            if img.mode == 'RGBA':
                                background.paste(img, mask=img.split()[3])
                            else:
                                background.paste(img)
                            img = background
                            
                        # Salva temporário
                        temp_path = filepath + ".tmp.webp"
                        img.save(temp_path, "WEBP", quality=quality, method=6)
                        
                    new_size = os.path.getsize(temp_path)
                    
                    # Só substitui se for menor
                    if new_size < original_size:
                        os.replace(temp_path, filepath) # Substitui original (agora é webp e menor)
                        saved = original_size - new_size
                        total_saved += saved
                        count += 1
                        print(f"[\u2713] Comprimida: {os.path.basename(filepath)} | Economia: {saved / 1024:.0f} KB")
                    else:
                        os.remove(temp_path)
                        
                except Exception as e:
                    print(f"[X] Erro ao processar {filepath}: {e}")
                    
    print("\n" + "="*50)
    print("RESUMO DA COMPRESSÃO")
    print("="*50)
    print(f"Total de imagens analisadas: {processed}")
    print(f"Total de imagens reduzidas : {count}")
    print(f"Espaço REAL economizado    : {total_saved / (1024 * 1024):.2f} MB")
    print("="*50)

if __name__ == "__main__":
    target_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public', 'assets')
    if not os.path.exists(target_dir):
        print(f"Pasta não encontrada: {target_dir}")
        sys.exit(1)
        
    compress_images(target_dir, max_width=1600, quality=70)
