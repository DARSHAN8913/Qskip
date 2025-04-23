from django.db import models
from django.contrib.auth.models import User

class BookingSlot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    service_name = models.CharField(max_length=100)
    slot_time = models.DateTimeField()
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.service_name} @ {self.slot_time}"

class Place(models.Model):
    name = models.CharField(max_length=100)
    image_url = models.URLField(max_length=300)

    def __str__(self):
        return self.name