from rest_framework import viewsets, permissions
from .models import ClientLogo, Service, CompanyInfo
from .serializers import ClientLogoSerializer, ServiceSerializer, CompanyInfoSerializer


class ClientLogoViewSet(viewsets.ModelViewSet):
    queryset = ClientLogo.objects.all()
    serializer_class = ClientLogoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CompanyInfoViewSet(viewsets.ModelViewSet):
    queryset = CompanyInfo.objects.all()
    serializer_class = CompanyInfoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
