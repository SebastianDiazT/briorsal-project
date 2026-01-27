from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = ContactMessage
        fields = '__all__'

        read_only_fields = (
            'id',
            'created_at',
            'updated_at',
            'status',
            'admin_notes'
        )

class ContactUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['status', 'admin_notes']

    def validate_status(self, value):
        if self.instance and self.instance.status == ContactMessage.Status.REPLIED:
            if value == ContactMessage.Status.NEW:
                raise serializers.ValidationError("No se puede reactivar un mensaje ya cerrado.")
        return value