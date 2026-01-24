from rest_framework import serializers
from .models import ClientLogo, Service, CompanyInfo, AboutUs, HomeHero, ProjectsHero

class ClientLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientLogo
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = '__all__'

class AboutUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutUs
        fields = '__all__'

class HomeHeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeHero
        fields = '__all__'

class ProjectsHeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectsHero
        fields = '__all__'