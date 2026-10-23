import os
import zipfile
import sys

def create_build_zip(output_zip=r"deploy/mediwaves_full_build.zip"):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(base_dir, output_zip)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Exclude unwanted files/folders from the build
    EXCLUDE_DIRS = {
        '.git', '.claude', '__pycache__', '.vscode', '.idea'
    }
    EXCLUDE_EXTENSIONS = {
        '.tmp', '.bak', '.save', '.swp'
    }
    EXCLUDE_EXACT_FILES = {
        'build_deploy.py', 'build_respiratory.py', 'verify_urls.py'
    }
    
    print(f"Creating build zip at: {output_path}...")
    
    file_count = 0
    with zipfile.ZipFile(output_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
        for folder_to_pack in ['www.medi-waves.com', 'api']:
            folder_path = os.path.join(base_dir, folder_to_pack)
            if not os.path.exists(folder_path):
                continue
                
            for root, dirs, files in os.walk(folder_path):
                # Filter out excluded directories in-place
                dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
                
                for file in files:
                    if file in EXCLUDE_EXACT_FILES:
                        continue
                    if any(file.endswith(ext) for ext in EXCLUDE_EXTENSIONS):
                        continue
                    
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, base_dir)
                    
                    zipf.write(full_path, arcname=rel_path)
                    file_count += 1
                    
                    if file_count % 200 == 0:
                        sys.stdout.write(f"\rArchived {file_count} files...")
                        sys.stdout.flush()
                        
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"\n[SUCCESS] Build complete! Archived {file_count} files into '{output_zip}' ({size_mb:.2f} MB).")

if __name__ == "__main__":
    create_build_zip()
