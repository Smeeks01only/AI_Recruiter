from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_applications, name='get_applications'),
    path('apply/', views.submit_application, name='submit_application'),
    path('my-applications/', views.candidate_applications, name='candidate_applications'),
    path('hr-upload/', views.hr_upload_application, name='hr_upload'),
    path('job/<int:job_id>/applications/', views.get_applications_for_job, name='get_applications_for_job'),
    path('<int:pk>/update_status/', views.update_application_status, name='update_application_status'),
    path('<int:pk>/delete/', views.delete_application, name='delete_application'),
    path('my_stats/', views.candidate_application_stats, name='candidate_application_stats'),
]
