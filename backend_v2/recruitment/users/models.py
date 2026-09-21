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


class Notification(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:50]}"

class PlatformSettings(models.Model):
    platform_name = models.CharField(max_length=255, default='AI Recruit')
    default_language = models.CharField(max_length=50, default='English (US)')
    timezone = models.CharField(max_length=100, default='UTC (Coordinated Universal Time)')
    smtp_server = models.CharField(max_length=255, default='smtp.mailgun.org')
    smtp_port = models.IntegerField(default=587)
    smtp_encryption = models.CharField(max_length=20, default='TLS')
    from_email_address = models.EmailField(default='noreply@airecruit.com')

    def save(self, *args, **kwargs):
        self.pk = 1
        super(PlatformSettings, self).save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

class SecuritySettings(models.Model):
    require_2fa = models.BooleanField(default=True)
    force_password_expiry = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.pk = 1
        super(SecuritySettings, self).save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

class SecurityLog(models.Model):
    event = models.CharField(max_length=255)
    user_identifier = models.CharField(max_length=255) # Email or IP description
    status = models.CharField(max_length=50, choices=[('success', 'Success'), ('error', 'Error')])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.event} - {self.user_identifier} [{self.status}]"
