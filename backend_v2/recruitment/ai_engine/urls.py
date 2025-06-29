# from django.urls import path
# from .views import explain_job_matches

# urlpatterns = [
#     path('job/<int:job_id>/explanations/', explain_job_matches, name='explain_job_matches'),
# ]

from django.urls import path
from .views import retrain_model_view, model_status_view, bias_report_view

urlpatterns = [
    path('retrain/', retrain_model_view),
    path('status/', model_status_view),
   path('bias_report/', bias_report_view),
]

