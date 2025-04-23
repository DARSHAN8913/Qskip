import os
import django
import shutil

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartq.settings')  # replace with your project name
django.setup()

from core.models import Place  # replace 'yourapp' with your app name
from django.conf import settings

original = Place.objects.get(id=1)  # Replace with an actual place ID in your DB
count = 10  # Number of test places to generate

for i in range(1, count + 1):
    new_name = f"{original.name} Copy {i}"
    ext = os.path.splitext(original.image.name)[1]
    new_filename = f"place_logos/{original.name.lower().replace(' ', '_')}_copy_{i}{ext}"

    original_image_path = os.path.join(settings.MEDIA_ROOT, original.image.name)
    new_image_path = os.path.join(settings.MEDIA_ROOT, new_filename)

    shutil.copy(original_image_path, new_image_path)

    Place.objects.create(name=new_name, image=new_filename)

print(f"{count} new Place entries created.")
