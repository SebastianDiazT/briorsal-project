from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import ProjectImage, ProjectVideo


@receiver(post_delete, sender=ProjectImage)
def delete_image_file(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(False)


@receiver(post_delete, sender=ProjectVideo)
def delete_video_file(sender, instance, **kwargs):
    if instance.video:
        instance.video.delete(False)


@receiver(pre_save, sender=ProjectImage)
def delete_old_image_on_update(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_image = ProjectImage.objects.get(pk=instance.pk).image
    except ProjectImage.DoesNotExist:
        return False

    new_image = instance.image
    if not old_image == new_image:
        old_image.delete(False)
