from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, parsers, permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework.throttling import AnonRateThrottle

from .models import Category, Project, ProjectImage, ProjectVideo
from .serializers import (
    CategorySerializer,
    ProjectSerializer,
    ProjectCardSerializer,
    ProjectImageSerializer,
    ProjectVideoSerializer,
    ProjectReorderListSerializer
)
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.annotate(
        project_count=Count('projects')
    ).order_by('created_at')

    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'id'

    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().prefetch_related(
        'categories',
        'images',
        'videos',
        'related_projects'
    ).order_by('sort_order', '-created_at')

    lookup_field = 'slug'
    permission_classes = [IsAdminOrReadOnly]

    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)

    throttle_classes = [AnonRateThrottle]

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
    ordering_fields = ['sort_order', 'created_at', 'year', 'name']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectCardSerializer
        if self.action == 'reorder':
            return ProjectReorderListSerializer
        return ProjectSerializer

    @action(detail=False, methods=["post"], url_path="reorder")
    def reorder(self, request):
        serializer = ProjectReorderListSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        items = serializer.validated_data['items']
        projects_to_update = []

        for item in items:
            projects_to_update.append(
                Project(id=item['id'], sort_order=item['sort_order'])
            )

        try:
            Project.objects.bulk_update(projects_to_update, ['sort_order'])

            return Response({
                'message': 'Orden actualizado correctamente',
                'updated_count': len(projects_to_update)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            raise APIException(detail=f"Error al reordenar: {str(e)}")


class ProjectImageViewSet(viewsets.ModelViewSet):
    queryset = ProjectImage.objects.all()
    serializer_class = ProjectImageSerializer
    permission_classes = [IsAdminOrReadOnly]

class ProjectVideoViewSet(viewsets.ModelViewSet):
    queryset = ProjectVideo.objects.all()
    serializer_class = ProjectVideoSerializer
    permission_classes = [IsAdminOrReadOnly]