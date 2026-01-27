from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet,
    CategoryViewSet,
    ProjectImageViewSet,
    ProjectVideoViewSet
)

app_name = 'projects'

router = DefaultRouter()

router.register(r'list', ProjectViewSet, basename='project')

router.register(r'categories', CategoryViewSet, basename='category')

router.register(r'images', ProjectImageViewSet, basename='project-image')
router.register(r'videos', ProjectVideoViewSet, basename='project-video')

urlpatterns = [
    path('', include(router.urls)),
]