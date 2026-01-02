import os
from django.core.exceptions import ValidationError

def validate_image_size(file):
    limit_mb = 50
    if file.size > limit_mb * 1024 * 1024:
        raise ValidationError(
            f"El archivo es muy pesado. El tamaño máximo permitido es {limit_mb}MB."
        )

def validate_video_size(file):
    limit_mb = 50
    if file.size > limit_mb * 1024 * 1024:
        raise ValidationError(
            f"El video es muy pesado. El tamaño máximo permitido es {limit_mb}MB."
        )

def validate_file_extension(value, allowed_extensions=None):
    if allowed_extensions is None:
        allowed_extensions = ['jpg', 'jpeg', 'png', 'webp']

    ext = os.path.splitext(value.name)[1]
    if ext.lower() not in allowed_extensions:
        raise ValidationError(
            f"Formato no soportado. Extensiones permitidas: {', '.join(allowed_extensions)}"
        )