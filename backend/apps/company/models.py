from django.db import models

class ClientLogo(models.Model):
    name = models.CharField(max_length=100, verbose_name='Nombre Cliente')
    image = models.ImageField(upload_to='company/clients/', verbose_name='Logo')
    order = models.IntegerField(default=0, verbose_name='Orden')

    class Meta:
        db_table = 'client_logos'
        ordering = ['order']
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return self.name


class Service(models.Model):
    title = models.CharField(max_length=100, verbose_name='Título Servicio')
    image = models.ImageField(upload_to="company/services/", blank=True, null=True)
    description = models.TextField(verbose_name='Descripción')

    class Meta:
        db_table = 'services'
        verbose_name = 'Servicio'
        verbose_name_plural = 'Servicios'

    def __str__(self):
        return self.title


class CompanyInfo(models.Model):
    phone = models.CharField(max_length=50, verbose_name='Teléfono')
    email = models.EmailField(verbose_name='Email')
    address = models.CharField(max_length=255, verbose_name='Dirección')

    facebook = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    tiktok = models.URLField(blank=True, null=True)
    whatsapp = models.CharField(max_length=50, blank=True, help_text="Número para link de WA")

    class Meta:
        verbose_name = 'Información de Empresa'
        verbose_name_plural = 'Información de Empresa'

    def __str__(self):
        return 'Configuración General'

    def save(self, *args, **kwargs):
        if not self.pk and CompanyInfo.objects.exists():
            return CompanyInfo.objects.first()
        return super(CompanyInfo, self).save(*args, **kwargs)


class AboutUs(models.Model):
    description = models.TextField(verbose_name='Descripción de la Empresa')

    mission = models.TextField(verbose_name='Misión')

    vision = models.TextField(verbose_name='Visión')

    image = models.ImageField(upload_to='company/about/', blank=True, null=True, verbose_name='Imagen Principal')

    class Meta:
        verbose_name = 'Nosotros (Misión/Visión)'
        verbose_name_plural = 'Nosotros (Misión/Visión)'

    def __str__(self):
        return 'Información de Nosotros'

    def save(self, *args, **kwargs):
        if not self.pk and AboutUs.objects.exists():
            return AboutUs.objects.first()
        return super(AboutUs, self).save(*args, **kwargs)