from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientLogoViewSet, ServiceViewSet, CompanyInfoView, AboutUsView, HomeHeroView, ProjectsHeroView

router = DefaultRouter()
router.register(r'clients', ClientLogoViewSet)
router.register(r'services', ServiceViewSet)

urlpatterns = [
    path('info/', CompanyInfoView.as_view(), name='company-info'),
    path('about-us/', AboutUsView.as_view(), name='about-us'),
    path('home-hero/', HomeHeroView.as_view(), name='home-hero'),
    path('projects-hero/', ProjectsHeroView.as_view(), name='projects-hero'),

    path('', include(router.urls)),
]
