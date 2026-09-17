#!/usr/bin/env python3
"""
Packages WAVZ website, CMS Admin, and PHP API into a ready-to-upload cPanel zip file.
Extracting this zip directly into cPanel public_html/ puts everything in place.
"""

import os
import zipfile
import shutil

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
ZIP_NAME = os.path.join(ROOT_DIR, "cpanel-deploy.zip")
DIST_DIR = os.path.join(ROOT_DIR, "dist")
ADMIN_DIST_DIR = os.path.join(ROOT_DIR, "cms-admin", "dist")
API_DIR = os.path.join(ROOT_DIR, "api")

def make_cpanel_zip():
    print("📦 Creating cPanel deployment package: cpanel-deploy.zip...")
    
    if os.path.exists(ZIP_NAME):
        os.remove(ZIP_NAME)
        
    with zipfile.ZipFile(ZIP_NAME, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # 1. Add dist/ (Public website) to zip root
        print("  -> Adding public website (dist)...")
        for root, dirs, files in os.walk(DIST_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, DIST_DIR)
                zipf.write(file_path, rel_path)

        # 2. Add cms-admin/dist/ to admin/
        print("  -> Adding CMS Admin panel (admin/)...")
        for root, dirs, files in os.walk(ADMIN_DIST_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.join("admin", os.path.relpath(file_path, ADMIN_DIST_DIR))
                zipf.write(file_path, rel_path)

        # 3. Add api/ to api/
        print("  -> Adding PHP REST API (api/)...")
        for root, dirs, files in os.walk(API_DIR):
            for file in files:
                # Skip local config with real passwords if present
                if file == "config.local.php":
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.join("api", os.path.relpath(file_path, API_DIR))
                zipf.write(file_path, rel_path)

    size_mb = os.path.getsize(ZIP_NAME) / (1024 * 1024)
    print(f"✅ Success! Created {ZIP_NAME} ({size_mb:.2f} MB)")
    print("👉 Upload this file to your cPanel File Manager in public_html and click Extract.")

if __name__ == "__main__":
    make_cpanel_zip()
