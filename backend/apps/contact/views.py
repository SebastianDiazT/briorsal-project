from rest_framework import filters, viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import ContactMessage
from .serializers import ContactMessageSerializer, ContactStatusSerializer

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ['is_read', 'email']
    search_fields = ['name', 'email', 'subject', 'message']
    ordering_fields = ['created_at', 'name', 'email']

    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_serializer_class(self):
        if self.action == 'partial_update':
            return ContactStatusSerializer

        return ContactMessageSerializer