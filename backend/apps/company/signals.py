import cloudinary.uploader
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import ClientLogo, Service, AboutUs, HomeHero, ProjectsHero


def delete_cloudinary_image(image_field):
    if image_field and hasattr(image_field, "public_id"):
        try:
            cloudinary.uploader.destroy(image_field.public_id)
            print(f"Imagen eliminada de Cloudinary: {image_field.public_id}")
        except Exception as e:
            print(f"Error borrando imagen Cloudinary: {e}")


@receiver(post_delete, sender=ClientLogo)
def cleanup_client_logo_on_delete(sender, instance, **kwargs):
    delete_cloudinary_image(instance.image)


@receiver(pre_save, sender=ClientLogo)
def cleanup_client_logo_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_obj = ClientLogo.objects.get(pk=instance.pk)
    except ClientLogo.DoesNotExist:
        return False

    if old_obj.image and instance.image != old_obj.image:
        delete_cloudinary_image(old_obj.image)


@receiver(post_delete, sender=Service)
def cleanup_service_on_delete(sender, instance, **kwargs):
    delete_cloudinary_image(instance.image)


@receiver(pre_save, sender=Service)
def cleanup_service_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_obj = Service.objects.get(pk=instance.pk)
    except Service.DoesNotExist:
        return False

    if old_obj.image and instance.image != old_obj.image:
        delete_cloudinary_image(old_obj.image)



@receiver(post_delete, sender=AboutUs)
def cleanup_about_us_on_delete(sender, instance, **kwargs):
    delete_cloudinary_image(instance.image)


@receiver(pre_save, sender=AboutUs)
def cleanup_about_us_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_obj = AboutUs.objects.get(pk=instance.pk)
    except AboutUs.DoesNotExist:
        return False

    if old_obj.image and instance.image != old_obj.image:
        delete_cloudinary_image(old_obj.image)


@receiver(post_delete, sender=HomeHero)
def cleanup_home_hero_on_delete(sender, instance, **kwargs):
    delete_cloudinary_image(instance.image)


@receiver(pre_save, sender=HomeHero)
def cleanup_home_hero_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_obj = HomeHero.objects.get(pk=instance.pk)
    except HomeHero.DoesNotExist:
        return False

    if old_obj.image and instance.image != old_obj.image:
        delete_cloudinary_image(old_obj.image)

@receiver(post_delete, sender=ProjectsHero)
def cleanup_projects_hero_on_delete(sender, instance, **kwargs):
    delete_cloudinary_image(instance.image)


@receiver(pre_save, sender=ProjectsHero)
def cleanup_projects_hero_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_obj = ProjectsHero.objects.get(pk=instance.pk)
    except ProjectsHero.DoesNotExist:
        return False

    if old_obj.image and instance.image != old_obj.image:
        delete_cloudinary_image(old_obj.image)
