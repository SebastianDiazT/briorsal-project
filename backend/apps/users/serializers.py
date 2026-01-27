from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from rest_framework import serializers

User = get_user_model()

class UserCreateSerializer(DjoserUserCreateSerializer):
    class Meta(DjoserUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password')

    def validate(self, attrs):
        user = User(**attrs)
        password = attrs.get('password')

        try:
            validate_password(password, user)
        except exceptions.ValidationError as e:
            serializer_errors = serializers.as_serializer_error(e)
            raise serializers.ValidationError(
                {"password": serializer_errors["non_field_errors"]}
            )

        return attrs

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'is_staff',
            'is_active',
            'date_joined'
        )
        read_only_fields = ('email', 'is_staff', 'is_active', 'date_joined')