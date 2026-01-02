from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientLogoViewSet, ServiceViewSet, CompanyInfoView, AboutUsView

router = DefaultRouter()
router.register(r'clients', ClientLogoViewSet)
router.register(r'services', ServiceViewSet)

urlpatterns = [
    path('info/', CompanyInfoView.as_view(), name='company-info'),
    path('about-us/', AboutUsView.as_view(), name='about-us'),

    path('', include(router.urls)),
]
