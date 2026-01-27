from django.contrib import admin
from django.utils.html import format_html
from .models import ClientLogo, Service, CompanyInfo, AboutUs, HomeHero, ProjectsHero

class SingletonAdminMixin:
    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

class ImagePreviewMixin:
    def get_preview(self, obj):
        if hasattr(obj, 'image') and obj.image:
            return format_html(
                '<img src="{}" style="width: 120px; height: auto; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />',
                obj.image.url
            )
        return "Sin imagen"
    get_preview.short_description = "Vista Previa"

@admin.register(ClientLogo)
class ClientLogoAdmin(admin.ModelAdmin, ImagePreviewMixin):
    list_display = ('name', 'get_preview', 'created_at')
    search_fields = ('name',)
    list_per_page = 20

    readonly_fields = ('get_preview', 'created_at')
    fields = ('name', 'image', 'get_preview')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin, ImagePreviewMixin):
    list_display = ('name', 'get_preview', 'created_at')
    search_fields = ('name', 'description')

    readonly_fields = ('get_preview', 'created_at')
    fieldsets = (
        (None, {'fields': ('name', 'description')}),
        ('Multimedia', {'fields': ('image', 'get_preview')}),
    )

@admin.register(CompanyInfo)
class CompanyInfoAdmin(SingletonAdminMixin, admin.ModelAdmin):
    list_display = ('__str__', 'email', 'phone')

    fieldsets = (
        ('Información de Contacto', {
            'fields': ('phone', 'email', 'address')
        }),
        ('Ubicación y Horarios', {
            'fields': ('google_maps_url', 'google_maps_link', 'opening_hours'),
            'description': 'Configure los enlaces de Google Maps y el horario visible en el footer.'
        }),
        ('Redes Sociales', {
            'fields': ('facebook', 'instagram', 'linkedin', 'tiktok', 'whatsapp'),
            'classes': ('collapse',),
        }),
    )

@admin.register(AboutUs)
class AboutUsAdmin(SingletonAdminMixin, admin.ModelAdmin, ImagePreviewMixin):
    list_display = ('__str__', 'get_preview')

    readonly_fields = ('get_preview',)
    fieldsets = (
        ('Textos Principales', {
            'fields': ('description', 'mission', 'vision')
        }),
        ('Imagen', {
            'fields': ('image', 'get_preview')
        }),
    )

@admin.register(HomeHero)
class HomeHeroAdmin(SingletonAdminMixin, admin.ModelAdmin, ImagePreviewMixin):
    list_display = ('title', 'badge', 'get_preview')

    readonly_fields = ('get_preview',)
    fieldsets = (
        ('Encabezados', {
            'fields': ('badge', 'title', 'highlight')
        }),
        ('Contenido', {
            'fields': ('description',)
        }),
        ('Fondo', {
            'fields': ('image', 'get_preview')
        }),
    )

@admin.register(ProjectsHero)
class ProjectsHeroAdmin(SingletonAdminMixin, admin.ModelAdmin, ImagePreviewMixin):
    list_display = ('title', 'highlight', 'get_preview')

    readonly_fields = ('get_preview',)
    fieldsets = (
        ('Encabezados', {
            'fields': ('title', 'highlight')
        }),
        ('Contenido', {
            'fields': ('description',)
        }),
        ('Fondo', {
            'fields': ('image', 'get_preview')
        }),
    )