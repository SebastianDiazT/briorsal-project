from django.contrib import admin

from .models import CompanyInfo, Service, ClientLogo, AboutUs

@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ('phone', 'email', 'address')
    search_fields = ('phone', 'email', 'address')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title',)
    search_fields = ('title', 'description')

@admin.register(ClientLogo)
class ClientLogoAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    search_fields = ('name',)
    ordering = ('order',)

@admin.register(AboutUs)
class AboutUsAdmin(admin.ModelAdmin):
    list_display = ('short_description',)

    def short_description(self, obj):
        return obj.description[:50] + '...' if len(obj.description) > 50 else obj.description