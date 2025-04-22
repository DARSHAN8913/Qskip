from rest_framework.routers import DefaultRouter
from .views import BookingSlotViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'slots', BookingSlotViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
