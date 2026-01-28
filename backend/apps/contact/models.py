from django.db import models
from django.utils.translation import gettext_lazy as _

class ContactMessage(models.Model):
    class InquiryType(models.TextChoices):
        GENERAL = 'GENERAL', _('Consulta General')
        QUOTE = 'QUOTE', _('Solicitud de Presupuesto')
        PROJECT = 'PROJECT', _('Información de Proyecto')
        SUPPLIER = 'SUPPLIER', _('Propuesta de Proveedor')
        OTHER = 'OTHER', _('Otro')

    class Status(models.TextChoices):
        NEW = 'NEW', _('Nuevo')
        IN_PROGRESS = 'IN_PROGRESS', _('En Seguimiento')
        REPLIED = 'REPLIED', _('Respondido/Cerrado')
        SPAM = 'SPAM', _('Spam')

    first_name = models.CharField(_('Nombre'), max_length=100)
    last_name = models.CharField(_('Apellido'), max_length=100)
    email = models.EmailField(_('Correo Electrónico'))

    phone = models.CharField(
        _('Teléfono'),
        max_length=17,
        blank=True
    )

    inquiry_type = models.CharField(
        _('Tipo de Consulta'),
        max_length=20,
        choices=InquiryType.choices,
        default=InquiryType.GENERAL
    )

    subject = models.CharField(_('Asunto'), max_length=200, blank=True)
    message = models.TextField(_('Mensaje'))

    status = models.CharField(
        _('Estado'),
        max_length=20,
        choices=Status.choices,
        default=Status.NEW
    )

    admin_notes = models.TextField(
        _('Notas Internas'),
        blank=True,
        help_text=_('Espacio para notas del equipo de ventas o administración.')
    )

    created_at = models.DateTimeField(_('Fecha de Recepción'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Última Actualización'), auto_now=True)

    class Meta:
        db_table = "contact_messages"
        ordering = ["-created_at"]
        verbose_name = _("Mensaje de Contacto")
        verbose_name_plural = _("Mensajes de Contacto")

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.get_inquiry_type_display()} - {self.full_name}"