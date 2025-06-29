from django.db import models
from users.models import Users  # import the custom user model

class Job(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    created_by = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='jobs', null=True, blank=True) # Foreign key to users model
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    
     # Add these fields for matching logic
    required_skills = models.JSONField(default=list, blank=True, null=True)
    preferred_education = models.CharField(max_length=255, blank=True, null=True)
    preferred_titles = models.JSONField(default=list, blank=True, null=True)

    def __str__(self):
        return f"{self.title} at {self.company}"
