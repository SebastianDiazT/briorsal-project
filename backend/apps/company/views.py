from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, viewsets, permissions
import cloudinary.uploader
from .models import AboutUs, ClientLogo, CompanyInfo, Service, HomeHero, ProjectsHero
from .serializers import (
    AboutUsSerializer,
    ClientLogoSerializer,
    CompanyInfoSerializer,
    ServiceSerializer,
    HomeHeroSerializer,
    ProjectsHeroSerializer,
)

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class DeleteImageMixin:
    def perform_update(self, serializer):
        delete_image = self.request.data.get('delete_image')

        if str(delete_image).lower() == 'true':
            img = serializer.instance.image

            if img:
                if hasattr(img, 'public_id'):
                    try:
                        cloudinary.uploader.destroy(img.public_id)
                    except Exception as e:
                        print(f"Error borrando en Cloudinary: {e}")

                elif hasattr(img, 'delete'):
                    img.delete(save=False)
            serializer.save(image=None)
        else:
            serializer.save()

class ClientLogoViewSet(DeleteImageMixin, viewsets.ModelViewSet):
    queryset = ClientLogo.objects.all().order_by('-created_at')
    serializer_class = ClientLogoSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ['name']
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']

class ServiceViewSet(DeleteImageMixin, viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('created_at')
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ['name']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

class CompanyInfoView(generics.RetrieveUpdateAPIView):
    serializer_class = CompanyInfoSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_object(self):
        obj, _ = CompanyInfo.objects.get_or_create(defaults={'email': ''})
        return obj

class AboutUsView(DeleteImageMixin, generics.RetrieveUpdateAPIView):
    serializer_class = AboutUsSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_object(self):
        obj, _ = AboutUs.objects.get_or_create(defaults={'description': ''})
        return obj

class HomeHeroView(DeleteImageMixin, generics.RetrieveUpdateAPIView):
    serializer_class = HomeHeroSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_object(self):
        obj, _ = HomeHero.objects.get_or_create(defaults={
            'badge': '',
            'title': '',
            'highlight': '',
            'description': '',
        })
        return obj

class ProjectsHeroView(DeleteImageMixin, generics.RetrieveUpdateAPIView):
    serializer_class = ProjectsHeroSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_object(self):
        obj, _ = ProjectsHero.objects.get_or_create(defaults={
            'title': '',
            'highlight': '',
            'description': '',
        })
        return obj