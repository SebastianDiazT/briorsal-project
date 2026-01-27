from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import UserAccount

@admin.register(UserAccount)
class UserAccountAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')

    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined')

    search_fields = ('email', 'first_name', 'last_name')

    ordering = ('-date_joined',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Información Personal'), {'fields': ('first_name', 'last_name')}),
        (_('Permisos'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Fechas Importantes'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )

    readonly_fields = ('date_joined', 'last_login')

    filter_horizontal = ('groups', 'user_permissions',)