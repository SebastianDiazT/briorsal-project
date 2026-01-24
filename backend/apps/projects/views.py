from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, parsers, permissions, viewsets

from .models import Category, Project, ProjectImage, ProjectVideo
from .serializers import (
    CategorySerializer,
    ProjectSerializer,
    ProjectListSerializer,
    ProjectImageSerializer,
    ProjectVideoSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.annotate(
        project_count=Count('projects')
    )
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'id'

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ['name']
    search_fields = ['name',]
    ordering_fields = ['name', 'created_at', 'project_count']

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().prefetch_related('categories', 'images', 'videos').order_by('sort_order', '-created_at')
    lookup_field = 'slug'
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = {
        'categories': ['exact'],
        'status': ['exact'],
        'service_type': ['exact'],
        'is_featured': ['exact'],
        'year': ['exact', 'gte', 'lte'],
    }
    search_fields = ['name', 'location', 'service_type', 'description', 'categories__name']
    ordering_fields = ['sort_order', 'created_at', 'name', 'year']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

class ProjectImageViewSet(viewsets.ModelViewSet):
    queryset = ProjectImage.objects.all()
    serializer_class = ProjectImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProjectVideoViewSet(viewsets.ModelViewSet):
    queryset = ProjectVideo.objects.all()
    serializer_class = ProjectVideoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]