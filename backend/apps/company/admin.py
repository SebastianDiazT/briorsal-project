from django.contrib import admin
from django.utils.html import format_html
from .models import ClientLogo, Service, CompanyInfo, AboutUs

@admin.register(ClientLogo)
class ClientLogoAdmin(admin.ModelAdmin):
    list_display = ('name', 'logo_preview')
    search_fields = ('name',)

    def logo_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 80px; height: auto; background: #ccc; padding: 2px;" />', obj.image.url)
        return "-"
    logo_preview.short_description = "Logo"

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'image_preview')
    search_fields = ('name', 'description')

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Imagen"

@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone')

    fieldsets = (
        ('Información Básica', {
            'fields': ('phone', 'email', 'address')
        }),
        ('Ubicación y Horarios', {
            'fields': ('google_maps_url', 'opening_hours')
        }),
        ('Redes Sociales', {
            'fields': ('facebook', 'instagram', 'linkedin', 'tiktok', 'whatsapp')
        }),
    )

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(AboutUs)
class AboutUsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)