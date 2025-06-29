from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_jobs, name='get_jobs'),
    path('create/', views.create_job, name='create_job'),
    path('<int:pk>/', views.job_detail, name='job_detail'),
]
