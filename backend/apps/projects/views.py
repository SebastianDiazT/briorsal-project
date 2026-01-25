from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, parsers, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.exceptions import APIException

from .models import Category, Project, ProjectImage, ProjectVideo
from .serializers import (
    CategorySerializer,
    ProjectSerializer,
    ProjectListSerializer,
    ProjectImageSerializer,
    ProjectVideoSerializer,
    ProjectReorderListSerializer
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
        if self.action == 'reorder':
            return ProjectReorderListSerializer
        return ProjectSerializer

    @action(
        detail=False, methods=["post"], url_path="reorder", parser_classes=[JSONParser]
    )
    def reorder(self, request):
        serializer = ProjectReorderListSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        items = serializer.validated_data['items']

        projects_to_update = []
        for item in items:
            project = Project(id=item['id'], sort_order=item['sort_order'])
            projects_to_update.append(project)

        try:
            Project.objects.bulk_update(projects_to_update, ['sort_order'])
            return Response({
            'custom_message': 'Orden actualizado correctamente',
            'updated_count': len(projects_to_update)
        })

        except Exception as e:
            raise APIException(detail=f"Error al reordenar: {str(e)}")

class ProjectImageViewSet(viewsets.ModelViewSet):
    queryset = ProjectImage.objects.all()
    serializer_class = ProjectImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProjectVideoViewSet(viewsets.ModelViewSet):
    queryset = ProjectVideo.objects.all()
    serializer_class = ProjectVideoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]