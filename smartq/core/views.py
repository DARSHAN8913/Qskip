from django.shortcuts import render
from rest_framework import viewsets
from .models import Place
from .serializers import PlaceSerializer

# class BookingSlotViewSet(viewsets.ModelViewSet):
#     queryset = BookingSlot.objects.all()
#     serializer_class = BookingSlotSerializer

class PlaceViewSet(viewsets.ReadOnlyModelViewSet):  # Read-only for guests
    queryset = Place.objects.all()
    serializer_class = PlaceSerializer
