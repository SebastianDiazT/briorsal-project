from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions, viewsets
from .models import AboutUs, ClientLogo, CompanyInfo, Service
from .serializers import (
    AboutUsSerializer,
    ClientLogoSerializer,
    CompanyInfoSerializer,
    ServiceSerializer,
)

class ClientLogoViewSet(viewsets.ModelViewSet):
    queryset = ClientLogo.objects.all().order_by('-created_at')
    serializer_class = ClientLogoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('-created_at')
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    filterset_fields = ['name']
    search_fields = ['name', 'description']

class CompanyInfoView(generics.RetrieveUpdateAPIView):
    serializer_class = CompanyInfoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj, created = CompanyInfo.objects.get_or_create(defaults={'email': ''})
        return obj

class AboutUsView(generics.RetrieveUpdateAPIView):
    serializer_class = AboutUsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj, created = AboutUs.objects.get_or_create(defaults={'description': ''})
        return obj

    def perform_update(self, serializer):
        delete_image = self.request.data.get('delete_image')

        if delete_image == 'true':
            if serializer.instance.image:
                serializer.instance.image.delete(save=False)

            serializer.save(image=None)
        else:
            serializer.save()