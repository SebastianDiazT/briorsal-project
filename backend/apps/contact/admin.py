from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'subject', 'created_at', 'is_read')
    list_display_links = ('full_name', 'subject')
    list_filter = ('is_read', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'subject', 'message')
    readonly_fields = ('created_at', 'first_name', 'last_name', 'email', 'phone', 'subject', 'message')
    list_per_page = 20
    ordering = ('-created_at',)

    fieldsets = (
        ('Información del Remitente', {
            'fields': (('first_name', 'last_name'), ('email', 'phone'))
        }),
        ('Contenido del Mensaje', {
            'fields': ('subject', 'message', 'created_at')
        }),
        ('Estado', {
            'fields': ('is_read',)
        }),
    )

    actions = ['mark_as_read', 'mark_as_unread']

    @admin.display(description='Nombre Completo', ordering='first_name')
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    @admin.action(description='Marcar seleccionados como LEÍDOS')
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} mensajes marcados como leídos.')

    @admin.action(description='Marcar seleccionados como NO LEÍDOS')
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} mensajes marcados como no leídos.')