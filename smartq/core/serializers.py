from rest_framework import serializers
from .models import Place,Slot
from .models import BookingSlot
from datetime import timedelta


class BookingSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingSlot
        fields = '__all__'
    
    def validate(self, data):
        user = data['user']
        slot_time = data['slot_time']
        service_name = data['service_name']

        # Get the date part only (midnight of that day)
        start_of_day = slot_time.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)

        # 1. Check if user has already booked 5 slots on this day
        user_bookings_today = BookingSlot.objects.filter(
            user=user,
            slot_time__range=(start_of_day, end_of_day)
        )
        if user_bookings_today.count() >= 5:
            raise serializers.ValidationError("You can only book up to 5 slots in a day.")

        # 2. Check if user has booked in other places on the same day
        other_places = user_bookings_today.exclude(service_name=service_name)
        if other_places.exists():
            raise serializers.ValidationError("You cannot book slots in multiple places on the same day.")

        return data

class PlaceSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = ['id', 'name', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None

class SlotSerializer(serializers.ModelSerializer):
    place = PlaceSerializer(read_only=True)

    class Meta:
        model = Slot
        fields = ['id', 'place', 'slot_id']
