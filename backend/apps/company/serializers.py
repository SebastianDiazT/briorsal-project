from rest_framework import serializers
from .models import ClientLogo, Service, CompanyInfo, AboutUs, HomeHero, ProjectsHero

class BaseImageSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if hasattr(instance, 'image') and instance.image:
            representation['image'] = instance.image.url
        return representation

class ClientLogoSerializer(BaseImageSerializer):
    class Meta:
        model = ClientLogo
        fields = '__all__'
        read_only_fields = ('id', 'created_at')

class ServiceSerializer(BaseImageSerializer):
    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ('id', 'created_at')

class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = '__all__'
        read_only_fields = ('id',)

class AboutUsSerializer(BaseImageSerializer):
    class Meta:
        model = AboutUs
        fields = '__all__'
        read_only_fields = ('id',)

class HomeHeroSerializer(BaseImageSerializer):
    class Meta:
        model = HomeHero
        fields = '__all__'
        read_only_fields = ('id',)

class ProjectsHeroSerializer(BaseImageSerializer):
    class Meta:
        model = ProjectsHero
        fields = '__all__'
        read_only_fields = ('id',)