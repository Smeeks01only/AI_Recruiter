# resume_parser/parse_single.py
from .utils.file_loader import load_resume
from .utils.text_cleaner import clean_text
from .utils.extractor import parse_resume

def parse_resume_file(file_path: str, job_role: str):
    """
    Parses a single resume file and returns structured data.
    """
    text = load_resume(file_path)
    cleaned_text = clean_text(text)
    parsed_data = parse_resume(cleaned_text, job_role)
    return parsed_data
