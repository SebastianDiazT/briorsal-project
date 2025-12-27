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

    class Meta:
        model = Project
        fields = [
            'id',
            'slug',
            'category',
            'category_name',
            'name',
            'location',
            'service_type',
            'levels',
            'area',
            'status',
            'year',
            'images',
            'videos',
            'uploaded_images',
            'uploaded_videos',
            'is_featured'
        ]
        read_only_fields = ['id', 'slug', 'images', 'videos', 'category_name']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        uploaded_videos = validated_data.pop('uploaded_videos', [])

        project = Project.objects.create(**validated_data)

        for img in uploaded_images:
            ProjectImage.objects.create(project=project, image=img)

        for vid in uploaded_videos:
            ProjectVideo.objects.create(project=project, video=vid)

        return project
