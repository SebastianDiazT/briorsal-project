from django.db import models
from django.utils.text import slugify
from cloudinary.models import CloudinaryField

from core.validators import (
    MaxFileSizeValidator,
    validate_image_extension,
    validate_video_extension
)

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
    slug = models.SlugField(unique=True, blank=True, max_length=255, verbose_name='Slug (URL)')

    categories = models.ManyToManyField(
        Category,
        related_name='projects',
        verbose_name='Categorías'
    )

    related_projects = models.ManyToManyField(
        'self',
        blank=True,
        symmetrical=True,
        verbose_name="Proyectos Relacionados",
        help_text="Selecciona proyectos similares o etapas de la misma obra."
    )

    location = models.CharField(max_length=255, verbose_name='Ubicación')
    description = models.TextField(blank=True, verbose_name='Descripción')
    year = models.PositiveIntegerField(blank=True, null=True, verbose_name='Año')
    service_type = models.CharField(max_length=255, blank=True, null=True, verbose_name='Tipo de Edificación')
    levels = models.CharField(max_length=100, blank=True, null=True, verbose_name='Niveles / Pisos')
    area = models.CharField(max_length=100, blank=True, null=True, verbose_name='Área Construida')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='en_proceso', verbose_name='Estado')

    cover_image = CloudinaryField(
        'Imagen de Portada (Listado)',
        folder='projects/covers/',
        validators=[MaxFileSizeValidator(limit_mb=5), validate_image_extension],
        help_text='Imagen cuadrada o vertical para el catálogo.',
        null=True, blank=True
    )

    banner_image = CloudinaryField(
        'Imagen de Banner (Detalle)',
        folder='projects/banners/',
        blank=True, null=True,
        validators=[MaxFileSizeValidator(limit_mb=8), validate_image_extension],
        help_text='Imagen panorámica ancha. Si se deja vacía, el frontend puede usar la portada como fallback.',
    )

    extra_info = models.JSONField(blank=True, null=True, verbose_name='Información Extra (JSON)')
    is_featured = models.BooleanField(default=False, verbose_name='¿Es Destacado?')

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de Actualización')

    class Meta:
        db_table = 'projects'
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'
        ordering = ['sort_order', '-year']

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

    image = CloudinaryField(
        'Imagen de Galería',
        folder='projects/gallery/',
        validators=[MaxFileSizeValidator(limit_mb=5), validate_image_extension]
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'project_images'
        verbose_name = 'Imagen de Galería'
        verbose_name_plural = 'Imágenes de Galería'

    def __str__(self):
        return f"Img: {self.project.name}"

class ProjectVideo(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='videos', verbose_name='Proyecto')

    title = models.CharField(max_length=100, blank=True, verbose_name='Título del Video')

    video = CloudinaryField(
        'Video',
        folder='projects/videos/',
        resource_type='video',
        validators=[MaxFileSizeValidator(limit_mb=100), validate_video_extension]
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'project_videos'
        verbose_name = 'Video de Proyecto'
        verbose_name_plural = 'Videos de Proyectos'

    def __str__(self):
        return f"Video: {self.project.name} - {self.title}"