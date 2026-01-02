from rest_framework import generics, permissions, viewsets
from .models import AboutUs, ClientLogo, CompanyInfo, Service
from .serializers import (
    AboutUsSerializer,
    ClientLogoSerializer,
    CompanyInfoSerializer,
    ServiceSerializer,
)

class ClientLogoViewSet(viewsets.ModelViewSet):
    queryset = ClientLogo.objects.all()
    serializer_class = ClientLogoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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