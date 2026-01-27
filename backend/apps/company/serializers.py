from rest_framework import serializers
from .models import ClientLogo, Service, CompanyInfo, AboutUs, HomeHero, ProjectsHero

class CloudinaryImageMixin:
    def get_image_url(self, obj):
        if hasattr(obj, 'image') and obj.image:
            return obj.image.url
        return None

class ClientLogoSerializer(serializers.ModelSerializer, CloudinaryImageMixin):
    image = serializers.SerializerMethodField(method_name='get_image_url')

    class Meta:
        model = ClientLogo
        fields = '__all__'
        read_only_fields = ('id', 'created_at')

class ServiceSerializer(serializers.ModelSerializer, CloudinaryImageMixin):
    image = serializers.SerializerMethodField(method_name='get_image_url')

    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ('id', 'created_at')

class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = '__all__'
        read_only_fields = ('id',)

class AboutUsSerializer(serializers.ModelSerializer, CloudinaryImageMixin):
    image = serializers.SerializerMethodField(method_name='get_image_url')

    class Meta:
        model = AboutUs
        fields = '__all__'
        read_only_fields = ('id',)

class HomeHeroSerializer(serializers.ModelSerializer, CloudinaryImageMixin):
    image = serializers.SerializerMethodField(method_name='get_image_url')

    class Meta:
        model = HomeHero
        fields = '__all__'
        read_only_fields = ('id',)

class ProjectsHeroSerializer(serializers.ModelSerializer, CloudinaryImageMixin):
    image = serializers.SerializerMethodField(method_name='get_image_url')

    class Meta:
        model = ProjectsHero
        fields = '__all__'
        read_only_fields = ('id',)