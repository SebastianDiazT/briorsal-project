from django.db import models
from django.core.validators import FileExtensionValidator
from core.validators import validate_image_size

class ClientLogo(models.Model):
    name = models.CharField(max_length=100, verbose_name='Nombre del Cliente')
    image = models.ImageField(
        upload_to='company/clients/',
        verbose_name='Logo',
        validators=[validate_image_size, FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])],
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')

    class Meta:
        db_table = 'client_logos'
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=100, verbose_name='Nombre del Servicio')
    description = models.TextField(verbose_name='Descripción')
    image = models.ImageField(
        upload_to='company/services/',
        verbose_name='Imagen',
        blank=True,
        null=True,
        validators=[validate_image_size, FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])],
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')

    class Meta:
        db_table = 'services'
        verbose_name = 'Servicio'
        verbose_name_plural = 'Servicios'

    def __str__(self):
        return self.name

class CompanyInfo(models.Model):
    phone = models.CharField(max_length=50, blank=True, verbose_name='Teléfono')
    email = models.EmailField(blank=True, verbose_name='Email')
    address = models.CharField(max_length=255, blank=True, verbose_name='Dirección')
    google_maps_url = models.URLField(
        max_length=500,
        blank=True,
        verbose_name="Link Iframe (Embed)",
        help_text="El enlace que va dentro del src del iframe",
    )
    google_maps_link = models.URLField(
        max_length=500,
        blank=True,
        verbose_name="Link Compartir (Navegación)",
        help_text="El enlace corto (maps.app.goo.gl) para que el cliente navegue",
    )
    opening_hours = models.TextField(
        blank=True,
        verbose_name='Horario de Atención',
        help_text='Ej: Lunes a Viernes: 8 am - 5 pm (Usa saltos de línea para separar días)',
    )

    facebook = models.URLField(blank=True, default='', verbose_name='Facebook')
    instagram = models.URLField(blank=True, default='', verbose_name='Instagram')
    linkedin = models.URLField(blank=True, default='', verbose_name='LinkedIn')
    tiktok = models.URLField(blank=True, default='', verbose_name='TikTok')
    whatsapp = models.URLField(blank=True, default='', help_text='Número para link de WA', verbose_name='WhatsApp')
    class Meta:
        db_table = 'company_info'
        verbose_name = 'Información de Empresa'
        verbose_name_plural = 'Información de Empresa'

    def __str__(self):
        return 'Configuración General'

class AboutUs(models.Model):
    description = models.TextField(verbose_name='Descripción de la Empresa')
    mission = models.TextField(verbose_name='Misión')
    vision = models.TextField(verbose_name='Visión')
    image = models.ImageField(
        upload_to='company/about/',
        blank=True,
        null=True,
        verbose_name='Imagen Principal',
        validators=[validate_image_size, FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])],
    )

    class Meta:
        db_table = 'about_us'
        verbose_name = 'Nosotros (Misión/Visión)'
        verbose_name_plural = 'Nosotros (Misión/Visión)'

    def __str__(self):
        return 'Información de Nosotros'