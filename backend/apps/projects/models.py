from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils.text import slugify

from core.validators import validate_image_size, validate_video_size

from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Nombre de la Categoría')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

    def __str__(self):
        return self.name

class Project(models.Model):
    STATUS_CHOICES = [
        ('en_proceso', 'En Ejecución'),
        ('entregado', 'Entregado'),
    ]

    sort_order = models.PositiveIntegerField(default=0, verbose_name='Orden de Clasificación')

    name = models.CharField(max_length=255, verbose_name='Nombre del Proyecto')
    slug = models.SlugField(unique=True, blank=True, max_length=255, verbose_name='Slug(URL)')
    categories = models.ManyToManyField(Category, related_name='projects', verbose_name='Categorías')
    location = models.CharField(max_length=255, verbose_name='Ubicación')
    description = models.TextField(blank=True, verbose_name='Descripción')
    year = models.PositiveIntegerField(blank=True, null=True, verbose_name='Año')
    service_type = models.CharField(max_length=255, blank=True, null=True, verbose_name='Edificación')
    levels = models.CharField(max_length=100, blank=True, null=True, verbose_name='Niveles / Pisos')
    area = models.CharField(max_length=100, blank=True, null=True, verbose_name='Área (m2)')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='en_proceso', verbose_name='Estado')

    cover_image = models.ImageField(
        upload_to='projects/covers/',
        verbose_name='Imagen de Portada (Principal)',
        blank=True, null=True,
        help_text='Imagen principal para el listado de proyectos.'
    )

    cover_thumbnail = ImageSpecField(
        source='cover_image',
        processors=[ResizeToFill(600, 800)],
        format='WEBP',
        options={'quality': 85},
    )

    extra_info = models.JSONField(blank=True, null=True, verbose_name='Información Extra (JSON)')
    is_featured = models.BooleanField(default=False, verbose_name='¿Es Destacado?')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de Actualización')

    class Meta:
        db_table = 'projects'
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'
        ordering = ['sort_order']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

            original_slug = self.slug
            counter = 1
            while Project.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images', verbose_name='Proyecto')
    image = models.ImageField(
        upload_to='projects/gallery/',
        verbose_name='Imagen',
        validators=[validate_image_size, FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])],
    )

    image_large = ImageSpecField(
        source='image',
        processors=[ResizeToFill(1920, 1080)],
        format='WEBP',
        options={'quality': 80}
    )

    class Meta:
        db_table = 'project_images'
        verbose_name = 'Imagen de Proyecto'
        verbose_name_plural = 'Imágenes de Proyectos'

    def __str__(self):
        return f"Imagen for {self.project.name}"

class ProjectVideo(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='videos', verbose_name='Proyecto')
    video = models.FileField(
        upload_to='projects/videos/',
        verbose_name='Video MP4',
        validators=[validate_video_size, FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'avi', 'mkv'])],
    )

    class Meta:
        db_table = 'project_videos'
        verbose_name = 'Video de Proyecto'
        verbose_name_plural = 'Videos de Proyectos'
