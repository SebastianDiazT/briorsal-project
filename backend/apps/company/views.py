from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

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
    pagination_class = None
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CompanyInfoView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        info = CompanyInfo.objects.first()
        if info:
            serializer = CompanyInfoSerializer(info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'No info found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, format=None):
        info = CompanyInfo.objects.first()
        if not info:
            serializer = CompanyInfoSerializer(data=request.data)
        else:
            serializer = CompanyInfoSerializer(info, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AboutUsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        about_data = AboutUs.objects.first()
        if about_data:
            serializer = AboutUsSerializer(about_data, context={"request": request})
            return Response(serializer.data)
        else:
            return Response(
                {'error': 'No se ha cargado la información de Nosotros'},
                status=status.HTTP_404_NOT_FOUND,
            )

    def patch(self, request, format=None):
        about_data = AboutUs.objects.first()
        if not about_data:
            serializer = AboutUsSerializer(data=request.data, context={'request': request})
        else:
            serializer = AboutUsSerializer(about_data, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)