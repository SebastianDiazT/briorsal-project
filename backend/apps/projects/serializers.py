from django.db import transaction
from rest_framework import serializers
from .models import Project, Category, ProjectImage, ProjectVideo

class CategorySerializer(serializers.ModelSerializer):
    project_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'project_count']

class ProjectImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ProjectImage
        fields = ['id', 'image']

    def get_image(self, obj):
        if hasattr(obj, 'image_large') and obj.image_large:
            return obj.image_large.url
        return obj.image.url

class ProjectVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectVideo
        fields = ['id', 'video']

class ProjectListSerializer(serializers.ModelSerializer):
    cover_image = serializers.ImageField(use_url=True)
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id',
            'name',
            'slug',
            'cover_image',
            'categories',
            'location',
            'year',
            'is_featured',
            'sort_order',
            'status'
        ]

    def get_cover_image(self, obj):
        if obj.cover_thumbnail:
            return obj.cover_thumbnail.url
        return None


class ProjectSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)

    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='categories', write_only=True, many=True
    )

    images = ProjectImageSerializer(many=True, read_only=True)
    videos = ProjectVideoSerializer(many=True, read_only=True)

    cover_image = serializers.ImageField(use_url=True)

    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False,
    )
    uploaded_videos = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False,
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
            'id',
            'slug',
            'categories',
            'category_ids',
            'name',
            'location',
            'description',
            'year',
            'service_type',
            'levels',
            'area',
            'status',
            'extra_info',
            'cover_image',
            'images',
            'videos',
            'uploaded_images',
            'uploaded_videos',
            'delete_images',
            'delete_videos',
            'is_featured',
            'sort_order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        uploaded_videos = validated_data.pop('uploaded_videos', [])
        categories = validated_data.pop('categories', [])

        validated_data.pop('delete_images', None)
        validated_data.pop('delete_videos', None)

        with transaction.atomic():
            project = Project.objects.create(**validated_data)

            if categories:
                project.categories.set(categories)

            self._save_media(project, uploaded_images, uploaded_videos)

        return project

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        uploaded_videos = validated_data.pop('uploaded_videos', [])
        delete_images_ids = validated_data.pop('delete_images', [])
        delete_videos_ids = validated_data.pop('delete_videos', [])

        categories = validated_data.pop('categories', None)

        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if categories is not None:
                instance.categories.set(categories)

            if delete_images_ids:
                ProjectImage.objects.filter(
                    id__in=delete_images_ids, project=instance
                ).delete()

            if delete_videos_ids:
                ProjectVideo.objects.filter(
                    id__in=delete_videos_ids, project=instance
                ).delete()

            self._save_media(instance, uploaded_images, uploaded_videos)

        return instance

    def _save_media(self, project, images, videos):
        for img in images:
            ProjectImage.objects.create(project=project, image=img)

        for vid in videos:
            ProjectVideo.objects.create(project=project, video=vid)

class ProjectReorderSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    sort_order = serializers.IntegerField()

class ProjectReorderListSerializer(serializers.Serializer):
    items = ProjectReorderSerializer(many=True)