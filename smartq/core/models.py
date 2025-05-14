from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class nothing():
    # class Place(models.Model):
    #     name = models.CharField(max_length=100)
    #     image = models.ImageField(upload_to='place_logos/')

    # def __str__(self):
    #     return self.name
   
    # class Slot(models.Model):
    #     place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='slots')
    #     slot_id = models.PositiveIntegerField()

    #     def __str__(self):
    #         return f"{self.place.name} - Slot {self.slot_id}"

    #     class Meta:
    #         constraints = [models.UniqueConstraint(fields=['place', 'slot_id'], name='unique_slot_per_place')]


    # class BookingSlot(models.Model):
    #     user = models.ForeignKey(User, on_delete=models.CASCADE)
    #     slot = models.ForeignKey(Slot, on_delete=models.CASCADE, related_name='bookings')
    #     slot_time = models.DateTimeField()
    #     booked_at = models.DateTimeField(auto_now_add=True)
    #     booking_status = models.BooleanField(default=False)

    #     def __str__(self):
    #         return (f"{self.user.username} - {self.slot} @ {self.slot_time} - Status: {self.booking_status}")

    #     class Meta:
    #         constraints = [models.UniqueConstraint(fields=['user','slot', 'slot_time'], name='unique_booking_per_slot_time')]
    pass

class Place(models.Model):
    place_id=models.PositiveIntegerField()
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='place_logos/')
    slot_id=models.PositiveIntegerField() 
    booked_user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='user_in_places')
    booked_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} in {self.slot_id} by {self.booked_user} @ {self.booked_at}"