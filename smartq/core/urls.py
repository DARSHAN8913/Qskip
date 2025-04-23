from rest_framework.routers import DefaultRouter
from .views import BookingSlotViewSet,PlaceViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'slots', BookingSlotViewSet)
router.register(r'places', PlaceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('/places/', include(router.urls)),
    
]
