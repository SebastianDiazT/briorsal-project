from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, parsers, permissions, viewsets

from .models import Category, Project, ProjectImage, ProjectVideo
from .serializers import (
    CategorySerializer,
    ProjectSerializer,
    ProjectImageSerializer,
    ProjectVideoSerializer,
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'id'

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.select_related('category').all().order_by('-created_at')
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ['category', 'status', 'service_type', 'is_featured', 'year']
    search_fields = ['name', 'location', 'service_type', 'area', 'status', 'description']
    ordering_fields = ['created_at', 'name', 'year']

class ProjectImageViewSet(viewsets.ModelViewSet):
    queryset = ProjectImage.objects.all()
    serializer_class = ProjectImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProjectVideoViewSet(viewsets.ModelViewSet):
    queryset = ProjectVideo.objects.all()
    serializer_class = ProjectVideoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]