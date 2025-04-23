import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartq.settings')  # ⬅️ Replace with your project name
django.setup()

from core.models import Place  # ⬅️ Replace with your app name
from django.conf import settings

# Settings
base_name = "Tirumala swami temple"  # ⬅️ Replace with the original place name (exact match)
count = 10  # ⬅️ Number of copies to delete

deleted_count = 0

for i in range(1, count + 1):
    name_to_delete = f"{base_name} Copy {i}"
    try:
        place = Place.objects.get(name=name_to_delete)
        image_path = os.path.join(settings.MEDIA_ROOT, place.image.name)

        place.delete()
        if os.path.exists(image_path):
            os.remove(image_path)
            print(f"🗑️ Deleted image: {image_path}")

        print(f"✅ Deleted Place: {name_to_delete}")
        deleted_count += 1

    except Place.DoesNotExist:
        print(f"⚠️ Skipped: {name_to_delete} (not found)")

print(f"\n✅ Total Deleted: {deleted_count}")
