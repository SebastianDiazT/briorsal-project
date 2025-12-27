from rest_framework import viewsets, permissions, parsers, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, Category
from .serializers import ProjectSerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ['category', 'year', 'status', 'service_type', 'is_featured']

    search_fields = ['name', 'location', 'service_type', 'area', 'status', 'year']

    ordering_fields = ['created_at', 'year', 'name']