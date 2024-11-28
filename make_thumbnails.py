import os
from PIL import Image, ImageOps

# Define source and destination directories
source_folder = r".\img\chips"
thumbnail_folder = r".\img\thumbnails"

# Thumbnail size (width, height)
thumbnail_size = (150, 150)  # Adjust as needed.

# Ensure the thumbnail folder exists
os.makedirs(thumbnail_folder, exist_ok=True)

# Process each .jpg file in the source folder
for filename in os.listdir(source_folder):
    if filename.lower().endswith(".jpg"):
        # Full path to the original image
        img_path = os.path.join(source_folder, filename)
        
        try:
            # Open the image
            with Image.open(img_path) as img:
                # Correct orientation using Exif metadata
                img = ImageOps.exif_transpose(img)
                
                # Create a thumbnail
                img.thumbnail(thumbnail_size)
                
                # Save the thumbnail to the thumbnail folder
                thumbnail_path = os.path.join(thumbnail_folder, filename)
                img.save(thumbnail_path, "JPEG")
                
                print(f"Thumbnail created for: {filename}")
        except Exception as e:
            print(f"Failed to process {filename}: {e}")
