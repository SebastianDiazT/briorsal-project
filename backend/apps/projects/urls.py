from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, CategoryViewSet, ProjectImageViewSet, ProjectVideoViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet)
router.register(r"categories", CategoryViewSet)
router.register(r"project-images", ProjectImageViewSet)
router.register(r"project-videos", ProjectVideoViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
