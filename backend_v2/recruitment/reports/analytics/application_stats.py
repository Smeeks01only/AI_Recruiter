# reports/analytics/application_stats.py
from applications.models import Application
from jobs.models import Job
from django.db.models import Avg, Max, Min

def get_match_score_stats_per_job():
    jobs = Job.objects.all()
    report = []

    for job in jobs:
        stats = Application.objects.filter(job=job).aggregate(
            average_score=Avg('match_score'),
            min_score=Min('match_score'),
            max_score=Max('match_score')
        )
        report.append({
            "job_id": job.id,
            "job_title": job.title,
            "average_score": round(stats['average_score'] or 0, 2),
            "min_score": round(stats['min_score'] or 0, 2),
            "max_score": round(stats['max_score'] or 0, 2)
        })
    
    return report
