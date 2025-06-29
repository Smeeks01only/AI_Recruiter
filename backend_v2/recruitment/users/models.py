from django.db import models
from django.contrib.auth.models import AbstractUser

class Users(AbstractUser):
    ROLE_CHOICES = (
        ('candidate', 'Candidate'),
        ('hr', 'HR Manager'),
        ('admin', 'System Admin'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})" 
