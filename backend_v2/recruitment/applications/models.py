from django.db import models
from users.models import Users
from jobs.models import Job
from django.contrib.postgres.fields import ArrayField 

class Application(models.Model):
    candidate = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')  # pending, shortlisted, rejected, etc.
    
    parsed_name = models.CharField(max_length=255, blank=True, null=True)
    parsed_email = models.EmailField(blank=True, null=True)
    parsed_phone = models.CharField(max_length=20, blank=True, null=True)
    parsed_skills = models.JSONField(blank=True, null=True)

    match_score = models.IntegerField(blank=True, null=True)
    match_explanation = ArrayField(models.TextField(), blank=True, null=True)

    # ✅ Add this field
    ai_score = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.candidate.username} - {self.job.title}"

