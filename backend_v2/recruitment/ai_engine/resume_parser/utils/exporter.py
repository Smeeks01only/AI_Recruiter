# utils/exporter.py
import csv

def export_to_csv(data, filename="parsed_resumes.csv"):
    headers = ["Name", "Skills", "Experience (Years)", "Education", "Certifications",
               "Job Role", "Recruiter Decision", "Projects Count", "AI Score (0-100)"]
    
    with open(filename, "w", newline='', encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()
        for item in data:
            writer.writerow(item)
