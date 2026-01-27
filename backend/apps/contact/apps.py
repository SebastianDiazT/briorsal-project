from django.apps import AppConfig

class ContactConfig(AppConfig):
    name = 'apps.contact'
    verbose_name = "Gestión de Contacto"

    def ready(self):
        import apps.contact.signals  # noqa