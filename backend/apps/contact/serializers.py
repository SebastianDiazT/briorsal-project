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

    def validate_inquiry_type(self, value):
        if value is None or value == "":
            raise serializers.ValidationError(
                "Debes seleccionar un tipo de consulta válido."
            )
        return value

    def validate_email(self, value):
        if not value or value.strip() == "":
            raise serializers.ValidationError("El correo electrónico es obligatorio.")
        return value

    def validate_message(self, value):
        if not value or value.strip() == "":
            raise serializers.ValidationError("El mensaje no puede estar vacío.")
        return value

class ContactUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['status', 'admin_notes']

    def validate_status(self, value):
        if self.instance and self.instance.status == ContactMessage.Status.REPLIED:
            if value == ContactMessage.Status.NEW:
                raise serializers.ValidationError("No se puede reactivar un mensaje ya cerrado.")
        return value