from django.apps import AppConfig


class ProjectsConfig(AppConfig):
    name = 'apps.projects'
    verbose_name = 'Gestión de Proyectos'

    def ready(self):
        import apps.projects.signals # noqa
