from rest_framework import serializers
from .models import Users, Notification, PlatformSettings, SecuritySettings, SecurityLog

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'username', 'email', 'first_name','last_name', 'role', 'bio', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Users.objects.create_user(**validated_data)
        return user


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'is_read', 'created_at']

class PlatformSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSettings
        fields = '__all__'

class SecuritySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecuritySettings
        fields = '__all__'

class SecurityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityLog
        fields = '__all__'
