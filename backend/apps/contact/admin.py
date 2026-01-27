from django.contrib import admin
from django.utils.html import format_html
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('full_name_display', 'inquiry_type', 'email', 'phone', 'created_at', 'status_badge')
    list_display_links = ('full_name_display', 'email')

    list_filter = ('status', 'inquiry_type', 'created_at')

    search_fields = ('first_name', 'last_name', 'email', 'subject', 'phone')

    list_per_page = 25
    ordering = ('-created_at',)

    readonly_fields = (
        'created_at', 'updated_at',
        'first_name', 'last_name', 'email', 'phone',
        'inquiry_type', 'subject', 'message'
    )

    fieldsets = (
        ('Información del Lead', {
            'fields': (('first_name', 'last_name'), ('email', 'phone'), 'inquiry_type')
        }),
        ('Detalle del Mensaje', {
            'fields': ('subject', 'message', 'created_at')
        }),
        ('Gestión Interna', {
            'fields': ('status', 'admin_notes', 'updated_at'),
            'description': 'Espacio para que el equipo de ventas actualice el estado del lead.'
        }),
    )

    actions = ['mark_in_progress', 'mark_replied', 'mark_spam']


    @admin.display(description='Nombre Completo', ordering='first_name')
    def full_name_display(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    @admin.display(description='Estado', ordering='status')
    def status_badge(self, obj):
        """Genera una etiqueta de color según el estado"""
        colors = {
            'NEW': '#10b981',
            'IN_PROGRESS': '#3b82f6',
            'REPLIED': '#6b7280',
            'SPAM': '#ef4444',
        }
        color = colors.get(obj.status, '#333')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )

    @admin.action(description='Marcar como "En Seguimiento"')
    def mark_in_progress(self, request, queryset):
        updated = queryset.update(status=ContactMessage.Status.IN_PROGRESS)
        self.message_user(request, f'{updated} mensajes marcados en seguimiento.')

    @admin.action(description='Marcar como "Respondido/Cerrado"')
    def mark_replied(self, request, queryset):
        updated = queryset.update(status=ContactMessage.Status.REPLIED)
        self.message_user(request, f'{updated} mensajes cerrados.')

    @admin.action(description='Marcar como "Spam"')
    def mark_spam(self, request, queryset):
        updated = queryset.update(status=ContactMessage.Status.SPAM)
        self.message_user(request, f'{updated} mensajes marcados como spam.')

    def has_add_permission(self, request):
        return False