from django.contrib import admin

from .models import CompanyInfo, Service, ClientLogo

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