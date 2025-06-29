# reports/urls.py
from django.urls import path
from .views import match_score_report, bias_summary_report

urlpatterns = [
    path('match-stats/', match_score_report, name='match-score-report'),
    path('bias-summary/', bias_summary_report, name='bias-summary-report'),
]
