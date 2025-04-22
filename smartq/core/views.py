from django.shortcuts import render
from rest_framework import viewsets
from .models import BookingSlot
from .serializers import BookingSlotSerializer

class BookingSlotViewSet(viewsets.ModelViewSet):
    queryset = BookingSlot.objects.all()
    serializer_class = BookingSlotSerializer
