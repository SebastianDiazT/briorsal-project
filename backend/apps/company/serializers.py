from rest_framework import serializers
from .models import ClientLogo, Service, CompanyInfo, AboutUs, HomeHero

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

class HomeHeroSerializer(serializers.Serializer):
    class Meta:
        model = HomeHero
        fields = "__all__"