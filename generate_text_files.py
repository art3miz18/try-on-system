import os

# Directory where your dataset images are stored
cloth_dir = r'.\Dataset\cloth'
img_dir = r'.\Dataset\image'

# Get all filenames in the dataset directory
cloth_files = os.listdir(cloth_dir)
img_files = os.listdir(img_dir)

# Filter filenames based on your requirements
cloth_files = [f for f in cloth_files if f.endswith('_1.jpg')]
image_files = [f for f in img_files if f.endswith('_0.jpg')]

# Write cloth filenames to cloth_names.txt
with open('data/cloth_names.txt', 'w') as cloth_file:
    for cloth in cloth_files:
        cloth_file.write(f"{cloth}\n")

# Write image filenames to image_names.txt
with open('data/image_names.txt', 'w') as image_file:
    for img in image_files:
        image_file.write(f"{img}\n")
