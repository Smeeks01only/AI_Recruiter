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
        return obj.candidate.username if obj.candidate else "Unknown"
    
    def get_applicant_first_name(self, obj):
        return obj.candidate.first_name if obj.candidate else "Unknown"
    
    def get_applicant_last_name(self, obj):
        return obj.candidate.last_name if obj.candidate else "Unknown"
    
    def get_applicant_email(self, obj):
        return obj.candidate.email if obj.candidate else "Unknown"
    def get_job_title(self, obj):
        return obj.job.title if obj.job else "Unknown"
