import io
import sys

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils.text import slugify
from PIL import Image


def validate_file_size(value):
    filesize = value.size

    if filesize > 52428800:
        raise ValidationError('El archivo no puede pesar más de 50MB')


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'


class Project(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='projects'
    )
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    service_type = models.CharField(max_length=255, blank=True, null=True)
    levels = models.CharField(max_length=50, blank=True, null=True)
    area = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=100, default='Delivered')
    extra_info = models.TextField(blank=True, null=True, verbose_name="Datos Extras")
    is_featured = models.BooleanField(
        default=False, verbose_name='¿Destacar en Inicio?'
    )
    slug = models.SlugField(unique=True, blank=True, max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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

    class Meta:
        db_table = 'projects'
        verbose_name_plural = 'Projects'


class ProjectImage(models.Model):
    project = models.ForeignKey(
        Project, related_name='images', on_delete=models.CASCADE
    )
    image = models.ImageField(
        upload_to='projects/images/', validators=[validate_file_size]
    )

    def __str__(self):
        return f"Image for {self.project.name}"

    def save(self, *args, **kwargs):
        # Si la imagen existe (se está subiendo)
        if self.image:
            self.compress_image()
        super().save(*args, **kwargs)

    def compress_image(self):
        im = Image.open(self.image)

        if im.mode != "RGB":
            im = im.convert("RGB")

        if im.width > 1920:
            output_size = (1920, int((1920 / im.width) * im.height))
            im.thumbnail(output_size)

        output = io.BytesIO()
        im.save(output, format="JPEG", quality=85, optimize=True)
        output.seek(0)

        self.image = InMemoryUploadedFile(
            output,
            "ImageField",
            f"{self.image.name.split('.')[0]}.jpg",
            "image/jpeg",
            sys.getsizeof(output),
            None,
        )

    class Meta:
        db_table = 'project_images'
        verbose_name_plural = 'Project Images'


class ProjectVideo(models.Model):
    project = models.ForeignKey(
        Project, related_name='videos', on_delete=models.CASCADE
    )
    video = models.FileField(
        upload_to='projects/videos/',
        validators=[
            FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'avi', 'mkv']),
            validate_file_size,
        ],
    )

    def __str__(self):
        return f"Video for {self.project.name}"

    class Meta:
        db_table = 'project_videos'
        verbose_name_plural = 'Project Videos'
