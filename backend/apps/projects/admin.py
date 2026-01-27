from django.contrib import admin
from django.utils.html import format_html
from adminsortable2.admin import SortableAdminMixin
from .models import Project, Category, ProjectImage, ProjectVideo

class ProjectImageInline(admin.TabularInline):
    """Permite subir múltiples imágenes de galería directamente desde el Proyecto"""
    model = ProjectImage
    extra = 1
    readonly_fields = ["image_preview"]
    fields = ["image", "image_preview"]

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 120px; height: 80px; object-fit: cover; border-radius: 4px;" />', 
                obj.image.url
            )
        return "Sin imagen"

    image_preview.short_description = "Vista Previa"


class ProjectVideoInline(admin.TabularInline):
    """Permite subir videos (Cloudinary Resource Type: Video)"""
    model = ProjectVideo
    extra = 1
    fields = ["title", "video"]


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
        "cover_preview_small",
        "name",
        "category_list",
        "year",
        "status",
        "is_featured",
        "sort_order",
    )

    list_editable = ("status", "is_featured")

    list_filter = ("status", "is_featured", "categories", "year")

    search_fields = ("name", "location", "description", "categories__name")

    readonly_fields = (
        "slug",
        "created_at",
        "updated_at",
        "cover_preview_large",
        "banner_preview"
    )

    filter_horizontal = ("categories", "related_projects")

    inlines = [ProjectImageInline, ProjectVideoInline]

    fieldsets = (
        (
            "Identidad Visual",
            {
                "fields": (
                    ("cover_image", "cover_preview_large"),
                    ("banner_image", "banner_preview"),
                ),
                "description": "La portada es cuadrada/vertical (Grid). El banner es horizontal (Hero del detalle)."
            },
        ),
        (
            "Información Principal",
            {
                "fields": (
                    "name",
                    "slug",
                    "status",
                    "is_featured",
                    "sort_order",
                )
            },
        ),
        (
            "Relaciones y Clasificación",
            {
                "fields": ("categories", "related_projects"),
                "description": "Selecciona las categorías y otros proyectos sugeridos."
            }
        ),
        ("Detalles del Proyecto", {"fields": ("location", "year", "description", "extra_info")}),
        ("Ficha Técnica", {"fields": ("service_type", "levels", "area")}),
        (
            "Auditoría",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    def cover_preview_small(self, obj):
        if obj.cover_image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                obj.cover_image.url,
            )
        return "-"
    cover_preview_small.short_description = "Portada"

    def cover_preview_large(self, obj):
        if obj.cover_image:
            return format_html(
                '<img src="{}" style="max-height: 200px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />',
                obj.cover_image.url,
            )
        return "Sin portada cargada"
    cover_preview_large.short_description = "Vista Actual"

    def banner_preview(self, obj):
        if obj.banner_image:
            return format_html(
                '<img src="{}" style="max-height: 150px; width: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />',
                obj.banner_image.url,
            )
        return "Sin banner (Se usará la portada por defecto)"
    banner_preview.short_description = "Vista Banner"

    def category_list(self, obj):
        return ", ".join([c.name for c in obj.categories.all()])
    category_list.short_description = "Categorías"