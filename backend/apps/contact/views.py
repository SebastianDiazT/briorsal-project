from rest_framework import viewsets, permissions
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status

from .models import ContactMessage
from .serializers import ContactMessageSerializer

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        context = {
            'name': serializer.validated_data.get('name'),
            'email': serializer.validated_data.get('email'),
            'phone': serializer.validated_data.get('phone', 'No especificado'),
            'subject': serializer.validated_data.get('subject', 'Consulta Web'),
            'message_body': serializer.validated_data.get('message'),
        }

        html_content = render_to_string('contact/new_lead_email.html', context)
        text_content = strip_tags(html_content)
        subject = f"Nuevo Lead: {context['subject']} - {context['name']}"
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [settings.DEFAULT_FROM_EMAIL]

        try:
            msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
            msg.attach_alternative(html_content, "text/html")
            msg.send()
        except Exception as e:
            print(f"Error enviando correo: {e}")

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)