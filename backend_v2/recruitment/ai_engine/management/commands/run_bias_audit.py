from django.core.management.base import BaseCommand
from ai_engine.bias_audit import run_bias_audit
import pandas as pd

class Command(BaseCommand):
    help = 'Runs bias detection on sample resumes'

    def handle(self, *args, **kwargs):
        # Sample test data
        df = pd.DataFrame([
            {"Skills": "Python, Django", "Experience (Years)": 3, "Education": "Bachelor", "Certifications": "None", "Job Role": "Backend Developer", "Projects Count": 2, "Gender": "Male"},
            {"Skills": "Python, Django", "Experience (Years)": 3, "Education": "Bachelor", "Certifications": "None", "Job Role": "Backend Developer", "Projects Count": 2, "Gender": "Female"},
        ])
        
        bias_report = run_bias_audit(df, group_column="Gender")
        self.stdout.write("Bias Detection Results:")
        for group, score in bias_report.items():
            self.stdout.write(f"{group}: {score:.2f}")
