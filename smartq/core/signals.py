from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Place, Slot

@receiver(post_save, sender=Place)
def create_slots_for_place(sender, instance, created, **kwargs):
    if created:
        print(f"Creating slots for place: {instance.name}")
        for i in range(1, 101):
            Slot.objects.create(place=instance, slot_id=i)
