from django.db import transaction
from rest_framework import serializers
from .models import Project, Category, ProjectImage, ProjectVideo

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image']

class ProjectVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectVideo
        fields = ['id', 'video']

class ProjectSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    images = ProjectImageSerializer(many=True, read_only=True)
    videos = ProjectVideoSerializer(many=True, read_only=True)

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
            'category',
            'category_name',
            'name',
            'location',
            'description',
            'year',
            'service_type',
            'levels',
            'area',
            'status',
            'extra_info',
            'images',
            'videos',
            'uploaded_images',
            'uploaded_videos',
            'delete_images',
            'delete_videos',
            'is_featured',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'category_name', 'created_at', 'updated_at']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        uploaded_videos = validated_data.pop('uploaded_videos', [])

        validated_data.pop('delete_images', None)
        validated_data.pop('delete_videos', None)

        with transaction.atomic():
            project = Project.objects.create(**validated_data)
            self._save_media(project, uploaded_images, uploaded_videos)

        return project

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        uploaded_videos = validated_data.pop('uploaded_videos', [])

        delete_images_ids = validated_data.pop('delete_images', [])
        delete_videos_ids = validated_data.pop('delete_videos', [])

        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

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
