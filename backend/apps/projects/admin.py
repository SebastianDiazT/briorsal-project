from django.contrib import admin
from django.utils.html import format_html
from .models import Project, Category, ProjectImage, ProjectVideo

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 100px; height: auto;" />', obj.image.url
            )
        return 'No Image'

    image_preview.short_description = 'Vista Previa'

class ProjectVideoInline(admin.TabularInline):
    model = ProjectVideo
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'count_projects')
    search_fields = ('name',)

    def count_projects(self, obj):
        return obj.projects.count()
    count_projects.short_description = 'Nº de Proyectos'

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'year', 'status', 'is_featured', 'created_at', 'main_image_preview')

    list_filter = ('category', 'status', 'year', 'is_featured')

    search_fields = ('name', 'location', 'description')

    readonly_fields = ('slug', 'created_at')

    inlines = [ProjectImageInline, ProjectVideoInline]

    fieldsets = (
        ('Información Principal', {
            'fields': ('name', 'slug', 'category', 'status', 'is_featured')
        }),
        ('Detalles', {
            'fields': ('location', 'year', 'description', 'extra_info')
        }),
        ('Especificaciones Técnicas', {
            'fields': ('service_type', 'levels', 'area')
        }),
    )

    def main_image_preview(self, obj):
        first_image = obj.images.first()
        if first_image and first_image.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />', first_image.image.url)
        return "-"
    main_image_preview.short_description = "Img"