import os
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

@deconstructible
class MaxFileSizeValidator:
    def __init__(self, limit_mb=50):
        self.limit_mb = limit_mb

    def __call__(self, value):
        filesize = value.size
        limit_bytes = self.limit_mb * 1024 * 1024

        if filesize > limit_bytes:
            raise ValidationError(
                f"El archivo es muy pesado. El tamaño máximo permitido es {self.limit_mb}MB."
            )

    def __eq__(self, other):
        return (
            isinstance(other, MaxFileSizeValidator) and self.limit_mb == other.limit_mb
        )


def validate_image_extension(value):
    allowed_extensions = [".jpg", ".jpeg", ".png", ".webp"]
    ext = os.path.splitext(value.name)[1].lower()

    if ext not in allowed_extensions:
        raise ValidationError(
            f"Formato no soportado. Se permiten: {', '.join(allowed_extensions)}"
        )


def validate_video_extension(value):
    allowed_extensions = [".mp4", ".mov", ".avi", ".webm"]
    ext = os.path.splitext(value.name)[1].lower()

    if ext not in allowed_extensions:
        raise ValidationError(
            f"Formato de video no soportado. Se permiten: {', '.join(allowed_extensions)}"
        )
