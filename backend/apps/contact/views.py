from rest_framework import viewsets, permissions, filters
from rest_framework.throttling import AnonRateThrottle
from django_filters.rest_framework import DjangoFilterBackend

from .models import ContactMessage
from .serializers import ContactMessageSerializer, ContactUpdateSerializer

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')

    serializer_class = ContactMessageSerializer

    throttle_classes = [AnonRateThrottle]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ['status', 'inquiry_type', 'email']

    search_fields = ['first_name', 'last_name', 'email', 'subject', 'message']

    ordering_fields = ['created_at', 'status']

    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_serializer_class(self):
        if self.action == 'partial_update':
            return ContactUpdateSerializer

        return ContactMessageSerializer