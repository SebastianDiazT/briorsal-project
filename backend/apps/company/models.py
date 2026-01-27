from django.db import models
from cloudinary.models import CloudinaryField
from core.validators import MaxFileSizeValidator, validate_image_extension

class ClientLogo(models.Model):
    name = models.CharField(max_length=100, verbose_name='Nombre del Cliente')
    image = CloudinaryField(
        'Logo',
        folder='company/clients/',
        validators=[
            MaxFileSizeValidator(limit_mb=2),
            validate_image_extension
        ]
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

    image = CloudinaryField(
        'Imagen',
        folder='company/services/',
        blank=True,
        null=True,
        validators=[
            MaxFileSizeValidator(limit_mb=5), 
            validate_image_extension
        ]
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
        help_text="El enlace corto para compartir",
    )
    opening_hours = models.TextField(
        blank=True,
        verbose_name='Horario de Atención',
        help_text='Ej: Lunes a Viernes: 8 am - 5 pm',
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

    image = CloudinaryField(
        'Imagen Principal',
        folder='company/about/',
        blank=True,
        null=True,
        validators=[
            MaxFileSizeValidator(limit_mb=5),
            validate_image_extension
        ]
    )

    class Meta:
        db_table = 'about_us'
        verbose_name = 'Nosotros (Misión/Visión)'
        verbose_name_plural = 'Nosotros (Misión/Visión)'

    def __str__(self):
        return 'Información de Nosotros'

class HomeHero(models.Model):
    badge = models.CharField(max_length=100, default='Innovación y Solidez', verbose_name='Texto Superior')
    title = models.CharField(max_length=100, default='Construimos', verbose_name='Título Principal')
    highlight = models.CharField(max_length=100, default='El Futuro.', verbose_name='Texto Destacado')
    description = models.TextField(verbose_name='Descripción')

    image = CloudinaryField(
        'Imagen de Fondo',
        folder='company/home/',
        blank=True,
        null=True,
        validators=[
            MaxFileSizeValidator(limit_mb=10),
            validate_image_extension
        ]
    )

    class Meta:
        db_table = 'home_hero'
        verbose_name = 'Hero del Home'
        verbose_name_plural = 'Hero del Home'

    def __str__(self):
        return 'Configuración del Home Hero'

class ProjectsHero(models.Model):
    title = models.CharField(max_length=100, default='Nuestros', verbose_name='Título')
    highlight = models.CharField(max_length=100, default='Proyectos.', verbose_name='Texto Destacado')
    description = models.TextField(verbose_name='Descripción', default='Una muestra de nuestra capacidad técnica...')

    image = CloudinaryField(
        'Imagen de Fondo',
        folder='company/projects/',
        blank=True,
        null=True,
        validators=[
            MaxFileSizeValidator(limit_mb=10),
            validate_image_extension
        ]
    )

    class Meta:
        db_table = 'projects_hero'
        verbose_name = 'Banner de Proyectos'
        verbose_name_plural = 'Banner de Proyectos'

    def __str__(self):
        return 'Configuración del Banner de Proyectos'