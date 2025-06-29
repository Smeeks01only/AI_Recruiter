# main.py
from .utils.file_loader import load_resume
from .utils.text_cleaner import clean_text
from .utils.extractor import parse_resume
from .utils.exporter import export_to_csv
import os

RESUME_DIR = "./resumes"  # Put PDF/DOCX files here
JOB_ROLE = "AI Researcher"  # Fill this as needed

def main():
    parsed_results = []

    for filename in os.listdir(RESUME_DIR):
        path = os.path.join(RESUME_DIR, filename)
        try:
            text = load_resume(path)
            clean = clean_text(text)
            parsed = parse_resume(clean, JOB_ROLE)
            parsed_results.append(parsed)
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    export_to_csv(parsed_results)
    print("Parsing complete. CSV saved.")

if __name__ == "__main__":
    main()
