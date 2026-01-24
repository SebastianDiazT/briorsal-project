from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import Project, ProjectImage, ProjectVideo

@receiver(post_delete, sender=Project)
def delete_project_cover_on_delete(sender, instance, **kwargs):
    if instance.cover_image:
        instance.cover_image.delete(False)


@receiver(pre_save, sender=Project)
def delete_old_project_cover_on_update(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        old_cover = Project.objects.get(pk=instance.pk).cover_image
    except Project.DoesNotExist:
        return False

    new_cover = instance.cover_image
    if old_cover and old_cover != new_cover:
        old_cover.delete(False)

@receiver(post_delete, sender=ProjectImage)
def delete_gallery_image_on_delete(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(False)

@receiver(pre_save, sender=ProjectImage)
def delete_old_gallery_image_on_update(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_image = ProjectImage.objects.get(pk=instance.pk).image
    except ProjectImage.DoesNotExist:
        return False

    new_image = instance.image
    if old_image and old_image != new_image:
        old_image.delete(False)

@receiver(post_delete, sender=ProjectVideo)
def delete_video_file_on_delete(sender, instance, **kwargs):
    if instance.video:
        instance.video.delete(False)


@receiver(pre_save, sender=ProjectVideo)
def delete_old_video_on_update(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_video = ProjectVideo.objects.get(pk=instance.pk).video
    except ProjectVideo.DoesNotExist:
        return False

    new_video = instance.video
    if old_video and old_video != new_video:
        old_video.delete(False)
