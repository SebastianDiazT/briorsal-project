from django.apps import AppConfig


class CompanyConfig(AppConfig):
    name = 'apps.company'
    verbose_name = 'Gestión de la Empresa'

    def ready(self):
        import apps.company.signals  # noqa
