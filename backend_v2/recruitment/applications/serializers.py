from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.SerializerMethodField()
    applicant_first_name = serializers.SerializerMethodField()
    applicant_last_name = serializers.SerializerMethodField()
    job_title = serializers.SerializerMethodField()
    applicant_email = serializers.SerializerMethodField()
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['candidate', 'created_at', 'status']

    def get_applicant_name(self, obj):
        if obj.candidate:
            return obj.candidate.username
        return obj.parsed_name or "Unknown"
    
    def get_applicant_first_name(self, obj):
        if obj.candidate and obj.candidate.first_name:
            return obj.candidate.first_name
        if obj.parsed_name:
            return obj.parsed_name.split()[0]
        return "Unknown"
    
    def get_applicant_last_name(self, obj):
        if obj.candidate and obj.candidate.last_name:
            return obj.candidate.last_name
        if obj.parsed_name:
            parts = obj.parsed_name.split()
            return " ".join(parts[1:]) if len(parts) > 1 else ""
        return "Unknown"
    
    def get_applicant_email(self, obj):
        if obj.candidate and obj.candidate.email:
            return obj.candidate.email
        return obj.parsed_email or "Unknown"
    def get_job_title(self, obj):
        return obj.job.title if obj.job else "Unknown"
