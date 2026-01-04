import threading
import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import ContactMessage

logger = logging.getLogger(__name__)

def send_email_thread(subject, text_content, html_content, from_email, to_email):
    try:
        msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"Correo de contacto enviado exitosamente a {to_email}")
    except Exception as e:
        logger.error(f"Error enviando correo de contacto: {e}")

@receiver(post_save, sender=ContactMessage)
def send_contact_notification(sender, instance, created, **kwargs):
    if created:
        full_name = f"{instance.first_name} {instance.last_name}".strip()

        context = {
            'name': full_name,
            'email': instance.email,
            'phone': instance.phone or "No especificado",
            'subject': instance.subject or "Consulta Web",
            'message_body': instance.message,
        }

        html_content = render_to_string('new_lead_email.html', context)
        text_content = strip_tags(html_content)
        email_subject = f"Nuevo Lead: {context['subject']} - {full_name}"

        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [settings.DEFAULT_FROM_EMAIL]

        email_thread = threading.Thread(
            target=send_email_thread,
            args=(email_subject, text_content, html_content, from_email, to_email)
        )
        email_thread.start()