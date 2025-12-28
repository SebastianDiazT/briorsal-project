from django.contrib import admin
from .models import Project, Category, ProjectImage, ProjectVideo


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


class ProjectVideoInline(admin.TabularInline):
    model = ProjectVideo
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    inlines = [
        ProjectImageInline,
        ProjectVideoInline,
    ]
    list_display = ('name', 'category', 'is_featured', 'created_at')
    list_filter = ('category', 'is_featured')
    list_editable = ('is_featured',)
    search_fields = ('name', 'location')
    list_per_page = 20


admin.site.register(Category)
