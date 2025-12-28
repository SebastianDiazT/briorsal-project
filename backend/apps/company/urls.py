from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientLogoViewSet, ServiceViewSet, CompanyInfoViewSet

router = DefaultRouter()
router.register(r'clients', ClientLogoViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'info', CompanyInfoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
