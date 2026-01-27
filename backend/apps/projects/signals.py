import cloudinary.uploader
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import Project, ProjectImage, ProjectVideo


def delete_cloudinary_image(image_field):
    if image_field and hasattr(image_field, 'public_id'):
        try:
            cloudinary.uploader.destroy(image_field.public_id)
            print(f"Imagen eliminada de Cloudinary: {image_field.public_id}")
        except Exception as e:
            print(f"Error borrando imagen Cloudinary: {e}")

def delete_cloudinary_video(video_field):
    if video_field and hasattr(video_field, 'public_id'):
        try:
            cloudinary.uploader.destroy(video_field.public_id, resource_type='video')
            print(f"Video eliminado de Cloudinary: {video_field.public_id}")
        except Exception as e:
            print(f"Error borrando video Cloudinary: {e}")


@receiver(post_delete, sender=Project)
def cleanup_project_on_delete(sender, instance, **kwargs):
    delete_cloudinary_image(instance.cover_image)
    delete_cloudinary_image(instance.banner_image)

@receiver(pre_save, sender=Project)
def cleanup_project_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        old_project = Project.objects.get(pk=instance.pk)
    except Project.DoesNotExist:
        return False

    new_cover = instance.cover_image
    old_cover = old_project.cover_image
    if old_cover and new_cover and getattr(old_cover, 'public_id', '') != getattr(new_cover, 'public_id', ''):
        delete_cloudinary_image(old_cover)

    new_banner = instance.banner_image
    old_banner = old_project.banner_image
    if old_banner and new_banner and getattr(old_banner, 'public_id', '') != getattr(new_banner, 'public_id', ''):
        delete_cloudinary_image(old_banner)

@receiver(post_delete, sender=ProjectImage)
def cleanup_gallery_on_delete(sender, instance, **kwargs):
    delete_cloudinary_image(instance.image)

@receiver(pre_save, sender=ProjectImage)
def cleanup_gallery_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_image = ProjectImage.objects.get(pk=instance.pk).image
    except ProjectImage.DoesNotExist:
        return False

    new_image = instance.image
    if old_image and new_image and getattr(old_image, 'public_id', '') != getattr(new_image, 'public_id', ''):
        delete_cloudinary_image(old_image)

@receiver(post_delete, sender=ProjectVideo)
def cleanup_video_on_delete(sender, instance, **kwargs):
    delete_cloudinary_video(instance.video)

@receiver(pre_save, sender=ProjectVideo)
def cleanup_video_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_video = ProjectVideo.objects.get(pk=instance.pk).video
    except ProjectVideo.DoesNotExist:
        return False

    new_video = instance.video
    if old_video and new_video and getattr(old_video, 'public_id', '') != getattr(new_video, 'public_id', ''):
        delete_cloudinary_video(old_video)