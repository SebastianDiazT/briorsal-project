from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ('is_read', 'created_at', 'id')

class ContactStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['is_read'] # <--- Aquí está la magia: solo permite este campo