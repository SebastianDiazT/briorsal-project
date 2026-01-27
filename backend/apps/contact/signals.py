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

def send_email_thread(subject, text_content, html_content, from_email, to_emails, reply_to):
    try:
        msg = EmailMultiAlternatives(
            subject,
            text_content,
            from_email,
            to_emails,
            reply_to=reply_to
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"Notificación de lead enviada a {to_emails}")
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
            'inquiry_type': instance.get_inquiry_type_display(),
            'subject': instance.subject or "Sin asunto",
            'message_body': instance.message,
        }

        html_content = render_to_string('emails/new_lead_email.html', context)
        text_content = strip_tags(html_content)

        email_subject = f"Nuevo mensaje de contacto: {context['inquiry_type']} - {full_name}"

        from_email = settings.DEFAULT_FROM_EMAIL

        to_emails = getattr(settings, 'CONTACT_EMAILS', [settings.DEFAULT_FROM_EMAIL])

        reply_to = [instance.email]

        email_thread = threading.Thread(
            target=send_email_thread,
            args=(email_subject, text_content, html_content, from_email, to_emails, reply_to)
        )
        email_thread.start()