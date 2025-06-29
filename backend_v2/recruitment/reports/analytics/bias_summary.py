# reports/analytics/bias_summary.py
from applications.models import Application
#from ai_engine.bias_detection.bias_detector import detect_bias

def get_bias_summary_report():
    summary = {
        "total_applications": 0,
        "flagged_applications": 0,
        "bias_categories": {}
    }

    applications = Application.objects.all()
    summary["total_applications"] = applications.count()

    for app in applications:
        parsed_data = {
            "name": app.parsed_name,
            "email": app.parsed_email,
            "phone": app.parsed_phone,
            "skills": app.parsed_skills or [],
        }

        #flags = detect_bias(parsed_data)

        # if flags:
        #     summary["flagged_applications"] += 1
        #     for flag in flags:
        #         summary["bias_categories"][flag] = summary["bias_categories"].get(flag, 0) + 1

    return summary
