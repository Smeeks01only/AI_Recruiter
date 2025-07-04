# Generated by Django 5.2.1 on 2025-05-09 12:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='parsed_email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AddField(
            model_name='application',
            name='parsed_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='application',
            name='parsed_phone',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='application',
            name='parsed_skills',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
