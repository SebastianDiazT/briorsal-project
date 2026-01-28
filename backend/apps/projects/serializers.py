from django.db import transaction
from rest_framework import serializers
from .models import Project, Category, ProjectImage, ProjectVideo

def get_cloudinary_url(image_field):
    if image_field:
        return image_field.url
    return None

class CategorySerializer(serializers.ModelSerializer):
    project_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'project_count']

class ProjectImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = ['id', 'image_url']

    def get_image_url(self, obj):
        return get_cloudinary_url(obj.image)

class ProjectVideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = ProjectVideo
        fields = ['id', 'title', 'video_url']

    def get_video_url(self, obj):
        return get_cloudinary_url(obj.video)

class ProjectCardSerializer(serializers.ModelSerializer):
    cover = serializers.SerializerMethodField()
    category_names = serializers.StringRelatedField(many=True, source='categories')

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'slug', 'cover',
            'category_names', 'location', 'year', 'is_featured', 'status'
        ]

    def get_cover(self, obj):
        return get_cloudinary_url(obj.cover_image)

class ProjectSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    videos = ProjectVideoSerializer(many=True, read_only=True)
    related_projects = ProjectCardSerializer(many=True, read_only=True)

    cover_image_url = serializers.SerializerMethodField()
    banner_image_url = serializers.SerializerMethodField()

    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='categories', write_only=True, many=True
    )
    related_project_ids = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), source='related_projects', write_only=True, many=True, required=False
    )

    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )
    uploaded_videos = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )

    delete_images = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    delete_videos = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = Project
        fields = [
            'id', 'slug', 'name',
            'location', 'description', 'year', 'status',
            'service_type', 'levels', 'area',
            'is_featured', 'sort_order', 'extra_info',
            'cover_image', 'cover_image_url',
            'banner_image', 'banner_image_url',
            'categories', 'related_projects', 'images', 'videos',
            'category_ids', 'related_project_ids',
            'uploaded_images', 'uploaded_videos',
            'delete_images', 'delete_videos',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
        extra_kwargs = {
            'cover_image': {'write_only': True},
            'banner_image': {'write_only': True},
        }

    def get_cover_image_url(self, obj):
        return get_cloudinary_url(obj.cover_image)

    def get_banner_image_url(self, obj):
        return get_cloudinary_url(obj.banner_image)

    def to_internal_value(self, data):
        data_mutable = data.copy()

        if 'category_ids' in data and data['category_ids'] == '':
            if hasattr(data_mutable, 'setlist'):
                data_mutable.setlist('category_ids', [])
            else:
                data_mutable['category_ids'] = []

        if 'related_project_ids' in data and data['related_project_ids'] == '':
            if hasattr(data_mutable, 'setlist'):
                data_mutable.setlist('related_project_ids', [])
            else:
                data_mutable['related_project_ids'] = []

        if 'cover_image' in data and data['cover_image'] == '':
            data_mutable['cover_image'] = None

        if 'banner_image' in data and data['banner_image'] == '':
            data_mutable['banner_image'] = None

        return super().to_internal_value(data_mutable)

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        uploaded_videos = validated_data.pop('uploaded_videos', [])
        categories = validated_data.pop('categories', [])
        related_projects = validated_data.pop('related_projects', [])

        validated_data.pop('delete_images', None)
        validated_data.pop('delete_videos', None)

        with transaction.atomic():
            project = Project.objects.create(**validated_data)

            if categories:
                project.categories.set(categories)
            if related_projects:
                project.related_projects.set(related_projects)

            self._save_media(project, uploaded_images, uploaded_videos)

        return project

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        uploaded_videos = validated_data.pop('uploaded_videos', [])
        delete_images_ids = validated_data.pop('delete_images', [])
        delete_videos_ids = validated_data.pop('delete_videos', [])

        categories = validated_data.pop('categories', None)
        related_projects = validated_data.pop('related_projects', None)

        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if categories is not None:
                instance.categories.set(categories)
            if related_projects is not None:
                instance.related_projects.set(related_projects)

            if delete_images_ids:
                ProjectImage.objects.filter(id__in=delete_images_ids, project=instance).delete()

            if delete_videos_ids:
                ProjectVideo.objects.filter(id__in=delete_videos_ids, project=instance).delete()

            self._save_media(instance, uploaded_images, uploaded_videos)

        return instance

    def _save_media(self, project, images, videos):
        for img in images:
            ProjectImage.objects.create(project=project, image=img)

        for vid in videos:
            ProjectVideo.objects.create(project=project, video=vid, title=f"Video {project.name}")

class ProjectReorderSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    sort_order = serializers.IntegerField()

class ProjectReorderListSerializer(serializers.Serializer):
    items = ProjectReorderSerializer(many=True)