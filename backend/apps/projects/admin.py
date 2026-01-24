from django.contrib import admin
from django.utils.html import format_html
from .models import Project, Category, ProjectImage, ProjectVideo
from adminsortable2.admin import SortableAdminMixin

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    readonly_fields = ["image_preview"]

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 100px; height: auto;" />', obj.image.url
            )
        return "No Image"

    image_preview.short_description = "Vista Previa"


class ProjectVideoInline(admin.TabularInline):
    model = ProjectVideo
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "count_projects", "created_at")
    search_fields = ("name",)

    def count_projects(self, obj):
        return obj.projects.count()

    count_projects.short_description = "Nº de Proyectos"


@admin.register(Project)
class ProjectAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = (
        "cover_preview",
        "name",
        "sort_order",
        "year",
        "status",
        "is_featured",
        "created_at",
    )

    list_editable = ("status", "is_featured")

    search_fields = ("name", "location", "description", "categories__name")

    readonly_fields = ("slug", "created_at", "updated_at")

    filter_horizontal = ("categories",)

    inlines = [ProjectImageInline, ProjectVideoInline]

    fieldsets = (
        (
            "Información Principal",
            {
                "fields": (
                    "cover_image",
                    "name",
                    "slug",
                    "categories",
                    "status",
                    "is_featured",
                )
            },
        ),
        ("Detalles", {"fields": ("location", "year", "description", "extra_info")}),
        ("Especificaciones Técnicas", {"fields": ("service_type", "levels", "area")}),
        (
            "Fechas",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    def cover_preview(self, obj):
        if obj.cover_image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                obj.cover_image.url,
            )
        return "-"

    cover_preview.short_description = "Portada"
